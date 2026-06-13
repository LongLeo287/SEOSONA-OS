"use client"

import { UserMessage } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { MOCK_USER_MESSAGE } from "@/components/features/agents/an/showcase/mocks/messages"

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the user message",
  },
]

export default function UserMessagePage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"

  return (
    <ShowcaseLayout
      title="UserMessage"
      description="User message component supporting bubble-right and full-width styles. Style is controlled by the --an-message-style CSS variable."
      sourceFile="packages/an-sdk/react/src/components/user-message.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div style={{ padding: "16px" }}>
            <UserMessage message={MOCK_USER_MESSAGE} />
          </div>
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          <PreviewContainer colorMode="light" label="Light">
            <div style={{ padding: "16px" }}>
              <UserMessage message={MOCK_USER_MESSAGE} />
            </div>
          </PreviewContainer>
          <PreviewContainer colorMode="dark" label="Dark">
            <div style={{ padding: "16px" }}>
              <UserMessage message={MOCK_USER_MESSAGE} />
            </div>
          </PreviewContainer>
        </VariantGrid>
      }
    />
  )
}
