"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  VISUAL_PRESETS,
  TOOL_CALL_STYLE_DEFAULTS,
} from "@/components/features/agents/an/types"
import type { VisualConfig } from "@/components/features/agents/an/types"
import type { PlaygroundAction } from "@/components/features/agents/an/playground/playground-types"
import { DEFAULT_CONFIG } from "@/components/features/agents/an/playground/use-playground-state"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/features/agents/an/ui/popover"
import type { OnboardingState, ThemePreset } from "../atoms"

/* ── Lazy-loaded heavy components ── */

const VisualConfigTab = dynamic(
  () =>
    import(
      "@/components/features/agents/an/playground/config/visual-config-tab"
    ).then((m) => ({ default: m.VisualConfigTab })),
  { ssr: false },
)

const HexColorPicker = dynamic(
  () => import("react-colorful").then((m) => ({ default: m.HexColorPicker })),
  { ssr: false },
)

/* ── Color presets ── */

const COLOR_PRESETS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Green", value: "#22c55e" },
  { label: "Orange", value: "#f59e0b" },
  { label: "Red", value: "#ef4444" },
  { label: "Pink", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Emerald", value: "#10b981" },
]

/* ── Theme preset logos ── */

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 268" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" opacity="0.15" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z" />
      <path fill="currentColor" d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.043-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
    </svg>
  )
}

function CursorLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 467 532" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M457.43 125.94 244.42 2.96c-6.84-3.95-15.28-3.95-22.12 0L9.3 125.94c-5.75 3.32-9.3 9.46-9.3 16.11v247.99c0 6.65 3.55 12.79 9.3 16.11l213.01 122.98c6.84 3.95 15.28 3.95 22.12 0l213.01-122.98c5.75-3.32 9.3-9.46 9.3-16.11V142.05c0-6.65-3.55-12.79-9.3-16.11ZM444.05 152l-205.63 356.16c-1.39 2.4-5.06 1.42-5.06-1.36V273.58c0-4.66-2.49-8.97-6.53-11.31L24.87 145.67c-2.4-1.39-1.42-5.06 1.36-5.06h411.26c5.84 0 9.49 6.33 6.57 11.39Z" />
    </svg>
  )
}

function MinimalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  )
}

function CustomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2.5h4M2.5 6v4M13.5 6v4M6 13.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5.5" y="5.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/* ── Preset UI definitions ── */

const THEME_PRESETS_UI = [
  { key: "notion" as ThemePreset, label: "Notion", logo: <NotionLogo className="w-4 h-4" /> },
  { key: "cursor" as ThemePreset, label: "Cursor", logo: <CursorLogo className="w-4 h-4" /> },
  { key: "minimal" as ThemePreset, label: "Minimal", logo: <MinimalLogo className="w-4 h-4" /> },
  { key: "custom" as ThemePreset, label: "Custom", logo: <CustomIcon className="w-4 h-4" /> },
]

/* ── Rainbow gradient for custom color circle ── */

const RAINBOW_GRADIENT =
  "conic-gradient(#f44, #f90, #ff0, #0c0, #09f, #63f, #c0f, #f44)"

/* ── Main component (controls-only, no chat preview, no button) ── */

export function ThemeStep({
  state,
  setState,
  hideHeader,
}: {
  state: OnboardingState
  setState: (fn: (s: OnboardingState) => OnboardingState) => void
  hideHeader?: boolean
}) {
  const defaultVisual = VISUAL_PRESETS.notion!.config
  const visualConfig = state.visualConfig || defaultVisual
  const [pickerOpen, setPickerOpen] = useState(false)
  const [customActivePreset, setCustomActivePreset] = useState<string | null>(null)

  const isCustom = state.theme === "custom"
  const prevPresetRef = useRef<ThemePreset>("notion")

  /* ── Preset mode handlers ── */

  function selectTheme(theme: ThemePreset) {
    if (theme === "custom") {
      if (state.theme !== "custom") prevPresetRef.current = state.theme as ThemePreset
      setState((s) => ({
        ...s,
        theme: "custom",
        visualConfig: visualConfig,
      }))
      setCustomActivePreset(null)
    } else {
      const presetColor =
        VISUAL_PRESETS[theme]?.config.primaryColor || "#3b82f6"
      setState((s) => ({
        ...s,
        theme,
        primaryColor: presetColor,
        visualConfig: null,
      }))
    }
  }

  function goBackFromCustom() {
    selectTheme(prevPresetRef.current)
  }

  function setColor(color: string) {
    setState((s) => ({ ...s, primaryColor: color }))
  }

  function setPlaceholder(value: string) {
    setState((s) => ({
      ...s,
      visualConfig: {
        ...(s.visualConfig || defaultVisual),
        inputBarPlaceholder: value,
      },
    }))
  }

  /* ── Custom mode: adapter for VisualConfigTab ── */

  const fakeConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      visual: visualConfig,
      activePreset: isCustom ? customActivePreset : state.theme,
    }),
    [visualConfig, isCustom, customActivePreset, state.theme],
  )

  const fakeDispatch = useCallback(
    (action: PlaygroundAction) => {
      if (action.type === "SET_VISUAL") {
        const payload = action.payload as Partial<VisualConfig>
        setCustomActivePreset(null)
        setState((s) => {
          const current = s.visualConfig || visualConfig
          const newVisual = { ...current, ...payload }
          if (payload.toolCallStyle) {
            const defaults =
              TOOL_CALL_STYLE_DEFAULTS[payload.toolCallStyle]
            Object.assign(newVisual, defaults)
          }
          return {
            ...s,
            visualConfig: newVisual,
            primaryColor: newVisual.primaryColor,
          }
        })
      } else if (action.type === "LOAD_VISUAL_PRESET") {
        const presetKey = action.payload as string
        const preset = VISUAL_PRESETS[presetKey]
        if (preset) {
          setCustomActivePreset(presetKey)
          setState((s) => ({
            ...s,
            visualConfig: { ...preset.config },
            primaryColor: preset.config.primaryColor,
          }))
        }
      }
    },
    [setState, visualConfig],
  )

  const isPresetColor = COLOR_PRESETS.some(
    (p) => p.value === state.primaryColor,
  )

  /* ── Shared sub-components ── */

  const presetsRow = (
    <div className="mb-4 shrink-0">
      <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-2 block">
        Preset
      </label>
      <div className="grid grid-cols-4 gap-1.5 p-1 -m-1">
        {THEME_PRESETS_UI.map(({ key, label, logo }) => {
          const active = state.theme === key
          return (
            <button
              key={key}
              onClick={() => selectTheme(key)}
              className={cn(
                "an-focus-btn flex flex-col items-center gap-1 py-2.5 rounded-lg border",
                active
                  ? "border-foreground/15 bg-foreground/[0.06] text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground/70 hover:bg-foreground/[0.03]",
              )}
            >
              {logo}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const colorAndPlaceholder = (
    <div className="space-y-5">
      {/* Color */}
      <div>
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-2 block">
          Accent color
        </label>
        <div className="flex items-center gap-1.5 px-1">
          {COLOR_PRESETS.map((preset) => {
            const selected = state.primaryColor === preset.value
            return (
              <button
                key={preset.value}
                onClick={() => setColor(preset.value)}
                title={preset.label}
                className="an-focus-btn h-7 w-7 rounded-full"
                style={{
                  backgroundColor: preset.value,
                  boxShadow: selected ? `0 0 0 3px ${preset.value}40` : undefined,
                  transition: "box-shadow 0.15s ease",
                }}
              />
            )
          })}
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button
                title="Custom color"
                className="an-focus-btn h-7 w-7 rounded-full"
                style={{
                  background: RAINBOW_GRADIENT,
                  boxShadow: !isPresetColor && state.primaryColor ? `0 0 0 3px ${state.primaryColor}40` : undefined,
                  transition: "box-shadow 0.15s ease",
                }}
              />
            </PopoverTrigger>
            <PopoverContent
              className="w-[220px] p-2 overflow-hidden"
              side="bottom"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <HexColorPicker
                color={state.primaryColor || "#3b82f6"}
                onChange={setColor}
                style={{ width: "100%" }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Placeholder text */}
      <div className="pl-1 pb-1 pr-1">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-2 block">
          Input placeholder
        </label>
        <input
          type="text"
          value={visualConfig.inputBarPlaceholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Ask the agent anything..."
          className="an-focus-input w-full h-9 rounded-lg border border-border bg-foreground/[0.04] px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  )

  /* ── Dialog mode: two-level slide animation ── */

  if (hideHeader) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isCustom ? (
            <motion.div
              key="custom"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col flex-1 min-h-0"
            >
              <button
                type="button"
                onClick={goBackFromCustom}
                className="an-focus-btn shrink-0 mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Theme preset
              </button>
              <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-border">
                <VisualConfigTab
                  config={fakeConfig}
                  dispatch={fakeDispatch}
                  hidePresets
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="presets"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {presetsRow}
              {colorAndPlaceholder}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /* ── Onboarding mode: original full-height layout ── */

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-5 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">
          Customize your theme
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          {isCustom
            ? "Fine-tune every detail of your agent's appearance."
            : "Choose a preset, pick a color, and set a welcome message."}
        </p>
      </div>

      {presetsRow}

      {/* Middle — swapped based on mode */}
      {isCustom ? (
        <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-border">
          <VisualConfigTab
            config={fakeConfig}
            dispatch={fakeDispatch}
            hidePresets
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {colorAndPlaceholder}
        </div>
      )}
    </div>
  )
}
