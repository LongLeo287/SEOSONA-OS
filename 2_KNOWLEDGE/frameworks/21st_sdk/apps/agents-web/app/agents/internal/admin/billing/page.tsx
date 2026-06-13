"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { api } from "@/trpc/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  LogsDateRangePicker,
  type DateRangeValue,
} from "@/app/(alpha)/agents/threads/_components/logs-date-range-picker"
import { getDateFromPreset } from "@/app/(alpha)/agents/threads/_components/logs-constants"
import { ObservabilitySkeleton } from "@/app/(alpha)/agents/observability/_components/observability-skeleton"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

const CHART_CONFIG = {
  tokenSpend: { label: "Token", color: "hsl(var(--chart-1))" },
  computeSpend: { label: "Compute", color: "hsl(var(--chart-2))" },
  totalSpend: { label: "Total", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

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

export default function BillingStatsPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: "30d" })

  const from = useMemo(
    () => getDateFromPreset(dateRange.preset, dateRange.from),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.from?.getTime()],
  )
  const to = useMemo(
    () =>
      dateRange.preset === "custom" && dateRange.to
        ? dateRange.to.toISOString()
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateRange.preset, dateRange.to?.getTime()],
  )

  const { data, isLoading, error } = api.agentsAdmin.getMetronomeBillingStats.useQuery(
    { from, to, granularity: "DAY" },
    {
      staleTime: 5 * 60_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  )

  if (isLoading && !data) return <ObservabilitySkeleton />

  if (error && !data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-4 text-sm text-destructive max-w-md text-center">
          <p className="font-medium mb-1">Failed to load billing stats</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  const k = data?.kpis
  const timeSeries = data?.timeSeries ?? []
  const topSpenders = data?.topSpenders ?? []
  const creditLimitUsers = data?.creditLimitUsers ?? []
  const proSubscribers = data?.proSubscribers ?? []

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 px-8 py-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Agent Billing</span>
          <LogsDateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {data?.warnings?.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2.5 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400">
            {data.warnings.join(" · ")}
          </div>
        ) : null}

        {k ? (
          <>
            {/* ── Hero numbers ── */}
            <div className="rounded-xl border bg-card p-5">
              <div className="grid grid-cols-3 gap-6">
                <Stat label="MRR" value={fmt(k.mrr)} sub={`${k.proCustomers} Pro × $${Math.round(k.mrr / Math.max(k.proCustomers, 1))}/mo`} large />
                <Stat label="Total Usage" value={fmt(k.totalRevenue)} sub={`Token ${fmt(k.tokenSpend)} · Compute ${fmt(k.computeSpend)}`} large />
                <Stat label="ARPU" value={fmt(k.arpu)} sub={`${k.totalCustomers} teams with agents`} large />
              </div>
            </div>

            {/* ── Customers breakdown ── */}
            <div className="rounded-xl border bg-card p-5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Customers</p>
              <div className="flex items-end gap-8">
                <Stat label="Pro" value={k.proCustomers} accent="emerald" sub={`Spend: ${fmt(k.proSpend)} (avg ${fmt(k.avgSpendPerPro)})`} />
                <Stat label="Free" value={k.freeCustomers} sub={`Spend: ${fmt(k.freeSpend)} (avg ${fmt(k.avgSpendPerFree)})`} />
                <Stat label="Unknown" value={k.unknownCustomers} />
                <Stat label="Conversion" value={fmtPct(k.conversionRate)} sub="Free → Pro" />
              </div>

              {/* visual bar */}
              {k.totalCustomers > 0 ? (
                <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${(k.proCustomers / k.totalCustomers) * 100}%` }} />
                  <div className="bg-zinc-400 transition-all" style={{ width: `${(k.freeCustomers / k.totalCustomers) * 100}%` }} />
                  <div className="bg-amber-400 transition-all" style={{ width: `${(k.unknownCustomers / k.totalCustomers) * 100}%` }} />
                </div>
              ) : null}
            </div>

            {/* ── Credits ── */}
            <div className="rounded-xl border bg-card p-5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Credit Health</p>
              <div className="flex items-end gap-8">
                <Stat label="Granted" value={fmt(k.totalCreditGranted)} />
                <Stat label="Used" value={fmt(k.totalCreditUsed)} sub={`${fmtPct(k.creditUtilization)} utilization`} />
                <Stat label="Free at Limit" value={k.freeAtCreditLimit} accent={k.freeAtCreditLimit > 0 ? "red" : undefined} sub="≥90% of $10 used" />
                <Stat label="Pro Overage" value={k.proInOverage} accent={k.proInOverage > 0 ? "amber" : undefined} sub="Exceeded $20/mo" />
              </div>
            </div>
          </>
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
                    <TableCell className="text-right tabular-nums text-[12px] font-medium">
                      {fmt(sub.totalSpend)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {/* ── Usage Trend ── */}
        {timeSeries.length > 0 ? (
          <Card className="shadow-none rounded-xl overflow-hidden">
            <div className="flex items-stretch border-b">
              <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-2.5">
                <span className="text-[13px] font-medium">Usage Trend</span>
              </div>
              {k ? (
                <div className="hidden sm:flex">
                  {[
                    { label: "Total", value: k.totalRevenue },
                    { label: "Token", value: k.tokenSpend },
                    { label: "Compute", value: k.computeSpend },
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
              <ChartContainer config={CHART_CONFIG} className="aspect-auto h-[220px] w-full">
                <ComposedChart accessibilityLayer data={timeSeries} margin={{ left: 12, right: 12 }}>
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

        {/* ── Top Spenders ── */}
        {topSpenders.length > 0 ? (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex h-10 items-center bg-muted/30 px-4 border-b">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Top Spenders
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
      </div>
    </motion.div>
  )
}
