"use client"

import { TodoTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createTodoParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

export default function TodoToolPage() {
  const { colorMode } = useShowcaseContext()
  const parts = createTodoParts()

  return (
    <ShowcaseLayout
      title="TodoTool"
      description="Renders task checklists with progress tracking, status icons, and change detection between old and new todo states."
      sourceFile="packages/an-sdk/react/src/tools/todo-tool.tsx"
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <TodoTool part={parts.creation} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="creation">
            <div className="p-4">
              <TodoTool part={parts.creation} />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="singleUpdate">
            <div className="p-4">
              <TodoTool part={parts.singleUpdate} />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
