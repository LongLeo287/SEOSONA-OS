"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ThemeToggleProps {
  fillIcon?: boolean
}

export function ThemeToggle({ fillIcon = true }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          className="group bg-transparent data-[state=on]:!bg-transparent hover:bg-accent hover:!text-foreground"
          pressed={resolvedTheme === "dark"}
          onPressedChange={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          size="sm"
        >
          {resolvedTheme === "dark" ? (
            <Sun
              size={18}
              strokeWidth={2}
              className={`shrink-0 ${fillIcon ? "fill-current" : ""}`}
              aria-hidden="true"
            />
          ) : (
            <Moon
              size={18}
              strokeWidth={2}
              className={`shrink-0 ${fillIcon ? "fill-current" : ""}`}
              aria-hidden="true"
            />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p className="flex items-center gap-1.5">
          {resolvedTheme === "dark" ? "Light" : "Dark"} mode
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
