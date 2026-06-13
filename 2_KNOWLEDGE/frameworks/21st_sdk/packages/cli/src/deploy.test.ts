import { describe, expect, it } from "vitest"
import { hasMcpConfigConflict } from "./deploy"

describe("hasMcpConfigConflict", () => {
  it("rejects mixed inline MCP servers and legacy .mcp.json config", () => {
    expect(
      hasMcpConfigConflict(Buffer.from("{}"), {
        mcpServers: [{ name: "linear", url: "https://mcp.linear.app/mcp" }],
      }),
    ).toBe(true)
  })

  it("allows either inline MCP servers or legacy .mcp.json by itself", () => {
    expect(
      hasMcpConfigConflict(null, {
        mcpServers: [{ name: "linear", url: "https://mcp.linear.app/mcp" }],
      }),
    ).toBe(false)
    expect(hasMcpConfigConflict(Buffer.from("{}"), undefined)).toBe(false)
  })
})
