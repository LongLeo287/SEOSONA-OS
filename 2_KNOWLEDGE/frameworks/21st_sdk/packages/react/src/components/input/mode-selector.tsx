import React, { useState } from "react"
import { ChevronDown } from "../../icons/tool-icons"
import { PopoverShell } from "./popover-shell"
import { ToggleSwitch } from "./toggle-switch"

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

export function SettingsPopover({
  previewConfig,
  innerRadius,
}: {
  previewConfig?: { availableModes?: string[]; defaultMode?: string }
  innerRadius?: number
}) {
  const [open, setOpen] = useState(false)
  const modes = previewConfig?.availableModes ?? ["agent"]
  const defaultMode = previewConfig?.defaultMode ?? "agent"
  const hasPlanMode = modes.includes("plan")
  const [canMakeChanges, setCanMakeChanges] = useState(defaultMode !== "plan")

  if (!hasPlanMode) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-7 w-7 flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer"
        style={{ borderRadius: `${innerRadius ?? 6}px` }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
          <path d="M3 7.375h6.829a2.501 2.501 0 0 0 4.842 0H17a.625.625 0 1 0 0-1.25h-2.329a2.501 2.501 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25M12.25 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5" />
          <path fillRule="evenodd" d="M7.75 15.75a2.5 2.5 0 0 0 2.421-1.875H17a.625.625 0 1 0 0-1.25h-6.829a2.5 2.5 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25h2.329A2.5 2.5 0 0 0 7.75 15.75m0-1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" clipRule="evenodd" />
        </svg>
      </button>
      <PopoverShell open={open} onClose={() => setOpen(false)} anchor="left" width="w-[200px]">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer" onClick={() => setCanMakeChanges(!canMakeChanges)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-foreground/40">
            <path d="m13.987 5.682-.684.684-1.288-1.288.692-.691a.91.91 0 0 1 1.28 0c.35.35.35.93 0 1.28zm-9.433 9.433 7.914-7.914-1.289-1.289-7.92 7.908c-.122.122-.214.29-.274.457l-.336 1.082c-.06.229.153.442.366.366l1.082-.335q.252-.07.457-.275m12.446.76H5.61l1.25-1.25H17a.625.625 0 1 1 0 1.25" />
          </svg>
          <span className="text-[12px] leading-4 text-foreground/60 flex-1">Can make changes</span>
          <ToggleSwitch checked={canMakeChanges} color="var(--an-send-button-bg, rgb(35 131 226))" />
        </div>
      </PopoverShell>
    </div>
  )
}

export function ModeSelector({
  modes,
  activeMode,
  onModeChange,
  display = "inline",
  innerRadius,
}: {
  modes: { id: string; label: string; icon?: React.ReactNode }[]
  activeMode?: string
  onModeChange?: (id: string) => void
  display?: "inline" | "popover"
  innerRadius?: number
}) {
  const [open, setOpen] = useState(false)
  const active = modes.find((m) => m.id === activeMode) ?? modes[0]
  const ActiveIcon = active?.id ? (MODE_ICON_MAP[active.id] ?? AgentModeIcon) : AgentModeIcon

  if (modes.length === 0) return null

  if (display === "popover") {
    return (
      <SettingsPopover
        previewConfig={{ availableModes: modes.map((m) => m.id), defaultMode: activeMode ?? modes[0]?.id }}
        innerRadius={innerRadius}
      />
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => modes.length > 1 && setOpen(!open)}
        className="flex items-center gap-1.5 h-7 px-2.5 text-[12px] leading-4 text-foreground/40 hover:bg-foreground/[0.04] transition-colors cursor-pointer"
        style={{ borderRadius: `${innerRadius ?? 6}px` }}
      >
        <ActiveIcon className="shrink-0" />
        <span className="font-medium">{active?.label ?? "Agent"}</span>
        {modes.length > 1 && <ChevronDown />}
      </button>

      {modes.length > 1 && (
        <PopoverShell open={open} onClose={() => setOpen(false)} anchor="left" width="w-[160px]">
          {modes.map((mode) => {
            const isActive = mode.id === activeMode
            const Icon = MODE_ICON_MAP[mode.id] ?? AgentModeIcon
            return (
              <div
                key={mode.id}
                onClick={() => { onModeChange?.(mode.id); setOpen(false) }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] leading-4 cursor-pointer hover:bg-foreground/[0.04] transition-colors ${isActive ? "bg-foreground/[0.06]" : ""}`}
              >
                <Icon className="shrink-0 text-foreground/40" />
                <span className="text-foreground/60 flex-1">{mode.label}</span>
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
