import { useState, useEffect, useCallback, useRef } from "react"
import type { UIMessage } from "ai"

interface ReplayOptions {
  messages: UIMessage[]
  /** Timing for each message appearance (ms). Default: auto-calculated from message role */
  timing?: number[]
  /** Whether the replay is paused */
  paused?: boolean
}

interface ReplayState {
  visibleMessages: UIMessage[]
  isComplete: boolean
  replay: () => void
  /** Current status: "streaming" while messages are being revealed, "ready" when done */
  status: "streaming" | "ready"
  /** The input-typing step that's currently active (for typing animation) */
  activeTyping: { text: string; duration: number; image?: string } | null
  onTypingComplete: () => void
}

export function useMessageReplay({ messages, timing, paused }: ReplayOptions): ReplayState {
  const [visibleCount, setVisibleCount] = useState(0)
  const [activeTyping, setActiveTyping] = useState<{ text: string; duration: number; image?: string } | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const mountedRef = useRef(true)

  const delays = timing ?? messages.map((msg) => {
    if (msg.role === "user") return 1_800
    return 300
  })

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const startReplay = useCallback(() => {
    cleanup()
    mountedRef.current = true
    setVisibleCount(0)
    setActiveTyping(null)

    let elapsed = 0
    messages.forEach((_, i) => {
      const delay = delays[i] ?? 500
      elapsed += delay
      const t = setTimeout(() => {
        if (!mountedRef.current) return
        setVisibleCount(i + 1)
      }, elapsed)
      timersRef.current.push(t)
    })
  }, [messages, delays, cleanup])

  useEffect(() => {
    if (!paused) startReplay()
    return () => { mountedRef.current = false; cleanup() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const replay = useCallback(() => {
    startReplay()
  }, [startReplay])

  const visibleMessages = messages.slice(0, visibleCount)
  const isComplete = visibleCount >= messages.length
  const status = isComplete ? "ready" as const : "streaming" as const

  const onTypingComplete = useCallback(() => {
    setActiveTyping(null)
  }, [])

  return { visibleMessages, isComplete, replay, status, activeTyping, onTypingComplete }
}
