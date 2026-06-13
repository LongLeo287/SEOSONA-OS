import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/emails/send-first-agent-welcome", () => ({
  sendFirstAgentWelcomeEmail: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}))

vi.mock("@/prisma/client", () => ({
  Prisma: {},
}))

vi.mock("@/lib/server/agents/build-sandbox-template", () => ({
  buildSandboxTemplate: vi.fn(),
}))

vi.mock("@/lib/server/agents/sandbox-config", () => ({
  getDefaultSandboxProvider: vi.fn(() => "e2b"),
  resolveSandboxConfig: vi.fn((input) => ({
    provider: input.provider,
  })),
  validateResolvedSandboxConfig: vi.fn(),
  withTemplateId: vi.fn((config) => config),
}))

vi.mock("../../_lib/auth", () => ({
  authenticateApiKey: vi.fn(),
}))

vi.mock("../../_lib/errors", () => ({
  withApiErrorHandling: vi.fn((handler) => handler),
}))

vi.mock("../../_lib/rate-limit", () => ({
  checkApiRateLimits: vi.fn(),
}))

const { resolveDeployMcpMetadata } = await import("./mcp-metadata")

function toArrayBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value).buffer as ArrayBuffer
}

describe("resolveDeployMcpMetadata", () => {
  it("preserves inline MCP servers and vault IDs and materializes runtime MCP config", () => {
    const result = resolveDeployMcpMetadata({
      metadata: {
        model: "claude-sonnet-4-6",
        permissionMode: "bypassPermissions",
        maxTurns: 10,
        tools: [],
        hooks: [],
        custom: "kept",
        vaultIds: ["123e4567-e89b-42d3-a456-426614174000"],
        mcpServers: [
          { name: " linear ", url: "https://mcp.linear.app/mcp?b=2&a=1" },
        ],
      },
    })

    expect(result.runtimeMcpServers).toEqual([
      { name: "linear", url: "https://mcp.linear.app/mcp?a=1&b=2" },
    ])
    expect(result.baseDeploymentMetadata).toMatchObject({
      custom: "kept",
      vaultIds: ["123e4567-e89b-42d3-a456-426614174000"],
      mcpServers: [
        { name: "linear", url: "https://mcp.linear.app/mcp?a=1&b=2" },
      ],
    })
    expect(
      JSON.parse(Buffer.from(result.effectiveMcpConfig!).toString("utf8")),
    ).toEqual({
      mcpServers: {
        linear: {
          type: "http",
          url: "https://mcp.linear.app/mcp?a=1&b=2",
        },
      },
    })
  })

  it("uses legacy .mcp.json servers when inline metadata is absent", () => {
    const result = resolveDeployMcpMetadata({
      mcpConfig: toArrayBuffer(
        JSON.stringify({
          mcpServers: {
            notion: {
              type: "http",
              url: "https://mcp.notion.com/mcp",
            },
          },
        }),
      ),
    })

    expect(result.runtimeMcpServers).toEqual([
      { name: "notion", url: "https://mcp.notion.com/mcp" },
    ])
    expect(result.baseDeploymentMetadata).toMatchObject({
      mcpServers: [{ name: "notion", url: "https://mcp.notion.com/mcp" }],
    })
  })

  it("rejects mixed inline MCP servers and legacy .mcp.json config", () => {
    expect(() =>
      resolveDeployMcpMetadata({
        metadata: {
          model: "claude-sonnet-4-6",
          permissionMode: "bypassPermissions",
          maxTurns: 10,
          tools: [],
          hooks: [],
          mcpServers: [{ name: "linear", url: "https://mcp.linear.app/mcp" }],
        },
        mcpConfig: toArrayBuffer(JSON.stringify({ mcpServers: {} })),
      }),
    ).toThrow(/both inline and via sibling/)
  })
})
