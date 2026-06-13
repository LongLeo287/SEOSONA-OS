import React, { useState } from "react"
import type { ModelOption } from "../../types"
import { ChevronDown } from "../../icons/tool-icons"
import { PopoverShell } from "./popover-shell"

export function ModelPopover({
  models,
  activeModelId,
  onModelChange,
  innerRadius,
}: {
  models: ModelOption[]
  activeModelId?: string
  onModelChange?: (id: string) => void
  innerRadius?: number
}) {
  const [open, setOpen] = useState(false)
  const activeModel = models.find((m) => m.id === activeModelId) ?? models[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-7 px-2.5 flex items-center gap-1 hover:bg-foreground/[0.06] transition-colors cursor-pointer"
        style={{ borderRadius: `${innerRadius ?? 6}px` }}
      >
        <span className="text-[12px] leading-4 font-medium text-foreground/40">
          {activeModel?.name ?? "Auto"}
          {activeModel?.version && <span className="text-foreground/25 ml-0.5 font-normal">{activeModel.version}</span>}
        </span>
        <ChevronDown />
      </button>

      <PopoverShell open={open} onClose={() => setOpen(false)} anchor="right">
        {models.map((model) => {
          const isActive = model.id === activeModelId
          return (
            <div
              key={model.id}
              onClick={() => { onModelChange?.(model.id); setOpen(false) }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] leading-4 cursor-pointer hover:bg-accent ${isActive ? "bg-accent" : ""}`}
            >
              <span className="text-foreground/60 flex-1">
                {model.name}
                {model.version && <span className="text-foreground/25 ml-1">{model.version}</span>}
              </span>
              {isActive && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/50">
                  <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                </svg>
              )}
            </div>
          )
        })}
      </PopoverShell>
    </div>
  )
}

export function ModelBadge({
  models,
  activeModelId,
  innerRadius,
}: {
  models: ModelOption[]
  activeModelId?: string
  innerRadius?: number
}) {
  const activeModel = models.find((m) => m.id === activeModelId) ?? models[0]

  return (
    <div
      className="h-7 px-2.5 flex items-center"
      style={{ borderRadius: `${innerRadius ?? 6}px` }}
    >
      <span className="text-[12px] leading-4 font-medium text-foreground/30">
        {activeModel?.name ?? "Auto"}
        {activeModel?.version && <span className="text-foreground/20 ml-0.5 font-normal">{activeModel.version}</span>}
      </span>
    </div>
  )
}
