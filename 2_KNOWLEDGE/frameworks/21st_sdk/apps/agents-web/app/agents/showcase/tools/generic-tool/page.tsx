"use client"

import { GenericTool } from "@21st-sdk/react"
import { Eye, Search, FolderSearch, Globe } from "lucide-react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { createGenericParts } from "@/components/features/agents/an/showcase/mocks/tool-parts"

const controls: ControlDefinition[] = [
  {
    name: "showIcon",
    type: "boolean",
    defaultValue: true,
    description: "Show the tool icon",
  },
]

export default function GenericToolPage() {
  const { colorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)
  const parts = createGenericParts()

  return (
    <ShowcaseLayout
      title="GenericTool"
      description="Fallback renderer for unrecognized tools. Displays an icon, title, and optional subtitle with pending/error states."
      sourceFile="packages/an-sdk/react/src/tools/generic-tool.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div className="p-4">
            <GenericTool
              icon={Eye}
              title="Read"
              subtitle="button.tsx"
              isPending={false}
              isError={false}
              showIcon={values.showIcon}
            />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode={colorMode} label="read (completed)">
            <div className="p-4">
              <GenericTool
                icon={Eye}
                title="Read"
                subtitle="button.tsx"
                isPending={false}
                isError={false}
                showIcon={values.showIcon}
              />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="read (pending)">
            <div className="p-4">
              <GenericTool
                icon={Eye}
                title="Reading"
                subtitle="utils.ts"
                isPending={true}
                isError={false}
                showIcon={values.showIcon}
              />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="grep">
            <div className="p-4">
              <GenericTool
                icon={Search}
                title="Grepped 5 files"
                subtitle="useAuth in src"
                isPending={false}
                isError={false}
                showIcon={values.showIcon}
              />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="glob">
            <div className="p-4">
              <GenericTool
                icon={FolderSearch}
                title="Found 12 files"
                subtitle="**/*.test.ts"
                isPending={false}
                isError={false}
                showIcon={values.showIcon}
              />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="webFetch">
            <div className="p-4">
              <GenericTool
                icon={Globe}
                title="Fetched"
                subtitle="api.example.com"
                isPending={false}
                isError={false}
                showIcon={values.showIcon}
              />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
