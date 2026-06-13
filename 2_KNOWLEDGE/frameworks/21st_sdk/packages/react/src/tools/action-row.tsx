import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import { useToolComplete } from "../hooks/use-tool-complete"
import { SpinnerIcon16, CheckIcon16 } from "../icons/tool-icons"
import { ToolRowBase } from "./tool-row-base"

const ACTION_LABELS = ["Brewing...", "Crafting...", "Working...", "Preparing..."]

export function ActionRow({
  step,
  state,
  onComplete,
  index,
  showIcon,
  size = "normal",
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
  index: number
  showIcon: boolean
  size?: ToolSize
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isAnimating = state === "animating"
  const label = ACTION_LABELS[index % ACTION_LABELS.length]!

  return (
    <ToolRowBase
      size={size}
      icon={showIcon ? (
        isAnimating
          ? <SpinnerIcon16 className="w-full h-full shrink-0 animate-spin text-muted-foreground" />
          : <CheckIcon16 className="w-full h-full shrink-0 text-muted-foreground" />
      ) : undefined}
      shimmerLabel={label}
      completeLabel={step.toolName}
      isAnimating={isAnimating}
    />
  )
}
