"use client"

import { MessageActions } from "@21st-sdk/react"
import { ShowcaseLayout } from "@/components/features/agents/an/showcase/components/showcase-layout"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { useControls } from "@/components/features/agents/an/showcase/lib/use-controls"
import type { ControlDefinition } from "@/components/features/agents/an/showcase/lib/use-controls"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"

const MOCK_CONTENT =
  "Here's the refactored version using async/await. The key changes are replacing the callback pattern and simplifying the control flow."

const controls: ControlDefinition[] = [
  {
    name: "colorMode",
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    description: "Color mode for the message actions",
  },
]

export default function MessageActionsPage() {
  const { colorMode: globalColorMode } = useShowcaseContext()
  const { values, setValue, reset } = useControls(controls)

  const colorMode = values.colorMode as "light" | "dark"

  return (
    <ShowcaseLayout
      title="MessageActions"
      description="Copy button with 2-second success feedback. Appears on hover over assistant messages."
      sourceFile="packages/an-sdk/react/src/components/message-actions.tsx"
      controls={{
        definitions: controls,
        values,
        onChange: setValue,
        onReset: reset,
      }}
      preview={
        <PreviewContainer colorMode={colorMode}>
          <div
            className="group"
            style={{ padding: "16px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "var(--an-foreground-muted, #666)",
              }}
            >
              Hover to reveal actions:
            </span>
            <MessageActions content={MOCK_CONTENT} />
          </div>
        </PreviewContainer>
      }
    />
  )
}
