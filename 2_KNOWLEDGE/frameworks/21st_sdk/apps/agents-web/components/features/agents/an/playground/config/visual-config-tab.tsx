"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ConfigSection,
  SegmentedControl,
  SimpleSelect,
  SwitchRow,
  ColorInput,
  RadiusInput,
} from "./config-shared"
import { useTheme } from "next-themes"
import type {
  AgentConfig,
  PlaygroundAction,
  VisualConfig,
  ThemeModeColors,
  MessageBubbleStyle,
  MessageDensity,
  ModesSelectorPosition,
  SendButtonStyle,
  StopButtonStyle,
  AttachmentButtonStyle,
  AttachmentPreviewStyle,
  TextSizeScale,
  TextContrast,
} from "../playground-types"
import {
  VISUAL_PRESETS,
  TEXT_SIZE_OPTIONS,
  resolveColor,
} from "../playground-types"
import {
  SANS_SERIF_FONTS,
  SERIF_FONTS,
  MONO_FONTS,
} from "@/components/features/agents/ui/canvas/[id]/{components}/sidebar/theme-editor/font-selector"
import { loadGoogleFont } from "../../chat-preview/utils/load-google-font"
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/tooltip"
import {
  overlayItemBase,
  overlayItemHover,
  overlayItemFocus,
} from "@/components/features/agents/ui/1code/lib/overlay-styles"

/* ── Brand logos (SVGL) ── */

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 268" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" opacity="0.15" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z" />
      <path fill="currentColor" d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
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
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

/* ── Font family selector ── */

const ALL_FONTS = [
  { group: "Sans Serif", fonts: SANS_SERIF_FONTS },
  { group: "Serif", fonts: SERIF_FONTS },
  { group: "Monospace", fonts: MONO_FONTS },
]

function getFontLabel(value: string) {
  for (const g of ALL_FONTS) {
    const match = g.fonts.find((f) => f.value === value)
    if (match) return match.label
  }
  if (value) return value.split(",")[0]!.trim().replace(/['"]/g, "")
  return "System UI"
}

function FontFamilySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? ALL_FONTS.map((g) => ({
        ...g,
        fonts: g.fonts.filter((f) => f.label.toLowerCase().includes(search.toLowerCase())),
      })).filter((g) => g.fonts.length > 0)
    : ALL_FONTS

  return (
    <div>
      <label className="text-[11px] text-foreground/55 mb-1.5 block">Font family</label>
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch("") }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-foreground/[0.05] hover:bg-foreground/[0.07] transition-colors"
          >
            <span className="text-[11px] font-medium text-foreground/90 truncate" style={{ fontFamily: value }}>
              {getFontLabel(value)}
            </span>
            <span className="text-[10px] text-foreground/40" style={{ fontFamily: value }}>Aa Bb</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Search input */}
          <div className="flex items-center gap-1.5 h-7 px-1.5 mx-1 my-1 rounded-md bg-muted/50">
            <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search fonts..."
              autoFocus
            />
          </div>

          {/* Font list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">No font found.</div>
            )}
            {filtered.map((g) => (
              <div key={g.group}>
                <div className="py-1.5 px-1.5 mx-1 text-xs font-medium text-muted-foreground">
                  {g.group}
                </div>
                {g.fonts.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => {
                      loadGoogleFont(font.value)
                      onChange(font.value)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={`${overlayItemBase} ${overlayItemHover} ${overlayItemFocus} w-[calc(100%-8px)] text-left transition-colors ${
                      value === font.value
                        ? "bg-accent dark:bg-neutral-800 text-foreground font-medium"
                        : "text-foreground/70"
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ── Themed color input (single → light/dark split) ── */

function SplitIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.993 3.284q.397.109.786.239.39.122.773.267H9.993zm0 1.196h3.398q.054.144.102.294.054.144.103.3H9.993zm0 1.483H14.8q.034.144.061.294.028.144.055.294H9.993zm0 1.47h6.112a7 7 0 0 1 .054.595H9.993zm0 1.483h6.18q.006.15.007.294l.013.294h-6.2zm0 1.47h6.2l-.013.301q0 .144-.007.294h-6.18zm0 1.484h6.166a7 7 0 0 1-.054.588H9.993zm0 1.476h4.922l-.055.301a7 7 0 0 1-.061.287H9.993zm0 1.572h3.603a5 5 0 0 1-.103.301q-.048.15-.102.294H9.993zm0 1.286h1.559q-.383.143-.773.266-.39.13-.786.24zm.007.922a6.85 6.85 0 0 1-2.755-.56 7.2 7.2 0 0 1-2.276-1.538 7.3 7.3 0 0 1-1.545-2.27 6.9 6.9 0 0 1-.554-2.761q0-1.464.554-2.748a7.4 7.4 0 0 1 1.538-2.277 7.2 7.2 0 0 1 2.276-1.538 6.85 6.85 0 0 1 2.755-.56q1.463 0 2.755.56 1.3.555 2.276 1.538A7.3 7.3 0 0 1 16.57 7.25q.56 1.284.56 2.748 0 1.47-.56 2.761a7.3 7.3 0 0 1-1.545 2.27 7.1 7.1 0 0 1-2.27 1.538q-1.29.56-2.754.56m0-1.565q1.155 0 2.16-.43a5.6 5.6 0 0 0 1.777-1.19 5.492 5.492 0 0 0 1.627-3.944q0-1.155-.437-2.16a5.6 5.6 0 0 0-1.196-1.778 5.5 5.5 0 0 0-3.938-1.627q-1.155 0-2.167.43a5.6 5.6 0 0 0-1.77 1.197 5.501 5.501 0 0 0-1.613 3.938q0 1.161.423 2.173a5.6 5.6 0 0 0 1.197 1.77q.765.76 1.77 1.19 1.011.43 2.167.431" />
    </svg>
  )
}

function ThemedColorInput({
  label,
  field,
  visual,
  setVisual,
}: {
  label: string
  field: keyof ThemeModeColors
  visual: VisualConfig
  setVisual: (partial: Partial<VisualConfig>) => void
}) {
  const { resolvedTheme } = useTheme()
  const mode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  const hasOverrides = !!(visual.light?.[field] || visual.dark?.[field])
  const [split, setSplit] = useState(hasOverrides)

  // Sync when preset loads with overrides
  useEffect(() => {
    if (hasOverrides) setSplit(true)
  }, [hasOverrides])

  // When toggling off, clear the overrides
  const toggleSplit = () => {
    if (split) {
      const { [field]: _l, ...restLight } = visual.light || {}
      const { [field]: _d, ...restDark } = visual.dark || {}
      setVisual({
        light: Object.keys(restLight).length ? restLight : undefined,
        dark: Object.keys(restDark).length ? restDark : undefined,
      })
    }
    setSplit(!split)
  }

  // Resolved color for each mode (what preview actually uses)
  const resolvedLight = resolveColor(visual, field, "light")
  const resolvedDark = resolveColor(visual, field, "dark")
  // For the single input — show the color as it appears in the current theme
  const currentResolved = mode === "dark" ? resolvedDark : resolvedLight

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] text-foreground/55">{label}</label>
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleSplit}
              className={`flex items-center gap-0.5 text-[10px] transition-colors ${
                split
                  ? "text-foreground/60 hover:text-foreground/80"
                  : "text-foreground/30 hover:text-foreground/50"
              }`}
            >
              <SplitIcon className={split ? "opacity-100" : "opacity-60"} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {split ? "Use single color" : "Different per theme"}
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
        style={{
          gridTemplateRows: split ? "0fr" : "1fr",
          opacity: split ? 0 : 1,
        }}
      >
        <div className="overflow-hidden">
          <ColorInput
            value={visual[field]}
            onChange={(val) => setVisual({ [field]: val })}
          />
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
        style={{
          gridTemplateRows: split ? "1fr" : "0fr",
          opacity: split ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            <ColorInput
              label={mode === "light" ? "Light \u2022" : "Light"}
              value={visual.light?.[field] || ""}
              onChange={(val) =>
                setVisual({ light: { ...visual.light, [field]: val } })
              }
              fallbackColor={visual[field]}
              clearable
            />
            <ColorInput
              label={mode === "dark" ? "Dark \u2022" : "Dark"}
              value={visual.dark?.[field] || ""}
              onChange={(val) =>
                setVisual({ dark: { ...visual.dark, [field]: val } })
              }
              fallbackColor={visual[field]}
              clearable
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ── */

export function VisualConfigTab({
  config,
  dispatch,
  hidePresets,
  mode = "playground",
}: {
  config: AgentConfig
  dispatch: React.Dispatch<PlaygroundAction>
  hidePresets?: boolean
  mode?: "playground" | "theme-builder"
}) {
  const v = config.visual
  const setVisual = (partial: Partial<VisualConfig>) =>
    dispatch({ type: "SET_VISUAL", payload: partial })

  // Conditional visibility based on agent config
  const hasAttachments = config.attachments.enabled
  const hasMultipleModels = config.allowedModels.length > 1
  const hasMultipleModes = config.modes.available.length > 1

  return (
    <div className="[&>*:last-child]:border-b-0">
      {/* ── 1. Preset ── */}
      {!hidePresets && (
        <ConfigSection overline="Preset" delay={0}>
          <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Visual preset">
            {([
              { key: "notion", label: "Notion", logo: <NotionLogo className="w-4 h-4" /> },
              { key: "cursor", label: "Cursor", logo: <CursorLogo className="w-4 h-4" /> },
              { key: "minimal", label: "Minimal", logo: <MinimalLogo className="w-4 h-4" /> },
            ] as const).map(({ key, label, logo }) => {
              const active = config.activePreset === key
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => dispatch({ type: "LOAD_VISUAL_PRESET", payload: key })}
                  className={`an-focus-btn flex flex-col items-center gap-1 py-2 rounded-lg border transition-colors ${
                    active
                      ? "border-foreground/20 bg-foreground/[0.08] text-foreground/80"
                      : "border-transparent text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.06]"
                  }`}
                >
                  {logo}
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </ConfigSection>
      )}

      {/* ── 2. Theme ── */}
      <ConfigSection overline="Theme" delay={0.04}>
        <div className="space-y-3">
          <ThemedColorInput
            label="Primary color"
            field="primaryColor"
            visual={v}
            setVisual={setVisual}
          />

          <FontFamilySelector value={v.fontFamily} onChange={(val) => setVisual({ fontFamily: val })} />

          <SimpleSelect<TextSizeScale>
            label="Text size"
            value={v.textSizeScale}
            options={TEXT_SIZE_OPTIONS}
            onChange={(id) => setVisual({ textSizeScale: id })}
          />

          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Text contrast
            </label>
            <SegmentedControl<TextContrast>
              value={v.textContrast}
              options={[
                { id: "normal", label: "Normal" },
                { id: "high", label: "High contrast" },
              ]}
              onChange={(id) => setVisual({ textContrast: id })}
              layoutId="pg-text-contrast"
            />
          </div>

          <RadiusInput
            label="Border radius"
            value={parseInt(v.messageBorderRadius) || 0}
            onChange={(val) => setVisual({ messageBorderRadius: `${val}px`, inputBarBorderRadius: `${val}px` })}
          />
        </div>
      </ConfigSection>

      {/* ── 3. Messages ── */}
      <ConfigSection overline="Messages" delay={0.08}>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Message style
            </label>
            <SegmentedControl<MessageBubbleStyle>
              value={v.messageBubbleStyle}
              options={[
                { id: "bubble-right", label: "Bubble" },
                { id: "full-width", label: "Full-width" },
              ]}
              onChange={(id) => setVisual({ messageBubbleStyle: id })}
              layoutId="pg-msg-bubble"
            />
          </div>

          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Message density
            </label>
            <SegmentedControl<MessageDensity>
              value={v.messageDensity}
              options={[
                { id: "relaxed", label: "Relaxed" },
                { id: "compact", label: "Compact" },
                { id: "dense", label: "Dense" },
              ]}
              onChange={(id) => setVisual({ messageDensity: id })}
              layoutId="pg-msg-density"
            />
          </div>

          {v.messageBubbleStyle === "full-width" && (
            <SwitchRow
              label="Sticky user messages"
              checked={v.stickyUserMessages}
              onCheckedChange={(val) => setVisual({ stickyUserMessages: val })}
            />
          )}

          {v.messageBubbleStyle === "full-width" && (
            <SwitchRow
              label="Message shadow"
              checked={v.messageShadow}
              onCheckedChange={(val) => setVisual({ messageShadow: val })}
            />
          )}

          <AnimatePresence>
            {v.messageBubbleStyle === "bubble-right" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ThemedColorInput
                  label="User message background"
                  field="userMessageBg"
                  visual={v}
                  setVisual={setVisual}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <SwitchRow
            label="Show date divider"
            checked={v.showDateDivider}
            onCheckedChange={(val) => setVisual({ showDateDivider: val })}
          />

          <SwitchRow
            label="Show copy button"
            checked={v.showCopyButton}
            onCheckedChange={(val) => setVisual({ showCopyButton: val })}
          />

          <SwitchRow
            label="Show tool icons"
            checked={v.showToolIcons}
            onCheckedChange={(val) => setVisual({ showToolIcons: val })}
          />
        </div>
      </ConfigSection>

      {/* ── 4. Input Bar ── */}
      <ConfigSection overline="Input Bar" delay={0.12}>
        <div className="space-y-3">
          <div>
            <label htmlFor="input-placeholder" className="text-[11px] text-foreground/55 mb-1.5 block">
              Placeholder text
            </label>
            <input
              id="input-placeholder"
              value={v.inputBarPlaceholder}
              onChange={(e) =>
                setVisual({ inputBarPlaceholder: e.target.value })
              }
              className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 text-[12px] text-foreground placeholder:text-foreground/50"
              placeholder="Type placeholder text..."
            />
          </div>

          <SwitchRow
            label="Shadow"
            checked={v.inputBarShadow}
            onCheckedChange={(val) => setVisual({ inputBarShadow: val })}
          />

          <SwitchRow
            label="Fill"
            checked={v.inputBarFill}
            onCheckedChange={(val) => setVisual({ inputBarFill: val })}
          />
          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Send button
            </label>
            <SegmentedControl<SendButtonStyle>
              value={v.sendButtonStyle}
              options={[
                { id: "circle-icon", label: "Circle" },
                { id: "pill-text", label: "Pill" },
              ]}
              onChange={(id) => setVisual({ sendButtonStyle: id })}
              layoutId="pg-send-btn"
            />
          </div>

          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Stop button
            </label>
            <SegmentedControl<StopButtonStyle>
              value={v.stopButtonStyle}
              options={[
                { id: "circle-square", label: "Square" },
                { id: "pill-text", label: "Pill" },
              ]}
              onChange={(id) => setVisual({ stopButtonStyle: id })}
              layoutId="pg-stop-btn"
            />
          </div>

          {hasAttachments && (
            <>
              <div>
                <label className="text-[11px] text-foreground/55 mb-1.5 block">
                  Attachment button
                </label>
                <SegmentedControl<AttachmentButtonStyle>
                  value={v.attachmentButtonStyle}
                  options={[
                    { id: "plus-circle", label: "Plus" },
                    { id: "paperclip", label: "Paperclip" },
                    { id: "hidden", label: "Hidden" },
                  ]}
                  onChange={(id) => setVisual({ attachmentButtonStyle: id })}
                  layoutId="pg-attach-btn"
                />
              </div>

              <div
                className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
                style={{
                  gridTemplateRows: v.attachmentButtonStyle !== "hidden" ? "1fr" : "0fr",
                  opacity: v.attachmentButtonStyle !== "hidden" ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div className="pt-3">
                    <label className="text-[11px] text-foreground/55 mb-1.5 block">
                      Attach button position
                    </label>
                    <SegmentedControl<"left" | "right">
                      value={v.attachButtonRight ? "right" : "left"}
                      options={[
                        { id: "left", label: "Left" },
                        { id: "right", label: "Right" },
                      ]}
                      onChange={(id) => setVisual({ attachButtonRight: id === "right" })}
                      layoutId="pg-attach-pos"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-foreground/55 mb-1.5 block">
                  Attachment preview
                </label>
                <SegmentedControl<AttachmentPreviewStyle>
                  value={v.attachmentPreviewStyle}
                  options={[
                    { id: "thumbnail", label: "Thumbnail" },
                    { id: "chip", label: "Chip" },
                    { id: "hidden", label: "Hidden" },
                  ]}
                  onChange={(id) => setVisual({ attachmentPreviewStyle: id })}
                  layoutId="pg-attach-preview"
                />
              </div>
            </>
          )}

          {mode !== "theme-builder" && hasMultipleModes && (
            <div>
              <label className="text-[11px] text-foreground/55 mb-1.5 block">
                Mode selector
              </label>
              <SegmentedControl<ModesSelectorPosition>
                value={v.modesSelectorPosition}
                options={[
                  { id: "popover", label: "Popover" },
                  { id: "inline", label: "Inline" },
                  { id: "hidden", label: "Hidden" },
                ]}
                onChange={(id) => setVisual({ modesSelectorPosition: id })}
                layoutId="pg-mode-sel"
              />
            </div>
          )}

          {config.allowedModels.length >= 1 && !hasMultipleModels && (
            <>
              <SwitchRow
                label="Show model"
                checked={v.modelSelectorPosition !== "hidden"}
                onCheckedChange={(val) => setVisual({ modelSelectorPosition: val ? "input-bar" : "hidden" })}
              />
              <div
                className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
                style={{
                  gridTemplateRows: v.modelSelectorPosition !== "hidden" ? "1fr" : "0fr",
                  opacity: v.modelSelectorPosition !== "hidden" ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <label className="text-[11px] text-foreground/55 mb-1.5 block">
                    Model selector position
                  </label>
                  <SegmentedControl<"left" | "right">
                    value={v.modelSelectorLeft ? "left" : "right"}
                    options={[
                      { id: "left", label: "Left" },
                      { id: "right", label: "Right" },
                    ]}
                    onChange={(id) => setVisual({ modelSelectorLeft: id === "left" })}
                    layoutId="pg-model-pos"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </ConfigSection>
    </div>
  )
}
