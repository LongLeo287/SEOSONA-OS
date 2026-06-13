"use client"

import { InputBar } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the input bar",
  },
  {
    name: "status",
    type: "select",
    options: ["ready", "streaming", "error"],
    defaultValue: "ready",
    description: "Chat status controlling input behavior",
  },
]

export default function InputBarPage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"
  const status = values.status as "ready" | "streaming" | "error"

  return (
    <ShowcaseLayout
      title="InputBar"
      description="Text input with auto-height, Enter to send, and theme-based button variants. Shows send button when ready and stop button when streaming."
      sourceFile="packages/an-sdk/react/src/components/input-bar.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <InputBar
            onSend={() => {}}
            onStop={() => {}}
            status={status}
            placeholder="Send a message..."
          />
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={3}>
          <PreviewContainer colorMode={colorMode} label="Ready">
            <InputBar
              onSend={() => {}}
              onStop={() => {}}
              status="ready"
              placeholder="Send a message..."
            />
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="Streaming">
            <InputBar
              onSend={() => {}}
              onStop={() => {}}
              status="streaming"
              placeholder="Send a message..."
            />
          </PreviewContainer>
          <PreviewContainer colorMode={colorMode} label="Error">
            <InputBar
              onSend={() => {}}
              onStop={() => {}}
              status="error"
              placeholder="Send a message..."
            />
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
