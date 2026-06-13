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
import { format, subDays } from "date-fns"
import { useAtomValue } from "jotai"
import { useMemo, useState } from "react"
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value))
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

function StandaloneRunsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="p-4">
          <div className="flex h-[250px] w-full items-end gap-[6px] px-3 pb-6">
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
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
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
          <div
            key={i}
            className="flex items-center justify-between border-b px-4 py-3"
          >
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

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

export function StandaloneRunsPageClient({
  title,
}: {
  title: string
}) {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    getLast7DaysDateRange(),
  )

  const startingOn = getDateFromPreset(dateRange.preset, dateRange.from)
  const endingBefore =
    dateRange.preset === "custom" && dateRange.to
      ? dateRange.to.toISOString()
      : dateRange.preset !== "all"
        ? new Date().toISOString()
        : undefined
  const windowSize = useMemo(() => {
    if (!startingOn || !endingBefore) return "DAY" as const
    const durationMs =
      new Date(endingBefore).getTime() - new Date(startingOn).getTime()
    return durationMs <= 48 * 60 * 60 * 1000 ? "HOUR" : "DAY"
  }, [endingBefore, startingOn])

  const { data, isLoading, error } = api.anRuns.metrics.useQuery(
    {
      teamId: teamId!,
      startingOn,
      endingBefore,
      windowSize,
    },
    {
      enabled: !!teamId,
      placeholderData: (previousData) => previousData,
    },
  )

  const dateTriggerLabel = formatDateRangeLabel(startingOn, endingBefore)

  return (
    <div className="h-full w-full overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-[720px] px-8 py-6">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track usage and cost over time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LogsDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              allTimeLabel={dateTriggerLabel}
              customRangeLabel={dateTriggerLabel}
            />
          </div>
        </div>

        {!teamId ? (
          <StandaloneRunsSkeleton />
        ) : isLoading && !data ? (
          <StandaloneRunsSkeleton />
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
            <p className="mb-1 font-medium">Failed to load usage data</p>
            <p className="text-xs opacity-80">{error.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total Cost"
                value={formatCurrency(data?.totals.totalCost ?? 0)}
              />
              <SummaryCard
                label="Runs"
                value={formatNumber(data?.totals.runsCount ?? 0)}
              />
              <SummaryCard
                label="Tokens"
                value={formatNumber(data?.totals.totalTokens ?? 0)}
              />
              <SummaryCard
                label="Runtime"
                value={formatDurationSeconds(data?.totals.totalUsage ?? 0)}
              />
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
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

            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
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
                      {formatNumber(data?.totals.totalTokens ?? 0)}
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
                        <span>Runtime</span>
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

            <p className="text-[11px] text-muted-foreground">
              Recent activity may take a moment to appear after a run finishes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
