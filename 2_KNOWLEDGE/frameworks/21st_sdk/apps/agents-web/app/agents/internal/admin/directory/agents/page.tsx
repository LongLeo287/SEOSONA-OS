"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "motion/react"
import { api } from "@/trpc/client"
import Link from "next/link"
import { Search, X, RefreshCw, Wrench, ExternalLink } from "lucide-react"
import { CopyButton } from "@/components/features/agents/an/playground/playground-code-shared"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils/deployment-utils"
import { ObservabilitySkeleton } from "@/app/(alpha)/agents/observability/_components/observability-skeleton"
import { useAgentClassifications } from "../../_hooks/use-agent-classifications"
import { useDirectoryAnalytics } from "../../_hooks/use-directory-analytics"
import {
  CATEGORY_CHART_COLORS,
  TOOL_CATEGORY_COLORS,
  TOOL_CATEGORY_LABELS,
  MIN_ACTIVE_THREADS,
  fmtTokens,
  fmtCost,
} from "../_constants"
import { useActiveFilter } from "../../_context/active-filter-context"

const FALLBACK_COLOR = "#94a3b8"

// ─── Sort ─────────────────────────────────────────────────────────────

type SortKey = "name" | "category" | "owner" | "tools" | "threads" | "tokens" | "cost" | "active"
type SortDir = "asc" | "desc"

function SortIndicator({ dir }: { dir: SortDir }) {
  return (
    <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" className="shrink-0">
      {dir === "asc" ? (
        <path d="M3.5 0L7 5H0L3.5 0Z" />
      ) : (
        <path d="M3.5 5L0 0H7L3.5 5Z" />
      )}
    </svg>
  )
}

function SortableHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  align = "left",
}: {
  label: string
  sortKey: SortKey
  currentKey: SortKey
  currentDir: SortDir
  onSort: (key: SortKey) => void
  align?: "left" | "right"
}) {
  const active = currentKey === sortKey
  return (
    <th
      className={cn(
        "py-1.5 px-2 select-none cursor-pointer hover:text-foreground transition-colors",
        align === "right" ? "text-right" : "text-left",
      )}
      onClick={() => onSort(sortKey)}
    >
      <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end")}>
        {label}
        {active && <SortIndicator dir={currentDir} />}
      </span>
    </th>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────

interface AgentRow {
  id: string
  name: string
  slug: string
  summary: string
  subcategory: string
  category: string
  toolCount: number
  toolNames: { name: string; category: string; purpose: string }[]
  teamId: string
  teamName: string
  ownerEmail: string
  threadCount: number
  totalTokens: number
  totalCostUsd: number
  lastActivity: string | null
}

// ─── Main Page ────────────────────────────────────────────────────────

export default function AgentDirectoryTablePage() {
  const { activeOnly } = useActiveFilter()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("threads")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        return prev
      }
      setSortDir(key === "name" || key === "category" || key === "owner" ? "asc" : "desc")
      return key
    })
  }, [])

  const { data: allConfigs = [], isLoading } =
    api.agentsAdmin.listAllConfigs.useQuery()
  const { data: usageStats } =
    api.agentsAdmin.getAgentUsageStats.useQuery()

  const nonAdminConfigs = useMemo(
    () => allConfigs.filter((c) => !(c as any).team?.user?.is_admin),
    [allConfigs],
  )

  const configsWithMetadata = useMemo(
    () =>
      nonAdminConfigs
        .filter((c) => !!(c as any).activeDeployment?.metadata)
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          activeDeployment: (c as any).activeDeployment as {
            bundle_hash?: string | null
            metadata?: Record<string, unknown> | null
          },
        })),
    [nonAdminConfigs],
  )

  const { classifications, isClassifying, reclassify, clearAllCache } =
    useAgentClassifications(configsWithMetadata, usageStats)

  const analytics = useDirectoryAnalytics(
    nonAdminConfigs as any,
    classifications,
    usageStats,
    0, // always load all agents — filtering happens in the table
  )

  const classifiedCount = [...classifications.values()].filter(
    (c) => !c.loading,
  ).length
  const activeWithMetadataCount = useMemo(
    () =>
      configsWithMetadata.filter(
        (c) => (usageStats?.[c.id]?.threadCount ?? 0) >= MIN_ACTIVE_THREADS,
      ).length,
    [configsWithMetadata, usageStats],
  )

  // Flatten agents from all categories
  const allAgents: AgentRow[] = useMemo(() => {
    const result: AgentRow[] = []
    for (const { name: category } of analytics.categories.categoryDistribution) {
      const agents = analytics.categories.categoryAgents.get(category) ?? []
      for (const agent of agents) {
        result.push({
          id: agent.id,
          name: agent.name,
          slug: agent.slug,
          summary: agent.summary,
          subcategory: agent.subcategory,
          category,
          toolCount: agent.toolCount,
          toolNames: agent.toolNames ?? [],
          teamId: agent.teamId ?? "",
          teamName: agent.teamName,
          ownerEmail: agent.ownerEmail,
          threadCount: agent.threadCount ?? 0,
          totalTokens: agent.totalTokens ?? 0,
          totalCostUsd: agent.totalCostUsd ?? 0,
          lastActivity: agent.lastActivity ?? null,
        })
      }
    }
    return result
  }, [analytics])

  // Filter: active toggle + search (search bypasses active filter)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) {
      // Search across ALL agents regardless of active toggle
      return allAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.teamName.toLowerCase().includes(q) ||
          a.ownerEmail.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.subcategory.toLowerCase().includes(q) ||
          a.toolNames.some(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.purpose.toLowerCase().includes(q),
          ),
      )
    }
    // No search — apply active filter
    if (activeOnly) {
      return allAgents.filter((a) => a.threadCount >= MIN_ACTIVE_THREADS)
    }
    return allAgents
  }, [search, allAgents, activeOnly])

  // Sort
  const sorted = useMemo(() => {
    const mult = sortDir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return mult * a.name.localeCompare(b.name)
        case "category":
          return mult * a.category.localeCompare(b.category)
        case "owner":
          return mult * a.ownerEmail.localeCompare(b.ownerEmail)
        case "tools":
          return mult * (a.toolNames.length - b.toolNames.length)
        case "threads":
          return mult * (a.threadCount - b.threadCount)
        case "tokens":
          return mult * (a.totalTokens - b.totalTokens)
        case "cost":
          return mult * (a.totalCostUsd - b.totalCostUsd)
        case "active": {
          const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0
          const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0
          return mult * (aTime - bTime)
        }
        default:
          return 0
      }
    })
  }, [filtered, sortKey, sortDir])

  // TSV text for copy
  const tsvText = useMemo(() => {
    const header = [
      "#", "Agent", "Slug", "Category", "Subcategory", "Owner",
      "Tools (name)", "Tools (category)", "Tools (purpose)",
      "Threads", "Tokens", "Cost", "Last Active",
    ].join("\t")
    const rows = sorted.map((a, i) =>
      [
        i + 1,
        a.name,
        a.slug,
        a.category,
        a.subcategory,
        a.ownerEmail,
        a.toolNames.map((t) => t.name).join("; "),
        a.toolNames.map((t) => TOOL_CATEGORY_LABELS[t.category] ?? t.category).join("; "),
        a.toolNames.map((t) => t.purpose).join("; "),
        a.threadCount,
        a.totalTokens,
        a.totalCostUsd.toFixed(2),
        a.lastActivity ?? "—",
      ].join("\t"),
    )
    return [header, ...rows].join("\n")
  }, [sorted])

  const activeAgentCount = usageStats
    ? nonAdminConfigs.filter(
        (c) => (usageStats[c.id]?.threadCount ?? 0) >= MIN_ACTIVE_THREADS,
      ).length
    : 0

  if (isLoading) return <ObservabilitySkeleton />

  return (
    <motion.div
      className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* ─── Toolbar ─── */}
        <div className="flex h-10 shrink-0 items-center gap-1.5 px-2 border-b-[0.5px] border-border">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents, tools…"
              className="h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-8 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <CopyButton text={tsvText} />

          <button
            onClick={clearAllCache}
            className="flex items-center gap-1.5 h-8 text-[11px] text-muted-foreground transition-colors rounded-md border border-border bg-foreground/[0.05] px-2.5 hover:border-foreground/15 hover:text-foreground"
          >
            <RefreshCw className={cn("h-3 w-3", isClassifying && "animate-spin")} />
            Reclassify
          </button>

          <div className="ml-auto flex items-center gap-3">
            {isClassifying && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                classifying {classifiedCount}/{activeWithMetadataCount}
              </div>
            )}
            <span className="text-[11px] text-foreground/40 tabular-nums">
              {sorted.length}{search.trim() ? ` of ${allAgents.length}` : ""} agents
              {activeOnly && ` (${activeAgentCount} active of ${nonAdminConfigs.length})`}
            </span>
          </div>
        </div>

        {/* ─── Scrollable table ─── */}
        <div className="flex-1 overflow-auto bg-tl-background">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20">
              <Wrench className="h-7 w-7 text-muted-foreground/30" />
              <p className="text-[13px] text-muted-foreground">
                {search.trim() ? "No agents match your search." : "No agents found."}
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-[12px] table-fixed">
              <colgroup>
                <col style={{ width: 32 }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "10%" }} />
                <col />
                <col style={{ width: 56 }} />
                <col style={{ width: 56 }} />
                <col style={{ width: 50 }} />
                <col style={{ width: 64 }} />
                <col style={{ width: 48 }} />
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr className="border-b-[0.5px] border-border bg-background text-[11px] font-medium text-muted-foreground">
                  <th className="text-left py-1.5 px-2">#</th>
                  <SortableHeader label="Agent" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Category" sortKey="category" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Owner" sortKey="owner" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Tools" sortKey="tools" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Threads" sortKey="threads" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                  <SortableHeader label="Tokens" sortKey="tokens" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                  <SortableHeader label="Cost" sortKey="cost" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                  <SortableHeader label="Active" sortKey="active" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                  <th />
                </tr>
              </thead>
              <tbody>
                {sorted.map((agent, i) => {
                  const catColor = CATEGORY_CHART_COLORS[agent.category] ?? FALLBACK_COLOR
                  return (
                    <tr
                      key={agent.id}
                      className={cn(
                        "border-b-[0.5px] border-border transition-colors group",
                        i % 2 === 1 ? "bg-muted/25 hover:bg-muted/50" : "hover:bg-muted/50",
                      )}
                    >
                      {/* # */}
                      <td className="py-1.5 px-2 text-foreground/30 tabular-nums text-[11px] align-top">
                        {i + 1}
                      </td>

                      {/* Agent */}
                      <td className="py-1.5 px-2 align-top">
                        <Link
                          href={agent.teamId ? `/agents/app?admin_team_id=${agent.teamId}&admin_agent_id=${agent.id}` : `/agents/internal/admin/deployments/${agent.id}`}
                          className="font-medium text-foreground hover:underline text-[12px] break-words"
                        >
                          {agent.name}
                        </Link>
                        <div className="text-[10px] text-foreground/35 mt-0.5 break-words line-clamp-2">
                          {agent.summary}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-1.5 px-2 align-top">
                        <span
                          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium break-words"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor,
                          }}
                          title={agent.subcategory && agent.subcategory !== "..." ? `${agent.category} / ${agent.subcategory}` : agent.category}
                        >
                          {agent.subcategory && agent.subcategory !== "..."
                            ? agent.subcategory
                            : agent.category}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-1.5 px-2 text-foreground/50 align-top overflow-hidden">
                        <div className="flex items-center gap-0.5 min-w-0">
                          <span className="truncate text-[11px]" title={agent.ownerEmail}>
                            {agent.ownerEmail}
                          </span>
                          <CopyButton text={agent.ownerEmail} />
                        </div>
                      </td>

                      {/* Tools — ALL shown */}
                      <td className="py-1.5 px-2 align-top">
                        {agent.toolNames.length === 0 ? (
                          <span className="text-foreground/20">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-0.5">
                            {agent.toolNames.map((t) => (
                              <span
                                key={t.name}
                                title={`${t.name}: ${t.purpose}`}
                                className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] leading-tight"
                                style={{
                                  backgroundColor: `${TOOL_CATEGORY_COLORS[t.category] ?? FALLBACK_COLOR}12`,
                                  color: TOOL_CATEGORY_COLORS[t.category] ?? FALLBACK_COLOR,
                                }}
                              >
                                <span className="font-medium">
                                  {TOOL_CATEGORY_LABELS[t.category] ?? t.category}
                                </span>
                                <span className="text-foreground/40">{t.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Threads */}
                      <td className="py-1.5 px-2 text-right tabular-nums align-top">
                        {agent.threadCount > 0 ? (
                          <span className="text-green-500/80 font-medium">
                            {agent.threadCount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-foreground/20">0</span>
                        )}
                      </td>

                      {/* Tokens */}
                      <td className="py-1.5 px-2 text-right tabular-nums text-foreground/50 align-top">
                        {fmtTokens(agent.totalTokens)}
                      </td>

                      {/* Cost */}
                      <td className="py-1.5 px-2 text-right tabular-nums text-foreground/50 align-top">
                        {fmtCost(agent.totalCostUsd)}
                      </td>

                      {/* Last Active */}
                      <td className="py-1.5 px-2 text-right text-[10px] text-foreground/40 align-top whitespace-nowrap">
                        {agent.lastActivity
                          ? formatRelativeTime(new Date(agent.lastActivity))
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-1.5 px-0.5 align-top">
                        <div className="flex items-center gap-0.5">
                          {agent.teamId && (
                            <Link
                              href={`/agents/app?admin_team_id=${agent.teamId}&admin_agent_id=${agent.id}`}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-foreground/10"
                              title="View Dashboard"
                            >
                              <ExternalLink className="h-3 w-3 text-foreground/40" />
                            </Link>
                          )}
                          <button
                            onClick={() => reclassify(agent.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-foreground/10"
                            title="Reclassify"
                          >
                            <RefreshCw className="h-3 w-3 text-foreground/40" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  )
}
