import {
  BILLING_FREE_CREDIT_AMOUNT,
  BILLING_MONTHLY_COMMIT_AMOUNT,
} from "@/lib/agents-billing/constants"
import { prisma } from "@/lib/prisma"
import { stripeV2 } from "@/lib/stripe"
import { Prisma } from "@/prisma/client"
import Metronome from "@metronome/sdk"
import { createHash } from "crypto"

const DEFAULT_APP_URL = "https://an.dev"

const METRONOME_BEARER_TOKEN = process.env.METRONOME_BEARER_TOKEN?.trim()
const BILLING_STRIPE_DELIVERY_METHOD_ID =
  process.env.BILLING_STRIPE_DELIVERY_METHOD_ID

// Locked billing configuration from current Metronome setup.
const BILLING_RATE_CARD_ID = "fff13477-6dc7-4773-ad61-005a5388ee29"
export const BILLING_CREDIT_TYPE_ID = "2714e483-4ff1-48e4-9e25-ac732e8f24f2"
export const BILLING_COMMIT_PRODUCT_ID = "ef007214-bc48-49e1-ba69-5998dd0e542a"
const BILLING_HEALTHY_EXTERNAL_INVOICE_STATUSES = new Set([
  "PAID",
  "FINALIZED",
])
const BILLING_APP_BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL
).replace(/\/$/, "")
const STRIPE_SETUP_SESSION_EXPIRY_SECONDS = 30 * 60

function getMetronomeToken(): string {
  if (!METRONOME_BEARER_TOKEN) {
    throw new Error("METRONOME_BEARER_TOKEN is not configured")
  }
  return METRONOME_BEARER_TOKEN
}

export type BillingPlanStatus = "free" | "pro"

type BillingSetupBlocker =
  | "missing_payment_method"
  | "payment_failed"
  | "insufficient_credits"

type TransitionType = "RENEWAL"

export type TeamBillingSetupResponse = {
  ready: boolean
  team_id: string
  plan_status: BillingPlanStatus
  current_period_end?: string
  cancel_at_period_end?: boolean
  cancel_at?: string | null
  setup_url?: string
  blocker?: BillingSetupBlocker
  /** Quick credit snapshot for immediate UI rendering (avoids waiting for creditStatus) */
  credit_balance?: {
    total_cents: number
    remaining_cents: number
  }
  stripe: {
    customer_id?: string
  }
  metronome: {
    customer_id?: string
    billing_configuration_id?: string
    contract_id?: string
  }
}

type TeamStripeBillingState = {
  customer_id?: string
  metronome_customer_id?: string
  metronome_billing_configuration_id?: string
  metronome_contract_id?: string
}

type ContractPlanCandidate = {
  id: string
  starting_at: string
  recurring_commits?: Array<unknown>
}

function buildErrorLog(error: unknown) {
  const details: Record<string, unknown> = {}

  if (error instanceof Error) {
    details.message = error.message
    details.name = error.name
    details.stack = error.stack
  } else {
    details.message = String(error)
  }

  const status = getErrorStatus(error)
  if (typeof status === "number") {
    details.status = status
  }

  if (error && typeof error === "object") {
    const value = error as Record<string, unknown>
    if (typeof value.code === "string" || typeof value.code === "number") {
      details.code = value.code
    }
    if (value.error !== undefined) {
      details.error = value.error
    }
  }

  return details
}

function logBillingInfo(
  teamId: string | undefined,
  message: string,
  data?: Record<string, unknown>,
) {
  if (data) {
    console.info(`[billing-check][team:${teamId ?? "unknown"}] ${message}`, data)
    return
  }
  console.info(`[billing-check][team:${teamId ?? "unknown"}] ${message}`)
}

function logBillingWarn(
  teamId: string | undefined,
  message: string,
  data?: Record<string, unknown>,
) {
  if (data) {
    console.warn(`[billing-check][team:${teamId ?? "unknown"}] ${message}`, data)
    return
  }
  console.warn(`[billing-check][team:${teamId ?? "unknown"}] ${message}`)
}

function logBillingError(
  teamId: string | undefined,
  message: string,
  error: unknown,
  data?: Record<string, unknown>,
) {
  const details = buildErrorLog(error)
  console.error(`[billing-check][team:${teamId ?? "unknown"}] ${message}`, {
    ...data,
    ...details,
  })
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function requireNonEmpty(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`${name} is not configured`)
  }
  return value.trim()
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined
  const value = (error as { status?: unknown }).status
  return typeof value === "number" ? value : undefined
}

function parseBillingState(raw: unknown): TeamStripeBillingState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}

  const data = raw as Record<string, unknown>
  return {
    customer_id: asString(data.customer_id),
    metronome_customer_id: asString(data.metronome_customer_id),
    metronome_billing_configuration_id: asString(
      data.metronome_billing_configuration_id,
    ),
    metronome_contract_id: asString(data.metronome_contract_id),
  }
}

function toJsonState(state: TeamStripeBillingState): Prisma.InputJsonValue {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(state)) {
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim()
    }
  }

  return result
}

async function saveBillingState(teamId: string, state: TeamStripeBillingState) {
  await prisma.team.update({
    where: { id: teamId },
    data: {
      stripe: toJsonState(state),
      updated_at: new Date(),
    },
  })
}

function getFreeContractEndingBefore(startingAt: string) {
  const start = new Date(startingAt)
  if (Number.isNaN(start.getTime())) {
    const fallback = new Date()
    fallback.setUTCMinutes(0, 0, 0)
    fallback.setUTCFullYear(fallback.getUTCFullYear() + 10)
    return fallback.toISOString()
  }

  const endingBefore = new Date(start)
  endingBefore.setUTCFullYear(endingBefore.getUTCFullYear() + 10)
  return endingBefore.toISOString()
}

function toHourBoundary(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date()
    fallback.setUTCMinutes(0, 0, 0)
    return fallback.toISOString()
  }
  date.setUTCMinutes(0, 0, 0)
  return date.toISOString()
}

function buildContractUniquenessKey(params: {
  planStatus: BillingPlanStatus
  teamId: string
  customerId: string
  startingAt: string
  transition?: {
    fromContractId: string
    type: TransitionType
  }
}) {
  const seed = [
    "an-contract",
    params.planStatus,
    params.teamId,
    params.customerId,
    params.startingAt,
    params.transition?.fromContractId ?? "",
    params.transition?.type ?? "",
  ].join(":")

  const hash = createHash("sha256").update(seed).digest("hex").slice(0, 24)
  return `an-${params.planStatus}-${hash}`
}

async function ensureStripeCustomer(params: {
  teamId: string
  teamName: string
  ownerUserId: string
  ownerEmail?: string
  existingCustomerId?: string
}) {
  const { teamId, teamName, ownerUserId, ownerEmail, existingCustomerId } =
    params

  if (existingCustomerId) {
    logBillingInfo(teamId, "Reused stored Stripe customer ID", {
      stripeCustomerId: existingCustomerId,
    })
    return { id: existingCustomerId }
  }

  try {
    const created = await stripeV2.customers.create({
      ...(ownerEmail ? { email: ownerEmail } : {}),
      name: teamName,
      metadata: {
        team_id: teamId,
        team_owner_user_id: ownerUserId,
      },
    })
    logBillingInfo(teamId, "Created Stripe customer", {
      stripeCustomerId: created.id,
    })
    return { id: created.id }
  } catch (error) {
    logBillingError(teamId, "Failed to create Stripe customer", error)
    throw error
  }
}

async function createStripeSetupSession(params: {
  customerId: string
  teamId: string
}) {
  const { customerId, teamId } = params
  const expiresAt =
    Math.floor(Date.now() / 1000) + STRIPE_SETUP_SESSION_EXPIRY_SECONDS

  const session = await stripeV2.checkout.sessions.create({
    mode: "setup",
    customer: customerId,
    payment_method_types: ["card"],
    expires_at: expiresAt,
    success_url: `${BILLING_APP_BASE_URL}/an/billing?billing_setup=success`,
    cancel_url: `${BILLING_APP_BASE_URL}/an/billing?billing_setup=canceled`,
    metadata: {
      team_id: teamId,
    },
  })

  if (!session.url) {
    throw new Error("Stripe setup session URL was not returned")
  }

  return session.url
}

async function ensureStripeDefaultPaymentMethod(customerId: string) {
  const customer = await stripeV2.customers.retrieve(customerId)

  if ((customer as { deleted?: boolean }).deleted) {
    return false
  }

  const customerData = customer as {
    invoice_settings?: unknown
  }
  const invoiceSettings = customerData.invoice_settings as
    | { default_payment_method?: unknown }
    | undefined

  const defaultPaymentMethodId = asString(invoiceSettings?.default_payment_method)
  if (defaultPaymentMethodId) {
    try {
      const paymentMethod =
        await stripeV2.paymentMethods.retrieve(defaultPaymentMethodId)
      if (
        paymentMethod.type === "card" &&
        paymentMethod.customer === customerId
      ) {
        return true
      }
    } catch {
      // Treat failed retrieval as missing default payment method.
    }
  }

  const attachedCards = await stripeV2.paymentMethods.list({
    customer: customerId,
    type: "card",
    limit: 1,
  })

  const fallbackCard = attachedCards.data[0]
  if (!fallbackCard) {
    return false
  }

  await stripeV2.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: fallbackCard.id,
    },
  })

  return true
}

async function ensureStripeSetupUrl(params: {
  customerId: string
  teamId: string
}) {
  return createStripeSetupSession(params)
}

async function findMetronomeCustomer(params: {
  client: Metronome
  teamId: string
  existingCustomerId?: string
}) {
  const { client, teamId, existingCustomerId } = params

  if (existingCustomerId) {
    logBillingInfo(teamId, "Reused stored Metronome customer ID", {
      metronomeCustomerId: existingCustomerId,
    })
    return existingCustomerId
  }

  try {
    const listed = await client.v1.customers.list({ ingest_alias: teamId })
    const selectedId = listed.data[0]?.id
    logBillingInfo(teamId, "Metronome customer alias lookup completed", {
      aliasMatches: listed.data.length,
      matchIds: listed.data.slice(0, 3).map((item) => item.id),
      selectedMetronomeCustomerId: selectedId,
    })
    return selectedId
  } catch (error) {
    logBillingError(teamId, "Metronome customer alias lookup failed", error, {
      ingestAlias: teamId,
    })
    throw error
  }
}

async function ensureMetronomeCustomer(params: {
  client: Metronome
  teamId: string
  existingCustomerId?: string
}) {
  const { client, teamId, existingCustomerId } = params

  const existing = await findMetronomeCustomer({
    client,
    teamId,
    existingCustomerId,
  })
  if (existing) {
    return existing
  }

  logBillingInfo(teamId, "No Metronome customer found by state/alias, creating", {
    ingestAlias: teamId,
    customerName: teamId,
  })

  const createCustomer = () =>
    client.v1.customers.create({
      name: teamId,
      ingest_aliases: [teamId],
    })

  try {
    const created = await createCustomer()
    logBillingInfo(teamId, "Created Metronome customer", {
      metronomeCustomerId: created.data.id,
      ingestAlias: teamId,
    })
    return created.data.id
  } catch (createError) {
    logBillingWarn(
      teamId,
      "Metronome customer create failed, retrying alias lookup",
      {
        ingestAlias: teamId,
        ...buildErrorLog(createError),
      },
    )

    let listed
    try {
      listed = await client.v1.customers.list({
        ingest_alias: teamId,
      })
    } catch (lookupError) {
      logBillingError(
        teamId,
        "Fallback Metronome alias lookup failed after create failure",
        lookupError,
        { ingestAlias: teamId },
      )
      throw createError
    }

    if (listed.data.length > 1) {
      logBillingWarn(
        teamId,
        "Fallback alias lookup after create failure returned multiple customers",
        {
          aliasMatches: listed.data.length,
          matchIds: listed.data.slice(0, 5).map((item) => item.id),
        },
      )
    }

    const existingByAlias = listed.data[0]?.id
    if (existingByAlias) {
      logBillingInfo(teamId, "Resolved Metronome customer after create failure", {
        metronomeCustomerId: existingByAlias,
        ingestAlias: teamId,
        aliasMatches: listed.data.length,
      })
      return existingByAlias
    }
    logBillingError(
      teamId,
      "Metronome customer create failed and alias lookup returned no matches",
      createError,
      { ingestAlias: teamId },
    )
    throw createError
  }
}

function getStripeCustomerIdFromConfiguration(
  configuration: Record<string, unknown> | undefined,
) {
  return asString(configuration?.stripe_customer_id)
}

async function ensureMetronomeStripeBillingConfiguration(params: {
  teamId: string
  client: Metronome
  metronomeCustomerId: string
  stripeCustomerId: string
  existingBillingConfigurationId?: string
}) {
  const {
    teamId,
    client,
    metronomeCustomerId,
    stripeCustomerId,
    existingBillingConfigurationId,
  } = params

  if (existingBillingConfigurationId) {
    logBillingInfo(teamId, "Reused stored Metronome Stripe billing configuration", {
      metronomeCustomerId,
      billingConfigurationId: existingBillingConfigurationId,
      stripeCustomerId,
    })
    return existingBillingConfigurationId
  }

  let created
  try {
    created = await client.v1.customers.setBillingConfigurations({
      data: [
        {
          customer_id: metronomeCustomerId,
          billing_provider: "stripe",
          configuration: {
            stripe_customer_id: stripeCustomerId,
            stripe_collection_method: "charge_automatically",
          },
          ...(BILLING_STRIPE_DELIVERY_METHOD_ID
            ? { delivery_method_id: BILLING_STRIPE_DELIVERY_METHOD_ID }
            : { delivery_method: "direct_to_billing_provider" }),
        },
      ],
    })
  } catch (error) {
    logBillingError(
      teamId,
      "Failed to set Metronome Stripe billing configuration",
      error,
      {
        metronomeCustomerId,
        stripeCustomerId,
      },
    )
    throw error
  }

  const createdId = created.data[0]?.id
  if (createdId) {
    logBillingInfo(teamId, "Created Metronome Stripe billing configuration", {
      metronomeCustomerId,
      billingConfigurationId: createdId,
      stripeCustomerId,
    })
    return createdId
  }

  const refreshed = await client.v1.customers.retrieveBillingConfigurations({
    customer_id: metronomeCustomerId,
    include_archived: false,
  })

  const refreshedId = refreshed.data.find((item) => {
    if (item.billing_provider !== "stripe" || !item.id) return false
    const configuration = item.configuration as Record<string, unknown> | undefined
    return (
      getStripeCustomerIdFromConfiguration(configuration) === stripeCustomerId
    )
  })?.id

  if (!refreshedId) {
    logBillingWarn(teamId, "Stripe billing configuration not returned after create", {
      metronomeCustomerId,
      stripeCustomerId,
      billingConfigurationCount: refreshed.data.length,
    })
    throw new Error("Failed to ensure Metronome Stripe billing configuration")
  }

  logBillingInfo(teamId, "Resolved billing configuration after refresh", {
    metronomeCustomerId,
    billingConfigurationId: refreshedId,
    stripeCustomerId,
  })
  return refreshedId
}

function resolveActivePlan(
  contracts: Array<ContractPlanCandidate>,
): { contractId: string; planStatus: BillingPlanStatus; startingAt: string } | undefined {
  const proContract = contracts.find(
    (item) =>
      Array.isArray(item.recurring_commits) && item.recurring_commits.length > 0,
  )
  if (proContract?.id) {
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
  if (freeContract?.id) {
    return {
      contractId: freeContract.id,
      planStatus: "free",
      startingAt: freeContract.starting_at,
    }
  }

  return undefined
}

function isFutureFreeContract(
  contract: {
    id: string
    starting_at: string
    recurring_commits?: Array<unknown>
  },
  activeContractId: string | undefined,
): boolean {
  if (contract.id === activeContractId) return false

  const isFree =
    !Array.isArray(contract.recurring_commits) ||
    contract.recurring_commits.length === 0
  if (!isFree) return false

  const startsAt = Date.parse(contract.starting_at)
  if (Number.isNaN(startsAt)) return false
  return startsAt > Date.now()
}

function listActiveContracts(client: Metronome, customerId: string) {
  return client.v2.contracts.list({
    customer_id: customerId,
    covering_date: new Date().toISOString(),
    include_archived: false,
  })
}

async function listAllNonArchivedContracts(client: Metronome, customerId: string) {
  const contracts = await client.v2.contracts.list({
    customer_id: customerId,
    include_archived: false,
  })
  return contracts.data
}

async function listCurrentContracts(client: Metronome, customerId: string) {
  const contracts = await listActiveContracts(client, customerId)
  return contracts.data
}

async function createRateCardContract(params: {
  client: Metronome
  customerId: string
  startingAt: string
  uniquenessKey: string
  planStatus: BillingPlanStatus
  billingConfigurationId: string
  transition?: {
    fromContractId: string
    type: TransitionType
  }
}) {
  const {
    client,
    customerId,
    startingAt,
    uniquenessKey,
    planStatus,
    billingConfigurationId,
    transition,
  } = params

  const normalizedStartingAt = toHourBoundary(startingAt)

  const payload: Record<string, unknown> = {
    customer_id: customerId,
    starting_at: normalizedStartingAt,
    rate_card_id: BILLING_RATE_CARD_ID,
    name: planStatus === "free" ? "AN Free Plan" : "AN Pro Plan",
    billing_provider_configuration: {
      billing_provider_configuration_id: billingConfigurationId,
    },
    uniqueness_key: uniquenessKey,
  }

  if (transition) {
    payload.transition = {
      from_contract_id: transition.fromContractId,
      type: transition.type,
    }
  }

  if (planStatus === "free") {
    const contractEndingBefore = toHourBoundary(
      getFreeContractEndingBefore(normalizedStartingAt),
    )
    payload.ending_before = contractEndingBefore
    if (!transition) {
      payload.credits = [
        {
          product_id: BILLING_COMMIT_PRODUCT_ID,
          name: "Free Credits",
          priority: 1,
          rate_type: "LIST_RATE",
          access_schedule: {
            credit_type_id: BILLING_CREDIT_TYPE_ID,
            schedule_items: [
              {
                amount: BILLING_FREE_CREDIT_AMOUNT,
                starting_at: normalizedStartingAt,
                ending_before: contractEndingBefore,
              },
            ],
          },
        },
      ]
    }
  } else {
    payload.recurring_commits = [
      {
        product_id: BILLING_COMMIT_PRODUCT_ID,
        starting_at: normalizedStartingAt,
        recurrence_frequency: "MONTHLY",
        commit_duration: {
          value: 1,
          unit: "PERIODS",
        },
        access_amount: {
          credit_type_id: BILLING_CREDIT_TYPE_ID,
          unit_price: BILLING_MONTHLY_COMMIT_AMOUNT,
          quantity: 1,
        },
        invoice_amount: {
          credit_type_id: BILLING_CREDIT_TYPE_ID,
          unit_price: BILLING_MONTHLY_COMMIT_AMOUNT,
          quantity: 1,
        },
        rate_type: "LIST_RATE",
        priority: 10,
        rollover_fraction: 0,
      },
    ]
  }

  await client.v1.contracts.create(
    payload as unknown as Parameters<typeof client.v1.contracts.create>[0],
  )
}

async function createFreeContract(params: {
  client: Metronome
  teamId: string
  customerId: string
  billingConfigurationId: string
  startingAt?: string
  transition?: {
    fromContractId: string
    type: TransitionType
  }
}) {
  const startingAt = toHourBoundary(
    params.startingAt || new Date().toISOString(),
  )
  const baseUniquenessKey = buildContractUniquenessKey({
    planStatus: "free",
    teamId: params.teamId,
    customerId: params.customerId,
    startingAt,
    transition: params.transition,
  })
  try {
    await createRateCardContract({
      client: params.client,
      customerId: params.customerId,
      startingAt,
      planStatus: "free",
      billingConfigurationId: params.billingConfigurationId,
      transition: params.transition,
      uniquenessKey: baseUniquenessKey,
    })
  } catch (error) {
    if (getErrorStatus(error) === 409) {
      logBillingWarn(params.teamId, "Free contract already exists (409 conflict)", {
        customerId: params.customerId,
        startingAt,
        uniquenessKey: baseUniquenessKey,
      })
      return
    }
    if (getErrorStatus(error) !== 409) {
      logBillingError(params.teamId, "Failed to create free contract", error, {
        customerId: params.customerId,
        startingAt,
      })
      throw error
    }
  }
}

async function createProContract(params: {
  client: Metronome
  teamId: string
  customerId: string
  billingConfigurationId: string
  startingAt?: string
  transition?: {
    fromContractId: string
    type: TransitionType
  }
}) {
  const startingAt = toHourBoundary(
    params.startingAt || new Date().toISOString(),
  )
  const baseUniquenessKey = buildContractUniquenessKey({
    planStatus: "pro",
    teamId: params.teamId,
    customerId: params.customerId,
    startingAt,
    transition: params.transition,
  })
  try {
    await createRateCardContract({
      client: params.client,
      customerId: params.customerId,
      startingAt,
      planStatus: "pro",
      billingConfigurationId: params.billingConfigurationId,
      transition: params.transition,
      uniquenessKey: baseUniquenessKey,
    })
  } catch (error) {
    if (getErrorStatus(error) === 409) {
      logBillingWarn(params.teamId, "Pro contract already exists (409 conflict)", {
        customerId: params.customerId,
        startingAt,
        uniquenessKey: baseUniquenessKey,
      })
      return
    }
    if (getErrorStatus(error) !== 409) {
      logBillingError(params.teamId, "Failed to create pro contract", error, {
        customerId: params.customerId,
        startingAt,
      })
      throw error
    }
  }
}

async function getLatestStripeExternalInvoiceStatus(
  client: Metronome,
  customerId: string,
) {
  for await (const invoice of client.v1.customers.invoices.list({
    customer_id: customerId,
    sort: "date_desc",
    limit: 20,
  })) {
    if (invoice.status === "DRAFT") {
      continue
    }

    const externalInvoice = invoice.external_invoice
    if (!externalInvoice || externalInvoice.billing_provider_type !== "stripe") {
      continue
    }

    if (typeof externalInvoice.external_status === "string") {
      return externalInvoice.external_status
    }
  }

  return undefined
}

async function getCustomerTotalBalance(
  client: Metronome,
  customerId: string,
) {
  let total = 0

  for await (const balance of client.v1.contracts.listBalances({
    customer_id: customerId,
    covering_date: new Date().toISOString(),
    include_archived: false,
    include_balance: true,
  })) {
    const item = balance as {
      balance?: unknown
    }

    if (typeof item.balance === "number" && Number.isFinite(item.balance)) {
      total += item.balance
    }
  }

  return total
}

function getNextMonthlyBoundary(anchorIso: string, now: Date = new Date()) {
  const anchor = new Date(anchorIso)
  if (Number.isNaN(anchor.getTime())) {
    const fallback = new Date(now)
    fallback.setUTCMinutes(0, 0, 0)
    fallback.setUTCMonth(fallback.getUTCMonth() + 1)
    return fallback.toISOString()
  }

  anchor.setUTCMinutes(0, 0, 0)
  const nextBoundary = new Date(anchor)
  while (nextBoundary <= now) {
    nextBoundary.setUTCMonth(nextBoundary.getUTCMonth() + 1)
  }

  return nextBoundary.toISOString()
}

async function resolveMetronomePlan(params: {
  client: Metronome
  teamId: string
  stripeCustomerId: string
  existingCustomerId?: string
  existingBillingConfigurationId?: string
}) {
  const {
    client,
    teamId,
    stripeCustomerId,
    existingCustomerId,
    existingBillingConfigurationId,
  } = params

  const metronomeCustomerId = await ensureMetronomeCustomer({
    client,
    teamId,
    existingCustomerId,
  })

  const billingConfigurationId = await ensureMetronomeStripeBillingConfiguration({
    teamId,
    client,
    metronomeCustomerId,
    stripeCustomerId,
    existingBillingConfigurationId,
  })

  let activeContracts = await listCurrentContracts(client, metronomeCustomerId)
  let activePlan = resolveActivePlan(activeContracts)

  if (!activePlan) {
    await createFreeContract({
      client,
      teamId,
      customerId: metronomeCustomerId,
      billingConfigurationId,
    })

    activeContracts = await listCurrentContracts(client, metronomeCustomerId)
    activePlan = resolveActivePlan(activeContracts)
  }

  if (!activePlan) {
    throw new Error("Failed to resolve an active billing contract")
  }

  return {
    planStatus: activePlan.planStatus,
    metronomeCustomerId,
    billingConfigurationId,
    contractId: activePlan.contractId,
    contractStartingAt: activePlan.startingAt,
  }
}

function buildResponse(params: {
  teamId: string
  planStatus: BillingPlanStatus
  state: TeamStripeBillingState
  ready: boolean
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  cancelAt?: string | null
  blocker?: BillingSetupBlocker
  setupUrl?: string
}): TeamBillingSetupResponse {
  const {
    teamId,
    planStatus,
    state,
    ready,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    cancelAt,
    blocker,
    setupUrl,
  } = params

  return {
    ready,
    team_id: teamId,
    plan_status: planStatus,
    ...(currentPeriodEnd ? { current_period_end: currentPeriodEnd } : {}),
    cancel_at_period_end: cancelAtPeriodEnd ?? false,
    cancel_at: cancelAt ?? null,
    ...(setupUrl ? { setup_url: setupUrl } : {}),
    ...(blocker ? { blocker } : {}),
    stripe: {
      customer_id: state.customer_id,
    },
    metronome: {
      customer_id: state.metronome_customer_id,
      billing_configuration_id: state.metronome_billing_configuration_id,
      contract_id: state.metronome_contract_id,
    },
  }
}

export async function ensureTeamBilling(params: {
  teamId: string
}): Promise<TeamBillingSetupResponse> {
  const { teamId } = params
  const startedAt = Date.now()
  logBillingInfo(teamId, "Billing check started")

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        user_id: true,
        stripe: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    if (!team) {
      throw new Error(`Team "${teamId}" not found`)
    }

    const state = parseBillingState(team.stripe)
    logBillingInfo(teamId, "Loaded persisted billing state", {
      stripeCustomerId: state.customer_id,
      metronomeCustomerId: state.metronome_customer_id,
      metronomeBillingConfigurationId: state.metronome_billing_configuration_id,
      metronomeContractId: state.metronome_contract_id,
    })

    const stripeCustomer = await ensureStripeCustomer({
      teamId: team.id,
      teamName: team.name,
      ownerUserId: team.user_id,
      ownerEmail: team.user?.email || undefined,
      existingCustomerId: state.customer_id,
    })
    const previousStripeCustomerId = state.customer_id
    state.customer_id = stripeCustomer.id
    if (state.customer_id && state.customer_id !== previousStripeCustomerId) {
      await saveBillingState(team.id, state)
      logBillingInfo(teamId, "Saved Stripe customer ID before Metronome checks", {
        stripeCustomerId: state.customer_id,
        previousStripeCustomerId,
      })
    }

    const client = new Metronome({ bearerToken: getMetronomeToken() })
    const metronomePlan = await resolveMetronomePlan({
      client,
      teamId: team.id,
      stripeCustomerId: stripeCustomer.id,
      existingCustomerId: state.metronome_customer_id,
      existingBillingConfigurationId: state.metronome_billing_configuration_id,
    })

    state.metronome_customer_id = metronomePlan.metronomeCustomerId
    state.metronome_billing_configuration_id = metronomePlan.billingConfigurationId
    state.metronome_contract_id = metronomePlan.contractId
    logBillingInfo(teamId, "Resolved billing entities", {
      planStatus: metronomePlan.planStatus,
      stripeCustomerId: state.customer_id,
      metronomeCustomerId: state.metronome_customer_id,
      metronomeBillingConfigurationId: state.metronome_billing_configuration_id,
      metronomeContractId: state.metronome_contract_id,
    })

    let currentPeriodEnd: string | undefined
    let cancelAtPeriodEnd = false
    let cancelAt: string | null = null

    if (metronomePlan.planStatus === "free") {
      const freeBalance = await getCustomerTotalBalance(
        client,
        metronomePlan.metronomeCustomerId,
      )
      logBillingInfo(teamId, "Computed total customer balance", {
        freeBalance,
        metronomeContractId: metronomePlan.contractId,
      })

      await saveBillingState(team.id, state)
      logBillingInfo(teamId, "Saved billing state", {
        stripeCustomerId: state.customer_id,
        metronomeCustomerId: state.metronome_customer_id,
        metronomeBillingConfigurationId: state.metronome_billing_configuration_id,
        metronomeContractId: state.metronome_contract_id,
      })

      if (freeBalance <= 0) {
        const response = buildResponse({
          teamId: team.id,
          planStatus: "free",
          state,
          ready: false,
          currentPeriodEnd,
          cancelAtPeriodEnd,
          cancelAt,
          blocker: "insufficient_credits",
        })
        logBillingWarn(teamId, "Billing check completed with blocker", {
          blocker: response.blocker,
          planStatus: response.plan_status,
          durationMs: Date.now() - startedAt,
        })
        return response
      }

      const response = buildResponse({
        teamId: team.id,
        planStatus: "free",
        state,
        ready: true,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        cancelAt,
      })
      logBillingInfo(teamId, "Billing check completed", {
        ready: response.ready,
        planStatus: response.plan_status,
        durationMs: Date.now() - startedAt,
      })
      return response
    }

    // Pro plan: run independent checks in parallel
    currentPeriodEnd = getNextMonthlyBoundary(metronomePlan.contractStartingAt)

    const [contracts, latestExternalStatus] = await Promise.all([
      listAllNonArchivedContracts(client, metronomePlan.metronomeCustomerId),
      getLatestStripeExternalInvoiceStatus(
        client,
        metronomePlan.metronomeCustomerId,
      ),
    ])

    const futureFreeContract = contracts
      .filter((item) =>
        isFutureFreeContract(
          {
            id: item.id,
            starting_at: item.starting_at,
            recurring_commits: item.recurring_commits,
          },
          metronomePlan.contractId,
        ),
      )
      .sort(
        (a, b) =>
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime(),
      )[0]

    if (futureFreeContract) {
      cancelAtPeriodEnd = true
      cancelAt = futureFreeContract.starting_at
    }

    if (
      latestExternalStatus &&
      !BILLING_HEALTHY_EXTERNAL_INVOICE_STATUSES.has(latestExternalStatus)
    ) {
      const setupUrl = await ensureStripeSetupUrl({
        customerId: stripeCustomer.id,
        teamId: team.id,
      })

      await saveBillingState(team.id, state)
      logBillingWarn(
        teamId,
        "Billing check found non-healthy external invoice status",
        {
          latestExternalStatus,
          stripeCustomerId: stripeCustomer.id,
        },
      )

      const response = buildResponse({
        teamId: team.id,
        planStatus: "pro",
        state,
        ready: false,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        cancelAt,
        blocker: "payment_failed",
        setupUrl,
      })
      logBillingWarn(teamId, "Billing check completed with blocker", {
        blocker: response.blocker,
        planStatus: response.plan_status,
        durationMs: Date.now() - startedAt,
      })
      return response
    }

    await saveBillingState(team.id, state)
    logBillingInfo(teamId, "Saved billing state", {
      stripeCustomerId: state.customer_id,
      metronomeCustomerId: state.metronome_customer_id,
      metronomeBillingConfigurationId: state.metronome_billing_configuration_id,
      metronomeContractId: state.metronome_contract_id,
    })

    const response = buildResponse({
      teamId: team.id,
      planStatus: "pro",
      state,
      ready: true,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      cancelAt,
    })
    logBillingInfo(teamId, "Billing check completed", {
      ready: response.ready,
      planStatus: response.plan_status,
      durationMs: Date.now() - startedAt,
    })
    return response
  } catch (error) {
    logBillingError(teamId, "Billing check failed", error, {
      durationMs: Date.now() - startedAt,
    })
    throw error
  }
}

/**
 * Fast-path billing check for teams that are already fully set up.
 * Reads cached IDs from team.stripe and resolves plan status with minimal
 * API calls. Falls back to the full ensureTeamBilling if any ID is missing.
 */
export async function checkTeamBillingFast(params: {
  teamId: string
}): Promise<TeamBillingSetupResponse> {
  const { teamId } = params
  const startedAt = Date.now()

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, stripe: true },
  })

  if (!team) {
    throw new Error(`Team "${teamId}" not found`)
  }

  const state = parseBillingState(team.stripe)

  const hasAllIds = Boolean(
    state.customer_id &&
      state.metronome_customer_id &&
      state.metronome_contract_id,
  )

  if (!hasAllIds) {
    logBillingInfo(
      teamId,
      "Fast path: missing billing IDs, falling back to full setup",
      {
        hasStripeCustomer: Boolean(state.customer_id),
        hasMetronomeCustomer: Boolean(state.metronome_customer_id),
        hasMetronomeContract: Boolean(state.metronome_contract_id),
      },
    )
    return ensureTeamBilling(params)
  }

  try {
    const client = new Metronome({ bearerToken: getMetronomeToken() })
    const activeContracts = await listActiveContracts(
      client,
      state.metronome_customer_id!,
    )
    const activePlan = resolveActivePlan(activeContracts.data)

    if (!activePlan) {
      logBillingInfo(
        teamId,
        "Fast path: no active contract found, falling back to full setup",
      )
      return ensureTeamBilling(params)
    }

    // Update contract ID if it changed (e.g. after renewal)
    if (activePlan.contractId !== state.metronome_contract_id) {
      state.metronome_contract_id = activePlan.contractId
      await saveBillingState(teamId, state)
    }

    let currentPeriodEnd: string | undefined
    let cancelAtPeriodEnd = false
    let cancelAt: string | null = null
    let creditBalance: { total_cents: number; remaining_cents: number } | undefined

    const includedCreditCents =
      activePlan.planStatus === "pro"
        ? BILLING_MONTHLY_COMMIT_AMOUNT
        : BILLING_FREE_CREDIT_AMOUNT

    if (activePlan.planStatus === "pro") {
      currentPeriodEnd = getNextMonthlyBoundary(activePlan.startingAt)

      // Run all independent pro checks in parallel
      const [allContracts, latestExternalStatus, totalBalance] =
        await Promise.all([
          listAllNonArchivedContracts(client, state.metronome_customer_id!),
          getLatestStripeExternalInvoiceStatus(
            client,
            state.metronome_customer_id!,
          ),
          getCustomerTotalBalance(client, state.metronome_customer_id!),
        ])

      creditBalance = {
        total_cents: includedCreditCents,
        remaining_cents: Math.max(Math.round(totalBalance), 0),
      }

      const futureFreeContract = allContracts
        .filter((item) =>
          isFutureFreeContract(
            {
              id: item.id,
              starting_at: item.starting_at,
              recurring_commits: item.recurring_commits,
            },
            activePlan.contractId,
          ),
        )
        .sort(
          (a, b) =>
            new Date(a.starting_at).getTime() -
            new Date(b.starting_at).getTime(),
        )[0]

      if (futureFreeContract) {
        cancelAtPeriodEnd = true
        cancelAt = futureFreeContract.starting_at
      }

      if (
        latestExternalStatus &&
        !BILLING_HEALTHY_EXTERNAL_INVOICE_STATUSES.has(latestExternalStatus)
      ) {
        const setupUrl = await ensureStripeSetupUrl({
          customerId: state.customer_id!,
          teamId,
        })

        const response = buildResponse({
          teamId,
          planStatus: "pro",
          state,
          ready: false,
          currentPeriodEnd,
          cancelAtPeriodEnd,
          cancelAt,
          blocker: "payment_failed",
          setupUrl,
        })
        response.credit_balance = creditBalance
        logBillingWarn(
          teamId,
          "Fast path completed with payment_failed blocker",
          {
            latestExternalStatus,
            durationMs: Date.now() - startedAt,
          },
        )
        return response
      }
    }

    if (activePlan.planStatus === "free") {
      const totalBalance = await getCustomerTotalBalance(
        client,
        state.metronome_customer_id!,
      )

      creditBalance = {
        total_cents: includedCreditCents,
        remaining_cents: Math.max(Math.round(totalBalance), 0),
      }

      if (totalBalance <= 0) {
        const response = buildResponse({
          teamId,
          planStatus: "free",
          state,
          ready: false,
          blocker: "insufficient_credits",
        })
        response.credit_balance = creditBalance
        logBillingInfo(
          teamId,
          "Fast path completed (free, insufficient credits)",
          { durationMs: Date.now() - startedAt },
        )
        return response
      }
    }

    const response = buildResponse({
      teamId,
      planStatus: activePlan.planStatus,
      state,
      ready: true,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      cancelAt,
    })
    response.credit_balance = creditBalance
    logBillingInfo(teamId, "Fast path completed", {
      planStatus: activePlan.planStatus,
      durationMs: Date.now() - startedAt,
    })
    return response
  } catch (error) {
    logBillingWarn(
      teamId,
      "Fast path failed, falling back to full setup",
      buildErrorLog(error),
    )
    return ensureTeamBilling(params)
  }
}

export async function upgradeTeamToPro(params: {
  teamId: string
}): Promise<TeamBillingSetupResponse> {
  const current = await ensureTeamBilling({ teamId: params.teamId })
  if (current.plan_status === "pro") {
    return current
  }

  const stripeCustomerId = requireNonEmpty(
    "stripe.customer_id",
    current.stripe.customer_id,
  )
  const metronomeCustomerId = requireNonEmpty(
    "metronome.customer_id",
    current.metronome.customer_id,
  )
  const billingConfigurationId = requireNonEmpty(
    "metronome.billing_configuration_id",
    current.metronome.billing_configuration_id,
  )

  const hasDefaultPaymentMethod =
    await ensureStripeDefaultPaymentMethod(stripeCustomerId)
  if (!hasDefaultPaymentMethod) {
    const setupUrl = await ensureStripeSetupUrl({
      customerId: stripeCustomerId,
      teamId: params.teamId,
    })

    const response: TeamBillingSetupResponse = {
      ...current,
      ready: false,
      blocker: "missing_payment_method",
      setup_url: setupUrl,
    }
    return response
  }

  const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
  await createProContract({
    client,
    teamId: params.teamId,
    customerId: metronomeCustomerId,
    billingConfigurationId,
    transition: current.metronome.contract_id
      ? {
          fromContractId: current.metronome.contract_id,
          type: "RENEWAL",
        }
      : undefined,
  })

  return ensureTeamBilling({ teamId: params.teamId })
}

export async function cancelTeamProAtPeriodEnd(params: { teamId: string }) {
  const current = await ensureTeamBilling({ teamId: params.teamId })
  if (current.plan_status !== "pro") {
    return current
  }

  const metronomeCustomerId = requireNonEmpty(
    "metronome.customer_id",
    current.metronome.customer_id,
  )
  const billingConfigurationId = requireNonEmpty(
    "metronome.billing_configuration_id",
    current.metronome.billing_configuration_id,
  )
  const currentContractId = requireNonEmpty(
    "metronome.contract_id",
    current.metronome.contract_id,
  )

  const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
  const contract = await client.v2.contracts.retrieve({
    customer_id: metronomeCustomerId,
    contract_id: currentContractId,
  })

  const periodEnd = getNextMonthlyBoundary(contract.data.starting_at)

  await createFreeContract({
    client,
    teamId: params.teamId,
    customerId: metronomeCustomerId,
    billingConfigurationId,
    startingAt: periodEnd,
    transition: {
      fromContractId: currentContractId,
      type: "RENEWAL",
    },
  })

  return ensureTeamBilling({ teamId: params.teamId })
}

export async function resumeTeamPro(params: { teamId: string }) {
  const current = await ensureTeamBilling({ teamId: params.teamId })
  if (current.plan_status !== "pro") {
    return current
  }

  const metronomeCustomerId = requireNonEmpty(
    "metronome.customer_id",
    current.metronome.customer_id,
  )

  const client = new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
  const contracts = await listAllNonArchivedContracts(client, metronomeCustomerId)

  for (const item of contracts) {
    if (
      !isFutureFreeContract(
        {
          id: item.id,
          starting_at: item.starting_at,
          recurring_commits: item.recurring_commits,
        },
        current.metronome.contract_id,
      )
    ) {
      continue
    }

    await client.v1.contracts.archive({
      customer_id: metronomeCustomerId,
      contract_id: item.id,
      void_invoices: true,
    })
  }

  return ensureTeamBilling({ teamId: params.teamId })
}
