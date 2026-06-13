import { useState } from "react"

type Product = "magic" | "21st"

const USAGE_KEYS = {
  "21st": "21st_usage_count",
  magic: "magic_usage_count",
} as const

const FEEDBACK_KEYS = {
  "21st": "feedback_submitted_21st",
  magic: "feedback_submitted_magic",
} as const

const TRIGGER_COUNT = 3

export function useFeedbackPrompt(product: Product) {
  const [showDialog, setShowDialog] = useState(false)

  const incrementUsage = (): boolean => {
    // PMF survey is currently disabled
    return false
  }

  const resetUsage = () => {
    localStorage.removeItem(USAGE_KEYS[product])
  }

  const getCurrentUsage = () => {
    return parseInt(localStorage.getItem(USAGE_KEYS[product]) || "0", 10)
  }

  return {
    showDialog,
    setShowDialog,
    incrementUsage,
    resetUsage,
    getCurrentUsage,
  }
}
