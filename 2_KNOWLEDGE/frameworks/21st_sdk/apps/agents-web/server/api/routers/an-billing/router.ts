import Metronome from "@metronome/sdk"
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
import {
  cancelTeamProAtPeriodEnd,
  checkTeamBillingFast,
  ensureTeamBilling,
  resumeTeamPro,
  upgradeTeamToPro,
} from "@/lib/agents-billing/ensure-team-billing"
import { COMPUTE_USAGE_COST_PER_SECOND_USD } from "@/lib/agents-billing/constants"
import { prisma } from "@/lib/prisma"
import { stripeV2 } from "@/lib/stripe"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkTeamAccess } from "../teams/utils"
import { anBillingCouponsRouter } from "./coupons"

const METRONOME_BEARER_TOKEN = process.env.METRONOME_BEARER_TOKEN
const CLAUDE_TOKENS_COST_METRIC_NAME = "claude_total_cost"
const COMPUTE_USAGE_METRIC_NAME = "compute_usage"

const billingMetricsInputSchema = z.object({
  teamId: z.string().uuid(),
  startingOn: z.string().optional(),
  endingBefore: z.string().optional(),
  windowSize: z.enum(["HOUR", "DAY"]).default("DAY"),
})

const billingManagementInputSchema = z.object({
  teamId: z.string().uuid(),
})

const billingDashboardInputSchema = billingManagementInputSchema.extend({
  dashboard: z
    .enum(["invoices", "usage", "credits", "commits_and_credits"])
    .default("usage"),
})

type WindowSize = z.infer<typeof billingMetricsInputSchema>["windowSize"]

type ActivePlan = {
  contractId: string
  planStatus: "free" | "pro"
  startingAt: string
}

type IncludedCredit = {
  total: number
  used: number
  overuse: number
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

function normalizeInvoiceAmount(value: number, creditTypeName?: string) {
  if (!Number.isFinite(value)) return 0
  if (creditTypeName?.toLowerCase().includes("cent")) {
    return value / 100
  }
  return value
}

function normalizeContractAmount(value: number, creditTypeName?: string) {
  if (!Number.isFinite(value)) return 0
  if (creditTypeName?.toLowerCase().includes("cent")) {
    return value / 100
  }
  return value
}

function resolveActivePlan(
  contracts: Array<{
    id: string
    starting_at: string
    recurring_commits?: Array<unknown>
  }>,
): ActivePlan | undefined {
  const proContract = contracts.find(
    (item) =>
      Array.isArray(item.recurring_commits) && item.recurring_commits.length > 0,
  )
  if (proContract) {
    return {
      contractId: proContract.id,
      planStatus: "pro",
      startingAt: proContract.starting_at,
    }
  }

  const freeContract = contracts.find(
    (item) =>
      !Array.isArray(item.recurring_commits) || item.recurring_commits.length === 0,
  )
  if (freeContract) {
    return {
      contractId: freeContract.id,
      planStatus: "free",
      startingAt: freeContract.starting_at,
    }
  }

  return undefined
}

function getCurrentMonthlyCycleStart(anchorIso: string, now: Date = new Date()) {
  const anchor = new Date(anchorIso)
  if (Number.isNaN(anchor.getTime())) {
    return now.toISOString()
  }

  anchor.setUTCMinutes(0, 0, 0)
  const cycleStart = new Date(anchor)
  while (true) {
    const next = new Date(cycleStart)
    next.setUTCMonth(next.getUTCMonth() + 1)
    if (next > now) {
      break
    }
    cycleStart.setTime(next.getTime())
  }
  return cycleStart.toISOString()
}

async function getAllCreditBalances(
  client: Metronome,
  customerId: string,
  contractId: string,
) {
  let contractBalance = 0
  let customerLevelBalance = 0
  let customerLevelTotal = 0
  let creditTypeName: string | undefined

  for await (const balance of client.v1.contracts.listBalances({
    customer_id: customerId,
    covering_date: new Date().toISOString(),
    include_archived: false,
    include_balance: true,
  })) {
    const item = balance as {
      contract?: { id?: string }
      balance?: unknown
      access_schedule?: {
        credit_type?: {
          name?: unknown
        }
        schedule_items?: Array<{ amount?: number }>
      }
    }

    const bal =
      typeof item.balance === "number" && Number.isFinite(item.balance)
        ? item.balance
        : 0

    if (item.contract?.id === contractId) {
      contractBalance += bal
    } else if (!item.contract?.id) {
      customerLevelBalance += bal
      for (const si of item.access_schedule?.schedule_items ?? []) {
        if (typeof si.amount === "number" && Number.isFinite(si.amount)) {
          customerLevelTotal += si.amount
        }
      }
    }

    if (
      !creditTypeName &&
      typeof item.access_schedule?.credit_type?.name === "string"
    ) {
      creditTypeName = item.access_schedule.credit_type.name
    }
  }

  return { contractBalance, customerLevelBalance, customerLevelTotal, creditTypeName }
}

async function getUsageCostForPeriod(params: {
  client: Metronome
  customerId: string
  startingOn: Date
  endingBefore: Date
}) {
  const { client, customerId, startingOn, endingBefore } = params
  const minimumWindowMs = 24 * 60 * 60 * 1000
  const metronomeStartingOn = toUtcMidnight(startingOn)
  let metronomeEndingBefore = toUtcMidnightCeil(endingBefore)
  if (
    metronomeEndingBefore.getTime() - metronomeStartingOn.getTime() <
    minimumWindowMs
  ) {
    metronomeEndingBefore = addDays(metronomeStartingOn, 1)
  }

  let total = 0
  for await (const row of client.v1.customers.invoices.listBreakdowns({
    customer_id: customerId,
    starting_on: metronomeStartingOn.toISOString(),
    ending_before: metronomeEndingBefore.toISOString(),
    window_size: "HOUR",
    skip_zero_qty_line_items: true,
  })) {
    const rowDate = new Date(
      row.breakdown_start_timestamp ?? row.start_timestamp ?? "",
    )
    if (Number.isNaN(rowDate.getTime())) {
      continue
    }
    if (rowDate < startingOn || rowDate >= endingBefore) {
      continue
    }

    for (const lineItem of row.line_items ?? []) {
      if (lineItem.type !== "usage") {
        continue
      }
      total += normalizeInvoiceAmount(
        lineItem.total,
        lineItem.credit_type?.name ?? row.credit_type?.name,
      )
    }
  }

  return total
}

async function getIncludedCreditForCurrentCycle(params: {
  client: Metronome
  customerId: string
}): Promise<IncludedCredit> {
  const { client, customerId } = params

  const activeContracts = await client.v2.contracts.list({
    customer_id: customerId,
    covering_date: new Date().toISOString(),
    include_archived: false,
  })

  const activePlan = resolveActivePlan(
    activeContracts.data.map((contract) => ({
      id: contract.id,
      starting_at: contract.starting_at,
      recurring_commits: contract.recurring_commits,
    })),
  )

  if (!activePlan) {
    return { total: 0, used: 0, overuse: 0 }
  }

  const cycleStartIso =
    activePlan.planStatus === "pro"
      ? getCurrentMonthlyCycleStart(activePlan.startingAt)
      : activePlan.startingAt
  const cycleStart = parseDateOrThrow(cycleStartIso, "cycleStart")

  // All three calls are independent — run in parallel
  const [activeContract, creditBalances, cycleUsageCost] = await Promise.all([
    client.v2.contracts.retrieve({
      customer_id: customerId,
      contract_id: activePlan.contractId,
    }),
    getAllCreditBalances(client, customerId, activePlan.contractId),
    getUsageCostForPeriod({
      client,
      customerId,
      startingOn: cycleStart,
      endingBefore: new Date(),
    }),
  ])

  const contractData = activeContract.data as {
    credits?: Array<{
      access_schedule?: {
        credit_type?: { name?: string }
        schedule_items?: Array<{ amount?: number }>
      }
    }>
    recurring_commits?: Array<{
      access_amount?: { unit_price?: number; quantity?: number }
    }>
    commits?: Array<{
      access_schedule?: {
        credit_type?: { name?: string }
      }
    }>
  }

  const includedCreditTotalRaw =
    activePlan.planStatus === "pro"
      ? (contractData.recurring_commits ?? []).reduce((sum, recurringCommit) => {
          const unitPrice = recurringCommit.access_amount?.unit_price
          if (typeof unitPrice !== "number" || !Number.isFinite(unitPrice)) {
            return sum
          }
          const quantity = recurringCommit.access_amount?.quantity
          const resolvedQuantity =
            typeof quantity === "number" && Number.isFinite(quantity)
              ? quantity
              : 1
          return sum + unitPrice * resolvedQuantity
        }, 0)
      : (contractData.credits ?? []).reduce((sum, credit) => {
          const scheduleItems = credit.access_schedule?.schedule_items ?? []
          const scheduleTotal = scheduleItems.reduce((itemSum, item) => {
            if (typeof item.amount !== "number" || !Number.isFinite(item.amount)) {
              return itemSum
            }
            return itemSum + item.amount
          }, 0)
          return sum + scheduleTotal
        }, 0)

  const {
    contractBalance: contractBalanceRaw,
    customerLevelBalance: customerLevelBalanceRaw,
    customerLevelTotal: customerLevelTotalRaw,
    creditTypeName: balanceCreditTypeName,
  } = creditBalances

  const contractCreditTypeName =
    contractData.credits?.find((credit) =>
      typeof credit.access_schedule?.credit_type?.name === "string",
    )?.access_schedule?.credit_type?.name ??
    contractData.commits?.find((commit) =>
      typeof commit.access_schedule?.credit_type?.name === "string",
    )?.access_schedule?.credit_type?.name

  const creditTypeName = balanceCreditTypeName ?? contractCreditTypeName

  const contractIncludedTotal = normalizeContractAmount(
    includedCreditTotalRaw,
    creditTypeName,
  )
  const customerLevelTotal = normalizeContractAmount(
    customerLevelTotalRaw,
    creditTypeName,
  )
  const includedCreditTotal = contractIncludedTotal + customerLevelTotal

  const contractBalance = normalizeContractAmount(
    contractBalanceRaw,
    creditTypeName,
  )
  const customerLevelBalance = normalizeContractAmount(
    customerLevelBalanceRaw,
    creditTypeName,
  )
  const currentBalance = contractBalance + customerLevelBalance

  const usedCredit = Math.min(
    includedCreditTotal,
    Math.max(includedCreditTotal - currentBalance, 0),
  )

  const total = includedCreditTotal
  const used = usedCredit
  const overuse = Math.max(cycleUsageCost - used, 0)

  return { total, used, overuse }
}

async function getMetronomeCustomerId(client: Metronome, teamId: string) {
  const customers = await client.v1.customers.list({
    ingest_alias: teamId,
    limit: 1,
  })
  return customers.data[0]?.id
}

/**
 * Read cached metronome_customer_id from team.stripe JSON in the database.
 * Falls back to Metronome API lookup if not cached.
 */
function extractMetronomeCustomerId(
  stripeData: Record<string, unknown> | null | undefined,
) {
  return typeof stripeData?.metronome_customer_id === "string"
    ? stripeData.metronome_customer_id
    : undefined
}

async function getCachedMetronomeCustomerId(
  client: Metronome,
  teamId: string,
  /** Pass pre-fetched team.stripe to avoid a duplicate DB read */
  preloadedStripeData?: Record<string, unknown> | null,
) {
  const cachedId =
    preloadedStripeData !== undefined
      ? extractMetronomeCustomerId(preloadedStripeData)
      : extractMetronomeCustomerId(
          (
            await prisma.team.findUnique({
              where: { id: teamId },
              select: { stripe: true },
            })
          )?.stripe as Record<string, unknown> | null,
        )

  return cachedId ?? (await getMetronomeCustomerId(client, teamId))
}

export const anBillingRouter = createTRPCRouter({
  coupons: anBillingCouponsRouter,

  check: protectedProcedure
    .input(billingManagementInputSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return checkTeamBillingFast({ teamId: input.teamId })
    }),

  createSetupIntent: protectedProcedure
    .input(billingManagementInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { stripe: true },
      })

      const stripeData = team?.stripe as Record<string, unknown> | null
      let customerId =
        typeof stripeData?.customer_id === "string"
          ? stripeData.customer_id
          : undefined

      if (!customerId) {
        const billing = await ensureTeamBilling({ teamId: input.teamId })
        customerId = billing.stripe.customer_id
        if (!customerId) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create Stripe customer",
          })
        }
      }

      const setupIntent = await stripeV2.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
      })

      return { clientSecret: setupIntent.client_secret! }
    }),

  upgradeToPro: protectedProcedure
    .input(billingManagementInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return upgradeTeamToPro({ teamId: input.teamId })
    }),

  cancelProAtPeriodEnd: protectedProcedure
    .input(billingManagementInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return cancelTeamProAtPeriodEnd({ teamId: input.teamId })
    }),

  resumePro: protectedProcedure
    .input(billingManagementInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return resumeTeamPro({ teamId: input.teamId })
    }),

  dashboardUrl: protectedProcedure
    .input(billingDashboardInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      if (!METRONOME_BEARER_TOKEN) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "METRONOME_BEARER_TOKEN is not configured",
        })
      }

      const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
      const customerId = await getCachedMetronomeCustomerId(
        client,
        input.teamId,
      )

      if (!customerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Metronome customer not found for team",
        })
      }

      const response = await client.v1.dashboards.getEmbeddableURL({
        customer_id: customerId,
        dashboard: input.dashboard,
        dashboard_options:
          input.dashboard === "invoices"
            ? [
                { key: "hide_voided_invoices", value: "true" },
                { key: "show_zero_usage_line_items", value: "false" },
              ]
            : undefined,
      })

      const url = response.data.url
      if (!url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Metronome dashboard URL was not returned",
        })
      }

      return { url }
    }),

  creditStatus: protectedProcedure
    .input(billingManagementInputSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      if (!METRONOME_BEARER_TOKEN) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "METRONOME_BEARER_TOKEN is not configured",
        })
      }

      const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
      const customerId = await getCachedMetronomeCustomerId(
        client,
        input.teamId,
      )
      if (!customerId) {
        return { includedCredit: { total: 0, used: 0, overuse: 0 } }
      }

      return {
        includedCredit: await getIncludedCreditForCurrentCycle({
          client,
          customerId,
        }),
      }
    }),

  paymentMethod: protectedProcedure
    .input(billingManagementInputSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { stripe: true },
      })

      const stripeData = team?.stripe as Record<string, unknown> | null
      const stripeCustomerId =
        typeof stripeData?.customer_id === "string"
          ? stripeData.customer_id
          : undefined

      if (!stripeCustomerId) {
        return { card: null }
      }

      try {
        const customer = await stripeV2.customers.retrieve(stripeCustomerId)
        if ((customer as { deleted?: boolean }).deleted) {
          return { card: null }
        }

        const invoiceSettings = (
          customer as { invoice_settings?: { default_payment_method?: unknown } }
        ).invoice_settings
        const defaultPmId =
          typeof invoiceSettings?.default_payment_method === "string"
            ? invoiceSettings.default_payment_method
            : undefined

        let paymentMethod = defaultPmId
          ? await stripeV2.paymentMethods
              .retrieve(defaultPmId)
              .catch(() => null)
          : null

        if (!paymentMethod || paymentMethod.type !== "card") {
          const attached = await stripeV2.paymentMethods.list({
            customer: stripeCustomerId,
            type: "card",
            limit: 1,
          })
          paymentMethod = (attached.data[0] ?? null) as typeof paymentMethod
        }

        if (!paymentMethod || paymentMethod.type !== "card" || !paymentMethod.card) {
          return { card: null }
        }

        return {
          card: {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expMonth: paymentMethod.card.exp_month,
            expYear: paymentMethod.card.exp_year,
          },
        }
      } catch {
        return { card: null }
      }
    }),

  metrics: protectedProcedure
    .input(billingMetricsInputSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      if (!METRONOME_BEARER_TOKEN) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "METRONOME_BEARER_TOKEN is not configured",
        })
      }

      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { created_at: true, stripe: true },
      })
      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" })
      }

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

      const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
      const customerId = await getCachedMetronomeCustomerId(
        client,
        input.teamId,
        team.stripe as Record<string, unknown> | null,
      )
      const buckets = generateBuckets(
        startingOn,
        endingBefore,
        input.windowSize,
      )
      const minimumWindowMs = 24 * 60 * 60 * 1000
      const metronomeStartingOn = toUtcMidnight(startingOn)
      let metronomeEndingBefore = toUtcMidnightCeil(endingBefore)
      if (
        metronomeEndingBefore.getTime() - metronomeStartingOn.getTime() <
        minimumWindowMs
      ) {
        metronomeEndingBefore = addDays(metronomeStartingOn, 1)
      }

      if (!customerId) {
        return {
          totals: {
            totalCost: 0,
            tokenCost: 0,
            computeCost: 0,
            totalUsage: 0,
          },
          includedCredit: {
            total: 0,
            used: 0,
            overuse: 0,
          },
          series: buckets.map((bucket) => ({
            date: bucket.label,
            cost: 0,
            tokenCost: 0,
            computeCost: 0,
            usage: 0,
          })),
        }
      }

      const tokenCostByBucket = new Map<string, number>()
      const computeCostByBucket = new Map<string, number>()
      const usageByBucket = new Map<string, number>()

      // Run credit lookup and usage list in parallel
      const collectUsage = async () => {
        for await (const row of client.v1.usage.list({
          customer_ids: [customerId],
          starting_on: metronomeStartingOn.toISOString(),
          ending_before: metronomeEndingBefore.toISOString(),
          window_size: input.windowSize,
        })) {
          const rowDate = new Date(row.start_timestamp)
          if (Number.isNaN(rowDate.getTime())) {
            continue
          }
          if (rowDate < startingOn || rowDate >= endingBefore) {
            continue
          }

          const bucketKey = getBucketKey(rowDate, input.windowSize)
          const value = typeof row.value === "number" ? row.value : 0
          if (row.billable_metric_name === CLAUDE_TOKENS_COST_METRIC_NAME) {
            tokenCostByBucket.set(
              bucketKey,
              (tokenCostByBucket.get(bucketKey) ?? 0) + value,
            )
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
      }

      const [includedCredit] = await Promise.all([
        getIncludedCreditForCurrentCycle({ client, customerId }),
        collectUsage(),
      ])

      const series = buckets.map((bucket) => {
        const tokenCost = tokenCostByBucket.get(bucket.key) ?? 0
        const computeCost = computeCostByBucket.get(bucket.key) ?? 0
        const cost = tokenCost + computeCost

        return {
          date: bucket.label,
          cost,
          tokenCost,
          computeCost,
          usage: usageByBucket.get(bucket.key) ?? 0,
        }
      })

      const totalCost = series.reduce((sum, point) => sum + point.cost, 0)
      const tokenCost = series.reduce((sum, point) => sum + point.tokenCost, 0)
      const computeCost = series.reduce((sum, point) => sum + point.computeCost, 0)
      const totalUsage = series.reduce((sum, point) => sum + point.usage, 0)

      return {
        totals: {
          totalCost,
          tokenCost,
          computeCost,
          totalUsage,
        },
        includedCredit,
        series,
      }
    }),
})
