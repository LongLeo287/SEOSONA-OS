"use client"

import type { Transition, Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import { forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"

export interface PanelLeftCloseIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface PanelLeftCloseIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const defaultTransition: Transition = {
  times: [0, 0.4, 1],
  duration: 0.5,
}

const pathVariants: Variants = {
  normal: { x: 0 },
  animate: { x: [0, -1.5, 0] },
}

const PanelLeftCloseIcon = forwardRef<
  PanelLeftCloseIconHandle,
  PanelLeftCloseIconProps
>(({ className, size = 28, ...props }, ref) => {
  const controls = useAnimation()

  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
  }))

  return (
    <div className={cn(className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <motion.path
          transition={defaultTransition}
          variants={pathVariants}
          animate={controls}
          initial="normal"
          d="m16 15-3-3 3-3"
        />
      </svg>
    </div>
  )
})

PanelLeftCloseIcon.displayName = "PanelLeftCloseIcon"

export { PanelLeftCloseIcon }
