import { afterEach, describe, expect, it, vi } from "vitest"
import { exportPKCS8, generateKeyPair, jwtVerify } from "jose"

const ORIGINAL_ENV = { ...process.env }

async function importSandboxFactory() {
  vi.resetModules()
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    extractable: true,
  })
  process.env.RELAY_SANDBOX_TEMPLATE = "vault-prod"
  process.env.CLAUDE_PROXY_URL = "http://claude-proxy.test"
  process.env.VAULT_PROXY_URL = "http://vault-proxy.test:8080"
  process.env.CLAUDE_PROXY_PRIVATE_JWT = await exportPKCS8(privateKey)

  const module = await import("../sandbox-factory")
  return { module, publicKey }
}

function createSandboxMock() {
  const writes: Array<{ path: string; data: string }> = []
  return {
    writes,
    sandbox: {
      sandboxId: "client-sandbox-a",
      provider: "e2b",
      exec: vi.fn(async () => ({
        stdout: JSON.stringify({ ip: "203.0.113.10" }),
      })),
      writeFile: vi.fn(async (path: string, data: unknown) => {
        writes.push({ path, data: String(data ?? "") })
      }),
    },
  }
}

function getVaultConfig(writes: Array<{ path: string; data: string }>) {
  const write = [...writes]
    .reverse()
    .find((entry) => entry.path === "/home/user/.vault-proxy-config")
  if (!write) throw new Error("vault proxy config was not written")
  const entries = Object.fromEntries(
    write.data
      .trim()
      .split("\n")
      .map((line) => {
        const separator = line.indexOf("=")
        return [line.slice(0, separator), line.slice(separator + 1)]
      }),
  )
  return entries as { VAULT_PROXY_URL: string; VAULT_PROXY_JWT: string }
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.restoreAllMocks()
})

describe("sandbox factory vault proxy config", () => {
  it("writes a 30-minute vault proxy JWT with ordered vault_ids", async () => {
    const { module, publicKey } = await importSandboxFactory()
    const { sandbox, writes } = createSandboxMock()

    await module.injectProxyConfig(
      sandbox as never,
      "claude-code",
      "user-a",
      "sandbox-a",
      "client-sandbox-a",
      "team-a",
      ["vault-a", "vault-b"],
    )

    const config = getVaultConfig(writes)
    expect(config.VAULT_PROXY_URL).toBe("http://vault-proxy.test:8080")

    const { payload } = await jwtVerify(config.VAULT_PROXY_JWT, publicKey, {
      audience: "vault-proxy",
    })
    expect(payload).toMatchObject({
      userId: "user-a",
      sandboxId: "sandbox-a",
      clientSandboxId: "client-sandbox-a",
      allowedIp: "203.0.113.10",
      teamId: "team-a",
      vault_ids: ["vault-a", "vault-b"],
    })
    expect(typeof payload.jti).toBe("string")
    expect((payload.exp ?? 0) - (payload.iat ?? 0)).toBe(1_800)
  })

  it("skips refresh when the JWT is fresh but rewrites when vault_ids change", async () => {
    const { module } = await importSandboxFactory()
    const { sandbox, writes } = createSandboxMock()

    await module.injectProxyConfig(
      sandbox as never,
      "claude-code",
      "user-a",
      "sandbox-a",
      "client-sandbox-a",
      "team-a",
      ["vault-a"],
    )
    const initialWriteCount = writes.length

    await module.refreshProxyTokenIfNeeded(
      sandbox as never,
      "claude-code",
      "user-a",
      "sandbox-a",
      "client-sandbox-a",
      "team-a",
      ["vault-a"],
    )
    expect(writes).toHaveLength(initialWriteCount)

    await module.refreshProxyTokenIfNeeded(
      sandbox as never,
      "claude-code",
      "user-a",
      "sandbox-a",
      "client-sandbox-a",
      "team-a",
      ["vault-b"],
    )
    expect(writes.length).toBeGreaterThan(initialWriteCount)
    expect(getVaultConfig(writes).VAULT_PROXY_JWT).toBeTruthy()
  })
})
