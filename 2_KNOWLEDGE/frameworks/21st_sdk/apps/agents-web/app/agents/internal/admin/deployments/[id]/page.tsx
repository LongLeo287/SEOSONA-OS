"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { api } from "@/trpc/client"
import { useDebounce } from "@/hooks/use-debounce"
import { motion } from "motion/react"
import { Search, X, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/ui/1code/{components}/ui/select"
import { AgentDetailsPanel } from "@/app/(alpha)/agents/deployments/_components/agent-details-panel"
import { CopyText } from "@/app/(alpha)/agents/threads/_components/copy-button"
import {
  getDateFromPreset,
  formatDuration,
  formatCost,
  DEFAULT_VC,
} from "@/app/(alpha)/agents/threads/_components/logs-constants"
import {
  LogsDateRangePicker,
  type DateRangeValue,
} from "@/app/(alpha)/agents/threads/_components/logs-date-range-picker"
import { LogsSidebar } from "@/app/(alpha)/agents/threads/_components/logs-sidebar"
import type { VisualConfig } from "@/components/features/agents/an/types"

type TabId = "overview" | "logs"

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "logs", label: "Logs" },
]

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

function formatTimestamp(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default function AdminDeploymentDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  const { data: config, isLoading } =
    api.agentsAdmin.getConfigAdmin.useQuery(
      { id: params.id },
      { enabled: !!params.id },
    )

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex h-10 items-center border-b border-border px-3 gap-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="p-8 space-y-4">
          <Skeleton className="h-5 w-48 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[13px] text-muted-foreground">
          Deployment not found.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex h-10 shrink-0 items-center border-b border-border px-1.5" style={{ borderBottomWidth: "0.5px" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex h-full items-center px-2.5 text-[12px] transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`absolute inset-x-1 inset-y-1.5 rounded-md transition-colors ${isActive ? "bg-foreground/5" : "group-hover:bg-foreground/5"}`}
              />
              {isActive && (
                <motion.div
                  layoutId="admin-deployment-tab-line"
                  className="absolute inset-x-1 bottom-0 h-[1.5px] bg-foreground rounded-full"
                  transition={{ duration: 0.15 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {activeTab === "overview" && <OverviewTab config={config} />}
        {activeTab === "logs" && <LogsTab configId={config.id} />}
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────

function OverviewTab({ config }: { config: any }) {
  const dep = config.activeDeployment
  const isDeployed = !!dep
  const endpointUrl = `https://api.an.dev/v1/chat/${config.slug}`
  const deployedAt = dep?.deployed_at ? new Date(dep.deployed_at) : null
  const metadata = dep?.metadata as Record<string, unknown> | null | undefined
  const team = config.team
  const ownerEmail = team?.user?.email ?? "—"
  const ownerName = team?.user?.name

  return (
    <motion.div
      className="flex-1 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 px-8 py-4">
        {/* Left — deployment info */}
        <div className="flex flex-col gap-3">
          {/* Endpoint */}
          <div className="min-w-0 space-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
              Endpoint
            </p>
            <CopyText value={endpointUrl} className="inline-block max-w-full">
              <span className="block truncate font-mono text-[12px] text-foreground">
                {endpointUrl}
              </span>
            </CopyText>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                Status
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${isDeployed ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                />
                <p className="text-[12px] text-foreground">
                  {isDeployed ? "Deployed" : "Not Deployed"}
                </p>
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                Runtime
              </p>
              <p className="text-[12px] text-foreground">{config.runtime}</p>
            </div>

            {deployedAt && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                  Deployed
                </p>
                <p className="text-[12px] tabular-nums text-foreground">
                  {formatRelativeTime(deployedAt)}
                </p>
              </div>
            )}

            {dep && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                  Version
                </p>
                <CopyText value={dep.bundle_hash} className="inline-block max-w-full">
                  <span className="block truncate font-mono text-[12px] text-foreground">
                    v{dep.version} · {dep.bundle_hash}
                  </span>
                </CopyText>
              </div>
            )}

            <div className="space-y-0.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                Owner
              </p>
              <p className="text-[12px] text-foreground">
                {ownerName ?? ownerEmail}
                {ownerName && (
                  <span className="text-muted-foreground/60 ml-1 text-[11px]">
                    ({ownerEmail})
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
                Team
              </p>
              <p className="text-[12px] text-foreground">{team?.name ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Right — agent details */}
        <div>
          <AgentDetailsPanel metadata={metadata} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Logs Tab ─────────────────────────────────────────────────

function LogsTab({ configId }: { configId: string }) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: "all" })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSandboxId, setSelectedSandboxId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const createdAfter = useMemo(
    () => getDateFromPreset(dateRange.preset, dateRange.from),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.from?.getTime()],
  )
  const createdBefore = useMemo(
    () =>
      dateRange.preset === "custom" && dateRange.to
        ? dateRange.to.toISOString()
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.to?.getTime()],
  )

  const {
    data: sandboxesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentsAdmin.listAllSandboxes.useInfiniteQuery(
    {
      agentId: configId,
      createdAfter,
      createdBefore,
      excludeAdminTeams: true,
      limit: 50,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  )

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

  const allSandboxes = useMemo(
    () => sandboxesData?.pages.flatMap((page) => page.sandboxes) ?? [],
    [sandboxesData],
  )

  const filtered = useMemo(() => {
    let result = allSandboxes
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((s) => s.id.toLowerCase().includes(q))
    }
    if (statusFilter === "active") {
      result = result.filter((s) => s.status === "active")
    } else if (statusFilter === "error") {
      result = result.filter((s) => s.status === "error")
    }
    return result
  }, [allSandboxes, debouncedSearch, statusFilter])

  const hasStreamingThreads = allSandboxes.some((p) =>
    (p as any).threads?.some((d: any) => d.status === "streaming"),
  )

  // Sidebar: fetch full sandbox detail
  const { data: selectedSandbox } = api.agentsAdmin.getSandboxAdmin.useQuery(
    { id: selectedSandboxId! },
    {
      enabled: !!selectedSandboxId,
      refetchInterval:
        selectedSandboxId &&
        allSandboxes
          .find((p) => p.id === selectedSandboxId)
          ?.threads?.some((d: any) => d.status === "streaming")
          ? 2_000
          : false,
    },
  )

  const vc: VisualConfig = DEFAULT_VC

  const closeSidebar = useCallback(() => setSelectedSandboxId(null), [])

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSandboxId) {
        closeSidebar()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedSandboxId, closeSidebar])

  const isOpen = !!selectedSandboxId

  return (
    <div className="flex flex-1 min-h-0">
      <motion.div
        className="flex flex-1 min-w-0 flex-col bg-tl-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Toolbar */}
        <div className="flex h-10 shrink-0 items-center gap-3 px-2 border-b-[0.5px] border-border">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Chat ID..."
              className="h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-8 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[130px] rounded-md bg-foreground/[0.05] border-border hover:border-foreground/15 text-[12px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <LogsDateRangePicker value={dateRange} onChange={setDateRange} />

          {hasStreamingThreads && (
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Table header */}
        <div className="flex h-8 items-center border-b-[0.5px] border-border bg-muted/30 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <div className="pl-4" style={{ width: 160 }}>Created</div>
          <div style={{ width: 80 }}>Status</div>
          <div className="flex-1 min-w-0">Chat ID</div>
          <div style={{ width: 80 }}>Threads</div>
          <div style={{ width: 80 }}>Cost</div>
          <div className="pr-4" style={{ width: 100 }}>Duration</div>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center h-10 border-b-[0.5px] border-border">
                <div className="pl-4" style={{ width: 160 }}>
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <div style={{ width: 80 }}>
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <div className="flex-1 min-w-0 px-1">
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <div style={{ width: 80 }}>
                  <Skeleton className="h-3 w-6 rounded" />
                </div>
                <div style={{ width: 80 }}>
                  <Skeleton className="h-3 w-10 rounded" />
                </div>
                <div className="pr-4" style={{ width: 100 }}>
                  <Skeleton className="h-3 w-10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
            <Activity className="h-7 w-7 text-muted-foreground/30" />
            <p className="text-[13px] text-muted-foreground">
              {allSandboxes.length === 0 ? "No chat logs yet." : "No logs match your filters."}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            {filtered.map((sandbox) => {
              const threads = (sandbox as any).threads ?? []
              const totalCost = threads.reduce(
                (sum: number, t: any) => sum + (t.total_cost_usd ?? 0),
                0,
              )
              const totalDuration = threads.reduce(
                (sum: number, t: any) => sum + (t.duration_ms ?? 0),
                0,
              )
              const hasError =
                sandbox.status === "error" ||
                threads.some((t: any) => t.status === "error")
              const isSelected = selectedSandboxId === sandbox.id

              return (
                <div
                  key={sandbox.id}
                  onClick={() =>
                    setSelectedSandboxId(isSelected ? null : sandbox.id)
                  }
                  className={`flex h-10 cursor-pointer items-center text-[12px] transition-colors hover:bg-muted/50 border-b-[0.5px] border-border ${
                    isSelected ? "bg-muted" : ""
                  }`}
                >
                  <div
                    className="pl-4 text-muted-foreground tabular-nums"
                    style={{ width: 160 }}
                  >
                    {formatTimestamp(sandbox.created_at)}
                  </div>
                  <div style={{ width: 80 }}>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        hasError
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${
                          hasError ? "bg-destructive" : "bg-emerald-500"
                        }`}
                      />
                      {hasError ? "Error" : "Active"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 px-1">
                    <span className="text-foreground font-mono text-[11px] truncate">
                      {sandbox.id}
                    </span>
                  </div>
                  <div
                    className="tabular-nums text-muted-foreground"
                    style={{ width: 80 }}
                  >
                    {threads.length}
                  </div>
                  <div
                    className="tabular-nums text-muted-foreground"
                    style={{ width: 80 }}
                  >
                    {formatCost(totalCost > 0 ? totalCost : null)}
                  </div>
                  <div
                    className="pr-4 tabular-nums text-muted-foreground"
                    style={{ width: 100 }}
                  >
                    {formatDuration(totalDuration > 0 ? totalDuration : null)}
                  </div>
                </div>
              )
            })}
            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-3"
              >
                {isFetchingNextPage && (
                  <Skeleton className="h-3 w-16 rounded" />
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Sidebar */}
      <LogsSidebar
        isOpen={isOpen}
        mode={{ type: "sandbox" }}
        thread={null}
        sandbox={selectedSandbox ?? null}
        sandboxClientId={(selectedSandbox as any)?.client_sandbox_id ?? null}
        sandboxId={selectedSandboxId}
        vc={vc}
        onClose={closeSidebar}
        threadIds={[]}
        selectedThreadId={null}
        onSelectThread={() => {}}
      />
    </div>
  )
}
