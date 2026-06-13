import { useMemo } from "react"
import {
  startOfDay,
  startOfHour,
  startOfWeek,
  startOfMonth,
  format,
  addDays,
  addHours,
  addWeeks,
  addMonths,
  isBefore,
} from "date-fns"

interface Thread {
  id: string
  status: string
  total_cost_usd?: number | null
  duration_ms?: number | null
  total_tokens?: number | null
  input_tokens?: number | null
  output_tokens?: number | null
  created_at: string | Date
  error?: string | null
}

interface SandboxRow {
  id: string
  status: string
  created_at: string | Date
  threads?: Thread[]
}

export interface ObservabilityMetrics {
  totalSessions: number
  totalCost: number
  avgDuration: number
  errorRate: number
  errorCount: number
  totalThreads: number
  sessionsOverTime: { date: string; count: number }[]
  threadsOverTime: { date: string; count: number }[]
  costOverTime: { date: string; cost: number }[]
  durationOverTime: { date: string; avg: number }[]
  errorsOverTime: { date: string; count: number }[]
  recentErrors: Thread[]
}

/**
 * Generate all time buckets for the given range so the x-axis always
 * shows the full period even when there is no data for some buckets.
 */
function generateBuckets(
  rangeStart: Date,
  rangeEnd: Date,
  granularity: "hour" | "day" | "week" | "month",
): string[] {
  const bucketFn =
    granularity === "hour" ? startOfHour :
    granularity === "week" ? startOfWeek :
    granularity === "month" ? startOfMonth :
    startOfDay
  const stepFn =
    granularity === "hour" ? addHours :
    granularity === "week" ? addWeeks :
    granularity === "month" ? addMonths :
    addDays
  const formatFn =
    granularity === "hour" ? (d: Date) => format(d, "HH:mm") :
    granularity === "month" ? (d: Date) => format(d, "MMM yyyy") :
    (d: Date) => format(d, "MMM dd")

  const buckets: string[] = []
  let current = bucketFn(rangeStart)
  const end = bucketFn(rangeEnd)

  while (isBefore(current, end) || current.getTime() === end.getTime()) {
    buckets.push(formatFn(current))
    current = stepFn(current, 1)
  }

  return buckets
}

export function useObservabilityMetrics(
  sandboxes: SandboxRow[],
  granularity: "hour" | "day" | "week" | "month",
  rangeStart: Date,
  rangeEnd: Date,
): ObservabilityMetrics {
  return useMemo(() => {
    const allThreads = sandboxes.flatMap((p) => p.threads ?? [])

    const totalSessions = sandboxes.length
    const totalCost = allThreads.reduce(
      (s, d) => s + (d.total_cost_usd ?? 0),
      0,
    )
    const totalDuration = allThreads.reduce(
      (s, d) => s + (d.duration_ms ?? 0),
      0,
    )
    const avgDuration =
      allThreads.length > 0 ? totalDuration / allThreads.length : 0
    const errorThreads = allThreads.filter((d) => d.status === "error")
    const errorRate =
      allThreads.length > 0
        ? (errorThreads.length / allThreads.length) * 100
        : 0

    const bucketFn =
      granularity === "hour" ? startOfHour :
      granularity === "week" ? startOfWeek :
      granularity === "month" ? startOfMonth :
      startOfDay
    const formatFn =
      granularity === "hour" ? (d: Date) => format(d, "HH:mm") :
      granularity === "month" ? (d: Date) => format(d, "MMM yyyy") :
      (d: Date) => format(d, "MMM dd")

    const toDate = (v: string | Date) =>
      typeof v === "string" ? new Date(v) : v

    // Sessions over time
    const sessionsByBucket = new Map<string, number>()
    for (const sandbox of sandboxes) {
      const bucket = formatFn(bucketFn(toDate(sandbox.created_at)))
      sessionsByBucket.set(bucket, (sessionsByBucket.get(bucket) ?? 0) + 1)
    }

    // Threads over time
    const threadsByBucket = new Map<string, number>()
    for (const thread of allThreads) {
      const bucket = formatFn(bucketFn(toDate(thread.created_at)))
      threadsByBucket.set(bucket, (threadsByBucket.get(bucket) ?? 0) + 1)
    }

    // Per-thread bucketed metrics
    const costByBucket = new Map<string, number>()
    const durationByBucket = new Map<string, { sum: number; count: number }>()
    const errorsByBucket = new Map<string, number>()

    for (const thread of allThreads) {
      const bucket = formatFn(bucketFn(toDate(thread.created_at)))

      costByBucket.set(
        bucket,
        (costByBucket.get(bucket) ?? 0) + (thread.total_cost_usd ?? 0),
      )

      const prev = durationByBucket.get(bucket) ?? { sum: 0, count: 0 }
      durationByBucket.set(bucket, {
        sum: prev.sum + (thread.duration_ms ?? 0),
        count: prev.count + 1,
      })

      if (thread.status === "error") {
        errorsByBucket.set(bucket, (errorsByBucket.get(bucket) ?? 0) + 1)
      }
    }

    // Generate the full range of buckets
    const sortedBuckets = generateBuckets(rangeStart, rangeEnd, granularity)

    const sessionsOverTime = sortedBuckets.map((date) => ({
      date,
      count: sessionsByBucket.get(date) ?? 0,
    }))

    const threadsOverTime = sortedBuckets.map((date) => ({
      date,
      count: threadsByBucket.get(date) ?? 0,
    }))

    const costOverTime = sortedBuckets.map((date) => ({
      date,
      cost: costByBucket.get(date) ?? 0,
    }))

    const durationOverTime = sortedBuckets.map((date) => {
      const d = durationByBucket.get(date)
      return { date, avg: d && d.count > 0 ? d.sum / d.count : 0 }
    })

    const errorsOverTime = sortedBuckets.map((date) => ({
      date,
      count: errorsByBucket.get(date) ?? 0,
    }))

    const recentErrors = errorThreads
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10)

    return {
      totalSessions,
      totalCost,
      avgDuration,
      errorRate,
      errorCount: errorThreads.length,
      totalThreads: allThreads.length,
      sessionsOverTime,
      threadsOverTime,
      costOverTime,
      durationOverTime,
      errorsOverTime,
      recentErrors,
    }
  }, [sandboxes, granularity, rangeStart, rangeEnd])
}
