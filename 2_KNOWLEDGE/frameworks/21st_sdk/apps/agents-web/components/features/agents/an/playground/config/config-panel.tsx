"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import type { AgentConfig, PlaygroundAction } from "../playground-types"
import { AgentConfigTab } from "./agent-config-tab"
import { VisualConfigTab } from "./visual-config-tab"

type ConfigTab = "agent" | "visual"

export function ConfigPanel({
  config,
  dispatch,
  defaultTab = "agent",
  mode = "playground",
}: {
  config: AgentConfig
  dispatch: React.Dispatch<PlaygroundAction>
  defaultTab?: ConfigTab
  mode?: "playground" | "theme-builder"
}) {
  const [tab, setTab] = useState<ConfigTab>(defaultTab)

  return (
    <div className="h-full flex flex-col p-4">
      <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.5)_0%,transparent_70%)]" />

        {/* Header */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-border shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
          <span className="text-[10px] font-mono text-foreground/50 tracking-widest uppercase">
            Configuration
          </span>
        </div>

        {/* Tab switcher */}
        <div className="px-4 pt-3 pb-2 border-b border-border shrink-0">
          <div
            role="tablist"
            aria-label="Configuration tabs"
            className="relative bg-foreground/[0.06] rounded-lg h-8 p-0.5 flex w-full"
          >
            {(
              defaultTab === "visual"
                ? [
                    { id: "visual" as const, label: "Visual" },
                    { id: "agent" as const, label: mode === "theme-builder" ? "Preview" : "Agent" },
                  ]
                : [
                    { id: "agent" as const, label: "Agent" },
                    { id: "visual" as const, label: "Visual" },
                  ]
            ).map((t, idx, arr) => {
              const isActive = tab === t.id
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`config-tabpanel-${t.id}`}
                  id={`config-tab-${t.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault()
                      const nextId = arr[(idx + 1) % arr.length]!.id
                      setTab(nextId)
                      document.getElementById(`config-tab-${nextId}`)?.focus()
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault()
                      const prevId = arr[(idx - 1 + arr.length) % arr.length]!.id
                      setTab(prevId)
                      document.getElementById(`config-tab-${prevId}`)?.focus()
                    } else if (e.key === "Home") {
                      e.preventDefault()
                      setTab(arr[0]!.id)
                      document.getElementById(`config-tab-${arr[0]!.id}`)?.focus()
                    } else if (e.key === "End") {
                      e.preventDefault()
                      setTab(arr[arr.length - 1]!.id)
                      document.getElementById(`config-tab-${arr[arr.length - 1]!.id}`)?.focus()
                    }
                  }}
                  className={`an-focus-btn relative flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="playground-config-tab-indicator"
                      className="absolute inset-0 bg-foreground/[0.12] rounded-md shadow-sm"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div
          className="flex-1 overflow-y-auto"
          role="tabpanel"
          id={`config-tabpanel-${tab}`}
          aria-labelledby={`config-tab-${tab}`}
        >
          {tab === "agent" ? (
            <AgentConfigTab config={config} dispatch={dispatch} mode={mode} />
          ) : (
            <VisualConfigTab config={config} dispatch={dispatch} mode={mode} />
          )}
        </div>
      </DashedBox>
    </div>
  )
}
