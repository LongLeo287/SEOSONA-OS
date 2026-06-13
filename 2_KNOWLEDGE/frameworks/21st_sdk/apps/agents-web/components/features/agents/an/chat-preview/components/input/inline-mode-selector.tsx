"use client"

import { useState } from "react"
import { ChevronDown } from "../../icons"
import { PopoverShell } from "./popover-shell"

/* Icons from apps/desktop — AgentIcon (bowtie) & PlanIcon (checklist) */
function AgentModeIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className ?? "shrink-0"}>
      <path d="M12 12L15.2218 15.182C17.0012 16.9393 19.8861 16.9393 21.6655 15.182C23.4448 13.4246 23.4448 10.5754 21.6655 8.81802C19.8861 7.06066 17.0012 7.06066 15.2218 8.81802L12 12ZM12 12L8.77817 8.81802C6.99881 7.06066 4.11389 7.06066 2.33452 8.81802C0.555159 10.5754 0.555159 13.4246 2.33452 15.182C4.11389 16.9393 6.99881 16.9393 8.77817 15.182L12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

function PlanModeIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className ?? "shrink-0"}>
      <path d="M13 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14C4.89543 14 4 14.8954 4 16C4 17.1046 4.89543 18 6 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 8.75L5.5 10L8.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MODE_ICON_MAP: Record<string, (props: { className?: string }) => React.ReactNode> = {
  agent: AgentModeIcon,
  plan: PlanModeIcon,
}

export function InlineModeSelector({ previewConfig, innerRadius }: { previewConfig?: { availableModes?: string[]; defaultMode?: string }; innerRadius?: number }) {
  const [open, setOpen] = useState(false)
  const modes = previewConfig?.availableModes ?? ["agent"]
  const defaultMode = previewConfig?.defaultMode ?? "agent"
  const defaultModeLabel = defaultMode.charAt(0).toUpperCase() + defaultMode.slice(1)
  const ActiveIcon = MODE_ICON_MAP[defaultMode] ?? AgentModeIcon

  if (modes.length === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => modes.length > 1 && setOpen(!open)}
        className="flex items-center gap-1.5 h-7 px-2.5 text-[12px] leading-4 text-foreground/40 hover:bg-foreground/[0.04] transition-colors cursor-pointer"
        style={{ borderRadius: `${innerRadius ?? 6}px` }}
      >
        <ActiveIcon className="shrink-0" />
        <span className="font-medium">{defaultModeLabel}</span>
        {modes.length > 1 && <ChevronDown />}
      </button>

      {modes.length > 1 && (
        <PopoverShell open={open} onClose={() => setOpen(false)} anchor="left" width="w-[160px]">
          {modes.map((mode) => {
            const isActive = mode === defaultMode
            const label = mode.charAt(0).toUpperCase() + mode.slice(1)
            const Icon = MODE_ICON_MAP[mode] ?? AgentModeIcon
            return (
              <div
                key={mode}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] leading-4 cursor-pointer hover:bg-foreground/[0.04] transition-colors ${isActive ? "bg-foreground/[0.06]" : ""}`}
              >
                <Icon className="shrink-0 text-foreground/40" />
                <span className="text-foreground/60 flex-1">{label}</span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/50">
                    <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                  </svg>
                )}
              </div>
            )
          })}
        </PopoverShell>
      )}
    </div>
  )
}
