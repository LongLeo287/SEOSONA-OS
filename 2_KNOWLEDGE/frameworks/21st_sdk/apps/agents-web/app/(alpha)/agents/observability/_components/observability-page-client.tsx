"use client"

import { api } from "@/trpc/client"
import { useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { useState, useMemo, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ObservabilitySkeleton } from "./observability-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatCost,
  formatDuration,
  getDateFromPreset,
} from "../../threads/_components/logs-constants"
import {
  LogsDateRangePicker,
  type DateRangeValue,
} from "../../threads/_components/logs-date-range-picker"
import { useObservabilityMetrics } from "./use-observability-metrics"
import { MetricChartCard } from "./metric-chart-card"
import { RecentErrors } from "./recent-errors"

const CHART_COLOR = "#2A7FFF"

type ActiveChart = "sessions" | "threads"

const mainChartConfig = {
  sessions: { label: "Sessions", color: CHART_COLOR },
  threads: { label: "Threads", color: CHART_COLOR },
} satisfies ChartConfig

export function ObservabilityPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    preset: "7d",
  })
  const [activeChart, setActiveChart] = useState<ActiveChart>("sessions")

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

  const {
    data: sandboxesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentConfigs.listSandboxes.useInfiniteQuery(
    {
      teamId: teamId!,
      agentId: selectedAgent?.id,
      createdAfter: stableCreatedAfter,
      createdBefore: stableCreatedBefore,
      limit: 100,
    },
    {
      enabled: !!teamId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sandboxes = useMemo(
    () => sandboxesData?.pages.flatMap((page) => page.sandboxes) ?? [],
    [sandboxesData],
  )

  const allPagesFetched = !hasNextPage && !isFetchingNextPage && !isLoading

  const granularity: "hour" | "day" =
    dateRange.preset === "1h" || dateRange.preset === "24h" ? "hour" : "day"

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

  const metrics = useObservabilityMetrics(
    sandboxes,
    granularity,
    rangeStart,
    rangeEnd,
  )

  // Merge sessions + threads into one dataset for the main chart
  const mainChartData = useMemo(
    () =>
      metrics.sessionsOverTime.map((s, i) => ({
        date: s.date,
        sessions: s.count,
        threads: metrics.threadsOverTime[i]?.count ?? 0,
      })),
    [metrics.sessionsOverTime, metrics.threadsOverTime],
  )

  const hasStreamingThreads = sandboxes.some((p) =>
    p.threads?.some((d) => d.status === "streaming"),
  )

  if (!teamId) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
        <ObservabilitySkeleton />
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
      {/* Content */}
      {!allPagesFetched ? (
        <ObservabilitySkeleton />
      ) : (
        <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 px-8 py-6">
          {/* Date picker */}
          <div className="flex items-center justify-end gap-2 -mb-2">
            {hasStreamingThreads && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                <span>Live</span>
              </div>
            )}
            <LogsDateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          {/* Main chart — Sessions & Threads */}
          <Card className="shadow-none">
            <div className="flex items-stretch border-b">
              <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-2.5">
                <span className="text-[13px] font-medium">Overview</span>
                <span className="text-[11px] text-muted-foreground">
                  Sessions and threads over the selected period
                </span>
              </div>
              <div className="flex">
                {(["sessions", "threads"] as const).map((key) => (
                  <button
                    key={key}
                    data-active={activeChart === key}
                    className="flex flex-col justify-center gap-0.5 border-l px-5 py-2.5 text-left data-[active=true]:bg-muted/50"
                    onClick={() => setActiveChart(key)}
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {key === "sessions" ? "Sessions" : "Threads"}
                    </span>
                    <span className="text-[15px] font-semibold leading-none tabular-nums">
                      {key === "sessions"
                        ? metrics.totalSessions.toLocaleString()
                        : metrics.totalThreads.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <CardContent className="p-4 pt-4">
              <ChartContainer
                config={mainChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={mainChartData}
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
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bottom cards — Cost, Duration, Errors */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MetricChartCard
              title="Cost"
              legend={[
                {
                  label: "Total",
                  value: formatCost(
                    metrics.totalCost > 0 ? metrics.totalCost : null,
                  ),
                  color: CHART_COLOR,
                },
              ]}
              data={metrics.costOverTime.map((d) => ({
                date: d.date,
                value: d.cost,
              }))}
              color={CHART_COLOR}
              valueFormatter={(v) => `$${v.toFixed(2)}`}
            />
            <MetricChartCard
              title="Duration"
              legend={[
                {
                  label: "Average",
                  value: formatDuration(
                    metrics.avgDuration > 0 ? metrics.avgDuration : null,
                  ),
                  color: CHART_COLOR,
                },
              ]}
              data={metrics.durationOverTime.map((d) => ({
                date: d.date,
                value: d.avg,
              }))}
              color={CHART_COLOR}
              valueFormatter={(v) => formatDuration(v > 0 ? v : null)}
            />
            <MetricChartCard
              title="Errors"
              legend={[
                {
                  label: "Rate",
                  value:
                    metrics.errorRate > 0
                      ? `${metrics.errorRate.toFixed(1)}%`
                      : "0%",
                  color: CHART_COLOR,
                },
                {
                  label: "Count",
                  value: metrics.errorCount.toLocaleString(),
                  color: CHART_COLOR,
                },
              ]}
              data={metrics.errorsOverTime.map((d) => ({
                date: d.date,
                value: d.count,
              }))}
              color={CHART_COLOR}
              valueFormatter={(v) => v.toLocaleString()}
            />
          </div>

          {/* Recent Errors */}
          {metrics.recentErrors.length > 0 && (
            <RecentErrors errors={metrics.recentErrors} />
          )}
        </div>
      )}
    </motion.div>
  )
}
