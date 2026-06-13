import { api } from "@/trpc/client"
import { useMemo } from "react"
import { ThemePreset } from "@/types/theme-editor"

/**
 * Hook to get preset themes from database in defaultPresets format
 * Returns themes in the same format as the old defaultPresets import
 */
export function usePresetThemes() {
  const { data: presetThemes, isLoading } =
    api.styleProfile.getPresetThemes.useQuery()

  const themes = useMemo(() => {
    if (!presetThemes) return {}

    const themeMap: Record<string, ThemePreset> = {}

    presetThemes.forEach((theme: any) => {
      if (theme.key && theme.styles) {
        themeMap[theme.key] = {
          label: theme.siteName || theme.key,
          styles: theme.styles,
        }
      }
    })

    return themeMap
  }, [presetThemes])

  return {
    themes,
    isLoading,
    isReady: !isLoading && !!presetThemes,
  }
}
