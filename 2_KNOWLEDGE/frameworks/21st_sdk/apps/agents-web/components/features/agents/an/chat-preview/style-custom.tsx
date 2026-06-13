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
import { ReplayButton, StreamingMarkdown, ImageThumb, PaperclipIcon } from "./shared"

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

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 animate-spin text-foreground/30">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

/* ── User message — configurable full-width vs bubble ── */

function CustomUserMessage({
  step,
  onComplete,
  config,
}: {
  step: Extract<TimelineStep, { type: "user-message" }>
  onComplete: () => void
  config?: ChatPreviewConfig
}) {
  const fullWidth = config?.fullWidthMessages
  const borderRadius = config?.borderRadius ?? "12px"

  if (fullWidth) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onAnimationComplete={onComplete}
        className="w-full border border-border bg-background px-3 py-2 shadow-xl shadow-foreground/10 mb-2"
        style={{ borderRadius }}
      >
        {step.image && (
          <div className="mb-2">
            <ImageThumb src={step.image} />
          </div>
        )}
        <p className="text-[13px] text-foreground/70 leading-relaxed">{step.content}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={onComplete}
      className="flex flex-col items-end gap-1 pb-2"
    >
      {step.image && (
        <div className="max-w-[200px] p-1.5 bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12)]" style={{ borderRadius }}>
          <img src={step.image} alt="attachment" className="block object-cover max-w-[184px] max-h-[120px]" style={{ borderRadius: `calc(${borderRadius} - 4px)` }} />
        </div>
      )}
      <div style={{ maxWidth: "calc(95% - 40px)", marginInlineStart: 70 }}>
        <div className="bg-foreground/[0.06] px-3.5 py-1.5 transition-colors" style={{ borderRadius }}>
          <p className="text-[14px] leading-5 text-foreground/80 whitespace-pre-wrap break-words">{step.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Thinking: collapsed style (Notion-like) ── */

function CollapsedThinking({
  step,
  state,
  onComplete,
  showIcon,
  borderRadius,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon: boolean
  borderRadius: string
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const [expanded, setExpanded] = useState(false)
  const isAnimating = state === "animating"
  const isComplete = state === "complete"

  return (
    <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="py-1">
      <div
        className="flex items-center gap-2 px-0.5 py-1 w-fit select-none"
        style={{ cursor: isComplete ? "pointer" : "default", borderRadius }}
        onClick={() => { if (isComplete) setExpanded((v) => !v) }}
      >
        {showIcon && (
          <div className="flex items-center justify-center w-6 h-4">
            <LightbulbIcon />
          </div>
        )}
        <div className="flex items-center gap-1 text-[14px] leading-5 text-foreground/40">
          {isAnimating ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">Thinking…</TextShimmer>
          ) : (
            <span>Thought</span>
          )}
        </div>
        {isComplete && <ChevronIcon expanded={expanded} />}
      </div>
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
              <p className="text-[14px] leading-5 text-foreground/40">{step.thoughtContent}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Thinking: expanded style (Cursor-like) ── */

const THINKING_PREVIEW_LENGTH = 60

function ExpandedThinking({
  step,
  state,
  onComplete,
  showIcon,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon: boolean
}) {
  const isAnimating = state === "animating"
  const isComplete = state === "complete"
  const [isExpanded, setIsExpanded] = useState(isAnimating)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wasAnimatingRef = useRef(isAnimating)

  useEffect(() => {
    if (wasAnimatingRef.current && !isAnimating) setIsExpanded(false)
    wasAnimatingRef.current = isAnimating
  }, [isAnimating])

  const thinkingText = step.thoughtContent || ""
  const previewText = thinkingText.slice(0, THINKING_PREVIEW_LENGTH).replace(/\n/g, " ")

  const { tokens, visibleCount } = useStreamingText(thinkingText, {
    delayBefore: 150,
    wordInterval: 40,
    autoStart: isAnimating,
    onComplete: isAnimating ? onComplete : undefined,
  })

  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    if (isAnimating && isExpanded && scrollRef.current) {
      const el = scrollRef.current
      setIsOverflowing(el.scrollHeight > el.clientHeight)
      el.scrollTop = el.scrollHeight
    }
  }, [visibleCount, isAnimating, isExpanded])

  return (
    <div>
      <div onClick={() => setIsExpanded(!isExpanded)} className="group flex items-start gap-1.5 py-0.5 px-2 cursor-pointer">
        <div className="flex-1 min-w-0 flex items-center gap-1">
          {showIcon && <SparklesIcon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />}
          <div className="text-xs flex items-center gap-1.5 min-w-0">
            <span className="font-medium whitespace-nowrap flex-shrink-0">
              {isAnimating ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0">Thinking</TextShimmer>
              ) : (
                <span className="text-foreground/40">Thought</span>
              )}
            </span>
            {!isExpanded && previewText && (
              <span className="text-foreground/[0.25] truncate">{previewText}</span>
            )}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`w-3.5 h-3.5 text-foreground/[0.25] flex-shrink-0 transition-transform duration-200 ease-out ${isExpanded ? "rotate-90" : "opacity-0 group-hover:opacity-100"}`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
      {isExpanded && thinkingText && (
        <div className="relative mt-1">
          <div className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${isAnimating && isOverflowing ? "opacity-100" : "opacity-0"}`} />
          <div ref={scrollRef} className={`px-2 ${isAnimating ? "overflow-y-auto scrollbar-hide max-h-36" : ""}`}>
            <p className="text-sm text-foreground/[0.35] my-px leading-normal py-[3px]">
              {isComplete
                ? thinkingText
                : tokens.slice(0, visibleCount).map((token, i) => (
                    <span key={i} className="transition-opacity duration-200" style={{ opacity: i < visibleCount - 2 ? 1 : 0.5 }}>{token}</span>
                  ))}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Thinking dispatcher ── */

function CustomThinkingTool({
  step,
  state,
  onComplete,
  config,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  config?: ChatPreviewConfig
}) {
  const style = config?.thinkingStyle ?? "collapsed"
  const showIcon = config?.showToolIcons !== false
  const borderRadius = config?.borderRadius ?? "12px"

  if (style === "expanded") {
    return <ExpandedThinking step={step} state={state} onComplete={onComplete} showIcon={showIcon} />
  }

  return <CollapsedThinking step={step} state={state} onComplete={onComplete} showIcon={showIcon} borderRadius={borderRadius} />
}

/* ── Action row (spinner + label) ── */

const ACTION_LABELS = ["Brewing…", "Crafting…", "Working…", "Preparing…"]

function CustomActionRow({
  step,
  state,
  onComplete,
  index,
  config,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  index: number
  config?: ChatPreviewConfig
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isAnimating = state === "animating"
  const showIcon = config?.showToolIcons !== false
  const label = ACTION_LABELS[index % ACTION_LABELS.length]!

  return (
    <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 px-0.5 py-1">
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
          <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">{label}</TextShimmer>
        ) : (
          <span>{step.toolName}</span>
        )}
      </div>
    </motion.div>
  )
}

/* ── Tool timer (for search groups) ── */

function ToolTimer({ step, state, onComplete }: { step: Extract<TimelineStep, { type: "tool-call" }>; state: StepState; onComplete: () => void }) {
  useToolComplete(state === "animating", step.duration, onComplete)
  return null
}

/* ── Search group ── */

function CustomSearchGroup({
  toolSteps,
  stepStates,
  onStepComplete,
  config,
}: {
  toolSteps: Extract<TimelineStep, { type: "tool-call" }>[]
  stepStates: Record<string, StepState>
  onStepComplete: (id: string) => void
  config?: ChatPreviewConfig
}) {
  const anyAnimating = toolSteps.some((s) => stepStates[s.id] === "animating")
  const allComplete = toolSteps.every((s) => stepStates[s.id] === "complete")
  const showIcon = config?.showToolIcons !== false
  const searchQuery = toolSteps.find((s) => s.searchQuery)?.searchQuery

  return (
    <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="py-1">
      {toolSteps.map((s) => (
        <ToolTimer key={s.id} step={s} state={stepStates[s.id]!} onComplete={() => onStepComplete(s.id)} />
      ))}
      <div className="flex items-center gap-2 px-0.5 py-1 w-fit select-none">
        {showIcon && (
          <div className="flex items-center justify-center w-6 h-4 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/30">
              <path d="M7.1 1.975a5.125 5.125 0 1 0 3.155 9.164l3.107 3.107a.625.625 0 1 0 .884-.884l-3.107-3.107A5.125 5.125 0 0 0 7.1 1.975M3.225 7.1a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0" />
            </svg>
          </div>
        )}
        <div className="text-[14px] leading-5 text-foreground/40">
          {anyAnimating ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">Searching…</TextShimmer>
          ) : allComplete && searchQuery ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="shrink-0">Searched for</span>
              <span className="text-foreground/25 truncate min-w-0">&ldquo;{searchQuery}&rdquo;</span>
            </div>
          ) : allComplete ? (
            <span>Search</span>
          ) : (
            <span>Search</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Assistant stream ── */

function CustomAssistantStream({
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="px-0.5 py-1">
      <StreamingMarkdown content={displayedText} className="text-[14px] leading-5 text-foreground/70 [&_p]:leading-5" />
    </motion.div>
  )
}

/* ── Notion-style settings popover ── */

function NotionToggle({ checked, color }: { checked: boolean; color?: string }) {
  return (
    <div
      className="relative shrink-0 box-content h-[14px] w-[26px] rounded-full p-[2px] transition-colors duration-200"
      style={{ background: checked ? (color ?? "rgb(35 131 226)") : "rgba(128,128,128,0.2)" }}
    >
      <div
        className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(12px)" : "translateX(0px)" }}
      />
    </div>
  )
}

function SettingsPopover({ config }: { config?: ChatPreviewConfig }) {
  const [open, setOpen] = useState(false)
  const modes = config?.availableModes ?? ["agent"]
  const defaultMode = config?.defaultMode ?? "agent"
  const showModes = modes.length > 0
  const [canMakeChanges, setCanMakeChanges] = useState(defaultMode !== "plan")
  const [webSearch, setWebSearch] = useState(true)
  const primaryColor = config?.primaryColor

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
          <path d="M3 7.375h6.829a2.501 2.501 0 0 0 4.842 0H17a.625.625 0 1 0 0-1.25h-2.329a2.501 2.501 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25M12.25 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5" />
          <path fillRule="evenodd" d="M7.75 15.75a2.5 2.5 0 0 0 2.421-1.875H17a.625.625 0 1 0 0-1.25h-6.829a2.5 2.5 0 0 0-4.842 0H3a.625.625 0 1 0 0 1.25h2.329A2.5 2.5 0 0 0 7.75 15.75m0-1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" clipRule="evenodd" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 mb-2 z-50 w-[220px] rounded-[10px] bg-popover border border-foreground/[0.08] shadow-lg overflow-hidden"
            >
              <div className="p-1 flex flex-col gap-px">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer" onClick={() => setWebSearch(!webSearch)}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-foreground/40">
                    <path d="M10 2.375a7.625 7.625 0 1 1 0 15.25 7.625 7.625 0 0 1 0-15.25m-1.863 8.25c.054 1.559.31 2.937.681 3.943.212.572.449.992.68 1.256.232.266.404.318.502.318s.27-.052.502-.318c.231-.264.468-.684.68-1.256.371-1.006.627-2.384.681-3.943zm-4.48 0a6.38 6.38 0 0 0 4.509 5.48 6.5 6.5 0 0 1-.52-1.104c-.431-1.167-.704-2.697-.76-4.376zm9.456 0c-.055 1.679-.327 3.21-.758 4.376-.15.405-.324.779-.522 1.104a6.38 6.38 0 0 0 4.51-5.48zM8.166 3.894a6.38 6.38 0 0 0-4.51 5.481h3.23c.056-1.679.328-3.21.76-4.376.15-.405.322-.78.52-1.105M10 3.858c-.099 0-.27.053-.502.319-.231.264-.468.683-.68 1.255-.371 1.006-.627 2.384-.681 3.943h3.726c-.054-1.559-.31-2.937-.681-3.943-.212-.572-.449-.99-.68-1.255-.232-.266-.404-.319-.502-.319m1.833.036c.198.326.372.7.521 1.105.432 1.167.704 2.697.76 4.376h3.23a6.38 6.38 0 0 0-4.511-5.481" />
                  </svg>
                  <span className="text-[13px] text-foreground/60 flex-1">Web search</span>
                  <NotionToggle checked={webSearch} color={primaryColor} />
                </div>
              </div>
              {showModes && (
                <>
                  <div className="mx-3 h-px bg-foreground/[0.06]" />
                  <div className="p-1 flex flex-col gap-px">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer" onClick={() => setCanMakeChanges(!canMakeChanges)}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-foreground/40">
                        <path d="m13.987 5.682-.684.684-1.288-1.288.692-.691a.91.91 0 0 1 1.28 0c.35.35.35.93 0 1.28zm-9.433 9.433 7.914-7.914-1.289-1.289-7.92 7.908c-.122.122-.214.29-.274.457l-.336 1.082c-.06.229.153.442.366.366l1.082-.335q.252-.07.457-.275m12.446.76H5.61l1.25-1.25H17a.625.625 0 1 1 0 1.25" />
                      </svg>
                      <span className="text-[13px] text-foreground/60 flex-1">Can make changes</span>
                      <NotionToggle checked={canMakeChanges} color={primaryColor} />
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

/* ── Inline mode selector (Cursor-style) ── */

function InlineModeSelector({ config }: { config?: ChatPreviewConfig }) {
  const modes = config?.availableModes ?? ["agent"]
  const defaultModeLabel = (config?.defaultMode ?? "agent").charAt(0).toUpperCase() + (config?.defaultMode ?? "agent").slice(1)

  if (modes.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground/50 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 12L15.2218 15.182C17.0012 16.9393 19.8861 16.9393 21.6655 15.182C23.4448 13.4246 23.4448 10.5754 21.6655 8.81802C19.8861 7.06066 17.0012 7.06066 15.2218 8.81802L12 12ZM12 12L8.77817 8.81802C6.99881 7.06066 4.11389 7.06066 2.33452 8.81802C0.555159 10.5754 0.555159 13.4246 2.33452 15.182C4.11389 16.9393 6.99881 16.9393 8.77817 15.182L12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      </svg>
      <span>{defaultModeLabel}</span>
      {(config?.availableModes?.length ?? 0) > 1 && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  )
}

/* ── Model popover ── */

function ModelPopover({ models, activeModelId }: { models: { id: string; name: string; version?: string }[]; activeModelId?: string }) {
  const [open, setOpen] = useState(false)
  const activeModel = models.find((m) => m.id === activeModelId) ?? models[0]

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="h-7 px-3 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors">
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
            <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
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
                    <div key={model.id} onClick={() => setOpen(false)} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[14px] leading-5 cursor-pointer transition-colors ${isActive ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]"}`}>
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

/* ── Input bar ── */

function CustomInputBar({
  activeInputStep,
  onStepComplete,
  isStreaming,
  config,
}: {
  activeInputStep: Extract<TimelineStep, { type: "input-typing" }> | null
  onStepComplete: (id: string) => void
  isStreaming: boolean
  config?: ChatPreviewConfig
}) {
  const { displayedText, showImage } = useInputTyping(
    activeInputStep?.content ?? "",
    activeInputStep?.duration ?? 0,
    !!activeInputStep,
    () => activeInputStep && onStepComplete(activeInputStep.id),
  )

  const hasImage = activeInputStep?.image
  const isTyping = !!activeInputStep
  const showAttach = config?.attachmentsEnabled !== false
  const showModelSelector = (config?.allowedModels?.length ?? 0) > 1
  const modesDisplay = config?.modesDisplayStyle ?? "notion"
  const borderRadius = config?.borderRadius ?? "12px"
  const primaryColor = config?.primaryColor ?? "#3b82f6"

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="max-w-[420px] mx-auto bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12),0_1px_3px_rgba(0,0,0,0.1)]" style={{ borderRadius }}>
        <AnimatePresence>
          {hasImage && showImage && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
              <div className="px-3 pt-3 pb-0">
                <div className="relative w-16 h-16 overflow-hidden shadow-[0_0_0_1px_rgba(128,128,128,0.12)] shrink-0" style={{ borderRadius: `calc(${borderRadius} - 4px)` }}>
                  <img src={activeInputStep!.image!} alt="attachment" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-3.5 pt-3 pb-0 min-h-[56px] text-[14px] leading-5">
          {isTyping && displayedText ? (
            <span className="text-foreground/70">
              {displayedText}
              <motion.span className="inline-block w-[1.5px] h-[1em] bg-foreground/50 ml-px align-text-bottom" animate={{ opacity: [1, 0] }} transition={{ duration: 0.53, repeat: Infinity }} />
            </span>
          ) : (
            <span className="text-foreground/20">Ask anything…</span>
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
            {modesDisplay === "notion" ? (
              <SettingsPopover config={config} />
            ) : (
              <InlineModeSelector config={config} />
            )}
          </div>
          <div className="flex items-center gap-1">
            {showModelSelector && (
              <ModelPopover models={config!.allowedModels!} activeModelId={config!.activeModelId} />
            )}
            {isStreaming ? (
              <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-background">
                  <path d="M11.75 3h-7.5C3.56 3 3 3.56 3 4.25v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-7.5C13 3.56 12.44 3 11.75 3" />
                </svg>
              </div>
            ) : (
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center"
                style={{
                  opacity: isTyping ? 1 : 0.4,
                  background: isTyping ? primaryColor : "rgba(128,128,128,0.06)",
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

export function PreviewCustomStyle({
  paused,
  timeline,
  previewConfig,
}: {
  paused?: boolean
  timeline?: TimelineStep[]
  previewConfig?: ChatPreviewConfig
}) {
  const effectiveTimeline = timeline ?? notionChatTimeline
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep } = useAnimationTimeline(effectiveTimeline, { paused })
  const scrollElRef = useRef<HTMLDivElement | null>(null)
  const setContainerHeight = useContainerHeight()

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

  const fontFamily = previewConfig?.fontFamily ?? "system-ui, sans-serif"

  const renderTurnTools = useCallback((turn: ReturnType<typeof groupIntoTurns>[0], turnIndex: number) => {
    const elements: React.ReactNode[] = []
    let actionIndex = 0
    let i = 0
    const steps = turn.steps

    while (i < steps.length) {
      const step = steps[i]!
      if (step.type !== "tool-call") { i++; continue }

      const tc = step as Extract<TimelineStep, { type: "tool-call" }>

      if (tc.toolVariant === "thinking") {
        elements.push(
          <CustomThinkingTool key={tc.id} step={tc} state={stepStates[tc.id]!} onComplete={() => onStepComplete(tc.id)} config={previewConfig} />
        )
        i++
      } else if (tc.toolVariant === "action" || !tc.toolVariant) {
        elements.push(
          <CustomActionRow key={tc.id} step={tc} state={stepStates[tc.id]!} onComplete={() => onStepComplete(tc.id)} index={actionIndex++} config={previewConfig} />
        )
        i++
      } else if (tc.toolVariant === "search") {
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
          <CustomSearchGroup key={`search-${turnIndex}-${searchGroup[0]!.id}`} toolSteps={searchGroup} stepStates={stepStates} onStepComplete={onStepComplete} config={previewConfig} />
        )
      } else {
        i++
      }
    }

    return elements
  }, [stepStates, onStepComplete, previewConfig])

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily }}>
      <div ref={scrollRefCallback} className="flex-1 overflow-y-auto">
        <div className="max-w-[420px] mx-auto px-4 py-2">
          {/* Date divider */}
          <div className="flex items-center justify-center my-4">
            <span className="text-[12px] leading-4 font-medium text-foreground/25 select-none">Today</span>
          </div>

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
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "user-message" }> => s.type === "user-message")
                    .map((step) => (
                      <CustomUserMessage key={step.id} step={step} onComplete={() => onStepComplete(step.id)} config={previewConfig} />
                    ))}
                  {toolElements}
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "assistant-stream" }> => s.type === "assistant-stream")
                    .map((step) => (
                      <CustomAssistantStream key={step.id} step={step} onComplete={() => onStepComplete(step.id)} onUpdate={scrollToBottom} />
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

      <CustomInputBar
        activeInputStep={activeInputStep}
        onStepComplete={onStepComplete}
        isStreaming={!isComplete && !activeInputStep && visibleSteps.length > 0}
        config={previewConfig}
      />
    </div>
  )
}
