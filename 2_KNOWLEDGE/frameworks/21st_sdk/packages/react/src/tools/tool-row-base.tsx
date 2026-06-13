import type { ReactNode } from "react"
import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { TextShimmer } from "../components/text-shimmer"
import type { ToolSize } from "../types/tool-styles"
import { TOOL_ROW_STYLES } from "../types/tool-styles"
import { ChevronRightIcon } from "../icons/tool-icons"

interface ToolRowBaseProps {
  size?: ToolSize
  icon?: ReactNode
  shimmerLabel?: string
  completeLabel: string
  isAnimating: boolean
  detail?: string
  trailingContent?: ReactNode
  expandable?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
  showChevronOnHoverOnly?: boolean
  children?: ReactNode
}

export function ToolRowBase({
  size = "normal",
  icon,
  shimmerLabel,
  completeLabel,
  isAnimating,
  detail,
  trailingContent,
  expandable = false,
  expanded = false,
  onToggleExpand,
  showChevronOnHoverOnly = false,
  children,
}: ToolRowBaseProps) {
  const s = TOOL_ROW_STYLES[size]
  const isComplete = !isAnimating
  const canToggle = expandable && (isComplete || expanded)

  const motionProps = {
    initial: { opacity: 0, y: 2 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  }
  const expandMotionProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  }

  return (
    <motion.div {...motionProps}>
      <div
        className={`group flex items-center ${s.container} rounded-md w-fit select-none`}
        style={{ cursor: canToggle ? "pointer" : "default" }}
        onClick={canToggle ? onToggleExpand : undefined}
      >
        {icon && (
          <div className={`flex items-center justify-center ${s.iconContainer} shrink-0`}>
            {icon}
          </div>
        )}
        <div className={`${s.text} ${s.textColor} flex items-center gap-1.5 min-w-0`}>
          <span className="font-medium whitespace-nowrap shrink-0">
            {isAnimating && shimmerLabel ? (
              <TextShimmer as="span" duration={1.2} className={s.shimmerClass}>
                {shimmerLabel}
              </TextShimmer>
            ) : (
              completeLabel
            )}
          </span>
          {detail && (
            <span className="font-normal truncate min-w-0" style={{ color: "color-mix(in srgb, var(--an-foreground-muted) 60%, transparent)" }}>{detail}</span>
          )}
          {trailingContent}
        </div>
        {expandable && (isComplete || expanded) && (
          <div className={showChevronOnHoverOnly && !expanded ? "opacity-0 group-hover:opacity-100 transition-opacity" : ""}>
            <ChevronRightIcon expanded={expanded} />
          </div>
        )}
      </div>

      {expandable && (
        <AnimatePresence>
          {expanded && children && (
            <motion.div
              {...expandMotionProps}
              className={`overflow-hidden ${icon ? s.expandedPl : ""}`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
