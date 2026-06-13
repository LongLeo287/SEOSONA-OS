"use client"

import { TaskTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createTaskParts, createNestedToolParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

export default function TaskToolPage() {
  const { colorMode } = useShowcaseContext()
  const parts = createTaskParts()
  const nestedTools = createNestedToolParts()

  return (
    <ShowcaseLayout
      title="TaskTool"
      description="Renders sub-agent task delegation with nested tool displays, auto-collapse on completion, and status tracking."
      sourceFile="packages/an-sdk/react/src/tools/task-tool.tsx"
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <TaskTool part={parts.completed} nestedTools={nestedTools} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="completed (with nested tools)">
            <div className="p-4">
              <TaskTool part={parts.completed} nestedTools={nestedTools} />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="pending">
            <div className="p-4">
              <TaskTool part={parts.pending} chatStatus="streaming" />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
