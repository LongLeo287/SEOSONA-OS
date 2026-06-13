import {
  Bookmark,
  Component,
  Crown,
  Dock,
  Group,
  Home,
  Layers,
  Package,
  Users,
  Wand2,
} from "lucide-react"

export type MainNavigationItem = {
  title: string
  value: string
  icon: any
  isNew?: boolean
  subitems?: {
    title: string
    href: string
    externalLink?: boolean
    isNew?: boolean
  }[]
}

export const mainNavigationItems: MainNavigationItem[] = [
  {
    title: "Home",
    value: "home",
    icon: Home,
  },
  {
    title: "Components",
    value: "components",
    icon: Component,
  },
  {
    title: "Templates",
    value: "templates",
    icon: Layers,
  },
  {
    title: "Creators",
    value: "authors",
    icon: Users,
  },
  {
    title: "Premium Stores",
    value: "pro",
    icon: Crown,
  },
  {
    title: "Collections",
    value: "collections",
    icon: Bookmark,
  },
]

// This is a separate navigation item for AI Component Builder that will only be used for the sidebar
// and won't be part of the tab navigation
export const magicNavItem = {
  title: "Magic",
  icon: Wand2,
  subitems: [
    {
      title: "Magic Chat",
      href: "/magic-chat",
    },
    {
      title: "Magic MCP",
      href: "/magic",
      externalLink: true,
    },
    {
      title: "Onboarding",
      href: "/magic-chat?mcp_section=true",
    },
    {
      title: "Console",
      href: "/magic/console",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
  ],
}

type NavigationItem = {
  title: string
  href: string
  isNew?: boolean
  demoId?: number
  demosCount?: number
  externalLink?: boolean
}

type ScreensTagItem = {
  title: string
  slug: string
  href: string
  appSlug: string
  screenshotUrl: string
  pageId: string
}

type NavigationCategory = {
  title: string
  icon: any
  items: NavigationItem[]
  isNew?: boolean
}

const marketing: NavigationItem[] = [
  {
    title: "Announcements",
    href: "/community/components/s/announcement",
    demoId: 541,
    demosCount: 10,
  },
  { title: "Backgrounds", href: "/community/components/s/background", demoId: 1120, demosCount: 33 },
  { title: "Borders", href: "/community/components/s/border", demoId: 1135, demosCount: 12 },
  {
    title: "Calls to Action",
    href: "/community/components/s/call-to-action",
    demoId: 1379,
    demosCount: 34,
  },
  { title: "Clients", href: "/community/components/s/clients", demoId: 981, demosCount: 16 },
  { title: "Comparisons", href: "/community/components/s/comparison", demoId: 1466, demosCount: 6 },
  { title: "Docks", href: "/community/components/s/dock", demoId: 990, demosCount: 6 },
  { title: "Features", href: "/community/components/s/features", demoId: 1521, demosCount: 36 },
  { title: "Footers", href: "/community/components/s/footer", demoId: 1520, demosCount: 14 },
  { title: "Heroes", href: "/community/components/s/hero", demoId: 1526, demosCount: 73 },
  { title: "Hooks", href: "/community/components/s/hook", demoId: 915, demosCount: 31 },
  { title: "Images", href: "/community/components/s/image", demoId: 1018, demosCount: 26 },
  { title: "Maps", href: "/community/components/s/map", demoId: 999, demosCount: 2 },
  {
    title: "Navigation Menus",
    href: "/community/components/s/navbar-navigation",
    demoId: 1432,
    demosCount: 11,
  },
  {
    title: "Pricing Sections",
    href: "/community/components/s/pricing-section",
    demoId: 1511,
    demosCount: 17,
  },
  {
    title: "Scroll Areas",
    href: "/community/components/s/scroll-area",
    demoId: 857,
    demosCount: 24,
  },
  {
    title: "Testimonials",
    href: "/community/components/s/testimonials",
    demoId: 822,
    demosCount: 15,
  },
  { title: "Texts", href: "/community/components/s/text", demoId: 1515, demosCount: 58 },
  { title: "Videos", href: "/community/components/s/video", demoId: 651, demosCount: 9 },
  {
    title: "Shaders",
    href: "/community/components/s/shader",
    demoId: 5709,
    demosCount: 15,
  },
].sort((a, b) => a.title.localeCompare(b.title))

const ui: NavigationItem[] = [
  { title: "Accordions", href: "/community/components/s/accordion", demoId: 1517, demosCount: 40 },
  {
    title: "AI Chats",
    href: "/community/components/s/ai-chat",
    demoId: 1437,
    demosCount: 30,
  },
  { title: "Alerts", href: "/community/components/s/alert", demoId: 341, demosCount: 23 },
  { title: "Avatars", href: "/community/components/s/avatar", demoId: 791, demosCount: 17 },
  { title: "Badges", href: "/community/components/s/badge", demoId: 513, demosCount: 25 },
  { title: "Buttons", href: "/community/components/s/button", demoId: 1346, demosCount: 130 },
  {
    title: "Calendars",
    href: "/community/components/s/calendar",
    demoId: 461,
    demosCount: 34,
  },
  { title: "Cards", href: "/community/components/s/card", demoId: 858, demosCount: 79 },
  { title: "Carousels", href: "/community/components/s/carousel", demoId: 1247, demosCount: 16 },
  { title: "Checkboxes", href: "/community/components/s/checkbox", demoId: 90, demosCount: 19 },
  {
    title: "Date Pickers",
    href: "/community/components/s/date-picker",
    demoId: 169,
    demosCount: 12,
  },
  {
    title: "Dialogs / Modals",
    href: "/community/components/s/modal-dialog",
    demoId: 1462,
    demosCount: 37,
  },
  { title: "Dropdowns", href: "/community/components/s/dropdown", demoId: 390, demosCount: 25 },
  {
    title: "Empty States",
    href: "/community/components/s/empty-state",
    demoId: 1435,
    demosCount: 1,
  },
  { title: "File Trees", href: "/community/components/s/file-tree", demoId: 1223, demosCount: 2 },
  {
    title: "File Uploads",
    href: "/community/components/s/upload-download",
    demoId: 377,
    demosCount: 7,
  },
  { title: "Forms", href: "/community/components/s/form", demoId: 918, demosCount: 23 },
  { title: "Icons", href: "/community/components/s/icons", demoId: 865, demosCount: 10 },
  { title: "Inputs", href: "/community/components/s/input", demoId: 1456, demosCount: 102 },
  { title: "Links", href: "/community/components/s/link", demoId: 1287, demosCount: 13 },
  { title: "Menus", href: "/community/components/s/menu", demoId: 1428, demosCount: 18 },
  {
    title: "Notifications",
    href: "/community/components/s/notification",
    demoId: 400,
    demosCount: 5,
  },
  { title: "Numbers", href: "/community/components/s/number", demoId: 1444, demosCount: 18 },
  { title: "Paginations", href: "/community/components/s/pagination", demoId: 453, demosCount: 20 },
  {
    title: "Popovers",
    href: "/community/components/s/popover",
    demoId: 403,
    demosCount: 23,
  },
  {
    title: "Radio Groups",
    href: "/community/components/s/radio-group",
    demoId: 1410,
    demosCount: 22,
  },
  { title: "Sidebars", href: "/community/components/s/sidebar", demoId: 1075, demosCount: 10 },
  { title: "Sign Ins", href: "/community/components/s/sign-in", demoId: 374, demosCount: 4 },
  {
    title: "Sign ups",
    href: "/community/components/s/registration-signup",
    demoId: 373,
    demosCount: 4,
  },
  { title: "Selects", href: "/community/components/s/select", demoId: 289, demosCount: 62 },
  { title: "Sliders", href: "/community/components/s/slider", demoId: 329, demosCount: 45 },
  {
    title: "Spinner Loaders",
    href: "/community/components/s/spinner-loader",
    demoId: 523,
    demosCount: 21,
  },
  { title: "Tables", href: "/community/components/s/table", demoId: 105, demosCount: 30 },
  { title: "Tags", href: "/community/components/s/chip-tag", demoId: 1285, demosCount: 6 },
  { title: "Tabs", href: "/community/components/s/tabs", demoId: 635, demosCount: 38 },
  { title: "Text Areas", href: "/community/components/s/textarea", demoId: 190, demosCount: 22 },
  { title: "Toasts", href: "/community/components/s/toast", demoId: 573, demosCount: 2 },
  { title: "Toggles", href: "/community/components/s/toggle", demoId: 250, demosCount: 12 },
  { title: "Tooltips", href: "/community/components/s/tooltip", demoId: 230, demosCount: 28 },
].sort((a, b) => a.title.localeCompare(b.title))

// Screens tags with representative apps (no duplicates)
const screensTags: ScreensTagItem[] = [
  {
    title: "AI",
    slug: "ai",
    href: "/community/components/s/ai",
    appSlug: "monday.com",
    screenshotUrl:
      "https://assets.21st.dev/monday-com/meta/fullpage-screenshot.png",
    pageId: "9123c258-1192-4b8d-a764-180b362add57",
  },
  {
    title: "Communication",
    slug: "communication",
    href: "/community/components/s/communication",
    appSlug: "zendesk.com",
    screenshotUrl:
      "https://assets.21st.dev/zendesk-com/meta/fullpage-screenshot.png",
    pageId: "bc41288b-875c-4fda-9837-b41887b7f4a8",
  },
  {
    title: "Design",
    slug: "design",
    href: "/community/components/s/design",
    appSlug: "canva.com",
    screenshotUrl:
      "https://assets.21st.dev/canva-com-engb/meta/fullpage-screenshot.png",
    pageId: "fcf5e90c-3321-4052-9688-17bc9d7fabe1",
  },
  {
    title: "E-commerce",
    slug: "e-commerce",
    href: "/community/components/s/e-commerce",
    appSlug: "shopify.dev",
    screenshotUrl:
      "https://assets.21st.dev/shopify-dev-docs/meta/fullpage-screenshot.png",
    pageId: "14a86e8a-4883-4cf0-94bc-d7ae57ef3882",
  },
  {
    title: "Fintech",
    slug: "fintech",
    href: "/community/components/s/fintech",
    appSlug: "cakeequity.com",
    screenshotUrl:
      "https://assets.21st.dev/cakeequity-com/meta/fullpage-screenshot.png",
    pageId: "e32fd503-c344-4971-a772-1279e2c4be58",
  },
  {
    title: "Marketplace",
    slug: "marketplace",
    href: "/community/components/s/marketplace",
    appSlug: "zillow.com",
    screenshotUrl:
      "https://assets.21st.dev/zillow-com/meta/fullpage-screenshot.png",
    pageId: "29507d8d-5f14-4a8c-acb8-6bc074d916cd",
  },
  {
    title: "Productivity",
    slug: "productivity",
    href: "/community/components/s/productivity",
    appSlug: "trello.com",
    screenshotUrl: "https://assets.21st.dev/trello-com/meta/screenshot.png",
    pageId: "93ecc704-edf0-449e-ac10-825692485767",
  },
  {
    title: "SaaS",
    slug: "saas",
    href: "/community/components/s/saas",
    appSlug: "hubspot.com",
    screenshotUrl:
      "https://assets.21st.dev/hubspot-com-hp-3/meta/fullpage-screenshot.png",
    pageId: "d560275b-59c5-4fe7-9dcd-e95d5edb25d7",
  },
].sort((a, b) => a.title.localeCompare(b.title))

export const categories: NavigationCategory[] = [
  {
    title: "Marketing Blocks",
    icon: Dock,
    items: marketing,
  },
  {
    title: "UI Components",
    icon: Group,
    items: ui,
  },
]

export const screensCategories = {
  tags: screensTags,
}

// Additional navigation items for footer or other sections
export const additionalNavItems = [
  {
    title: "What's New",
    href: "/changelog",
    description: "Latest updates and releases",
  },
]
