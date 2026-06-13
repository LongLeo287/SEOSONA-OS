import { existsSync, readFileSync } from "fs"
import { describe, expect, it } from "vitest"

function readSource(relativeUrl: string) {
  return readFileSync(new URL(relativeUrl, import.meta.url), "utf8")
}

function compact(source: string) {
  return source.replace(/\s+/g, " ")
}

describe("MCP gateway cleanup", () => {
  it("removes the old relay gateway file and routes", () => {
    expect(existsSync(new URL("../mcp-gateway.ts", import.meta.url))).toBe(
      false,
    )

    const relaySource = readSource("../relay.ts")
    expect(relaySource).not.toContain("mcp-gateway")
    expect(relaySource).not.toContain("/v1/mcp/threads")
    expect(relaySource).not.toContain('startsWith("/v1/mcp/")')
    expect(relaySource).not.toContain("MCP gateway mounted")
  })

  it("keeps declared MCP servers wired into vault coverage", () => {
    const chatSource = readSource("../chat.ts")
    const normalized = compact(chatSource)

    expect(chatSource).not.toContain("buildThreadRuntimeMcpConfig")
    expect(chatSource).not.toContain("syncRuntimeMcpConfig")
    expect(normalized).toContain("const declaredMcpServers = agentConfig.declared_mcp_servers")
    expect(normalized).toContain(
      "checkVaultCoverage( resolvedVaultIds, declaredMcpServers",
    )
  })

  it("keeps shared proxy config while removing legacy MCP sync", () => {
    const sandboxFactorySource = readSource("../sandbox-factory.ts")

    expect(sandboxFactorySource).not.toContain("syncRuntimeMcpConfig")
    expect(sandboxFactorySource).not.toContain("RUNTIME_MCP_SOURCE_PATH")
    expect(sandboxFactorySource).toContain("signRegistrationCode")
    expect(sandboxFactorySource).toContain("getSandboxOutboundIp")
    expect(sandboxFactorySource).toContain("/home/user/.vault-proxy-config")
    expect(sandboxFactorySource).toContain("refreshProxyTokenIfNeeded")
  })

  it("keeps runtime MCP startup helpers without refresh polling", () => {
    const runtimeMcpSource = readSource(
      "../../../../packages/agent-runtime/src/mcp.ts",
    )
    const runtimeIndexSource = readSource(
      "../../../../packages/agent-runtime/src/index.ts",
    )

    expect(runtimeMcpSource).toContain("export function loadRuntimeMcpBackends")
    expect(runtimeMcpSource).toContain("export function buildClaudeMcpServers")
    expect(runtimeMcpSource).not.toContain("startRuntimeMcpConfigRefreshLoop")
    expect(runtimeMcpSource).not.toContain("RUNTIME_MCP_REFRESH_URL")
    expect(runtimeMcpSource).not.toContain(
      "RUNTIME_MCP_REFRESH_INTERVAL_SECONDS",
    )
    expect(runtimeIndexSource).not.toContain("startRuntimeMcpConfigRefreshLoop")
  })
})
