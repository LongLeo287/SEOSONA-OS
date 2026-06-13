import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { getRestAuth } from "@/lib/rest-auth"
import { consumeStream } from "@/lib/server/ai/consume-stream"
import { CreditService } from "@/server/api/routers/usage/services/credit.service"
import { UsageService } from "@/server/api/routers/usage/services/usage.service"
import { createSandbox } from "@repo/sandbox-provider"
import { Sandbox } from "@e2b/code-interpreter"
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  streamText,
  UIMessage,
} from "ai-latest"
import { after } from "next/server"
import { getStreamContext, RESPONSE_STREAM_HEADERS } from "./utils"
import { notifyGitHubCompletion } from "@/lib/webhooks/platforms/github/responder"
import { extractSummary } from "@/lib/webhooks/platforms/github/extract-summary"
import { sendDiscordMessage } from "@/lib/webhooks/platforms/discord/responder"
import { updateLinearComment } from "@/lib/webhooks/platforms/linear/responder"
import { getExternalBaseUrl, getChatUrl, POWERED_BY_FOOTER } from "@/lib/webhooks/utils/urls"

type SandboxMessageMetadata = {
  sessionId?: string
  totalCostUsd?: number
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  finalTextId?: string
  durationMs?: number
  resultSubtype?: string
}

type AgentMessage = UIMessage<SandboxMessageMetadata>

const RELAY_URL = "https://relay.an.dev"

export const maxDuration = 800

// Transform file mentions to sandbox paths for the agent
// @[file:owner/repo:path/to/file] → /home/user/repo/path/to/file
function transformFileMentionsToSandboxPaths(text: string): string {
  return text.replace(/@\[file:[^:]+:([^\]]+)\]/g, "/home/user/repo/$1")
}

// Transform messages for sandbox - convert file mentions to actual paths
function transformMessagesForSandbox(messages: AgentMessage[]): AgentMessage[] {
  return messages.map((message) => {
    if (message.role !== "user") return message

    const transformedParts = message.parts.map((part: any) => {
      if (part.type === "text" && typeof part.text === "string") {
        return { ...part, text: transformFileMentionsToSandboxPaths(part.text) }
      }
      return part
    })

    return { ...message, parts: transformedParts }
  })
}

// Convert image URL to base64 (same pattern as canvas)
async function getBase64Image(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer).toString("base64")
}

interface ConvertedImage {
  base64: string
  mediaType: string
  filename?: string
}

// Extract and convert images from the last user message
async function extractAndConvertImages(
  messages: AgentMessage[],
): Promise<ConvertedImage[]> {
  const images: ConvertedImage[] = []

  // Only process last user message (current request)
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.role !== "user") continue

    for (const part of message.parts) {
      if ((part as any).type === "data-image") {
        const imageData = (part as any).data as {
          url: string
          mediaType: string
          filename?: string
        }
        try {
          const base64 = await getBase64Image(imageData.url)
          images.push({
            base64,
            mediaType: imageData.mediaType,
            filename: imageData.filename,
          })
        } catch (error) {
          console.error("[agents/chat] Failed to convert image:", error)
        }
      }
    }
    break // Only process last user message
  }

  return images
}

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Append file/image attachments info to the last user message text
// This makes URLs visible to the agent so it can download files in sandbox
function appendAttachmentsToMessages(messages: AgentMessage[]): AgentMessage[] {
  // Find the last user message
  const lastUserMsgIndex = messages.findLastIndex((m) => m.role === "user")
  if (lastUserMsgIndex === -1) return messages

  const lastMsg = messages[lastUserMsgIndex]
  const imageParts = lastMsg.parts.filter((p: any) => p.type === "data-image")
  const fileParts = lastMsg.parts.filter((p: any) => p.type === "data-file")

  if (imageParts.length === 0 && fileParts.length === 0) return messages

  // Build attachments info text with clear instructions for the agent
  let attachmentsInfo = "\n\n<user-attached-files>"
  attachmentsInfo +=
    "\nThe user has attached files. If they ask you to use these files, download them first with:"
  attachmentsInfo += "\ncurl -sL '<url>' -o '<filename>'"

  // Add files first (more common use case)
  for (const filePart of fileParts) {
    const { url, filename, size } = (filePart as any).data
    const sizeStr = size ? ` (${formatFileSize(size)})` : ""
    attachmentsInfo += `\n- ${filename}${sizeStr}: ${url}`
  }

  // Add images
  for (const imgPart of imageParts) {
    const { url, filename } = (imgPart as any).data
    attachmentsInfo += `\n- ${filename || "image"}: ${url}`
  }

  attachmentsInfo += "\n</user-attached-files>"

  // Append to the text part of the last user message
  const newParts = lastMsg.parts.map((p: any) => {
    if (p.type === "text") {
      return { ...p, text: p.text + attachmentsInfo }
    }
    return p
  })

  const newMessages = [...messages]
  newMessages[lastUserMsgIndex] = { ...lastMsg, parts: newParts }
  return newMessages
}

// Sanitize messages before saving - remove incomplete streaming states (like canvas does)
function sanitizeMessages(messages: AgentMessage[]): AgentMessage[] {
  return messages
    .map((message) => {
      if (message.role !== "assistant") {
        return message
      }

      const filteredParts = message.parts.filter((part: any) => {
        const state = part?.state ?? ""
        if (state.includes("streaming") || state === "input-available") {
          return false
        }
        return true
      })

      if (filteredParts.length === 0) {
        return null as unknown as AgentMessage
      }

      return { ...message, parts: filteredParts }
    })
    .filter(Boolean) as AgentMessage[]
}

export async function POST(req: Request) {
  console.log("[agents/chat] POST request received")

  // Check for internal token first (for webhook/service calls)
  const internalToken = req.headers.get("x-internal-token")
  const isInternalRequest =
    internalToken === process.env.INTERNAL_API_SECRET && !!process.env.INTERNAL_API_SECRET

  let userId: string
  let isDesktopAuth = false

  if (isInternalRequest) {
    // Internal request (from webhook) - get userId from header
    const internalUserId = req.headers.get("x-user-id")
    if (!internalUserId) {
      console.error("[agents/chat] Internal request missing x-user-id header")
      return new Response("Missing x-user-id header", { status: 400 })
    }
    userId = internalUserId
    console.log("[agents/chat] Internal request for user:", userId)
  } else {
    // Support both Clerk and desktop auth
    const auth = await getRestAuth(req)

    if (!auth.userId) {
      return new Response("Unauthorized", { status: 401 })
    }
    userId = auth.userId
    isDesktopAuth = auth.isDesktopAuth
    console.log(
      "[agents/chat] User authenticated:",
      userId,
      isDesktopAuth ? "(desktop)" : "(clerk)",
    )
  }

  // Check usage limits before processing
  try {
    await UsageService.checkUsage(userId)
  } catch (error) {
    if (error instanceof Error && error.message === "Usage limit exceeded") {
      return new Response("Usage limit exceeded", { status: 403 })
    }
    console.error("[agents/chat] Usage check failed:", error)
    return new Response("Internal server error", { status: 500 })
  }

  const body = await req.json()
  const { messages, id }: { messages: AgentMessage[]; id: string } = body

  const sandboxUrl = req.headers.get("sandbox-url")
  const parentChatId = req.headers.get("parent-chat-id")
  const rawSubChatName = req.headers.get("sub-chat-name") || "New Chat"
  // Safe decode - fallback to raw value if decoding fails (e.g., malformed % sequences)
  let subChatName: string
  try {
    subChatName = decodeURIComponent(rawSubChatName)
  } catch {
    subChatName = rawSubChatName
  }
  const subChatMode = req.headers.get("sub-chat-mode") || "agent" // "plan" or "agent"

  // Extract sandboxId from URL (format: https://3003-{sandboxId}.e2b.app)
  const sandboxIdMatch = sandboxUrl?.match(/3003-([^.]+)\.e2b\.app/)
  const sandboxId = sandboxIdMatch?.[1] ?? "unknown"

  // Extract sessionId from messages
  let sessionId: string | undefined
  for (const msg of messages) {
    if (msg.metadata?.sessionId) {
      sessionId = msg.metadata.sessionId
    }
  }

  // Log prefix with all identifiers for easy tracing
  const tag = `[agents/chat] [chat=${parentChatId} sub=${id} sandbox=${sandboxId}]`

  if (!sandboxUrl) {
    return new Response("Missing sandbox-url header", { status: 400 })
  }

  if (!messages || messages.length === 0) {
    return new Response("Missing messages", { status: 400 })
  }

  if (!id) {
    return new Response("Missing id (subChatId)", { status: 400 })
  }

  if (!parentChatId) {
    return new Response("Missing parent-chat-id header", { status: 400 })
  }

  console.log(`${tag} POST received, user=${userId}, sessionId=${sessionId}, mode=${subChatMode}, sandboxUrl=${sandboxUrl}`)

  // Create stream context for resumable streaming
  const streamContext = getStreamContext()
  if (!streamContext) {
    console.error(`${tag} Failed to get stream context`)
    return new Response("Failed to create stream context", { status: 500 })
  }

  // Generate unique stream ID
  const streamId = crypto.randomUUID()
  console.log(`${tag} streamId=${streamId}`)

  // Create TransformStream bridge for piping
  const bridge = new TransformStream<string, string>()

  // Create resumable master stream
  const master = await streamContext.createNewResumableStream(
    streamId,
    () => bridge.readable,
  )

  if (!master) {
    return new Response("Failed to create resumable stream", { status: 500 })
  }

  // UPSERT: Create sub-chat if it doesn't exist (for new tabs) with stream_id
  const updatedTime = new Date()
  await prisma.agentSubChat.upsert({
    where: { id },
    create: {
      id,
      chat_id: parentChatId,
      name: subChatName,
      mode: subChatMode,
      stream_id: streamId,
      messages: sanitizeMessages(messages) as any,
      updated_at: updatedTime,
    },
    update: {
      mode: subChatMode,
      stream_id: streamId,
      messages: sanitizeMessages(messages) as any,
      updated_at: updatedTime,
    },
  })

  // Also update parent chat's updated_at
  await prisma.agentChat.update({
    where: { id: parentChatId },
    data: { updated_at: updatedTime },
  })
  console.log(`${tag} Sub-chat upserted, streamId=${streamId}`)

  // Create finish promise for coordination
  let resolveFinish!: () => void
  const finishPromise = new Promise<void>((r) => {
    resolveFinish = r
  })

  // Tee the master stream - one for response, one for draining
  const [respStream, drainStream] = master.tee()

  // Prepare cancel channel and controller
  const cancelChannel = `rs:cancel:${streamId}`
  const abortController = new AbortController()

  const abortStream = async () => {
    if (abortController.signal.aborted) {
      return
    }

    const reason = new Error("user-cancelled")
    abortController.abort(reason)

    const updatedTime = new Date()
    await prisma.agentSubChat.update({
      where: { id },
      data: { stream_id: null, updated_at: updatedTime },
    })

    // Also update parent chat's updated_at
    await prisma.agentChat.update({
      where: { id: parentChatId },
      data: { updated_at: updatedTime },
    })

    resolveFinish()
  }

  // Background processing via after()
  after(
    Promise.all([
      consumeStream({ stream: drainStream, signal: abortController.signal }),
      finishPromise,
      (async () => {
        console.log(`${tag} Background: subscribing to cancel channel`)
        const sub = await redis.subscribe(cancelChannel)
        console.log(`${tag} Background: subscribed to cancel channel`)
        sub.on("message", () => {
          abortStream().catch((err) => {
            console.error(`${tag} abortStream failed:`, err)
          })
        })

        const t0 = Date.now()
        let phase = "sandbox-wake"
        try {

          // Wake up sandbox if it's paused (Sandbox.connect auto-resumes)
          if (sandboxId && sandboxId !== "unknown") {
            console.log(`${tag} Waking sandbox via Sandbox.connect...`)
            await Sandbox.connect(sandboxId, {
              timeoutMs: 1_800_000, // 30 min
            })
            console.log(`${tag} Sandbox connected in ${Date.now() - t0}ms`)
          }

          phase = "prepare"
          const sandbox = createSandbox({
            sandboxBaseURL: `${sandboxUrl}/api/cc`,
            relayBaseURL: RELAY_URL,
          })

          const model = sandbox("default")

          // Append all attachments (images + files) URLs to user message
          const messagesWithAttachments = appendAttachmentsToMessages(messages)
          const messagesForSandbox = transformMessagesForSandbox(
            messagesWithAttachments,
          )
          const convertedMessages = convertToModelMessages(messagesForSandbox)
          console.log(`${tag} Messages converted: ${convertedMessages.length}`)

          // Extract and convert images to base64
          const convertedImages = await extractAndConvertImages(messages)
          console.log(`${tag} Images: ${convertedImages.length}, sessionId=${sessionId}`)

          // Build sandbox provider options
          const sandboxOptions: {
            sessionId?: string
            images?: ConvertedImage[]
          } = {}
          if (sessionId) {
            sandboxOptions.sessionId = sessionId
          }
          if (convertedImages.length > 0) {
            sandboxOptions.images = convertedImages
          }

          const result = streamText({
            model,
            messages: convertedMessages,
            providerOptions:
              Object.keys(sandboxOptions).length > 0
                ? ({ sandbox: sandboxOptions } as any)
                : undefined,
          })
          phase = "streamText"
          console.log(`${tag} streamText called, prepTime=${Date.now() - t0}ms`)
          const uiStream = createUIMessageStream<AgentMessage>({
            execute: async ({ writer }) => {
              phase = "streaming"
              console.log(`${tag} UI stream execute started`)
              writer.write({ type: "start" })
              let partCount = 0
              // Track the last text block ID for final response marking
              let lastTextId: string | undefined
              // Track tool call IDs to guard against orphaned tool-results
              const seenToolCalls = new Set<string>()
              for await (const part of result.fullStream) {
                partCount++
                if (partCount === 1) {
                  console.log(`${tag} First stream part: ${part.type}, timeToFirst=${Date.now() - t0}ms`)
                }
                // Check if aborted
                if (abortController.signal.aborted) {
                  break
                }

                if (part.type === "tool-call") {
                  seenToolCalls.add(part.toolCallId)
                  writer.write({
                    type: "tool-input-available",
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    input: part.input,
                  })
                } else if (part.type === "tool-result") {
                  if (!seenToolCalls.has(part.toolCallId)) {
                    console.warn(`${tag} Skipping orphaned tool-result: ${part.toolCallId}`)
                  } else {
                    writer.write({
                      type: "tool-output-available",
                      toolCallId: part.toolCallId,
                      output: part.output,
                    })
                  }
                } else if (part.type === "text-delta") {
                  writer.write({
                    type: "text-delta",
                    id: part.id,
                    delta: part.text,
                  })
                } else if (part.type === "text-start") {
                  writer.write({ type: "text-start", id: part.id })
                } else if (part.type === "text-end") {
                  // Track the last text ID for final response marking
                  lastTextId = part.id
                  writer.write({ type: "text-end", id: part.id })
                } else if (part.type === "tool-input-start") {
                  seenToolCalls.add(part.id)
                  writer.write({
                    type: "tool-input-start",
                    toolCallId: part.id,
                    toolName: part.toolName,
                  })
                } else if (part.type === "tool-input-delta") {
                  writer.write({
                    type: "tool-input-delta",
                    toolCallId: part.id,
                    inputTextDelta: part.delta,
                  })
                } else if (part.type === "start-step") {
                  writer.write({ type: "start-step" })
                } else if (part.type === "finish-step") {
                  const sandboxMeta = part.providerMetadata?.sandbox as
                    | SandboxMessageMetadata
                    | undefined

                  if (sandboxMeta) {
                    writer.write({
                      type: "message-metadata",
                      messageMetadata: {
                        sessionId: sandboxMeta.sessionId,
                        totalCostUsd: sandboxMeta.totalCostUsd,
                        inputTokens: sandboxMeta.inputTokens,
                        outputTokens: sandboxMeta.outputTokens,
                        totalTokens: sandboxMeta.totalTokens,
                        durationMs: sandboxMeta.durationMs,
                        resultSubtype: sandboxMeta.resultSubtype,
                      },
                    })
                  }

                  writer.write({ type: "finish-step" })
                } else if (part.type === "finish") {
                  // Also check finish event for token data (in case finish-step didn't have it)
                  // Cast to any since our sandbox provider adds providerMetadata
                  const finishMeta = (part as any).providerMetadata?.sandbox as
                    | SandboxMessageMetadata
                    | undefined

                  // Always emit message-metadata with finalTextId if we tracked a lastTextId
                  // finishMeta may not have providerMetadata (AI SDK doesn't forward it from finish events)
                  writer.write({
                    type: "message-metadata",
                    messageMetadata: {
                      sessionId: finishMeta?.sessionId,
                      totalCostUsd: finishMeta?.totalCostUsd,
                      inputTokens: finishMeta?.inputTokens,
                      outputTokens: finishMeta?.outputTokens,
                      totalTokens: finishMeta?.totalTokens,
                      durationMs: finishMeta?.durationMs,
                      resultSubtype: finishMeta?.resultSubtype,
                      // Use our tracked lastTextId instead of finishMeta.finalTextId
                      finalTextId: lastTextId,
                    },
                  })

                  writer.write({ type: "finish" })
                } else if (part.type === "error") {
                  console.error(`${tag} Stream error:`, part.error)
                  writer.write({
                    type: "error",
                    errorText:
                      part.error instanceof Error
                        ? part.error.message
                        : String(part.error),
                  })
                }
              }
              console.log(`${tag} Stream complete, parts=${partCount}, totalTime=${Date.now() - t0}ms`)
            },
            onFinish: async ({ messages: streamMessages }) => {
              const isAborted = abortController.signal.aborted
              console.log(`${tag} onFinish called, messages=${streamMessages.length}, aborted=${isAborted}, elapsed=${Date.now() - t0}ms`)
              try {

                // Get the last assistant message as the response
                const responseMessage =
                  streamMessages[streamMessages.length - 1]

                if (responseMessage) {
                  // Clean the responseMessage by removing input-streaming parts if aborted
                  let cleanedResponseMessage = responseMessage
                  if (isAborted) {
                    const cleanedParts =
                      responseMessage.parts?.filter(
                        (part: any) => part.state !== "input-streaming",
                      ) || []
                    cleanedResponseMessage = {
                      ...responseMessage,
                      parts: cleanedParts,
                    }
                  }

                  const allMessages = sanitizeMessages([
                    ...messages,
                    cleanedResponseMessage as AgentMessage,
                  ])

                  const updatedTime = new Date()

                  await prisma.agentSubChat.update({
                    where: { id },
                    data: {
                      stream_id: null, // Clear stream_id when done
                      messages: allMessages as any,
                      updated_at: updatedTime,
                    },
                  })

                  // Also update parent chat's updated_at for correct sorting in sidebar
                  await prisma.agentChat.update({
                    where: { id: parentChatId },
                    data: {
                      updated_at: updatedTime,
                    },
                  })

                  // Consume credits based on actual USD cost from Claude Code backend
                  // Only consume if using personal/platform credits (not team's own Claude Code OAuth)
                  const metadata = responseMessage.metadata as
                    | SandboxMessageMetadata
                    | undefined
                  const totalCostUsd = metadata?.totalCostUsd || 0
                  if (totalCostUsd > 0) {
                    const parentChat = await prisma.agentChat.findUnique({
                      where: { id: parentChatId },
                      select: { credit_source: true },
                    })

                    if (parentChat?.credit_source === "personal") {
                      const creditsNeeded =
                        CreditService.calculateCreditsFromUsd(totalCostUsd)
                      await CreditService.consumeCredits(userId, creditsNeeded)
                      console.log(`${tag} Credits consumed: cost=$${totalCostUsd}, credits=${creditsNeeded}`)
                    } else {
                      console.log(`${tag} Skipping credits - claude_code OAuth`)
                    }
                  }

                  // Notify GitHub if this chat was triggered from a GitHub webhook
                  try {
                    const chatForNotification = await prisma.agentChat.findUnique({
                      where: { id: parentChatId },
                      select: { meta: true },
                    })

                    const chatMeta = chatForNotification?.meta as Record<string, unknown> | null
                    const externalBaseUrl = getExternalBaseUrl()

                    if (chatMeta?.source === "github") {
                      console.log(`${tag} GitHub source detected, notifying...`)

                      // Update IntegrationTask status
                      await prisma.integrationTask.updateMany({
                        where: { chat_id: parentChatId },
                        data: { status: "completed" },
                      })

                      // Notify GitHub
                      const summary = extractSummary(allMessages as any)
                      const automationAddToInbox = chatMeta.automation_add_to_inbox as boolean | undefined
                      const automationRespondToTrigger = chatMeta.automation_respond_to_trigger as boolean | undefined
                      const githubViewUrl = getChatUrl(parentChatId, automationAddToInbox)

                      // Only notify GitHub if respond_to_trigger is enabled (default true for backward compat)
                      if (automationRespondToTrigger !== false) {
                        await notifyGitHubCompletion(
                          chatMeta.github_installation_id as string,
                          chatMeta.github_repo as string,
                          chatMeta.github_issue_number as number,
                          summary,
                          githubViewUrl,
                          chatMeta.github_initial_comment_id as number | undefined
                        )
                        console.log(`${tag} GitHub notification sent`)
                      } else {
                        console.log(`${tag} GitHub respond_to_trigger disabled`)
                      }
                    }

                    // Discord notification
                    if (chatMeta?.source === "discord") {
                      console.log(`${tag} Discord source detected, notifying...`)

                      // Update IntegrationTask status
                      await prisma.integrationTask.updateMany({
                        where: { chat_id: parentChatId },
                        data: { status: "completed" },
                      })

                      // Notify Discord channel
                      const discordData = chatMeta.discord as { guildId: string; channelId: string } | undefined
                      if (discordData?.channelId) {
                        const summary = extractSummary(allMessages as any)
                        await sendDiscordMessage(
                          discordData.channelId,
                          `✅ **1Code** completed the task!\n\n**Summary:** ${summary.slice(0, 500)}${summary.length > 500 ? "..." : ""}\n\n[View full details](${getChatUrl(parentChatId)})`
                        )
                        console.log(`${tag} Discord notification sent`)
                      }
                    }

                    // Linear notification - update existing comment
                    if (chatMeta?.source === "linear") {
                      console.log(`${tag} Linear source detected, updating comment...`)

                      // Update IntegrationTask status
                      await prisma.integrationTask.updateMany({
                        where: { chat_id: parentChatId },
                        data: { status: "completed" },
                      })

                      // Update the existing Linear comment
                      const linearCommentId = chatMeta.linear_comment_id as string | undefined
                      const linearRespondToTrigger = chatMeta.automation_respond_to_trigger as boolean | undefined

                      // Only update comment if respond_to_trigger is enabled (default true for backward compat)
                      if (linearRespondToTrigger !== false && linearCommentId) {
                        const parentChat = await prisma.agentChat.findUnique({
                          where: { id: parentChatId },
                          select: { team_id: true },
                        })

                        if (parentChat?.team_id) {
                          const summary = extractSummary(allMessages as any)
                          const repository = chatMeta.repository as string
                          const addToInbox = chatMeta.add_to_inbox as boolean | undefined
                          const viewUrl = getChatUrl(parentChatId, addToInbox)

                          await updateLinearComment(
                            parentChat.team_id,
                            linearCommentId,
                            `**Task completed.**\n\n` +
                              `${summary.slice(0, 1000)}${summary.length > 1000 ? "..." : ""}\n\n` +
                              `**Repository:** \`${repository}\`\n\n` +
                              `---\n` +
                              `[View full details](${viewUrl})\n\n` +
                              POWERED_BY_FOOTER
                          )
                          console.log(`${tag} Linear comment updated`)
                        }
                      } else if (linearRespondToTrigger === false) {
                        console.log(`${tag} Linear respond_to_trigger disabled`)
                      } else {
                        console.log(`${tag} No Linear comment ID found`)
                      }
                    }

                    // API Public API task completion
                    if (chatMeta?.source === "api") {
                      console.log(`${tag} API source detected, updating task status...`)

                      await prisma.integrationTask.updateMany({
                        where: { chat_id: parentChatId },
                        data: { status: "completed" },
                      })

                      console.log(`${tag} API task marked as completed`)
                    }
                  } catch (notifyError) {
                    console.error(`${tag} Failed to notify platform:`, notifyError)
                    // Don't throw - notification failure shouldn't break the flow
                  }
                } else {
                  // No response message, just clear stream_id
                  const updatedTime = new Date()

                  await prisma.agentSubChat.update({
                    where: { id },
                    data: { stream_id: null, updated_at: updatedTime },
                  })

                  // Also update parent chat's updated_at
                  await prisma.agentChat.update({
                    where: { id: parentChatId },
                    data: {
                      updated_at: updatedTime,
                    },
                  })
                }
              } catch (saveError) {
                console.error(`${tag} Failed to save messages:`, saveError)
              } finally {
                resolveFinish()
              }
            },
          })

          // Pipe UI stream through JSON to SSE transform to the bridge
          console.log(`${tag} Starting pipe to bridge`)
          await uiStream
            .pipeThrough(new JsonToSseTransformStream())
            .pipeTo(bridge.writable, { signal: abortController.signal })
          console.log(`${tag} Pipe to bridge complete`)
        } catch (error: unknown) {
          // user-cancelled is expected when user stops the stream
          const isUserCancelled =
            error instanceof Error && error.message === "user-cancelled"
          if (!isUserCancelled) {
            console.error(`${tag} CAUGHT ERROR in phase=${phase}, elapsed=${Date.now() - t0}ms:`, error)

            // Mark API-sourced tasks as failed
            try {
              const failedChat = await prisma.agentChat.findUnique({
                where: { id: parentChatId },
                select: { meta: true },
              })
              const failedMeta = failedChat?.meta as Record<string, unknown> | null
              if (failedMeta?.source === "api") {
                await prisma.integrationTask.updateMany({
                  where: { chat_id: parentChatId },
                  data: { status: "failed" },
                })
                console.log(`${tag} API task marked as failed`)
              }
            } catch {
              // Ignore - best effort
            }
          }
          await abortStream().catch(() => {
            // Ignore errors during abort - stream may already be closed
          })
        } finally {
          await sub.unsubscribe()
        }
      })(),
    ]),
  )

  // Return immediately with resumable stream
  console.log(`${tag} Returning response`)
  return new Response(respStream, {
    headers: RESPONSE_STREAM_HEADERS,
  })
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subChatId = searchParams.get("id")

    if (!subChatId) {
      return new Response("Missing id", { status: 400 })
    }

    // Support both Clerk and desktop auth
    const { userId } = await getRestAuth(request)
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get stream_id and parent chat_id from DB
    const subChat = await prisma.agentSubChat.findUnique({
      where: { id: subChatId },
      select: { stream_id: true, chat_id: true },
    })
    const streamId = subChat?.stream_id
    const parentChatId = subChat?.chat_id

    // Clear stream_id in DB
    const updatedTime = new Date()
    await prisma.agentSubChat.update({
      where: { id: subChatId },
      data: { stream_id: null, updated_at: updatedTime },
    })

    // Also update parent chat's updated_at
    if (parentChatId) {
      await prisma.agentChat.update({
        where: { id: parentChatId },
        data: { updated_at: updatedTime },
      })
    }

    // Publish cancellation signal via Redis
    if (streamId) {
      await redis.publish(`rs:cancel:${streamId}`, "1")
    }

    return new Response(null, { status: 204 })
  } catch (e) {
    console.error("[agents/chat] DELETE cancel failed:", e)
    return new Response("Internal server error", { status: 500 })
  }
}
