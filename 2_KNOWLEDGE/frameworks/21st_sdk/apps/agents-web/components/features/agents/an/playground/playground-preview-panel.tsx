"use client"

import { useRef, useMemo } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import { AnAgentChat, InputBar } from "@21st-sdk/react"
import "@21st-sdk/react/styles.css"
import type { AnTheme } from "@21st-sdk/react"
import { chatMessages, notionChatMessages } from "./mock-messages"
import { useMessageReplay } from "./use-message-replay"
import { generateThemeJson } from "./use-playground-state"
import type { AgentConfig } from "./playground-types"
import { CLAUDE_MODELS, CODEX_MODELS, resolveColor } from "./playground-types"

/* ── Accent helpers ── */

function accentGlowFromColor(color: string) {
  const hex = color.replace("#", "")
  const r = parseInt(hex.slice(0, 2), 16) || 59
  const g = parseInt(hex.slice(2, 4), 16) || 130
  const b = parseInt(hex.slice(4, 6), 16) || 246
  return `bg-[radial-gradient(ellipse_at_center,rgba(${r},${g},${b},0.45)_0%,transparent_70%)]`
}

function accentDotFromColor(color: string) {
  return { backgroundColor: color || "#3b82f6" }
}

/* ── Preview panel ── */

export function PlaygroundPreviewPanel({
  config,
  mode = "playground",
}: {
  config: AgentConfig
  mode?: "playground" | "theme-builder"
}) {
  const previewRef = useRef<HTMLDivElement>(null)
  const replayRef = useRef<(() => void) | null>(null)

  // Select message set based on search display config
  const allMessages = config.visual.searchDisplay === "rich-group" ? notionChatMessages : chatMessages

  // Progressive message reveal
  const { visibleMessages, replay, status, activeTyping, onTypingComplete } = useMessageReplay({
    messages: allMessages,
    paused: false,
  })

  if (replayRef) replayRef.current = replay

  // Build theme from visual config
  const theme: AnTheme = useMemo(
    () => JSON.parse(generateThemeJson(config.visual)),
    [config.visual],
  )

  // Preview config for input bar features
  const activeModels = config.agentProvider === "claude-code" ? CLAUDE_MODELS : CODEX_MODELS
  const defaultModelId = config.agentProvider === "claude-code" ? config.claudeModel : config.codexModel

  const previewConfig = useMemo(() => {
    const allowedModelObjects = config.allowedModels
      .map((id) => activeModels.find((m) => m.id === id))
      .filter(Boolean) as { id: string; name: string; version?: string }[]

    return {
      attachmentsEnabled: config.attachments.enabled,
      allowedModels: allowedModelObjects,
      activeModelId: defaultModelId,
      availableModes: mode === "theme-builder" ? ["agent"] : config.modes.available,
      defaultMode: mode === "theme-builder" ? "agent" : config.modes.defaultMode,
    }
  }, [config.attachments.enabled, config.allowedModels, activeModels, defaultModelId, config.modes.available, config.modes.defaultMode, mode])

  const { resolvedTheme } = useTheme()
  const themeMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  const primaryColor = resolveColor(config.visual, "primaryColor", themeMode) || "#3b82f6"

  return (
    <div ref={previewRef} className="h-full flex flex-col p-4">
      <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Top accent glow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={primaryColor}
            className={`absolute top-0 left-0 right-0 h-px ${accentGlowFromColor(primaryColor)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>

        {/* Header */}
        <div className="px-4 h-10 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={accentDotFromColor(primaryColor)}
              animate={{ backgroundColor: primaryColor }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-[10px] font-mono text-foreground/50 tracking-widest uppercase">
              Preview
            </span>
          </div>
          <button
            onClick={() => replayRef.current?.()}
            className="p-1.5 rounded-md transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/[0.06] active:scale-[0.97] an-focus-btn"
            aria-label="Restart demo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </button>
        </div>

        {/* SDK-rendered chat preview */}
        <div className="flex-1 min-h-0 overflow-hidden bg-background" tabIndex={-1}>
          <AnAgentChat
            messages={visibleMessages}
            onSend={() => {}}
            status={status}
            onStop={() => {}}
            theme={theme}
            colorMode={themeMode}
            slots={{
              InputBar: (props) => (
                <InputBar
                  {...props}
                  attachmentButton={
                    config.visual.attachmentButtonStyle !== "hidden" && previewConfig.attachmentsEnabled
                      ? config.visual.attachmentButtonStyle
                      : undefined
                  }
                  attachmentButtonPosition={config.visual.attachButtonRight ? "right" : "left"}
                  modelSelector={
                    previewConfig.allowedModels.length >= 1 && config.visual.modelSelectorPosition !== "hidden"
                      ? {
                          models: previewConfig.allowedModels,
                          activeModelId: previewConfig.activeModelId,
                          display: previewConfig.allowedModels.length > 1 ? "popover" : "badge",
                          position: config.visual.modelSelectorLeft ? "left" : "right",
                        }
                      : undefined
                  }
                  modeSelector={
                    config.visual.modesSelectorPosition !== "hidden"
                      ? {
                          modes: (previewConfig.availableModes ?? []).map(m => ({
                            id: m,
                            label: m.charAt(0).toUpperCase() + m.slice(1),
                          })),
                          activeMode: previewConfig.defaultMode,
                          display: config.visual.modesSelectorPosition === "inline" ? "inline" : "popover",
                        }
                      : undefined
                  }
                  typingAnimation={
                    activeTyping
                      ? { ...activeTyping, isActive: true, onComplete: onTypingComplete }
                      : undefined
                  }
                />
              ),
            }}
          />
        </div>

      </DashedBox>
    </div>
  )
}
