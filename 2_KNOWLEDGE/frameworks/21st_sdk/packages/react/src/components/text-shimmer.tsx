import React, { useMemo, useState, useEffect, type JSX } from "react"
import { motion } from "motion/react"
import { cn } from "../utils/cn"

interface TextShimmerProps {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
  duration?: number
  spread?: number
  delay?: number
}

function TextShimmerComponent({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
  delay = 0,
}: TextShimmerProps) {
  const [shouldAnimate, setShouldAnimate] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, delay * 1_000)
      return () => clearTimeout(timer)
    }
  }, [delay])

  const dynamicSpread = useMemo(() => {
    if (typeof children === "string") {
      return children.length * spread
    }
    return 50 * spread
  }, [children, spread])

  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements)
  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={shouldAnimate ? { backgroundPosition: "0% center" } : { backgroundPosition: "100% center" }}
      transition={{
        repeat: shouldAnimate ? Infinity : 0,
        duration,
        ease: "linear",
      }}
      style={{
        "--spread": `${dynamicSpread}px`,
        backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
      } as React.CSSProperties}
    >
      {children}
    </MotionComponent>
  )
}

export const TextShimmer = React.memo(TextShimmerComponent)
