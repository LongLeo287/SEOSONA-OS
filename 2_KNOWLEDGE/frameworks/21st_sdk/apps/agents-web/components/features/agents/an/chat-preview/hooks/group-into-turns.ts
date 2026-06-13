import type { TimelineStep, Turn } from "../types/timeline"

export function groupIntoTurns(steps: TimelineStep[]): Turn[] {
  const turns: Turn[] = []
  let current: Turn | null = null

  for (const step of steps) {
    if (step.type === "user-message") {
      if (current) turns.push(current)
      current = { userStep: step, steps: [step] }
    } else {
      if (!current) current = { steps: [] }
      current.steps.push(step)
    }
  }
  if (current) turns.push(current)
  return turns
}
