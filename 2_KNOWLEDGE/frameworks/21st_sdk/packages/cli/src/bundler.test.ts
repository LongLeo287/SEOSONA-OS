import { describe, expect, it } from "vitest"
import { extractAgentMetadata } from "./bundler"

describe("extractAgentMetadata", () => {
  it("preserves MCP servers and deduped vault IDs from bundled agent config", async () => {
    const vaultId = "123e4567-e89b-42d3-a456-426614174000"
    const bundle = Buffer.from(`
      export default {
        _type: "agent",
        model: "claude-sonnet-4-6",
        permissionMode: "bypassPermissions",
        maxTurns: 12,
        vaultIds: ["${vaultId}", "${vaultId}"],
        mcpServers: [
          { name: "linear", url: "https://mcp.linear.app/mcp" },
          { name: "ignored" },
        ],
        tools: {
          search: { description: "Search things" },
        },
      }
    `)

    await expect(extractAgentMetadata(bundle)).resolves.toMatchObject({
      model: "claude-sonnet-4-6",
      permissionMode: "bypassPermissions",
      maxTurns: 12,
      vaultIds: [vaultId],
      mcpServers: [{ name: "linear", url: "https://mcp.linear.app/mcp" }],
      tools: [{ name: "search", description: "Search things" }],
    })
  })
})
