"use client"

import { useState, useMemo, useCallback } from "react"
import type { UIMessage } from "ai"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { MessageSquareText } from "lucide-react"
import { TimelineIcon, TraceIcon, CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import type { VisualConfig } from "@/components/features/agents/an/types"
import {
  type Message,
  formatTokens,
  formatCost,
  formatDuration,
} from "./logs-constants"
import { SidebarTimelineView } from "./sidebar-timeline-view"
import { TraceView } from "./trace-view"
import { ReadOnlyAgentChat } from "./read-only-agent-chat"
import { api } from "@/trpc/client"
import type { SpanData } from "./span-tree-utils"

// ─── Copy JSON button ───

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
          className="relative flex h-7 items-center rounded-md px-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors overflow-hidden"
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

type TabId = "trace" | "timeline" | "chat"

const TABS: { id: TabId; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "trace", label: "Trace", icon: TraceIcon },
  { id: "timeline", label: "Timeline", icon: TimelineIcon },
  { id: "chat", label: "Chat", icon: MessageSquareText },
]

export function SidebarThreadView({
  thread,
  threadIndex,
  vc,
}: {
  thread: any
  threadIndex: number
  vc: VisualConfig
}) {
  const [activeTab, setActiveTab] = useState<TabId>("trace")
  const messages = (thread.messages as Message[] | null) ?? []
  const uiMessages = useMemo(
    () => (thread.messages as UIMessage[] | null) ?? [],
    [thread.messages],
  )
  const hasMessages = messages.length > 0
  const isStreaming = thread.status === "streaming"

  // Fetch spans for "Copy Trace JSON"
  const { data: spansData } = api.agentConfigs.getThreadSpans.useQuery(
    { threadId: thread.id },
    { refetchInterval: isStreaming ? 2_000 : false },
  )

  const getChatJson = useCallback(() => {
    const payload = {
      thread_id: thread.id,
      status: thread.status,
      created_at: thread.created_at,
      duration_ms: thread.duration_ms,
      total_cost_usd: thread.total_cost_usd,
      input_tokens: thread.input_tokens,
      output_tokens: thread.output_tokens,
      error: thread.error ?? null,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        ...(msg.content ? { content: msg.content } : {}),
        ...(msg.parts?.length ? { parts: msg.parts } : {}),
      })),
    }
    return JSON.stringify(payload, null, 2)
  }, [thread, messages])

  const getTraceJson = useCallback(() => {
    const spans = (spansData?.spans as SpanData[] | undefined) ?? []
    const payload = {
      thread_id: thread.id,
      spans: spans.map((s) => ({
        span_id: s.span_id,
        parent_span_id: s.parent_span_id,
        name: s.name,
        kind: s.kind,
        status: s.status,
        duration_ms: s.duration_ms,
        error: s.error,
        input: s.input,
        output: s.output,
        attributes: s.attributes,
      })),
    }
    return JSON.stringify(payload, null, 2)
  }, [thread.id, spansData?.spans])

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden"
      style={{ fontFamily: vc.fontFamily || undefined }}
    >
      {/* Usage metrics */}
      <div className="flex items-center gap-4 flex-shrink-0 border-b-[0.5px] border-border px-4 py-2.5">
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium text-foreground/40">Status</p>
          <div className="flex items-center gap-1 h-5 -ml-[3px]">
            <span className="size-4 flex items-center justify-center">
              <span className={cn(
                "size-2.5 flex-none rounded-full",
                thread.status === "completed" ? "bg-emerald-500" :
                thread.status === "error" ? "bg-red-500" :
                thread.status === "streaming" || thread.status === "running" ? "bg-blue-500" :
                "bg-muted-foreground",
              )} />
            </span>
            <span className="text-[12px] font-medium text-foreground capitalize">{thread.status}</span>
          </div>
        </div>
        {thread.duration_ms != null && (
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">Duration</p>
            <p className="text-[12px] tabular-nums text-foreground">{formatDuration(thread.duration_ms)}</p>
          </div>
        )}
        {thread.total_cost_usd != null && (
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">Cost</p>
            <p className="text-[12px] tabular-nums text-foreground">{formatCost(thread.total_cost_usd)}</p>
          </div>
        )}
        {thread.input_tokens != null && (
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">In</p>
            <p className="text-[12px] tabular-nums text-foreground">{formatTokens(thread.input_tokens)}</p>
          </div>
        )}
        {thread.output_tokens != null && (
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-foreground/40">Out</p>
            <p className="text-[12px] tabular-nums text-foreground">{formatTokens(thread.output_tokens)}</p>
          </div>
        )}

        {/* Copy as JSON buttons */}
        <div className="ml-auto flex items-center gap-1">
          <CopyJsonButton label="Chat JSON" tooltip="Copy thread messages as JSON" getData={getChatJson} />
          <CopyJsonButton label="Trace JSON" tooltip="Copy trace spans as JSON" getData={getTraceJson} />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex h-10 shrink-0 items-center border-b-[0.5px] border-border px-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group relative flex h-full items-center gap-1.5 px-2.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className={cn(
                "absolute inset-x-1 inset-y-1.5 rounded-md transition-colors",
                isActive ? "bg-foreground/5" : "group-hover:bg-foreground/5",
              )} />
              {isActive && (
                <motion.div
                  layoutId="thread-panel-tab-line"
                  className="absolute inset-x-1 bottom-0 h-[1.5px] rounded-full bg-foreground"
                  transition={{ duration: 0.15 }}
                />
              )}
              <tab.icon className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Error */}
      {thread.error && (
        <div className="mx-4 mt-3 rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-[12px] text-destructive">{thread.error}</p>
        </div>
      )}

      {/* All tabs always mounted — hidden with CSS to avoid refetch on switch */}
      <div className={cn("min-h-0 flex-1 flex flex-col overflow-hidden", activeTab !== "trace" && "hidden")}>
        <TraceView
          threadId={thread.id}
          isStreaming={isStreaming}
        />
      </div>
      <div className={cn("min-h-0 flex-1 flex flex-col overflow-hidden", activeTab !== "timeline" && "hidden")}>
        <SidebarTimelineView
          threadId={thread.id}
          isStreaming={isStreaming}
          autoSelectRoot
        />
      </div>
      <div className={cn("flex-1 min-h-0 overflow-hidden px-4 py-3", activeTab !== "chat" && "hidden")}>
        {hasMessages || isStreaming ? (
          <ReadOnlyAgentChat
            messages={uiMessages}
            status={isStreaming ? "streaming" : "ready"}
            className="h-full"
          />
        ) : (
          <p className="py-12 text-center text-[13px] text-muted-foreground">
            No messages
          </p>
        )}
      </div>
    </div>
  )
}
