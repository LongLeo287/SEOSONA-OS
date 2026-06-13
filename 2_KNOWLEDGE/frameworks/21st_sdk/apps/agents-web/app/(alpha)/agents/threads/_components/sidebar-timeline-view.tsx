"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { useAtom } from "jotai"
import { logsInspectorHeightAtom, timelineTreeWidthAtom, timelineInspectorDetailWidthAtom } from "./logs-constants"
import { cn } from "@/lib/utils"
import {
  type SpanData,
  type FlatSpanNode,
  createTreeFromFlatSpans,
  flattenSpanTree,
  inverseLerp,
  formatDurationMs,
  toMs,
} from "./span-tree-utils"
import { api } from "@/trpc/client"
import { ChevronsDown, ChevronDown, AlertCircle, Copy, Check } from "lucide-react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { TimelineIcon, CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Resize utilities ───

function useColResize(
  width: number,
  setWidth: (w: number) => void,
  min = 100,
  max = 400,
) {
  return useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = width
    const onMove = (ev: MouseEvent) => {
      setWidth(Math.max(min, Math.min(max, startW + (ev.clientX - startX))))
    }
    const onUp = () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.body.classList.remove("select-none", "cursor-col-resize")
    }
    document.body.classList.add("select-none", "cursor-col-resize")
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }, [width, setWidth, min, max])
}

function ColResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative w-0 flex-shrink-0 cursor-col-resize group"
    >
      <div className="absolute inset-y-0 -left-[4px] w-[9px] z-10" />
      <div className="absolute inset-y-0 -left-px w-[0.5px] bg-border/50 group-hover:w-[2px] group-hover:-left-[1px] group-hover:bg-foreground/10 group-active:bg-foreground/15 transition-all" />
    </div>
  )
}

// ─── Timeline Primitives ───

function TimelineRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative" style={{ width: "100%" }}>
      {children}
    </div>
  )
}

function TimelineSpanBar({
  startMs,
  durationMs,
  rootStartMs,
  rootDurationMs,
  status,
  isPartial,
}: {
  startMs: number
  durationMs: number
  rootStartMs: number
  rootDurationMs: number
  status: string
  isPartial: boolean
}) {
  const left = inverseLerp(rootStartMs, rootStartMs + rootDurationMs, startMs)
  const width = inverseLerp(rootStartMs, rootStartMs + rootDurationMs, startMs + durationMs) - left
  const widthPct = Math.max(width * 100, 0.5)
  const isNarrow = widthPct < 8

  const barColor =
    status === "error"
      ? "bg-red-500/70"
      : status === "running"
        ? "bg-blue-400/50"
        : "bg-blue-500/70"

  const durationLabel = formatDurationMs(durationMs)

  return (
    <div
      className="absolute top-1 h-5"
      style={{
        left: `${Math.max(left * 100, 0)}%`,
        width: `${widthPct}%`,
      }}
    >
      <div className={cn("h-full w-full rounded-sm relative", barColor)}>
        {isPartial && (
          <div
            className="absolute inset-0 rounded-sm opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)",
              animation: "timeline-stripe 0.6s linear infinite",
            }}
          />
        )}
        {!isNarrow && (
          <span className="absolute left-1.5 top-0.5 text-[10px] text-white/90 font-medium whitespace-nowrap">
            {durationLabel}
          </span>
        )}
      </div>
      {isNarrow && (
        <span className="absolute left-full ml-1 top-0.5 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
          {durationLabel}
        </span>
      )}
    </div>
  )
}

// ─── Span Detail Inspector ───

function SpanPayload({ span }: { span: SpanData }) {
  if (span.input == null) return null
  const raw = typeof (span.input as any)?.raw === "string"
    ? (span.input as any).raw
    : JSON.stringify(span.input, null, 2)
  return <JsonCard label="Payload" value={raw} />
}

function SpanOutput({ span }: { span: SpanData }) {
  if (span.output == null) return null
  const rawOutput = typeof (span.output as any)?.raw === "string"
    ? (span.output as any).raw
    : JSON.stringify(span.output, null, 2)

  if (span.kind === "llm") {
    const { text, toolCalls } = formatLLMOutput(rawOutput)
    return (
      <>
        {toolCalls.length > 0 && (
          <div>
            <p className="text-[12px] font-medium text-foreground mb-1.5">Tool Calls</p>
            <div className="space-y-1.5">
              {toolCalls.map((tc, i) => (
                <ToolCallCard key={i} toolCall={tc} />
              ))}
            </div>
          </div>
        )}
        {text && (
          <div>
            <p className="text-[12px] font-medium text-foreground mb-1.5">Response</p>
            <div className="text-[13px] text-foreground bg-muted/20 border-[0.5px] border-border rounded-md p-3 max-h-[180px] overflow-y-auto whitespace-pre-wrap break-words leading-relaxed">
              {text}
            </div>
          </div>
        )}
      </>
    )
  }

  return <JsonCard label="Output" value={rawOutput} />
}

type ToolCallInfo = { name: string; input: Record<string, unknown> | null }

function formatToolName(name: string): string {
  return name.replace(/^mcp__[^_]+__/, "")
}

function ToolCallCard({ toolCall }: { toolCall: ToolCallInfo }) {
  const entries = toolCall.input ? Object.entries(toolCall.input) : []
  const hasArgs = entries.length > 0

  return (
    <div className="rounded-md border border-border/60 bg-background overflow-hidden">
      <div className="px-2.5 py-1.5">
        <span className="text-[13px] font-mono font-medium text-foreground">
          {formatToolName(toolCall.name)}
        </span>
      </div>
      {hasArgs && (
        <div className="border-t border-border/40 px-2.5 py-2 space-y-1.5">
          {entries.map(([k, v]) => {
            const val = typeof v === "string" ? v : JSON.stringify(v)
            return (
              <div key={k} className="text-[12px]">
                <span className="text-foreground font-mono font-medium">{k}</span>
                <span className="text-muted-foreground mx-1">=</span>
                <span className="text-foreground/60 font-mono break-all">{val}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatLLMOutput(raw: string): { text: string | null; toolCalls: ToolCallInfo[] } {
  try {
    const messages = JSON.parse(raw)
    if (!Array.isArray(messages)) return { text: null, toolCalls: [] }
    const textParts: string[] = []
    const toolCalls: ToolCallInfo[] = []
    for (const msg of messages) {
      const content = msg.content
      if (!Array.isArray(content)) continue
      for (const block of content) {
        if (block.type === "text" && block.text) {
          textParts.push(block.text)
        } else if (block.type === "tool_use") {
          toolCalls.push({
            name: block.name ?? "unknown",
            input: block.input && typeof block.input === "object" ? block.input : null,
          })
        }
      }
    }
    return { text: textParts.join("\n") || null, toolCalls }
  } catch {
    return { text: raw, toolCalls: [] }
  }
}

function formatJson(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

function JsonCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-foreground mb-1.5">{label}</p>
      <CodeBlock code={formatJson(value)} language="json" className="text-[11px] bg-background border-[0.5px] border-border/60 [&_.shiki]:!bg-transparent [&_.shiki_pre]:!bg-transparent [&_*:focus-visible]:!outline-none [&_*:focus-visible]:!shadow-none" />
    </div>
  )
}

function formatTimestamp(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions)
}

function SpanErrorBlock({ error }: { error: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div>
      <div className="rounded-md border border-border/60 bg-background overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 flex-none rounded-full bg-red-400" />
            <span className="text-[11px] font-medium text-foreground">Error</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(error)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="an-focus-btn flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            aria-label="Copy error"
          >
            <div className="relative size-3">
              <Copy className={cn(
                "absolute inset-0 size-3 transition-[opacity,transform] duration-200 ease-out",
                copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )} />
              <Check className={cn(
                "absolute inset-0 size-3 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )} />
            </div>
          </button>
        </div>
        <div className="px-2 py-1.5 max-h-[100px] overflow-y-auto">
          <p className="text-[11px] font-mono text-red-400 leading-relaxed break-all whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    </div>
  )
}

function InspectorRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[28px] w-full items-center justify-between gap-4 border-b border-border/40 py-1 px-2 last:border-none">
      <dt className="text-[12px] text-muted-foreground shrink-0">{label}</dt>
      <dd className="truncate text-[12px] font-mono text-foreground">{children}</dd>
    </div>
  )
}

function CopyStepButton({ span }: { span: SpanData }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const payload = {
      span_id: span.span_id,
      parent_span_id: span.parent_span_id,
      name: span.name,
      kind: span.kind,
      status: span.status,
      duration_ms: span.duration_ms,
      error: span.error,
      input: span.input,
      output: span.output,
      attributes: span.attributes,
    }
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [span])

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className="an-focus-btn relative flex h-7 items-center rounded-md px-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors overflow-hidden"
        >
          <div className={cn(
            "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
            copied ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0",
          )}>
            <CopyIcon className="h-3.5 w-3.5" />
            <span>Copy as JSON</span>
          </div>
          <div className={cn(
            "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
            copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full",
          )}>
            <CheckIcon className="h-3.5 w-3.5" />
            <span>Copied!</span>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Copy &quot;{span.name.replace(/^(agent|tool|function):/, "").replace(/^mcp__[^_]+__/, "").replace(/^llm:/, "")}&quot; span as JSON</TooltipContent>
    </Tooltip>
  )
}

function SpanInspector({ span, onClose, height, detailWidth, onDetailResize }: { span: SpanData; onClose: () => void; height: number; detailWidth: number; onDetailResize: (e: React.MouseEvent) => void }) {
  const startTime = toMs(span.start_time)
  const endTime = span.end_time ? toMs(span.end_time) : null
  const duration = span.duration_ms ?? (endTime ? endTime - startTime : null)

  const llmAttrs = span.kind === "llm" && span.attributes
    ? Object.entries(span.attributes as Record<string, unknown>).filter(([k]) => k.startsWith("llm."))
    : []

  return (
    <div className="flex-shrink-0 overflow-y-auto" style={{ height }}>
      {/* Header */}
      <div className="flex items-center gap-2 pl-3 pr-1.5 py-1 border-b-[0.5px] border-border/50">
        <span className="text-[13px] font-medium text-foreground truncate flex-1">
          {span.name
            .replace(/^(agent|tool|function):/, "")
            .replace(/^mcp__[^_]+__/, "")
            .replace(/^llm:/, "")}
        </span>
        <CopyStepButton span={span} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="an-focus-btn flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <ChevronsDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Two-column: details left, payload right */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: details */}
        <div className="flex-shrink-0 overflow-y-auto p-2" style={{ width: detailWidth }}>
          <div className="rounded-md border border-border/60 bg-background">
            <div className="rounded-md bg-muted/20 px-1 py-0.5">
              <InspectorRow label="Status">
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    "size-2 flex-none rounded-full",
                    span.status === "error" ? "bg-red-400" : span.status === "running" ? "bg-blue-400" : "bg-emerald-400",
                  )} />
                  <span className="capitalize font-sans">{span.status}</span>
                </span>
              </InspectorRow>
              <InspectorRow label="Duration">
                <span className="tabular-nums">{duration != null ? formatDurationMs(duration) : "—"}</span>
              </InspectorRow>
              <InspectorRow label="Start">
                <span className="tabular-nums">{formatTimestamp(startTime)}</span>
              </InspectorRow>
              {endTime && (
                <InspectorRow label="End">
                  <span className="tabular-nums">{formatTimestamp(endTime)}</span>
                </InspectorRow>
              )}
              {llmAttrs.map(([k, v]) => (
                <InspectorRow key={k} label={k.replace("llm.", "")}>
                  <span className="tabular-nums">{String(v)}</span>
                </InspectorRow>
              ))}
            </div>
          </div>

        </div>

        <ColResizeHandle onMouseDown={onDetailResize} />

        {/* Right: error, payload & output */}
        <div className="flex-1 overflow-y-auto p-2">
          {(span.input != null || span.output != null || span.error) ? (
            <div className="space-y-2">
              {span.error && <SpanErrorBlock error={span.error} />}
              {span.input != null && (
                <SpanPayload span={span} />
              )}
              {span.output != null && (
                <SpanOutput span={span} />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[12px] text-muted-foreground">No payload data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Timeline View ───

export function SidebarTimelineView({
  threadId,
  isStreaming,
  autoSelectRoot = false,
}: {
  threadId: string
  isStreaming: boolean
  autoSelectRoot?: boolean
}) {
  const { data, isLoading } = api.agentConfigs.getThreadSpans.useQuery(
    { threadId },
    { refetchInterval: isStreaming ? 2_000 : false },
  )

  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null)
  const [hoveredSpanId, setHoveredSpanId] = useState<string | null>(null)
  const [focusedSpanId, setFocusedSpanId] = useState<string | null>(null)
  const [inspectorHeight, setInspectorHeight] = useAtom(logsInspectorHeightAtom)
  const [treeWidth, setTreeWidth] = useAtom(timelineTreeWidthAtom)
  const [inspDetailWidth, setInspDetailWidth] = useAtom(timelineInspectorDetailWidthAtom)

  const handleTreeResize = useColResize(treeWidth, setTreeWidth, 80, 300)
  const handleInspDetailResize = useColResize(inspDetailWidth, setInspDetailWidth, 140, 400)

  const treeRef = useRef<HTMLDivElement>(null)
  const ganttRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInspectorDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = inspectorHeight

    const onMove = (ev: MouseEvent) => {
      const delta = startY - ev.clientY
      const containerH = containerRef.current?.clientHeight ?? 600
      const newHeight = Math.max(100, Math.min(containerH * 0.7, startHeight + delta))
      setInspectorHeight(newHeight)
    }

    const onUp = () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.body.classList.remove("select-none")
    }

    document.body.classList.add("select-none")
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }, [inspectorHeight])

  // Synchronized scroll
  const handleTreeScroll = useCallback(() => {
    if (treeRef.current && ganttRef.current) {
      ganttRef.current.scrollTop = treeRef.current.scrollTop
    }
  }, [])
  const handleGanttScroll = useCallback(() => {
    if (ganttRef.current && treeRef.current) {
      treeRef.current.scrollTop = ganttRef.current.scrollTop
    }
  }, [])

  // Build tree + flat list
  const { flatNodes, rootStartMs, rootDurationMs } = useMemo(() => {
    if (!data?.spans?.length) {
      return { flatNodes: [] as FlatSpanNode[], rootStartMs: 0, rootDurationMs: 1 }
    }

    const spans = data.spans as SpanData[]
    const tree = createTreeFromFlatSpans(spans)
    if (!tree) return { flatNodes: [] as FlatSpanNode[], rootStartMs: 0, rootDurationMs: 1 }

    const flat = flattenSpanTree(tree)

    const rootStart = toMs(tree.data.start_time)
    let maxEnd = rootStart

    for (const node of flat) {
      const end = node.data.end_time
        ? toMs(node.data.end_time)
        : Date.now()
      if (end > maxEnd) maxEnd = end
    }

    const duration = Math.max(maxEnd - rootStart, 1)

    return { flatNodes: flat, rootStartMs: rootStart, rootDurationMs: duration * 1.05 }
  }, [data?.spans])

  // Auto-select root span on first load only
  const hasAutoSelected = useRef(false)
  useEffect(() => {
    if (autoSelectRoot && flatNodes.length > 0 && !hasAutoSelected.current) {
      hasAutoSelected.current = true
      setSelectedSpanId(flatNodes[0]!.id)
    }
  }, [autoSelectRoot, flatNodes])

  const selectedSpan = useMemo(() => {
    if (!selectedSpanId || !data?.spans) return null
    return (data.spans as SpanData[]).find((s) => s.span_id === selectedSpanId) ?? null
  }, [selectedSpanId, data?.spans])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <AnLogoSpinner />
      </div>
    )
  }

  if (!data?.spans?.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
        <TimelineIcon className="h-7 w-7 text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">No timeline data available</p>
      </div>
    )
  }

  const ROW_HEIGHT = 28

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Two-panel layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden bg-background">
        {/* Tree panel */}
        <div
          ref={treeRef}
          onScroll={handleTreeScroll}
          className="flex-shrink-0 overflow-y-auto overflow-x-hidden"
          style={{ width: treeWidth }}
        >
          {flatNodes.map((node) => {
            const showErrorIcon = node.data.status === "error"
            return (
              <div
                key={node.id}
                role="button"
                tabIndex={0}
                className={cn(
                  "an-focus-btn flex items-center gap-1 px-1 cursor-pointer border-b-[0.5px] border-border/50 transition-colors",
                  selectedSpanId === node.id ? "bg-foreground/10" : (hoveredSpanId === node.id || focusedSpanId === node.id) && "bg-foreground/5",
                )}
                style={{
                  paddingLeft: `${node.level * 12 + 16}px`,
                  height: `${ROW_HEIGHT}px`,
                }}
                onClick={() => setSelectedSpanId(selectedSpanId === node.id ? null : node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setSelectedSpanId(selectedSpanId === node.id ? null : node.id)
                  }
                }}
                onFocus={() => setFocusedSpanId(node.id)}
                onBlur={() => setFocusedSpanId((prev) => prev === node.id ? null : prev)}
                onMouseEnter={() => setHoveredSpanId(node.id)}
                onMouseLeave={() => setHoveredSpanId(null)}
              >
                {showErrorIcon && (
                  <AlertCircle className="h-3 w-3 flex-shrink-0 text-red-400 -ml-3.5" />
                )}
                <span className={cn(
                  "text-[11px] truncate",
                  node.data.status === "error"
                    ? "text-red-400"
                    : "text-foreground",
                )}>
                  {node.data.name
                    .replace(/^(agent|tool|function):/, "")
                    .replace(/^mcp__[^_]+__/, "")
                    .replace(/^llm:/, "")}
                </span>
              </div>
            )
          })}
        </div>

        <ColResizeHandle onMouseDown={handleTreeResize} />

        {/* Gantt panel */}
        <div
          ref={ganttRef}
          onScroll={handleGanttScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <TimelineRoot>
            {flatNodes.map((node) => {
              const spanStartMs = toMs(node.data.start_time)
              const isPartial = !node.data.end_time
              const spanEndMs = node.data.end_time
                ? toMs(node.data.end_time)
                : Date.now()
              const spanDurationMs = spanEndMs - spanStartMs

              return (
                <div
                  key={node.id}
                  className={cn(
                    "relative border-b-[0.5px] border-border/50 cursor-pointer transition-colors",
                    selectedSpanId === node.id ? "bg-foreground/10" : (hoveredSpanId === node.id || focusedSpanId === node.id) && "bg-foreground/5",
                  )}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  onClick={() => setSelectedSpanId(selectedSpanId === node.id ? null : node.id)}
                  onMouseEnter={() => setHoveredSpanId(node.id)}
                  onMouseLeave={() => setHoveredSpanId(null)}
                  title={`${node.data.name.replace(/^(agent|tool|function):/, "").replace(/^mcp__[^_]+__/, "").replace(/^llm:/, "")} — ${formatDurationMs(spanDurationMs)}`}
                >
                  <TimelineSpanBar
                    startMs={spanStartMs}
                    durationMs={spanDurationMs}
                    rootStartMs={rootStartMs}
                    rootDurationMs={rootDurationMs}
                    status={node.data.status}
                    isPartial={isPartial}
                  />
                </div>
              )
            })}
          </TimelineRoot>
        </div>
      </div>

      {/* Inspector */}
      {selectedSpan && (
        <>
          <div
            onMouseDown={handleInspectorDrag}
            className="h-1 flex-shrink-0 cursor-row-resize border-t-[0.5px] border-border hover:bg-foreground/5 transition-colors"
          />
          <SpanInspector
            span={selectedSpan}
            onClose={() => setSelectedSpanId(null)}
            height={inspectorHeight}
            detailWidth={inspDetailWidth}
            onDetailResize={handleInspDetailResize}
          />
        </>
      )}

      {/* Stripe animation keyframes */}
      <style jsx global>{`
        @keyframes timeline-stripe {
          0% { background-position: 0 0; }
          100% { background-position: 12px 0; }
        }
      `}</style>
    </div>
  )
}
