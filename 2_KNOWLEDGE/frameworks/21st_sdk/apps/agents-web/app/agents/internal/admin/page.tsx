"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { api } from "@/trpc/client"
import { motion } from "motion/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bar, ComposedChart, CartesianGrid, LabelList, Line, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatCost,
  formatDuration,
  getDateFromPreset,
} from "@/app/(alpha)/agents/threads/_components/logs-constants"
import { useObservabilityMetrics } from "@/app/(alpha)/agents/observability/_components/use-observability-metrics"
import { ObservabilitySkeleton } from "@/app/(alpha)/agents/observability/_components/observability-skeleton"
import {
  LogsDateRangePicker,
  type DateRangeValue,
} from "@/app/(alpha)/agents/threads/_components/logs-date-range-picker"
import { AlertCircle, ArrowRight, Bot, Coins, Rocket, TrendingUp } from "lucide-react"
import { format, startOfDay, startOfWeek, startOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { useActiveFilter } from "./_context/active-filter-context"
import { MIN_ACTIVE_THREADS } from "./directory/_constants"

// ── Chart configs ──

const DEPLOY_COLOR = "#10b981"
const ACTIVE_COLOR = "#f59e0b"
const COST_COLOR = "#6366f1"
const TOKEN_COLOR = "#8b5cf6"
const ERROR_COLOR = "#ef4444"
const SESSION_COLOR = "#2A7FFF"

type ActiveChart = "deployed" | "active" | "cost" | "tokens" | "sessions" | "errors"

const mainChartConfig = {
  deployed: { label: "New Agents", color: DEPLOY_COLOR },
  active: { label: "Active Agents", color: ACTIVE_COLOR },
  cost: { label: "Cost", color: COST_COLOR },
  tokens: { label: "Tokens", color: TOKEN_COLOR },
  sessions: { label: "Sessions", color: SESSION_COLOR },
  errors: { label: "Errors", color: ERROR_COLOR },
  cumulativeDeployed: { label: "Total Deployed", color: "#059669" },
} satisfies ChartConfig

const billingChartConfig = {
  tokenSpend: { label: "Token", color: "hsl(var(--chart-1))" },
  computeSpend: { label: "Compute", color: "hsl(var(--chart-2))" },
  totalSpend: { label: "Total", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

// ── Helpers ──

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

function fmt(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "$0"
  if (value < 0.01) return "<$0.01"
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value.toFixed(2)}`
}

function fmtPct(value: number) {
  if (!Number.isFinite(value)) return "0%"
  return `${value.toFixed(1)}%`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function Stat({
  label,
  value,
  sub,
  large,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  large?: boolean
  accent?: "emerald" | "red" | "amber"
}) {
  const accentCls = accent === "emerald"
    ? "text-emerald-600"
    : accent === "red"
      ? "text-red-600"
      : accent === "amber"
        ? "text-amber-600"
        : "text-foreground"

  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn(
        "font-semibold tabular-nums",
        large ? "text-2xl mt-0.5" : "text-base",
        accentCls,
      )}>
        {value}
      </p>
      {sub ? <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p> : null}
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const cls =
    plan === "pro"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : plan === "free"
        ? "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
  return (
    <Badge variant="outline" className={cn("capitalize text-[10px]", cls)}>
      {plan}
    </Badge>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </p>
  )
}

// ── Main page ──

export default function AdminOverviewPage() {
  const { activeOnly } = useActiveFilter()
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: "7d" })
  const [activeChart, setActiveChart] = useState<ActiveChart>("deployed")
  const [showCumulative, setShowCumulative] = useState(false)

  const stableCreatedAfter = useMemo(
    () => getDateFromPreset(dateRange.preset, dateRange.from),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.from?.getTime()],
  )
  const stableCreatedBefore = useMemo(
    () =>
      dateRange.preset === "custom" && dateRange.to
        ? dateRange.to.toISOString()
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.to?.getTime()],
  )

  // ── Sandboxes (observability) ──
  const {
    data: sandboxesData,
    isLoading: sandboxesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentsAdmin.listAllSandboxes.useInfiniteQuery(
    {
      createdAfter: stableCreatedAfter,
      createdBefore: stableCreatedBefore,
      excludeAdminTeams: true,
      limit: 100,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  )

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allPagesFetched = !hasNextPage && !isFetchingNextPage && !sandboxesLoading

  // ── Configs ──
  const { data: allConfigs = [], isLoading: configsLoading } =
    api.agentsAdmin.listAllConfigs.useQuery()
  const { data: usageStats } =
    api.agentsAdmin.getAgentUsageStats.useQuery()

  const sandboxes = useMemo(() => {
    const all = sandboxesData?.pages.flatMap((page) => page.sandboxes) ?? []
    if (!activeOnly || !usageStats) return all
    const activeIds = new Set(
      Object.entries(usageStats)
        .filter(([, s]) => (s?.threadCount ?? 0) >= MIN_ACTIVE_THREADS)
        .map(([id]) => id),
    )
    return all.filter((s) => {
      const agentId = (s as any).agent?.id
      return agentId && activeIds.has(agentId)
    })
  }, [sandboxesData, activeOnly, usageStats])

  const nonAdminConfigs = useMemo(
    () => {
      const base = allConfigs.filter((c) => !(c as any).team?.user?.is_admin)
      if (!activeOnly || !usageStats) return base
      return base.filter((c) => (usageStats[c.id]?.threadCount ?? 0) >= MIN_ACTIVE_THREADS)
    },
    [allConfigs, activeOnly, usageStats],
  )

  // ── All-time stats ──
  const { data: allTimeStats } = api.agentsAdmin.getAllTimeStats.useQuery(
    undefined,
    { staleTime: 60_000, refetchOnWindowFocus: false },
  )

  // ── Billing data (loads independently) ──
  const { data: billingData } = api.agentsAdmin.getMetronomeBillingStats.useQuery(
    { from: stableCreatedAfter, to: stableCreatedBefore, granularity: "DAY" },
    {
      staleTime: 5 * 60_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  )

  // ── Date range helpers ──
  const now = useRef(new Date()).current
  const rangeEnd =
    dateRange.preset === "custom" && dateRange.to ? dateRange.to : now
  const rangeStart = useMemo(() => {
    if (dateRange.preset === "custom" && dateRange.from) return dateRange.from
    const presetMs: Record<string, number> = {
      "1h": 60 * 60 * 1_000,
      "24h": 24 * 60 * 60 * 1_000,
      "7d": 7 * 24 * 60 * 60 * 1_000,
      "30d": 30 * 24 * 60 * 60 * 1_000,
    }
    const ms = presetMs[dateRange.preset]
    return new Date(now.getTime() - (ms ?? 7 * 24 * 60 * 60 * 1_000))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.preset, dateRange.from?.getTime(), now])

  const availableGranularities = useMemo((): Array<"hour" | "day" | "week" | "month"> => {
    const rangeDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1_000 * 60 * 60 * 24)
    if (rangeDays <= 1) return ["hour", "day"]
    if (rangeDays <= 7) return ["hour", "day", "week"]
    return ["day", "week", "month"]
  }, [rangeStart, rangeEnd])

  const [granularity, setGranularity] = useState<"hour" | "day" | "week" | "month">("day")

  useEffect(() => {
    if (!availableGranularities.includes(granularity)) {
      setGranularity(availableGranularities[0]!)
    }
  }, [availableGranularities, granularity])

  const metrics = useObservabilityMetrics(sandboxes, granularity, rangeStart, rangeEnd)

  // ── Deployed / active agents ──
  const { totalDeployed, totalActive } = useMemo(() => {
    let deployed = 0
    for (const config of nonAdminConfigs) {
      const dep = (config as any).activeDeployment
      if (!dep?.deployed_at) continue
      const depDate = new Date(dep.deployed_at)
      if (depDate >= rangeStart && depDate <= rangeEnd) deployed++
    }
    const activeIds = new Set(
      sandboxes.map((s) => (s as any).agent?.id).filter(Boolean),
    )
    return { totalDeployed: deployed, totalActive: activeIds.size }
  }, [nonAdminConfigs, sandboxes, rangeStart, rangeEnd])

  // ── Main chart data ──
  const mainChartData = useMemo(() => {
    const allThreads = sandboxes.flatMap((p) => (p as any).threads ?? [])
    const bucketFn =
      granularity === "hour" ? (d: Date) => format(d, "HH:mm") :
      granularity === "month" ? (d: Date) => format(d, "MMM yyyy") :
      (d: Date) => format(d, "MMM dd")
    const startFn =
      granularity === "hour" ? (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()) :
      granularity === "week" ? (d: Date) => startOfWeek(d) :
      granularity === "month" ? (d: Date) => startOfMonth(d) :
      (d: Date) => startOfDay(d)

    const costByBucket = new Map<string, number>()
    const tokensByBucket = new Map<string, number>()
    const errorsByBucket = new Map<string, number>()

    for (const thread of allThreads) {
      const d = new Date(thread.created_at)
      const bucket = bucketFn(startFn(d))
      costByBucket.set(bucket, (costByBucket.get(bucket) ?? 0) + (thread.total_cost_usd ?? 0))
      tokensByBucket.set(bucket, (tokensByBucket.get(bucket) ?? 0) + (thread.total_tokens ?? 0))
      if (thread.status === "error") {
        errorsByBucket.set(bucket, (errorsByBucket.get(bucket) ?? 0) + 1)
      }
    }

    const deployedByBucket = new Map<string, Set<string>>()
    for (const config of nonAdminConfigs) {
      const dep = (config as any).activeDeployment
      if (!dep?.deployed_at) continue
      const depDate = new Date(dep.deployed_at)
      if (depDate >= rangeStart && depDate <= rangeEnd) {
        const bucket = bucketFn(startFn(depDate))
        if (!deployedByBucket.has(bucket)) deployedByBucket.set(bucket, new Set())
        deployedByBucket.get(bucket)!.add(config.id)
      }
    }

    const activeByBucket = new Map<string, Set<string>>()
    for (const sandbox of sandboxes) {
      const createdAt = new Date(sandbox.created_at)
      const bucket = bucketFn(startFn(createdAt))
      const agentId = (sandbox as any).agent?.id
      if (!agentId) continue
      if (!activeByBucket.has(bucket)) activeByBucket.set(bucket, new Set())
      activeByBucket.get(bucket)!.add(agentId)
    }

    const data = metrics.sessionsOverTime.map((s) => ({
      date: s.date,
      deployed: deployedByBucket.get(s.date)?.size ?? 0,
      active: activeByBucket.get(s.date)?.size ?? 0,
      cost: costByBucket.get(s.date) ?? 0,
      tokens: tokensByBucket.get(s.date) ?? 0,
      sessions: s.count,
      errors: errorsByBucket.get(s.date) ?? 0,
      cumulativeDeployed: 0,
      growthPercent: null as number | null,
    }))

    let cumulative = 0
    for (let i = 0; i < data.length; i++) {
      const prev = cumulative
      cumulative += data[i]!.deployed
      data[i]!.cumulativeDeployed = cumulative
      data[i]!.growthPercent = prev > 0 ? ((cumulative - prev) / prev) * 100 : null
    }

    return data
  }, [sandboxes, nonAdminConfigs, granularity, metrics.sessionsOverTime, rangeStart, rangeEnd])

  const periodGrowthPercent = useMemo(() => {
    if (mainChartData.length < 2) return null
    const first = mainChartData[0]!.cumulativeDeployed - mainChartData[0]!.deployed
    const last = mainChartData[mainChartData.length - 1]!.cumulativeDeployed
    if (first <= 0) return null
    return ((last - first) / first) * 100
  }, [mainChartData])

  const weeklyGrowth = useMemo(() => {
    const last7 = mainChartData.slice(-7)
    const prev7 = mainChartData.slice(-14, -7)
    if (last7.length < 7 || prev7.length < 7) return null
    const currentSum = last7.reduce((s, d) => s + (d[activeChart] as number), 0)
    const prevSum = prev7.reduce((s, d) => s + (d[activeChart] as number), 0)
    if (prevSum <= 0) return null
    return { current: currentSum, prev: prevSum, pct: ((currentSum - prevSum) / prevSum) * 100 }
  }, [mainChartData, activeChart])

  const chartDataWithCumulative = useMemo(() => {
    if (!showCumulative) return mainChartData
    let cum = 0
    return mainChartData.map((d) => {
      cum += d[activeChart] as number
      return { ...d, cumulativeValue: cum }
    })
  }, [mainChartData, activeChart, showCumulative])

  // ── Recent deployments ──
  const recentDeployments = useMemo(() => {
    return nonAdminConfigs
      .filter((c) => !!(c as any).activeDeployment?.deployed_at)
      .sort((a, b) => {
        const aDate = new Date((a as any).activeDeployment.deployed_at).getTime()
        const bDate = new Date((b as any).activeDeployment.deployed_at).getTime()
        return bDate - aDate
      })
      .slice(0, 8)
  }, [nonAdminConfigs])

  // ── Recent errors ──
  const recentErrorsWithContext = useMemo(() => {
    const errors: {
      threadId: string; error: string; created_at: string | Date
      agentName: string; agentSlug: string; teamName: string; ownerEmail: string
    }[] = []

    for (const sandbox of sandboxes) {
      const agent = (sandbox as any).agent
      const threads = (sandbox as any).threads ?? []
      for (const thread of threads) {
        if (thread.status === "error") {
          errors.push({
            threadId: thread.id,
            error: thread.error || "Unknown error",
            created_at: thread.created_at,
            agentName: agent?.name ?? "Unknown",
            agentSlug: agent?.slug ?? "",
            teamName: agent?.team?.name ?? "Unknown",
            ownerEmail: agent?.team?.user?.email ?? "—",
          })
        }
      }
    }

    return errors
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
  }, [sandboxes])

  // ── Top agents by cost ──
  const topAgentsByCost = useMemo(() => {
    const costMap = new Map<string, { id: string; name: string; slug: string; teamName: string; ownerEmail: string; cost: number; sessions: number; tokens: number }>()
    for (const sandbox of sandboxes) {
      const agent = (sandbox as any).agent
      const agentId = agent?.id
      if (!agentId) continue
      const threads = (sandbox as any).threads ?? []
      const cost = threads.reduce((s: number, t: any) => s + (t.total_cost_usd ?? 0), 0)
      const tokens = threads.reduce((s: number, t: any) => s + (t.total_tokens ?? 0), 0)
      const prev = costMap.get(agentId) ?? {
        id: agentId, name: agent?.name ?? "Unknown", slug: agent?.slug ?? "",
        teamName: agent?.team?.name ?? "Unknown", ownerEmail: agent?.team?.user?.email ?? "—",
        cost: 0, sessions: 0, tokens: 0,
      }
      costMap.set(agentId, { ...prev, cost: prev.cost + cost, sessions: prev.sessions + 1, tokens: prev.tokens + tokens })
    }
    return [...costMap.values()].sort((a, b) => b.cost - a.cost).slice(0, 8)
  }, [sandboxes])

  const totalTokens = useMemo(() => {
    const allThreads = sandboxes.flatMap((p) => (p as any).threads ?? [])
    return allThreads.reduce((s: number, t: any) => s + (t.total_tokens ?? 0), 0)
  }, [sandboxes])

  const hasStreamingThreads = sandboxes.some((p) =>
    (p as any).threads?.some((d: any) => d.status === "streaming"),
  )

  // ── Billing derived data ──
  const bk = billingData?.kpis
  const billingTimeSeries = billingData?.timeSeries ?? []
  const proSubscribers = billingData?.proSubscribers ?? []
  const creditLimitUsers = billingData?.creditLimitUsers ?? []
  const topSpenders = billingData?.topSpenders ?? []

  if (!allPagesFetched || configsLoading) {
    return <ObservabilitySkeleton />
  }

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-5 px-8 py-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between -mb-2">
          <span className="text-sm font-medium">Overview</span>
          <div className="flex items-center gap-2">
            {hasStreamingThreads && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                <span>Live</span>
              </div>
            )}
            <LogsDateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* ── All-time stats ── */}
        {allTimeStats ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Agents</p>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold tabular-nums">{allTimeStats.totalAgents.toLocaleString()}</span>
                <div className="flex flex-col gap-0.5 pb-1">
                  {allTimeStats.agentsGrowthPct != null ? (
                    <span className={cn(
                      "text-[11px] font-medium tabular-nums",
                      allTimeStats.agentsGrowthPct > 0 ? "text-emerald-600 dark:text-emerald-400" : allTimeStats.agentsGrowthPct < 0 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {allTimeStats.agentsGrowthPct > 0 ? "+" : ""}{allTimeStats.agentsGrowthPct.toFixed(1)}% WoW
                    </span>
                  ) : null}
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {allTimeStats.agentsLast7d} this week vs {allTimeStats.agentsPrev7d} prev
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Token Usage</p>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold tabular-nums">
                  {allTimeStats.totalTokens >= 1_000_000_000
                    ? `${(allTimeStats.totalTokens / 1_000_000_000).toFixed(2)}B`
                    : allTimeStats.totalTokens >= 1_000_000
                      ? `${(allTimeStats.totalTokens / 1_000_000).toFixed(1)}M`
                      : allTimeStats.totalTokens >= 1_000
                        ? `${(allTimeStats.totalTokens / 1_000).toFixed(1)}K`
                        : allTimeStats.totalTokens.toLocaleString()}
                </span>
                <div className="flex flex-col gap-0.5 pb-1">
                  {allTimeStats.tokensGrowthPct != null ? (
                    <span className={cn(
                      "text-[11px] font-medium tabular-nums",
                      allTimeStats.tokensGrowthPct > 0 ? "text-emerald-600 dark:text-emerald-400" : allTimeStats.tokensGrowthPct < 0 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {allTimeStats.tokensGrowthPct > 0 ? "+" : ""}{allTimeStats.tokensGrowthPct.toFixed(1)}% WoW
                    </span>
                  ) : null}
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {allTimeStats.tokensLast7d >= 1_000_000
                      ? `${(allTimeStats.tokensLast7d / 1_000_000).toFixed(1)}M`
                      : allTimeStats.tokensLast7d.toLocaleString()} this week vs{" "}
                    {allTimeStats.tokensPrev7d >= 1_000_000
                      ? `${(allTimeStats.tokensPrev7d / 1_000_000).toFixed(1)}M`
                      : allTimeStats.tokensPrev7d.toLocaleString()} prev
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Billing hero (loads async) ── */}
        {bk ? (
          <div className="rounded-xl border bg-card p-5">
            <div className="grid grid-cols-3 gap-6">
              <Stat label="MRR" value={fmt(bk.mrr)} sub={`${bk.proCustomers} Pro × $${Math.round(bk.mrr / Math.max(bk.proCustomers, 1))}/mo`} large />
              <Stat label="Total Usage" value={fmt(bk.totalRevenue)} sub={`Token ${fmt(bk.tokenSpend)} · Compute ${fmt(bk.computeSpend)}`} large />
              <Stat label="ARPU" value={fmt(bk.arpu)} sub={`${bk.totalCustomers} teams with agents`} large />
            </div>
          </div>
        ) : null}

        {/* ── Customers & Credits ── */}
        {bk ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Customers</p>
              <div className="flex items-end gap-5">
                <Stat label="Pro" value={bk.proCustomers} accent="emerald" />
                <Stat label="Free" value={bk.freeCustomers} />
                <Stat label="Conv." value={fmtPct(bk.conversionRate)} />
              </div>
              {bk.totalCustomers > 0 ? (
                <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${(bk.proCustomers / bk.totalCustomers) * 100}%` }} />
                  <div className="bg-zinc-400 transition-all" style={{ width: `${(bk.freeCustomers / bk.totalCustomers) * 100}%` }} />
                </div>
              ) : null}
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Credit Health</p>
              <div className="flex items-end gap-5">
                <Stat label="Granted" value={fmt(bk.totalCreditGranted)} />
                <Stat label="Used" value={fmt(bk.totalCreditUsed)} sub={`${fmtPct(bk.creditUtilization)}`} />
                <Stat label="At Limit" value={bk.freeAtCreditLimit} accent={bk.freeAtCreditLimit > 0 ? "red" : undefined} />
                <Stat label="Overage" value={bk.proInOverage} accent={bk.proInOverage > 0 ? "amber" : undefined} />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Pro Subscribers ── */}
        {proSubscribers.length > 0 ? (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center bg-emerald-50/50 dark:bg-emerald-950/20 px-4 border-b border-emerald-200/30 dark:border-emerald-500/10">
              <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Pro Subscribers ({proSubscribers.length})
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proSubscribers.map((sub) => (
                  <TableRow key={sub.teamId}>
                    <TableCell className="text-[12px] font-medium">{sub.teamName}</TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">{sub.ownerEmail || "—"}</TableCell>
                    <TableCell className="text-[12px] tabular-nums text-muted-foreground">
                      {sub.startedAt ? fmtDate(sub.startedAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-[12px] font-medium">{fmt(sub.totalSpend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {/* ── Platform Metrics chart ── */}
        <Card className="shadow-none rounded-xl overflow-hidden">
          <div className="flex flex-wrap items-stretch border-b">
            <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-2.5 min-w-[180px]">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium">Platform Metrics</span>
                <button
                  onClick={() => setShowCumulative((v) => !v)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    showCumulative
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  Cumulative
                </button>
                {showCumulative && weeklyGrowth != null && (
                  <span className={`text-[10px] font-medium tabular-nums ${weeklyGrowth.pct > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    {weeklyGrowth.pct > 0 ? "+" : ""}{weeklyGrowth.pct.toFixed(1)}% WoW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">
                  {nonAdminConfigs.length} total agents &middot; avg {formatDuration(metrics.avgDuration > 0 ? metrics.avgDuration : null)}
                </span>
                <span className="text-muted-foreground/30">&middot;</span>
                <div className="flex items-center gap-0.5">
                  {(availableGranularities as Array<"hour" | "day" | "week" | "month">).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGranularity(g)}
                      className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                        granularity === g
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {{ hour: "H", day: "D", week: "W", month: "M" }[g]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap">
              {([
                { key: "deployed" as const, label: "New Agents", value: totalDeployed.toLocaleString() },
                { key: "active" as const, label: "Active", value: totalActive.toLocaleString() },
                { key: "cost" as const, label: "Cost", value: formatCost(metrics.totalCost > 0 ? metrics.totalCost : null) },
                { key: "tokens" as const, label: "Tokens", value: totalTokens.toLocaleString() },
                { key: "sessions" as const, label: "Sessions", value: metrics.totalSessions.toLocaleString() },
                { key: "errors" as const, label: "Errors", value: `${metrics.errorCount.toLocaleString()} (${metrics.errorRate > 0 ? metrics.errorRate.toFixed(1) : "0"}%)` },
              ]).map(({ key, label, value }) => (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="flex flex-col justify-center gap-0.5 border-l px-3 py-2.5 text-left data-[active=true]:bg-muted/50"
                  onClick={() => setActiveChart(key)}
                >
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold leading-none tabular-nums">{value}</span>
                    {key === "deployed" && periodGrowthPercent != null && (
                      <span className={`text-[10px] font-medium tabular-nums ${periodGrowthPercent > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        {periodGrowthPercent > 0 ? "+" : ""}{periodGrowthPercent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-4">
            <ChartContainer config={mainChartConfig} className="aspect-auto h-[220px] w-full">
              <ComposedChart accessibilityLayer data={chartDataWithCumulative} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" hide />
                {showCumulative && <YAxis yAxisId="right" orientation="right" hide />}
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const data = payload[0]?.payload
                    if (!data) return null
                    const chartMeta: Record<ActiveChart, { label: string; color: string; format: (v: number) => string }> = {
                      deployed: { label: "New Agents", color: DEPLOY_COLOR, format: (v) => v.toLocaleString() },
                      active: { label: "Active Agents", color: ACTIVE_COLOR, format: (v) => v.toLocaleString() },
                      cost: { label: "Cost", color: COST_COLOR, format: (v) => `$${v.toFixed(4)}` },
                      tokens: { label: "Tokens", color: TOKEN_COLOR, format: (v) => v.toLocaleString() },
                      sessions: { label: "Sessions", color: SESSION_COLOR, format: (v) => v.toLocaleString() },
                      errors: { label: "Errors", color: ERROR_COLOR, format: (v) => v.toLocaleString() },
                    }
                    const meta = chartMeta[activeChart]
                    const value = data[activeChart] as number
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                        <p className="text-[11px] font-medium text-foreground mb-1">{data.date}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                          <span className="text-[11px] text-muted-foreground">{meta.label}</span>
                          <span className="text-[11px] font-semibold tabular-nums text-foreground ml-auto">{meta.format(value)}</span>
                        </div>
                        {showCumulative && data.cumulativeValue != null && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#059669" }} />
                            <span className="text-[11px] text-muted-foreground">Cumulative</span>
                            <span className="text-[11px] font-semibold tabular-nums text-foreground ml-auto">{meta.format(data.cumulativeValue as number)}</span>
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={[2, 2, 0, 0]} yAxisId="left">
                  <LabelList
                    dataKey={activeChart}
                    position="top"
                    className="fill-muted-foreground"
                    fontSize={10}
                    offset={4}
                    formatter={(value: number) => {
                      if (!value) return ""
                      if (activeChart === "cost") return `$${value.toFixed(2)}`
                      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
                      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
                      return value.toLocaleString()
                    }}
                  />
                </Bar>
                {showCumulative && (
                  <Line dataKey="cumulativeValue" type="monotone" stroke="#059669" strokeWidth={2} dot={false} yAxisId="right" />
                )}
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ── Billing Usage Trend ── */}
        {billingTimeSeries.length > 0 ? (
          <Card className="shadow-none rounded-xl overflow-hidden">
            <div className="flex items-stretch border-b">
              <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-2.5">
                <span className="text-[13px] font-medium">Billing Usage</span>
              </div>
              {bk ? (
                <div className="hidden sm:flex">
                  {[
                    { label: "Total", value: bk.totalRevenue },
                    { label: "Token", value: bk.tokenSpend },
                    { label: "Compute", value: bk.computeSpend },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col justify-center gap-0.5 border-l px-5 py-2.5 text-left">
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                      <span className="text-[14px] font-semibold leading-none tabular-nums">{fmt(s.value)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <CardContent className="p-4">
              <ChartContainer config={billingChartConfig} className="aspect-auto h-[180px] w-full">
                <ComposedChart accessibilityLayer data={billingTimeSeries} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" hide />
                  <ChartTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]?.payload
                      if (!d) return null
                      return (
                        <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                          <p className="text-[11px] font-medium text-foreground mb-1.5">{d.date}</p>
                          {[
                            { label: "Token", value: d.tokenSpend, color: "hsl(var(--chart-1))" },
                            { label: "Compute", value: d.computeSpend, color: "hsl(var(--chart-2))" },
                            { label: "Total", value: d.totalSpend, color: "hsl(var(--chart-3))" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-[11px] text-muted-foreground flex-1">{item.label}</span>
                              <span className="text-[11px] font-semibold tabular-nums text-foreground ml-4">{fmt(item.value as number)}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Bar yAxisId="left" dataKey="tokenSpend" stackId="spend" fill="var(--color-tokenSpend)" radius={[0, 0, 0, 0]} />
                  <Bar yAxisId="left" dataKey="computeSpend" stackId="spend" fill="var(--color-computeSpend)" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="totalSpend" stroke="var(--color-totalSpend)" strokeWidth={1.75} dot={false} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : null}

        {/* ── Credit Limit Users ── */}
        {creditLimitUsers.length > 0 ? (
          <div className="rounded-xl border overflow-hidden border-red-200/50 dark:border-red-500/20">
            <div className="flex h-10 items-center bg-red-50/30 dark:bg-red-950/20 px-4 border-b border-red-200/30 dark:border-red-500/10">
              <span className="text-[11px] font-medium uppercase tracking-widest text-red-600 dark:text-red-400">
                At Credit Limit ({creditLimitUsers.length})
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="text-right">Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditLimitUsers.map((user) => {
                  const pct = user.creditLimit > 0 ? (user.totalSpend / user.creditLimit) * 100 : 0
                  return (
                    <TableRow key={user.teamId}>
                      <TableCell className="text-[12px] font-medium">{user.teamName}</TableCell>
                      <TableCell className="text-[12px] text-muted-foreground">{user.ownerEmail || "—"}</TableCell>
                      <TableCell><PlanBadge plan={user.planStatus} /></TableCell>
                      <TableCell className="text-right tabular-nums text-[12px]">{fmt(user.creditLimit)}</TableCell>
                      <TableCell className="text-right tabular-nums text-[12px] font-medium">
                        <span className={pct >= 100 ? "text-red-600" : "text-amber-600"}>{fmtPct(pct)}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {/* ── Top Agents by Cost ── */}
        {topAgentsByCost.length > 0 && (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center border-b bg-muted/30 px-4">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Top Agents by Cost
              </span>
            </div>
            <div>
              {topAgentsByCost.map((agent, i) => (
                <Link
                  key={agent.id}
                  href={`/agents/internal/admin/deployments/${agent.id}`}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors ${
                    i < topAgentsByCost.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <span className="w-5 shrink-0 text-[11px] font-medium text-muted-foreground/50 tabular-nums text-right">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-foreground truncate">{agent.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/50">{agent.slug}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                      <span>{agent.teamName}</span>
                      <span>&middot;</span>
                      <span title={agent.ownerEmail}>{agent.ownerEmail}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-[11px] tabular-nums">
                    <span className="text-muted-foreground">{agent.sessions} sess</span>
                    <span className="text-muted-foreground">{agent.tokens.toLocaleString()} tok</span>
                    <span className="font-medium text-foreground min-w-[60px] text-right">{formatCost(agent.cost > 0 ? agent.cost : null)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Top Spenders (Billing) ── */}
        {topSpenders.length > 0 ? (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center bg-muted/30 px-4 border-b">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Top Spenders (Billing)
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Token</TableHead>
                  <TableHead className="text-right">Compute</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSpenders.map((s, i) => (
                  <TableRow key={s.teamId}>
                    <TableCell className="text-[11px] text-muted-foreground/50 tabular-nums">{i + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-medium">{s.teamName}</p>
                        <p className="text-[11px] text-muted-foreground">{s.ownerEmail || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell><PlanBadge plan={s.planStatus} /></TableCell>
                    <TableCell className="text-right tabular-nums text-[12px]">{fmt(s.tokenSpend)}</TableCell>
                    <TableCell className="text-right tabular-nums text-[12px]">{fmt(s.computeSpend)}</TableCell>
                    <TableCell className="text-right tabular-nums text-[12px] font-medium">{fmt(s.totalSpend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {/* ── Recent Deployments ── */}
        {recentDeployments.length > 0 && (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center justify-between border-b bg-muted/30 px-4">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Recent Deployments
              </span>
              <Link href="/agents/internal/admin/deployments" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div>
              {recentDeployments.map((config, i) => {
                const dep = (config as any).activeDeployment
                const team = (config as any).team
                const age = formatRelativeTime(new Date(dep.deployed_at))
                return (
                  <Link
                    key={config.id}
                    href={`/agents/internal/admin/deployments/${config.id}`}
                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors ${
                      i < recentDeployments.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <Rocket className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-foreground truncate">{config.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/50">v{dep.version}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">{config.runtime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                        <span className="truncate">{config.slug}</span>
                        <span>&middot;</span>
                        <span className="truncate">{team?.name ?? "Unknown"}</span>
                        <span>&middot;</span>
                        <span className="truncate">{team?.user?.email ?? "—"}</span>
                      </div>
                    </div>
                    {(() => {
                      const reqCount = (config as any)._count?.sandboxes ?? 0
                      return reqCount > 0 ? (
                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {reqCount} {reqCount === 1 ? "req" : "reqs"}
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">0 reqs</span>
                      )
                    })()}
                    <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">{age}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Recent Errors ── */}
        {recentErrorsWithContext.length > 0 && (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center justify-between border-b bg-muted/30 px-4">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Recent Errors
              </span>
              <Link href="/agents/internal/admin/logs" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                View logs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div>
              {recentErrorsWithContext.map((err, i) => (
                <div
                  key={err.threadId}
                  className={`flex items-start gap-3 px-4 py-2.5 ${
                    i < recentErrorsWithContext.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-destructive">{err.error}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground/70">{err.agentName}</span>
                      <span>&middot;</span>
                      <span>{err.teamName}</span>
                      <span>&middot;</span>
                      <span className="tabular-nums">
                        {new Date(err.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {billingData?.warnings?.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2.5 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400">
            {billingData.warnings.join(" · ")}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
