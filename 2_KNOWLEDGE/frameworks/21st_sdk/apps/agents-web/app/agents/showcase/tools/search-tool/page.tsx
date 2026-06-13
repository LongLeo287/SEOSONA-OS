"use client"

import { SearchTool } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createSearchParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "variant",
    type: "select",
    options: ["rich-group", "minimal"],
    defaultValue: "rich-group",
    description: "Visual variant of the search tool",
  },
  {
    name: "showIcon",
    type: "boolean",
    defaultValue: true,
    description: "Show the tool icon",
  },
]

export default function SearchToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createSearchParts()

  return (
    <ShowcaseLayout
      title="SearchTool"
      description="Renders web search results with rich link groups. Supports rich-group and minimal variants."
      sourceFile="packages/an-sdk/react/src/tools/search-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <SearchTool
              part={parts.completed}
              variant={values.variant}
              showIcon={values.showIcon}
            />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="rich-group / completed">
            <div className="p-4">
              <SearchTool part={parts.completed} variant="rich-group" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="minimal / completed">
            <div className="p-4">
              <SearchTool part={parts.completed} variant="minimal" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="pending">
            <div className="p-4">
              <SearchTool part={parts.pending} chatStatus="streaming" />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="error">
            <div className="p-4">
              <SearchTool part={parts.error} />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
