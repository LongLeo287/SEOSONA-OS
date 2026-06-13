import React, { memo, useState, useEffect, useRef } from "react"
import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import { TOOL_ROW_STYLES } from "../types/tool-styles"
import { useToolComplete } from "../hooks/use-tool-complete"
import { useStreamingText } from "../hooks/use-streaming-text"
import { LightbulbIcon } from "../icons/tool-icons"
import { ToolRowBase } from "./tool-row-base"
import { useThemeConfig } from "../theme-config"
import { mapToolInvocationToStep, mapToolStateToStepState } from "../utils/tool-adapters"

const THINKING_PREVIEW_LENGTH = 60

export function ThinkingCollapsed({
  step,
  state,
  onComplete,
  showIcon,
  size = "normal",
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon: boolean
  size?: ToolSize
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const [expanded, setExpanded] = useState(false)
  const s = TOOL_ROW_STYLES[size]

  return (
    <ToolRowBase
      size={size}
      icon={showIcon ? <LightbulbIcon className="w-full h-full shrink-0 text-muted-foreground" /> : undefined}
      shimmerLabel="Thinking..."
      completeLabel="Thought"
      isAnimating={state === "animating"}
      expandable={!!step.thoughtContent}
      expanded={expanded}
      onToggleExpand={() => setExpanded((v) => !v)}
    >
      <div className="pt-1 pr-1 max-h-[175px] overflow-y-auto">
        <p className={`${s.text} ${s.textColor}`}>{step.thoughtContent}</p>
      </div>
    </ToolRowBase>
  )
}

export function ThinkingStreaming({
  step,
  state,
  onComplete,
  showIcon,
  size = "compact",
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon: boolean
  size?: ToolSize
}) {
  const isAnimating = state === "animating"
  const isComplete = state === "complete"
  const [isExpanded, setIsExpanded] = useState(isAnimating)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wasAnimatingRef = useRef(isAnimating)

  useEffect(() => {
    if (!wasAnimatingRef.current && isAnimating) setIsExpanded(true)
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
    <ToolRowBase
      size={size}
      icon={showIcon ? <LightbulbIcon className="w-full h-full shrink-0 text-muted-foreground" /> : undefined}
      shimmerLabel="Thinking"
      completeLabel="Thought"
      isAnimating={isAnimating}
      detail={!isExpanded && previewText ? previewText : undefined}
      expandable={true}
      expanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
      showChevronOnHoverOnly={true}
    >
      {thinkingText && (
        <div className="relative mt-1">
          <div className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${isAnimating && isOverflowing ? "opacity-100" : "opacity-0"}`} />
          <div ref={scrollRef} className={isAnimating ? "overflow-y-auto scrollbar-hide max-h-36" : ""}>
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
    </ToolRowBase>
  )
}

export function ThinkingHidden({
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

export const ThinkingTool = memo(function ThinkingTool({
  part,
  chatStatus,
  variant = "collapsed",
  showIcon = false,
  step: externalStep,
  state: externalState,
  onComplete: externalOnComplete,
  size,
}: {
  part?: any
  chatStatus?: string
  variant?: "collapsed" | "streaming" | "hidden"
  showIcon?: boolean
  step?: Extract<TimelineStep, { type: "tool-call" }>
  state?: StepState
  onComplete?: () => void
  size?: ToolSize
}) {
  const config = useThemeConfig()
  const display = variant ?? config.thinkingDisplay
  const iconVisible = showIcon ?? config.showToolIcons
  const toolSize = size ?? (config.toolCallStyle === "compact" ? "compact" : "normal") as ToolSize

  let step: Extract<TimelineStep, { type: "tool-call" }>
  let stepState: StepState
  let onComplete: () => void

  if (externalStep && externalState && externalOnComplete) {
    step = externalStep
    stepState = externalState
    onComplete = externalOnComplete
  } else if (part) {
    step = mapToolInvocationToStep(part.toolCallId ?? part.id ?? "thinking", {
      toolName: "Thinking",
      args: part.input ?? part.args ?? {},
      state: part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call",
      result: part.output ?? part.result,
    })
    stepState = mapToolStateToStepState(
      part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call"
    )
    onComplete = () => {}
  } else {
    return null
  }

  if (display === "hidden") {
    return <ThinkingHidden step={step} state={stepState} onComplete={onComplete} />
  }
  if (display === "streaming") {
    return <ThinkingStreaming step={step} state={stepState} onComplete={onComplete} showIcon={iconVisible} size={toolSize} />
  }
  return <ThinkingCollapsed step={step} state={stepState} onComplete={onComplete} showIcon={iconVisible} size={toolSize} />
})
