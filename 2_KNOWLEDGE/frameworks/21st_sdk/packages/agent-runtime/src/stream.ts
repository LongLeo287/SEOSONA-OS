import type { AgentConfig } from "@21st-sdk/agent"
import { spanManager } from "./tracing.js"

function getRelayUrl() {
  return process.env.RELAY_URL || "https://relay.an.dev"
}

export async function publish(
  streamId: string,
  message: object,
) {
  try {
    const response = await fetch(`${getRelayUrl()}/publish/${streamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error(
        `[${streamId.slice(0, 8)}] Failed to publish: relay returned ${response.status}${errorText ? ` - ${errorText}` : ""}`,
      )
    }
  } catch (error) {
    console.error(`[${streamId.slice(0, 8)}] Failed to publish:`, error)
  }
}

export async function publishRuntimeError(streamId: string, message: string) {
  await publish(streamId, { type: "error", error: message })
}

const FLUSH_INTERVAL_MS = 50
const TERMINAL_TYPES = new Set(["done", "result", "error"])

// --- LLM span tracking (Braintrust pattern) ---
// Track by message.id changes in assistant messages, not stream_events

let llmSpanCounter = 0
let currentMessageId: string | undefined
let currentMessageStartTime = 0
let currentMessages: any[] = []
let accumulatedOutputTokens = 0

function getNumberProp(obj: any, key: string): number | undefined {
  const v = obj?.[key]
  return typeof v === "number" ? v : undefined
}

function extractUsage(message: any): Record<string, number> {
  const usage = message.type === "assistant" ? message.message?.usage : message.usage
  if (!usage || typeof usage !== "object") return {}
  const metrics: Record<string, number> = {}
  const input = getNumberProp(usage, "input_tokens")
  if (input !== undefined) metrics["llm.input_tokens"] = input
  const output = getNumberProp(usage, "output_tokens")
  if (output !== undefined) metrics["llm.output_tokens"] = output
  const cacheRead = getNumberProp(usage, "cache_read_input_tokens")
  if (cacheRead) metrics["llm.cache_read_input_tokens"] = cacheRead
  const cacheCreate = getNumberProp(usage, "cache_creation_input_tokens")
  if (cacheCreate) metrics["llm.cache_creation_input_tokens"] = cacheCreate
  return metrics
}

function truncate(val: unknown, max = 10_000): string {
  const s = typeof val === "string" ? val : JSON.stringify(val)
  return s?.slice(0, max) ?? ""
}

function extractLLMOutput(messages: any[]): string | undefined {
  const outputs: any[] = []
  for (const m of messages) {
    const content = m.message?.content
    const role = m.message?.role
    if (role && content !== undefined) {
      outputs.push({ role, content })
    }
  }
  return outputs.length > 0 ? truncate(outputs) : undefined
}

function createLLMSpan() {
  try {
    if (currentMessages.length === 0) return
    const lastMsg = currentMessages[currentMessages.length - 1]
    if (lastMsg?.type !== "assistant" || !lastMsg?.message?.usage) return

    const model = lastMsg.message.model || "unknown"
    const usage = extractUsage(lastMsg)
    const output = extractLLMOutput(currentMessages)

    // Get parent_tool_use_id from first message to determine sub-agent nesting
    const parentToolUseId = currentMessages[0]?.parent_tool_use_id ?? null
    const parentKey = spanManager.resolveParentKeyForLLM(parentToolUseId)

    llmSpanCounter++
    const key = `llm:${llmSpanCounter}`

    // Emit as a single completed span (avoids race between start/end HTTP publishes)
    spanManager.emitCompletedSpan(key, {
      name: `llm:${model}`,
      kind: "llm",
      startTime: currentMessageStartTime,
      endTime: Date.now(),
      parentKey,
      attributes: {
        "llm.model": model,
        ...usage,
        ...(output ? { "tool.output": output } : {}),
      },
    })

    // Track accumulated output tokens for final adjustment
    const outputTokens = getNumberProp(lastMsg.message.usage, "output_tokens") || 0
    accumulatedOutputTokens += outputTokens
  } catch (e) {
    console.error("[tracing] createLLMSpan error:", e)
  }

  currentMessages = []
}

function handleStreamMessage(msg: any) {
  try {
    // 1. Track tool_use blocks in assistant messages for sub-agent detection
    if (msg.type === "assistant" && Array.isArray(msg.message?.content)) {
      const parentToolUseId = msg.parent_tool_use_id ?? null
      for (const block of msg.message.content) {
        if (block.type === "tool_use" && block.id) {
          // Register parent mapping for this tool_use_id
          spanManager.registerToolUseParent(block.id, parentToolUseId)

          // If it's a Task (sub-agent), register pending name
          if (block.name === "Task" && block.input?.subagent_type) {
            spanManager.registerPendingSubAgent(block.id, block.input.subagent_type)
          }
        }
      }
    }

    // 2. Detect sub-agent messages via parent_tool_use_id
    if ("parent_tool_use_id" in msg && msg.parent_tool_use_id) {
      spanManager.ensureSubAgentSpan(msg.parent_tool_use_id)
    }

    // 3. Track assistant messages for LLM spans (Braintrust pattern)
    //    When message.id changes, flush the previous LLM span
    const messageId = msg.message?.id
    if (messageId && messageId !== currentMessageId) {
      createLLMSpan()
      currentMessageId = messageId
      currentMessageStartTime = Date.now()
    }

    if (msg.type === "assistant" && msg.message?.usage) {
      currentMessages.push(msg)
    }

    // 4. On result message, extract final usage
    if (msg.type === "result" && msg.usage) {
      // Adjust last message's output tokens with final total
      const finalOutput = getNumberProp(msg.usage, "output_tokens")
      if (finalOutput !== undefined && currentMessages.length > 0) {
        const lastMsg = currentMessages[currentMessages.length - 1]
        if (lastMsg?.message?.usage) {
          const adjusted = finalOutput - accumulatedOutputTokens
          if (adjusted >= 0) {
            lastMsg.message.usage.output_tokens = adjusted
          }
        }
      }
    }
  } catch (e) {
    console.error("[tracing] handleStreamMessage error:", e)
  }
}

export async function processStream(
  query: AsyncGenerator,
  streamId: string,
  config: AgentConfig,
) {
  let chunkCount = 0

  // Reset LLM span state
  llmSpanCounter = 0
  currentMessageId = undefined
  currentMessageStartTime = 0
  currentMessages = []
  accumulatedOutputTokens = 0

  // Batch buffer
  let batchBuffer: object[] = []
  let batchSeq = 0
  let flushTimer: ReturnType<typeof setTimeout> | null = null

  const flushBatch = () => {
    if (flushTimer) {
      clearTimeout(flushTimer)
      flushTimer = null
    }
    if (batchBuffer.length === 0) return
    const messages = batchBuffer
    batchBuffer = []
    const seq = batchSeq++
    publish(streamId, { type: "batch", seq, messages })
  }

  const enqueue = (msg: object) => {
    batchBuffer.push(msg)
    if (!flushTimer) {
      flushTimer = setTimeout(flushBatch, FLUSH_INTERVAL_MS)
    }
  }

  try {
    for await (const msg of query) {
      chunkCount++

      // Tracing: intercept for LLM spans + sub-agent detection
      handleStreamMessage(msg)

      // Enqueue for batched publishing
      enqueue(msg as object)

      // Flush immediately for terminal messages
      if (TERMINAL_TYPES.has((msg as any)?.type)) {
        flushBatch()
      }

      // Fire lifecycle hooks based on message type
      switch ((msg as any).type) {
        case "system":
          if (config.onStart) {
            await config.onStart({
              sessionId: (msg as any).session_id,
              model: (msg as any).model,
              tools: (msg as any).tools,
            })
          }
          break

        case "assistant":
          if (config.onStepFinish) {
            await config.onStepFinish({
              message: (msg as any).message,
              cost: 0,
            })
          }
          break

        case "result":
          if ((msg as any).is_error && config.onError) {
            await config.onError({
              error: new Error((msg as any).result || "Agent execution error"),
            })
          } else if (!(msg as any).is_error && config.onFinish) {
            await config.onFinish({
              result: { text: (msg as any).result || "", subtype: (msg as any).subtype },
              cost: (msg as any).total_cost_usd,
              duration: (msg as any).duration_ms,
              turns: (msg as any).num_turns,
              usage: {
                inputTokens: (msg as any).usage?.inputTokens ?? 0,
                outputTokens: (msg as any).usage?.outputTokens ?? 0,
              },
            })
          }
          break
      }
    }

    // Flush final LLM span + end sub-agent spans
    createLLMSpan()
    spanManager.endAllSubAgentSpans()

    // Flush any remaining buffered messages
    flushBatch()

    // Signal stream complete
    batchBuffer.push({ type: "done" })
    flushBatch()

    console.log(
      `[${streamId.slice(0, 8)}] Stream completed with ${chunkCount} chunks in ${batchSeq} batches`,
    )
  } catch (error: any) {
    console.error(
      `[${streamId.slice(0, 8)}] Stream failed:`,
      error.message,
    )

    try {
      if (config.onError) await config.onError({ error })
    } catch {}

    batchBuffer.push({ type: "error", error: error.message })
    flushBatch()
  }
}
