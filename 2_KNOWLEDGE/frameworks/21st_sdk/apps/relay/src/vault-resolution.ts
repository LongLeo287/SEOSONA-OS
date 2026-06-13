import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm"
import { db } from "./db"
import { anMcpVaults } from "./schema"

export type VaultResolutionSource =
  | "session"
  | "external_user"
  | "agent_config"
  | "team_default"
  | "none"

export type ResolveVaultIdsInput = {
  teamId: string
  threadId?: string | null
  sessionVaultIds?: string[] | null
  externalUserId?: string | null
  agentConfigVaultIds?: string[] | null
}

export type ResolvedVaultIds = {
  vaultIds: string[]
  source: VaultResolutionSource
}

export class VaultResolutionError extends Error {
  readonly status: number

  constructor(message: string, status = 403) {
    super(message)
    this.name = "VaultResolutionError"
    this.status = status
  }
}

export type VaultResolutionStore = {
  findExternalUserVaultIds: (
    teamId: string,
    externalUserId: string,
  ) => Promise<string[]>
  findTeamDefaultVaultId: (teamId: string) => Promise<string | null>
  assertVaultIdsAccessible: (
    teamId: string,
    vaultIds: string[],
  ) => Promise<void>
}

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function dedupeVaultIds(values: string[]) {
  const seen = new Set<string>()
  const deduped: string[] = []
  for (const value of values) {
    if (seen.has(value)) continue
    seen.add(value)
    deduped.push(value)
  }
  return deduped
}

export const databaseVaultResolutionStore: VaultResolutionStore = {
  async findExternalUserVaultIds(teamId, externalUserId) {
    const rows = await db
      .select({ id: anMcpVaults.id })
      .from(anMcpVaults)
      .where(
        and(
          eq(anMcpVaults.team_id, teamId),
          eq(anMcpVaults.status, "active"),
          isNull(anMcpVaults.archived_at),
          sql`${anMcpVaults.metadata} @> ${JSON.stringify({
            external_user_id: externalUserId,
          })}::jsonb`,
        ),
      )
      .orderBy(asc(anMcpVaults.created_at))

    return rows.map((row) => row.id)
  },

  async findTeamDefaultVaultId(teamId) {
    const [row] = await db
      .select({ id: anMcpVaults.id })
      .from(anMcpVaults)
      .where(
        and(
          eq(anMcpVaults.team_id, teamId),
          eq(anMcpVaults.is_default, true),
          eq(anMcpVaults.status, "active"),
          isNull(anMcpVaults.archived_at),
        ),
      )
      .limit(1)

    return row?.id ?? null
  },

  async assertVaultIdsAccessible(teamId, vaultIds) {
    if (vaultIds.length === 0) return
    const invalidVaultId = vaultIds.find((vaultId) => !UUID_V4_RE.test(vaultId))
    if (invalidVaultId) {
      throw new VaultResolutionError(
        `Vault "${invalidVaultId}" is not a valid vault id`,
        400,
      )
    }

    const rows = await db
      .select({
        id: anMcpVaults.id,
        status: anMcpVaults.status,
        archivedAt: anMcpVaults.archived_at,
      })
      .from(anMcpVaults)
      .where(
        and(
          inArray(anMcpVaults.id, vaultIds),
          eq(anMcpVaults.team_id, teamId),
        ),
      )

    const activeVaultIds = new Set(
      rows
        .filter((vault) => !vault.archivedAt && vault.status === "active")
        .map((vault) => vault.id),
    )
    const unavailableVaultId = vaultIds.find(
      (vaultId) => !activeVaultIds.has(vaultId),
    )

    if (unavailableVaultId) {
      throw new VaultResolutionError(
        `Vault "${unavailableVaultId}" is not available in this workspace`,
        403,
      )
    }
  },
}

function logVaultResolution(
  input: ResolveVaultIdsInput,
  result: ResolvedVaultIds,
) {
  console.log(
    "[VAULT_RESOLUTION]",
    JSON.stringify({
      team_id: input.teamId,
      thread_id: input.threadId ?? null,
      source: result.source,
      vault_count: result.vaultIds.length,
    }),
  )
}

async function finalizeResolvedVaultIds(
  input: ResolveVaultIdsInput,
  store: VaultResolutionStore,
  source: VaultResolutionSource,
  vaultIds: string[],
): Promise<ResolvedVaultIds> {
  const deduped = dedupeVaultIds(vaultIds)
  await store.assertVaultIdsAccessible(input.teamId, deduped)

  const result = { vaultIds: deduped, source }
  logVaultResolution(input, result)
  return result
}

export async function resolveVaultIds(
  input: ResolveVaultIdsInput,
  store: VaultResolutionStore = databaseVaultResolutionStore,
): Promise<ResolvedVaultIds> {
  if (input.sessionVaultIds !== null && input.sessionVaultIds !== undefined) {
    return finalizeResolvedVaultIds(
      input,
      store,
      "session",
      input.sessionVaultIds,
    )
  }

  if (input.externalUserId) {
    const externalUserVaultIds = await store.findExternalUserVaultIds(
      input.teamId,
      input.externalUserId,
    )
    if (externalUserVaultIds.length > 0) {
      return finalizeResolvedVaultIds(
        input,
        store,
        "external_user",
        externalUserVaultIds,
      )
    }
  }

  if (input.agentConfigVaultIds?.length) {
    return finalizeResolvedVaultIds(
      input,
      store,
      "agent_config",
      input.agentConfigVaultIds,
    )
  }

  const defaultVaultId = await store.findTeamDefaultVaultId(input.teamId)
  if (defaultVaultId) {
    return finalizeResolvedVaultIds(input, store, "team_default", [
      defaultVaultId,
    ])
  }

  const result = { vaultIds: [], source: "none" as const }
  logVaultResolution(input, result)
  return result
}
