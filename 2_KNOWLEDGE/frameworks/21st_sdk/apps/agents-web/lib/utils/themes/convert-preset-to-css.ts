import type { ThemePreset } from "@/types/theme"

/**
 * Converts a theme preset to CSS custom properties format
 * @param preset - Theme preset containing light and dark styles
 * @returns CSS string with :root and .dark selectors
 */
export function convertPresetToCss(preset: ThemePreset["styles"]): string {
  const cssLight = Object.entries(preset.light)
    .map(([key, value]) => {
      return `  --${key}: ${value};`
    })
    .join("\n")

  const cssDark = Object.entries(preset.dark)
    .map(([key, value]) => {
      return `  --${key}: ${value};`
    })
    .join("\n")

  return `:root {
${cssLight}
}

.dark {
${cssDark}
}

@theme inline {
${Object.keys(preset.light)
  .map((key) => {
    return `  --color-${key}: var(--${key});`
  })
  .join("\n")}
}`
}
