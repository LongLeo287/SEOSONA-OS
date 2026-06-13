import React, { memo } from "react"
import { motion } from "motion/react"
import { TextShimmer } from "../components/text-shimmer"
import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import { useToolComplete } from "../hooks/use-tool-complete"
import { TerminalIcon } from "../icons/tool-icons"
import { ToolRowBase } from "./tool-row-base"
import { useThemeConfig } from "../theme-config"
import { mapToolInvocationToStep, mapToolStateToStepState } from "../utils/tool-adapters"

function extractCommandSummary(cmd: string): string {
  return cmd.split("|").map((s) => s.trim().split(/\s+/)[0] ?? "").filter(Boolean).slice(0, 4).join(", ")
}

export function BashToolTerminalCard({
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
  useToolComplete(state === "animating", step.duration, onComplete)
  const isPending = state === "animating"
  const command = step.bashCommand ?? step.toolDetail
  const summary = extractCommandSummary(command)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-muted/30 overflow-hidden my-0.5"
    >
      <div className="flex items-center justify-between pl-2.5 pr-2 h-7">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {showIcon && <TerminalIcon className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />}
          {isPending ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0 truncate">
              Running command: {summary}
            </TextShimmer>
          ) : (
            <span className="text-xs text-muted-foreground truncate">Ran command: {summary}</span>
          )}
        </div>
        {isPending && (
          <svg className="w-3 h-3 text-muted-foreground animate-spin flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="7" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="border-t border-border px-2.5 py-1.5 font-mono text-[10px] leading-[16px] overflow-hidden">
        <div className="break-all">
          <span className="text-amber-600 dark:text-amber-400">$ </span>
          <span className="text-foreground">{command}</span>
        </div>
        {!isPending && step.bashOutput && (
          <div className="mt-1 text-muted-foreground whitespace-pre-line max-h-[80px] overflow-hidden">
            {step.bashOutput}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function BashToolMinimal({
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
  useToolComplete(state === "animating", step.duration, onComplete)

  return (
    <ToolRowBase
      size={size}
      icon={showIcon ? <TerminalIcon className="w-full h-full shrink-0 text-muted-foreground" /> : undefined}
      shimmerLabel="Bash"
      completeLabel="Bash"
      isAnimating={state === "animating"}
      detail={step.toolDetail}
    />
  )
}

export const BashTool = memo(function BashTool({
  part,
  chatStatus,
  variant = "terminal-card",
  showIcon = false,
}: {
  part: any
  chatStatus?: string
  variant?: "terminal-card" | "minimal"
  showIcon?: boolean
}) {
  const step = mapToolInvocationToStep(part.toolCallId ?? part.id ?? "bash", {
    toolName: "Bash",
    args: part.input ?? part.args ?? {},
    state: part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call",
    result: part.output ?? part.result,
  })
  const stepState = mapToolStateToStepState(
    part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call"
  )
  const noop = () => {}

  if (variant === "minimal") {
    return <BashToolMinimal step={step} state={stepState} onComplete={noop} showIcon={showIcon} />
  }
  return <BashToolTerminalCard step={step} state={stepState} onComplete={noop} showIcon={showIcon} />
})
