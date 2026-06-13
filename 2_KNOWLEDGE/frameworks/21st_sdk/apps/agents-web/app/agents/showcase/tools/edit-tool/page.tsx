"use client"

import { EditTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createEditParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "variant",
    type: "select",
    options: ["diff-card", "minimal"],
    defaultValue: "diff-card",
    description: "Visual variant of the edit tool",
  },
  {
    name: "showIcon",
    type: "boolean",
    defaultValue: true,
    description: "Show the tool icon",
  },
]

export default function EditToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createEditParts()

  return (
    <ShowcaseLayout
      title="EditTool"
      description="Renders file diffs with added/removed line highlights. Supports diff-card and minimal variants. WriteTool is an alias for this component."
      sourceFile="packages/an-sdk/react/src/tools/edit-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <EditTool
              part={parts.completed}
              variant={values.variant}
              showIcon={values.showIcon}
            />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="diff-card / completed">
            <div className="p-4">
              <EditTool part={parts.completed} variant="diff-card" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="minimal / completed">
            <div className="p-4">
              <EditTool part={parts.completed} variant="minimal" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="diff-card / pending">
            <div className="p-4">
              <EditTool part={parts.pending} variant="diff-card" chatStatus="streaming" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="diff-card / streaming">
            <div className="p-4">
              <EditTool part={parts.streaming} variant="diff-card" />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
