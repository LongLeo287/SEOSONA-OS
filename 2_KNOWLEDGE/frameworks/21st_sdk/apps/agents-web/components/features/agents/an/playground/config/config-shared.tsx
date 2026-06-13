"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Switch } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "../../ui/popover"
import { HexColorPicker } from "react-colorful"
import type { IconFamily } from "../playground-types"
import {
  overlayContentBase,
  overlayItemBase,
  overlayItemHover,
  overlayItemFocus,
} from "@/components/features/agents/ui/1code/lib/overlay-styles"

/* ── Section wrapper ── */

export function ConfigSection({
  overline,
  children,
  delay = 0,
}: {
  overline: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      className="border-b border-border"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="sticky top-0 z-30 flex items-center gap-2 px-4 pt-2.5 pb-1.5 bg-background/95 backdrop-blur-sm">
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 10"
          fill="currentColor"
          className="text-foreground/40"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="10" height="2" />
          <rect x="0" y="4" width="10" height="2" />
          <rect x="0" y="8" width="10" height="2" />
        </svg>
        <span className="text-[10px] font-medium text-foreground/55 uppercase tracking-widest">
          {overline}
        </span>
      </div>
      <div className="px-4 pb-2.5 pt-1">
        {children}
      </div>
    </motion.div>
  )
}

/* ── Segmented control ── */

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  layoutId,
  label,
}: {
  value: T
  options: { id: T; label: string; icon?: React.ReactNode; disabled?: boolean; badge?: string }[]
  onChange: (id: T) => void
  layoutId: string
  label?: string
}) {
  const enabledOptions = options.filter((o) => !o.disabled)

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const enabledIdx = enabledOptions.findIndex((o) => o.id === options[idx]?.id)
    if (enabledIdx === -1) return
    let nextEnabledIdx: number | null = null
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      nextEnabledIdx = (enabledIdx + 1) % enabledOptions.length
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      nextEnabledIdx = (enabledIdx - 1 + enabledOptions.length) % enabledOptions.length
    } else if (e.key === "Home") {
      e.preventDefault()
      nextEnabledIdx = 0
    } else if (e.key === "End") {
      e.preventDefault()
      nextEnabledIdx = enabledOptions.length - 1
    }
    if (nextEnabledIdx !== null) {
      const nextOpt = enabledOptions[nextEnabledIdx]!
      onChange(nextOpt.id)
      const allIdx = options.findIndex((o) => o.id === nextOpt.id)
      const container = e.currentTarget.parentElement
      const nextButton = container?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[allIdx]
      nextButton?.focus()
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative bg-foreground/[0.06] rounded-lg h-8 p-0.5 flex w-full"
    >
      {options.map((opt, idx) => {
        const isActive = value === opt.id
        const isDisabled = opt.disabled === true
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isActive}
            aria-disabled={isDisabled || undefined}
            tabIndex={isDisabled ? -1 : isActive ? 0 : -1}
            onClick={() => !isDisabled && onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`an-focus-btn relative flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-md transition-colors duration-200 ${
              isDisabled
                ? "text-foreground/30 cursor-not-allowed"
                : isActive
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            {isActive && !isDisabled && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-foreground/[0.12] rounded-md shadow-sm"
                transition={{
                  type: "spring",
                  bounce: 0.15,
                  duration: 0.4,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
              {opt.badge && (
                <span className="text-[9px] font-medium uppercase tracking-wider text-foreground/30 bg-foreground/[0.06] px-1.5 py-0.5 rounded">
                  {opt.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Switch row ── */

export function SwitchRow({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <label className={`flex items-center justify-between gap-3 group ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] text-foreground/80 group-hover:text-foreground transition-colors">
          {label}
        </span>
        {description && (
          <span className="block text-[10px] text-foreground/50 mt-0.5">
            {description}
          </span>
        )}
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </label>
  )
}

/* ── Checkbox row ── */

export function CheckboxRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  const id = `cb-${label.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 w-full rounded-md px-1.5 py-1 -mx-1.5 cursor-pointer select-none hover:bg-foreground/[0.04] transition-colors"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
        <span className="text-[11px] font-normal leading-none text-foreground/70 shrink-0">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-foreground/40 font-normal truncate">
            {description}
          </span>
        )}
      </div>
    </label>
  )
}

/* ── Plan field ── */

export function PlanField({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string
}) {
  const isUnlimited = value === "unlimited" || value === ""
  const inputId = `plan-${label.replace(/\s+/g, "-").toLowerCase()}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const filtered = raw.replace(/[^0-9.]/g, "")
    const parts = filtered.split(".")
    const sanitized = parts.length > 2
      ? parts[0] + "." + parts.slice(1).join("")
      : filtered
    onChange(sanitized || "unlimited")
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-[10px] text-foreground/50 mb-0.5 block">{label}</label>
      <div className="relative">
        {prefix && !isUnlimited && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-foreground/50 pointer-events-none" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          value={isUnlimited ? "" : value}
          onChange={handleChange}
          inputMode="decimal"
          onBlur={(e) => {
            if (!e.target.value.trim()) onChange("unlimited")
          }}
          className={`an-focus-input w-full h-6 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] text-[10px] font-mono text-foreground/70 placeholder:text-foreground/40 ${
            prefix && !isUnlimited ? "pl-5 pr-2" : "px-2"
          }`}
          placeholder="unlimited"
        />
      </div>
    </div>
  )
}

/* ── Agent icons ── */

export function ClaudeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.92405 15.2962L9.85823 13.0903L9.92405 12.8981L9.85823 12.7918H9.66582L9.0076 12.7513L6.75949 12.6906L4.81013 12.6097L2.92152 12.5085L2.44557 12.4073L2 11.8204L2.04557 11.5269L2.44557 11.2588L3.01772 11.3094L4.28354 11.3954L6.18228 11.5269L7.55949 11.6079L9.6 11.8204H9.92405L9.96962 11.6888L9.85823 11.6079L9.77215 11.5269L7.8076 10.1963L5.68101 8.78978L4.56709 7.98027L3.96456 7.57045L3.66076 7.18594L3.52911 6.34607L4.07595 5.74399L4.81013 5.79459L4.99747 5.84518L5.74177 6.4169L7.33165 7.64635L9.4076 9.1743L9.71139 9.42727L9.83291 9.34126L9.8481 9.28055L9.71139 9.05287L8.58228 7.01391L7.37722 4.93954L6.84051 4.07943L6.69873 3.56337C6.6481 3.35087 6.61266 3.17379 6.61266 2.95624L7.23544 2.11131L7.57975 2L8.41013 2.11131L8.75949 2.41487L9.27595 3.59373L10.1114 5.45054L11.4076 7.97521L11.7873 8.72401L11.9899 9.41715L12.0658 9.62965H12.1975V9.50822L12.3038 8.08652L12.5013 6.34101L12.6937 4.09461L12.7595 3.46218L13.0734 2.70326L13.6962 2.29345L14.1823 2.52618L14.5823 3.0979L14.5266 3.46724L14.2886 5.01037L13.8228 7.42879L13.519 9.04781H13.6962L13.8987 8.84543L14.719 7.75765L16.0962 6.03744L16.7038 5.35441L17.4127 4.60056L17.8684 4.24134H18.7291L19.362 5.18239L19.0785 6.15381L18.1924 7.27701L17.4582 8.22818L16.4051 9.64483L15.7468 10.7781L15.8076 10.8692L15.9646 10.854L18.3443 10.3481L19.6304 10.1154L21.1646 9.85226L21.8582 10.1761L21.9342 10.5049L21.6608 11.1778L20.0203 11.5826L18.0962 11.9671L15.2304 12.6451L15.1949 12.6704L15.2354 12.721L16.5266 12.8424L17.0785 12.8728H18.4304L20.9468 13.06L21.6051 13.4951L22 14.0263L21.9342 14.4311L20.9215 14.9471L19.5544 14.6233L16.3646 13.8644L15.2709 13.5912H15.119V13.6823L16.0304 14.5727L17.7013 16.0804L19.7924 18.0233L19.8987 18.5039L19.6304 18.8834L19.3468 18.8429L17.5089 17.4617L16.8 16.8394L15.1949 15.4885H15.0886V15.6302L15.4582 16.1715L17.4127 19.106L17.5139 20.0066L17.3722 20.3L16.8658 20.4771L16.3089 20.3759L15.1646 18.7721L13.9848 16.9658L13.0329 15.3468L12.9165 15.4126L12.3544 21.4586L12.0911 21.7673L11.4835 22L10.9772 21.6155L10.7089 20.9932L10.9772 19.7637L11.3013 18.1599L11.5646 16.8849L11.8025 15.3013L11.9443 14.7751L11.9342 14.7397L11.8177 14.7549L10.6228 16.3941L8.80506 18.848L7.36709 20.386L7.02279 20.5226L6.42532 20.214L6.48101 19.6625L6.81519 19.1718L8.80506 16.642L10.0051 15.0736L10.7797 14.168L10.7747 14.0364H10.7291L5.44304 17.4667L4.50127 17.5882L4.0962 17.2087L4.14684 16.5864L4.33924 16.384L5.92911 15.2912L5.92405 15.2962Z" />
    </svg>
  )
}

export function CodexIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073M13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.143-.08 4.773-2.756a.776.776 0 0 0 .391-.676v-6.738l2.018 1.165a.07.07 0 0 1 .038.052v5.573a4.504 4.504 0 0 1-4.487 4.5M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.774 2.756a.776.776 0 0 0 .78 0l5.83-3.368v2.332a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.485 4.485 0 0 1 2.34-1.972V11.6a.77.77 0 0 0 .387.676l5.829 3.365-2.017 1.165a.076.076 0 0 1-.069.006L4 14.019a4.5 4.5 0 0 1-1.66-6.123M19.42 11.6l-5.829-3.366L15.608 7.07a.076.076 0 0 1 .069-.006l4.812 2.779a4.5 4.5 0 0 1-.69 8.138v-5.677a.79.79 0 0 0-.378-.703m2.009-3.023-.142-.085-4.774-2.756a.776.776 0 0 0-.78 0L9.902 9.1V6.77a.08.08 0 0 1 .03-.061l4.813-2.787a4.5 4.5 0 0 1 6.684 4.655m-12.64 4.135L6.77 11.547a.07.07 0 0 1-.037-.052V5.922a4.5 4.5 0 0 1 7.37-3.463l-.143.08L9.188 5.3a.776.776 0 0 0-.391.676zm1.095-2.362 2.596-1.5 2.596 1.5v2.999l-2.596 1.5-2.596-1.5z" />
    </svg>
  )
}

/* ── Icon family preview ── */

export function IconFamilyPreview({ family }: { family: IconFamily }) {
  if (family === "lucide") {
    return (
      <div className="flex items-center gap-2 text-foreground/40">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m6.343 7.757-2.828-2.829"/><path d="M2 13h4"/><path d="m6.343 18.243-2.828 2.828"/><path d="M12 22v-4"/><path d="m17.657 18.243 2.828 2.828"/><path d="M22 13h-4"/><path d="m17.657 7.757 2.828-2.829"/></svg>
      </div>
    )
  }
  if (family === "phosphor") {
    return (
      <div className="flex items-center gap-2 text-foreground/40">
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M232 120h-40V80a8 8 0 0 0-8-8H40a8 8 0 0 0-8 8v96a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 0-16ZM176 168H48V88h128Z"/></svg>
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm-8-88V80a8 8 0 0 1 16 0v48a8 8 0 0 1-16 0Zm20 36a12 12 0 1 1-12-12 12 12 0 0 1 12 12Z"/></svg>
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H40V56h176Z"/></svg>
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="m218.83 103.77-80-75.48-.14-.13a16 16 0 0 0-21.38 0l-.14.13-80 75.48A16 16 0 0 0 32 115v93a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-40h32v40a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-93a16 16 0 0 0-5.17-11.23Z"/></svg>
      </div>
    )
  }
  if (family === "tabler") {
    return (
      <div className="flex items-center gap-2 text-foreground/40">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l-2 0l9-9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0"/><path d="M21 21l-6-6"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l5 5l-5 5"/><path d="M13 17l6 0"/></svg>
      </div>
    )
  }
  // heroicons
  return (
    <div className="flex items-center gap-2 text-foreground/40">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd"/></svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/></svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.29 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.68-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd"/></svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd"/></svg>
    </div>
  )
}

/* ── Color input — hex field with swatch + react-colorful popover ── */

export function ColorInput({
  label,
  value,
  onChange,
  fallbackColor,
  clearable,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  fallbackColor?: string
  clearable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const isValidHex = (h: string) => /^#[0-9a-fA-F]{6}$/i.test(h)
  const isEmpty = !value || !isValidHex(value)
  const fallbackHex = fallbackColor && isValidHex(fallbackColor) ? fallbackColor.toLowerCase() : "#3b82f6"
  const resolvedHex = isEmpty ? fallbackHex : value.toLowerCase()
  const [draft, setDraft] = useState(isEmpty ? "" : resolvedHex)
  const inputId = `color-${(label || "picker").replace(/\s+/g, "-").toLowerCase()}`

  // Sync when value changes externally
  useEffect(() => {
    if (!value || !isValidHex(value)) {
      setDraft("")
    } else {
      setDraft(value.toLowerCase())
    }
  }, [value])

  const commitHex = useCallback(
    (raw: string) => {
      let hex = raw.trim().toLowerCase()
      if (hex && !hex.startsWith("#")) hex = `#${hex}`
      if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
        setDraft(hex)
        onChange(hex)
      } else {
        setDraft(isEmpty ? "" : resolvedHex)
      }
    },
    [resolvedHex, onChange, isEmpty],
  )

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="text-[11px] text-foreground/55 mb-1 block">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            {/* Color swatch — opens picker popover */}
            <button
              type="button"
              aria-label={`Pick ${label || "color"}`}
              onClick={() => setOpen((v) => !v)}
              className="an-focus-btn absolute top-1/2 left-[7px] -translate-y-1/2 w-[19px] h-[19px] rounded-[3px] overflow-hidden cursor-pointer"
            >
              <div
                className="absolute inset-0 z-[1] opacity-30"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%) 0 0/10px 10px, linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%) 5px 5px/10px 10px",
                }}
              />
              <div
                className="absolute inset-0 z-[2]"
                style={{
                  background: resolvedHex,
                  boxShadow: isEmpty && fallbackColor
                    ? "inset 0 0 0 1.5px rgba(128,128,128,0.4)"
                    : "inset 0 0 0 1px rgba(0,0,0,0.1)",
                }}
              />
            </button>
            {/* Hex text input */}
            <input
              id={inputId}
              type="text"
              value={draft}
              onChange={(e) => {
                const raw = e.target.value
                setDraft(raw)
                let hex = raw.trim().toLowerCase()
                if (hex && !hex.startsWith("#")) hex = `#${hex}`
                if (/^#[0-9a-fA-F]{6}$/.test(hex)) onChange(hex)
              }}
              onBlur={(e) => commitHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitHex(draft)
              }}
              className={`an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 pl-[34px] text-[12px] font-mono text-foreground/70 placeholder:text-foreground/40 ${clearable && !isEmpty ? "pr-8" : "pr-2.5"}`}
              placeholder={fallbackColor ? fallbackHex : "#3b82f6"}
            />
            {/* Clear button */}
            {clearable && !isEmpty && (
              <button
                type="button"
                onClick={() => { onChange(""); setDraft("") }}
                className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 rounded-sm flex items-center justify-center text-foreground/30 hover:text-foreground/60 transition-colors"
                aria-label="Clear override"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.642 3.358a.625.625 0 0 0-.884 0L8 7.116 4.242 3.358a.625.625 0 1 0-.884.884L7.116 8l-3.758 3.758a.625.625 0 0 0 .884.884L8 8.884l3.758 3.758a.625.625 0 1 0 .884-.884L8.884 8l3.758-3.758a.625.625 0 0 0 0-.884" />
                </svg>
              </button>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 overflow-hidden"
          side="bottom"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-1">
            <HexColorPicker color={resolvedHex} onChange={(hex) => { setDraft(hex); onChange(hex) }} style={{ width: "100%" }} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ── Ghost editable value ── */

function GhostValueInput({
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
  label,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  suffix?: string
  label?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const startEditing = () => {
    setDraft(String(value))
    setEditing(true)
    requestAnimationFrame(() => inputRef.current?.select())
  }

  const commit = () => {
    setEditing(false)
    const n = Number(draft)
    if (!isNaN(n)) {
      onChange(Math.min(max, Math.max(min, Math.round(n / step) * step)))
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        aria-label={label ? `${label} value` : "Value"}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9.-]/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") setEditing(false)
        }}
        className="an-focus-input w-10 h-4 text-[10px] font-mono text-foreground/70 text-right bg-foreground/[0.07] border border-foreground/[0.12] rounded px-1"
        autoFocus
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      aria-label={label ? `Edit ${label} value: ${value}${suffix}` : `Edit value: ${value}${suffix}`}
      className="an-focus-btn text-[10px] font-mono text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.07] rounded px-1 -mr-1 h-4 transition-colors cursor-text"
    >
      {value}{suffix}
    </button>
  )
}

/* ── Slider row ── */

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
  suffix = "",
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  displayValue?: string
  suffix?: string
}) {
  const sliderId = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={sliderId} className="text-[11px] text-foreground/55">{label}</label>
        {displayValue !== undefined ? (
          <span className="text-[10px] font-mono text-foreground/50" aria-live="polite">
            {displayValue}
          </span>
        ) : (
          <GhostValueInput
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            suffix={suffix}
            label={label}
          />
        )}
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="an-focus-btn w-full h-1 bg-foreground/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/50 [&::-webkit-slider-thumb]:hover:bg-foreground/70 [&::-webkit-slider-thumb]:transition-colors"
      />
    </div>
  )
}

/* ── Radius input with presets ── */

const RADIUS_PRESETS = [
  { value: 0, label: "none" },
  { value: 2, label: "sm" },
  { value: 4, label: "default" },
  { value: 6, label: "md" },
  { value: 8, label: "lg" },
  { value: 12, label: "xl" },
  { value: 16, label: "2xl" },
  { value: 24, label: "3xl" },
]

export function RadiusInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = `radius-${label.replace(/\s+/g, "-").toLowerCase()}`

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const commit = useCallback(() => {
    const num = parseFloat(inputValue)
    if (isNaN(num)) {
      setInputValue(String(value))
    } else {
      const clamped = Math.max(0, Math.min(9999, num))
      setInputValue(String(clamped))
      onChange(clamped)
    }
  }, [inputValue, value, onChange])

  return (
    <div>
      <label htmlFor={inputId} className="text-[11px] text-foreground/55 mb-1.5 block">{label}</label>
      <Popover open={isOpen} onOpenChange={(open) => { if (!open) { commit(); setIsOpen(false) } }}>
        <PopoverAnchor asChild>
          <div
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-md border bg-foreground/[0.05] cursor-text transition-colors ${
              isOpen ? "border-foreground/20 shadow-[0_0_0_3px_hsl(var(--ring)/0.24)]" : "border-border hover:border-foreground/15"
            }`}
            onClick={(e) => { if (e.target !== inputRef.current) inputRef.current?.focus() }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground" aria-hidden="true">
              <path d="M20 4H13.6C10.2397 4 8.55953 4 7.27606 4.65396C6.14708 5.2292 5.2292 6.14708 4.65396 7.27606C4 8.55953 4 10.2397 4 13.6V20" />
            </svg>
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              inputMode="numeric"
              aria-label={label}
              value={inputValue}
              onChange={(e) => {
                const raw = e.target.value
                setInputValue(raw)
                const num = parseFloat(raw)
                if (!isNaN(num)) onChange(Math.max(0, Math.min(9999, num)))
              }}
              onFocus={() => !isOpen && setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { commit(); setIsOpen(false); inputRef.current?.blur() }
                if (e.key === "Escape") { setInputValue(String(value)); setIsOpen(false); inputRef.current?.blur() }
                if (e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(9999, value + 1)) }
                if (e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(0, value - 1)) }
              }}
              className="flex-1 min-w-0 h-full text-[12px] border-none outline-none bg-transparent text-foreground/70"
            />
            <span className="text-[10px] text-foreground/40 shrink-0" aria-hidden="true">px</span>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 overflow-hidden"
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="py-1 max-h-[200px] overflow-y-auto">
            {RADIUS_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => { onChange(preset.value); setInputValue(String(preset.value)); setIsOpen(false) }}
                className={`${overlayItemBase} ${overlayItemHover} ${overlayItemFocus} an-focus-btn w-[calc(100%-8px)] justify-between text-[11px] text-left ${
                  value === preset.value
                    ? "bg-accent dark:bg-neutral-800 text-foreground font-medium"
                    : "text-foreground/70"
                }`}
              >
                <span>{preset.value}px</span>
                <span className="text-muted-foreground">{preset.label}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ── Simple select dropdown ── */

export function SimpleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; label: string; detail?: string }[]
  onChange: (id: T) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const current = options.find((o) => o.id === value) ?? options[0]

  return (
    <div>
      <label className="text-[11px] text-foreground/55 mb-1.5 block">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full h-8 px-2.5 rounded-md border bg-foreground/[0.05] text-[12px] transition-colors ${
            isOpen ? "border-foreground/20 shadow-[0_0_0_3px_hsl(var(--ring)/0.24)]" : "border-border hover:border-foreground/15"
          }`}
        >
          <span className="text-foreground/70">{current.label}</span>
          {current.detail && <span className="text-muted-foreground">{current.detail}</span>}
        </button>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className={`absolute left-0 right-0 top-full mt-1 z-50 dark ${overlayContentBase} py-1`}
              >
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { onChange(opt.id); setIsOpen(false) }}
                    className={`${overlayItemBase} ${overlayItemHover} w-[calc(100%-8px)] justify-between text-[11px] text-left outline-none ${
                      value === opt.id ? "bg-accent dark:bg-neutral-800 text-foreground" : "text-foreground/70"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.detail && <span className="text-muted-foreground">{opt.detail}</span>}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
