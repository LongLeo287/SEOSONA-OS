"use client"

import type { TimelineStep, StepState } from "../../types/timeline"
import type { ToolSize } from "../../types/theme"
import { useToolComplete } from "../../hooks"
import { SpinnerIcon16, CheckIcon16 } from "../../icons"
import { ToolRowBase } from "./tool-row-base"

export function GenericToolRow({
  step,
  state,
  onComplete,
  showIcon = false,
  size = "compact",
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  showIcon?: boolean
  size?: ToolSize
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isPending = state === "animating"

  return (
    <ToolRowBase
      size={size}
      icon={showIcon ? (
        isPending
          ? <SpinnerIcon16 className="w-full h-full shrink-0 animate-spin text-muted-foreground" />
          : <CheckIcon16 className="w-full h-full shrink-0 text-muted-foreground" />
      ) : undefined}
      shimmerLabel={step.toolName}
      completeLabel={step.toolName}
      isAnimating={isPending}
      detail={step.toolDetail}
    />
  )
}
