"use client"

import { getDateFromPreset } from "@/app/(alpha)/agents/threads/_components/logs-constants"
import {
  LogsDateRangePicker,
  type DateRangeValue,
} from "@/app/(alpha)/agents/threads/_components/logs-date-range-picker"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { api } from "@/trpc/client"
import { format, subDays, subMonths } from "date-fns"
import { useAtomValue } from "jotai"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const COST_COLOR = "#2A7FFF"
const COMPUTE_COLOR = "#22C55E"

const SKELETON_BAR_HEIGHTS = [
  35, 22, 48, 30, 55, 25, 42, 60, 38, 20, 45, 33, 52, 28, 40, 50, 35, 58, 27,
  44,
]

const mainChartConfig = {
  cost: { label: "Total Cost", color: COST_COLOR },
} satisfies ChartConfig

function formatCurrency(value: number) {
  if (value <= 0) return "$0.00"
  if (value < 0.01) return "<$0.01"
  return `$${value.toFixed(2)}`
}

function formatDurationSeconds(value: number) {
  if (value < 60) return `${value.toFixed(0)}s`
  if (value < 3600) return `${(value / 60).toFixed(1)}m`
  return `${(value / 3600).toFixed(1)}h`
}

function formatDateRangeLabel(startingOn?: string, endingBefore?: string) {
  if (!startingOn || !endingBefore) return "Date"
  const start = new Date(startingOn)
  const end = new Date(endingBefore)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Date"
  }

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
  }

  if (sameYear) {
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
  }

  return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`
}

function getLast7DaysDateRange(): DateRangeValue {
  const to = new Date()
  const from = subDays(to, 7)
  return { preset: "custom", from, to }
}

function getBillingCycleRangeFromEnd(periodEndIso?: string | null) {
  if (!periodEndIso) return null
  const to = new Date(periodEndIso)
  if (Number.isNaN(to.getTime())) return null
  const from = subMonths(to, 1)
  if (Number.isNaN(from.getTime())) return null
  return { from, to }
}

function UsageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Chart skeleton */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="p-4">
          <div className="h-[250px] w-full flex items-end gap-[6px] px-3 pb-6">
            {SKELETON_BAR_HEIGHTS.map((h, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Table skeleton */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-12">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b">
            <Skeleton className="h-3.5 w-28" />
            <div className="flex gap-12">
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function UsagePageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const defaultDateRangeAppliedTeamRef = useRef<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    getLast7DaysDateRange(),
  )
  const [devPlanOverride, setDevPlanOverride] = useState<
    "free" | "pro" | null
  >(null)

  const {
    data: billingCheckData,
    isLoading: isBillingCheckLoading,
    error: billingCheckError,
  } = api.anBilling.check.useQuery(
    { teamId: teamId! },
    {
      enabled: !!teamId,
      retry: false,
    },
  )

  useEffect(() => {
    if (!teamId) {
      defaultDateRangeAppliedTeamRef.current = null
      return
    }

    if (defaultDateRangeAppliedTeamRef.current === teamId) return
    if (isBillingCheckLoading) return
    if (!billingCheckData && !billingCheckError) return

    const billingCycleRange = getBillingCycleRangeFromEnd(
      billingCheckData?.current_period_end,
    )
    if (billingCycleRange) {
      setDateRange({
        preset: "custom",
        from: billingCycleRange.from,
        to: billingCycleRange.to,
      })
      defaultDateRangeAppliedTeamRef.current = teamId
      return
    }

    setDateRange(getLast7DaysDateRange())
    defaultDateRangeAppliedTeamRef.current = teamId
  }, [
    billingCheckData?.current_period_end,
    billingCheckError,
    isBillingCheckLoading,
    teamId,
  ])

  const startingOn = getDateFromPreset(dateRange.preset, dateRange.from)
  const endingBefore =
    dateRange.preset === "custom" && dateRange.to
      ? dateRange.to.toISOString()
      : dateRange.preset !== "all"
        ? new Date().toISOString()
        : undefined
  const windowSize = (() => {
    if (!startingOn || !endingBefore) return "DAY" as const
    const durationMs =
      new Date(endingBefore).getTime() - new Date(startingOn).getTime()
    return durationMs <= 48 * 60 * 60 * 1000 ? "HOUR" : "DAY"
  })()

  const { data, isLoading, error } = api.anBilling.metrics.useQuery(
    {
      teamId: teamId!,
      startingOn,
      endingBefore,
      windowSize,
    },
    {
      enabled: !!teamId && !isBillingCheckLoading,
      placeholderData: (previousData) => previousData,
    },
  )

  const rawPlanStatus = billingCheckData?.plan_status
  const planStatus = devPlanOverride ?? rawPlanStatus

  const showLoading = isBillingCheckLoading || (!data && isLoading)
  const dateTriggerLabel = formatDateRangeLabel(startingOn, endingBefore)

  return (
    <div className="h-full w-full overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-[720px] px-8 py-6">
        {/* ── Header ── */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">Usage</h1>
          </div>
          <div className="flex items-center gap-2">
            {(planStatus === "free" || !planStatus) && (
              <Link
                href="/agents/billing"
                className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/85"
              >
                Upgrade to Pro
              </Link>
            )}
            <LogsDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              allTimeLabel={dateTriggerLabel}
              customRangeLabel={dateTriggerLabel}
            />
          </div>
        </div>

        {showLoading ? (
          <UsageSkeleton />
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
            <p className="font-medium mb-1">Failed to load usage data</p>
            <p className="text-xs opacity-80">{error.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* ── Activity Chart ── */}
            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-[13px] font-medium">Daily Cost</span>
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatCurrency(data?.totals.totalCost ?? 0)}
                </span>
              </div>
              <div className="p-4">
                <ChartContainer
                  config={mainChartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={data?.series ?? []}
                    margin={{ left: 12, right: 12 }}
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
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          labelFormatter={(value) => String(value)}
                          formatter={(value) => formatCurrency(value as number)}
                        />
                      }
                    />
                    <Bar
                      dataKey="cost"
                      fill="var(--color-cost)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* ── Consumption Breakdown ── */}
            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-[13px] font-medium">
                  Consumption Breakdown
                </span>
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatCurrency(data?.totals.totalCost ?? 0)}
                </span>
              </div>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-2 text-left text-[11px] font-medium text-muted-foreground">
                      Resource
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-medium text-muted-foreground">
                      Usage
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-medium text-muted-foreground">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: COST_COLOR }}
                        />
                        <span>Claude Tokens</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      —
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(data?.totals.tokenCost ?? 0)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: COMPUTE_COLOR }}
                        />
                        <span>Compute</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {formatDurationSeconds(data?.totals.totalUsage ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(data?.totals.computeCost ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Total</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {formatCurrency(data?.totals.totalCost ?? 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Disclaimer ── */}
            <p className="text-[11px] text-muted-foreground">
              Usage data can be up to 1 hour old.
            </p>
          </div>
        )}
      </div>

      {/* DEV: Plan override toggle */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <span className="text-[11px] font-medium text-muted-foreground">
            DEV
          </span>
          <button
            type="button"
            onClick={() =>
              setDevPlanOverride(
                devPlanOverride === "free" ? "pro" : "free",
              )
            }
            className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            {devPlanOverride
              ? `Override: ${devPlanOverride === "free" ? "Hobby" : "Pro"}`
              : `Actual: ${rawPlanStatus === "pro" ? "Pro" : "Hobby"}`}
          </button>
          {devPlanOverride && (
            <button
              type="button"
              onClick={() => setDevPlanOverride(null)}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  )
}
