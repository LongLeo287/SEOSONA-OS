"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Mini canvas preview component
function CanvasPreview({ mode }: { mode: "light" | "dark" }) {
  const isDark = mode === "dark"

  // Single color for all UI element mockups (lighter, closer to background)
  const elementColor = isDark ? "bg-neutral-700" : "bg-neutral-200"

  return (
    <div
      className={cn(
        "w-full aspect-[16/10] rounded-sm overflow-hidden",
        isDark ? "bg-[#1a1a1a]" : "bg-white",
      )}
    >
      <div className="h-full flex">
        {/* Left sidebar mockup */}
        <div
          className={cn(
            "w-[22%] h-full flex flex-col",
            isDark ? "bg-[#0f0f0f]" : "bg-neutral-50",
          )}
        >
          {/* Logo area */}
          <div className="px-1 pt-1 flex items-center gap-0.5">
            <div className={cn("w-1 h-1 rounded-[1px]", elementColor)} />
            <div className={cn("w-4 h-1 rounded-[1px]", elementColor)} />
          </div>

          {/* Pages section */}
          <div className="px-1 mt-1.5">
            <div
              className={cn("w-5 h-0.5 rounded-[1px] mb-0.5", elementColor)}
            />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn("h-1.5 rounded-[1px] mb-0.5", elementColor)}
              />
            ))}
          </div>

          {/* Variants section */}
          <div className="px-1 mt-1.5">
            <div
              className={cn("w-6 h-0.5 rounded-[1px] mb-0.5", elementColor)}
            />
            <div className={cn("h-3 rounded-[1px]", elementColor)} />
          </div>
        </div>

        {/* Canvas area */}
        <div
          className={cn(
            "flex-1 h-full relative py-0.5",
            isDark ? "bg-[#0f0f0f]" : "bg-neutral-50",
          )}
        >
          {/* Inner canvas with rounded corners */}
          <div
            className={cn(
              "w-full h-full rounded-[2px] relative",
              isDark ? "bg-[#1a1a1a]" : "bg-neutral-100",
            )}
          >
            {/* Bottom toolbar */}
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
              <div className={cn("w-6 h-1 rounded-[2px]", elementColor)} />
            </div>
          </div>
        </div>

        {/* Right sidebar mockup */}
        <div
          className={cn(
            "w-[28%] h-full flex flex-col",
            isDark ? "bg-[#0f0f0f]" : "bg-neutral-50",
          )}
        >
          {/* Chat messages area */}
          <div className="flex-1 px-1 pt-1 space-y-0.5">
            <div className={cn("w-full h-2 rounded-[1px]", elementColor)} />
            <div className={cn("w-[70%] h-1.5 rounded-[1px]", elementColor)} />
          </div>

          {/* Chat input */}
          <div className="px-1 pb-1">
            <div className={cn("h-3 rounded-[2px]", elementColor)} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Theme card component
function ThemeCard({
  isSelected,
  onClick,
  mode,
}: {
  isSelected: boolean
  onClick: () => void
  mode: "light" | "dark" | "system"
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-2 bg-transparent outline-none"
    >
      {/* Preview container with muted background */}
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-200 bg-muted",
          "aspect-[16/10] flex items-center justify-center p-3",
          "ring-2 ring-offset-2 ring-offset-background",
          // Focus styles (only on keyboard focus)
          "group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring/70",
          isSelected
            ? "ring-primary"
            : "ring-transparent hover:ring-muted-foreground/30",
        )}
      >
        {/* Scaled down mockup */}
        <div className="w-full scale-[0.85]">
          {mode === "system" ? (
            <div className="w-full aspect-[16/10] overflow-hidden rounded-sm">
              {/* Split view for system theme */}
              <div className="h-full flex">
                <div className="w-1/2 overflow-hidden">
                  <div className="w-[200%] h-full">
                    <CanvasPreview mode="light" />
                  </div>
                </div>
                <div className="w-1/2 overflow-hidden">
                  <div className="w-[200%] h-full -translate-x-1/2">
                    <CanvasPreview mode="dark" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CanvasPreview mode={mode} />
          )}
        </div>
      </div>
    </button>
  )
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { value: "light", mode: "light" as const },
    { value: "dark", mode: "dark" as const },
    { value: "system", mode: "system" as const },
  ]

  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left text-sm font-semibold text-foreground">
          Appearance
        </div>
        <div className="h-[200px] animate-pulse bg-muted rounded-lg" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 text-center sm:text-left text-sm font-semibold text-foreground">
        Appearance
      </div>

      {/* Theme Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Theme</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose how 21st.dev looks for you.
          </p>
        </div>

        {/* Theme cards grid */}
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <ThemeCard
              key={t.value}
              isSelected={theme === t.value}
              onClick={() => setTheme(t.value)}
              mode={t.mode}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
