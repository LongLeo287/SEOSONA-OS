import * as React from "react"

export function useMediaQuery(query: string) {
  // Initialize with undefined to avoid SSR mismatch, then set actual value
  const [value, setValue] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches) // Set initial value

    return () => result.removeEventListener("change", onChange)
  }, [query])

  // Return false during SSR/first render, then actual value
  return value ?? false
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

// Detect if device has touch capability (for distinguishing mobile touch vs desktop narrow screen)
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    // Check for touch capability using pointer: coarse (touch) vs pointer: fine (mouse)
    const isTouchDevice =
      matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0

    setIsTouch(isTouchDevice)
  }, [])

  return isTouch
}

// Returns true for narrow screens (both mobile and desktop narrow)
export function useIsNarrowScreen(): boolean {
  return useMediaQuery("(max-width: 768px)")
}
