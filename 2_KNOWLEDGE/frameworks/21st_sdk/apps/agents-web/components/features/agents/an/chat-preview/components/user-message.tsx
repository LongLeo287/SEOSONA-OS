"use client"

import { motion } from "motion/react"
import type { TimelineStep } from "../types/timeline"
import type { VisualConfig } from "../types/theme"
import { ImageThumb } from "./image-thumb"

const TEXT_SIZES = { sm: "13px", md: "14px", lg: "15px" } as const

// WCAG relative luminance from sRGB hex
function luminance(hex: string): number {
  const c = hex.replace("#", "")
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

// Returns contrasting text color for a given background hex
function contrastText(bg: string): string {
  if (!bg || !/^#[0-9a-fA-F]{6}$/.test(bg)) return "inherit"
  // WCAG contrast ratio threshold: use white text on dark bg, dark on light
  return luminance(bg) > 0.179 ? "#1a1a1a" : "#ffffff"
}

export function UserMessage({
  step,
  onComplete,
  vc,
}: {
  step: Extract<TimelineStep, { type: "user-message" }>
  onComplete: () => void
  vc: VisualConfig
}) {
  const textSize = TEXT_SIZES[vc.textSizeScale]
  const bubbleBg = vc.userMessageBg || ""
  const bubbleTextColor = bubbleBg ? contrastText(bubbleBg) : undefined
  if (vc.messageBubbleStyle === "bubble-right") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onAnimationComplete={onComplete}
        className="flex flex-col items-end gap-1 pb-2"
      >
        {step.image && (
          <div
            className="max-w-[200px] p-1.5 bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12)]"
            style={{ borderRadius: vc.messageBorderRadius }}
          >
            <img
              src={step.image}
              alt="attachment"
              className="block object-cover max-w-[184px] max-h-[120px]"
              style={{ borderRadius: `calc(${vc.messageBorderRadius} - 4px)` }}
            />
          </div>
        )}
        <div style={{ maxWidth: "calc(95% - 40px)", marginInlineStart: 70 }}>
          <div
            className={`px-3.5 py-1.5 transition-colors ${!bubbleBg ? "bg-muted" : ""}`}
            style={{
              borderRadius: vc.messageBorderRadius,
              ...(bubbleBg && { background: bubbleBg }),
              ...(bubbleTextColor && { color: bubbleTextColor }),
              boxShadow: vc.messageShadow ? "0 4px 12px rgba(0,0,0,0.08)" : undefined,
            }}
          >
            <p className="leading-5 whitespace-pre-wrap break-words" style={{ fontSize: textSize }}>
              {step.content}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // full-width (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={onComplete}
      className="w-full border border-border bg-background px-3 py-2"
      style={{
        borderRadius: vc.messageBorderRadius,
        boxShadow: vc.messageShadow ? "0 4px 12px rgba(0,0,0,0.08)" : undefined,
      }}
    >
      {step.image && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          <ImageThumb src={step.image} />
        </div>
      )}
      <p className={`leading-relaxed ${vc.textContrast === "high" ? "text-foreground/90" : "text-foreground/70"}`} style={{ fontSize: textSize }}>
        {step.content}
      </p>
    </motion.div>
  )
}
