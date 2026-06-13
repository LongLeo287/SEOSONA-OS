"use client"

import type { Variants } from "motion/react"
import { motion, AnimationControls } from "motion/react"

const arrowVariants: Variants = {
  normal: { y: 0 },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      mass: 1,
    },
  },
}

const UploadIcon = ({
  size = 28,
  controls,
  className,
}: {
  size?: number
  controls: AnimationControls
  className?: string
}) => {
  return (
    <div
      className={`select-none rounded-md transition-colors duration-200 flex items-center justify-center ${className}`}
    >
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <motion.g variants={arrowVariants} animate={controls} initial="normal">
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </motion.g>
      </svg>
    </div>
  )
}

export { UploadIcon }
