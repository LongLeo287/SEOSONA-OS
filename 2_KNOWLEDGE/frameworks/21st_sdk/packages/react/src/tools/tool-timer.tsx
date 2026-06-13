import type { TimelineStep, StepState } from "../types/timeline"
import { useToolComplete } from "../hooks/use-tool-complete"

export function ToolTimer({ step, state, onComplete }: { step: Extract<TimelineStep, { type: "tool-call" }>; state: StepState; onComplete: () => void }) {
  useToolComplete(state === "animating", step.duration, onComplete)
  return null
}
