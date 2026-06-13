"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { TimelineStep, StepState } from "../types/timeline"

export function useAnimationTimeline(steps: TimelineStep[], options?: { paused?: boolean }) {
  const paused = options?.paused ?? false
  const [started, setStarted] = useState(!paused)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stepStates, setStepStates] = useState<Record<string, StepState>>(() => {
    const init: Record<string, StepState> = {}
    steps.forEach((s, i) => { init[s.id] = (i === 0 && !paused) ? "animating" : "pending" })
    return init
  })
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const mountedRef = useRef(true)
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const start = useCallback(() => {
    if (started) return
    setStarted(true)
    setStepStates((prev) => ({ ...prev, [steps[0]!.id]: "animating" }))
  }, [started, steps])

  useEffect(() => {
    if (!paused && !started) start()
  }, [paused, started, start])

  const advance = useCallback((fromIndex: number) => {
    if (!mountedRef.current) return
    if (fromIndex !== currentIndexRef.current) return
    const nextIndex = fromIndex + 1

    setStepStates((prev) => ({
      ...prev,
      [steps[fromIndex]!.id]: "complete",
      ...(nextIndex < steps.length ? { [steps[nextIndex]!.id]: "animating" } : {}),
    }))
    setCurrentIndex(nextIndex)
    currentIndexRef.current = nextIndex

    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex]!
      if (nextStep.type === "pause") {
        const t = setTimeout(() => advance(nextIndex), nextStep.duration)
        timersRef.current.push(t)
      }
    }
  }, [steps])

  const onStepComplete = useCallback((stepId: string) => {
    const idx = steps.findIndex((s) => s.id === stepId)
    if (idx === -1 || idx !== currentIndexRef.current) return
    advance(idx)
  }, [steps, advance])

  useEffect(() => {
    if (!started) return
    const first = steps[0]
    if (first && (first.type === "pause")) {
      const t = setTimeout(() => advance(0), first.duration)
      timersRef.current.push(t)
    }
    return () => { mountedRef.current = false; cleanup() }
  }, [started]) // eslint-disable-line react-hooks/exhaustive-deps

  const replay = useCallback(() => {
    cleanup()
    mountedRef.current = true
    const init: Record<string, StepState> = {}
    steps.forEach((s, i) => { init[s.id] = i === 0 ? "animating" : "pending" })
    setStepStates(init)
    setCurrentIndex(0)
    currentIndexRef.current = 0
    setStarted(true)
    queueMicrotask(() => {
      if (steps[0]!.type === "pause") {
        const t = setTimeout(() => advance(0), steps[0]!.duration)
        timersRef.current.push(t)
      }
    })
  }, [steps, advance, cleanup])

  const visibleSteps = steps.filter(
    (s, i) => i <= currentIndex && s.type !== "pause" && s.type !== "input-typing",
  )

  const activeInputStep = currentIndex < steps.length
    ? (steps[currentIndex]!.type === "input-typing" && stepStates[steps[currentIndex]!.id] === "animating"
      ? (steps[currentIndex] as Extract<TimelineStep, { type: "input-typing" }>)
      : null)
    : null

  const isComplete = currentIndex >= steps.length

  return { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep }
}
