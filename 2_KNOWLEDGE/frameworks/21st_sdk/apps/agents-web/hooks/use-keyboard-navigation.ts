"use client"

import { useEffect, useRef, useState } from "react"

export type FocusArea = "input" | "tabs" | "content"

export function useKeyboardNavigation<
  T extends HTMLElement = HTMLButtonElement,
>(tabs: string[]) {
  const [focusArea, setFocusArea] = useState<FocusArea>("input")
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const tabRefs = useRef<(T | null)[]>([])
  const commandListRef = useRef<HTMLDivElement>(null)

  // Ensure DOM focus follows roving selection on tabs
  useEffect(() => {
    if (focusArea === "tabs") {
      const el = tabRefs.current[selectedTabIndex]
      if (el && document.activeElement !== el) {
        try {
          el.focus()
        } catch {
          // ignore
        }
      }
    }
  }, [selectedTabIndex, focusArea])

  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (focusArea === "tabs") {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        setSelectedTabIndex((prev) => Math.min(prev + 1, tabs.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        setSelectedTabIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        e.stopPropagation()
        try {
          tabRefs.current[selectedTabIndex]?.blur()
        } catch {}
        setFocusArea("content")
        setTimeout(() => {
          commandListRef.current?.focus()
          try {
            const listRoot = commandListRef.current?.closest(
              "[cmdk-root]",
            ) as HTMLElement | null
            if (listRoot) {
              const event = new KeyboardEvent("keydown", {
                key: "Home",
                bubbles: true,
              })
              listRoot.dispatchEvent(event)
            }
          } catch {}
        }, 0)
      }
    } else if (focusArea === "content") {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        e.stopPropagation()
        setFocusArea("tabs")
        setTimeout(() => tabRefs.current[selectedTabIndex]?.focus(), 0)
      }
    }
  }

  return {
    focusArea,
    setFocusArea,
    selectedTabIndex,
    setSelectedTabIndex,
    tabRefs,
    commandListRef,
    onDialogKeyDown,
  }
}
