"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { api } from "@/trpc/client"
import { useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { motion } from "motion/react"
import { Search, Cloud, X, MoreHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/ui/1code/{components}/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { DeploymentStatusBadge, CurrentBadge } from "./deployment-status-badge"
import { formatRelativeTime, formatDuration, type DeploymentStatus } from "@/lib/utils/deployment-utils"

function DeployDuration({
  status,
  createdAt,
  completedAt,
}: {
  status: string
  createdAt: Date
  completedAt: Date | null
}) {
  const [elapsed, setElapsed] = useState(() =>
    status === "building" ? Date.now() - createdAt.getTime() : 0,
  )

  useEffect(() => {
    if (status !== "building") return
    setElapsed(Date.now() - createdAt.getTime())
    const interval = setInterval(
      () => setElapsed(Date.now() - createdAt.getTime()),
      1_000,
    )
    return () => clearInterval(interval)
  }, [status, createdAt])

  if (status === "building") {
    return (
      <span className="text-[11px] text-muted-foreground tabular-nums">
        {formatDuration(elapsed)}
      </span>
    )
  }

  if (completedAt) {
    const duration = new Date(completedAt).getTime() - createdAt.getTime()
    const formatted = formatDuration(duration)
    if (!formatted) return null
    return (
      <span className="text-[11px] text-muted-foreground tabular-nums">
        {formatted}
      </span>
    )
  }

  return null
}

function DeploymentsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-0 p-3">
      <div className="rounded-lg border-[0.5px] border-border bg-background overflow-hidden flex-1">
        <div className="flex items-center gap-2 px-2.5 py-2.5">
          <Skeleton className="h-8 flex-1 max-w-[200px] rounded-md" />
          <Skeleton className="h-8 w-[120px] rounded-md" />
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 h-[52px] border-b-[0.5px] border-border"
            >
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton
                  className="h-3 rounded"
                  style={{ width: [140, 100, 160, 120, 150, 110][i] }}
                />
                <Skeleton className="h-2.5 w-[80px] rounded" />
              </div>
              <Skeleton className="h-4 w-[50px] rounded-full" />
              <Skeleton className="h-3 w-[40px] rounded" />
              <Skeleton className="h-3 w-[70px] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DeploymentsPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const router = useAgentsRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")


  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentConfigs.listAllDeployments.useInfiniteQuery(
    {
      teamId: teamId!,
      ...(selectedAgent && { agentId: selectedAgent.id }),
      ...(statusFilter !== "all" && { status: statusFilter as "building" | "ready" | "failed" }),
      limit: 50,
    },
    {
      enabled: !!teamId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: (query) => {
        const pages = query.state.data?.pages
        const hasBuilding = pages?.some((p) =>
          p.deployments.some((d) => d.status === "building"),
        )
        return hasBuilding ? 3_000 : 10_000
      },
    },
  )

  const allDeployments = useMemo(
    () => data?.pages.flatMap((p) => p.deployments) ?? [],
    [data],
  )

  const filtered = useMemo(() => {
    if (!searchQuery) return allDeployments
    const q = searchQuery.toLowerCase()
    return allDeployments.filter(
      (d) =>
        d.agent.name.toLowerCase().includes(q) ||
        d.agent.slug.toLowerCase().includes(q) ||
        d.bundle_hash.toLowerCase().includes(q),
    )
  }, [allDeployments, searchQuery])

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

  if (!teamId || isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
        <DeploymentsSkeleton />
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto bg-tl-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-1 flex-col gap-3 p-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deployments..."
              className="an-focus-input h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-8 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
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
            <SelectTrigger className="h-8 w-[140px] rounded-md bg-foreground/[0.05] border-border hover:border-foreground/15 text-[12px] shadow-none">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="building">Deploying</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border-[0.5px] border-border bg-background overflow-hidden flex flex-col flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
              <Cloud className="h-7 w-7 text-muted-foreground/30" />
              <p className="text-[13px] text-muted-foreground">
                {allDeployments.length === 0
                  ? "No deployments yet. Deploy an agent using the CLI."
                  : "No deployments match your filters."}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              {filtered.map((dep) => {
                const isActive = dep.id === dep.agent.active_deployment_id
                const createdAt = new Date(dep.created_at)

                return (
                  <div
                    key={dep.id}
                    className="flex h-12 cursor-pointer items-center text-[13px] border-b-[0.5px] border-border transition-colors hover:bg-muted/50"
                    onClick={() => router.push(`/agents/deployments/${dep.id}`)}
                  >
                    {/* Deploy ID + version */}
                    <div className="shrink-0 pl-4" style={{ width: 160 }}>
                      <span className="font-mono text-[12px] text-foreground">
                        {dep.id.slice(0, 8)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground/60">
                          v{dep.version}
                        </span>
                        {isActive && <CurrentBadge />}
                      </div>
                    </div>

                    {/* Status + duration */}
                    <div className="shrink-0" style={{ width: 110 }}>
                      <DeploymentStatusBadge status={dep.status as DeploymentStatus} />
                      <DeployDuration
                        status={dep.status}
                        createdAt={createdAt}
                        completedAt={dep.completed_at ? new Date(dep.completed_at) : null}
                      />
                    </div>

                    {/* Agent — only when no agent selected */}
                    {!selectedAgent && (
                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        <AgentAvatar name={dep.agent.name} size="sm" />
                        <span className="text-[12px] text-foreground truncate">
                          {dep.agent.name}
                        </span>
                      </div>
                    )}
                    {selectedAgent && <div className="min-w-0 flex-1" />}

                    {/* Created */}
                    <div className="shrink-0 pr-2 text-right" style={{ width: 100 }}>
                      <span
                        className="text-[11px] text-muted-foreground tabular-nums"
                        title={createdAt.toLocaleString()}
                      >
                        {formatRelativeTime(createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center justify-center" style={{ width: 40 }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={4}>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/agents/deployments/${dep.id}`)
                            }}
                            className="text-[12px]"
                          >
                            View deployment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/agents/deployments/${dep.id}?tab=logs`)
                            }}
                            className="text-[12px]"
                          >
                            View logs
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}

              {hasNextPage && (
                <div ref={sentinelRef} className="flex items-center justify-center py-3">
                  {isFetchingNextPage && <AnLogoSpinner />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
