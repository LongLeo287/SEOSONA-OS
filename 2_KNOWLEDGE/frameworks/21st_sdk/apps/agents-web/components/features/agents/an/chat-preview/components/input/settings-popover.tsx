"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import type { VisualConfig } from "../../types/theme"
import { resolveColor } from "../../../types/visual"
import { PopoverShell } from "./popover-shell"
import { ToggleSwitch } from "./toggle-switch"

export function SettingsPopover({
  vc,
  previewConfig,
  innerRadius,
}: {
  vc: VisualConfig
  previewConfig?: { availableModes?: string[]; defaultMode?: string }
  innerRadius?: number
}) {
  const { resolvedTheme } = useTheme()
  const mode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  const [open, setOpen] = useState(false)
  const modes = previewConfig?.availableModes ?? ["agent"]
  const defaultMode = previewConfig?.defaultMode ?? "agent"
  const hasPlanMode = modes.includes("plan")
  const [canMakeChanges, setCanMakeChanges] = useState(defaultMode !== "plan")
  const primaryColor = resolveColor(vc, "primaryColor", mode)

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
          <ToggleSwitch checked={canMakeChanges} color={primaryColor} />
        </div>
      </PopoverShell>
    </div>
  )
}
