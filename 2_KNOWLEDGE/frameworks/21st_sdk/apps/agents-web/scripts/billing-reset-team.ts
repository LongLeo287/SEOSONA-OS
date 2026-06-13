import { config } from "dotenv"
import * as path from "path"
import Metronome from "@metronome/sdk"
import { prisma } from "../lib/prisma"
import { Prisma } from "../prisma/client"

type CustomerRef = {
  id: string
  archived_at?: string | null
  ingest_aliases?: string[]
}

type CliOptions = {
  teamId?: string
  dryRun: boolean
  clearStripeCustomer: boolean
  metronomeCustomerIds: string[]
}

function loadEnv() {
  config({ path: path.resolve(process.cwd(), ".env") })
  config({ path: path.resolve(process.cwd(), ".env.local"), override: true })
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    clearStripeCustomer: false,
    metronomeCustomerIds: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--team-id" || arg === "--alias") {
      options.teamId = argv[i + 1]
      i += 1
      continue
    }

    if (arg === "--dry-run") {
      options.dryRun = true
      continue
    }

    if (arg === "--metronome-customer-id") {
      const raw = argv[i + 1]
      if (raw) {
        options.metronomeCustomerIds.push(
          ...raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      }
      i += 1
      continue
    }

    if (arg === "--clear-stripe-customer") {
      options.clearStripeCustomer = true
      continue
    }
  }

  return options
}

function uniqueById(items: CustomerRef[]) {
  const byId = new Map<string, CustomerRef>()
  for (const item of items) byId.set(item.id, item)
  return Array.from(byId.values())
}

function fallbackAliasFor(customerId: string, archived?: boolean) {
  if (archived) return `archived-${customerId}`
  return `unlinked-${customerId}-${Date.now()}`
}

async function listCustomersByAlias(
  client: Metronome,
  teamId: string,
  onlyArchived?: boolean,
) {
  const customers: CustomerRef[] = []
  for await (const customer of client.v1.customers.list({
    ingest_alias: teamId,
    ...(onlyArchived ? { only_archived: true } : {}),
  })) {
    customers.push(customer as CustomerRef)
  }
  return customers
}

async function findAliasHolders(client: Metronome, teamId: string) {
  const active = await listCustomersByAlias(client, teamId)
  const archived = await listCustomersByAlias(client, teamId, true)

  return uniqueById([
    ...active,
    ...archived,
  ])
}

async function forceUnlinkAliasHolders(
  client: Metronome,
  teamId: string,
  dryRun: boolean,
) {
  let unresolved = await findAliasHolders(client, teamId)
  let attempts = 0

  while (unresolved.length > 0 && attempts < 3) {
    attempts += 1
    console.warn(
      `Found ${unresolved.length} unresolved alias holder(s) for ${teamId}, cleanup attempt ${attempts}`,
    )

    for (const customer of unresolved) {
      const currentAliases = Array.isArray(customer.ingest_aliases)
        ? customer.ingest_aliases
        : []
      const isArchived = Boolean(customer.archived_at)
      const nextAliases = currentAliases.filter((alias) => alias !== teamId)

      if (nextAliases.length === 0) {
        nextAliases.push(fallbackAliasFor(customer.id, isArchived))
      }

      console.log("  -> force-clean", {
        customerId: customer.id,
        archived: isArchived,
        currentAliases,
        nextAliases,
      })

      if (dryRun) continue

      await client.v1.customers.setIngestAliases({
        customer_id: customer.id,
        ingest_aliases: nextAliases,
      })

      if (!isArchived) {
        await client.v1.customers.archive({ id: customer.id })
      }
    }

    unresolved = await findAliasHolders(client, teamId)
  }

  if (unresolved.length > 0) {
    const unresolvedIds = unresolved.map((item) => item.id)
    throw new Error(
      `Alias ${teamId} is still linked in Metronome after forced cleanup: ${unresolvedIds.join(", ")}`,
    )
  }
}

function toObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

async function main() {
  loadEnv()

  const options = parseArgs(process.argv.slice(2))
  if (!options.teamId) {
    console.error(
      "Usage: pnpm -C apps/web run billing:reset-team -- --team-id <teamId> [--metronome-customer-id <id[,id2]>] [--dry-run] [--clear-stripe-customer]",
    )
    process.exit(1)
  }

  const bearerToken = process.env.METRONOME_BEARER_TOKEN
  if (!bearerToken) {
    throw new Error("METRONOME_BEARER_TOKEN is not configured")
  }

  const client = new Metronome({ bearerToken })
  const teamId = options.teamId
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, stripe: true },
  })

  if (!team) {
    throw new Error(`Team not found: ${teamId}`)
  }

  const stripeState = toObject(team.stripe)
  const dbMetronomeCustomerId = asString(stripeState.metronome_customer_id)
  const explicitIds = new Set<string>(options.metronomeCustomerIds)
  if (dbMetronomeCustomerId) {
    explicitIds.add(dbMetronomeCustomerId)
  }

  const aliasHolders = await findAliasHolders(client, teamId)
  const customersById = new Map(aliasHolders.map((item) => [item.id, item]))

  for (const id of explicitIds) {
    if (customersById.has(id)) continue
    try {
      const retrieved = await client.v1.customers.retrieve({ customer_id: id })
      customersById.set(id, retrieved.data as CustomerRef)
    } catch (error) {
      console.warn(
        `Failed to retrieve explicit Metronome customer ${id}, skipping`,
        error,
      )
    }
  }

  const customersToReset = Array.from(customersById.values())
  console.log(
    `Found ${aliasHolders.length} Metronome customer(s) with alias ${teamId}; total targeted=${customersToReset.length}`,
  )

  for (const customer of customersToReset) {
    const currentAliases = Array.isArray(customer.ingest_aliases)
      ? customer.ingest_aliases
      : []
    const isArchived = Boolean(customer.archived_at)
    const hasTeamAlias = currentAliases.includes(teamId)

    const nextAliases = hasTeamAlias
      ? currentAliases.filter((alias) => alias !== teamId)
      : currentAliases
    if (hasTeamAlias && nextAliases.length === 0) {
      nextAliases.push(fallbackAliasFor(customer.id, isArchived))
    }

    console.log("-", {
      customerId: customer.id,
      archived: isArchived,
      hadTeamAlias: hasTeamAlias,
      currentAliases,
      nextAliases,
    })

    if (!options.dryRun) {
      if (hasTeamAlias) {
        await client.v1.customers.setIngestAliases({
          customer_id: customer.id,
          ingest_aliases: nextAliases,
        })
      }

      if (!isArchived) {
        await client.v1.customers.archive({ id: customer.id })
      }
    }
  }

  if (!options.dryRun) {
    await forceUnlinkAliasHolders(client, teamId, options.dryRun)
  }

  const nextStripe: Record<string, unknown> = {
    ...stripeState,
    metronome_customer_id: undefined,
    metronome_billing_configuration_id: undefined,
    metronome_contract_id: undefined,
  }

  if (options.clearStripeCustomer) {
    nextStripe.customer_id = undefined
  }

  const cleaned = Object.fromEntries(
    Object.entries(nextStripe).filter(([, value]) => value !== undefined),
  )

  console.log("DB stripe state update", {
    before: stripeState,
    after: cleaned,
  })

  if (!options.dryRun) {
    await prisma.team.update({
      where: { id: teamId },
      data: {
        stripe: cleaned as Prisma.InputJsonValue,
        updated_at: new Date(),
      },
    })
  }

  await prisma.$disconnect()

  if (options.dryRun) {
    console.log("Dry run complete. No changes applied.")
  } else {
    console.log("Team billing reset complete.")
  }
}

main().catch(async (error) => {
  console.error("Failed to reset team billing state", error)
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})
