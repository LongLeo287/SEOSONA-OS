import type { SortOption } from "@/types/global"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const MAIN_PAGE_SECTIONS = [
  "home",
  "components",
  "templates",
  "categories",
  "authors",
  "pro",
  "collections",
  "magic",
  "bundles",
] as const

export const isAppSection = (value: any): value is AppSection => {
  return MAIN_PAGE_SECTIONS.includes(value)
}

export const isMainTabType = (value: any): value is MainTabType => {
  return MAIN_PAGE_SECTIONS.includes(value) && value !== "magic"
}

export type AppSection = (typeof MAIN_PAGE_SECTIONS)[number]

export type MainTabType = Exclude<AppSection, "magic">

export type TabChangeHandler = (tab: MainTabType | "home") => void

export const tabChangeHandlerAtom = atom<TabChangeHandler | null>(null)

export const currentSectionAtom = atom<AppSection>("home")

export const sortByAtom = atom<SortOption>("recommended")

export const getMainPageUrlWithTab = (
  tab: MainTabType | "home",
  sortBy?: string,
): string => {
  const params = new URLSearchParams()
  params.set("tab", tab)
  if (tab === "components" && sortBy) {
    params.set("sort", sortBy)
  }
  return `/?${params.toString()}`
}

// Onboarding completion atom with localStorage persistence
export const onboardingCompletedAtom = atomWithStorage<boolean>(
  "magic_chat_onboarding_completed",
  false,
)

// New community view feature flag with localStorage persistence
export const newCommunityViewAtom = atomWithStorage<boolean>(
  "new_community_view_enabled",
  false,
)

// Cursor agent creation atom
export type CursorAgentCreatedDetail = {
  targetUrl: string
  shapeName: string
  agentId: string
}

export const cursorAgentCreatedAtom = atom<CursorAgentCreatedDetail | null>(
  null,
)
