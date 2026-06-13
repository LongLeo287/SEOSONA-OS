import Metronome from "@metronome/sdk"
import {
  addDays,
  addHours,
  format,
  isBefore,
  startOfDay,
  startOfHour,
} from "date-fns"
import { COMPUTE_USAGE_COST_PER_SECOND_USD } from "@/lib/agents-billing/constants"

export type BillingWindowSize = "HOUR" | "DAY"
export type PlanStatus = "free" | "pro" | "unknown"

export const CLAUDE_TOKENS_COST_METRIC_NAME = "claude_total_cost"
export const COMPUTE_USAGE_METRIC_NAME = "compute_usage"

export type SpendSeriesPoint = {
  key: string
  date: string
  bucketStart: string
  cost: number
  tokenCost: number
  computeCost: number
  usage: number
}

export type SpendTotals = {
  totalCost: number
  tokenCost: number
  computeCost: number
  totalUsage: number
}

export type SpendBreakdown = {
  totals: SpendTotals
  series: SpendSeriesPoint[]
}

function toUtcMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
}

function toUtcMidnightCeil(date: Date) {
  const midnight = toUtcMidnight(date)
  const isAlreadyMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0

  if (isAlreadyMidnight) {
    return midnight
  }

  return addDays(midnight, 1)
}

function getBucketStart(date: Date, windowSize: BillingWindowSize) {
  return windowSize === "HOUR" ? startOfHour(date) : startOfDay(date)
}

function getBucketKey(date: Date, windowSize: BillingWindowSize) {
  return getBucketStart(date, windowSize).toISOString()
}

function formatBucket(date: Date, windowSize: BillingWindowSize) {
  return windowSize === "HOUR"
    ? format(getBucketStart(date, windowSize), "HH:mm")
    : format(getBucketStart(date, windowSize), "MMM dd")
}

function generateBuckets(start: Date, end: Date, windowSize: BillingWindowSize) {
  const buckets: Array<{ key: string; label: string; bucketStart: string }> = []
  const initial = getBucketStart(start, windowSize)
  const step = windowSize === "HOUR" ? addHours : addDays
  let cursor = initial

  while (isBefore(cursor, end)) {
    buckets.push({
      key: cursor.toISOString(),
      label: formatBucket(cursor, windowSize),
      bucketStart: cursor.toISOString(),
    })
    cursor = step(cursor, 1)
  }

  return buckets
}

function normalizeInvoiceAmount(value: number, creditTypeName?: string) {
  if (!Number.isFinite(value)) return 0
  if (creditTypeName?.toLowerCase().includes("cent")) {
    return value / 100
  }
  return value
}

function extractCustomerIdFromStripeState(teamStripe: unknown): string | undefined {
  if (!teamStripe || typeof teamStripe !== "object" || Array.isArray(teamStripe)) {
    return undefined
  }

  const data = teamStripe as Record<string, unknown>
  const value = data.metronome_customer_id
  if (typeof value !== "string" || !value.trim()) {
    return undefined
  }
  return value.trim()
}

export async function resolveMetronomeCustomerId(params: {
  client: Metronome
  teamId: string
  teamStripe?: unknown
}) {
  const cached = extractCustomerIdFromStripeState(params.teamStripe)
  if (cached) return cached

  const customers = await params.client.v1.customers.list({
    ingest_alias: params.teamId,
    limit: 1,
  })

  return customers.data[0]?.id
}

export async function resolveCurrentPlanStatus(params: {
  client: Metronome
  customerId: string
}): Promise<{
  planStatus: PlanStatus
  contractId?: string
  startingAt?: string
}> {
  const contracts = await params.client.v2.contracts.list({
    customer_id: params.customerId,
    covering_date: new Date().toISOString(),
    include_archived: false,
  })

  const proContract = contracts.data.find(
    (item) =>
      Array.isArray(item.recurring_commits) && item.recurring_commits.length > 0,
  )
  if (proContract) {
    return {
      planStatus: "pro",
      contractId: proContract.id,
      startingAt: proContract.starting_at,
    }
  }

  const freeContract = contracts.data.find(
    (item) =>
      !Array.isArray(item.recurring_commits) || item.recurring_commits.length === 0,
  )
  if (freeContract) {
    return {
      planStatus: "free",
      contractId: freeContract.id,
      startingAt: freeContract.starting_at,
    }
  }

  return { planStatus: "unknown" }
}

export async function getUsageSpendForRange(params: {
  client: Metronome
  customerId: string
  startingOn: Date
  endingBefore: Date
  windowSize: BillingWindowSize
}): Promise<SpendBreakdown> {
  const { client, customerId, startingOn, endingBefore, windowSize } = params
  const minimumWindowMs = 24 * 60 * 60 * 1000
  const metronomeStartingOn = toUtcMidnight(startingOn)
  let metronomeEndingBefore = toUtcMidnightCeil(endingBefore)
  if (
    metronomeEndingBefore.getTime() - metronomeStartingOn.getTime() <
    minimumWindowMs
  ) {
    metronomeEndingBefore = addDays(metronomeStartingOn, 1)
  }

  const buckets = generateBuckets(startingOn, endingBefore, windowSize)
  const tokenCostByBucket = new Map<string, number>()
  const computeCostByBucket = new Map<string, number>()
  const usageByBucket = new Map<string, number>()

  for await (const row of client.v1.usage.list({
    customer_ids: [customerId],
    starting_on: metronomeStartingOn.toISOString(),
    ending_before: metronomeEndingBefore.toISOString(),
    window_size: windowSize,
  })) {
    const rowDate = new Date(row.start_timestamp)
    if (Number.isNaN(rowDate.getTime())) continue
    if (rowDate < startingOn || rowDate >= endingBefore) continue

    const bucketKey = getBucketKey(rowDate, windowSize)
    const value = typeof row.value === "number" ? row.value : 0

    if (row.billable_metric_name === CLAUDE_TOKENS_COST_METRIC_NAME) {
      tokenCostByBucket.set(bucketKey, (tokenCostByBucket.get(bucketKey) ?? 0) + value)
      continue
    }

    if (row.billable_metric_name === COMPUTE_USAGE_METRIC_NAME) {
      usageByBucket.set(bucketKey, (usageByBucket.get(bucketKey) ?? 0) + value)
      computeCostByBucket.set(
        bucketKey,
        (computeCostByBucket.get(bucketKey) ?? 0) +
          value * COMPUTE_USAGE_COST_PER_SECOND_USD,
      )
    }
  }

  const series: SpendSeriesPoint[] = buckets.map((bucket) => {
    const tokenCost = tokenCostByBucket.get(bucket.key) ?? 0
    const computeCost = computeCostByBucket.get(bucket.key) ?? 0
    return {
      key: bucket.key,
      date: bucket.label,
      bucketStart: bucket.bucketStart,
      tokenCost,
      computeCost,
      usage: usageByBucket.get(bucket.key) ?? 0,
      cost: tokenCost + computeCost,
    }
  })

  const totals = series.reduce(
    (acc, point) => {
      acc.totalCost += point.cost
      acc.tokenCost += point.tokenCost
      acc.computeCost += point.computeCost
      acc.totalUsage += point.usage
      return acc
    },
    { totalCost: 0, tokenCost: 0, computeCost: 0, totalUsage: 0 },
  )

  return { totals, series }
}

export async function getInvoiceUsageSpendForRange(params: {
  client: Metronome
  customerId: string
  startingOn: Date
  endingBefore: Date
  windowSize: BillingWindowSize
}): Promise<{ total: number; series: Array<{ key: string; date: string; bucketStart: string; cost: number }> }> {
  const { client, customerId, startingOn, endingBefore, windowSize } = params
  const minimumWindowMs = 24 * 60 * 60 * 1000
  const metronomeStartingOn = toUtcMidnight(startingOn)
  let metronomeEndingBefore = toUtcMidnightCeil(endingBefore)
  if (
    metronomeEndingBefore.getTime() - metronomeStartingOn.getTime() <
    minimumWindowMs
  ) {
    metronomeEndingBefore = addDays(metronomeStartingOn, 1)
  }

  const buckets = generateBuckets(startingOn, endingBefore, windowSize)
  const costByBucket = new Map<string, number>()

  for await (const row of client.v1.customers.invoices.listBreakdowns({
    customer_id: customerId,
    starting_on: metronomeStartingOn.toISOString(),
    ending_before: metronomeEndingBefore.toISOString(),
    window_size: windowSize,
    skip_zero_qty_line_items: true,
  })) {
    const rowDate = new Date(
      row.breakdown_start_timestamp ?? row.start_timestamp ?? "",
    )
    if (Number.isNaN(rowDate.getTime())) continue
    if (rowDate < startingOn || rowDate >= endingBefore) continue

    const bucketKey = getBucketKey(rowDate, windowSize)
    let usageLineItemsTotal = 0
    for (const lineItem of row.line_items ?? []) {
      if (lineItem.type !== "usage") continue
      usageLineItemsTotal += normalizeInvoiceAmount(
        lineItem.total,
        lineItem.credit_type?.name ?? row.credit_type?.name,
      )
    }
    costByBucket.set(bucketKey, (costByBucket.get(bucketKey) ?? 0) + usageLineItemsTotal)
  }

  const series = buckets.map((bucket) => ({
    key: bucket.key,
    date: bucket.label,
    bucketStart: bucket.bucketStart,
    cost: costByBucket.get(bucket.key) ?? 0,
  }))

  const total = series.reduce((sum, point) => sum + point.cost, 0)
  return { total, series }
}
