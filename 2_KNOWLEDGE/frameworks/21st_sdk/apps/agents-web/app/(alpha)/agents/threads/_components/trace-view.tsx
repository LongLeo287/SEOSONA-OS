"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAtom } from "jotai"
import { cn } from "@/lib/utils"
import {
  type SpanData,
  type FlatSpanNode,
  createTreeFromFlatSpans,
  flattenSpanTree,
  formatDurationMs,
  toMs,
} from "./span-tree-utils"
import { traceTreeWidthAtom, traceDetailWidthAtom } from "./logs-constants"
import { api } from "@/trpc/client"
import { ChevronDown, AlertCircle, Copy, Check } from "lucide-react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { TraceIcon, CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyText } from "./copy-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Kind label ───

function KindLabel({ kind }: { kind: string }) {
  const colors: Record<string, string> = {
    agent: "text-purple-500",
    tool: "text-blue-500",
    function: "text-green-600",
    llm: "text-amber-600",
  }
  return (
    <span className={cn("text-[10px] font-medium", colors[kind] ?? "text-muted-foreground")}>
      {kind}
    </span>
  )
}

// ─── Span name formatting ───

function formatSpanName(name: string): string {
  return name
    .replace(/^(agent|tool|function):/, "")
    .replace(/^mcp__[^_]+__/, "")
    .replace(/^llm:/, "")
}

// ─── Collapsible section ───

function Section({
  title,
  defaultOpen = true,
  children,
  actions,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="an-focus-btn flex w-full items-center gap-2 rounded-md py-1.5 text-[13px] font-medium text-foreground hover:text-foreground/80 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
        {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  )
}

// ─── Error banner ───

function SpanErrorBanner({ error }: { error: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-md border border-border/60 bg-background overflow-hidden">
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-1.5">
          <span className="size-2 flex-none rounded-full bg-destructive" />
          <span className="text-[12px] font-medium text-foreground">Error</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigator.clipboard.writeText(error)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="an-focus-btn flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
          aria-label="Copy error"
        >
          <div className="relative size-3.5">
            <Copy className={cn(
              "absolute inset-0 size-3.5 transition-[opacity,transform] duration-200 ease-out",
              copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
            )} />
            <Check className={cn(
              "absolute inset-0 size-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
              copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )} />
          </div>
        </button>
      </div>
      <div className="px-2.5 py-2 max-h-[120px] overflow-y-auto">
        <p className="text-[12px] font-mono text-destructive leading-relaxed break-all whitespace-pre-wrap">{error}</p>
      </div>
    </div>
  )
}

// ─── JSON viewer ───

function formatJson(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

function JsonViewer({ value }: { value: string }) {
  return <CodeBlock code={formatJson(value)} language="json" className="bg-background border-[0.5px] border-border/60 [&_.shiki]:!bg-transparent [&_.shiki_pre]:!bg-transparent" />
}

// ─── Trace tree item with connector lines ───

const INDENT = 24
const LINE_COLOR = "border-border/50"

function TraceTreeItem({
  node,
  isSelected,
  onSelect,
  connectorLines,
  isLastChild,
}: {
  node: FlatSpanNode
  isSelected: boolean
  onSelect: () => void
  connectorLines: boolean[]
  isLastChild: boolean
}) {
  const duration = node.data.duration_ms != null
    ? formatDurationMs(node.data.duration_ms)
    : node.data.end_time
      ? formatDurationMs(toMs(node.data.end_time) - toMs(node.data.start_time))
      : "..."

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "an-focus-btn group relative flex items-center cursor-pointer transition-colors",
        isSelected ? "bg-foreground/[0.08]" : "hover:bg-foreground/[0.04]",
      )}
      style={{ paddingLeft: `${node.level * INDENT + 12}px` }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {/* Connector lines for each ancestor level */}
      {connectorLines.map((hasLine, i) =>
        hasLine ? (
          <div
            key={i}
            className={cn("absolute top-0 h-full border-l", LINE_COLOR)}
            style={{ left: `${i * INDENT + 12 + INDENT / 2}px` }}
          />
        ) : null,
      )}

      {/* Horizontal connector + corner for non-root nodes */}
      {node.level > 0 && (
        <>
          {/* Vertical line from parent (stops at middle for last child) */}
          <div
            className={cn("absolute border-l", LINE_COLOR)}
            style={{
              left: `${(node.level - 1) * INDENT + 12 + INDENT / 2}px`,
              top: 0,
              height: isLastChild ? "50%" : "100%",
            }}
          />
          {/* Horizontal connector from vertical line to icon */}
          <div
            className={cn("absolute border-t", LINE_COLOR)}
            style={{
              left: `${(node.level - 1) * INDENT + 12 + INDENT / 2}px`,
              top: "50%",
              width: `${INDENT / 2}px`,
            }}
          />
        </>
      )}

      {/* Error icon – absolutely positioned in the left margin */}
      {node.data.status === "error" && (
        <div
          className="absolute rounded-full bg-background"
          style={{ left: `${node.level * INDENT + 12 - 17}px`, top: '10px', padding: '1px' }}
        >
          <AlertCircle className="text-red-400" style={{ width: '13px', height: '13px' }} />
        </div>
      )}

      {/* Content */}
      <div className="flex items-center gap-2 py-2.5 pr-3">
        <div className="min-w-0 flex-1">
          <p className={cn(
            "truncate text-[13px] font-medium",
            node.data.status === "error"
              ? "text-red-400"
              : "text-foreground",
          )}>
            {formatSpanName(node.data.name)}
          </p>
          <div className="flex items-center gap-2">
            <KindLabel kind={node.data.kind} />
            <span className="text-[11px] text-muted-foreground tabular-nums">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail row ───

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[32px] w-full items-center justify-between gap-4 border-b border-border/40 py-1 px-2 last:border-none">
      <dt className="text-[13px] text-muted-foreground shrink-0">{label}</dt>
      <dd className="truncate text-[13px] font-mono text-foreground">{children}</dd>
    </div>
  )
}

// ─── Span detail panel ───

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
          onClick={handleCopy}
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
      <TooltipContent side="bottom">Copy &quot;{formatSpanName(span.name)}&quot; span as JSON</TooltipContent>
    </Tooltip>
  )
}

function SpanDetail({ span, detailWidth, onDetailResize }: { span: SpanData; detailWidth: number; onDetailResize: (e: React.MouseEvent) => void }) {
  const startTime = toMs(span.start_time)
  const endTime = span.end_time ? toMs(span.end_time) : null
  const duration = span.duration_ms ?? (endTime ? endTime - startTime : null)
  const attrs = (span.attributes ?? {}) as Record<string, unknown>

  const inputRaw = span.input != null
    ? typeof (span.input as any)?.raw === "string"
      ? (span.input as any).raw
      : JSON.stringify(span.input, null, 2)
    : null

  const outputRaw = span.output != null
    ? typeof (span.output as any)?.raw === "string"
      ? (span.output as any).raw
      : JSON.stringify(span.output, null, 2)
    : null

  const formatTs = (ms: number) =>
    new Date(ms).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions)

  const metaEntries = Object.entries(attrs).filter(
    ([k]) => !k.startsWith("llm."),
  )
  const llmEntries = Object.entries(attrs).filter(
    ([k]) => k.startsWith("llm."),
  )

  const hasPayload = inputRaw || outputRaw

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: details */}
      <div className="flex-shrink-0 overflow-y-auto p-3" style={{ width: detailWidth }}>
        {/* Info card */}
        <div className="rounded-md border border-border/60 bg-background">
          <div className="rounded-md bg-muted/20 px-1 py-1">
            <DetailRow label="Name">
              <span className="font-medium font-sans">{formatSpanName(span.name)}</span>
            </DetailRow>
            <DetailRow label="Kind">
              <KindLabel kind={span.kind} />
            </DetailRow>
            <DetailRow label="Status">
              <span className="flex items-center gap-1.5">
                <span className={cn(
                  "size-2 flex-none rounded-full",
                  span.status === "error" ? "bg-red-400" : span.status === "running" ? "bg-blue-400" : "bg-emerald-400",
                )} />
                <span className="capitalize font-sans font-medium">{span.status}</span>
              </span>
            </DetailRow>
            <DetailRow label="Duration">
              <span className="tabular-nums">{duration != null ? formatDurationMs(duration) : "—"}</span>
            </DetailRow>
            <DetailRow label="Start">
              <span className="tabular-nums">{formatTs(startTime)}</span>
            </DetailRow>
            {endTime && (
              <DetailRow label="Finished">
                <span className="tabular-nums">{formatTs(endTime)}</span>
              </DetailRow>
            )}
            {llmEntries.map(([k, v]) => (
              <DetailRow key={k} label={k.replace("llm.", "")}>
                <span className="tabular-nums">{String(v)}</span>
              </DetailRow>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <CopyStepButton span={span} />
        </div>
      </div>

      <ResizeHandle onMouseDown={onDetailResize} />

      {/* Right: error, payload, output & metadata */}
      <div className="flex-1 overflow-y-auto p-3">
        {(hasPayload || metaEntries.length > 0 || span.error) ? (
          <div className="space-y-3">
            {span.error && <SpanErrorBanner error={span.error} />}
            {inputRaw && (
              <Section title="Input">
                <JsonViewer value={inputRaw} />
              </Section>
            )}
            {outputRaw && (
              <Section title="Output">
                <JsonViewer value={outputRaw} />
              </Section>
            )}
            {metaEntries.length > 0 && (
              <Section title="Metadata" defaultOpen={false}>
                <div className="rounded-md border border-border/50 overflow-hidden">
                  {metaEntries.map(([k, v]) => {
                    const strVal = String(v)
                    const isJson = strVal.startsWith("[") || strVal.startsWith("{")
                    return (
                      <div key={k} className="border-b border-border/40 last:border-none px-3 py-2">
                        <p className="text-[11px] text-muted-foreground mb-1">{k}</p>
                        {isJson ? (
                          <JsonViewer value={strVal} />
                        ) : (
                          <CopyText value={strVal}>
                            <p className="text-[13px] font-mono text-foreground break-all hover:text-foreground/70 transition-colors">{strVal}</p>
                          </CopyText>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Section>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-muted-foreground">No payload data</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Trace View ───

function useResizeHandle(
  width: number,
  setWidth: (w: number) => void,
  min = 140,
  max = 500,
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

function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
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

export function TraceView({
  threadId,
  isStreaming,
}: {
  threadId: string
  isStreaming: boolean
}) {
  const { data, isLoading } = api.agentConfigs.getThreadSpans.useQuery(
    { threadId },
    { refetchInterval: isStreaming ? 2_000 : false },
  )

  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null)
  const [treeWidth, setTreeWidth] = useAtom(traceTreeWidthAtom)
  const [detailWidth, setDetailWidth] = useAtom(traceDetailWidthAtom)

  const handleTreeResize = useResizeHandle(treeWidth, setTreeWidth, 140, 400)
  const handleDetailResize = useResizeHandle(detailWidth, setDetailWidth, 180, 500)

  const { flatNodes } = useMemo(() => {
    if (!data?.spans?.length) return { flatNodes: [] as FlatSpanNode[] }
    const tree = createTreeFromFlatSpans(data.spans as SpanData[])
    if (!tree) return { flatNodes: [] as FlatSpanNode[] }
    return { flatNodes: flattenSpanTree(tree) }
  }, [data?.spans])

  // Auto-select root span
  useEffect(() => {
    if (flatNodes.length > 0 && selectedSpanId === null) {
      setSelectedSpanId(flatNodes[0]!.id)
    }
  }, [flatNodes, selectedSpanId])

  // Pre-compute connector metadata for each visible node in a single pass
  const nodeMetadata = useMemo(() => {
    const meta = new Map<string, { connectorLines: boolean[]; isLastChild: boolean }>()
    const parentChildrenMap = new Map<string, string[]>()

    // Build map of parent -> list of visible child ids
    for (const node of flatNodes) {
      if (node.parentId) {
        const siblings = parentChildrenMap.get(node.parentId) ?? []
        siblings.push(node.id)
        parentChildrenMap.set(node.parentId, siblings)
      }
    }

    // For each node, determine connector lines and isLastChild
    for (const node of flatNodes) {
      const isLastChild = node.parentId
        ? (parentChildrenMap.get(node.parentId) ?? []).at(-1) === node.id
        : true

      // Walk up ancestors to determine which levels have continuing lines
      const connectorLines: boolean[] = []
      let current = node
      const ancestors: FlatSpanNode[] = []
      while (current.parentId) {
        const parent = flatNodes.find((n) => n.id === current.parentId)
        if (!parent) break
        ancestors.unshift(parent)
        current = parent
      }
      // For each ancestor level (except the direct parent), check if that ancestor has more children after this node
      for (let i = 0; i < ancestors.length - 1; i++) {
        const ancestor = ancestors[i]!
        const ancestorChildren = parentChildrenMap.get(ancestor.id) ?? []
        const lastChild = ancestorChildren.at(-1)
        // If the last child of this ancestor is NOT an ancestor of the current node, the line continues
        const childInPath = ancestors[i + 1]?.id
        connectorLines.push(lastChild !== childInPath)
      }

      meta.set(node.id, { connectorLines, isLastChild })
    }
    return meta
  }, [flatNodes])

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
        <TraceIcon className="h-7 w-7 text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">No trace data available</p>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Trace tree */}
      <div className="flex-shrink-0 overflow-y-auto" style={{ width: treeWidth }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b-[0.5px] border-border/50">
          <span className="text-[13px] font-medium text-foreground">Trace tree</span>
        </div>
        {flatNodes.map((node) => {
          const meta = nodeMetadata.get(node.id) ?? { connectorLines: [], isLastChild: true }
          return (
            <TraceTreeItem
              key={node.id}
              node={node}
              isSelected={selectedSpanId === node.id}
              onSelect={() => setSelectedSpanId(node.id)}
              connectorLines={meta.connectorLines}
              isLastChild={meta.isLastChild}
            />
          )
        })}
      </div>

      <ResizeHandle onMouseDown={handleTreeResize} />

      {/* Middle + Right: Span detail */}
      {selectedSpan ? (
        <SpanDetail span={selectedSpan} detailWidth={detailWidth} onDetailResize={handleDetailResize} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-muted-foreground">Select a span to view details</p>
        </div>
      )}
    </div>
  )
}
