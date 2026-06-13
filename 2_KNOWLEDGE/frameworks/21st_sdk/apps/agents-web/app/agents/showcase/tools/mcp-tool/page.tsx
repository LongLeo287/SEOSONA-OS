"use client"

import { useMemo } from "react"
import { McpTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createMcpParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "showIcon",
    type: "boolean",
    defaultValue: true,
    description: "Show the tool icon",
  },
]

function parseMcpInfo(partType: string) {
  const prefix = "tool-mcp__"
  if (!partType.startsWith(prefix)) return { serverName: "mcp", toolName: partType, displayName: partType, category: "other" }
  const withoutPrefix = partType.slice(prefix.length)
  const separatorIndex = withoutPrefix.indexOf("__")
  if (separatorIndex === -1) return { serverName: "mcp", toolName: withoutPrefix, displayName: withoutPrefix, category: "other" }
  const serverName = withoutPrefix.slice(0, separatorIndex)
  const toolName = withoutPrefix.slice(separatorIndex + 2)
  return {
    serverName,
    toolName,
    displayName: toolName.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()).trim(),
    category: "other",
  }
}

export default function McpToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createMcpParts()

  const completedMcpInfo = useMemo(() => parseMcpInfo(parts.completed.type), [parts.completed.type])
  const pendingMcpInfo = useMemo(() => parseMcpInfo(parts.pending.type), [parts.pending.type])

  return (
    <ShowcaseLayout
      title="McpTool"
      description="Renders MCP (Model Context Protocol) tool calls with server name, tool name, input parameters, and output formatting."
      sourceFile="packages/an-sdk/react/src/tools/mcp-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <McpTool part={parts.completed} mcpInfo={completedMcpInfo} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="completed">
            <div className="p-4">
              <McpTool part={parts.completed} mcpInfo={completedMcpInfo} />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="pending">
            <div className="p-4">
              <McpTool part={parts.pending} mcpInfo={pendingMcpInfo} chatStatus="streaming" />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
