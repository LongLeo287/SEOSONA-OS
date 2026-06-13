import type {
  LanguageModelV2StreamPart,
  LanguageModelV2FinishReason,
  LanguageModelV2Usage,
} from "@ai-sdk/provider"

// Types based on real Claude Agent SDK messages
type ToolUseContent = {
  type: "tool_use"
  id: string
  name: string
  input: Record<string, unknown>
}

type TextContent = {
  type: "text"
  text: string
}

type ToolResultContent = {
  type: "tool_result"
  tool_use_id: string
  content: string
  is_error?: boolean
}

type AssistantMessage = {
  role: "assistant"
  content: Array<ToolUseContent | TextContent>
  stop_reason: string | null
}

type UserMessage = {
  role: "user"
  content: Array<ToolResultContent | { type: string; [key: string]: unknown }>
}

type SDKMessage = {
  type: string
  session_id?: string
  uuid?: string
  parent_tool_use_id?: string | null
  // For stream_event
  event?: {
    type: string
    index?: number
    content_block?: { type: string; id?: string; name?: string; text?: string }
    delta?: {
      type: string
      text?: string
      partial_json?: string
      thinking?: string
    }
    [key: string]: unknown
  }
  // For assistant/user messages
  message?: AssistantMessage | UserMessage
  // For tool_use_result extra data
  tool_use_result?: {
    type?: string
    stdout?: string
    stderr?: string
    file?: { filePath: string; content: string }
    [key: string]: unknown
  }
  // For result
  subtype?: string
  result?: string
  usage?: { input_tokens: number; output_tokens: number }
  num_turns?: number
  duration_ms?: number
  total_cost_usd?: number
  modelUsage?: Record<string, unknown>
  // For tool_progress
  tool_name?: string
  tool_use_id?: string
  elapsed_time_seconds?: number
  // For system
  tools?: string[]
  model?: string
  // For error
  error?: string
  [key: string]: unknown
}

// Debug mode - set to true to enable logging
const DEBUG = false
const DEBUG_FILES = false

export function createStreamTransformer(
  generateId: () => string,
): TransformStream<Uint8Array, LanguageModelV2StreamPart> {
  let sessionId: string | undefined
  let textStarted = false
  let currentTextId: string | undefined
  let buffer = ""
  let finishReason: LanguageModelV2FinishReason = "unknown"
  let hasToolCalls = false
  let usage: LanguageModelV2Usage = {
    inputTokens: undefined,
    outputTokens: undefined,
    totalTokens: undefined,
  }
  let messageCount = 0

  // Track cost data from result message
  let totalCostUsd: number | undefined

  // Track duration and result status from result message
  let durationMs: number | undefined
  let resultSubtype: string | undefined
  let models: string[] | undefined

  // Track the last completed text block ID for final response marking
  let lastTextBlockId: string | undefined

  // Track current streaming tool call
  let currentToolCallId: string | undefined
  let currentToolOriginalId: string | undefined
  let currentToolName: string | undefined
  let accumulatedToolInput = ""

  // Track which assistant content blocks were already emitted for the
  // current Claude message so we can dedupe the trailing assistant snapshot
  // without dropping content when only message_start/message_stop were streamed.
  let emittedTextForCurrentMessage = false
  const emittedToolUseIdsForCurrentMessage = new Set<string>()

  // Track parent tool context for nested tools
  // Only updated when message explicitly has parent_tool_use_id
  let currentParentToolUseId: string | null = null

  // Map original toolCallId -> composite toolCallId (for tool-result matching)
  const toolIdMapping = new Map<string, string>()

  // Helper to create composite toolCallId: "parentId:childId" or just "childId"
  const makeCompositeId = (
    originalId: string,
    parentId: string | null,
  ): string => {
    if (parentId) {
      return `${parentId}:${originalId}`
    }
    return originalId
  }

  // Debug: collect input and output for comparison
  const debugInput: unknown[] = []
  const debugOutput: unknown[] = []
  const debugTimestamp = Date.now()

  const saveDebugFiles = () => {
    if (!DEBUG_FILES) return
    try {
      // Dynamic require to avoid TS issues - this only runs on server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fs = (globalThis as any).require?.("fs") || eval("require")("fs")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const path =
        (globalThis as any).require?.("path") || eval("require")("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cwd = (globalThis as any).process?.cwd?.() || "."

      const debugDir = path.join(cwd, "packages/sandbox-provider/debug-logs")
      fs.mkdirSync(debugDir, { recursive: true })

      fs.writeFileSync(
        path.join(debugDir, `input-${debugTimestamp}.json`),
        JSON.stringify(debugInput, null, 2),
      )
      fs.writeFileSync(
        path.join(debugDir, `output-${debugTimestamp}.json`),
        JSON.stringify(debugOutput, null, 2),
      )
      console.log(
        `[StreamTransformer] Debug files saved to: ${debugDir}/${debugTimestamp}`,
      )
    } catch (e) {
      console.error("[StreamTransformer] Failed to save debug files:", e)
    }
  }

  const textDecoder = new TextDecoder()

  // Helper to get providerMetadata with sessionId
  const getProviderMetadata = () => {
    if (sessionId) {
      return { sandbox: { sessionId } }
    }
    return undefined
  }

  // Logging helper
  const log = (category: string, data: unknown) => {
    if (DEBUG) {
      console.log(
        `[StreamTransformer][${category}]`,
        JSON.stringify(data, null, 2),
      )
    }
  }

  const emit = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
    part: LanguageModelV2StreamPart,
  ) => {
    if (DEBUG_FILES) {
      debugOutput.push(part)
    }
    controller.enqueue(part)
  }

  const trackInput = (msg: SDKMessage) => {
    if (!DEBUG_FILES) return
    debugInput.push(msg)
  }

  // End current text block if active
  const endTextBlock = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
  ) => {
    if (textStarted && currentTextId) {
      // Save the ID before clearing - this will be the last text block ID
      lastTextBlockId = currentTextId
      emit(controller, {
        type: "text-end",
        id: currentTextId,
        providerMetadata: getProviderMetadata(),
      })
      textStarted = false
      currentTextId = undefined
    }
  }

  // End current tool input if active
  const endToolInput = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
  ) => {
    if (currentToolCallId) {
      emit(controller, {
        type: "tool-input-end",
        id: currentToolCallId,
        providerMetadata: getProviderMetadata(),
      })
      currentToolCallId = undefined
      currentToolOriginalId = undefined
      currentToolName = undefined
      accumulatedToolInput = ""
    }
  }

  return new TransformStream({
    start(controller) {
      log("START", { message: "Stream transformer started" })
      emit(controller, { type: "stream-start", warnings: [] })
    },

    transform(chunk, controller) {
      const chunkText = textDecoder.decode(chunk, { stream: true })
      buffer += chunkText

      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue

        const data = line.slice(6)
        if (data === "[DONE]") {
          log("SSE", { event: "[DONE]" })
          continue
        }

        try {
          const msg: SDKMessage = JSON.parse(data)
          messageCount++
          trackInput(msg)

          // Capture sessionId from any message that has it
          if (msg.session_id && !sessionId) {
            sessionId = msg.session_id
            log("SESSION", { captured_session_id: sessionId })
          }

          // Track parent_tool_use_id for nested tools
          // Only update when explicitly present (don't reset on messages without it)
          if (msg.parent_tool_use_id !== undefined) {
            currentParentToolUseId = msg.parent_tool_use_id
            // Only log when parent is actually set (not null)
            if (currentParentToolUseId) {
              log("PARENT_CONTEXT", {
                parent_tool_use_id: currentParentToolUseId,
              })
            }
          }

          switch (msg.type) {
            // ===== SYSTEM MESSAGE =====
            case "system":
              log("SYSTEM", {
                subtype: msg.subtype,
                tools: msg.tools,
                model: msg.model,
              })
              break

            // ===== STREAMING EVENTS (token-by-token) =====
            case "stream_event": {
              const event = msg.event
              if (!event) break

              if (event.type === "message_start") {
                emittedTextForCurrentMessage = false
                emittedToolUseIdsForCurrentMessage.clear()
              }

              // Text block start
              if (
                event.type === "content_block_start" &&
                event.content_block?.type === "text"
              ) {
                endTextBlock(controller)
                endToolInput(controller)
                currentTextId = generateId()
                emit(controller, {
                  type: "text-start",
                  id: currentTextId,
                  providerMetadata: getProviderMetadata(),
                })
                textStarted = true
                log("TEXT_START", { id: currentTextId })
              }

              // Text delta
              if (
                event.type === "content_block_delta" &&
                event.delta?.type === "text_delta"
              ) {
                if (!textStarted) {
                  endToolInput(controller)
                  currentTextId = generateId()
                  emit(controller, {
                    type: "text-start",
                    id: currentTextId,
                    providerMetadata: getProviderMetadata(),
                  })
                  textStarted = true
                }
                emit(controller, {
                  type: "text-delta",
                  id: currentTextId!,
                  delta: event.delta.text || "",
                })
                emittedTextForCurrentMessage = true
              }

              // Content block stop
              if (event.type === "content_block_stop") {
                if (textStarted) {
                  endTextBlock(controller)
                }
                if (currentToolCallId) {
                  // Emit complete tool-call with accumulated input
                  // currentToolCallId is already the composite ID
                  log("TOOL_CALL_COMPLETE_STREAM", {
                    compositeId: currentToolCallId,
                    toolName: currentToolName,
                    inputLength: accumulatedToolInput.length,
                  })
                  emit(controller, {
                    type: "tool-call",
                    toolCallId: currentToolCallId,
                    toolName: currentToolName || "unknown",
                    input: accumulatedToolInput,
                    providerMetadata: getProviderMetadata(),
                  })
                  if (currentToolOriginalId) {
                    emittedToolUseIdsForCurrentMessage.add(currentToolOriginalId)
                  }
                  hasToolCalls = true
                  endToolInput(controller)
                }
              }

              // Tool use start (streaming)
              if (
                event.type === "content_block_start" &&
                event.content_block?.type === "tool_use"
              ) {
                endTextBlock(controller)
                endToolInput(controller)

                const originalId = event.content_block.id || generateId()
                currentToolOriginalId = originalId
                currentToolCallId = makeCompositeId(
                  originalId,
                  currentParentToolUseId,
                )
                currentToolName = event.content_block.name || "unknown"
                accumulatedToolInput = ""

                // Store mapping for tool-result lookup
                toolIdMapping.set(originalId, currentToolCallId)

                log("TOOL_INPUT_START", {
                  originalId,
                  compositeId: currentToolCallId,
                  toolName: currentToolName,
                  parentToolUseId: currentParentToolUseId,
                })

                emit(controller, {
                  type: "tool-input-start",
                  id: currentToolCallId,
                  toolName: currentToolName,
                  providerMetadata: getProviderMetadata(),
                })
              }

              // Tool input delta
              if (
                event.delta?.type === "input_json_delta" &&
                currentToolCallId
              ) {
                const partialJson = event.delta.partial_json || ""
                accumulatedToolInput += partialJson

                log("TOOL_INPUT_DELTA", {
                  id: currentToolCallId,
                  delta: partialJson,
                })

                emit(controller, {
                  type: "tool-input-delta",
                  id: currentToolCallId,
                  delta: partialJson,
                  providerMetadata: getProviderMetadata(),
                })
              }

              // Thinking/reasoning streaming
              if (event.delta?.type === "thinking_delta") {
                const reasoningId = generateId()
                emit(controller, {
                  type: "reasoning-delta",
                  id: reasoningId,
                  delta: String(event.delta.thinking || ""),
                  providerMetadata: getProviderMetadata(),
                })
              }

              break
            }

            // ===== ASSISTANT MESSAGE (complete, often with tool_use) =====
            case "assistant": {
              const assistantMsg = msg.message as AssistantMessage
              if (!assistantMsg?.content) break

              log("ASSISTANT", {
                content_types: assistantMsg.content.map((c) => c.type),
                stop_reason: assistantMsg.stop_reason,
                emittedTextForCurrentMessage,
                emittedToolUseIdsForCurrentMessage: Array.from(emittedToolUseIdsForCurrentMessage),
              })

              for (const content of assistantMsg.content) {
                // Handle text content from assistant message
                // (when continuous streaming is disabled, text only arrives here)
                if (content.type === "text") {
                  if (emittedTextForCurrentMessage) {
                    continue
                  }

                  endToolInput(controller)

                  // Start new text block if needed
                  if (!textStarted) {
                    currentTextId = generateId()
                    emit(controller, {
                      type: "text-start",
                      id: currentTextId,
                      providerMetadata: getProviderMetadata(),
                    })
                    textStarted = true
                    log("TEXT_START_FROM_ASSISTANT", { id: currentTextId })
                  }

                  // Emit the full text as a single delta
                  emit(controller, {
                    type: "text-delta",
                    id: currentTextId!,
                    delta: content.text,
                  })
                  emittedTextForCurrentMessage = true

                  log("TEXT_FROM_ASSISTANT", {
                    id: currentTextId,
                    textLength: content.text.length
                  })
                }

                if (content.type === "tool_use") {
                  if (currentToolOriginalId === content.id) {
                    // Some SDK versions send the assistant snapshot before
                    // content_block_stop. Keep the streamed tool path, but fill
                    // in the final JSON if the incremental stream did not.
                    if (!accumulatedToolInput) {
                      accumulatedToolInput = JSON.stringify(content.input)
                    }
                    continue
                  }

                  if (emittedToolUseIdsForCurrentMessage.has(content.id)) {
                    continue
                  }

                  endTextBlock(controller)
                  endToolInput(controller)

                  const compositeId = makeCompositeId(
                    content.id,
                    currentParentToolUseId,
                  )

                  // Store mapping for tool-result lookup
                  toolIdMapping.set(content.id, compositeId)

                  log("TOOL_CALL", {
                    originalId: content.id,
                    compositeId,
                    toolName: content.name,
                    input_keys: Object.keys(content.input || {}),
                    parentToolUseId: currentParentToolUseId,
                  })

                  // Emit complete tool call
                  // input must be stringified JSON per AI SDK spec
                  emit(controller, {
                    type: "tool-call",
                    toolCallId: compositeId,
                    toolName: content.name,
                    input: JSON.stringify(content.input),
                    providerMetadata: getProviderMetadata(),
                  })
                  emittedToolUseIdsForCurrentMessage.add(content.id)
                  hasToolCalls = true
                }
              }
              break
            }

            // ===== USER MESSAGE (tool results) =====
            case "user": {
              const userMsg = msg.message as UserMessage
              if (!userMsg?.content) break

              for (const content of userMsg.content) {
                if (content.type === "tool_result") {
                  const toolResult = content as ToolResultContent

                  // Lookup composite ID from mapping, fallback to original
                  const compositeId =
                    toolIdMapping.get(toolResult.tool_use_id) ||
                    toolResult.tool_use_id

                  // Use msg.tool_use_result (clean structured data) instead of
                  // toolResult.content (ugly formatted text)
                  const cleanResult = msg.tool_use_result
                    ? JSON.parse(JSON.stringify(msg.tool_use_result))
                    : toolResult.content

                  log("TOOL_RESULT", {
                    originalId: toolResult.tool_use_id,
                    compositeId,
                    has_tool_use_result: !!msg.tool_use_result,
                    is_error: toolResult.is_error,
                  })

                  emit(controller, {
                    type: "tool-result",
                    toolCallId: compositeId,
                    toolName: "unknown",
                    result: cleanResult,
                    isError: toolResult.is_error,
                    providerMetadata: getProviderMetadata(),
                  })
                }
              }
              break
            }

            // ===== TOOL PROGRESS =====
            case "tool_progress":
              log("TOOL_PROGRESS", {
                tool_name: msg.tool_name,
                tool_use_id: msg.tool_use_id,
                elapsed_time_seconds: msg.elapsed_time_seconds,
              })
              // Could emit as custom event for UI to show progress
              break

            // ===== RESULT (final) =====
            case "result": {
              log("RESULT", {
                subtype: msg.subtype,
                num_turns: msg.num_turns,
                duration_ms: msg.duration_ms,
                total_cost_usd: msg.total_cost_usd,
                usage: msg.usage,
              })

              endTextBlock(controller)
              endToolInput(controller)

              // Capture cost data
              if (msg.total_cost_usd !== undefined) {
                totalCostUsd = msg.total_cost_usd
              }

              // Capture duration and result status
              if (msg.duration_ms !== undefined) {
                durationMs = msg.duration_ms
              }
              if (msg.subtype !== undefined) {
                resultSubtype = msg.subtype
              }

              // Determine finish reason
              if (msg.subtype === "success") {
                finishReason = hasToolCalls ? "tool-calls" : "stop"
              } else {
                finishReason = "error"
              }

              usage = {
                inputTokens: msg.usage?.input_tokens,
                outputTokens: msg.usage?.output_tokens,
                totalTokens: msg.usage
                  ? msg.usage.input_tokens + msg.usage.output_tokens
                  : undefined,
              }

              if (msg.modelUsage && typeof msg.modelUsage === "object" && !Array.isArray(msg.modelUsage)) {
                const modelKeys = Object.keys(msg.modelUsage).filter((key) => key.length > 0)
                if (modelKeys.length > 0) {
                  models = modelKeys
                }
              }
              break
            }

            // ===== DONE =====
            case "done":
              log("DONE", { message: "Stream done signal received" })
              break

            // ===== ERROR =====
            case "error":
              log("ERROR", { error: msg.error })
              emit(controller, {
                type: "error",
                error: new Error(msg.error || "Unknown sandbox error"),
              })
              break

            default:
              log("UNKNOWN_TYPE", { type: msg.type })
          }
        } catch (e) {
          log("PARSE_ERROR", { error: String(e), raw_data: data.slice(0, 200) })
        }
      }
    },

    flush(controller) {
      log("FLUSH", {
        textStarted,
        sessionId,
        finishReason,
        hasToolCalls,
        usage,
        totalCostUsd,
        lastTextBlockId,
        totalMessages: messageCount,
      })

      endTextBlock(controller)
      endToolInput(controller)

      // Build metadata for finish event
      const metadata: {
        sessionId?: string
        totalCostUsd?: number
        inputTokens?: number
        outputTokens?: number
        totalTokens?: number
        finalTextId?: string
        durationMs?: number
        resultSubtype?: string
        models?: string[]
      } = {}
      if (sessionId) metadata.sessionId = sessionId
      if (totalCostUsd !== undefined) metadata.totalCostUsd = totalCostUsd
      if (usage.inputTokens !== undefined)
        metadata.inputTokens = usage.inputTokens
      if (usage.outputTokens !== undefined)
        metadata.outputTokens = usage.outputTokens
      if (usage.totalTokens !== undefined)
        metadata.totalTokens = usage.totalTokens
      if (lastTextBlockId) metadata.finalTextId = lastTextBlockId
      if (durationMs !== undefined) metadata.durationMs = durationMs
      if (resultSubtype) metadata.resultSubtype = resultSubtype
      if (models && models.length > 0) metadata.models = models

      const hasMetadata = Object.keys(metadata).length > 0

      // Emit finish event with providerMetadata
      // The route will extract this and emit message-metadata chunk
      emit(controller, {
        type: "finish",
        finishReason,
        usage,
        providerMetadata: hasMetadata ? { sandbox: metadata } : undefined,
      })

      // Save debug files at the end
      saveDebugFiles()

      log("COMPLETE", {
        message: "Stream transformer finished",
        totalMessages: messageCount,
      })
    },
  })
}
