import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { afterEach, describe, expect, it, vi } from "vitest"

const ORIGINAL_ENV = { ...process.env }
const tempDirs: string[] = []

async function importMcpWithSource(config: unknown) {
  const dir = mkdtempSync(join(tmpdir(), "agent-runtime-mcp-"))
  tempDirs.push(dir)
  const sourcePath = join(dir, "mcp-source.json")
  writeFileSync(sourcePath, JSON.stringify(config))

  vi.resetModules()
  process.env.MCP_SOURCE_PATH = sourcePath

  return import("./mcp.js")
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.restoreAllMocks()
  vi.resetModules()

  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop()!, { recursive: true, force: true })
  }
})

describe("runtime MCP startup config", () => {
  it("loads declared MCP backends from the startup source file", async () => {
    const { loadRuntimeMcpBackends } = await importMcpWithSource({
      mcpServers: {
        notion: {
          type: "http",
          url: "https://mcp.notion.com/mcp",
          headers: { Authorization: "Bearer ${NOTION_TOKEN}" },
        },
        local_tool: {
          type: "stdio",
          command: "node",
          args: ["server.js"],
          env: { API_KEY: "${LOCAL_TOOL_KEY:-fallback}" },
        },
      },
    })

    expect(
      loadRuntimeMcpBackends({
        NOTION_TOKEN: "placeholder-notion",
      } as NodeJS.ProcessEnv),
    ).toEqual({
      notion: {
        transport: "http",
        url: "https://mcp.notion.com/mcp",
        headers: { Authorization: "Bearer <placeholder-notion>" },
      },
      local_tool: {
        transport: "stdio",
        command: "node",
        args: ["server.js"],
        env: { API_KEY: "fallback" },
      },
    })
  })

  it("builds Claude MCP startup routes without a refresh loop export", async () => {
    const mcp = await importMcpWithSource({
      mcpServers: {
        notion: { type: "http", url: "https://mcp.notion.com/mcp" },
      },
    })

    expect(
      mcp.buildClaudeMcpServers({ host: "127.0.0.1", port: 4111 }),
    ).toEqual({
      "user-tools": {
        type: "http",
        url: "http://127.0.0.1:4111/mcp-proxy",
      },
      notion: {
        type: "http",
        url: "http://127.0.0.1:4111/mcp-runtime/notion",
      },
    })
    expect("startRuntimeMcpConfigRefreshLoop" in mcp).toBe(false)
  })

  it("loads vault-proxy env for remote MCP without bypassing remote hosts", async () => {
    const dir = mkdtempSync(join(tmpdir(), "agent-runtime-vault-proxy-"))
    tempDirs.push(dir)
    const configPath = join(dir, ".vault-proxy-config")
    writeFileSync(
      configPath,
      [
        "VAULT_PROXY_URL=https://vault-proxy.example.com",
        "VAULT_PROXY_JWT=jwt-value",
      ].join("\n"),
    )

    const { buildVaultProxyEnv } = await import("./runtime.js")
    const env = buildVaultProxyEnv(configPath)
    const runtimeIndexSource = readFileSync(
      new URL("./index.ts", import.meta.url),
      "utf8",
    )

    expect(env.HTTPS_PROXY).toBe(
      "https://sandbox:jwt-value@vault-proxy.example.com/",
    )
    expect(env.NODE_USE_ENV_PROXY).toBe("1")
    expect(env.NO_PROXY.split(",")).toEqual(
      expect.arrayContaining(["localhost", "127.0.0.1", "::1"]),
    )
    expect(env.NO_PROXY).not.toContain("mcp.notion.com")
    expect(runtimeIndexSource).toContain(
      'backend.transport === "http" || backend.transport === "sse"',
    )
    expect(runtimeIndexSource).toContain(
      "Object.assign(process.env, buildVaultProxyEnv())",
    )
  })
})
