import React from "react"
import { usePresetThemes } from "@/hooks/use-preset-themes"
import { ORDERED_THEME_KEYS } from "@/lib/utils/themes/ordered-theme-keys"

// Helper function to load Google Fonts dynamically
function loadGoogleFont(fontName: string) {
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

// Helper function to extract font from theme
function getThemeFont(theme: any, themeKey?: string, presets?: any): string {
  try {
    // For preset themes, get from presets
    if (themeKey && ORDERED_THEME_KEYS.includes(themeKey as any) && presets) {
      const presetTheme = presets[themeKey]
      return presetTheme?.styles?.light?.["font-sans"] || ""
    }

    // For custom/community themes, get from theme.preset or theme.styles
    const fontSans =
      theme?.preset?.styles?.light?.["font-sans"] ||
      theme?.styles?.light?.["font-sans"] ||
      ""

    return fontSans
  } catch (error) {
    console.warn("Failed to extract theme font:", error)
    return ""
  }
}

// Helper function to extract first font name for loading
function getFirstFontName(fontFamily: string): string {
  if (!fontFamily) return ""

  // Extract first font name and clean it up
  const firstFont = fontFamily.split(",")[0].trim()
  return firstFont.replace(/['"]/g, "").trim()
}

interface ThemeNameProps {
  children: React.ReactNode
  theme?: any
  themeKey?: string
  className?: string
  style?: React.CSSProperties
}

export function ThemeName({
  children,
  theme,
  themeKey,
  className = "",
  style = {},
}: ThemeNameProps) {
  // Get preset themes from API
  const { themes: presets } = usePresetThemes()

  // Get the font family for this theme
  const themeFontFamily = getThemeFont(theme, themeKey, presets)
  const firstFontName = getFirstFontName(themeFontFamily)

  // Load Google Font if needed
  React.useEffect(() => {
    if (firstFontName && firstFontName !== themeFontFamily) {
      loadGoogleFont(firstFontName)
    }
  }, [firstFontName, themeFontFamily])

  return (
    <span
      className={className}
      style={{
        ...style,
        fontFamily: themeFontFamily
          ? `${themeFontFamily}, sans-serif`
          : undefined,
      }}
      title={themeFontFamily ? `Font: ${firstFontName}` : undefined}
    >
      {children}
    </span>
  )
}
