"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { IconMoon, IconSun } from "./icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-7 w-7" />
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-[background-color,color,border-color,transform] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.97]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <div className="relative h-3.5 w-3.5">
        {/* Sun — visible in dark mode */}
        <div
          className={cn(
            "absolute inset-0 transition-[opacity,transform] duration-200 ease-out",
            isDark ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <IconSun className="h-3.5 w-3.5" />
        </div>

        {/* Moon — visible in light mode */}
        <div
          className={cn(
            "absolute inset-0 transition-[opacity,transform] duration-200 ease-out",
            !isDark ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <IconMoon className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  )
}
