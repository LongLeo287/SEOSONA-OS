import React, { memo } from "react"
import { motion } from "motion/react"
import { TextShimmer } from "../components/text-shimmer"
import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import { useToolComplete } from "../hooks/use-tool-complete"
import { FileExtIcon } from "../icons/file-ext-icon"
import { ToolRowBase } from "./tool-row-base"
import { mapToolInvocationToStep, mapToolStateToStepState } from "../utils/tool-adapters"

export function EditToolDiffCard({
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
  const fileName = step.filePath?.split("/").pop() ?? step.toolDetail
  const isWrite = step.toolName === "Write"
  const actionLabel = isWrite ? (isPending ? "Creating" : "Created") : (isPending ? "Editing" : "Edited")

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-border bg-muted/30 overflow-hidden my-0.5"
    >
      <div className="flex items-center justify-between pl-2.5 pr-2 h-7">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {showIcon && <FileExtIcon filename={fileName} className="w-3 h-3 flex-shrink-0" />}
          {isPending ? (
            <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0 truncate">
              {actionLabel} {fileName}
            </TextShimmer>
          ) : (
            <span className="text-xs text-muted-foreground truncate">
              {actionLabel} <span>{fileName}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {step.diffStats && !isPending && (
            <span className="text-[10px] font-mono">
              {step.diffStats.includes("+") && (
                <span className="text-green-600 dark:text-green-400">{step.diffStats.split(" ")[0]}</span>
              )}
              {step.diffStats.includes("-") && (
                <span className="text-red-600 dark:text-red-400 ml-1">{step.diffStats.split(" ").find((s: string) => s.startsWith("-"))}</span>
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
      {step.diffLines && step.diffLines.length > 0 && (
        <div className="border-t border-border font-mono text-[10px] leading-[18px] max-h-[72px] overflow-y-auto overscroll-contain">
          {step.diffLines.map((line, i) => (
            <div
              key={i}
              className={`px-2.5 ${
                line.type === "add"
                  ? "bg-green-500/10 dark:bg-green-500/15 border-l-2 border-green-500/50 text-green-700 dark:text-green-300"
                  : line.type === "remove"
                    ? "bg-red-500/10 dark:bg-red-500/15 border-l-2 border-red-500/50 text-red-700 dark:text-red-300"
                    : "border-l-2 border-transparent text-muted-foreground"
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

export function EditToolMinimal({
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
  const fileName = step.filePath?.split("/").pop() ?? step.toolDetail

  return (
    <ToolRowBase
      size={size}
      icon={showIcon ? <FileExtIcon filename={fileName} className="w-full h-full shrink-0" /> : undefined}
      shimmerLabel={step.toolName}
      completeLabel={step.toolName}
      isAnimating={state === "animating"}
      detail={fileName}
    />
  )
}

export const EditTool = memo(function EditTool({
  part,
  chatStatus,
  variant = "diff-card",
  showIcon = false,
}: {
  part: any
  chatStatus?: string
  variant?: "diff-card" | "minimal"
  showIcon?: boolean
}) {
  const toolName = (part.type as string)?.replace("tool-", "") || "Edit"
  const step = mapToolInvocationToStep(part.toolCallId ?? part.id ?? "edit", {
    toolName,
    args: part.input ?? part.args ?? {},
    state: part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call",
    result: part.output ?? part.result,
  })
  const stepState = mapToolStateToStepState(
    part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call"
  )
  const noop = () => {}

  if (variant === "minimal") {
    return <EditToolMinimal step={step} state={stepState} onComplete={noop} showIcon={showIcon} />
  }
  return <EditToolDiffCard step={step} state={stepState} onComplete={noop} showIcon={showIcon} />
})
