import { useEffect, useRef, useState } from "react"

type UseHasScrolledParams = {
  scrollContainer?: HTMLElement | null
  /** Pixels beyond which we consider scroll started; defaults to 1px */
  threshold?: number
}

/**
 * Detects whether the user has scrolled past a threshold.
 * Uses requestAnimationFrame throttling for performance and cleans up listeners.
 */
export function useHasScrolled({
  scrollContainer,
  threshold = 1,
}: UseHasScrolledParams): boolean {
  const [hasScrolled, setHasScrolled] = useState(false)
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
      const top = getScrollTop()
      const scrolled = top > threshold
      setHasScrolled(scrolled)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      // Batch read/update with the next animation frame
      requestAnimationFrame(update)
    }

    // Initial measure to avoid false positives on mount
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
  }, [scrollContainer, threshold])

  return hasScrolled
}
