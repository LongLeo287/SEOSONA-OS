"use client"

import { AnAgentChat } from "@21st-sdk/react"
import type { AnTheme } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { VariantGrid } from "@/components/features/agents/an/showcase/components/variant-grid"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import {
  MOCK_MESSAGES,
  MOCK_SHORT_MESSAGES,
} from "@/components/features/agents/an/showcase/mocks/messages"
import { THEME_PRESETS } from "@/components/features/agents/an/showcase/mocks/themes"

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the chat",
  },
  {
    name: "preset",
    type: "select",
    options: ["default", "warmDark", "vibrant", "minimal"],
    defaultValue: "default",
    description: "Theme preset to apply",
  },
  {
    name: "useLongConversation",
    type: "boolean",
    defaultValue: true,
    description: "Use long conversation with tools",
  },
]

export default function AnAgentChatPage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"
  const preset = values.preset as string
  const useLongConversation = values.useLongConversation as boolean

  const selectedTheme: AnTheme | undefined =
    preset === "default" ? undefined : THEME_PRESETS[preset]?.theme
  const messages = useLongConversation ? MOCK_MESSAGES : MOCK_SHORT_MESSAGES

  return (
    <ShowcaseLayout
      title="AgentChat"
      description="Full drop-in chat component with message list, input bar, and theming. Supports tool rendering, streaming, and custom themes."
      sourceFile="packages/an-sdk/react/src/an-agent-chat.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer
          theme={selectedTheme}
          colorMode={colorMode}
          height="500px"
        >
          <AnAgentChat
            messages={messages}
            onSend={() => {}}
            status="ready"
            onStop={() => {}}
            theme={selectedTheme}
            colorMode={colorMode}
          />
        </PreviewContainer>
      }
      variants={
        <VariantGrid columns={2}>
          {Object.entries(THEME_PRESETS).map(([key, preset]) => (
            <PreviewContainer
              key={key}
              theme={preset.theme}
              colorMode={colorMode}
              label={preset.name}
              height="300px"
            >
              <AnAgentChat
                messages={MOCK_SHORT_MESSAGES}
                onSend={() => {}}
                status="ready"
                onStop={() => {}}
                theme={preset.theme}
                colorMode={colorMode}
              />
            </PreviewContainer>
          ))}
        </VariantGrid>
      }
    />
  )
}
