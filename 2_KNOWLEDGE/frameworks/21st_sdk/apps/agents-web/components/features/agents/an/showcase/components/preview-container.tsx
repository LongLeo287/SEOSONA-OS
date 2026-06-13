"use client"

import { useRef, useEffect } from "react"
import type { AnTheme } from "@21st-sdk/react"
import { applyTheme, extractThemeConfig, ThemeConfigContext } from "@21st-sdk/react"

interface PreviewContainerProps {
  theme?: AnTheme
  colorMode?: "light" | "dark"
  children: React.ReactNode
  className?: string
  label?: string
  height?: string
}

export function PreviewContainer({
  theme,
  colorMode = "light",
  children,
  className = "",
  label,
  height = "auto",
}: PreviewContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !theme) return
    applyTheme(containerRef.current, theme, colorMode)
  }, [theme, colorMode])

  const themeConfig = theme ? extractThemeConfig(theme) : extractThemeConfig(undefined)

  return (
    <div className="flex flex-col">
      {label && (
        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
          {label}
        </div>
      )}
      <ThemeConfigContext.Provider value={themeConfig}>
        <div
          ref={containerRef}
          className={`an-root border border-gray-200 rounded-lg overflow-hidden ${className}`}
          style={{
            fontFamily: "var(--an-font-family, system-ui, sans-serif)",
            fontSize: "var(--an-text-size, 14px)",
            color: "var(--an-foreground, #1a1a1a)",
            backgroundColor: "var(--an-background, #ffffff)",
            height,
          }}
        >
          {children}
        </div>
      </ThemeConfigContext.Provider>
    </div>
  )
}
