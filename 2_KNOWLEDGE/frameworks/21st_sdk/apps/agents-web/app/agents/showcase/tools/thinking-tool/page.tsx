"use client"

import { ThinkingTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createThinkingParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "variant",
    type: "select",
    options: ["collapsed", "streaming"],
    defaultValue: "collapsed",
    description: "Visual variant of the thinking tool",
  },
]

export default function ThinkingToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createThinkingParts()

  return (
    <ShowcaseLayout
      title="ThinkingTool"
      description="Renders reasoning/thinking indicators with collapsed and streaming variants. Shows the model's chain-of-thought process."
      sourceFile="packages/an-sdk/react/src/tools/thinking-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <ThinkingTool part={parts.completed} variant={values.variant} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="completed">
            <div className="p-4">
              <ThinkingTool part={parts.completed} variant="collapsed" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="pending">
            <div className="p-4">
              <ThinkingTool part={parts.pending} variant="streaming" chatStatus="streaming" />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
