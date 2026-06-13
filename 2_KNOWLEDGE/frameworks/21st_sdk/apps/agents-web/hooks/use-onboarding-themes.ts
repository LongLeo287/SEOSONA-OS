import { api } from "@/trpc/client"
import { useMemo } from "react"
import { sortThemesByOrder } from "@/lib/utils/themes/ordered-theme-keys"
import { ThemePreset, ShadcnTheme, ThemeStyles } from "@/types/theme"

/**
 * Hook for magic-chat onboarding that provides themes in ShadcnTheme format
 */
export function useOnboardingThemes() {
  const { data: presetThemes, isLoading } =
    api.styleProfile.getPresetThemes.useQuery()

  const themes = useMemo(() => {
    if (!presetThemes) return []

    const convertedThemes = presetThemes.map((theme: any) => {
      const shadcnTheme: ShadcnTheme = {
        id: theme.key || theme.id,
        name: theme.siteName || theme.key,
        description: `Theme inspired by ${theme.siteName}`,
        colors: {
          primary: theme.styles.light.primary,
          secondary: theme.styles.light.secondary,
          accent: theme.styles.light.accent,
          destructive: theme.styles.light.destructive,
          muted: theme.styles.light.muted,
        },
        themeData: {
          label: theme.siteName,
          styles: theme.styles,
        } as ThemePreset,
      }
      return shadcnTheme
    })

    return sortThemesByOrder(convertedThemes)
  }, [presetThemes])

  const themeMap = useMemo(() => {
    const map: Record<string, ThemePreset> = {}
    if (presetThemes) {
      presetThemes.forEach((theme: any) => {
        if (theme.key && theme.styles) {
          map[theme.key] = {
            label: theme.siteName || theme.key,
            styles: theme.styles,
          }
        }
      })
    }
    return map
  }, [presetThemes])

  return {
    themes,
    themeMap,
    isLoading,
    isReady: !isLoading && !!presetThemes,

    // Utility functions
    getThemeById: (id: string): ShadcnTheme | undefined => {
      return themes.find((theme) => theme.id === id)
    },

    getThemeNameById: (id: string): string => {
      const theme = themes.find((theme) => theme.id === id)
      return theme ? theme.name : "Unknown Theme"
    },

    getThemePresetById: (id: string): ThemePreset | undefined => {
      return themeMap[id]
    },

    getThemeIds: (): string[] => {
      return Object.keys(themeMap)
    },

    getThemeColors: (
      id: string,
      mode: "light" | "dark" = "light",
    ): ThemeStyles | undefined => {
      const preset = themeMap[id]
      if (!preset) return undefined
      return preset.styles[mode]
    },
  }
}
