import { randomUUID } from "crypto"
import type {
  HookCallback,
  HookCallbackMatcher,
  HookEvent,
  PreToolUseHookInput,
  PostToolUseHookInput,
  PostToolUseFailureHookInput,
  SubagentStartHookInput,
  SubagentStopHookInput,
} from "@anthropic-ai/claude-agent-sdk"

// --- Span types ---

export type SpanKind = "agent" | "tool" | "llm"
export type SpanStatus = "running" | "completed" | "error"

export interface SpanJSON {
  spanId: string
  parentSpanId: string | null
  traceId: string
  name: string
  kind: SpanKind
  startTime: number
  endTime: number | null
  durationMs: number | null
  status: SpanStatus
  error: string | null
  attributes: Record<string, unknown>
}

// --- Internal span record ---

interface SpanRecord {
  spanId: string
  parentSpanId: string | null
  traceId: string
  name: string
  kind: SpanKind
  startTime: number
  endTime: number | null
  status: SpanStatus
  error: string | null
  attributes: Record<string, unknown>
}

// --- SpanManager ---

class SpanManager {
  private spans = new Map<string, SpanRecord>()
  private streamId: string | null = null
  private traceId: string | null = null
  private rootSpanId: string | null = null
  private publishFn: ((streamId: string, message: object) => void) | null = null

  // Maps tool_use_id → parent_tool_use_id (for sub-agent nesting)
  private toolUseToParent = new Map<string, string | null>()
  // Maps parent_tool_use_id → sub-agent span key
  private subAgentSpans = new Map<string, string>()
  // Pending sub-agent names from Task tool_use blocks
  private pendingSubAgentNames = new Map<string, string>()
  // Maps agent_id → sub-agent span key (populated via SubagentStart hook + ensureSubAgentSpan)
  private agentIdToSubAgentKey = new Map<string, string>()
  // Pending agent_ids from SubagentStart hook (waiting for ensureSubAgentSpan to assign them)
  private pendingAgentIds: string[] = []

  init(streamId: string, traceId: string, publishFn: (streamId: string, message: object) => void) {
    this.streamId = streamId
    this.traceId = traceId
    this.publishFn = publishFn
    this.spans.clear()
    this.rootSpanId = null
    this.toolUseToParent.clear()
    this.subAgentSpans.clear()
    this.pendingSubAgentNames.clear()
    this.agentIdToSubAgentKey.clear()
    this.pendingAgentIds = []
  }

  startSpan(key: string, opts: {
    name: string
    kind: SpanKind
    parentKey?: string
    startTime?: number
    attributes?: Record<string, unknown>
  }): string {
    const spanId = randomUUID()
    let parentSpanId: string | null = null

    if (opts.parentKey) {
      const parent = this.spans.get(opts.parentKey)
      if (parent) parentSpanId = parent.spanId
    } else if (this.rootSpanId) {
      parentSpanId = this.rootSpanId
    }

    const record: SpanRecord = {
      spanId,
      parentSpanId,
      traceId: this.traceId ?? spanId,
      name: opts.name,
      kind: opts.kind,
      startTime: opts.startTime ?? Date.now(),
      endTime: null,
      status: "running",
      error: null,
      attributes: opts.attributes ?? {},
    }

    this.spans.set(key, record)
    this.publish("start", record)
    return spanId
  }

  endSpan(key: string, opts?: {
    status?: SpanStatus
    error?: string
    attributes?: Record<string, unknown>
  }) {
    const record = this.spans.get(key)
    if (!record || record.endTime !== null) return

    record.endTime = Date.now()
    record.status = opts?.status ?? (opts?.error ? "error" : "completed")
    if (opts?.error) record.error = opts.error
    if (opts?.attributes) {
      Object.assign(record.attributes, opts.attributes)
    }

    this.publish("end", record)
  }

  /** Create a span that's already completed (single "end" event with all data). */
  emitCompletedSpan(key: string, opts: {
    name: string
    kind: SpanKind
    parentKey?: string
    startTime: number
    endTime: number
    status?: SpanStatus
    error?: string
    attributes?: Record<string, unknown>
  }) {
    const spanId = randomUUID()
    let parentSpanId: string | null = null

    if (opts.parentKey) {
      const parent = this.spans.get(opts.parentKey)
      if (parent) parentSpanId = parent.spanId
    } else if (this.rootSpanId) {
      parentSpanId = this.rootSpanId
    }

    const record: SpanRecord = {
      spanId,
      parentSpanId,
      traceId: this.traceId ?? spanId,
      name: opts.name,
      kind: opts.kind,
      startTime: opts.startTime,
      endTime: opts.endTime,
      status: opts.status ?? "completed",
      error: opts.error ?? null,
      attributes: opts.attributes ?? {},
    }

    this.spans.set(key, record)
    this.publish("end", record)
  }

  setRootSpanId(spanId: string) {
    this.rootSpanId = spanId
  }

  // --- Sub-agent tracking ---

  /** Record which parent_tool_use_id a tool_use_id belongs to */
  registerToolUseParent(toolUseId: string, parentToolUseId: string | null) {
    this.toolUseToParent.set(toolUseId, parentToolUseId)
  }

  /** Register a pending sub-agent name from a Task tool_use block */
  registerPendingSubAgent(toolUseId: string, agentType: string) {
    this.pendingSubAgentNames.set(toolUseId, agentType)
  }

  /** Called from SubagentStart hook — registers agent_id as pending.
   *  Will be associated with a sub-agent span when ensureSubAgentSpan runs. */
  registerAgentId(agentId: string) {
    this.pendingAgentIds.push(agentId)
  }

  /** Create a sub-agent span when we first see a parent_tool_use_id in the stream.
   *  Parents to the Agent tool span (which has key = parentToolUseId). */
  ensureSubAgentSpan(parentToolUseId: string): string | null {
    if (this.subAgentSpans.has(parentToolUseId)) {
      return this.subAgentSpans.get(parentToolUseId)!
    }

    const agentName = this.pendingSubAgentNames.get(parentToolUseId)
    const spanName = agentName ? `agent:${agentName}` : "agent:sub-agent"
    const key = `subagent:${parentToolUseId}`

    // FIX 1: Parent to the Agent tool span (parentToolUseId IS the Agent tool's key)
    this.startSpan(key, {
      name: spanName,
      kind: "agent",
      parentKey: parentToolUseId,
      attributes: {
        ...(agentName ? { "agent.type": agentName } : {}),
      },
    })

    this.subAgentSpans.set(parentToolUseId, key)

    // FIX 3: Associate pending agent_id with this sub-agent span
    if (this.pendingAgentIds.length > 0) {
      const agentId = this.pendingAgentIds.shift()!
      this.agentIdToSubAgentKey.set(agentId, key)
    }

    return key
  }

  /** Resolve the parent span key for a tool call.
   *  First tries toolUseToParent map, then falls back to agent_id lookup. */
  resolveParentKeyForTool(toolUseId: string, agentId?: string): string | undefined {
    // Try 1: toolUseToParent map (works when stream message arrived before hook)
    const parentToolUseId = this.toolUseToParent.get(toolUseId)
    if (parentToolUseId && this.subAgentSpans.has(parentToolUseId)) {
      return this.subAgentSpans.get(parentToolUseId)
    }

    // Try 2: agent_id from hook input (works even when stream message hasn't arrived yet)
    if (agentId && this.agentIdToSubAgentKey.has(agentId)) {
      return this.agentIdToSubAgentKey.get(agentId)
    }

    return undefined // falls back to root span
  }

  /** Resolve the parent span key for an LLM span based on parent_tool_use_id */
  resolveParentKeyForLLM(parentToolUseId: string | null): string | undefined {
    if (parentToolUseId && this.subAgentSpans.has(parentToolUseId)) {
      return this.subAgentSpans.get(parentToolUseId)
    }
    return undefined
  }

  /** End all sub-agent spans that haven't been closed */
  endAllSubAgentSpans() {
    for (const [, key] of this.subAgentSpans) {
      this.endSpan(key, { status: "completed" })
    }
  }

  flush() {
    for (const [, record] of this.spans) {
      if (record.endTime === null) {
        record.endTime = Date.now()
        record.status = "error"
        record.error = "Trace ended before span completed"
        this.publish("end", record)
      }
    }
    this.spans.clear()
    this.streamId = null
    this.traceId = null
    this.rootSpanId = null
    this.publishFn = null
    this.toolUseToParent.clear()
    this.subAgentSpans.clear()
    this.pendingSubAgentNames.clear()
    this.agentIdToSubAgentKey.clear()
    this.pendingAgentIds = []
  }

  private publish(event: "start" | "end", record: SpanRecord) {
    if (!this.streamId || !this.publishFn) return
    const span: SpanJSON = {
      spanId: record.spanId,
      parentSpanId: record.parentSpanId,
      traceId: record.traceId,
      name: record.name,
      kind: record.kind,
      startTime: record.startTime,
      endTime: record.endTime,
      durationMs: record.endTime !== null ? record.endTime - record.startTime : null,
      status: record.status,
      error: record.error,
      attributes: record.attributes,
    }
    this.publishFn(this.streamId, { type: "span", event, span })
  }
}

// --- Singleton ---

export const spanManager = new SpanManager()

// --- Lifecycle ---

export function initTrace(
  streamId: string,
  traceId: string,
  publishFn: (streamId: string, message: object) => void,
) {
  spanManager.init(streamId, traceId, publishFn)
}

export function flushTrace() {
  spanManager.flush()
}

// --- SDK Hook factories ---

function truncate(val: unknown, max = 10_000): string {
  const s = typeof val === "string" ? val : JSON.stringify(val)
  return s?.slice(0, max) ?? ""
}

export function createTracingHooks(): Partial<Record<HookEvent, HookCallbackMatcher[]>> {
  const preToolUse: HookCallback = async (input, toolUseId) => {
    try {
      const pre = input as PreToolUseHookInput
      if (!toolUseId) return {}
      if (pre.tool_name === "Task") return {}

      // FIX 2: Pass agent_id for sub-agent tool resolution
      const agentId = (pre as { agent_id?: string }).agent_id
      const parentKey = spanManager.resolveParentKeyForTool(toolUseId, agentId)
      spanManager.startSpan(toolUseId, {
        name: pre.tool_name,
        kind: "tool",
        parentKey,
        attributes: {
          "tool.input": truncate(pre.tool_input),
          "tool.call.id": toolUseId,
        },
      })
    } catch (e) {
      console.error("[tracing] PreToolUse hook error:", e)
    }
    return {}
  }

  const postToolUse: HookCallback = async (input, toolUseId) => {
    try {
      const post = input as PostToolUseHookInput
      if (!toolUseId) return {}

      spanManager.endSpan(toolUseId, {
        status: "completed",
        attributes: {
          "tool.output": truncate(post.tool_response),
        },
      })
    } catch (e) {
      console.error("[tracing] PostToolUse hook error:", e)
    }
    return {}
  }

  const postToolUseFailure: HookCallback = async (input, toolUseId) => {
    try {
      const fail = input as PostToolUseFailureHookInput
      if (!toolUseId) return {}

      spanManager.endSpan(toolUseId, {
        status: "error",
        error: fail.error,
      })
    } catch (e) {
      console.error("[tracing] PostToolUseFailure hook error:", e)
    }
    return {}
  }

  // FIX 3: SubagentStart hook to capture agent_id before tool calls fire
  const subagentStart: HookCallback = async (input) => {
    try {
      const sub = input as SubagentStartHookInput
      spanManager.registerAgentId(sub.agent_id)
    } catch (e) {
      console.error("[tracing] SubagentStart hook error:", e)
    }
    return {}
  }

  const subagentStop: HookCallback = async (input) => {
    try {
      // Sub-agent spans are ended by endAllSubAgentSpans in processStream
      // This hook is a no-op but keeps the hook registered for future use
    } catch (e) {
      console.error("[tracing] SubagentStop hook error:", e)
    }
    return {}
  }

  return {
    PreToolUse: [{ hooks: [preToolUse] }],
    PostToolUse: [{ hooks: [postToolUse] }],
    PostToolUseFailure: [{ hooks: [postToolUseFailure] }],
    SubagentStart: [{ hooks: [subagentStart] }],
    SubagentStop: [{ hooks: [subagentStop] }],
  }
}
