"use client"

import { useState, useEffect, useRef } from "react"

/**
 * Cross-fade hook for wizard step transitions.
 * Uses a two-phase mount → activate pattern so CSS transitions fire properly.
 * Steps that have been visited stay mounted to preserve their DOM height.
 */
export function useCrossFade<T extends string>(currentStep: T) {
  const [mountedSteps, setMountedSteps] = useState<Set<T>>(
    () => new Set([currentStep]),
  )
  const [activeStep, setActiveStep] = useState<T>(currentStep)
  const visitedStepsRef = useRef<Set<T>>(new Set([currentStep]))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    visitedStepsRef.current = new Set([...visitedStepsRef.current, currentStep])
    setMountedSteps(new Set(visitedStepsRef.current))

    // After a frame, activate the new step (CSS transition kicks in)
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setActiveStep(currentStep)
      })
      rafRef.current = raf2
    })

    return () => {
      cancelAnimationFrame(raf1)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [currentStep])

  return {
    mountedSteps,
    activeStep,
    stepsToRender: Array.from(mountedSteps),
  }
}
