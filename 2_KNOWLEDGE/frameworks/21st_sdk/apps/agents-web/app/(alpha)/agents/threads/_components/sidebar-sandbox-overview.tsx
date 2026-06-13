"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { TimestampCell } from "./timestamp-cell"
import { ChevronRight } from "lucide-react"
import { CopyText } from "./copy-button"
import {
  type ThreadStatusType,
  THREAD_DOT_COLORS,
  formatTokens,
  formatCost,
  formatDuration,
} from "./logs-constants"

export function SidebarSandboxOverview({
  sandbox,
  onSelectThread,
}: {
  sandbox: {
    id: string
    client_sandbox_id: string
    status: string
    created_at: string
    updated_at: string
    agent: { name: string }
    sandbox_id?: string | null
    threads: any[]
  }
  onSelectThread: (threadId: string) => void
}) {
  const totals = useMemo(() => {
    const threads = sandbox.threads ?? []
    return {
      tokens: threads.reduce(
        (s: number, d: any) => s + (d.total_tokens ?? 0),
        0,
      ),
      cost: threads.reduce(
        (s: number, d: any) => s + (d.total_cost_usd ?? 0),
        0,
      ),
      duration: threads.reduce(
        (s: number, d: any) => s + (d.duration_ms ?? 0),
        0,
      ),
    }
  }, [sandbox.threads])

  const threads = sandbox.threads ?? []

  return (
    <div className="flex flex-col">
      {/* Sandbox info */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Chat ID */}
        <div className="min-w-0 space-y-0.5">
          <p className="text-[10px] font-medium text-foreground/40">
            Chat ID
          </p>
          <CopyText value={sandbox.client_sandbox_id}>
            <span className="block truncate font-mono text-[12px] text-foreground">
              {sandbox.client_sandbox_id}
            </span>
          </CopyText>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">
              Agent
            </p>
            <p className="text-[12px] font-medium">{sandbox.agent.name}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">
              Created
            </p>
            <TimestampCell date={sandbox.created_at} className="text-[12px] tabular-nums text-foreground" />
          </div>
          {totals.tokens > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-foreground/40">
                Tokens
              </p>
              <p className="text-[12px] font-medium tabular-nums">
                {totals.tokens.toLocaleString()}
              </p>
            </div>
          )}
          {totals.cost > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-foreground/40">
                Cost
              </p>
              <p className="text-[12px] font-medium tabular-nums">
                {formatCost(totals.cost)}
              </p>
            </div>
          )}
          {totals.duration > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-foreground/40">
                Duration
              </p>
              <p className="text-[12px] font-medium tabular-nums">
                {formatDuration(totals.duration)}
              </p>
            </div>
          )}
          {sandbox.sandbox_id && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-foreground/40">
                Sandbox
              </p>
              <CopyText value={sandbox.sandbox_id}>
                <span className="font-mono text-[12px] text-foreground">
                  {sandbox.sandbox_id.length > 12
                    ? `${sandbox.sandbox_id.slice(0, 4)}...${sandbox.sandbox_id.slice(-4)}`
                    : sandbox.sandbox_id}
                </span>
              </CopyText>
            </div>
          )}
        </div>
      </div>

      {/* Thread table */}
      {threads.length > 0 && (
        <div>
          <div className="flex h-8 items-center border-b-[0.5px] border-border bg-muted/30 px-4 text-[10px] font-medium text-muted-foreground">
            <span className="w-7 shrink-0">#</span>
            <span className="flex-1">Status</span>
            <span className="w-16 text-right">Tokens</span>
            <span className="w-14 text-right">Cost</span>
            <span className="w-14 text-right">Time</span>
            <span className="w-5" />
          </div>

          {threads.map((thread: any, i: number) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelectThread(thread.id)}
              className={cn(
                "an-focus-btn flex w-full items-center px-4 py-2 text-left transition-colors hover:bg-secondary/40",
                i < threads.length - 1 && "border-b-[0.5px] border-border/50",
                i % 2 === 1 && "bg-muted/25",
              )}
            >
              <span className="w-7 shrink-0 text-[12px] text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex flex-1 items-center gap-1.5">
                <div
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    THREAD_DOT_COLORS[
                      thread.status as ThreadStatusType
                    ] ?? THREAD_DOT_COLORS.streaming,
                  )}
                />
                <span
                  className={cn(
                    "text-[12px]",
                    thread.status === "error"
                      ? "text-destructive"
                      : thread.status === "streaming"
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {thread.status}
                </span>
              </div>
              <span className="w-16 text-right text-[12px] tabular-nums text-muted-foreground">
                {formatTokens(thread.total_tokens)}
              </span>
              <span className="w-14 text-right text-[12px] tabular-nums text-muted-foreground">
                {formatCost(thread.total_cost_usd)}
              </span>
              <span className="w-14 text-right text-[12px] tabular-nums text-muted-foreground">
                {formatDuration(thread.duration_ms)}
              </span>
              <span className="flex w-5 justify-end">
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
