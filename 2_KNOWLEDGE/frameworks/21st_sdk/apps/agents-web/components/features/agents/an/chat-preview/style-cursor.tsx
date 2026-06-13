"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TextShimmer } from "@/components/ui/text-shimmer"
import type { TimelineStep, StepState, ChatPreviewConfig } from "./types"
import { chatTimeline } from "./types"
import {
  useAnimationTimeline,
  useStreamingText,
  useInputTyping,
  useToolComplete,
  useContainerHeight,
  groupIntoTurns,
} from "./hooks"
import { ImageThumb, ReplayButton, PaperclipIcon, SendButton, StreamingMarkdown } from "./shared"
import {
  CustomTerminalIcon,
  SparklesIcon,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"

/* ── Sub-components ── */

function CursorUserMessage({
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
      className="w-full rounded-xl border border-border bg-background px-3 py-2"
    >
      <p className="text-[13px] text-foreground/70 leading-relaxed">{step.content}</p>
    </motion.div>
  )
}

function CursorToolCall({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isPending = state === "animating"

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-1.5 py-0.5 rounded-md px-2"
    >
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <div className="text-xs text-foreground/40 flex items-center gap-1.5 min-w-0">
          <span className="font-medium whitespace-nowrap flex-shrink-0">
            {isPending ? (
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
          <span className="text-foreground/20 font-normal truncate min-w-0">
            {step.toolDetail}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── File extension icons ── */

function FileExtIcon({ filename, className }: { filename: string; className?: string }) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const cls = className ?? "w-2.5 h-2.5 flex-shrink-0"

  // TypeScript
  if (ext === "ts" || ext === "tsx") {
    return (
      <svg viewBox="0 0 32 32" className={cls}>
        <path d="M23.827,8.243A4.424,4.424,0,0,1,26.05,9.524a5.853,5.853,0,0,1,.852,1.143c.011.045-1.534,1.083-2.471,1.662-.034.023-.169-.124-.322-.35a2.014,2.014,0,0,0-1.67-1c-1.077-.074-1.771.49-1.766,1.433a1.3,1.3,0,0,0,.153.666c.237.49.677.784,2.059,1.383,2.544,1.095,3.636,1.817,4.31,2.843a5.158,5.158,0,0,1,.416,4.333,4.764,4.764,0,0,1-3.932,2.815,10.9,10.9,0,0,1-2.708-.028,6.531,6.531,0,0,1-3.616-1.884,6.278,6.278,0,0,1-.926-1.371,2.655,2.655,0,0,1,.327-.208c.158-.09.756-.434,1.32-.761L19.1,19.6l.214.312a4.771,4.771,0,0,0,1.35,1.292,3.3,3.3,0,0,0,3.458-.175,1.545,1.545,0,0,0,.2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8,8.8,0,0,1-3.349-2.055,4.687,4.687,0,0,1-.976-1.777,7.116,7.116,0,0,1-.062-2.268,4.332,4.332,0,0,1,3.644-3.374A9,9,0,0,1,23.827,8.243ZM15.484,9.726l.011,1.454h-4.63V24.328H7.6V11.183H2.97V9.755A13.986,13.986,0,0,1,3.01,8.289c.017-.023,2.832-.034,6.245-.028l6.211.017Z" fill="#007acc" />
      </svg>
    )
  }

  // JavaScript
  if (ext === "js" || ext === "mjs" || ext === "cjs" || ext === "jsx") {
    return (
      <svg viewBox="0 0 32 32" className={cls}>
        <rect x="2" y="2" width="28" height="28" rx="1.312" fill="#f5de19" />
        <path d="M20.809,23.875a2.866,2.866,0,0,0,2.6,1.6c1.09,0,1.787-.545,1.787-1.3,0-.9-.715-1.222-1.916-1.747l-.658-.282c-1.9-.809-3.16-1.822-3.16-3.964,0-1.973,1.5-3.476,3.853-3.476a3.889,3.889,0,0,1,3.742,2.107L25,18.128A1.789,1.789,0,0,0,23.311,17a1.145,1.145,0,0,0-1.259,1.128c0,.789.489,1.109,1.618,1.6l.658.282c2.236.959,3.5,1.936,3.5,4.133,0,2.369-1.861,3.667-4.36,3.667a5.055,5.055,0,0,1-4.795-2.691Zm-9.295.228c.413.733.789,1.353,1.693,1.353.864,0,1.41-.338,1.41-1.653V14.856h2.631v8.982c0,2.724-1.6,3.964-3.929,3.964a4.085,4.085,0,0,1-3.947-2.4Z" fill="#000" />
      </svg>
    )
  }

  // JSON
  if (ext === "json" || ext === "jsonc") {
    return (
      <svg viewBox="0 0 32 32" className={cls}>
        <path d="M4.014,14.976a2.51,2.51,0,0,0,1.567-.518A2.377,2.377,0,0,0,6.386,13l.129-1.334A5.435,5.435,0,0,1,7.6,9.071,3.157,3.157,0,0,1,10.519,8h1.316v1.86H10.937a1.257,1.257,0,0,0-1.1.465,3.405,3.405,0,0,0-.357,1.585l-.127,1.244a3.283,3.283,0,0,1-.573,1.61A2.482,2.482,0,0,1,7.6,15.537a2.482,2.482,0,0,1,1.18.773A3.283,3.283,0,0,1,9.349,17.9l.127,1.244a3.405,3.405,0,0,0,.357,1.585,1.257,1.257,0,0,0,1.1.465h.9V23.06H10.519A3.157,3.157,0,0,1,7.6,21.981a5.435,5.435,0,0,1-1.082-2.595L6.386,18.05a2.377,2.377,0,0,0-.805-1.456A2.51,2.51,0,0,0,4.014,16.07Z" fill="#fbc02d" />
        <path d="M27.986,16.07a2.51,2.51,0,0,0-1.567.518,2.377,2.377,0,0,0-.805,1.456l-.129,1.334a5.435,5.435,0,0,1-1.082,2.595A3.157,3.157,0,0,1,21.481,23.06H20.165V21.2h.9a1.257,1.257,0,0,0,1.1-.465,3.405,3.405,0,0,0,.357-1.585l.127-1.244a3.283,3.283,0,0,1,.573-1.61,2.482,2.482,0,0,1,1.18-.773,2.482,2.482,0,0,1-1.18-.773,3.283,3.283,0,0,1-.573-1.61L22.527,11.9a3.405,3.405,0,0,0-.357-1.585,1.257,1.257,0,0,0-1.1-.465h-.9V8h1.316a3.157,3.157,0,0,1,2.924,1.071,5.435,5.435,0,0,1,1.082,2.595l.129,1.334A2.377,2.377,0,0,0,26.419,14.458a2.51,2.51,0,0,0,1.567.518Z" fill="#fbc02d" />
      </svg>
    )
  }

  // Default — generic document icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${cls} text-muted-foreground`}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── File edit/write tool — card with filename, diff stats, diff lines ── */
/* States: animating → "Creating"/"Editing" shimmer + spinner + diff streams in
           complete  → "Created"/"Edited" plain + filename + diff stats          */

function CursorEditTool({
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
  const isPending = state === "animating"
  const fileName = step.filePath?.split("/").pop() ?? step.toolDetail
  const isWrite = step.toolName === "Write"
  const actionLabel = isWrite
    ? (isPending ? "Creating" : "Created")
    : (isPending ? "Editing" : "Edited")

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-muted/50 overflow-hidden mx-2 my-0.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-2.5 pr-2 h-7">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {showIcon && <FileExtIcon filename={fileName} className="w-3 h-3 flex-shrink-0" />}
          {isPending ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0 truncate">
              {actionLabel} {fileName}
            </TextShimmer>
          ) : (
            <span className="text-xs text-foreground/40 truncate">
              {actionLabel} <span className="text-foreground/60">{fileName}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {step.diffStats && !isPending && (
            <span className="text-[10px] font-mono">
              {step.diffStats.includes("+") && (
                <span className="text-green-400/70">{step.diffStats.split(" ")[0]}</span>
              )}
              {step.diffStats.includes("-") && (
                <span className="text-red-400/70 ml-1">{step.diffStats.split(" ").find(s => s.startsWith("-"))}</span>
              )}
            </span>
          )}
          {isPending && (
            <svg className="w-3 h-3 text-muted-foreground animate-spin" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="7" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
      {/* Diff content */}
      {step.diffLines && step.diffLines.length > 0 && (
        <div className="border-t border-foreground/[0.04] font-mono text-[10px] leading-[18px] max-h-[72px] overflow-hidden">
          {step.diffLines.map((line, i) => (
            <div
              key={i}
              className={`px-2.5 ${
                line.type === "add"
                  ? "bg-green-500/[0.06] border-l-2 border-green-500/30 text-green-700/50 dark:text-green-300/50"
                  : line.type === "remove"
                    ? "bg-red-500/[0.06] border-l-2 border-red-500/30 text-red-700/50 dark:text-red-300/50"
                    : "border-l-2 border-transparent text-foreground/20"
              }`}
            >
              <span className="select-none opacity-50 mr-2">{line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}</span>
              {line.content}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Bash/Terminal tool — card with command and output ── */
/* Header: "Running command: summary" (shimmer) / "Ran command: summary" (plain)
   No icon, no success/failed badge — matches desktop agent-bash-tool            */

function extractCommandSummary(cmd: string): string {
  return cmd
    .split("|")
    .map((s) => s.trim().split(/\s+/)[0] ?? "")
    .filter(Boolean)
    .slice(0, 4)
    .join(", ")
}

function CursorBashTool({
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
  const isPending = state === "animating"
  const command = step.bashCommand ?? step.toolDetail
  const summary = extractCommandSummary(command)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-muted/50 overflow-hidden mx-2 my-0.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-2.5 pr-2 h-7">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {showIcon && <CustomTerminalIcon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />}
          {isPending ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0 truncate">
              Running command: {summary}
            </TextShimmer>
          ) : (
            <span className="text-xs text-foreground/40 truncate">Ran command: {summary}</span>
          )}
        </div>
        {isPending && (
          <svg className="w-3 h-3 text-muted-foreground animate-spin flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="7" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* Command + Output */}
      <div className="border-t border-foreground/[0.04] px-2.5 py-1.5 font-mono text-[10px] leading-[16px] overflow-hidden">
        <div className="break-all">
          <span className="text-amber-400/50">$ </span>
          <span className="text-foreground/40">{command}</span>
        </div>
        {!isPending && step.bashOutput && (
          <div className="mt-1 text-foreground/25 whitespace-pre-line max-h-[80px] overflow-hidden">
            {step.bashOutput}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Thinking tool — 1:1 copy of agent-thinking-tool.tsx, dark-adapted ── */

const THINKING_PREVIEW_LENGTH = 60

function CursorThinkingTool({
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
  // Don't use useToolComplete — let streaming drive the completion
  const isAnimating = state === "animating"
  const isComplete = state === "complete"

  // Default: expanded while animating, collapsed when done
  const [isExpanded, setIsExpanded] = useState(isAnimating)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wasAnimatingRef = useRef(isAnimating)

  // Auto-collapse when animation ends (transition from true -> false)
  useEffect(() => {
    if (wasAnimatingRef.current && !isAnimating) {
      setIsExpanded(false)
    }
    wasAnimatingRef.current = isAnimating
  }, [isAnimating])

  const thinkingText = step.thoughtContent || ""
  const previewText = thinkingText
    .slice(0, THINKING_PREVIEW_LENGTH)
    .replace(/\n/g, " ")

  // Stream thinking text word-by-word — onComplete fires when streaming finishes
  const { tokens, visibleCount } = useStreamingText(thinkingText, {
    delayBefore: 150,
    wordInterval: 40,
    autoStart: isAnimating,
    onComplete: isAnimating ? onComplete : undefined,
  })

  // Track whether content overflows the scroll container
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Auto-scroll when expanded during streaming + check overflow
  useEffect(() => {
    if (isAnimating && isExpanded && scrollRef.current) {
      const el = scrollRef.current
      setIsOverflowing(el.scrollHeight > el.clientHeight)
      el.scrollTop = el.scrollHeight
    }
  }, [visibleCount, isAnimating, isExpanded])

  return (
    <div>
      {/* Header - always visible, clickable to toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-start gap-1.5 py-0.5 px-2 cursor-pointer"
      >
        <div className="flex-1 min-w-0 flex items-center gap-1">
          {showIcon && <SparklesIcon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />}
          <div className="text-xs flex items-center gap-1.5 min-w-0">
            <span className="font-medium whitespace-nowrap flex-shrink-0">
              {isAnimating ? (
                <TextShimmer
                  as="span"
                  duration={1.2}
                  className="inline-flex items-center text-xs leading-none h-4 m-0"
                >
                  Thinking
                </TextShimmer>
              ) : (
                <span className="text-foreground/40">Thought</span>
              )}
            </span>
            {/* Preview when collapsed */}
            {!isExpanded && previewText && (
              <span className="text-foreground/[0.25] truncate">
                {previewText}
              </span>
            )}
            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-3.5 h-3.5 text-foreground/[0.25] flex-shrink-0 transition-transform duration-200 ease-out ${
                isExpanded
                  ? "rotate-90"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content - expanded while streaming, collapsible after */}
      {isExpanded && thinkingText && (
        <div className="relative mt-1">
          {/* Top gradient fade when streaming */}
          <div
            className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
              isAnimating && isOverflowing ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            ref={scrollRef}
            className={`px-2 ${
              isAnimating ? "overflow-y-auto scrollbar-hide max-h-36" : ""
            }`}
          >
            <p className="text-sm text-foreground/[0.35] my-px leading-normal py-[3px]">
              {isComplete
                ? thinkingText
                : tokens.slice(0, visibleCount).map((token, i) => (
                    <span
                      key={i}
                      className="transition-opacity duration-200"
                      style={{
                        opacity: i < visibleCount - 2 ? 1 : 0.5,
                      }}
                    >
                      {token}
                    </span>
                  ))}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CursorAssistantStream({
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
      className="px-2 pt-1"
    >
      <StreamingMarkdown
        content={displayedText}
        className="text-[13px] text-foreground/55 leading-relaxed"
      />
    </motion.div>
  )
}

function CursorModelDropdown({
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
        className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground/50 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer"
      >
        <span>{activeModel?.name}{activeModel?.version ? ` ${activeModel.version}` : ""}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
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
              className="absolute bottom-full left-0 mb-2 z-50 w-[160px] rounded-lg bg-popover border border-foreground/[0.08] shadow-lg overflow-hidden"
            >
              <div className="p-1 flex flex-col gap-px">
                {models.map((model) => {
                  const isActive = model.id === activeModelId
                  return (
                    <div
                      key={model.id}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-[12px] leading-4 cursor-pointer transition-colors ${
                        isActive ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]"
                      }`}
                    >
                      <span className="text-foreground/60">
                        {model.name}{model.version ? ` ${model.version}` : ""}
                      </span>
                      {isActive && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-foreground/50">
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

function CursorInputBar({
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
  const modes = previewConfig?.availableModes ?? ["agent"]
  const showModeSelector = modes.length > 0
  const defaultModeLabel = (previewConfig?.defaultMode ?? "agent").charAt(0).toUpperCase() + (previewConfig?.defaultMode ?? "agent").slice(1)

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="max-w-[420px] mx-auto">
        <div className="rounded-xl border border-foreground/[0.07] bg-foreground/[0.09] p-2">
          <AnimatePresence>
            {hasImage && showImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-2"
              >
                <div className="flex flex-wrap gap-[6px]">
                  <ImageThumb src={activeInputStep.image!} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-[12px] px-1 py-1 min-h-[20px]">
            {isTyping && displayedText ? (
              <span className="text-foreground/60">
                {displayedText}
                <motion.span
                  className="inline-block w-[1.5px] h-[1em] bg-foreground/50 ml-px align-text-bottom"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.53, repeat: Infinity }}
                />
              </span>
            ) : (
              <span className="text-foreground/25">Plan, search, or ask...</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              {showModeSelector && (
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground/50 rounded-md hover:bg-foreground/[0.04] transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M12 12L15.2218 15.182C17.0012 16.9393 19.8861 16.9393 21.6655 15.182C23.4448 13.4246 23.4448 10.5754 21.6655 8.81802C19.8861 7.06066 17.0012 7.06066 15.2218 8.81802L12 12ZM12 12L8.77817 8.81802C6.99881 7.06066 4.11389 7.06066 2.33452 8.81802C0.555159 10.5754 0.555159 13.4246 2.33452 15.182C4.11389 16.9393 6.99881 16.9393 8.77817 15.182L12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                  <span>{defaultModeLabel}</span>
                  {(previewConfig?.availableModes?.length ?? 0) > 1 && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </div>
              )}
              {showModelSelector && (
                <CursorModelDropdown
                  models={previewConfig!.allowedModels!}
                  activeModelId={previewConfig!.activeModelId}
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              {showAttach && (
                <div className="h-7 w-7 rounded-sm flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer">
                  <PaperclipIcon />
                </div>
              )}
              {isStreaming ? (
                <div className="h-7 w-7 rounded-full bg-foreground/70 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-background rounded-[2px]" />
                </div>
              ) : (
                <SendButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */

export function PreviewAgentChatCursor({ paused, timeline, previewConfig }: { paused?: boolean; timeline?: TimelineStep[]; previewConfig?: ChatPreviewConfig }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep } = useAnimationTimeline(timeline ?? chatTimeline, { paused })
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

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRefCallback} className="flex-1 overflow-y-auto">
        <div className="max-w-[420px] mx-auto px-3 py-4 pb-8 space-y-3">
          {turns.map((turn, turnIndex) => {
            const isLastTurn = turnIndex === turns.length - 1
            return (
              <div
                key={turn.userStep?.id ?? `turn-${turnIndex}`}
                className="relative"
                style={isLastTurn ? { minHeight: "calc(var(--chat-container-height, 0px) - 32px)" } : undefined}
              >
                {turn.steps.map((step) => {
                  const state = stepStates[step.id]!
                  if (step.type === "user-message") {
                    const umStep = step as Extract<TimelineStep, { type: "user-message" }>
                    return (
                      <div key={step.id}>
                        {umStep.image && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                            className="mb-2 flex flex-wrap gap-1.5"
                          >
                            <ImageThumb src={umStep.image} />
                          </motion.div>
                        )}
                        <div className="sticky top-0 z-10 pb-3">
                          <CursorUserMessage
                            step={umStep}
                            onComplete={() => onStepComplete(step.id)}
                          />
                        </div>
                      </div>
                    )
                  }
                  if (step.type === "tool-call") {
                    if (step.toolVariant === "thinking") {
                      return (
                        <CursorThinkingTool
                          key={step.id}
                          step={step}
                          state={state}
                          onComplete={() => onStepComplete(step.id)}
                          showIcon={showToolIcons}
                        />
                      )
                    }
                    if (step.diffLines || step.toolName === "Write" || step.toolName === "Edit") {
                      return (
                        <CursorEditTool
                          key={step.id}
                          step={step}
                          state={state}
                          onComplete={() => onStepComplete(step.id)}
                          showIcon={showToolIcons}
                        />
                      )
                    }
                    if (step.bashCommand || step.toolName === "Bash") {
                      return (
                        <CursorBashTool
                          key={step.id}
                          step={step}
                          state={state}
                          onComplete={() => onStepComplete(step.id)}
                          showIcon={showToolIcons}
                        />
                      )
                    }
                    return (
                      <CursorToolCall
                        key={step.id}
                        step={step}
                        state={state}
                        onComplete={() => onStepComplete(step.id)}
                      />
                    )
                  }
                  if (step.type === "assistant-stream") {
                    return (
                      <CursorAssistantStream
                        key={step.id}
                        step={step}
                        onComplete={() => onStepComplete(step.id)}
                        onUpdate={scrollToBottom}
                      />
                    )
                  }
                  return null
                })}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>

      <CursorInputBar
        activeInputStep={activeInputStep}
        onStepComplete={onStepComplete}
        isStreaming={!isComplete && !activeInputStep && visibleSteps.length > 0}
        previewConfig={previewConfig}
      />
    </div>
  )
}
