"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function ThemeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      className={className}
      style={{ transform: "rotate(-45deg)" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M5 20L19 5" />
      <path d="M16 9L22 13.8528" />
      <path d="M12.4128 12.4059L19.3601 18.3634" />
      <path d="M8 15.6672L15 21.5" />
    </svg>
  )
}

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
      className="an-focus-btn flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <ThemeIcon className="size-4" />
    </button>
  )
}
