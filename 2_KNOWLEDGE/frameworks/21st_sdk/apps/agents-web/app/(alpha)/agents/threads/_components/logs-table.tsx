"use client"

import { cn } from "@/lib/utils"
import { TimestampCell } from "./timestamp-cell"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/features/agents/ui/1code/{components}/ui/tooltip"
import { AlertTriangle } from "lucide-react"
import {
  formatCost,
  formatDuration,
  formatMessagePreview,
  formatTokens,
} from "./logs-constants"

export interface ThreadRow {
  id: string
  status: string
  created_at: string | Date
  preview: string | null
  total_cost_usd?: number | null
  duration_ms?: number | null
  input_tokens?: number | null
  output_tokens?: number | null
  total_tokens?: number | null
  error_span_count?: number
  sandbox_id: string
  sandbox: {
    id: string
    client_sandbox_id: string
    agent: { id: string; name: string; slug: string }
  }
}

interface SandboxGroup {
  sandboxId: string
  clientSandboxId: string
  threads: ThreadRow[]
}

function groupBySandbox(threads: ThreadRow[]): SandboxGroup[] {
  const map = new Map<string, SandboxGroup>()
  for (const thread of threads) {
    const key = thread.sandbox.id
    let group = map.get(key)
    if (!group) {
      group = {
        sandboxId: key,
        clientSandboxId: thread.sandbox.client_sandbox_id,
        threads: [],
      }
      map.set(key, group)
    }
    group.threads.push(thread)
  }
  return Array.from(map.values())
}

function ThreadRowItem({
  thread,
  isSelected,
  onSelect,
  odd,
}: {
  thread: ThreadRow
  isSelected: boolean
  onSelect: (id: string | null) => void
  odd: boolean
}) {
  const isError = thread.status === "error"
  const isStreaming = thread.status === "streaming"
  const hasSpanErrors = !isError && (thread.error_span_count ?? 0) > 0

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "an-focus-btn flex h-8 cursor-pointer items-center text-[13px] transition-colors",
        "border-b-[0.5px] border-border",
        isError
          ? "bg-destructive/[0.04] hover:bg-destructive/[0.08]"
          : isSelected
            ? "bg-muted"
            : odd
              ? "bg-muted/25 hover:bg-muted/50"
              : "hover:bg-muted/50",
        isSelected && isError && "bg-destructive/[0.08]",
      )}
      onClick={() => onSelect(isSelected ? null : thread.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(isSelected ? null : thread.id)
        }
      }}
    >
      {/* Status icon + Created */}
      <div className="flex shrink-0 items-center" style={{ width: 192 }}>
        <div className="flex w-8 shrink-0 items-center justify-center">
          {isError && (
            <div className="h-[6px] w-[6px] rounded-full bg-destructive" />
          )}
          {isStreaming && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-[6px] w-[6px] animate-pulse rounded-full bg-blue-500" />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Streaming
              </TooltipContent>
            </Tooltip>
          )}
          {hasSpanErrors && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500/70" strokeWidth={2.5} />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {thread.error_span_count} tool {thread.error_span_count === 1 ? "error" : "errors"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <TimestampCell date={thread.created_at} className="tabular-nums text-foreground" />
      </div>

      {/* Thread ID */}
      <div className="shrink-0 text-[12px] font-mono text-foreground/50" style={{ width: 80 }}>
        {thread.id.slice(0, 8)}
      </div>

      {/* Message preview */}
      <div className="min-w-0 flex-1 px-2">
        <span className={cn(
          "block truncate text-[12px]",
          isError ? "text-destructive" : "text-foreground/60",
        )}>
          {formatMessagePreview(thread.preview)}
        </span>
      </div>

      {/* Tokens (in / out) */}
      <div className="shrink-0 tabular-nums text-[12px] text-foreground/50 text-right" style={{ width: 120 }}>
        {thread.input_tokens != null || thread.output_tokens != null
          ? `${formatTokens(thread.input_tokens)} / ${formatTokens(thread.output_tokens)}`
          : "-"}
      </div>

      {/* Cost */}
      <div className="shrink-0 tabular-nums text-[12px] text-foreground/70 text-right" style={{ width: 72 }}>
        {formatCost(thread.total_cost_usd)}
      </div>

      {/* Duration */}
      <div className="shrink-0 pr-4 tabular-nums text-[12px] text-foreground/70 text-right" style={{ width: 72 }}>
        {formatDuration(thread.duration_ms)}
      </div>
    </div>
  )
}

export function LogsTable({
  threads,
  selectedThreadId,
  onSelectThread,
  groupBySandboxEnabled,
  onSelectSandbox,
}: {
  threads: ThreadRow[]
  selectedThreadId: string | null
  onSelectThread: (id: string | null) => void
  groupBySandboxEnabled: boolean
  onSelectSandbox?: (sandboxId: string) => void
}) {
  if (!groupBySandboxEnabled) {
    return (
      <div>
        {threads.map((thread, i) => (
          <ThreadRowItem
            key={thread.id}
            thread={thread}
            isSelected={selectedThreadId === thread.id}
            onSelect={onSelectThread}
            odd={i % 2 === 1}
          />
        ))}
      </div>
    )
  }

  // Grouped mode
  const groups = groupBySandbox(threads)

  return (
    <div>
      {groups.map((group) => (
        <div key={group.sandboxId}>
          {/* Sandbox header */}
          <div className="flex h-8 items-center gap-2 border-b-[0.5px] border-border bg-muted/40 px-4">
            <button
              type="button"
              onClick={() => onSelectSandbox?.(group.sandboxId)}
              className="an-focus-btn rounded px-1 py-0.5 font-mono text-[11px] text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground/70"
            >
              {group.clientSandboxId}
            </button>
            <span className="text-[11px] text-foreground/40">
              {group.threads.length} {group.threads.length === 1 ? "thread" : "threads"}
            </span>
          </div>
          {group.threads.map((thread, i) => (
            <ThreadRowItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
              onSelect={onSelectThread}
              odd={i % 2 === 1}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
