"use client"

import { useMemo, useState, useCallback } from "react"
import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import {
  type Message,
  type ThreadStatusType,
  THREAD_DOT_COLORS,
  formatCost,
  formatDuration,
  formatTokens,
} from "./logs-constants"
import { Copy, Check } from "lucide-react"
import { CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyText } from "./copy-button"
import type { VisualConfig } from "@/components/features/agents/an/types"
import { ReadOnlyAgentChat } from "./read-only-agent-chat"

interface ThreadMetadataPanelProps {
  threadFromList: {
    id: string
    status: string
    created_at: string | Date
    preview: string | null
    total_cost_usd?: number | null
    duration_ms?: number | null
    sandbox_id: string
    sandbox: {
      id: string
      client_sandbox_id: string
      agent: { id: string; name: string; slug: string }
    }
  }
  threadFull: any | null
  messages: UIMessage[]
  isStreaming: boolean
  vc: VisualConfig
  onClose: () => void
  onFilterBySandbox?: (sandboxId: string) => void
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[32px] w-full items-center justify-between gap-4 border-b border-border/40 py-1 px-2 last:border-none">
      <dt className="text-[13px] text-muted-foreground shrink-0">{label}</dt>
      <dd className="truncate text-[13px] font-mono text-foreground">{children}</dd>
    </div>
  )
}

function ErrorBlock({ error }: { error: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="px-3 pt-2">
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
    </div>
  )
}

function CopyJsonButton({ label, tooltip, getData }: { label: string; tooltip: string; getData: () => string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const json = getData()
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [getData])

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
            <span>{label}</span>
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
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-1">
      {/* User message skeleton */}
      <div className="flex flex-col gap-1.5 items-end">
        <div className="h-3 w-12 rounded bg-foreground/[0.06] animate-pulse" />
        <div className="flex flex-col gap-1 rounded-lg bg-foreground/[0.04] px-3 py-2.5 max-w-[85%]">
          <div className="h-3 w-40 rounded bg-foreground/[0.08] animate-pulse" />
          <div className="h-3 w-28 rounded bg-foreground/[0.06] animate-pulse" />
        </div>
      </div>
      {/* Assistant message skeleton */}
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-16 rounded bg-foreground/[0.06] animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full rounded bg-foreground/[0.08] animate-pulse" />
          <div className="h-3 w-[90%] rounded bg-foreground/[0.07] animate-pulse" />
          <div className="h-3 w-[75%] rounded bg-foreground/[0.06] animate-pulse" />
          <div className="h-3 w-[60%] rounded bg-foreground/[0.05] animate-pulse" />
        </div>
      </div>
      {/* Tool call skeleton */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded bg-foreground/[0.06] animate-pulse" />
          <div className="h-3 w-24 rounded bg-foreground/[0.07] animate-pulse" />
        </div>
        <div className="ml-5 rounded-md border border-border/40 px-2.5 py-2">
          <div className="h-3 w-[80%] rounded bg-foreground/[0.06] animate-pulse" />
          <div className="h-3 w-[50%] rounded bg-foreground/[0.05] animate-pulse mt-1.5" />
        </div>
      </div>
      {/* Second assistant message skeleton */}
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-16 rounded bg-foreground/[0.06] animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full rounded bg-foreground/[0.08] animate-pulse" />
          <div className="h-3 w-[85%] rounded bg-foreground/[0.07] animate-pulse" />
          <div className="h-3 w-[45%] rounded bg-foreground/[0.05] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function ThreadMetadataPanel({
  threadFromList,
  threadFull,
  messages,
  isStreaming,
  vc,
  onClose,
  onFilterBySandbox,
}: ThreadMetadataPanelProps) {
  const status = threadFromList.status as ThreadStatusType

  const inputTokens = threadFull?.input_tokens
  const outputTokens = threadFull?.output_tokens
  const cost = threadFull?.total_cost_usd ?? threadFromList.total_cost_usd
  const duration = threadFull?.duration_ms ?? threadFromList.duration_ms

  const error = threadFull?.error

  const sandboxLabel = useMemo(() => {
    const cid = threadFromList.sandbox.client_sandbox_id
    return cid.length > 20
      ? `${cid.slice(0, 8)}...${cid.slice(-4)}`
      : cid
  }, [threadFromList.sandbox.client_sandbox_id])

  const hasMessages = messages.length > 0

  const getChatJson = useCallback(() => {
    const rawMessages = (threadFull?.messages as Message[] | undefined) ?? []
    const payload = {
      thread_id: threadFromList.id,
      status: threadFromList.status,
      created_at: threadFromList.created_at,
      duration_ms: duration,
      total_cost_usd: cost,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      error: error ?? null,
      messages: rawMessages.map((msg: Message) => ({
        id: msg.id,
        role: msg.role,
        ...(msg.content ? { content: msg.content } : {}),
        ...(msg.parts?.length ? { parts: msg.parts } : {}),
      })),
    }
    return JSON.stringify(payload, null, 2)
  }, [threadFromList, threadFull, duration, cost, inputTokens, outputTokens, error])

  const createdAt = useMemo(() => {
    const d = new Date(threadFromList.created_at)
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }, [threadFromList.created_at])

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {/* Detail card */}
      <div className="shrink-0 px-3 pt-3 pb-3">
        <div className="rounded-md border border-border/60 bg-background">
          <div className="rounded-md bg-muted/20 px-1 py-1">
          <DetailRow label="Status">
            <span className="flex items-center gap-1.5">
              <span className={cn(
                "size-2 flex-none rounded-full",
                THREAD_DOT_COLORS[status] ?? THREAD_DOT_COLORS.completed,
              )} />
              <span className="capitalize font-sans font-medium">{threadFromList.status}</span>
            </span>
          </DetailRow>
          {duration != null && (
            <DetailRow label="Duration">
              <span className="tabular-nums">{formatDuration(duration)}</span>
            </DetailRow>
          )}
          {cost != null && (
            <DetailRow label="Cost">
              <span className="tabular-nums">{formatCost(cost)}</span>
            </DetailRow>
          )}
          {inputTokens != null && outputTokens != null && (
            <DetailRow label="Tokens">
              <span className="tabular-nums">
                {formatTokens(inputTokens)} in / {formatTokens(outputTokens)} out
              </span>
            </DetailRow>
          )}
          <DetailRow label="Thread ID">
            <CopyText value={threadFromList.id}>
              <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">
                {threadFromList.id.slice(0, 8)}...{threadFromList.id.slice(-4)}
              </span>
            </CopyText>
          </DetailRow>
          <DetailRow label="Sandbox">
            <button
              type="button"
              onClick={() => onFilterBySandbox?.(threadFromList.sandbox.id)}
              className="text-foreground/70 hover:text-foreground transition-colors"
              title="Filter by this sandbox"
            >
              {sandboxLabel}
            </button>
          </DetailRow>
          <DetailRow label="Created">
              <span className="font-sans tabular-nums">{createdAt}</span>
            </DetailRow>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorBlock error={error} />}

      {/* Chat messages */}
      <div className="flex flex-1 min-h-0 flex-col px-3 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2 pl-2 pr-1">
          <p className="text-[13px] font-medium text-foreground">Chat History</p>
          <CopyJsonButton label="Copy as JSON" tooltip="Copy thread messages as JSON" getData={getChatJson} />
        </div>
        <div
          className="min-h-0 flex-1 rounded-md border border-border/60 bg-background overflow-hidden"
          style={{ fontFamily: vc.fontFamily || undefined }}
        >
          <div className="h-full rounded-md bg-muted/20">
            {hasMessages || isStreaming ? (
              <ReadOnlyAgentChat
                messages={messages}
                status={isStreaming ? "streaming" : "ready"}
                className="h-full"
                transparent
              />
            ) : threadFull ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground/60">
                No messages
              </p>
            ) : (
              <MessagesSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
