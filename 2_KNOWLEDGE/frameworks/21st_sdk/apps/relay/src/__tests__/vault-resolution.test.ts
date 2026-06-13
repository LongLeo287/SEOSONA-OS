import { describe, expect, it, vi } from "vitest"
import {
  dedupeVaultIds,
  databaseVaultResolutionStore,
  resolveVaultIds,
  VaultResolutionError,
  type VaultResolutionStore,
} from "../vault-resolution"
import {
  checkVaultCoverage,
  getVaultCoverageMode,
  type VaultCoverageStore,
} from "../vault-coverage"

function createResolutionStore(options: {
  externalVaultIds?: string[]
  defaultVaultId?: string | null
  inaccessibleVaultIds?: string[]
}): VaultResolutionStore {
  const inaccessible = new Set(options.inaccessibleVaultIds ?? [])

  return {
    async findExternalUserVaultIds() {
      return options.externalVaultIds ?? []
    },
    async findTeamDefaultVaultId() {
      return options.defaultVaultId ?? null
    },
    async assertVaultIdsAccessible(_teamId, vaultIds) {
      const unavailable = vaultIds.find((vaultId) =>
        inaccessible.has(vaultId),
      )
      if (unavailable) {
        throw new VaultResolutionError(
          `Vault "${unavailable}" is not available in this workspace`,
          403,
        )
      }
    },
  }
}

function createCoverageStore(
  rows: Awaited<ReturnType<VaultCoverageStore["findCredentialRows"]>>,
): VaultCoverageStore {
  return {
    async findCredentialRows(vaultIds, normalizedUrls) {
      return rows.filter(
        (row) =>
          vaultIds.includes(row.vaultId) &&
          normalizedUrls.includes(row.normalizedUrl),
      )
    },
  }
}

describe("vault resolution", () => {
  it("uses session vaultIds before external user, agent config, and team default", async () => {
    const result = await resolveVaultIds(
      {
        teamId: "team",
        sessionVaultIds: ["vlt_session"],
        externalUserId: "usr_123",
        agentConfigVaultIds: ["vlt_agent"],
      },
      createResolutionStore({
        externalVaultIds: ["vlt_user"],
        defaultVaultId: "vlt_default",
      }),
    )

    expect(result).toEqual({
      source: "session",
      vaultIds: ["vlt_session"],
    })
  })

  it("uses external-user vaults before agent config and team default", async () => {
    const result = await resolveVaultIds(
      {
        teamId: "team",
        externalUserId: "usr_123",
        agentConfigVaultIds: ["vlt_agent"],
      },
      createResolutionStore({
        externalVaultIds: ["vlt_user"],
        defaultVaultId: "vlt_default",
      }),
    )

    expect(result).toEqual({
      source: "external_user",
      vaultIds: ["vlt_user"],
    })
  })

  it("uses agent-config vaults before the team default", async () => {
    const result = await resolveVaultIds(
      {
        teamId: "team",
        agentConfigVaultIds: ["vlt_agent"],
      },
      createResolutionStore({ defaultVaultId: "vlt_default" }),
    )

    expect(result).toEqual({
      source: "agent_config",
      vaultIds: ["vlt_agent"],
    })
  })

  it("uses the team default when no higher-precedence layer resolves", async () => {
    const result = await resolveVaultIds(
      { teamId: "team" },
      createResolutionStore({ defaultVaultId: "vlt_default" }),
    )

    expect(result).toEqual({
      source: "team_default",
      vaultIds: ["vlt_default"],
    })
  })

  it("treats explicit empty session vaultIds as deliberate none", async () => {
    const result = await resolveVaultIds(
      {
        teamId: "team",
        sessionVaultIds: [],
        externalUserId: "usr_123",
        agentConfigVaultIds: ["vlt_agent"],
      },
      createResolutionStore({
        externalVaultIds: ["vlt_user"],
        defaultVaultId: "vlt_default",
      }),
    )

    expect(result).toEqual({ source: "session", vaultIds: [] })
  })

  it("dedupes while preserving first-occurrence order", () => {
    expect(dedupeVaultIds(["vlt_a", "vlt_b", "vlt_a", "vlt_c"])).toEqual([
      "vlt_a",
      "vlt_b",
      "vlt_c",
    ])
  })

  it("rejects foreign-team vault ids", async () => {
    await expect(
      resolveVaultIds(
        { teamId: "team", sessionVaultIds: ["vlt_foreign"] },
        createResolutionStore({ inaccessibleVaultIds: ["vlt_foreign"] }),
      ),
    ).rejects.toMatchObject({ status: 403 })
  })

  it("rejects archived vault ids", async () => {
    await expect(
      resolveVaultIds(
        { teamId: "team", agentConfigVaultIds: ["vlt_archived"] },
        createResolutionStore({ inaccessibleVaultIds: ["vlt_archived"] }),
      ),
    ).rejects.toMatchObject({ status: 403 })
  })

  it("rejects malformed vault ids before hitting Postgres uuid casts", async () => {
    await expect(
      databaseVaultResolutionStore.assertVaultIdsAccessible("team", [
        "not-a-uuid",
      ]),
    ).rejects.toMatchObject({ status: 400 })
  })

  it("keeps external-user lookup order", async () => {
    const result = await resolveVaultIds(
      { teamId: "team", externalUserId: "usr_123" },
      createResolutionStore({
        externalVaultIds: ["vlt_oldest", "vlt_newest"],
      }),
    )

    expect(result).toEqual({
      source: "external_user",
      vaultIds: ["vlt_oldest", "vlt_newest"],
    })
  })
})

describe("vault coverage", () => {
  it("reports missing services for strict preflight callers", async () => {
    const result = await checkVaultCoverage(
      ["vlt_personal"],
      [{ name: "notion", url: "https://mcp.notion.com/mcp" }],
      createCoverageStore([]),
    )

    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(["notion"])
  })

  it("can run in warn mode without changing the result shape", async () => {
    vi.stubEnv("VAULT_COVERAGE_MODE", "warn")

    const result = await checkVaultCoverage(
      ["vlt_personal"],
      [{ name: "notion", url: "https://mcp.notion.com/mcp" }],
      createCoverageStore([]),
    )

    expect(getVaultCoverageMode()).toBe("warn")
    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(["notion"])
  })

  it("passes when a selected vault has an active credential", async () => {
    const result = await checkVaultCoverage(
      ["vlt_personal", "vlt_team"],
      [{ name: "notion", url: "https://mcp.notion.com/mcp" }],
      createCoverageStore([
        {
          vaultId: "vlt_team",
          normalizedUrl: "https://mcp.notion.com/mcp",
          status: "active",
          archivedAt: null,
        },
      ]),
    )

    expect(result).toMatchObject({
      ok: true,
      missing: [],
      services: [{ name: "notion", status: "covered", vaultId: "vlt_team" }],
    })
  })

  it("flags archived-only credentials as missing with a warning", async () => {
    const result = await checkVaultCoverage(
      ["vlt_personal"],
      [{ name: "notion", url: "https://mcp.notion.com/mcp" }],
      createCoverageStore([
        {
          vaultId: "vlt_personal",
          normalizedUrl: "https://mcp.notion.com/mcp",
          status: "archived",
          archivedAt: new Date(),
        },
      ]),
    )

    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(["notion"])
    expect(result.warnings).toEqual([
      "notion only has archived credentials",
    ])
  })

  it("does not require vaults when the agent declares no services", async () => {
    const result = await checkVaultCoverage([], [], createCoverageStore([]))

    expect(result).toEqual({
      ok: true,
      services: [],
      missing: [],
      warnings: [],
    })
  })
})
