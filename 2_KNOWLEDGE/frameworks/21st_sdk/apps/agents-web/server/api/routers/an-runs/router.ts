import { Prisma } from "@/prisma/client"
import { TRPCError } from "@trpc/server"
import {
  addDays,
  addHours,
  format,
  isBefore,
  startOfDay,
  startOfHour,
} from "date-fns"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkTeamAccess } from "../teams/utils"

const runsMetricsInputSchema = z.object({
  teamId: z.string().uuid(),
  startingOn: z.string().optional(),
  endingBefore: z.string().optional(),
  windowSize: z.enum(["HOUR", "DAY"]).default("DAY"),
})

type WindowSize = z.infer<typeof runsMetricsInputSchema>["windowSize"]

type AggregatedRunRow = {
  bucket: Date
  total_cost: number
  total_tokens: number
  input_tokens: number
  output_tokens: number
  total_duration_ms: number
  runs_count: number
}

function parseDateOrThrow(value: string, field: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid ${field}`,
    })
  }
  return parsed
}

function getBucketStart(date: Date, windowSize: WindowSize) {
  return windowSize === "HOUR" ? startOfHour(date) : startOfDay(date)
}

function getBucketKey(date: Date, windowSize: WindowSize) {
  return `${windowSize}:${getBucketStart(date, windowSize).getTime()}`
}

function formatBucket(date: Date, windowSize: WindowSize) {
  return windowSize === "HOUR"
    ? format(getBucketStart(date, windowSize), "HH:mm")
    : format(getBucketStart(date, windowSize), "MMM dd")
}

function generateBuckets(start: Date, end: Date, windowSize: WindowSize) {
  const buckets: Array<{ key: string; label: string }> = []
  const initial = getBucketStart(start, windowSize)
  const step = windowSize === "HOUR" ? addHours : addDays
  let cursor = initial

  while (isBefore(cursor, end)) {
    buckets.push({
      key: getBucketKey(cursor, windowSize),
      label: formatBucket(cursor, windowSize),
    })
    cursor = step(cursor, 1)
  }

  return buckets
}

export const anRunsRouter = createTRPCRouter({
  metrics: protectedProcedure
    .input(runsMetricsInputSchema)
    .query(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId)

      const endingBefore = input.endingBefore
        ? parseDateOrThrow(input.endingBefore, "endingBefore")
        : new Date()
      const startingOn = input.startingOn
        ? parseDateOrThrow(input.startingOn, "startingOn")
        : team.created_at

      if (!(startingOn < endingBefore)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "startingOn must be before endingBefore",
        })
      }

      const buckets = generateBuckets(startingOn, endingBefore, input.windowSize)
      const bucketSql =
        input.windowSize === "HOUR"
          ? Prisma.sql`date_trunc('hour', COALESCE(finished_at, created_at))`
          : Prisma.sql`date_trunc('day', COALESCE(finished_at, created_at))`

      const rows = await ctx.prisma.$queryRaw<AggregatedRunRow[]>`
        SELECT
          ${bucketSql} AS bucket,
          COALESCE(SUM(total_cost_usd), 0)::double precision AS total_cost,
          COALESCE(SUM(COALESCE((meta->>'total_tokens')::double precision, 0)), 0)::double precision AS total_tokens,
          COALESCE(SUM(COALESCE((meta->>'input_tokens')::double precision, 0)), 0)::double precision AS input_tokens,
          COALESCE(SUM(COALESCE((meta->>'output_tokens')::double precision, 0)), 0)::double precision AS output_tokens,
          COALESCE(SUM(COALESCE((meta->>'duration_ms')::double precision, 0)), 0)::double precision AS total_duration_ms,
          COUNT(*)::integer AS runs_count
        FROM an_runs
        WHERE team_id = ${input.teamId}::uuid
          AND status = 'completed'
          AND COALESCE(finished_at, created_at) >= ${startingOn}
          AND COALESCE(finished_at, created_at) < ${endingBefore}
        GROUP BY 1
        ORDER BY 1
      `

      const rowsByBucket = new Map(
        rows.map((row) => [
          getBucketKey(new Date(row.bucket), input.windowSize),
          row,
        ]),
      )

      const series = buckets.map((bucket) => {
        const row = rowsByBucket.get(bucket.key)
        const tokenCost = row?.total_cost ?? 0
        const usage = (row?.total_duration_ms ?? 0) / 1000

        return {
          date: bucket.label,
          cost: tokenCost,
          tokenCost,
          computeCost: 0,
          usage,
          totalTokens: row?.total_tokens ?? 0,
          inputTokens: row?.input_tokens ?? 0,
          outputTokens: row?.output_tokens ?? 0,
          runsCount: row?.runs_count ?? 0,
        }
      })

      const totals = series.reduce(
        (acc, point) => ({
          totalCost: acc.totalCost + point.cost,
          tokenCost: acc.tokenCost + point.tokenCost,
          computeCost: 0,
          totalUsage: acc.totalUsage + point.usage,
          totalTokens: acc.totalTokens + point.totalTokens,
          inputTokens: acc.inputTokens + point.inputTokens,
          outputTokens: acc.outputTokens + point.outputTokens,
          runsCount: acc.runsCount + point.runsCount,
        }),
        {
          totalCost: 0,
          tokenCost: 0,
          computeCost: 0,
          totalUsage: 0,
          totalTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
          runsCount: 0,
        },
      )

      return {
        totals,
        series,
      }
    }),
})
