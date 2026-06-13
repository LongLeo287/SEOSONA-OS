/**
 * ACP Stream Transformer — converts raw ACP JSON-RPC messages into AI SDK stream parts.
 *
 * Input (via SSE lines written to the writable side):
 *   data: {"jsonrpc":"2.0","method":"session/update","params":{"sessionId":"...","update":{"sessionUpdate":"agent_message_chunk",...}}}
 *   data: {"jsonrpc":"2.0","id":3,"result":{"stopReason":"end_turn","usage":{...}}}
 *   data: {"type":"done"}
 *   data: {"type":"error","error":"..."}
 *
 * Output: LanguageModelV2StreamPart events (text-start, text-delta, text-end,
 *   tool-input-start, tool-call, tool-result, reasoning-delta, finish, error, stream-start)
 *
 * The transformer is stateful — it tracks the current text block, tool call state,
 * and accumulated metadata across messages in a single prompt turn.
 */

import type {
  LanguageModelV2StreamPart,
  LanguageModelV2FinishReason,
  LanguageModelV2Usage,
} from "@ai-sdk/provider"

// ─── ACP types (minimal, hand-rolled to avoid depending on the ACP SDK) ────

type ContentText = { type: "text"; text: string }
type ContentImage = { type: "image"; data?: string; mimeType?: string }
type ContentBlock = ContentText | ContentImage

type SessionUpdate =
  | {
      sessionUpdate: "agent_message_chunk" | "user_message_chunk" | "agent_thought_chunk"
      content: ContentBlock
      _meta?: Record<string, unknown>
    }
  | {
      sessionUpdate: "tool_call"
      toolCallId: string
      title?: string
      status?: string
      rawInput?: unknown
      kind?: string
      _meta?: {
        claudeCode?: { toolName?: string; parentToolUseId?: string | null }
        [k: string]: unknown
      }
    }
  | {
      sessionUpdate: "tool_call_update"
      toolCallId: string
      status?: "in_progress" | "completed" | "error" | "cancelled"
      content?: Array<{ type?: string; text?: string; [k: string]: unknown }>
      rawOutput?: unknown
      _meta?: {
        claudeCode?: { toolName?: string; toolResponse?: unknown }
        [k: string]: unknown
      }
    }
  | {
      sessionUpdate: "usage_update"
      used?: number
      size?: number
      cost?: { amount: number; currency: string }
    }
  | {
      sessionUpdate: string
      [k: string]: unknown
    }

type SessionNotification = {
  sessionId: string
  update: SessionUpdate
  _meta?: Record<string, unknown>
}

type AcpUsage = {
  inputTokens?: number
  outputTokens?: number
  cachedReadTokens?: number
  cachedWriteTokens?: number
  totalTokens?: number
}

type JsonRpcMessage = {
  jsonrpc?: "2.0"
  id?: number | string
  method?: string
  params?: unknown
  result?: {
    stopReason?: string
    usage?: AcpUsage
    userMessageId?: string | null
  }
  error?: { code: number; message: string; data?: unknown }
}

type TerminalEnvelope = {
  type: "done" | "error"
  error?: string
  message?: string
}

type InputMessage = JsonRpcMessage | TerminalEnvelope

// ─── Span shape (matches packages/agent-runtime/src/tracing.ts) ────────────

export type SpanKind = "agent" | "tool" | "llm"

export type SpanJSON = {
  spanId: string
  parentSpanId: string | null
  traceId: string
  name: string
  kind: SpanKind
  startTime: number
  endTime: number | null
  durationMs: number | null
  status: "running" | "completed" | "error"
  error: string | null
  attributes: Record<string, unknown>
}

export type SpanMessage = {
  type: "span"
  event: "start" | "end"
  span: SpanJSON
}

export type AcpTransformerOptions = {
  /** Optional callback to receive span messages for tracing. The relay wires
   *  this to its `handleSpanMessage` handler so ACP-path spans flow into the
   *  same DB table as SDK-path spans. */
  onSpan?: (msg: SpanMessage) => void
  /** Trace ID to use for spans. If omitted, a new UUID is generated. */
  traceId?: string
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function createAcpStreamTransformer(
  generateId: () => string,
  options: AcpTransformerOptions = {},
): TransformStream<Uint8Array, LanguageModelV2StreamPart> {
  const onSpan = options.onSpan
  const traceId = options.traceId ?? generateId()
  const rootSpanId = generateId()
  let rootSpanStarted = false
  let rootSpanEnded = false
  // Map toolCallId → spanId so we can emit span-end for each tool
  const toolSpanIds = new Map<string, string>()

  const emitSpan = (
    event: "start" | "end",
    span: Omit<SpanJSON, "traceId">,
  ) => {
    if (!onSpan) return
    onSpan({
      type: "span",
      event,
      span: { ...span, traceId } as SpanJSON,
    })
  }

  const startRootSpan = () => {
    if (rootSpanStarted) return
    rootSpanStarted = true
    emitSpan("start", {
      spanId: rootSpanId,
      parentSpanId: null,
      name: "agent:main",
      kind: "agent",
      startTime: Date.now(),
      endTime: null,
      durationMs: null,
      status: "running",
      error: null,
      attributes: { "stream.id": "" },
    })
  }

  const endRootSpan = (status: "completed" | "error", errorMsg?: string) => {
    if (!rootSpanStarted || rootSpanEnded) return
    rootSpanEnded = true
    const endTime = Date.now()
    emitSpan("end", {
      spanId: rootSpanId,
      parentSpanId: null,
      name: "agent:main",
      kind: "agent",
      startTime: endTime, // handleSpanMessage merges start + end, only uses endTime/status/error here
      endTime,
      durationMs: null,
      status,
      error: errorMsg ?? null,
      attributes: {},
    })
  }

  // ─── State ───────────────────────────────────────────────────────────────
  let buffer = ""
  let sessionId: string | undefined
  let currentTextId: string | undefined
  let textStarted = false
  let lastTextBlockId: string | undefined
  let hasToolCalls = false
  let finishEmitted = false

  // Tool call tracking
  const activeTools = new Map<
    string,
    { toolName: string; input: unknown; startedAt: number }
  >()

  // Metadata accumulation
  let totalCostUsd: number | undefined
  let accumulatedUsage: LanguageModelV2Usage = {
    inputTokens: undefined,
    outputTokens: undefined,
    totalTokens: undefined,
  }
  let durationMs: number | undefined
  const startedAt = Date.now()
  let finishReason: LanguageModelV2FinishReason = "unknown"
  let terminalErrorText: string | undefined

  // Pending request tracking (to correlate JSON-RPC responses to prompts)
  // For now we only care about the last request's response (the current turn).

  const textDecoder = new TextDecoder()

  const getProviderMetadata = () => {
    if (sessionId) return { sandbox: { sessionId } }
    return undefined
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const ensureTextBlockStarted = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
  ) => {
    if (!textStarted) {
      currentTextId = generateId()
      controller.enqueue({
        type: "text-start",
        id: currentTextId,
        providerMetadata: getProviderMetadata(),
      })
      textStarted = true
    }
  }

  const endTextBlock = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
  ) => {
    if (textStarted && currentTextId) {
      lastTextBlockId = currentTextId
      controller.enqueue({
        type: "text-end",
        id: currentTextId,
        providerMetadata: getProviderMetadata(),
      })
      textStarted = false
      currentTextId = undefined
    }
  }

  const truncate = (value: unknown, max = 10_000): string => {
    try {
      const s = typeof value === "string" ? value : JSON.stringify(value)
      return s.length > max ? s.slice(0, max) : s
    } catch {
      return ""
    }
  }

  const mapStopReason = (reason?: string): LanguageModelV2FinishReason => {
    switch (reason) {
      case "end_turn":
        return hasToolCalls ? "tool-calls" : "stop"
      case "max_tokens":
        return "length"
      case "max_turn_requests":
        return "length"
      case "cancelled":
        return "error"
      case "refusal":
        return "content-filter"
      default:
        return hasToolCalls ? "tool-calls" : "stop"
    }
  }

  // ─── Session update handlers ─────────────────────────────────────────────

  const handleSessionUpdate = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
    notification: SessionNotification,
  ) => {
    if (!sessionId && notification.sessionId) {
      sessionId = notification.sessionId
    }

    const update = notification.update
    if (!update || typeof update !== "object") return
    const kind = update.sessionUpdate

    switch (kind) {
      case "agent_message_chunk": {
        const content = (update as { content?: ContentBlock }).content
        if (!content) break
        if (content.type === "text" && typeof content.text === "string") {
          ensureTextBlockStarted(controller)
          controller.enqueue({
            type: "text-delta",
            id: currentTextId!,
            delta: content.text,
          })
        }
        // image / other content types are not mapped to text stream parts
        break
      }

      case "agent_thought_chunk": {
        const content = (update as { content?: ContentBlock }).content
        if (content && content.type === "text" && typeof content.text === "string") {
          // Reasoning streams are independent of text blocks — don't close the text block
          const reasoningId = generateId()
          controller.enqueue({
            type: "reasoning-start",
            id: reasoningId,
            providerMetadata: getProviderMetadata(),
          })
          controller.enqueue({
            type: "reasoning-delta",
            id: reasoningId,
            delta: content.text,
          })
          controller.enqueue({
            type: "reasoning-end",
            id: reasoningId,
            providerMetadata: getProviderMetadata(),
          })
        }
        break
      }

      case "tool_call": {
        const u = update as Extract<SessionUpdate, { sessionUpdate: "tool_call" }>
        const toolName =
          u._meta?.claudeCode?.toolName ||
          (u as { title?: string }).title ||
          "unknown"
        const toolCallId = u.toolCallId

        endTextBlock(controller)
        hasToolCalls = true

        activeTools.set(toolCallId, {
          toolName,
          input: u.rawInput ?? {},
          startedAt: Date.now(),
        })

        // Emit tool span-start
        const toolSpanId = generateId()
        toolSpanIds.set(toolCallId, toolSpanId)
        emitSpan("start", {
          spanId: toolSpanId,
          parentSpanId: rootSpanId,
          name: toolName,
          kind: "tool",
          startTime: Date.now(),
          endTime: null,
          durationMs: null,
          status: "running",
          error: null,
          attributes: {
            "tool.call.id": toolCallId,
            "tool.input": truncate(u.rawInput ?? {}),
          },
        })

        controller.enqueue({
          type: "tool-input-start",
          id: toolCallId,
          toolName,
          providerMetadata: getProviderMetadata(),
        })

        // Emit the input as a single delta (we get the full input upfront from ACP,
        // unlike the Claude SDK which streams partial JSON)
        const inputStr =
          typeof u.rawInput === "string" ? u.rawInput : JSON.stringify(u.rawInput ?? {})
        if (inputStr && inputStr !== "{}") {
          controller.enqueue({
            type: "tool-input-delta",
            id: toolCallId,
            delta: inputStr,
          })
        }

        controller.enqueue({
          type: "tool-input-end",
          id: toolCallId,
          providerMetadata: getProviderMetadata(),
        })

        controller.enqueue({
          type: "tool-call",
          toolCallId,
          toolName,
          input: inputStr || "{}",
          providerMetadata: getProviderMetadata(),
        })
        break
      }

      case "tool_call_update": {
        const u = update as Extract<SessionUpdate, { sessionUpdate: "tool_call_update" }>
        const toolCallId = u.toolCallId
        const tool = activeTools.get(toolCallId)
        const toolName = tool?.toolName || u._meta?.claudeCode?.toolName || "unknown"

        if (u.status === "completed" || u.status === "error") {
          const outputText =
            (u.content && u.content.length > 0
              ? u.content.map((c) => c.text ?? "").filter(Boolean).join("\n")
              : "") ||
            (u._meta?.claudeCode?.toolResponse
              ? truncate(u._meta.claudeCode.toolResponse)
              : "")

          controller.enqueue({
            type: "tool-result",
            toolCallId,
            toolName,
            result: outputText,
            isError: u.status === "error",
            providerMetadata: getProviderMetadata(),
          } as LanguageModelV2StreamPart)

          // Emit tool span-end
          const toolSpanId = toolSpanIds.get(toolCallId)
          if (toolSpanId) {
            const endTime = Date.now()
            emitSpan("end", {
              spanId: toolSpanId,
              parentSpanId: rootSpanId,
              name: toolName,
              kind: "tool",
              startTime: tool?.startedAt ?? endTime,
              endTime,
              durationMs: tool ? endTime - tool.startedAt : null,
              status: u.status === "error" ? "error" : "completed",
              error: u.status === "error" ? "Tool call failed" : null,
              attributes: {
                "tool.call.id": toolCallId,
                "tool.output": truncate(outputText),
              },
            })
            toolSpanIds.delete(toolCallId)
          }

          activeTools.delete(toolCallId)
        }
        // in_progress updates are not forwarded
        break
      }

      case "usage_update": {
        const u = update as Extract<SessionUpdate, { sessionUpdate: "usage_update" }>
        if (u.cost?.amount !== undefined) {
          totalCostUsd = u.cost.amount
        }
        // usage.used is context-window occupancy, not per-turn tokens.
        // Per-turn token counts come from the PromptResponse.usage field.
        break
      }

      // Silently ignore update types we don't render
      case "plan":
      case "available_commands_update":
      case "current_mode_update":
      case "config_option_update":
      case "session_info_update":
      case "user_message_chunk":
      default:
        break
    }
  }

  // ─── JSON-RPC response handler ──────────────────────────────────────────

  const handleJsonRpcResponse = (
    controller: TransformStreamDefaultController<LanguageModelV2StreamPart>,
    msg: JsonRpcMessage,
  ) => {
    // We treat any JSON-RPC response with a result.stopReason as the prompt turn finish.
    if (msg.error) {
      terminalErrorText = msg.error.message
      finishReason = "error"
      return
    }

    if (msg.result?.stopReason !== undefined) {
      finishReason = mapStopReason(msg.result.stopReason)
      if (msg.result.usage) {
        accumulatedUsage = {
          inputTokens: msg.result.usage.inputTokens,
          outputTokens: msg.result.usage.outputTokens,
          totalTokens:
            msg.result.usage.totalTokens ??
            (msg.result.usage.inputTokens !== undefined &&
            msg.result.usage.outputTokens !== undefined
              ? msg.result.usage.inputTokens + msg.result.usage.outputTokens
              : undefined),
        }
      }
    }
  }

  // ─── Main transform loop ────────────────────────────────────────────────

  return new TransformStream<Uint8Array, LanguageModelV2StreamPart>({
    start(controller) {
      controller.enqueue({ type: "stream-start", warnings: [] })
      startRootSpan()
    },

    transform(chunk, controller) {
      const text = textDecoder.decode(chunk, { stream: true })
      buffer += text

      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue
        const data = line.slice(6)
        if (!data || data === "[DONE]") continue

        let msg: InputMessage
        try {
          msg = JSON.parse(data)
        } catch {
          console.warn(
            `[acp-transformer] Failed to parse line: ${data.slice(0, 200)}`,
          )
          continue
        }

        // Terminal envelopes from the sandbox bridge
        if ((msg as TerminalEnvelope).type === "done") {
          // Just a signal — finish is handled by the JSON-RPC response or flush
          continue
        }

        if ((msg as TerminalEnvelope).type === "error") {
          const err = msg as TerminalEnvelope
          terminalErrorText = err.error || err.message || "Unknown sandbox error"
          finishReason = "error"
          continue
        }

        const rpc = msg as JsonRpcMessage

        // JSON-RPC notification: session/update
        if (rpc.method === "session/update" && rpc.params) {
          handleSessionUpdate(controller, rpc.params as SessionNotification)
          continue
        }

        // JSON-RPC response (has id + result or error)
        if (rpc.id !== undefined && (rpc.result !== undefined || rpc.error !== undefined)) {
          handleJsonRpcResponse(controller, rpc)
          continue
        }

        // Other methods we don't currently handle (initialize response, session/new, etc.)
      }
    },

    flush(controller) {
      if (finishEmitted) return
      finishEmitted = true

      endTextBlock(controller)
      durationMs = Date.now() - startedAt

      if (terminalErrorText) {
        controller.enqueue({
          type: "error",
          error: new Error(terminalErrorText),
        })
        if (finishReason === "unknown") finishReason = "error"
      }

      const metadata: {
        sessionId?: string
        totalCostUsd?: number
        inputTokens?: number
        outputTokens?: number
        totalTokens?: number
        finalTextId?: string
        durationMs?: number
        resultSubtype?: string
      } = {}
      if (sessionId) metadata.sessionId = sessionId
      if (totalCostUsd !== undefined) metadata.totalCostUsd = totalCostUsd
      if (accumulatedUsage.inputTokens !== undefined)
        metadata.inputTokens = accumulatedUsage.inputTokens
      if (accumulatedUsage.outputTokens !== undefined)
        metadata.outputTokens = accumulatedUsage.outputTokens
      if (accumulatedUsage.totalTokens !== undefined)
        metadata.totalTokens = accumulatedUsage.totalTokens
      if (lastTextBlockId) metadata.finalTextId = lastTextBlockId
      if (durationMs !== undefined) metadata.durationMs = durationMs
      metadata.resultSubtype = finishReason === "error" ? "error" : "success"

      // End any tool spans that never got a completion notification
      for (const [toolCallId, toolSpanId] of toolSpanIds) {
        const tool = activeTools.get(toolCallId)
        const endTime = Date.now()
        emitSpan("end", {
          spanId: toolSpanId,
          parentSpanId: rootSpanId,
          name: tool?.toolName ?? "unknown",
          kind: "tool",
          startTime: tool?.startedAt ?? endTime,
          endTime,
          durationMs: tool ? endTime - tool.startedAt : null,
          status: "error",
          error: "Tool span ended without completion notification",
          attributes: {},
        })
      }
      toolSpanIds.clear()

      // End the root agent span
      endRootSpan(
        finishReason === "error" ? "error" : "completed",
        terminalErrorText,
      )

      controller.enqueue({
        type: "finish",
        finishReason,
        usage: accumulatedUsage,
        providerMetadata:
          Object.keys(metadata).length > 0 ? { sandbox: metadata } : undefined,
      })
    },
  })
}
