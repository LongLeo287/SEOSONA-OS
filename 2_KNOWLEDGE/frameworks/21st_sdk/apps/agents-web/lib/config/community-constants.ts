/**
 * Community configuration constants
 * Centralized place for hardcoded values used across community components
 */

// Featured app slugs for screens section
export const SCREENS_FEATURED_APP_SLUGS: string[] = [
  "github",
  "linear",
  "origin",
  "lovable",
  "figma",
  "revolut",
]

// Featured app slugs for screens section
export const SCREENS_FEATURED_IDS: string[] = [
  "4ed4a424-1700-468a-8f5f-e66433a61144", // "github",
  "f754b6db-87c0-48f4-a012-37acba7548cd", // "linear",
  "73026629-fffd-47fe-81ec-4a86bc9d613d", // "origin",
  "4122a690-6eec-4fc0-b6cf-e84e128d5738", // "lovable",
  "a40fc7dd-8a3c-47b3-9656-a610f21b8213", // "figma",
  "71e07309-8057-43cd-afc7-74d23ee79f99", // "revolut",
]

// Featured authors for Components tab
export const FEATURED_AUTHOR_USERNAMES: string[] = [
  "aceternity",
  "shadcn",
  "magicui",
  "originui",
  "reactbits",
  "motion-primitives",
  "shadcnblockscom",
  "tailark",
]

// Trending marketing categories (in order of priority)
export const TRENDING_MARKETING_CATEGORIES: string[] = [
  "/s/hero",
  "/s/background",
  "/s/features",
  "/s/announcement",
  "/s/call-to-action",
  "/s/image",
  "/s/border",
  "/s/footer",
]

// Trending UI categories (in order of priority)
export const TRENDING_UI_CATEGORIES: string[] = [
  "/s/card",
  "/s/ai-chat",
  "/s/button",
  "/s/carousel",
  "/s/accordion",
  "/s/menu",
  "/s/sidebar",
  "/s/navbar-navigation",
]

// Featured tags for search with labels
export const FEATURED_TAGS = [
  { slug: "shader", label: "Shaders" },
  { slug: "hero", label: "Heros" },
  { slug: "features", label: "Features" },
  { slug: "ai-chat", label: "AI Chat" },
  { slug: "call-to-action", label: "CTA" },
  { slug: "button", label: "Buttons" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "pricing-section", label: "Pricing" },
  { slug: "text", label: "Text" },
] as const

// Community command menu interaction classes
export const COMMAND_ITEM_INTERACTIVE_CLASSES =
  "hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground dark:hover:bg-gray-100/15 dark:data-[selected=true]:bg-gray-100/15"

// Tab types and order
export type CommunityTab = "components" | "themes"
export const COMMUNITY_TABS: CommunityTab[] = [
  "components",
  "themes",
]
