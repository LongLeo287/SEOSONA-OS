"use client"

import { StreamingMarkdown } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { MARKDOWN_SAMPLE } from "@/components/features/agents/an/showcase/mocks/messages"

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the markdown renderer",
  },
]

export default function StreamingMarkdownPage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"

  return (
    <ShowcaseLayout
      title="StreamingMarkdown"
      description="Markdown renderer with GFM support, syntax highlighting, and code copy buttons. Optimized for streaming content."
      sourceFile="packages/an-sdk/react/src/components/streaming-markdown.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div style={{ padding: "16px" }}>
            <StreamingMarkdown content={MARKDOWN_SAMPLE} />
          </div>
        </PreviewContainer>
      }
    />
  )
}
