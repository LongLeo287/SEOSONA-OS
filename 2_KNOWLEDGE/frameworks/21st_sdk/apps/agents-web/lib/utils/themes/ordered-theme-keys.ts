/**
 * Ordered list of theme keys for consistent ordering across the application
 * This order matches the order used in the magic-chat onboarding flow
 */
export const ORDERED_THEME_KEYS = [
  "default",
  "supabase",
  "stone",
  "zinc",
  "neutral",
  "gray",
  "slate",
  "origin-ui",
  "t3-chat",
  "twitter",
  "vercel",
  "claude",
  "soft-pop",
  "mono",
  "modern-minimal",
  "violet-bloom",
  "mocha-mousse",
  "bubblegum",
  "amethyst-haze",
  "notebook",
  "doom-64",
  "catppuccin",
  "graphite",
  "perpetuity",
  "kodama-grove",
  "cosmic-night",
  "tangerine",
  "quantum-rose",
  "nature",
  "bold-tech",
  "elegant-luxury",
  "amber-minimal",
  "neo-brutalism",
  "solar-dusk",
  "claymorphism",
  "cyberpunk",
  "pastel-dreams",
  "clean-slate",
  "caffeine",
  "ocean-breeze",
  "retro-arcade",
  "midnight-bloom",
  "candyland",
  "northern-lights",
  "vintage-paper",
  "sunset-horizon",
  "starry-night",
] as const

export type OrderedThemeKey = (typeof ORDERED_THEME_KEYS)[number]

/**
 * Helper function to sort themes by the defined order
 */
export function sortThemesByOrder<T extends { id: string }>(themes: T[]): T[] {
  const orderMap = new Map(ORDERED_THEME_KEYS.map((key, index) => [key, index]))

  return [...themes].sort((a, b) => {
    const orderA = orderMap.get(a.id as OrderedThemeKey) ?? 999
    const orderB = orderMap.get(b.id as OrderedThemeKey) ?? 999
    return orderA - orderB
  })
}
