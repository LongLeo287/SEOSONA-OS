import { useEffect, useRef, useState } from "react"

export function useIdle(timeoutMs = 5 * 60 * 1000) {
  const [isIdle, setIsIdle] = useState(false)
  const t = useRef<number | null>(null)
  const resetTimer = () => {
    if (t.current) window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setIsIdle(true), timeoutMs)
  }

  const markActive = () => {
    if (document.hidden) return // still away
    if (isIdle) setIsIdle(false)
    resetTimer()
  }

  useEffect(() => {
    // start
    resetTimer()

    const opts: AddEventListenerOptions = { passive: true, capture: true }
    const onVisible = () => (document.hidden ? null : markActive())

    window.addEventListener("focus", markActive, opts)
    window.addEventListener("blur", markActive, opts)
    document.addEventListener("visibilitychange", onVisible, opts)
    window.addEventListener("pointerdown", markActive, opts)
    window.addEventListener("keydown", markActive, opts)
    window.addEventListener("wheel", markActive, opts) // optional

    return () => {
      if (t.current) window.clearTimeout(t.current)
      window.removeEventListener("focus", markActive, opts)
      window.removeEventListener("blur", markActive, opts)
      document.removeEventListener("visibilitychange", onVisible, opts)
      window.removeEventListener("pointerdown", markActive, opts)
      window.removeEventListener("keydown", markActive, opts)
      window.removeEventListener("wheel", markActive, opts)
    }
  }, [timeoutMs, isIdle])

  return isIdle
}
