import React, { memo } from "react"
import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import { useToolComplete } from "../hooks/use-tool-complete"
import { SpinnerIcon16, CheckIcon16 } from "../icons/tool-icons"
import { ToolRowBase } from "./tool-row-base"
import { useThemeConfig } from "../theme-config"

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

export const GenericTool = memo(function GenericTool({
  icon,
  title,
  subtitle,
  tooltipContent,
  isPending,
  isError,
  showIcon = false,
  size,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  subtitle?: string
  tooltipContent?: string
  isPending: boolean
  isError: boolean
  showIcon?: boolean
  size?: ToolSize
}) {
  const config = useThemeConfig()
  const resolvedSize = size ?? (config.toolCallStyle === "compact" ? "compact" : "normal")
  const Icon = icon

  return (
    <ToolRowBase
      size={resolvedSize as ToolSize}
      icon={showIcon && Icon ? <Icon className="w-full h-full shrink-0 text-muted-foreground" /> : showIcon ? (
        isPending
          ? <SpinnerIcon16 className="w-full h-full shrink-0 animate-spin text-muted-foreground" />
          : <CheckIcon16 className="w-full h-full shrink-0 text-muted-foreground" />
      ) : undefined}
      shimmerLabel={title}
      completeLabel={title}
      isAnimating={isPending}
      detail={subtitle}
    />
  )
})
