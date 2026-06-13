"use client"

import { MessageList } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import { MOCK_MESSAGES } from "@/components/features/agents/an/showcase/mocks/messages"

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the message list",
  },
]

export default function MessageListPage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"

  return (
    <ShowcaseLayout
      title="MessageList"
      description="Auto-scrolling message container that groups messages by turn, supports sticky user messages, and date dividers."
      sourceFile="packages/an-sdk/react/src/components/message-list.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode} height="400px">
          <MessageList
            messages={MOCK_MESSAGES}
            status="ready"
          />
        </PreviewContainer>
      }
    />
  )
}
