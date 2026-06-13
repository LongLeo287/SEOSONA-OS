"use client"

import { PlanTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createPlanParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

export default function PlanToolPage() {
  const { colorMode } = useShowcaseContext()
  const parts = createPlanParts()

  return (
    <ShowcaseLayout
      title="PlanTool"
      description="Renders step-by-step plans with progress bars, complexity badges, file tags, and status tracking."
      sourceFile="packages/an-sdk/react/src/tools/plan-tool.tsx"
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <PlanTool part={parts.inProgress} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="inProgress">
            <div className="p-4">
              <PlanTool part={parts.inProgress} />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="completed">
            <div className="p-4">
              <PlanTool part={parts.completed} />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
