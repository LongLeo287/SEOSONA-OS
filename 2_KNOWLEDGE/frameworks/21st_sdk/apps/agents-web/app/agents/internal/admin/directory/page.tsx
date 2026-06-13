"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { motion } from "motion/react"
import { api } from "@/trpc/client"
import Link from "next/link"
import {
  RefreshCw,
  Wrench,
  Copy,
  Check,
  Search,
} from "lucide-react"
import { formatRelativeTime } from "@/lib/utils/deployment-utils"
import { ObservabilitySkeleton } from "@/app/(alpha)/agents/observability/_components/observability-skeleton"
import { useAgentClassifications } from "../_hooks/use-agent-classifications"
import { useDirectoryAnalytics } from "../_hooks/use-directory-analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import {
  CATEGORY_CHART_COLORS,
  TOOL_CATEGORY_COLORS,
  TOOL_CATEGORY_LABELS,
  MIN_ACTIVE_THREADS,
  fmtTokens,
  fmtCost,
} from "./_constants"
import { useActiveFilter } from "../_context/active-filter-context"

// ─── Helpers ──────────────────────────────────────────────────────────

const FALLBACK_COLOR = "#94a3b8"
const CHART_COLOR = "#2A7FFF"

function CopyButton({ tableRef }: { tableRef: React.RefObject<HTMLDivElement | null> }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    const el = tableRef.current?.querySelector("table")
    if (!el) return
    const rows = el.querySelectorAll("tr")
    const tsv = Array.from(rows)
      .map((row) =>
        Array.from(row.querySelectorAll("th, td"))
          .map((cell) => (cell as HTMLElement).innerText.trim())
          .join("\t"),
      )
      .join("\n")
    navigator.clipboard.writeText(tsv).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [tableRef])

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors rounded border px-1.5 py-0.5"
      title="Copy table as TSV"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

// ─── Overview Card ────────────────────────────────────────────────────

function OverviewCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { overview, activity } = analytics
  type ActiveStat = "agents" | "threads" | "tokens" | "cost"
  const [activeStat, setActiveStat] = useState<ActiveStat>("agents")

  const stats: { key: ActiveStat; label: string; value: string }[] = [
    { key: "agents", label: "Agents", value: String(overview.totalAgents) },
    {
      key: "threads",
      label: "Threads",
      value: activity.totalThreads.toLocaleString(),
    },
    {
      key: "tokens",
      label: "Tokens",
      value: fmtTokens(activity.totalTokens),
    },
    { key: "cost", label: "Cost", value: fmtCost(activity.totalCost) },
  ]

  const chartConfig = {
    value: { label: "Count", color: CHART_COLOR },
  } satisfies ChartConfig

  // Build chart data based on active stat
  const chartData = useMemo(() => {
    if (activeStat === "agents") {
      return analytics.insights.timeline.map((t) => ({
        date: t.month,
        value: t.count,
      }))
    }
    // For threads/tokens/cost, show activity by category
    return analytics.activity.activityByCategory.map((c) => ({
      date: c.category.length > 12 ? c.category.slice(0, 12) + "…" : c.category,
      value:
        activeStat === "threads"
          ? c.threads
          : activeStat === "tokens"
            ? c.tokens
            : 0,
    }))
  }, [activeStat, analytics])

  return (
    <Card className="shadow-none">
      <div className="flex items-stretch border-b">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-2.5">
          <span className="text-[13px] font-medium">Overview</span>
          <span className="text-[11px] text-muted-foreground">
            {activeStat === "agents"
              ? "Agent creation over time"
              : `${activeStat === "threads" ? "Conversations" : activeStat === "tokens" ? "Token usage" : "Cost"} by category`}
          </span>
        </div>
        <div className="flex">
          {stats.map((s) => (
            <button
              key={s.key}
              data-active={activeStat === s.key}
              className="flex flex-col justify-center gap-0.5 border-l px-5 py-2.5 text-left data-[active=true]:bg-muted/50 transition-colors"
              onClick={() => setActiveStat(s.key)}
            >
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
              <span className="text-[15px] font-semibold leading-none tabular-nums">
                {s.value}
              </span>
            </button>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={<ChartTooltipContent className="w-[150px]" nameKey="value" />}
            />
            <Bar
              dataKey="value"
              fill={`var(--color-value)`}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ─── Small Metric Cards ──────────────────────────────────────────────

function SmallMetricCard({
  title,
  value,
  sub,
  chartData,
  color = CHART_COLOR,
}: {
  title: string
  value: string
  sub?: string
  chartData?: { date: string; value: number }[]
  color?: string
}) {
  const chartConfig = {
    value: { label: title, color },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="space-y-0 p-4 pb-2">
        <CardTitle className="text-[13px] font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[15px] font-semibold tabular-nums">{value}</span>
          {sub && (
            <span className="text-[11px] text-muted-foreground">{sub}</span>
          )}
        </div>
      </CardHeader>
      {chartData && chartData.length > 0 && (
        <CardContent className="flex-1 p-4 pt-0 pb-3">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[60px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 4, right: 4, top: 4, bottom: 0 }}
            >
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                content={<ChartTooltipContent className="w-[120px]" nameKey="value" />}
              />
              <Bar
                dataKey="value"
                fill={`var(--color-value)`}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  )
}

// ─── Category Distribution ───────────────────────────────────────────

function CategoryDistributionCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { categories } = analytics
  const chartConfig = categories.categoryDistribution.reduce(
    (acc, d) => {
      acc[d.name] = { label: d.name, color: CATEGORY_CHART_COLORS[d.name] ?? FALLBACK_COLOR }
      return acc
    },
    {} as ChartConfig,
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-[13px] font-medium">
          Categories
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {categories.categoryDistribution.slice(0, 6).map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_CHART_COLORS[d.name] ?? FALLBACK_COLOR }}
              />
              <span className="text-[11px] text-muted-foreground">{d.name}</span>
              <span className="text-[12px] font-medium tabular-nums">{d.count}</span>
            </div>
          ))}
          {categories.categoryDistribution.length > 6 && (
            <span className="text-[11px] text-muted-foreground">
              +{categories.categoryDistribution.length - 6} more
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={categories.categoryDistribution}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 4, bottom: 0 }}
          >
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={120}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={<ChartTooltipContent className="w-[160px]" />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {categories.categoryDistribution.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_CHART_COLORS[entry.name] ?? FALLBACK_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ─── Tool Distribution Card ──────────────────────────────────────────

function ToolDistributionCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { tools } = analytics
  const data = tools.toolDistribution.map((d) => ({
    ...d,
    label: TOOL_CATEGORY_LABELS[d.name] ?? d.name,
  }))
  const chartConfig = data.reduce(
    (acc, d) => {
      acc[d.name] = { label: d.label, color: TOOL_CATEGORY_COLORS[d.name] ?? FALLBACK_COLOR }
      return acc
    },
    {} as ChartConfig,
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-[13px] font-medium">
          Tool Categories
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {data.slice(0, 5).map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: TOOL_CATEGORY_COLORS[d.name] ?? FALLBACK_COLOR }}
              />
              <span className="text-[11px] text-muted-foreground">{d.label}</span>
              <span className="text-[12px] font-medium tabular-nums">{d.count}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 4, bottom: 0 }}
          >
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={100}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={<ChartTooltipContent className="w-[160px]" />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={TOOL_CATEGORY_COLORS[entry.name] ?? FALLBACK_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ─── Model Distribution Card ─────────────────────────────────────────

function ModelDistributionCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { overview } = analytics
  if (overview.modelDistribution.length === 0) return null

  const colors = Object.values(CATEGORY_CHART_COLORS)
  const chartConfig = overview.modelDistribution.reduce(
    (acc, d, i) => {
      acc[d.name] = { label: d.name, color: colors[i % colors.length]! }
      return acc
    },
    {} as ChartConfig,
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-[13px] font-medium">Models</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[180px] w-full"
        >
          <PieChart>
            <Pie
              data={overview.modelDistribution.slice(0, 8)}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) =>
                `${(name as string).length > 16 ? (name as string).slice(0, 16) + "…" : name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ strokeWidth: 1 }}
            >
              {overview.modelDistribution.slice(0, 8).map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent className="w-[160px]" />}
            />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-0.5 mt-1">
          {overview.modelDistribution.map((m, i) => (
            <div key={m.name} className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="text-muted-foreground truncate">{m.name}</span>
              </div>
              <span className="font-medium tabular-nums shrink-0">{m.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Usage Tiers Card ────────────────────────────────────────────────

function UsageTiersCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { activity } = analytics
  const TIER_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#94a3b8"]
  const chartConfig = activity.usageTiers.reduce(
    (acc, d, i) => {
      acc[d.tier] = { label: d.tier, color: TIER_COLORS[i]! }
      return acc
    },
    {} as ChartConfig,
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-[13px] font-medium">Usage Tiers</CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {activity.usageTiers.map((t, i) => (
            <div key={t.tier} className="flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: TIER_COLORS[i] }}
              />
              <span className="text-[11px] text-muted-foreground">{t.tier}</span>
              <span className="text-[12px] font-medium tabular-nums">{t.count}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={activity.usageTiers}
            margin={{ left: 12, right: 12, top: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="tier"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={<ChartTooltipContent className="w-[120px]" />}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {activity.usageTiers.map((_, i) => (
                <Cell key={i} fill={TIER_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ─── Top Agents Table ────────────────────────────────────────────────

function TopAgentsTable({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { activity } = analytics
  const [sortBy, setSortBy] = useState<"threads" | "tokens" | "cost">("threads")
  const tableRef = useRef<HTMLDivElement>(null)

  const list =
    sortBy === "threads"
      ? activity.topByThreads
      : sortBy === "tokens"
        ? activity.topByTokens
        : activity.topByCost

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-[13px] font-medium">Top Agents</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(["threads", "tokens", "cost"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSortBy(v)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  sortBy === v
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {v === "threads" ? "Conversations" : v === "tokens" ? "Tokens" : "Cost"}
              </button>
            ))}
          </div>
          <CopyButton tableRef={tableRef} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2" ref={tableRef}>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-8">#</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Threads</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Tokens</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Cost</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {list.map((agent, i) => (
                <tr key={agent.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-1.5 text-muted-foreground/50">{i + 1}</td>
                  <td className="px-3 py-1.5">
                    <Link
                      href={`/agents/internal/admin/deployments/${agent.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {agent.name}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_CHART_COLORS[agent.category] ?? FALLBACK_COLOR}20`,
                        color: CATEGORY_CHART_COLORS[agent.category] ?? FALLBACK_COLOR,
                      }}
                    >
                      {agent.category}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right font-medium tabular-nums">
                    {agent.threadCount.toLocaleString()}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    {fmtTokens(agent.totalTokens)}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    {fmtCost(agent.totalCostUsd)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-muted-foreground/60 text-[10px]">
                    {agent.lastActivity
                      ? formatRelativeTime(new Date(agent.lastActivity))
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Agent Directory Table ───────────────────────────────────────────

function AgentDirectoryCard({
  analytics,
  onReclassify,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
  onReclassify: (agentId: string) => void
}) {
  const { categories } = analytics
  const [search, setSearch] = useState("")
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set())
  const tableRef = useRef<HTMLDivElement>(null)

  const toggleTools = (id: string) => {
    setExpandedTools((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Flatten all agents from all categories into a single list
  const allAgents = useMemo(() => {
    const result: (ReturnType<typeof useDirectoryAnalytics>["categories"]["categoryAgents"] extends Map<string, (infer T)[]> ? T : never)[] = []
    for (const { name: category } of categories.categoryDistribution) {
      const agents = categories.categoryAgents.get(category) ?? []
      for (const agent of agents) {
        result.push(agent)
      }
    }
    return result
  }, [categories])

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return allAgents
    const q = search.toLowerCase()
    return allAgents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.teamName.toLowerCase().includes(q) ||
        a.subcategory.toLowerCase().includes(q) ||
        (a.toolNames ?? []).some(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.purpose.toLowerCase().includes(q),
        ),
    )
  }, [search, allAgents])

  // Sort by thread count descending
  const sorted = useMemo(
    () => [...filteredAgents].sort((a, b) => (b.threadCount ?? 0) - (a.threadCount ?? 0)),
    [filteredAgents],
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[13px] font-medium">Agent Directory</CardTitle>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {sorted.length}{search.trim() ? ` of ${allAgents.length}` : ""} agents
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents, tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 w-[200px] rounded-md border bg-transparent pl-7 pr-2 text-[11px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <CopyButton tableRef={tableRef} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2" ref={tableRef}>
        <div className="rounded-lg border overflow-hidden max-h-[600px] overflow-y-auto">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-8">#</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Team</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tools</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Threads</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Tokens</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Cost</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Last Active</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((agent, i) => {
                const tools = agent.toolNames ?? []
                const isToolsExpanded = expandedTools.has(agent.id)
                const visibleTools = isToolsExpanded ? tools : tools.slice(0, 2)

                return (
                  <tr key={agent.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors group align-top">
                    <td className="px-3 py-2 text-muted-foreground/50 tabular-nums">{i + 1}</td>
                    <td className="px-3 py-2 min-w-[140px]">
                      <Link
                        href={`/agents/internal/admin/deployments/${agent.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {agent.name}
                      </Link>
                      <div className="text-[10px] text-muted-foreground/50 mt-0.5 line-clamp-1">
                        {agent.summary}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: `${CATEGORY_CHART_COLORS[agent.subcategory] ?? CATEGORY_CHART_COLORS[categories.categoryDistribution.find((c) => categories.categoryAgents.get(c.name)?.some((a) => a.id === agent.id))?.name ?? ""] ?? FALLBACK_COLOR}20`,
                          color: CATEGORY_CHART_COLORS[agent.subcategory] ?? CATEGORY_CHART_COLORS[categories.categoryDistribution.find((c) => categories.categoryAgents.get(c.name)?.some((a) => a.id === agent.id))?.name ?? ""] ?? FALLBACK_COLOR,
                        }}
                      >
                        {agent.subcategory && agent.subcategory !== "..." ? agent.subcategory : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[100px] truncate">
                      {agent.teamName}
                    </td>
                    <td className="px-3 py-2 min-w-[160px]">
                      {tools.length === 0 ? (
                        <span className="text-muted-foreground/30">none</span>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          {visibleTools.map((t) => (
                            <div key={t.name} className="flex items-center gap-1" title={t.purpose}>
                              <span
                                className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-medium shrink-0"
                                style={{
                                  backgroundColor: `${TOOL_CATEGORY_COLORS[t.category] ?? FALLBACK_COLOR}15`,
                                  color: TOOL_CATEGORY_COLORS[t.category] ?? FALLBACK_COLOR,
                                }}
                              >
                                {TOOL_CATEGORY_LABELS[t.category] ?? t.category}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {t.name}
                              </span>
                            </div>
                          ))}
                          {tools.length > 2 && (
                            <button
                              onClick={() => toggleTools(agent.id)}
                              className="text-[9px] text-muted-foreground/50 hover:text-foreground transition-colors text-left"
                            >
                              {isToolsExpanded ? "show less" : `+${tools.length - 2} more tools`}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {(agent.threadCount ?? 0) > 0 ? (
                        <span className="text-green-500/80 font-medium">{agent.threadCount}</span>
                      ) : (
                        <span className="text-muted-foreground/30">0</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {fmtTokens(agent.totalTokens ?? 0)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {fmtCost(agent.totalCostUsd ?? 0)}
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground/60 text-[10px] whitespace-nowrap">
                      {agent.lastActivity
                        ? formatRelativeTime(new Date(agent.lastActivity))
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onReclassify(agent.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                        title="Reclassify"
                      >
                        <RefreshCw className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Activity by Category Table ──────────────────────────────────────

function ActivityByCategoryCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { activity } = analytics
  const tableRef = useRef<HTMLDivElement>(null)

  if (activity.activityByCategory.length === 0) return null

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-[13px] font-medium">Activity by Category</CardTitle>
        <CopyButton tableRef={tableRef} />
      </CardHeader>
      <CardContent className="p-4 pt-2" ref={tableRef}>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Agents</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Threads</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Avg</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {activity.activityByCategory.map((row) => (
                <tr key={row.category} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-1.5">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_CHART_COLORS[row.category] ?? FALLBACK_COLOR}20`,
                        color: CATEGORY_CHART_COLORS[row.category] ?? FALLBACK_COLOR,
                      }}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{row.agents}</td>
                  <td className="px-3 py-1.5 text-right font-medium tabular-nums">{row.threads.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{row.avgThreads}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{fmtTokens(row.tokens)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Tool Combos + Raw Tools Table ───────────────────────────────────

function ToolDetailsCard({
  analytics,
}: {
  analytics: ReturnType<typeof useDirectoryAnalytics>
}) {
  const { tools } = analytics
  const [view, setView] = useState<"combos" | "individual">("combos")
  const tableRef = useRef<HTMLDivElement>(null)

  if (tools.topToolCombinations.length === 0 && tools.topRawTools.length === 0) return null

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-[13px] font-medium">Tool Details</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(["combos", "individual"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  view === v
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {v === "combos" ? "Combinations" : "Individual"}
              </button>
            ))}
          </div>
          <CopyButton tableRef={tableRef} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2" ref={tableRef}>
        <div className="rounded-lg border overflow-hidden max-h-[300px] overflow-y-auto">
          {view === "combos" ? (
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tool A</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tool B</th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">Agents</th>
                </tr>
              </thead>
              <tbody>
                {tools.topToolCombinations.map((combo, i) => (
                  <tr key={i} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <td className="px-3 py-1.5">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${TOOL_CATEGORY_COLORS[combo.toolA] ?? FALLBACK_COLOR}20`,
                          color: TOOL_CATEGORY_COLORS[combo.toolA] ?? FALLBACK_COLOR,
                        }}
                      >
                        {TOOL_CATEGORY_LABELS[combo.toolA] ?? combo.toolA}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${TOOL_CATEGORY_COLORS[combo.toolB] ?? FALLBACK_COLOR}20`,
                          color: TOOL_CATEGORY_COLORS[combo.toolB] ?? FALLBACK_COLOR,
                        }}
                      >
                        {TOOL_CATEGORY_LABELS[combo.toolB] ?? combo.toolB}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right font-medium tabular-nums">{combo.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tool</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Purpose</th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">Used by</th>
                </tr>
              </thead>
              <tbody>
                {tools.topRawTools.map((tool) => (
                  <tr key={tool.name} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <td className="px-3 py-1.5 font-mono text-foreground">{tool.name}</td>
                    <td className="px-3 py-1.5">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${TOOL_CATEGORY_COLORS[tool.category] ?? FALLBACK_COLOR}20`,
                          color: TOOL_CATEGORY_COLORS[tool.category] ?? FALLBACK_COLOR,
                        }}
                      >
                        {TOOL_CATEGORY_LABELS[tool.category] ?? tool.category}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground max-w-[200px] truncate">{tool.purpose}</td>
                    <td className="px-3 py-1.5 text-right font-medium tabular-nums">{tool.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────

export default function AgentDirectoryPage() {
  const { activeOnly } = useActiveFilter()

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
    activeOnly ? MIN_ACTIVE_THREADS : 0,
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

  const activeAgentCount = usageStats
    ? nonAdminConfigs.filter(
        (c) => (usageStats[c.id]?.threadCount ?? 0) >= MIN_ACTIVE_THREADS,
      ).length
    : 0

  // Mini sparkline data for metric cards
  const threadDistData = analytics.activity.threadDistribution.map((d) => ({
    date: d.bucket,
    value: d.agents,
  }))
  const toolsPerAgentData = analytics.tools.toolsPerAgentDistribution.map((d) => ({
    date: String(d.tools),
    value: d.agents,
  }))

  if (isLoading) return <ObservabilitySkeleton />

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-4 px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Agent Directory</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {activeOnly
                ? `${activeAgentCount} active of ${nonAdminConfigs.length}`
                : `${nonAdminConfigs.length} agents`}
            </span>
            {isClassifying && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                classifying {classifiedCount}/{activeWithMetadataCount}
              </div>
            )}
          </div>
          <button
            onClick={clearAllCache}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors rounded-md border px-2 py-1"
            title="Reclassify all agents"
          >
            <RefreshCw className="h-3 w-3" />
            Reclassify
          </button>
        </div>

        {/* Main overview chart */}
        <OverviewCard analytics={analytics} />

        {/* Metric row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SmallMetricCard
            title="Active vs Dormant"
            value={`${analytics.activity.activeAgentCount}`}
            sub={`of ${analytics.activity.activeAgentCount + analytics.activity.dormantAgentCount} active`}
            color="#22c55e"
          />
          <SmallMetricCard
            title="Thread Distribution"
            value={analytics.activity.totalThreads.toLocaleString()}
            sub="total conversations"
            chartData={threadDistData}
            color="#8b5cf6"
          />
          <SmallMetricCard
            title="Tools per Agent"
            value={`${analytics.tools.toolDistribution.length} categories`}
            sub={`${analytics.tools.topRawTools.length} unique tools`}
            chartData={toolsPerAgentData}
            color="#f59e0b"
          />
        </div>

        {/* Distribution charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CategoryDistributionCard analytics={analytics} />
          <ToolDistributionCard analytics={analytics} />
        </div>

        {/* Usage tiers + Model distribution */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UsageTiersCard analytics={analytics} />
          <ModelDistributionCard analytics={analytics} />
        </div>

        {/* Top agents table */}
        <TopAgentsTable analytics={analytics} />

        {/* Activity by category */}
        <ActivityByCategoryCard analytics={analytics} />

        {/* Tool details */}
        <ToolDetailsCard analytics={analytics} />

        {/* Agent Directory */}
        <AgentDirectoryCard analytics={analytics} onReclassify={reclassify} />
      </div>
    </motion.div>
  )
}
