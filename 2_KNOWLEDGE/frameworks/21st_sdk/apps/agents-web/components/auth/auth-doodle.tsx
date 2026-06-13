"use client"

import { motion, Target, Transition } from "motion/react"
import { cn } from "@/lib/utils"

interface AuthDoodleProps {
  initial?: Target
  transition?: Transition
  className: string
  children: React.ReactNode
}

export function AuthDoodle({
  className,
  children,
  initial,
  transition,
}: AuthDoodleProps) {
  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      initial={{
        opacity: 0,
        scale: 0.5,
        ...initial,
      }}
      viewport={{
        once: true,
      }}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 15,
          delay: 1 + Math.random(),
          ...transition,
        },
      }}
    >
      {children}
    </motion.div>
  )
}
