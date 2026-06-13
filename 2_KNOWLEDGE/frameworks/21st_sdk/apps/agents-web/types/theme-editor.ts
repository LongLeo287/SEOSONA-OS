// Import and re-export main theme types
import { ThemeStyles as ThemeColorsBase, ThemePreset } from "@/types/theme"

// Re-export for convenience
export type { ThemePreset }

// Theme colors interface (extends main ThemeStyles)
export interface ThemeColors extends ThemeColorsBase {}

export interface ThemeStyles {
  light: ThemeColors
  dark: ThemeColors
}

export interface Theme {
  id: string
  name: string
  styles: ThemeStyles
  created_at?: string
  updated_at?: string
}

export type ColorMode = "light" | "dark"

export interface ThemeEditorState {
  currentMode: ColorMode
  styles: ThemeStyles
  name: string
}
