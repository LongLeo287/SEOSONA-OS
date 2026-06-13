// Navigation manifest for An docs
// All hrefs use /an/docs prefix for the main web app routing

import type { FrameworkId } from "./framework-context"

export interface NavItem {
  title: string
  href?: string
  icon?: string
  items?: NavItem[]
  tag?: string
  type?: "heading"
  defaultOpen?: boolean
  disabled?: boolean
}

export interface TopTab {
  title: string
  icon: string
  items: NavItem[]
}

// ─── Guides ──────────────────────────────────────────────────────────────────

export const guidesTab: TopTab = {
  title: "Guides",
  icon: "book",
  items: [
    {
      title: "",
      defaultOpen: true,
      items: [
        { title: "Introduction", href: "/agents/docs" },
        { title: "Try It Out", href: "/agents/docs/try-it-out" },
        { title: "Get Started", href: "/agents/docs/get-started" },
        { title: "Core Concepts", href: "/agents/docs/core-concepts" },
      ],
    },
    {
      title: "Build",
      items: [
        { title: "Agents", href: "/agents/docs/build/agents" },
        { title: "Models", href: "/agents/docs/build/models" },
        { title: "System Prompts", href: "/agents/docs/build/system-prompts" },
        { title: "Tools and MCPs", href: "/agents/docs/build/tools-and-mcps" },
        { title: "Credential vaults", href: "/agents/docs/build/credentials" },
        { title: "Skills", href: "/agents/docs/build/skills" },
        { title: "Sandbox", href: "/agents/docs/build/sandbox" },
        { title: "Themes", href: "/agents/docs/build/themes" },
      ],
    },
    {
      title: "Deploy & Operate",
      items: [
        { title: "Deploy", href: "/agents/docs/deploy/deploy" },
        { title: "Frontend Integration", href: "/agents/docs/deploy/frontend-integration" },
        { title: "Backend Integration", href: "/agents/docs/deploy/backend-integration" },
        { title: "CLI", href: "/agents/docs/deploy/cli" },
        { title: "Logs", href: "/agents/docs/deploy/logs" },
        { title: "Observability", href: "/agents/docs/deploy/observability" },
      ],
    },
    {
      title: "Security & Access",
      items: [
        { title: "Security", href: "/agents/docs/security/overview" },
        { title: "API Keys & Env Vars", href: "/agents/docs/security/api-keys" },
      ],
    },
  ],
}

// ─── Reference sub-sections ──────────────────────────────────────────────────

export interface ReferenceSubSection {
  title: string
  slug: string
  prefix: string
  href: string
  disabled?: boolean
  tag?: string
}

export const referenceSubSections: ReferenceSubSection[] = [
  {
    title: "SDK Reference",
    slug: "sdk",
    prefix: "/agents/docs/reference/sdk",
    href: "/agents/docs/reference/sdk",
    disabled: true,
    tag: "Soon",
  },
  {
    title: "UI Components",
    slug: "components",
    prefix: "/agents/docs/reference/components",
    href: "/agents/docs/reference/components",
    disabled: true,
    tag: "Soon",
  },
  {
    title: "Backend API",
    slug: "api",
    prefix: "/agents/docs/reference/api",
    href: "/agents/docs/reference/api",
  },
]

// ─── SDK Reference items (per framework) - currently empty ───────────────────

export const sdkOverview: Record<FrameworkId, NavItem> = {
  nextjs: { title: "Overview", href: "/agents/docs/reference/api" },
  react: { title: "Overview", href: "/agents/docs/reference/api" },
  "js-backend": { title: "Overview", href: "/agents/docs/reference/api" },
}

export const uiComponentsOverview: NavItem = {
  title: "UI Components",
  tag: "Soon",
  disabled: true,
}

export const uiComponentsItems: NavItem[] = []

export const backendApiOverview: NavItem = {
  title: "Overview",
  href: "/agents/docs/reference/api",
}

export const backendApiItems: NavItem[] = [
  {
    title: "Endpoints",
    defaultOpen: true,
    items: [
      { title: "Chat API", href: "/agents/docs/reference/api/chat" },
    ],
  },
]

export const sdkReferenceItems: Record<FrameworkId, NavItem[]> = {
  nextjs: [],
  react: [],
  "js-backend": [],
}

// ─── Reference tab (combined for page-nav / breadcrumb / search compat) ──────

export const referenceTab: TopTab = {
  title: "Reference",
  icon: "code",
  items: [
    {
      title: "Server SDK",
      items: [{ title: "Overview", href: "/agents/docs/reference/server" }],
    },
    { title: "Backend API", items: [backendApiOverview, ...backendApiItems] },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const allTabs = [guidesTab, referenceTab]

export function getTabForPath(pathname: string): TopTab {
  if (pathname.startsWith("/agents/docs/reference")) return referenceTab
  return guidesTab
}

export function getRefSubSection(pathname: string): ReferenceSubSection | null {
  return referenceSubSections.find((s) => pathname.startsWith(s.prefix)) ?? null
}

export function getSdkOverviewHref(_framework: FrameworkId): string {
  return "/agents/docs/reference/api"
}

export function frameworkMatchesPath(
  _framework: FrameworkId,
  _pathname: string,
): boolean {
  return true
}

export function getFrameworkForPath(_pathname: string): FrameworkId | null {
  return null
}

export function flattenItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = []
  function walk(list: NavItem[]) {
    for (const item of list) {
      if (item.href && !item.disabled) result.push(item)
      if (item.items) walk(item.items)
    }
  }
  walk(items)
  return result
}

export function findBreadcrumbTrail(
  pathname: string,
  items: NavItem[],
): { title: string; href?: string }[] {
  for (const group of items) {
    if (group.items) {
      for (const item of group.items) {
        if (item.href === pathname) {
          return [
            { title: group.title },
            { title: item.title, href: item.href },
          ]
        }
        if (item.items) {
          for (const sub of item.items) {
            if (sub.href === pathname) {
              return [
                { title: group.title },
                { title: item.title },
                { title: sub.title, href: sub.href },
              ]
            }
          }
        }
      }
    }
    if (group.href === pathname) {
      return [{ title: group.title, href: group.href }]
    }
  }
  return []
}
