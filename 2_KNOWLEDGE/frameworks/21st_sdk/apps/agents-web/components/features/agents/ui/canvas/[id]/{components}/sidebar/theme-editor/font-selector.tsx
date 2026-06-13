"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "../../ui/command"

// Comprehensive Google Fonts lists
export const SANS_SERIF_FONTS = [
  { value: "ui-sans-serif, system-ui, sans-serif", label: "System UI" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Nunito, sans-serif", label: "Nunito" },
  { value: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
  { value: "Ubuntu, sans-serif", label: "Ubuntu" },
  { value: "PT Sans, sans-serif", label: "PT Sans" },
  { value: "Oswald, sans-serif", label: "Oswald" },
  { value: "Raleway, sans-serif", label: "Raleway" },
  { value: "Noto Sans, sans-serif", label: "Noto Sans" },
  { value: "Work Sans, sans-serif", label: "Work Sans" },
  { value: "Fira Sans, sans-serif", label: "Fira Sans" },
  { value: "Rubik, sans-serif", label: "Rubik" },
  { value: "Karla, sans-serif", label: "Karla" },
  { value: "Outfit, sans-serif", label: "Outfit" },
  { value: "Plus Jakarta Sans, sans-serif", label: "Plus Jakarta Sans" },
  { value: "DM Sans, sans-serif", label: "DM Sans" },
  { value: "Quicksand, sans-serif", label: "Quicksand" },
  { value: "Lexend, sans-serif", label: "Lexend" },
  { value: "Manrope, sans-serif", label: "Manrope" },
  { value: "Space Grotesk, sans-serif", label: "Space Grotesk" },
  { value: "IBM Plex Sans, sans-serif", label: "IBM Plex Sans" },
  { value: "Red Hat Display, sans-serif", label: "Red Hat Display" },
  { value: "Barlow, sans-serif", label: "Barlow" },
  { value: "Mulish, sans-serif", label: "Mulish" },
  { value: "Public Sans, sans-serif", label: "Public Sans" },
  { value: "Heebo, sans-serif", label: "Heebo" },
  { value: "Oxygen, sans-serif", label: "Oxygen" },
  { value: "Dosis, sans-serif", label: "Dosis" },
  { value: "Comfortaa, sans-serif", label: "Comfortaa" },
  { value: "Mukti, sans-serif", label: "Mukti" },
  { value: "Titillium Web, sans-serif", label: "Titillium Web" },
  { value: "Varela Round, sans-serif", label: "Varela Round" },
  { value: "Assistant, sans-serif", label: "Assistant" },
  { value: "Asap, sans-serif", label: "Asap" },
  { value: "Hind, sans-serif", label: "Hind" },
  { value: "Cabin, sans-serif", label: "Cabin" },
  { value: "Merriweather Sans, sans-serif", label: "Merriweather Sans" },
  { value: "Exo, sans-serif", label: "Exo" },
  { value: "Arimo, sans-serif", label: "Arimo" },
  { value: "Bitter, sans-serif", label: "Bitter" },
  { value: "Abel, sans-serif", label: "Abel" },
  { value: "Antic Slab, sans-serif", label: "Antic Slab" },
  { value: "Questrial, sans-serif", label: "Questrial" },
  { value: "Pontano Sans, sans-serif", label: "Pontano Sans" },
  { value: "Maven Pro, sans-serif", label: "Maven Pro" },
  { value: "Cantarell, sans-serif", label: "Cantarell" },
]

export const SERIF_FONTS = [
  { value: "ui-serif, Georgia, serif", label: "System Serif" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Merriweather, serif", label: "Merriweather" },
  { value: "Source Serif 4, serif", label: "Source Serif 4" },
  { value: "Crimson Text, serif", label: "Crimson Text" },
  { value: "Libre Baskerville, serif", label: "Libre Baskerville" },
  { value: "Old Standard TT, serif", label: "Old Standard TT" },
  { value: "Cormorant Garamond, serif", label: "Cormorant Garamond" },
  { value: "Noto Serif, serif", label: "Noto Serif" },
  { value: "PT Serif, serif", label: "PT Serif" },
  { value: "Droid Serif, serif", label: "Droid Serif" },
  { value: "Vollkorn, serif", label: "Vollkorn" },
  { value: "Bitter, serif", label: "Bitter" },
  { value: "Arvo, serif", label: "Arvo" },
  { value: "Rokkitt, serif", label: "Rokkitt" },
  { value: "Neuton, serif", label: "Neuton" },
  { value: "Alegreya, serif", label: "Alegreya" },
  { value: "Cardo, serif", label: "Cardo" },
  { value: "Gentium Plus, serif", label: "Gentium Plus" },
  { value: "Spectral, serif", label: "Spectral" },
  { value: "Frank Ruhl Libre, serif", label: "Frank Ruhl Libre" },
  { value: "Unna, serif", label: "Unna" },
  { value: "Adamina, serif", label: "Adamina" },
  { value: "Amethysta, serif", label: "Amethysta" },
  { value: "Arapey, serif", label: "Arapey" },
  { value: "Artifika, serif", label: "Artifika" },
  { value: "Bree Serif, serif", label: "Bree Serif" },
  { value: "Coustard, serif", label: "Coustard" },
  { value: "Domine, serif", label: "Domine" },
  { value: "Fanwood Text, serif", label: "Fanwood Text" },
  { value: "Gilda Display, serif", label: "Gilda Display" },
  { value: "Goudy Bookletter 1911, serif", label: "Goudy Bookletter 1911" },
  { value: "Inika, serif", label: "Inika" },
  { value: "Junge, serif", label: "Junge" },
  { value: "Kameron, serif", label: "Kameron" },
  { value: "Kreon, serif", label: "Kreon" },
  { value: "Mate, serif", label: "Mate" },
  { value: "Noticia Text, serif", label: "Noticia Text" },
]

export const MONO_FONTS = [
  { value: "ui-monospace, SFMono-Regular, monospace", label: "System Mono" },
  { value: "JetBrains Mono, monospace", label: "JetBrains Mono" },
  { value: "Fira Code, monospace", label: "Fira Code" },
  { value: "Source Code Pro, monospace", label: "Source Code Pro" },
  { value: "Monaco, monospace", label: "Monaco" },
  { value: "Consolas, monospace", label: "Consolas" },
  { value: "Roboto Mono, monospace", label: "Roboto Mono" },
  { value: "Ubuntu Mono, monospace", label: "Ubuntu Mono" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Space Mono, monospace", label: "Space Mono" },
  { value: "PT Mono, monospace", label: "PT Mono" },
  { value: "Inconsolata, monospace", label: "Inconsolata" },
  { value: "Geist Mono, monospace", label: "Geist Mono" },
  { value: "Courier Prime, monospace", label: "Courier Prime" },
  { value: "IBM Plex Mono, monospace", label: "IBM Plex Mono" },
  { value: "Anonymous Pro, monospace", label: "Anonymous Pro" },
  { value: "Droid Sans Mono, monospace", label: "Droid Sans Mono" },
  { value: "Oxygen Mono, monospace", label: "Oxygen Mono" },
  { value: "Noto Sans Mono, monospace", label: "Noto Sans Mono" },
  { value: "Red Hat Mono, monospace", label: "Red Hat Mono" },
  { value: "Overpass Mono, monospace", label: "Overpass Mono" },
  { value: "Share Tech Mono, monospace", label: "Share Tech Mono" },
  { value: "VT323, monospace", label: "VT323" },
  { value: "Nova Mono, monospace", label: "Nova Mono" },
  { value: "Major Mono Display, monospace", label: "Major Mono Display" },
  { value: "Cutive Mono, monospace", label: "Cutive Mono" },
  { value: "B612 Mono, monospace", label: "B612 Mono" },
  { value: "Azeret Mono, monospace", label: "Azeret Mono" },
  { value: "Martian Mono, monospace", label: "Martian Mono" },
  { value: "Syne Mono, monospace", label: "Syne Mono" },
  { value: "Xanh Mono, monospace", label: "Xanh Mono" },
]

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
  fontType: "sans" | "serif" | "mono"
  label: string
}

export function FontSelector({
  value,
  onChange,
  fontType,
  label,
}: FontSelectorProps) {
  const getFontOptions = () => {
    switch (fontType) {
      case "sans":
        return SANS_SERIF_FONTS
      case "serif":
        return SERIF_FONTS
      case "mono":
        return MONO_FONTS
      default:
        return SANS_SERIF_FONTS
    }
  }

  const fontOptions = getFontOptions()

  // Extract display value (font name without fallbacks)
  const getCurrentLabel = () => {
    const currentFont = fontOptions.find((font) => font.value === value)
    if (currentFont) return currentFont.label

    // If not found in predefined list, extract first font name
    if (value) {
      const firstFont = value.split(",")[0].trim().replace(/['"]/g, "")
      return firstFont
    }

    return `Select ${label}`
  }

  // Helper function to load Google Fonts dynamically
  const loadGoogleFont = (fontName: string) => {
    // Skip system fonts and already loaded fonts
    const systemFonts = [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "ui-serif",
      "Georgia",
      "Cambria",
      "Times New Roman",
      "Times",
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "serif",
      "sans-serif",
      "monospace",
    ]

    if (!fontName || systemFonts.includes(fontName)) return

    // Check if font is already loaded
    const existingLink = document.querySelector(
      `link[href*="${encodeURIComponent(fontName)}"]`,
    )
    if (existingLink) return

    // Create Google Fonts link
    const link = document.createElement("link")
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`
    link.rel = "stylesheet"
    link.type = "text/css"

    // Add to document head
    document.head.appendChild(link)
  }

  // Helper function to extract first font name for loading
  const getFirstFontName = (fontFamily: string): string => {
    if (!fontFamily) return ""
    const firstFont = fontFamily.split(",")[0].trim()
    return firstFont.replace(/['"]/g, "").trim()
  }

  const handleSelect = (fontValue: string) => {
    // Load the Google Font if needed
    const fontName = getFirstFontName(fontValue)
    if (fontName) {
      loadGoogleFont(fontName)
    }

    onChange(fontValue)
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-8 justify-between font-normal text-sm",
              !value && "text-muted-foreground",
            )}
          >
            <span
              style={{ fontFamily: value || undefined }}
              className="truncate text-left"
            >
              {getCurrentLabel()}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] p-0">
          <Command>
            <div
              className="flex items-center bg-neutral-800 rounded-full m-1"
              cmdk-input-wrapper=""
            >
              <CommandInput
                placeholder="Search fonts..."
                className="h-7 border-0 bg-transparent px-0 focus:ring-0 flex-1 text-xs"
                autoFocus
              />
            </div>
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {fontOptions.map((font) => (
                  <CommandItem
                    key={font.value}
                    value={font.label}
                    onSelect={() => handleSelect(font.value)}
                    className="cursor-pointer flex items-center gap-3"
                    style={{ fontFamily: font.value }}
                  >
                    <span className="flex-1">{font.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
