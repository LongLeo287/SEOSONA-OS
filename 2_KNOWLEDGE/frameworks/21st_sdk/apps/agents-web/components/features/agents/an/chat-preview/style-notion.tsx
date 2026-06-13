"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TextShimmer } from "@/components/ui/text-shimmer"
import type { TimelineStep, StepState, ChatPreviewConfig } from "./types"
import { notionChatTimeline } from "./types"
import {
  useAnimationTimeline,
  useStreamingText,
  useInputTyping,
  useToolComplete,
  useContainerHeight,
  groupIntoTurns,
} from "./hooks"
import { ReplayButton, StreamingMarkdown } from "./shared"
/* ── Icons ── */

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/30">
      <path d="M8 1.385c-2.23 0-4.035 1.793-4.035 3.985 0 .782.193 1.525.56 2.147.09.161.181.312.281.473.454.725.86 1.386.86 2.08a.63.63 0 0 0 .624.625.63.63 0 0 0 .625-.625c.01-1.064-.553-1.972-1.041-2.75l-.27-.448a3 3 0 0 1-.389-1.512C5.215 3.853 6.46 2.625 8 2.625s2.785 1.228 2.785 2.735c0 .558-.137 1.084-.39 1.512l-.269.449-.01.016c-.475.773-1.03 1.675-1.03 2.723a.63.63 0 0 0 .55.62v.015h.074a.63.63 0 0 0 .625-.625c0-.684.406-1.355.859-2.08v-.002l.001-.001q.067-.117.139-.233t.141-.237c.367-.622.56-1.365.56-2.147 0-2.202-1.815-3.985-4.035-3.985m-1.6 10.19a.63.63 0 0 0-.625.625.63.63 0 0 0 .625.625h3.2a.63.63 0 0 0 .625-.625.63.63 0 0 0-.625-.625zm.8 1.8a.63.63 0 0 0-.625.625.63.63 0 0 0 .625.625h1.6A.63.63 0 0 0 9.425 14a.63.63 0 0 0-.625-.625z" />
    </svg>
  )
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="shrink-0 text-foreground/20 transition-transform duration-150"
      style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/30">
      <path d="M7.1 1.975a5.125 5.125 0 1 0 3.155 9.164l3.107 3.107a.625.625 0 1 0 .884-.884l-3.107-3.107A5.125 5.125 0 0 0 7.1 1.975M3.225 7.1a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 animate-spin text-foreground/30">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  )
}

/* ── Sub-components ── */

function NotionDateDivider() {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="text-[12px] leading-4 font-medium text-foreground/25 select-none">
        Today
      </span>
    </div>
  )
}

function NotionUserMessage({
  step,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "user-message" }>
  onComplete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={onComplete}
      className="flex flex-col items-end gap-1 pb-2"
    >
      {step.image && (
        <div className="max-w-[200px] rounded-xl p-1.5 bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12)]">
          <img
            src={step.image}
            alt="attachment"
            className="block object-cover rounded-md max-w-[184px] max-h-[120px]"
          />
        </div>
      )}
      <div style={{ maxWidth: "calc(95% - 40px)", marginInlineStart: 70 }}>
        <div className="rounded-2xl bg-foreground/[0.06] px-3.5 py-1.5 transition-colors">
          <p className="text-[14px] leading-5 text-foreground/80 whitespace-pre-wrap break-words">
            {step.content}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Tool timer (hidden, just runs the timeout) ── */

function NotionToolTimer({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  return null
}

/* ── Thinking row: lightbulb + "Thinking…" shimmer, then fades out ── */

function NotionThinkingRow({
  step,
  state,
  onComplete,
  showIcon = true,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon?: boolean
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const [expanded, setExpanded] = useState(false)
  const isAnimating = state === "animating"
  const isComplete = state === "complete"

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-1"
    >
      {/* Toggle header */}
      <div
        className="flex items-center gap-2 rounded-md px-0.5 py-1 w-fit select-none"
        style={{ cursor: isComplete ? "pointer" : "default" }}
        onClick={() => { if (isComplete) setExpanded((v) => !v) }}
      >
        {showIcon && (
          <div className="flex items-center justify-center w-6 h-4">
            <LightbulbIcon />
          </div>
        )}
        <div className="flex items-center gap-1 text-[14px] leading-5 text-foreground/40">
          {isAnimating ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">
              Thinking…
            </TextShimmer>
          ) : (
            <span>Thought</span>
          )}
        </div>
        {isComplete && <ChevronIcon expanded={expanded} />}
      </div>

      {/* Expanded thought content */}
      <AnimatePresence>
        {expanded && isComplete && step.thoughtContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-8 pr-1 max-h-[175px] overflow-y-auto">
              <p className="text-[14px] leading-5 text-foreground/40">
                {step.thoughtContent}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Action row: spinner + "Brewing…" / "Crafting…" shimmer, then done label ── */

const ACTION_LABELS = ["Brewing…", "Crafting…", "Working…", "Preparing…"]

function NotionActionRow({
  step,
  state,
  onComplete,
  index,
  showIcon = true,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  index: number
  showIcon?: boolean
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isAnimating = state === "animating"
  const label = ACTION_LABELS[index % ACTION_LABELS.length]!

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-0.5 py-1"
    >
      {showIcon && (
        <div className="flex items-center justify-center w-6 h-4">
          {isAnimating ? <SpinnerIcon /> : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/25">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0" />
            </svg>
          )}
        </div>
      )}
      <div className="text-[14px] leading-5 text-foreground/40">
        {isAnimating ? (
          <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">
            {label}
          </TextShimmer>
        ) : (
          <span>{step.toolName}</span>
        )}
      </div>
    </motion.div>
  )
}

/* ── Source type icons — all use viewBox="0 0 24 24" for consistent sizing ── */

function SourceIconGoogle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

function SourceIconBooking({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z" />
    </svg>
  )
}

function SourceIconTripadvisor({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z" />
    </svg>
  )
}

function SourceIconExpedia({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337z" />
      <path d="M19.457 17.855l-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z" />
    </svg>
  )
}

function SourceIconAirbnb({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
    </svg>
  )
}

function SourceIconGitHub({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function SourceIconStackOverflow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h14.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.936v.014zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.35 1.617-.01.001zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.749 0h.002z" />
    </svg>
  )
}

function SourceIconArXiv({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M3.516 3.516L12 12l-8.484 8.484L12 12z" />
      <path d="M20.484 3.516L12 12l8.484 8.484L12 12z" opacity="0.6" />
    </svg>
  )
}

function SourceIconScholar({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
    </svg>
  )
}

function SourceIconStripe({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  )
}

function SourceIconZendesk({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M11.089 0v17.462L0 24V6.538c0-3.613 2.953-6.538 6.545-6.538zm1.822 6.538L24 0v17.462c0 3.613-2.953 6.538-6.544 6.538H12.91z" />
    </svg>
  )
}

type SourceType = "google" | "booking" | "tripadvisor" | "expedia" | "airbnb" | "github" | "stackoverflow" | "arxiv" | "scholar" | "stripe" | "zendesk"

function SourceIcon({ source, size = 14 }: { source: SourceType; size?: number }) {
  switch (source) {
    case "google": return <SourceIconGoogle size={size} />
    case "booking": return <SourceIconBooking size={size} />
    case "tripadvisor": return <SourceIconTripadvisor size={size} />
    case "expedia": return <SourceIconExpedia size={size} />
    case "airbnb": return <SourceIconAirbnb size={size} />
    case "github": return <SourceIconGitHub size={size} />
    case "stackoverflow": return <SourceIconStackOverflow size={size} />
    case "arxiv": return <SourceIconArXiv size={size} />
    case "scholar": return <SourceIconScholar size={size} />
    case "stripe": return <SourceIconStripe size={size} />
    case "zendesk": return <SourceIconZendesk size={size} />
  }
}

/* ── Search results data per source context ── */

type SearchResult = {
  source: SourceType
  title: string
  date: string
}

type SearchResultSet = {
  results: SearchResult[]
  tabs: { source: SourceType; label: string; count: number }[]
}

const SEARCH_RESULT_SETS: Record<string, SearchResultSet> = {
  // Default travel timeline (fallback)
  "default-1": {
    results: [
      { source: "google", title: "United UA837 SFO\u2192NRT \u00b7 $1,105 economy", date: "google.com/flights" },
      { source: "expedia", title: "SFO\u2013Tokyo \u00b7 14 results from $1,089", date: "expedia.com" },
      { source: "google", title: "ANA NH7 Direct SFO\u2192NRT \u00b7 $1,240 rt", date: "google.com/flights" },
      { source: "expedia", title: "JAL JL1 SFO\u2192HND \u00b7 $1,180 economy", date: "expedia.com" },
      { source: "google", title: "Cheapest: $1,089 \u00b7 Zipair nonstop", date: "google.com/flights" },
    ],
    tabs: [
      { source: "google", label: "Google", count: 5 },
      { source: "expedia", label: "Expedia", count: 4 },
    ],
  },
  "default-2": {
    results: [
      { source: "booking", title: "Shinjuku Granbell \u00b7 4.2\u2605 \u00b7 \u00a518,500/nt", date: "booking.com" },
      { source: "tripadvisor", title: "Granbell Hotel Reviews \u2014 1,847 ratings", date: "tripadvisor.com" },
      { source: "airbnb", title: "Shinjuku loft \u00b7 Superhost \u00b7 $95/nt", date: "airbnb.com" },
      { source: "booking", title: "Granbell Shinjuku \u2014 Available Mar 15-22", date: "booking.com" },
      { source: "tripadvisor", title: "Top 10 Shinjuku Hotels \u00b7 2025 Picks", date: "tripadvisor.com" },
    ],
    tabs: [
      { source: "booking", label: "Booking", count: 4 },
      { source: "tripadvisor", label: "Tripadvisor", count: 3 },
      { source: "airbnb", label: "Airbnb", count: 2 },
    ],
  },
  // Support use case
  zendesk: {
    results: [
      { source: "zendesk", title: "Account: sarah.chen@acme.co \u00b7 Business plan", date: "internal CRM" },
      { source: "stripe", title: "sub_1N8k2m \u00b7 $49/mo \u00b7 active since Oct 2024", date: "stripe.com" },
      { source: "zendesk", title: "Workspace ws_8k2m9 \u00b7 12 users \u00b7 migrated Nov 3", date: "internal CRM" },
      { source: "zendesk", title: "Feature flags: data_export=false, api_access=true", date: "internal CRM" },
      { source: "stripe", title: "Business plan entitlements \u00b7 data_export included", date: "stripe.com" },
    ],
    tabs: [
      { source: "zendesk", label: "Zendesk", count: 3 },
      { source: "stripe", label: "Stripe", count: 2 },
    ],
  },
  stripe: {
    results: [
      { source: "stripe", title: "sub_1N8k2m \u00b7 Business ($49/mo) \u00b7 active", date: "stripe.com" },
      { source: "stripe", title: "Entitlements: export, api, analytics, sso", date: "stripe.com" },
      { source: "zendesk", title: "Migration log: ws_8k2m9 \u00b7 legacy\u2192business \u00b7 Nov 3", date: "internal CRM" },
      { source: "zendesk", title: "Bug: migration script skipped feature flags", date: "internal CRM" },
    ],
    tabs: [
      { source: "stripe", label: "Stripe", count: 2 },
      { source: "zendesk", label: "Zendesk", count: 2 },
    ],
  },
  // Code use case
  github: {
    results: [
      { source: "github", title: "src/routes/messages.ts \u00b7 Express router, 4 middleware", date: "github.com" },
      { source: "github", title: "package.json \u00b7 ioredis@5.3, express@4.18", date: "github.com" },
      { source: "github", title: "src/middleware/ \u00b7 auth.ts, validate.ts, cors.ts", date: "github.com" },
      { source: "stackoverflow", title: "Redis sliding window rate limiting \u00b7 847 votes", date: "stackoverflow.com" },
      { source: "github", title: "jest.config.ts \u00b7 ts-jest, coverage 80%", date: "github.com" },
    ],
    tabs: [
      { source: "github", label: "GitHub", count: 4 },
      { source: "stackoverflow", label: "SO", count: 1 },
    ],
  },
  // Research use case
  arxiv: {
    results: [
      { source: "arxiv", title: "Quantum error correction below threshold \u00b7 Acharya 2024", date: "arxiv.org" },
      { source: "arxiv", title: "Interferometric parity measurement \u00b7 Aghaee 2025", date: "arxiv.org" },
      { source: "scholar", title: "Utility of quantum computing \u00b7 Kim et al \u00b7 567 cites", date: "scholar.google.com" },
      { source: "arxiv", title: "Surface codes with superconducting qubits \u00b7 review", date: "arxiv.org" },
      { source: "scholar", title: "Topological quantum error correction \u00b7 survey 2024", date: "scholar.google.com" },
    ],
    tabs: [
      { source: "arxiv", label: "arXiv", count: 3 },
      { source: "scholar", label: "Scholar", count: 2 },
    ],
  },
  scholar: {
    results: [
      { source: "scholar", title: "Acharya et al 2024 \u00b7 Nature \u00b7 342 citations", date: "scholar.google.com" },
      { source: "scholar", title: "Aghaee et al 2025 \u00b7 Nature \u00b7 89 citations", date: "scholar.google.com" },
      { source: "scholar", title: "Kim et al 2024 \u00b7 Nature \u00b7 567 citations", date: "scholar.google.com" },
      { source: "arxiv", title: "2408.13687 \u00b7 open-access \u00b7 companion blog post", date: "arxiv.org" },
    ],
    tabs: [
      { source: "scholar", label: "Scholar", count: 3 },
      { source: "arxiv", label: "arXiv", count: 1 },
    ],
  },
}

/* ── Search group: groups all search tool-calls under one toggle ── */

function NotionSearchGroup({
  toolSteps,
  stepStates,
  onStepComplete,
  showIcon = true,
}: {
  toolSteps: Extract<TimelineStep, { type: "tool-call" }>[]
  stepStates: Record<string, StepState>
  onStepComplete: (id: string) => void
  showIcon?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const anyAnimating = toolSteps.some((s) => stepStates[s.id] === "animating")
  const allComplete = toolSteps.every((s) => stepStates[s.id] === "complete")

  // Pick search query from the first step that has one
  const searchQuery = toolSteps.find((s) => s.searchQuery)?.searchQuery ?? "searching…"

  // Look up results by searchSource, fallback to id-based routing for default travel timeline
  const { results, sourceTabs } = useMemo(() => {
    const firstSource = toolSteps.find((s) => s.searchSource)?.searchSource
    if (firstSource && SEARCH_RESULT_SETS[firstSource]) {
      const set = SEARCH_RESULT_SETS[firstSource]!
      return { results: set.results, sourceTabs: set.tabs }
    }
    // Fallback: legacy id-based routing for the default travel timeline
    const isFirstGroup = (toolSteps[0]?.id ?? "").includes("1")
    const set = SEARCH_RESULT_SETS[isFirstGroup ? "default-1" : "default-2"]!
    return { results: set.results, sourceTabs: set.tabs }
  }, [toolSteps])

  const totalResults = results.length

  // Unique source types present in this group (for header icons)
  const headerSources = useMemo(() => {
    const unique = new Set<SourceType>()
    for (const r of results) unique.add(r.source)
    return Array.from(unique)
  }, [results])

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-1"
    >
      {/* Hidden tool timers */}
      {toolSteps.map((s) => (
        <NotionToolTimer
          key={s.id}
          step={s}
          state={stepStates[s.id]!}
          onComplete={() => onStepComplete(s.id)}
        />
      ))}

      {/* Toggle header */}
      <div
        className="flex items-center gap-2 rounded-md px-0.5 py-1 w-fit max-w-full select-none"
        style={{ cursor: allComplete ? "pointer" : "default" }}
        onClick={() => { if (allComplete) setExpanded((v) => !v) }}
      >
        {showIcon && (
          <div className="flex items-center justify-center w-6 h-4 shrink-0">
            <SearchIcon />
          </div>
        )}
        <div className="flex items-center gap-1 min-w-0 text-[14px] leading-5 text-foreground/40">
          {anyAnimating ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">
              Searching…
            </TextShimmer>
          ) : allComplete ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="truncate">Found {totalResults} results</span>
              <div className="flex items-center gap-0.5 shrink-0 text-foreground/25">
                {headerSources.map((src) => (
                  <SourceIcon key={src} source={src} size={14} />
                ))}
              </div>
            </div>
          ) : (
            <span>Search</span>
          )}
        </div>
        {allComplete && <ChevronIcon expanded={expanded} />}
      </div>

      {/* Expanded results panel — user toggles */}
      <AnimatePresence>
        {expanded && allComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-[10px] overflow-hidden bg-muted border border-foreground/[0.08]">
              {/* "Searched for" query */}
              <div className="px-3.5 pt-3 pb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[14px] leading-5 text-foreground/40 shrink-0">Searched for</span>
                  <span className="text-[14px] leading-5 text-foreground/25 truncate min-w-0">&ldquo;{searchQuery}&rdquo;</span>
                </div>
              </div>

              {/* Source tabs */}
              <div className="flex items-center gap-0.5 px-2 py-2 overflow-x-auto">
                {sourceTabs.map((tab, i) => (
                  <div
                    key={tab.source}
                    className="inline-flex items-center gap-1 sm:gap-1.5 h-7 px-2 sm:px-3 rounded-full text-[12px] sm:text-[14px] leading-5 shrink-0"
                    style={{ background: i === 0 ? "rgba(128,128,128,0.1)" : "transparent" }}
                  >
                    <span className="text-muted-foreground"><SourceIcon source={tab.source} size={16} /></span>
                    <span className={i === 0 ? "text-foreground/60" : "text-foreground/35"}>{tab.label}</span>
                    <span className="text-[12px] leading-4 font-medium text-foreground/20">{tab.count}</span>
                  </div>
                ))}
              </div>

              {/* Scrollable results list */}
              <div className="max-h-[200px] overflow-y-auto">
                <div className="flex flex-col gap-px p-1">
                  {results.map((result, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1 min-h-[28px] rounded-md">
                      <div className="flex items-center justify-center w-5 h-5 shrink-0 text-foreground/25">
                        <SourceIcon source={result.source} size={16} />
                      </div>
                      <span className="text-[14px] leading-5 text-foreground/60 truncate flex-1 min-w-0">
                        {result.title}
                      </span>
                      <span className="text-[12px] leading-4 text-foreground/20 shrink-0 whitespace-nowrap">
                        {result.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Assistant stream ── */

function NotionAssistantStream({
  step,
  onComplete,
  onUpdate,
}: {
  step: Extract<TimelineStep, { type: "assistant-stream" }>
  onComplete: () => void
  onUpdate: () => void
}) {
  const { displayedText } = useStreamingText(step.content, {
    delayBefore: 300,
    wordInterval: 25,
    onComplete,
    onUpdate,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="px-0.5 py-1"
    >
      <StreamingMarkdown
        content={displayedText}
        className="text-[14px] leading-5 text-foreground/70 [&_p]:leading-5"
      />
    </motion.div>
  )
}

/* ── Input bar ── */

function NotionModelPopover({
  models,
  activeModelId,
}: {
  models: { id: string; name: string; version?: string }[]
  activeModelId?: string
}) {
  const [open, setOpen] = useState(false)

  const activeModel = models.find((m) => m.id === activeModelId) ?? models[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-7 px-3 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors"
      >
        <span className="text-[14px] leading-5 font-medium text-foreground/40">
          {activeModel?.name ?? "Auto"}
          {activeModel?.version && <span className="text-foreground/25 ml-1">{activeModel.version}</span>}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-40">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 z-50 w-[200px] rounded-[10px] bg-popover border border-foreground/[0.08] shadow-lg overflow-hidden"
            >
              <div className="p-1 flex flex-col gap-px">
                {models.map((model) => {
                  const isActive = model.id === activeModelId
                  return (
                    <div
                      key={model.id}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[14px] leading-5 cursor-pointer transition-colors ${
                        isActive ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]"
                      }`}
                    >
                      <span className="text-foreground/60 flex-1">
                        {model.name}
                        {model.version && <span className="text-foreground/25 ml-1">{model.version}</span>}
                      </span>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/50">
                          <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Notion settings popover (sliders icon) ── */

function NotionSettingsPopover({
  previewConfig,
}: {
  previewConfig?: ChatPreviewConfig
}) {
  const [open, setOpen] = useState(false)
  const modes = previewConfig?.availableModes ?? ["agent"]
  const defaultMode = previewConfig?.defaultMode ?? "agent"
  const showModes = modes.length > 0

  // "Can make changes" defaults based on mode, toggleable
  const [canMakeChanges, setCanMakeChanges] = useState(defaultMode !== "plan")
  // "Web search" is decorative but ON by default
  const [webSearch, setWebSearch] = useState(true)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
          <path d="M3 7.375h6.829a2.501 2.501 0 0 0 4.842 0H17a.625.625 0 1 0 0-1.25h-2.329a2.501 2.501 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25M12.25 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5" />
          <path fillRule="evenodd" d="M7.75 15.75a2.5 2.5 0 0 0 2.421-1.875H17a.625.625 0 1 0 0-1.25h-6.829a2.5 2.5 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25h2.329A2.5 2.5 0 0 0 7.75 15.75m0-1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" clipRule="evenodd" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 mb-2 z-50 w-[220px] rounded-[10px] bg-popover border border-foreground/[0.08] shadow-lg overflow-hidden"
            >
              {/* Top section */}
              <div className="p-1 flex flex-col gap-px">
                {/* Web search toggle */}
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer"
                  onClick={() => setWebSearch(!webSearch)}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-foreground/40">
                    <path d="M10 2.375a7.625 7.625 0 1 1 0 15.25 7.625 7.625 0 0 1 0-15.25m-1.863 8.25c.054 1.559.31 2.937.681 3.943.212.572.449.992.68 1.256.232.266.404.318.502.318s.27-.052.502-.318c.231-.264.468-.684.68-1.256.371-1.006.627-2.384.681-3.943zm-4.48 0a6.38 6.38 0 0 0 4.509 5.48 6.5 6.5 0 0 1-.52-1.104c-.431-1.167-.704-2.697-.76-4.376zm9.456 0c-.055 1.679-.327 3.21-.758 4.376-.15.405-.324.779-.522 1.104a6.38 6.38 0 0 0 4.51-5.48zM8.166 3.894a6.38 6.38 0 0 0-4.51 5.481h3.23c.056-1.679.328-3.21.76-4.376.15-.405.322-.78.52-1.105M10 3.858c-.099 0-.27.053-.502.319-.231.264-.468.683-.68 1.255-.371 1.006-.627 2.384-.681 3.943h3.726c-.054-1.559-.31-2.937-.681-3.943-.212-.572-.449-.99-.68-1.255-.232-.266-.404-.319-.502-.319m1.833.036c.198.326.372.7.521 1.105.432 1.167.704 2.697.76 4.376h3.23a6.38 6.38 0 0 0-4.511-5.481" />
                  </svg>
                  <span className="text-[13px] text-foreground/60 flex-1">Web search</span>
                  <NotionToggle checked={webSearch} />
                </div>
              </div>

              {/* Divider + bottom section */}
              {showModes && (
                <>
                  <div className="mx-3 h-px bg-foreground/[0.06]" />
                  <div className="p-1 flex flex-col gap-px">
                    {/* Can make changes — maps to agent vs plan mode */}
                    <div
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer"
                      onClick={() => setCanMakeChanges(!canMakeChanges)}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-foreground/40">
                        <path d="m13.987 5.682-.684.684-1.288-1.288.692-.691a.91.91 0 0 1 1.28 0c.35.35.35.93 0 1.28zm-9.433 9.433 7.914-7.914-1.289-1.289-7.92 7.908c-.122.122-.214.29-.274.457l-.336 1.082c-.06.229.153.442.366.366l1.082-.335q.252-.07.457-.275m12.446.76H5.61l1.25-1.25H17a.625.625 0 1 1 0 1.25" />
                      </svg>
                      <span className="text-[13px] text-foreground/60 flex-1">Can make changes</span>
                      <NotionToggle checked={canMakeChanges} />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Tiny Notion-style toggle ── */

function NotionToggle({ checked }: { checked: boolean }) {
  return (
    <div
      className="relative shrink-0 box-content h-[14px] w-[26px] rounded-full p-[2px] transition-colors duration-200"
      style={{ background: checked ? "rgb(35 131 226)" : "rgba(128,128,128,0.2)" }}
    >
      <div
        className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(12px)" : "translateX(0px)" }}
      />
    </div>
  )
}

function NotionInputBar({
  activeInputStep,
  onStepComplete,
  isStreaming,
  previewConfig,
}: {
  activeInputStep: Extract<TimelineStep, { type: "input-typing" }> | null
  onStepComplete: (id: string) => void
  isStreaming: boolean
  previewConfig?: ChatPreviewConfig
}) {
  const { displayedText, showImage } = useInputTyping(
    activeInputStep?.content ?? "",
    activeInputStep?.duration ?? 0,
    !!activeInputStep,
    () => activeInputStep && onStepComplete(activeInputStep.id),
  )
  const hasImage = activeInputStep?.image
  const isTyping = !!activeInputStep
  const showAttach = previewConfig?.attachmentsEnabled !== false
  const showModelSelector = (previewConfig?.allowedModels?.length ?? 0) > 1

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="max-w-[420px] mx-auto rounded-2xl bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12),0_1px_3px_rgba(0,0,0,0.1)]">
        <AnimatePresence>
          {hasImage && showImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="px-3 pt-3 pb-0">
                <div className="relative w-16 h-16 rounded-[10px] overflow-hidden shadow-[0_0_0_1px_rgba(128,128,128,0.12)] shrink-0">
                  <img
                    src={activeInputStep.image!}
                    alt="attachment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="white" className="opacity-80">
                      <path d="M12.642 3.358a.625.625 0 0 0-.884 0L8 7.116 4.242 3.358a.625.625 0 1 0-.884.884L7.116 8l-3.758 3.758a.625.625 0 0 0 .884.884L8 8.884l3.758 3.758a.625.625 0 1 0 .884-.884L8.884 8l3.758-3.758a.625.625 0 0 0 0-.884" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-3.5 pt-3 pb-0 min-h-[56px] text-[14px] leading-5">
          {isTyping && displayedText ? (
            <span className="text-foreground/70">
              {displayedText}
              <motion.span
                className="inline-block w-[1.5px] h-[1em] bg-foreground/50 ml-px align-text-bottom"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.53, repeat: Infinity }}
              />
            </span>
          ) : (
            <span className="text-foreground/20">Do anything with AI…</span>
          )}
        </div>

        <div className="flex items-center justify-between px-2 py-2 gap-3">
          <div className="flex items-center gap-1">
            {showAttach && (
              <div className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
                  <path d="M10 3.59a.66.66 0 0 1 .66.66v5.09h5.09a.66.66 0 0 1 0 1.32h-5.09v5.09a.66.66 0 0 1-1.32 0v-5.09H4.25a.66.66 0 0 1 0-1.32h5.09V4.25a.66.66 0 0 1 .66-.66" />
                </svg>
              </div>
            )}
            <NotionSettingsPopover previewConfig={previewConfig} />
          </div>
          <div className="flex items-center gap-1">
            {showModelSelector && (
              <NotionModelPopover
                models={previewConfig!.allowedModels!}
                activeModelId={previewConfig!.activeModelId}
              />
            )}
            {isStreaming ? (
              /* Stop button — foreground circle with inverted stop square */
              <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-background">
                  <path d="M11.75 3h-7.5C3.56 3 3 3.56 3 4.25v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-7.5C13 3.56 12.44 3 11.75 3" />
                </svg>
              </div>
            ) : (
              /* Send button — disabled when idle, blue when typing */
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center"
                style={{
                  opacity: isTyping ? 1 : 0.4,
                  background: isTyping ? "rgb(59 130 246)" : "rgba(128,128,128,0.06)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill={isTyping ? "white" : "currentColor"} className={isTyping ? "" : "text-foreground/30"}>
                  <path d="M8.53 2.22a.75.75 0 0 0-1.06 0L3.15 6.54A.75.75 0 0 0 4.21 7.6l3.04-3.04v8.737c0 .388.336.703.75.703s.75-.315.75-.703V4.56l3.04 3.04a.75.75 0 0 0 1.06-1.061z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */

export function PreviewAgentChatNotion({ paused, timeline, previewConfig }: { paused?: boolean; timeline?: TimelineStep[]; previewConfig?: ChatPreviewConfig }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep } = useAnimationTimeline(timeline ?? notionChatTimeline, { paused })
  const scrollElRef = useRef<HTMLDivElement | null>(null)
  const setContainerHeight = useContainerHeight()
  const showToolIcons = previewConfig?.showToolIcons !== false

  const scrollRefCallback = useCallback((el: HTMLDivElement | null) => {
    scrollElRef.current = el
    setContainerHeight(el)
  }, [setContainerHeight])

  const scrollToBottom = useCallback(() => {
    if (scrollElRef.current) {
      scrollElRef.current.scrollTo({ top: scrollElRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [visibleSteps.length, scrollToBottom])

  const turns = useMemo(() => groupIntoTurns(visibleSteps), [visibleSteps])

  // Group consecutive tool-calls by variant within a turn
  const renderTurnTools = useCallback((turn: ReturnType<typeof groupIntoTurns>[0], turnIndex: number) => {
    const elements: React.ReactNode[] = []
    let actionIndex = 0

    // Collect consecutive search tool-calls into groups
    let i = 0
    const steps = turn.steps
    while (i < steps.length) {
      const step = steps[i]!
      if (step.type !== "tool-call") {
        i++
        continue
      }

      const tc = step as Extract<TimelineStep, { type: "tool-call" }>

      if (tc.toolVariant === "thinking") {
        elements.push(
          <NotionThinkingRow
            key={tc.id}
            step={tc}
            state={stepStates[tc.id]!}
            onComplete={() => onStepComplete(tc.id)}
            showIcon={showToolIcons}
          />,
        )
        i++
      } else if (tc.toolVariant === "action" || !tc.toolVariant) {
        elements.push(
          <NotionActionRow
            key={tc.id}
            step={tc}
            state={stepStates[tc.id]!}
            onComplete={() => onStepComplete(tc.id)}
            index={actionIndex++}
            showIcon={showToolIcons}
          />,
        )
        i++
      } else if (tc.toolVariant === "search") {
        // Gather consecutive search steps
        const searchGroup: Extract<TimelineStep, { type: "tool-call" }>[] = []
        while (i < steps.length) {
          const s = steps[i]!
          if (s.type === "tool-call" && (s as Extract<TimelineStep, { type: "tool-call" }>).toolVariant === "search") {
            searchGroup.push(s as Extract<TimelineStep, { type: "tool-call" }>)
            i++
          } else {
            break
          }
        }
        elements.push(
          <NotionSearchGroup
            key={`search-${turnIndex}-${searchGroup[0]!.id}`}
            toolSteps={searchGroup}
            stepStates={stepStates}
            onStepComplete={onStepComplete}
            showIcon={showToolIcons}
          />,
        )
      } else {
        i++
      }
    }

    return elements
  }, [stepStates, onStepComplete, showToolIcons])

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRefCallback} className="flex-1 overflow-y-auto">
        <div className="max-w-[420px] mx-auto px-4 py-2">
          <NotionDateDivider />

          <div className="space-y-1 pb-4">
            {turns.map((turn, turnIndex) => {
              const isLastTurn = turnIndex === turns.length - 1
              const toolElements = renderTurnTools(turn, turnIndex)

              return (
                <div
                  key={turn.userStep?.id ?? `turn-${turnIndex}`}
                  className="relative"
                  style={isLastTurn ? { minHeight: "calc(var(--chat-container-height, 0px) - 32px)" } : undefined}
                >
                  {/* User message */}
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "user-message" }> => s.type === "user-message")
                    .map((step) => (
                      <NotionUserMessage
                        key={step.id}
                        step={step}
                        onComplete={() => onStepComplete(step.id)}
                      />
                    ))}
                  {/* Tool groups (thinking → action → search) */}
                  {toolElements}
                  {/* Assistant stream */}
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "assistant-stream" }> => s.type === "assistant-stream")
                    .map((step) => (
                      <NotionAssistantStream
                        key={step.id}
                        step={step}
                        onComplete={() => onStepComplete(step.id)}
                        onUpdate={scrollToBottom}
                      />
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>

      <NotionInputBar
        activeInputStep={activeInputStep}
        onStepComplete={onStepComplete}
        isStreaming={!isComplete && !activeInputStep && visibleSteps.length > 0}
        previewConfig={previewConfig}
      />
    </div>
  )
}
