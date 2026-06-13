"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { api } from "@/trpc/client"
import { motion } from "motion/react"
import type { UIMessage } from "ai"
import { Activity, ScrollText, Search, X, ChevronUp, ChevronDown } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import type { VisualConfig } from "@/components/features/agents/an/types"
import type { SpanData } from "./span-tree-utils"
import { CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import {
  type ThreadStatusType,
  DEFAULT_VC,
  getDateFromPreset,
  logsRightPanelWidthAtom,
  logsBottomPanelHeightAtom,
} from "./logs-constants"
import type { DateRangeValue } from "./logs-date-range-picker"
import { LogsTable } from "./logs-table"
import { LogsTableSkeleton } from "./logs-table-skeleton"
import { LogsSidebar, type SidebarMode } from "./logs-sidebar"
import { ThreadMetadataPanel } from "./thread-metadata-panel"
import { SidebarTimelineView } from "./sidebar-timeline-view"
import { TraceView } from "./trace-view"
import { LogsDateRangePicker } from "./logs-date-range-picker"
import { ResizableSidebar } from "@/components/features/agents/ui/canvas/[id]/{components}/resizable-sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/ui/1code/{components}/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/features/agents/ui/1code/{components}/ui/tooltip"
import { Kbd } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/kbd"
import { cn } from "@/lib/utils"

function TimelineIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14.5 6.5H8.81314C7.00339 6.5 6.38405 8.91123 7.96978 9.78338L16.0302 14.2166C17.616 15.0888 16.9966 17.5 15.1869 17.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.75 7.25V5.75C14.75 4.64543 15.6454 3.75 16.75 3.75H18.25C19.3546 3.75 20.25 4.64543 20.25 5.75V7.25C20.25 8.35457 19.3546 9.25 18.25 9.25H16.75C15.6454 9.25 14.75 8.35457 14.75 7.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.75 18.25V16.75C3.75 15.6454 4.64543 14.75 5.75 14.75H7.25C8.35457 14.75 9.25 15.6454 9.25 16.75V18.25C9.25 19.3546 8.35457 20.25 7.25 20.25H5.75C4.64543 20.25 3.75 19.3546 3.75 18.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TraceIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9.25 16.25C9.25 15.6977 8.80228 15.25 8.25 15.25H4.75C4.19772 15.25 3.75 15.6977 3.75 16.25V16.4375C3.75 17.9908 4.98122 19.25 6.5 19.25C8.01878 19.25 9.25 17.9908 9.25 16.4375V16.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9.52637 12.2422C9.38081 12.5656 9.04762 12.75 8.69296 12.75H4.30709C3.95242 12.75 3.61921 12.5656 3.47366 12.2421C2.02779 9.02924 2.60768 2.75 6.49986 2.75C10.392 2.75 10.9723 9.02927 9.52637 12.2422Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20.25 18.25C20.25 17.6977 19.8023 17.25 19.25 17.25H15.75C15.1977 17.25 14.75 17.6977 14.75 18.25V18.4375C14.75 19.9908 15.9812 21.25 17.5 21.25C19.0188 21.25 20.25 19.9908 20.25 18.4375V18.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20.5264 14.2422C20.3808 14.5656 20.0476 14.75 19.693 14.75H15.3071C14.9524 14.75 14.6192 14.5656 14.4737 14.2421C13.0278 11.0292 13.6077 4.75 17.4999 4.75C21.392 4.75 21.9723 11.0293 20.5264 14.2422Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

type SidebarState =
  | { type: "thread"; threadId: string }
  | { type: "sandbox"; sandboxId: string }
  | null

type BottomTab = "timeline" | "trace"

const BOTTOM_TABS: { id: BottomTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "timeline", label: "Timeline", icon: TimelineIcon },
  { id: "trace", label: "Trace", icon: TraceIcon },
]

function CopyTraceButton({ threadId, isStreaming }: { threadId: string; isStreaming: boolean }) {
  const [copied, setCopied] = useState(false)
  const { data: spansData } = api.agentConfigs.getThreadSpans.useQuery(
    { threadId },
    { refetchInterval: isStreaming ? 2_000 : false },
  )

  const handleCopy = useCallback(() => {
    const spans = (spansData?.spans as SpanData[] | undefined) ?? []
    const payload = {
      thread_id: threadId,
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
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [threadId, spansData?.spans])

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
      <TooltipContent side="bottom">Copy trace spans as JSON</TooltipContent>
    </Tooltip>
  )
}

export interface ThreadLogsViewProps {
  teamId: string
  agentId?: string
  deploymentId?: string
  initialThreadId?: string | null

  statusFilter?: ThreadStatusType[]
  onStatusFilterChange?: (v: ThreadStatusType[]) => void
  dateRange?: DateRangeValue
  onDateRangeChange?: (v: DateRangeValue) => void
  searchQuery?: string
  onSearchQueryChange?: (v: string) => void
  agentFilter?: string[]
  sandboxFilter?: string[]
  onSandboxFilterChange?: (v: string[] | ((prev: string[]) => string[])) => void
  groupBySandbox?: boolean

  hideToolbar?: boolean
}

export function ThreadLogsView({
  teamId,
  agentId,
  deploymentId,
  initialThreadId,
  statusFilter: controlledStatusFilter,
  onStatusFilterChange,
  dateRange: controlledDateRange,
  onDateRangeChange,
  searchQuery: controlledSearchQuery,
  onSearchQueryChange,
  agentFilter,
  sandboxFilter: controlledSandboxFilter,
  onSandboxFilterChange,
  groupBySandbox: controlledGroupBySandbox,
  hideToolbar = false,
}: ThreadLogsViewProps) {
  const [internalStatusFilter, setInternalStatusFilter] = useState<ThreadStatusType[]>([])
  const [internalDateRange, setInternalDateRange] = useState<DateRangeValue>({ preset: "all" })
  const [internalSearchQuery, setInternalSearchQuery] = useState("")
  const [internalSandboxFilter, setInternalSandboxFilter] = useState<string[]>([])
  const [internalGroupBySandbox] = useState(false)

  const statusFilter = controlledStatusFilter ?? internalStatusFilter
  const setStatusFilter = onStatusFilterChange ?? setInternalStatusFilter
  const dateRange = controlledDateRange ?? internalDateRange
  const setDateRange = onDateRangeChange ?? setInternalDateRange
  const searchQuery = controlledSearchQuery ?? internalSearchQuery
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery
  const sandboxFilter = controlledSandboxFilter ?? internalSandboxFilter
  const setSandboxFilter = onSandboxFilterChange ?? setInternalSandboxFilter
  const groupBySandbox = controlledGroupBySandbox ?? internalGroupBySandbox

  const [sidebarState, setSidebarState] = useState<SidebarState>(
    initialThreadId ? { type: "thread", threadId: initialThreadId } : null,
  )

  const debouncedSearch = useDebounce(searchQuery, 300)

  const {
    data: threadsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentConfigs.listThreads.useInfiniteQuery(
    {
      teamId,
      agentId,
      ...(deploymentId && { deploymentId }),
      status:
        statusFilter.length === 1
          ? statusFilter[0]
          : undefined,
      sandboxId: sandboxFilter.length === 1 ? sandboxFilter[0] : undefined,
      search: debouncedSearch || undefined,
      createdAfter: getDateFromPreset(dateRange.preset, dateRange.from),
      createdBefore:
        dateRange.preset === "custom" && dateRange.to
          ? dateRange.to.toISOString()
          : undefined,
      limit: 50,
    },
    {
      enabled: !!teamId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const threads = useMemo(() => {
    let all = threadsData?.pages.flatMap((page) => page.threads) ?? []
    if (statusFilter.length > 1) {
      all = all.filter((t) => statusFilter.includes(t.status as ThreadStatusType))
    }
    if (sandboxFilter.length > 1) {
      all = all.filter((t) => sandboxFilter.includes(t.sandbox_id))
    }
    if (agentFilter && agentFilter.length > 1) {
      all = all.filter((t) => agentFilter.includes((t as any).sandbox?.agent_id))
    }
    return all
  }, [threadsData, statusFilter, sandboxFilter, agentFilter])

  const hasStreamingThreads = threads.some((t) => t.status === "streaming")

  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const selectedThreadId = sidebarState?.type === "thread" ? sidebarState.threadId : null
  const selectedSandboxIdForSidebar = sidebarState?.type === "sandbox" ? sidebarState.sandboxId : null

  const selectedThreadFromList = useMemo(
    () => (selectedThreadId ? threads.find((t) => t.id === selectedThreadId) : null),
    [threads, selectedThreadId],
  )

  const sandboxIdToFetch = selectedSandboxIdForSidebar ?? selectedThreadFromList?.sandbox_id ?? null

  const { data: fetchedSandbox } = api.agentConfigs.getSandbox.useQuery(
    { id: sandboxIdToFetch! },
    {
      enabled: !!sandboxIdToFetch,
      refetchInterval:
        selectedThreadFromList?.status === "streaming" ? 2_000 : false,
    },
  )

  const selectedThreadFull = useMemo(() => {
    if (!fetchedSandbox?.threads || !selectedThreadId) return null
    return fetchedSandbox.threads.find((t: any) => t.id === selectedThreadId) ?? null
  }, [fetchedSandbox?.threads, selectedThreadId])

  const vc: VisualConfig = DEFAULT_VC
  const [bottomTab, setBottomTab] = useState<BottomTab>("timeline")

  const threadMessages = useMemo(() => {
    return (selectedThreadFull?.messages as UIMessage[] | null) ?? []
  }, [selectedThreadFull?.messages])

  const closeSidebar = useCallback(() => setSidebarState(null), [])

  const handleSelectThread = useCallback((id: string | null) => {
    if (id) {
      setSidebarState({ type: "thread", threadId: id })
    } else {
      setSidebarState(null)
    }
  }, [])

  const handleSelectSandbox = useCallback((sandboxId: string) => {
    setSidebarState({ type: "sandbox", sandboxId })
  }, [])

  const handleFilterBySandbox = useCallback((sandboxId: string) => {
    setSandboxFilter((prev: string[]) => prev.includes(sandboxId) ? prev : [...prev, sandboxId])
  }, [setSandboxFilter])

  // ─── Keyboard navigation (j/k, arrows) ───
  const threadIds = useMemo(() => threads.map((t) => t.id), [threads])

  const currentIndex = useMemo(
    () => (selectedThreadId ? threadIds.indexOf(selectedThreadId) : -1),
    [selectedThreadId, threadIds],
  )

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex >= 0 && currentIndex < threadIds.length - 1

  const goToPrev = useCallback(() => {
    if (canGoPrev) {
      handleSelectThread(threadIds[currentIndex - 1]!)
    }
  }, [canGoPrev, currentIndex, threadIds, handleSelectThread])

  const goToNext = useCallback(() => {
    if (canGoNext) {
      handleSelectThread(threadIds[currentIndex + 1]!)
    }
  }, [canGoNext, currentIndex, threadIds, handleSelectThread])

  const isThreadSelected = sidebarState?.type === "thread"

  useHotkeys(
    "up, k",
    (e) => { e.preventDefault(); goToPrev() },
    { enabled: isThreadSelected, enableOnFormTags: false },
    [goToPrev, isThreadSelected],
  )

  useHotkeys(
    "down, j",
    (e) => { e.preventDefault(); goToNext() },
    { enabled: isThreadSelected, enableOnFormTags: false },
    [goToNext, isThreadSelected],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarState) {
        closeSidebar()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [sidebarState, closeSidebar])

  const isSandboxSelected = sidebarState?.type === "sandbox"
  const sidebarMode: SidebarMode = sidebarState?.type === "sandbox"
    ? { type: "sandbox" }
    : { type: "thread" }

  const isStreamingThread = selectedThreadFromList?.status === "streaming"

  const statusFilterValue = statusFilter.length === 1 ? statusFilter[0]! : "all"

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ─── Left column: table + bottom panel ─── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Table area */}
          <motion.div
            className="flex flex-1 flex-col overflow-auto bg-tl-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {/* Inline toolbar */}
            {!hideToolbar && (
              <div className="flex h-10 shrink-0 items-center gap-1.5 px-2">
                <div className="relative max-w-[280px] flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threads..."
                    className="an-focus-input h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-8 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="an-focus-btn absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <Select
                  value={statusFilterValue}
                  onValueChange={(v) => setStatusFilter(v === "all" ? [] : [v as ThreadStatusType])}
                >
                  <SelectTrigger className="h-8 w-[140px] rounded-md bg-foreground/[0.05] border-border hover:border-foreground/15 text-[12px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="streaming">Streaming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <LogsDateRangePicker value={dateRange} onChange={setDateRange} triggerClassName="min-w-[120px]" />

                {hasStreamingThreads && (
                  <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                    <span>Live</span>
                  </div>
                )}
              </div>
            )}

            {/* Column headers */}
            <div className="flex h-9 shrink-0 items-center border-y-[0.5px] border-border bg-muted/30 text-[11px] font-medium text-muted-foreground">
              <div className="shrink-0 pl-8" style={{ width: 192 }}>Created</div>
              <div className="shrink-0" style={{ width: 80 }}>Thread</div>
              <div className="min-w-0 flex-1 px-2">First Message</div>
              <div className="shrink-0 text-right" style={{ width: 120 }}>In / Out</div>
              <div className="shrink-0 text-right" style={{ width: 72 }}>Cost</div>
              <div className="shrink-0 pr-4 text-right" style={{ width: 72 }}>Duration</div>
            </div>

            {/* Table body */}
            {isLoading ? (
              <LogsTableSkeleton />
            ) : !threads.length ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <Activity className="h-7 w-7 text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">
                  {debouncedSearch ||
                  statusFilter.length > 0 ||
                  dateRange.preset !== "all" ||
                  sandboxFilter.length > 0
                    ? "No results match your filters."
                    : "No threads yet. Sessions will appear here once started."}
                </p>
              </div>
            ) : (
              <>
                <LogsTable
                  threads={threads as any}
                  selectedThreadId={selectedThreadId}
                  onSelectThread={handleSelectThread}
                  groupBySandboxEnabled={groupBySandbox}
                  onSelectSandbox={handleSelectSandbox}
                />
                {hasNextPage && (
                  <div ref={sentinelRef} className="flex items-center justify-center py-3">
                    {isFetchingNextPage && <AnLogoSpinner />}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* ─── Bottom: timeline / trace panel ─── */}
          <ResizableSidebar
            isOpen={isThreadSelected && !!selectedThreadId}
            onClose={closeSidebar}
            widthAtom={logsBottomPanelHeightAtom}
            side="bottom"
            minWidth={150}
            maxWidth={600}
            animationDuration={0.2}
            showResizeTooltip
            closeHotkey="Esc"
            disableClickToClose
            className="border-t-[0.5px] border-border bg-background"
          >
            <div className="flex h-full flex-col">
              {/* Bottom panel tabs */}
              <div className="shrink-0 border-b-[0.5px] border-border/50">
                <div className="flex h-10 items-center px-1.5">
                  {BOTTOM_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setBottomTab(tab.id)}
                      className={cn(
                        "an-focus-btn group relative flex h-10 items-center gap-1.5 px-2.5 text-[13px] font-medium transition-colors rounded-md",
                        bottomTab === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-x-1 inset-y-1.5 rounded-md transition-colors",
                          bottomTab === tab.id ? "bg-foreground/5" : "group-hover:bg-foreground/5",
                        )}
                      />
                      {bottomTab === tab.id && (
                        <motion.div
                          layoutId="bottom-panel-tab-line"
                          className="absolute inset-x-1 bottom-0 h-[1.5px] bg-foreground rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <tab.icon className="relative h-3.5 w-3.5" />
                      <span className="relative">{tab.label}</span>
                    </button>
                  ))}
                  {selectedThreadId && (
                    <div className="ml-auto pr-1.5">
                      <CopyTraceButton threadId={selectedThreadId} isStreaming={!!isStreamingThread} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom panel content */}
              {selectedThreadId && (
                <>
                  <div className={cn("min-h-0 flex-1 flex flex-col overflow-hidden", bottomTab !== "timeline" && "hidden")}>
                    <SidebarTimelineView
                      threadId={selectedThreadId}
                      isStreaming={!!isStreamingThread}
                      autoSelectRoot
                    />
                  </div>
                  <div className={cn("min-h-0 flex-1 flex flex-col overflow-hidden", bottomTab !== "trace" && "hidden")}>
                    <TraceView
                      threadId={selectedThreadId}
                      isStreaming={!!isStreamingThread}
                    />
                  </div>
                </>
              )}
            </div>
          </ResizableSidebar>
        </div>

        {/* ─── Right: detail + chat panel ─── */}
        <ResizableSidebar
          isOpen={isThreadSelected && !!selectedThreadFromList}
          onClose={closeSidebar}
          widthAtom={logsRightPanelWidthAtom}
          side="right"
          minWidth={300}
          maxWidth={700}
          animationDuration={0.2}
          showResizeTooltip
          closeHotkey="Esc"
          className="border-l-[0.5px] border-border bg-background"
        >
          {selectedThreadFromList && (
            <div className="flex h-full flex-col overflow-hidden">
              {/* Nav header with prev/next */}
              <div className="flex h-9 shrink-0 items-center gap-2 border-b-[0.5px] border-border/50 px-3">
                <span className="text-xs font-medium text-foreground">Thread</span>

                <div className="ml-auto flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled={!canGoPrev}
                        onClick={goToPrev}
                        className={cn(
                          "an-focus-btn flex h-6 w-6 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.97]",
                          !canGoPrev && "pointer-events-none opacity-30",
                        )}
                        aria-label="Previous thread"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="flex items-center gap-1.5">
                        Previous
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Kbd size="xs">↑</Kbd>
                          <span className="text-popover-foreground">or</span>
                          <Kbd size="xs">K</Kbd>
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={goToNext}
                        className={cn(
                          "an-focus-btn flex h-6 w-6 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.97]",
                          !canGoNext && "pointer-events-none opacity-30",
                        )}
                        aria-label="Next thread"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="flex items-center gap-1.5">
                        Next
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Kbd size="xs">↓</Kbd>
                          <span className="text-popover-foreground">or</span>
                          <Kbd size="xs">J</Kbd>
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  <div className="mx-1 h-4 w-[0.5px] bg-border/50" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={closeSidebar}
                        className="an-focus-btn flex h-6 w-6 items-center justify-center rounded-md text-foreground/60 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 hover:text-foreground active:scale-[0.97]"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="flex items-center gap-1.5">
                        Close
                        <Kbd size="xs">Esc</Kbd>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Thread detail content */}
              <ThreadMetadataPanel
                threadFromList={selectedThreadFromList as any}
                threadFull={selectedThreadFull}
                messages={threadMessages}
                isStreaming={!!isStreamingThread}
                vc={vc}
                onClose={closeSidebar}
                onFilterBySandbox={handleFilterBySandbox}
              />
            </div>
          )}
        </ResizableSidebar>

        {/* ─── Sandbox sidebar (slides in from right, overlay) ─── */}
        {isSandboxSelected && (
          <LogsSidebar
            isOpen
            mode={sidebarMode}
            thread={null}
            sandbox={fetchedSandbox ?? null}
            sandboxClientId={null}
            sandboxId={selectedSandboxIdForSidebar}
            vc={vc}
            onClose={closeSidebar}
            threadIds={threadIds}
            selectedThreadId={null}
            onSelectThread={(id) => setSidebarState({ type: "thread", threadId: id })}
            onFilterBySandbox={handleFilterBySandbox}
          />
        )}
      </div>
    </div>
  )
}
