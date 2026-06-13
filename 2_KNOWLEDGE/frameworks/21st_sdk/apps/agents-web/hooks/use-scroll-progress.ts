import { useEffect, useRef, useState } from "react"

type UseScrollProgressParams = {
  scrollContainer?: HTMLElement | null
  /** Maximum scroll distance for the effect (default 40px) */
  maxScroll?: number
}

/**
 * Returns scroll progress from 0 to 1 based on scroll position.
 * Uses requestAnimationFrame throttling for performance.
 */
export function useScrollProgress({
  scrollContainer,
  maxScroll = 40,
}: UseScrollProgressParams): number {
  const [scrollProgress, setScrollProgress] = useState(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const target: Window | HTMLElement = scrollContainer ?? window

    const getScrollTop = (): number => {
      if (scrollContainer) return scrollContainer.scrollTop
      return (
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      )
    }

    const update = () => {
      tickingRef.current = false
      const scrollY = getScrollTop()
      const progress = Math.min(scrollY / maxScroll, 1) // 0 to 1
      setScrollProgress(progress)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      // Batch read/update with the next animation frame
      requestAnimationFrame(update)
    }

    // Initial measure
    update()

    // Add listener with passive flag for better scroll performance
    if (target instanceof Window) {
      target.addEventListener("scroll", onScroll, { passive: true })
      return () => {
        target.removeEventListener("scroll", onScroll)
      }
    } else {
      target.addEventListener("scroll", onScroll, {
        passive: true,
      } as AddEventListenerOptions)
      return () => {
        target.removeEventListener("scroll", onScroll as EventListener)
      }
    }
  }, [scrollContainer, maxScroll])

  return scrollProgress
}
