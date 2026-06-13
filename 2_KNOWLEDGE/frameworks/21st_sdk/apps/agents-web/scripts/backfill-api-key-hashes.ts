import { config } from "dotenv"
import path from "node:path"
import { hashApiKey, getApiKeyPrefix } from "@repo/api-key-security"
import { prisma } from "../lib/prisma"
import { Prisma } from "../prisma/client"

type ApiKeyTable = "api_keys" | "an_api_keys"

type ApiKeyRow = {
  id: string
  key: string | null
  key_hash: string | null
  key_prefix: string | null
}

function loadEnv() {
  config({ path: path.resolve(process.cwd(), ".env") })
  config({ path: path.resolve(process.cwd(), ".env.local"), override: true })
}

function isDryRun() {
  return process.argv.includes("--dry-run")
}

async function readRows(table: ApiKeyTable) {
  if (table === "api_keys") {
    return prisma.$queryRaw<ApiKeyRow[]>`
      SELECT id, key, key_hash, key_prefix
      FROM public.api_keys
      WHERE key IS NOT NULL
        AND (key_hash IS NULL OR key_prefix IS NULL)
      ORDER BY created_at ASC
    `
  }

  return prisma.$queryRaw<ApiKeyRow[]>`
    SELECT id, key, key_hash, key_prefix
    FROM public.an_api_keys
    WHERE key IS NOT NULL
      AND (key_hash IS NULL OR key_prefix IS NULL)
    ORDER BY created_at ASC
  `
}

async function updateRow(table: ApiKeyTable, row: ApiKeyRow, dryRun: boolean) {
  if (!row.key) return { status: "skipped" as const }

  const keyHash = hashApiKey(row.key)
  const keyPrefix = getApiKeyPrefix(row.key)

  if (dryRun) {
    return { status: "dry-run" as const }
  }

  try {
    if (table === "api_keys") {
      await prisma.$executeRaw`
        UPDATE public.api_keys
        SET key_hash = ${keyHash}, key_prefix = ${keyPrefix}
        WHERE id = ${row.id}::uuid
      `
    } else {
      await prisma.$executeRaw`
        UPDATE public.an_api_keys
        SET key_hash = ${keyHash}, key_prefix = ${keyPrefix}
        WHERE id = ${row.id}::uuid
      `
    }

    return { status: "updated" as const }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { status: "collision" as const, error }
    }

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return { status: "collision" as const, error }
    }

    throw error
  }
}

async function backfillTable(table: ApiKeyTable, dryRun: boolean) {
  const rows = await readRows(table)
  let updated = 0
  let skipped = 0
  let collisions = 0

  for (const row of rows) {
    const result = await updateRow(table, row, dryRun)

    if (result.status === "updated" || result.status === "dry-run") {
      updated += 1
      continue
    }

    if (result.status === "collision") {
      collisions += 1
      console.error(`[api-key-backfill] ${table} hash collision`, {
        id: row.id,
      })
      continue
    }

    skipped += 1
  }

  console.log(`[api-key-backfill] ${table}`, {
    scanned: rows.length,
    updated,
    skipped,
    collisions,
    dryRun,
  })
}

async function main() {
  loadEnv()
  const dryRun = isDryRun()

  await backfillTable("api_keys", dryRun)
  await backfillTable("an_api_keys", dryRun)
}

main()
  .catch((error) => {
    console.error("[api-key-backfill] failed:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
