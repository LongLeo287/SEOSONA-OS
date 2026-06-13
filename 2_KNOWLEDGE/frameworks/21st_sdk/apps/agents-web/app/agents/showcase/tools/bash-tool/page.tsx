"use client"

import { BashTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createBashParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "variant",
    type: "select",
    options: ["terminal-card", "minimal"],
    defaultValue: "terminal-card",
    description: "Visual variant of the bash tool",
  },
  {
    name: "showIcon",
    type: "boolean",
    defaultValue: true,
    description: "Show the tool icon",
  },
]

export default function BashToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createBashParts()

  return (
    <ShowcaseLayout
      title="BashTool"
      description="Renders terminal commands with output, exit codes, and error states. Supports terminal-card and minimal variants."
      sourceFile="packages/an-sdk/react/src/tools/bash-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <BashTool
              part={parts.completed}
              variant={values.variant}
              showIcon={values.showIcon}
            />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="terminal-card / completed">
            <div className="p-4">
              <BashTool part={parts.completed} variant="terminal-card" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="minimal / completed">
            <div className="p-4">
              <BashTool part={parts.completed} variant="minimal" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="terminal-card / error">
            <div className="p-4">
              <BashTool part={parts.error} variant="terminal-card" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="terminal-card / pending">
            <div className="p-4">
              <BashTool part={parts.pending} variant="terminal-card" chatStatus="streaming" />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
