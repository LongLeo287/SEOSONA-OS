import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Floating sidebar state for alpha layout
export const floatingSidebarOpenAtom = atom(false)

// Mobile sidebar state
export const mobileSidebarOpenAtom = atom(false)

// Resizable community sidebar width (persisted to localStorage)
export const communitySidebarWidthAtom = atomWithStorage<number>(
  "community-sidebar-width",
  240,
)

export const agentsSidebarOpenAtom = atomWithStorage<boolean>(
  "agents-sidebar-open",
  true,
)

export const agentsSidebarWidthAtom = atomWithStorage<number>(
  "agents-sidebar-width",
  224,
)

// Sidebar view mode: "main" = community/default view, "agents" = agents dashboard view, "agents-threads" = thread-specific filter sidebar, "search" = filter/search view, "categories" = component categories view
export const sidebarViewModeAtom = atomWithStorage<
  "main" | "agents" | "agents-threads" | "search" | "categories"
>("agents-sidebar-view-mode", "main")

export const COMMUNITY_SIDEBAR_MIN_WIDTH = 200
export const COMMUNITY_SIDEBAR_MAX_WIDTH = 340
export const COMMUNITY_SIDEBAR_CLOSE_HOTKEY = "⌘\\"

export const AGENTS_SIDEBAR_MIN_WIDTH = 160
export const AGENTS_SIDEBAR_MAX_WIDTH = 300
export const AGENTS_SIDEBAR_CLOSE_HOTKEY = "⌘\\"
