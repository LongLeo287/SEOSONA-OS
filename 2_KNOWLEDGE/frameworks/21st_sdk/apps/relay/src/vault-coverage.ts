import { and, inArray } from "drizzle-orm"
import {
  normalizeAgentMcpServers,
  type HttpAgentMcpServer,
} from "@repo/sandbox-provider"
import { db } from "./db"
import { anMcpCredentials } from "./schema"

export type VaultCoverageMode = "strict" | "warn" | "off"

export type VaultCoverageStatus = "covered" | "missing" | "archived"

export type VaultCoverageService = {
  name: string
  url: string
  status: VaultCoverageStatus
  vaultId?: string
}

export type VaultCoverageResult = {
  ok: boolean
  services: VaultCoverageService[]
  missing: string[]
  warnings: string[]
}

export type VaultCoverageStore = {
  findCredentialRows: (
    vaultIds: string[],
    normalizedUrls: string[],
  ) => Promise<
    Array<{
      vaultId: string
      normalizedUrl: string
      status: string
      archivedAt: Date | null
    }>
  >
}

export const databaseVaultCoverageStore: VaultCoverageStore = {
  async findCredentialRows(vaultIds, normalizedUrls) {
    if (vaultIds.length === 0 || normalizedUrls.length === 0) return []

    const rows = await db
      .select({
        vaultId: anMcpCredentials.vault_id,
        normalizedUrl: anMcpCredentials.server_url_normalized,
        status: anMcpCredentials.status,
        archivedAt: anMcpCredentials.archived_at,
      })
      .from(anMcpCredentials)
      .where(
        and(
          inArray(anMcpCredentials.vault_id, vaultIds),
          inArray(anMcpCredentials.server_url_normalized, normalizedUrls),
        ),
      )

    return rows
  },
}

export function getVaultCoverageMode(): VaultCoverageMode {
  const raw = process.env.VAULT_COVERAGE_MODE
  if (raw === "strict" || raw === "warn" || raw === "off") return raw
  return "warn"
}

function isActiveCredential(row: { status: string; archivedAt: Date | null }) {
  return row.status === "active" && !row.archivedAt
}

export async function checkVaultCoverage(
  vaultIds: string[],
  declaredServices: HttpAgentMcpServer[],
  store: VaultCoverageStore = databaseVaultCoverageStore,
): Promise<VaultCoverageResult> {
  const services = normalizeAgentMcpServers(declaredServices)
  if (services.length === 0) {
    return { ok: true, services: [], missing: [], warnings: [] }
  }

  const credentials = await store.findCredentialRows(
    vaultIds,
    services.map((service) => service.url),
  )

  const coverage = services.map((service): VaultCoverageService => {
    const rowsForService = credentials.filter(
      (credential) => credential.normalizedUrl === service.url,
    )
    const activeCredential = vaultIds
      .map((vaultId) =>
        rowsForService.find(
          (credential) =>
            credential.vaultId === vaultId && isActiveCredential(credential),
        ),
      )
      .find(Boolean)

    if (activeCredential) {
      return {
        name: service.name,
        url: service.url,
        status: "covered",
        vaultId: activeCredential.vaultId,
      }
    }

    const archivedCredential = vaultIds
      .map((vaultId) =>
        rowsForService.find(
          (credential) =>
            credential.vaultId === vaultId && !isActiveCredential(credential),
        ),
      )
      .find(Boolean)

    if (archivedCredential) {
      return {
        name: service.name,
        url: service.url,
        status: "archived",
        vaultId: archivedCredential.vaultId,
      }
    }

    return {
      name: service.name,
      url: service.url,
      status: "missing",
    }
  })

  const missing = coverage
    .filter((service) => service.status !== "covered")
    .map((service) => service.name)
  const warnings = coverage
    .filter((service) => service.status === "archived")
    .map((service) => `${service.name} only has archived credentials`)

  return {
    ok: missing.length === 0,
    services: coverage,
    missing,
    warnings,
  }
}
