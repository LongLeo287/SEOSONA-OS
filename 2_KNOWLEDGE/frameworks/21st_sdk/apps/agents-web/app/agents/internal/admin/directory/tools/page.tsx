"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "motion/react"
import { api } from "@/trpc/client"
import { Search, X, Wrench, Zap } from "lucide-react"
import { CopyButton } from "@/components/features/agents/an/playground/playground-code-shared"
import { cn } from "@/lib/utils"
import { ObservabilitySkeleton } from "@/app/(alpha)/agents/observability/_components/observability-skeleton"
import { useAgentClassifications } from "../../_hooks/use-agent-classifications"
import {
  CATEGORY_CHART_COLORS,
  TOOL_CATEGORY_COLORS,
  TOOL_CATEGORY_LABELS,
  MIN_ACTIVE_THREADS,
} from "../_constants"
import { useActiveFilter } from "../../_context/active-filter-context"

const FALLBACK_COLOR = "#94a3b8"

// ─── Types ───────────────────────────────────────────────────────────

type ToolRow = {
  name: string
  toolCategory: string
  purpose: string
  totalAgents: number
  byAgentCategory: Map<string, string[]> // agentCategory -> agent names[]
}

type SortKey = "name" | "toolCategory" | "purpose" | "totalAgents"
type SortDir = "asc" | "desc"

// ─── Sort header ─────────────────────────────────────────────────────

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
        "py-1.5 px-2 select-none cursor-pointer hover:text-foreground transition-colors whitespace-nowrap",
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

// ─── Main Page ───────────────────────────────────────────────────────

export default function ToolsByAgentCategoryPage() {
  const { activeOnly } = useActiveFilter()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("totalAgents")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        return prev
      }
      setSortDir(key === "name" || key === "toolCategory" || key === "purpose" ? "asc" : "desc")
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

  const { classifications, isClassifying } =
    useAgentClassifications(configsWithMetadata, usageStats)

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

  // Build tool rows: each unique tool name with breakdown by agent category
  const { toolRows, agentCategories, categorySummary } = useMemo(() => {
    const toolMap = new Map<
      string,
      {
        toolCategory: string
        purpose: string
        byAgentCategory: Map<string, string[]>
      }
    >()

    // agentCategory -> { toolName -> count }
    const catSummary = new Map<
      string,
      { tools: Map<string, { toolCategory: string; purpose: string; count: number }>; agentCount: number }
    >()

    const agentCats = new Set<string>()

    for (const [agentId, cls] of classifications.entries()) {
      if (cls.loading || cls.category === "Error" || cls.category === "Unconfigured") continue

      // Respect active filter
      const threads = usageStats?.[agentId]?.threadCount ?? 0
      if (activeOnly && threads < MIN_ACTIVE_THREADS) continue

      const config = configsWithMetadata.find((c) => c.id === agentId)
      if (!config) continue

      const agentCategory = cls.category
      const agentName = config.name
      agentCats.add(agentCategory)

      if (!catSummary.has(agentCategory)) {
        catSummary.set(agentCategory, { tools: new Map(), agentCount: 0 })
      }
      catSummary.get(agentCategory)!.agentCount++

      if (!cls.toolClassifications) continue

      for (const tc of cls.toolClassifications) {
        // Tool rows
        if (!toolMap.has(tc.name)) {
          toolMap.set(tc.name, {
            toolCategory: tc.category,
            purpose: tc.purpose,
            byAgentCategory: new Map(),
          })
        }
        const tool = toolMap.get(tc.name)!
        if (!tool.byAgentCategory.has(agentCategory)) {
          tool.byAgentCategory.set(agentCategory, [])
        }
        tool.byAgentCategory.get(agentCategory)!.push(agentName)

        // Category summary
        const catTools = catSummary.get(agentCategory)!.tools
        if (!catTools.has(tc.name)) {
          catTools.set(tc.name, { toolCategory: tc.category, purpose: tc.purpose, count: 0 })
        }
        catTools.get(tc.name)!.count++
      }
    }

    const rows: ToolRow[] = [...toolMap.entries()].map(([name, data]) => ({
      name,
      toolCategory: data.toolCategory,
      purpose: data.purpose,
      totalAgents: [...data.byAgentCategory.values()].reduce((s, arr) => s + arr.length, 0),
      byAgentCategory: data.byAgentCategory,
    }))

    const sortedCats = [...agentCats].sort((a, b) => {
      const aCount = [...toolMap.values()].filter((t) => t.byAgentCategory.has(a)).length
      const bCount = [...toolMap.values()].filter((t) => t.byAgentCategory.has(b)).length
      return bCount - aCount
    })

    // Build category summary sorted by agent count
    const summary = [...catSummary.entries()]
      .map(([category, data]) => ({
        category,
        agentCount: data.agentCount,
        tools: [...data.tools.entries()]
          .map(([name, info]) => ({ name, ...info }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.agentCount - a.agentCount)

    return { toolRows: rows, agentCategories: sortedCats, categorySummary: summary }
  }, [classifications, usageStats, configsWithMetadata, activeOnly])

  // Filter
  const filtered = useMemo(() => {
    let rows = toolRows
    if (selectedCategory) {
      rows = rows.filter((r) => r.byAgentCategory.has(selectedCategory))
    }
    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.purpose.toLowerCase().includes(q) ||
          (TOOL_CATEGORY_LABELS[r.toolCategory] ?? r.toolCategory).toLowerCase().includes(q),
      )
    }
    return rows
  }, [toolRows, search, selectedCategory])

  // Sort
  const sorted = useMemo(() => {
    const mult = sortDir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return mult * a.name.localeCompare(b.name)
        case "toolCategory":
          return mult * a.toolCategory.localeCompare(b.toolCategory)
        case "purpose":
          return mult * a.purpose.localeCompare(b.purpose)
        case "totalAgents":
          return mult * (a.totalAgents - b.totalAgents)
        default:
          return 0
      }
    })
  }, [filtered, sortKey, sortDir])

  // TSV for copy
  const tsvText = useMemo(() => {
    const header = ["Tool", "Type", "Purpose", "Total Agents", ...agentCategories].join("\t")
    const rows = sorted.map((r) =>
      [
        r.name,
        TOOL_CATEGORY_LABELS[r.toolCategory] ?? r.toolCategory,
        r.purpose,
        r.totalAgents,
        ...agentCategories.map((cat) => r.byAgentCategory.get(cat)?.length ?? 0),
      ].join("\t"),
    )
    return [header, ...rows].join("\n")
  }, [sorted, agentCategories])

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
              placeholder="Search tools…"
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

          <div className="ml-auto flex items-center gap-3">
            {isClassifying && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                classifying {classifiedCount}/{activeWithMetadataCount}
              </div>
            )}
            <span className="text-[11px] text-foreground/40 tabular-nums">
              {sorted.length} tools across {agentCategories.length} categories
            </span>
          </div>
        </div>

        {/* ─── Category filter chips ─── */}
        <div className="flex shrink-0 items-center gap-1 px-2 py-1.5 border-b-[0.5px] border-border overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors whitespace-nowrap border",
              !selectedCategory
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground border-border hover:border-foreground/30",
            )}
          >
            All categories
          </button>
          {categorySummary.map(({ category, agentCount, tools }) => {
            const color = CATEGORY_CHART_COLORS[category] ?? FALLBACK_COLOR
            const isActive = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(isActive ? null : category)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "border-current"
                    : "border-transparent hover:border-current/30",
                )}
                style={{ color, backgroundColor: isActive ? `${color}15` : undefined }}
              >
                {category}
                <span className="opacity-50">{agentCount}a / {tools.length}t</span>
              </button>
            )
          })}
        </div>

        {/* ─── Column legend ─── */}
        {agentCategories.length > 0 && (
          <div className="flex shrink-0 items-center gap-x-3 gap-y-1 px-2 py-1.5 border-b-[0.5px] border-border flex-wrap">
            <span className="text-[10px] text-muted-foreground/60">Columns:</span>
            {agentCategories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] ?? FALLBACK_COLOR }}
                />
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* ─── Content: two panels ─── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Tool table */}
          <div className="flex-1 overflow-auto bg-tl-background">
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20">
                <Wrench className="h-7 w-7 text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">
                  {search.trim() ? "No tools match your search." : "No tools found."}
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse text-[12px]">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b-[0.5px] border-border bg-background text-[11px] font-medium text-muted-foreground">
                    <th className="text-left py-1.5 px-2 w-[32px]">#</th>
                    <SortableHeader label="Tool" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Type" sortKey="toolCategory" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Purpose" sortKey="purpose" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Agents" sortKey="totalAgents" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                    {/* Per-category columns */}
                    {agentCategories.map((cat) => (
                      <th
                        key={cat}
                        className="text-center py-1.5 px-1.5 whitespace-nowrap cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        title={cat}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] ?? FALLBACK_COLOR }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((tool, i) => (
                    <tr
                      key={tool.name}
                      className={cn(
                        "border-b-[0.5px] border-border transition-colors group",
                        i % 2 === 1 ? "bg-muted/25 hover:bg-muted/50" : "hover:bg-muted/50",
                      )}
                    >
                      <td className="py-1.5 px-2 text-foreground/30 tabular-nums text-[11px] align-top">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2 align-top font-mono text-foreground text-[11px]">
                        {tool.name}
                      </td>
                      <td className="py-1.5 px-2 align-top whitespace-nowrap">
                        <span
                          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${TOOL_CATEGORY_COLORS[tool.toolCategory] ?? FALLBACK_COLOR}20`,
                            color: TOOL_CATEGORY_COLORS[tool.toolCategory] ?? FALLBACK_COLOR,
                          }}
                        >
                          {TOOL_CATEGORY_LABELS[tool.toolCategory] ?? tool.toolCategory}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 align-top text-foreground/50 text-[11px] max-w-[250px] break-words">
                        {tool.purpose}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums align-top font-medium">
                        {tool.totalAgents}
                      </td>
                      {/* Per-category cells */}
                      {agentCategories.map((cat) => {
                        const agents = tool.byAgentCategory.get(cat)
                        const count = agents?.length ?? 0
                        return (
                          <td
                            key={cat}
                            className="py-1.5 px-1.5 text-center tabular-nums align-top text-[10px]"
                            title={agents ? `${cat}: ${agents.join(", ")}` : undefined}
                          >
                            {count > 0 ? (
                              <span
                                className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-medium"
                                style={{
                                  backgroundColor: `${CATEGORY_CHART_COLORS[cat] ?? FALLBACK_COLOR}20`,
                                  color: CATEGORY_CHART_COLORS[cat] ?? FALLBACK_COLOR,
                                }}
                              >
                                {count}
                              </span>
                            ) : (
                              <span className="text-foreground/10">·</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right: Category breakdown sidebar */}
          {selectedCategory && (
            <div className="w-[280px] shrink-0 border-l-[0.5px] border-border overflow-y-auto bg-tl-background p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className="text-[13px] font-medium"
                  style={{ color: CATEGORY_CHART_COLORS[selectedCategory] ?? FALLBACK_COLOR }}
                >
                  {selectedCategory}
                </h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {(() => {
                const cat = categorySummary.find((c) => c.category === selectedCategory)
                if (!cat) return null
                return (
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground mb-2">
                      {cat.agentCount} agents · {cat.tools.length} unique tools
                    </p>
                    {cat.tools.map((t) => (
                      <div
                        key={t.name}
                        className="flex items-start justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] text-foreground break-words">
                            {t.name}
                          </div>
                          <div className="text-[10px] text-foreground/40 break-words">
                            {t.purpose}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="inline-flex items-center rounded px-1 py-0.5 text-[9px] font-medium"
                            style={{
                              backgroundColor: `${TOOL_CATEGORY_COLORS[t.toolCategory] ?? FALLBACK_COLOR}15`,
                              color: TOOL_CATEGORY_COLORS[t.toolCategory] ?? FALLBACK_COLOR,
                            }}
                          >
                            {TOOL_CATEGORY_LABELS[t.toolCategory] ?? t.toolCategory}
                          </span>
                          <span className="text-[11px] tabular-nums font-medium text-foreground/50">
                            {t.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
