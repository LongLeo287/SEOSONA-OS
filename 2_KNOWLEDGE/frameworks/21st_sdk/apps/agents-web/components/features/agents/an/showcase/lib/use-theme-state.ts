import { useState, useCallback, useMemo } from "react"
import type { AnTheme } from "@21st-sdk/react"
import { extractThemeConfig } from "@21st-sdk/react"

const DEFAULT_LIGHT: Record<string, string> = {
  "--an-background": "#ffffff",
  "--an-background-secondary": "#f5f5f5",
  "--an-background-tertiary": "#fafafa",
  "--an-foreground": "#1a1a1a",
  "--an-foreground-muted": "#737373",
  "--an-foreground-subtle": "#a3a3a3",
  "--an-border-color": "#e5e5e5",
  "--an-border-color-light": "#f0f0f0",
  "--an-primary-color": "#3b82f6",
  "--an-user-message-bg": "#f5f5f5",
  "--an-user-message-text": "#1a1a1a",
  "--an-input-background": "#ffffff",
  "--an-input-border-color": "#e5e5e5",
  "--an-input-color": "#1a1a1a",
  "--an-input-placeholder-color": "#a3a3a3",
  "--an-send-button-bg": "#3b82f6",
  "--an-send-button-color": "#ffffff",
  "--an-stop-button-bg": "#1a1a1a",
  "--an-stop-button-color": "#ffffff",
  "--an-tool-background": "#fafafa",
  "--an-tool-border-color": "#e5e5e5",
  "--an-tool-color": "#1a1a1a",
  "--an-tool-color-muted": "#737373",
  "--an-code-background": "#1e1e1e",
  "--an-code-color": "#d4d4d4",
  "--an-diff-added-bg": "rgba(34, 197, 94, 0.1)",
  "--an-diff-added-border": "rgba(34, 197, 94, 0.5)",
  "--an-diff-added-text": "#15803d",
  "--an-diff-removed-bg": "rgba(239, 68, 68, 0.1)",
  "--an-diff-removed-border": "rgba(239, 68, 68, 0.5)",
  "--an-diff-removed-text": "#dc2626",
}

const DEFAULT_DARK: Record<string, string> = {
  "--an-background": "#0a0a0a",
  "--an-background-secondary": "#171717",
  "--an-background-tertiary": "#1a1a1a",
  "--an-foreground": "#fafafa",
  "--an-foreground-muted": "#a3a3a3",
  "--an-foreground-subtle": "#737373",
  "--an-border-color": "#2a2a2a",
  "--an-border-color-light": "#1f1f1f",
  "--an-primary-color": "#3b82f6",
  "--an-user-message-bg": "#1a1a1a",
  "--an-user-message-text": "#fafafa",
  "--an-input-background": "#0a0a0a",
  "--an-input-border-color": "#2a2a2a",
  "--an-input-color": "#fafafa",
  "--an-input-placeholder-color": "#737373",
  "--an-send-button-bg": "#3b82f6",
  "--an-send-button-color": "#ffffff",
  "--an-stop-button-bg": "#fafafa",
  "--an-stop-button-color": "#0a0a0a",
  "--an-tool-background": "#171717",
  "--an-tool-border-color": "#2a2a2a",
  "--an-tool-color": "#fafafa",
  "--an-tool-color-muted": "#a3a3a3",
  "--an-code-background": "#0d0d0d",
  "--an-code-color": "#d4d4d4",
  "--an-diff-added-bg": "rgba(34, 197, 94, 0.15)",
  "--an-diff-added-border": "rgba(34, 197, 94, 0.4)",
  "--an-diff-added-text": "#4ade80",
  "--an-diff-removed-bg": "rgba(239, 68, 68, 0.15)",
  "--an-diff-removed-border": "rgba(239, 68, 68, 0.4)",
  "--an-diff-removed-text": "#f87171",
}

const DEFAULT_SHARED: Record<string, string> = {
  "--an-font-family": "system-ui, sans-serif",
  "--an-text-size": "14px",
  "--an-text-size-sm": "13px",
  "--an-text-size-xs": "11px",
  "--an-line-height": "1.6",
  "--an-font-weight": "400",
  "--an-font-weight-medium": "500",
  "--an-font-weight-semibold": "600",
  "--an-border-radius": "16px",
  "--an-message-border-radius": "16px",
  "--an-input-border-radius": "16px",
  "--an-tool-border-radius": "12px",
  "--an-code-border-radius": "8px",
  "--an-user-message-padding": "10px 14px",
  "--an-input-padding": "12px 16px",
  "--an-send-button-size": "32px",
  "--an-stop-button-size": "32px",
  "--an-send-button-border-radius": "9999px",
  "--an-code-font-family": "ui-monospace, monospace",
  "--an-code-font-size": "13px",
}

export function useThemeState() {
  const [theme, setTheme] = useState<AnTheme>({
    theme: { ...DEFAULT_SHARED },
    light: { ...DEFAULT_LIGHT },
    dark: { ...DEFAULT_DARK },
  })
  const [colorMode, setColorMode] = useState<"light" | "dark">("light")

  const themeConfig = useMemo(() => extractThemeConfig(theme), [theme])

  const setSharedVar = useCallback((key: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }))
  }, [])

  const setColorVar = useCallback(
    (key: string, value: string) => {
      setTheme((prev) => ({
        ...prev,
        [colorMode]: { ...prev[colorMode], [key]: value },
      }))
    },
    [colorMode],
  )

  const setConfigValue = useCallback(
    (configKey: string, cssVar: string, value: string | boolean) => {
      const cssValue = typeof value === "boolean" ? String(value) : value
      setTheme((prev) => ({
        ...prev,
        theme: { ...prev.theme, [cssVar]: cssValue },
      }))
    },
    [],
  )

  const loadThemeFromJson = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as AnTheme
      if (parsed.theme && parsed.light && parsed.dark) {
        setTheme(parsed)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const exportThemeAsJson = useCallback(() => {
    return JSON.stringify(theme, null, 2)
  }, [theme])

  return {
    theme,
    setTheme,
    colorMode,
    setColorMode,
    themeConfig,
    setSharedVar,
    setColorVar,
    setConfigValue,
    loadThemeFromJson,
    exportThemeAsJson,
  }
}
