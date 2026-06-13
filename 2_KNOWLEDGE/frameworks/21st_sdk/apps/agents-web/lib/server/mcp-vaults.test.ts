import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  anMcpVault: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  anMcpCredential: {
    count: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}))

vi.mock("@/lib/server/crypto", () => ({
  decrypt: vi.fn((value: string) => value.replace(/^encrypted:/, "")),
  encrypt: vi.fn((value: string) => `encrypted:${value}`),
}))

vi.mock("@/prisma/client", () => ({
  Prisma: {},
}))

const { createMcpVault, createOrUpdateMcpCredential } = await import(
  "./mcp-vaults"
)

beforeEach(() => {
  vi.clearAllMocks()
})

describe("mcp vault lifecycle guards", () => {
  it("rejects whitespace-only vault names before writing", async () => {
    await expect(
      createMcpVault({
        teamId: "team-a",
        name: "   ",
      }),
    ).rejects.toThrow("name is required")

    expect(prismaMock.anMcpVault.create).not.toHaveBeenCalled()
  })

  it("does not update or reactivate archived credentials", async () => {
    prismaMock.anMcpVault.findFirst.mockResolvedValue({ id: "vault-a" })
    prismaMock.anMcpCredential.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

    await expect(
      createOrUpdateMcpCredential({
        teamId: "team-a",
        vaultId: "vault-a",
        credentialId: "credential-archived",
        name: "Archived credential",
        serverUrl: "https://mcp.example.com/mcp",
        auth: { type: "bearer", token: "secret" },
      }),
    ).rejects.toThrow("Credential not found or archived")

    expect(prismaMock.anMcpCredential.findFirst).toHaveBeenNthCalledWith(2, {
      where: {
        id: "credential-archived",
        vault_id: "vault-a",
        archived_at: null,
        status: "active",
      },
    })
    expect(prismaMock.anMcpCredential.update).not.toHaveBeenCalled()
  })

  it("enforces active credential limit before creating another active credential", async () => {
    prismaMock.anMcpVault.findFirst.mockResolvedValue({ id: "vault-a" })
    prismaMock.anMcpCredential.findFirst.mockResolvedValue(null)
    prismaMock.anMcpCredential.count.mockResolvedValue(20)

    await expect(
      createOrUpdateMcpCredential({
        teamId: "team-a",
        vaultId: "vault-a",
        name: "Linear",
        serverUrl: "https://mcp.linear.app/mcp",
        auth: { type: "bearer", token: "secret" },
      }),
    ).rejects.toThrow("Vault already has 20 active credentials")

    expect(prismaMock.anMcpCredential.create).not.toHaveBeenCalled()
  })
})
