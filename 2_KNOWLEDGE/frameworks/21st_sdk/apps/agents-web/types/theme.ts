import { RouterOutputs } from "@/trpc/client"

export interface ThemePreset {
  label: string
  createdAt?: string
  styles: {
    light: ThemeStyles
    dark: ThemeStyles
  }
}

export interface ThemeStyles {
  background: string
  foreground: string
  card: string
  "card-foreground": string
  popover: string
  "popover-foreground": string
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  muted: string
  "muted-foreground": string
  accent: string
  "accent-foreground": string
  destructive: string
  "destructive-foreground": string
  border: string
  input: string
  ring: string
  "chart-1": string
  "chart-2": string
  "chart-3": string
  "chart-4": string
  "chart-5": string
  radius?: string
  sidebar: string
  "sidebar-foreground": string
  "sidebar-primary": string
  "sidebar-primary-foreground": string
  "sidebar-accent": string
  "sidebar-accent-foreground": string
  "sidebar-border": string
  "sidebar-ring": string
  "font-sans"?: string
  "font-serif"?: string
  "font-mono"?: string
  "shadow-color"?: string
  "shadow-opacity"?: string
  "shadow-blur"?: string
  "shadow-spread"?: string
  "shadow-offset-x"?: string
  "shadow-offset-y"?: string
  "letter-spacing"?: string
  spacing?: string
}

// Simplified theme interface for backwards compatibility
export interface ShadcnTheme {
  id: string
  name: string
  description?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    destructive: string
    muted: string
  }
  // Full theme data for potential future use
  themeData?: ThemePreset
}

export type TeamStyleProfileData =
  RouterOutputs["styleProfile"]["getTeamStyleProfile"]
