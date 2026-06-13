"use client"

import "@21st-sdk/react/styles.css"

import { AgentChat } from "@21st-sdk/react"
import { useTheme } from "next-themes"
import type { UIMessage, ChatStatus } from "ai"
import { cn } from "@/lib/utils"

function HiddenInputBar() {
  return null
}

const READ_ONLY_SLOTS = { InputBar: HiddenInputBar }
const noop = () => {}

export function ReadOnlyAgentChat({
  messages,
  status,
  className,
  transparent,
}: {
  messages: UIMessage[]
  status: ChatStatus
  className?: string
  transparent?: boolean
}) {
  const { resolvedTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"

  return (
    <AgentChat
      messages={messages}
      onSend={noop}
      status={status}
      onStop={noop}
      colorMode={colorMode}
      slots={READ_ONLY_SLOTS}
      className={cn("h-full", className)}
      style={transparent ? ({ "--an-background": "transparent" } as React.CSSProperties) : undefined}
    />
  )
}
