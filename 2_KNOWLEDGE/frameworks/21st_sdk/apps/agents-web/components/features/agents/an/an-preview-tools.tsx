"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TextShimmer } from "@/components/ui/text-shimmer"
import type { ChatStyle, TimelineStep, StepState } from "./chat-preview/types"
import { toolExecutionTimeline, notionToolExecutionTimeline } from "./chat-preview/types"
import { useAnimationTimeline, useToolComplete } from "./chat-preview/hooks"
import { ReplayButton } from "./chat-preview/shared"

/* ════════════════════════════════════════════════════════════
   Cursor / Default style — simple tool rows (same as in chat)
   ════════════════════════════════════════════════════════════ */

function ToolCallRow({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isAnimating = state === "animating"

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-1.5 py-1 rounded-md px-2"
    >
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <div className="text-xs text-white/50 flex items-center gap-1.5 min-w-0">
          <span className="font-medium whitespace-nowrap flex-shrink-0">
            {isAnimating ? (
              <TextShimmer
                as="span"
                duration={1.2}
                className="inline-flex items-center text-xs leading-none h-4 m-0"
              >
                {step.toolName}
              </TextShimmer>
            ) : (
              step.toolName
            )}
          </span>
          <span className="text-white/25 font-normal truncate min-w-0">{step.toolDetail}</span>
        </div>
      </div>
    </motion.div>
  )
}

function PreviewToolExecutionCursor({ paused }: { paused?: boolean }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete } =
    useAnimationTimeline(toolExecutionTimeline, { paused })

  const toolSteps = visibleSteps.filter(
    (s): s is Extract<TimelineStep, { type: "tool-call" }> => s.type === "tool-call",
  )

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[420px] mx-auto px-3 py-4">
          {toolSteps.map((step) => (
            <ToolCallRow
              key={step.id}
              step={step}
              state={stepStates[step.id]!}
              onComplete={() => onStepComplete(step.id)}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>
    </div>
  )
}

function PreviewToolExecutionDefault({ paused }: { paused?: boolean }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete } =
    useAnimationTimeline(toolExecutionTimeline, { paused })

  const toolSteps = visibleSteps.filter(
    (s): s is Extract<TimelineStep, { type: "tool-call" }> => s.type === "tool-call",
  )

  return (
    <div className="flex flex-col h-full relative">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
          <span className="text-[11px] font-mono text-white/30">
            Analytics Agent · run_xk29a
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {toolSteps.map((step) => (
          <ToolCallRow
            key={step.id}
            step={step}
            state={stepStates[step.id]!}
            onComplete={() => onStepComplete(step.id)}
          />
        ))}
      </div>
      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Notion style — thinking / search / action rows (same as chat)
   ════════════════════════════════════════════════════════════ */

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-white/30">
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
      className="shrink-0 text-white/20 transition-transform duration-150"
      style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-white/30">
      <path d="M7.1 1.975a5.125 5.125 0 1 0 3.155 9.164l3.107 3.107a.625.625 0 1 0 .884-.884l-3.107-3.107A5.125 5.125 0 0 0 7.1 1.975M3.225 7.1a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 animate-spin text-white/30">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  )
}

/* ── Notion thinking row ── */

function NotionThinkingRow({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
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
      <div
        className="flex items-center gap-2 rounded-md px-0.5 py-1 w-fit select-none"
        style={{ cursor: isComplete ? "pointer" : "default" }}
        onClick={() => { if (isComplete) setExpanded((v) => !v) }}
      >
        <div className="flex items-center justify-center w-6 h-4">
          <LightbulbIcon />
        </div>
        <div className="flex items-center gap-1 text-[14px] leading-5 text-white/40">
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
              <p className="text-[14px] leading-5 text-white/40">
                {step.thoughtContent}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Notion action row ── */

const ACTION_LABELS = ["Brewing…", "Crafting…", "Working…", "Preparing…"]

function NotionActionRow({
  step,
  state,
  onComplete,
  index,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  index: number
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
      <div className="flex items-center justify-center w-6 h-4">
        {isAnimating ? <SpinnerIcon /> : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-white/25">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0" />
          </svg>
        )}
      </div>
      <div className="text-[14px] leading-5 text-white/40">
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

/* ── Notion search row (single step, simplified from chat's search group) ── */

function NotionSearchRow({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isAnimating = state === "animating"
  const isComplete = state === "complete"

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-1"
    >
      <div className="flex items-center gap-2 rounded-md px-0.5 py-1 w-fit max-w-full select-none">
        <div className="flex items-center justify-center w-6 h-4 shrink-0">
          <SearchIcon />
        </div>
        <div className="flex items-center gap-1 min-w-0 text-[14px] leading-5 text-white/40">
          {isAnimating ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-[14px] leading-5 m-0">
              Searching…
            </TextShimmer>
          ) : isComplete ? (
            <span className="truncate">{step.toolName}</span>
          ) : (
            <span>Search</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Notion main ── */

function PreviewToolExecutionNotion({ paused }: { paused?: boolean }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete } =
    useAnimationTimeline(notionToolExecutionTimeline, { paused })

  const toolSteps = visibleSteps.filter(
    (s): s is Extract<TimelineStep, { type: "tool-call" }> => s.type === "tool-call",
  )

  const renderTools = useCallback(() => {
    const elements: React.ReactNode[] = []
    let actionIndex = 0

    for (const step of toolSteps) {
      if (step.toolVariant === "thinking") {
        elements.push(
          <NotionThinkingRow
            key={step.id}
            step={step}
            state={stepStates[step.id]!}
            onComplete={() => onStepComplete(step.id)}
          />,
        )
      } else if (step.toolVariant === "search") {
        elements.push(
          <NotionSearchRow
            key={step.id}
            step={step}
            state={stepStates[step.id]!}
            onComplete={() => onStepComplete(step.id)}
          />,
        )
      } else {
        elements.push(
          <NotionActionRow
            key={step.id}
            step={step}
            state={stepStates[step.id]!}
            onComplete={() => onStepComplete(step.id)}
            index={actionIndex++}
          />,
        )
      }
    }

    return elements
  }, [toolSteps, stepStates, onStepComplete])

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[420px] mx-auto px-4 py-4">
          {renderTools()}
        </div>
      </div>
      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>
    </div>
  )
}

/* ── Dispatcher ── */

/* ════════════════════════════════════════════════════════════
   Custom style — tool definitions code preview
   ════════════════════════════════════════════════════════════ */

const toolCodeLines = [
  { indent: 0, tokens: [{ text: "import", c: "kw" }, { text: " { defineTool } ", c: "d" }, { text: "from", c: "kw" }, { text: ' "', c: "d" }, { text: "@21st-sdk/react", c: "s" }, { text: '"', c: "d" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "const", c: "kw" }, { text: " searchEvents = ", c: "d" }, { text: "defineTool", c: "fn" }, { text: "({", c: "d" }] },
  { indent: 1, tokens: [{ text: "name", c: "p" }, { text: ": ", c: "d" }, { text: '"search_events"', c: "s" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "description", c: "p" }, { text: ": ", c: "d" }, { text: '"Query analytics events"', c: "s" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "parameters", c: "p" }, { text: ": {", c: "d" }] },
  { indent: 2, tokens: [{ text: "event", c: "p" }, { text: ": ", c: "d" }, { text: "z.string()", c: "fn" }, { text: ",", c: "d" }] },
  { indent: 2, tokens: [{ text: "period", c: "p" }, { text: ": ", c: "d" }, { text: "z.enum(", c: "fn" }, { text: '["7d","30d","90d"]', c: "s" }, { text: ")", c: "fn" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "},", c: "d" }] },
  { indent: 1, tokens: [{ text: "execute", c: "p" }, { text: ": ", c: "d" }, { text: "async", c: "kw" }, { text: " ({ event, period }) => {", c: "d" }] },
  { indent: 2, tokens: [{ text: "return", c: "kw" }, { text: " db.events.query({ event, period })", c: "d" }] },
  { indent: 1, tokens: [{ text: "}", c: "d" }] },
  { indent: 0, tokens: [{ text: "})", c: "d" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "const", c: "kw" }, { text: " buildFunnel = ", c: "d" }, { text: "defineTool", c: "fn" }, { text: "({", c: "d" }] },
  { indent: 1, tokens: [{ text: "name", c: "p" }, { text: ": ", c: "d" }, { text: '"build_funnel"', c: "s" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "description", c: "p" }, { text: ": ", c: "d" }, { text: '"Build conversion funnel"', c: "s" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "parameters", c: "p" }, { text: ": {", c: "d" }] },
  { indent: 2, tokens: [{ text: "steps", c: "p" }, { text: ": ", c: "d" }, { text: "z.array(z.string())", c: "fn" }, { text: ",", c: "d" }] },
  { indent: 1, tokens: [{ text: "},", c: "d" }] },
  { indent: 0, tokens: [{ text: "})", c: "d" }] },
]

const toolColorMap: Record<string, string> = {
  kw: "text-[#C586C0]/80",
  s: "text-[#CE9178]/80",
  p: "text-[#9CDCFE]/60",
  fn: "text-[#DCDCAA]/70",
  d: "text-white/30",
}

function PreviewCustomTools() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] font-mono text-white/40">tools.ts</span>
            </div>
          </div>

          <div className="font-mono text-[11px] leading-[20px]">
            {toolCodeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: 0.025 * i }}
                className="flex"
              >
                <span className="w-5 text-right text-white/[0.08] select-none shrink-0 mr-4 tabular-nums">
                  {i + 1}
                </span>
                <span style={{ paddingLeft: line.indent * 14 }}>
                  {line.tokens.map((token, j) => (
                    <span key={j} className={toolColorMap[token.c] ?? toolColorMap.d}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600 shrink-0">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <p className="text-[11px] text-white/25">
            Define tools with <span className="text-white/40 font-mono">defineTool</span> — typed params, async execute, auto-traced
          </p>
        </div>
      </div>
    </div>
  )
}

export function PreviewToolExecution({ style, paused }: { style: ChatStyle; paused?: boolean }) {
  if (style === "cursor") return <PreviewToolExecutionCursor paused={paused} />
  if (style === "notion") return <PreviewToolExecutionNotion paused={paused} />
  if (style === "custom") return <PreviewCustomTools />
  return <PreviewToolExecutionDefault paused={paused} />
}
