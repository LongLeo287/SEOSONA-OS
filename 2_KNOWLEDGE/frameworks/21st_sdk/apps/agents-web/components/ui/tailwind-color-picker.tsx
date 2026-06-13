"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { tailwindColors } from "@/lib/utils/tailwind-colors"
import { useEffect, useRef } from "react"

interface TailwindColorPickerProps {
  selectedColor?: string
  onColorSelect: (colorName: string, colorValue: string) => void
  autoFocus?: boolean
  onClose?: () => void
}

export function TailwindColorPicker({
  selectedColor,
  onColorSelect,
  autoFocus = false,
  onClose,
}: TailwindColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Небольшая задержка чтобы компонент успел отрендериться
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [autoFocus])

  return (
    <Command className="h-full flex flex-col">
      <div
        className="flex items-center bg-muted rounded-md mx-1 mt-2 px-2 flex-shrink-0"
        cmdk-input-wrapper=""
      >
        <CommandInput
          ref={inputRef}
          placeholder="Search Tailwind colors..."
          className="h-7 text-xs border-0 bg-transparent px-0 focus:ring-0"
        />
      </div>
      <CommandList className="flex-1 overflow-y-auto">
        <CommandEmpty>
          <div className="text-xs text-muted-foreground">No color found</div>
        </CommandEmpty>
        {Object.entries(tailwindColors).map(([colorFamily, shades]) => (
          <CommandGroup
            key={colorFamily}
            heading={colorFamily.charAt(0).toUpperCase() + colorFamily.slice(1)}
          >
            {Object.entries(shades).map(([shade, hex]) => {
              const colorKey = `${colorFamily}-${shade}`
              return (
                <CommandItem
                  key={colorKey}
                  value={colorKey}
                  onSelect={() => {
                    onColorSelect(colorKey, hex)
                    onClose?.()
                  }}
                  className="cursor-pointer flex items-center gap-2 justify-between text-xs py-1.5"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      aria-label={`Select color ${colorKey}`}
                      title={colorKey}
                      className="group relative cursor-pointer rounded-md border transition-all hover:z-10 hover:scale-110 hover:shadow-lg size-5"
                      style={{ backgroundColor: hex }}
                    >
                      <div className="group-hover:ring-foreground/50 absolute inset-0 rounded-[inherit] ring-2 ring-transparent transition-all duration-200"></div>
                    </button>
                    <span className="whitespace-nowrap font-medium">
                      {colorKey}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "h-3 w-3 shrink-0",
                      selectedColor === colorKey ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  )
}
