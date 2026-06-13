"use client"

import { useCallback, useRef, useEffect } from "react"

export function useContainerHeight() {
  const observerRef = useRef<ResizeObserver | null>(null)

  const scrollRefCallback = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (el) {
      el.style.setProperty("--chat-container-height", `${el.clientHeight}px`)
      const observer = new ResizeObserver((entries) => {
        const height = entries[0]?.contentRect.height ?? 0
        el.style.setProperty("--chat-container-height", `${height}px`)
      })
      observer.observe(el)
      observerRef.current = observer
    }
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  return scrollRefCallback
}
