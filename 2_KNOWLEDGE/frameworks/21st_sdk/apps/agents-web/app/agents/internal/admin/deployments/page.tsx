"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/client"
import { motion } from "motion/react"
import { Cloud, Search, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/ui/1code/{components}/ui/select"

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

export default function AdminDeploymentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: allConfigs = [], isLoading } =
    api.agentsAdmin.listAllConfigs.useQuery()

  // Exclude teams owned by admins
  const nonAdminConfigs = useMemo(
    () => allConfigs.filter((c) => !(c as any).team?.user?.is_admin),
    [allConfigs],
  )

  const filtered = useMemo(() => {
    let result = nonAdminConfigs
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c as any).team?.name?.toLowerCase().includes(q),
      )
    }
    if (statusFilter === "deployed") {
      result = result.filter((c) => !!(c as any).activeDeployment)
    } else if (statusFilter === "idle") {
      result = result.filter((c) => !(c as any).activeDeployment)
    }
    return result
  }, [nonAdminConfigs, searchQuery, statusFilter])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-0 p-3">
        <div className="rounded-lg border-[0.5px] border-border bg-background overflow-hidden flex-1">
          <div className="flex items-center gap-2 px-2.5 py-2.5">
            <Skeleton className="h-8 flex-1 max-w-[200px] rounded-md" />
            <Skeleton className="h-8 w-[120px] rounded-md" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 h-[52px] border-b-[0.5px] border-border">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton className="h-3 rounded" style={{ width: [140, 100, 160, 120, 150, 110][i] }} />
                <Skeleton className="h-2.5 w-[80px] rounded" />
              </div>
              <Skeleton className="h-4 w-[50px] rounded-full" />
              <Skeleton className="h-3 w-[40px] rounded" />
              <Skeleton className="h-3 w-[70px] rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-1 flex-col gap-0 p-3">
        <div className="rounded-lg border-[0.5px] border-border bg-background overflow-hidden flex flex-col flex-1">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b-[0.5px] border-border">
            <div className="relative max-w-[280px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents or teams..."
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
              <SelectTrigger className="h-8 w-[140px] rounded-md bg-foreground/[0.05] border-border hover:border-foreground/15 text-[12px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
              <Cloud className="h-7 w-7 text-muted-foreground/30" />
              <p className="text-[13px] text-muted-foreground">
                {nonAdminConfigs.length === 0
                  ? "No deployments yet."
                  : "No deployments match your filters."}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              {filtered.map((config) => {
                const dep = (config as any).activeDeployment
                const isDeployed = !!dep
                const teamName = (config as any).team?.name ?? "Unknown"
                const ownerEmail = (config as any).team?.user?.email ?? ""
                const sessionCount = (config as any)._count?.sandboxes ?? 0
                const age = dep?.deployed_at
                  ? formatRelativeTime(new Date(dep.deployed_at))
                  : config.updated_at
                    ? formatRelativeTime(new Date(config.updated_at))
                    : "\u2014"

                return (
                  <div
                    key={config.id}
                    onClick={() => router.push(`/agents/internal/admin/deployments/${config.id}`)}
                    className="flex h-12 cursor-pointer items-center text-[13px] transition-colors hover:bg-muted/50 border-b-[0.5px] border-border"
                  >
                    <div className="min-w-0 flex-1 pl-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{config.name}</span>
                        {dep && (
                          <span className="text-[10px] font-mono text-muted-foreground/50">
                            v{dep.version} &middot; {dep.bundle_hash?.slice(0, 7)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground/60 truncate">
                        {config.slug} &middot; {teamName}{ownerEmail ? ` (${ownerEmail})` : ""}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5" style={{ width: 100 }}>
                      <div className={`h-1.5 w-1.5 rounded-full ${isDeployed ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                      <span className={`text-[12px] ${isDeployed ? "text-foreground" : "text-muted-foreground"}`}>
                        {isDeployed ? "Ready" : "Idle"}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center justify-center" style={{ width: 80 }}>
                      {sessionCount > 0 ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {sessionCount} {sessionCount === 1 ? "req" : "reqs"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/40">0 reqs</span>
                      )}
                    </div>
                    <div className="shrink-0" style={{ width: 120 }}>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {config.runtime ?? "claude-code"}
                      </span>
                    </div>
                    <div className="shrink-0 pr-4" style={{ width: 100 }}>
                      <span className="text-[12px] text-muted-foreground tabular-nums">{age}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
