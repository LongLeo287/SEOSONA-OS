import { createSdkMcpServer, tool as sdkTool } from "@anthropic-ai/claude-agent-sdk"
import type { ToolSet } from "@21st-sdk/agent"

export function mapToolsToMcpServer(tools: ToolSet) {
  const sdkTools = Object.entries(tools).map(([name, t]) =>
    sdkTool(
      name,
      t.description,
      t.inputSchema.shape,
      async (args) => t.execute(args, {}),
    ),
  )

  return createSdkMcpServer({
    name: "user-tools",
    version: "1.0.0",
    tools: sdkTools,
  })
}
