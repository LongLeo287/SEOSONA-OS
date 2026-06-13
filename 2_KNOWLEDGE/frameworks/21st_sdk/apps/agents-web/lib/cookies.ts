"use server"

import { cookies } from "next/headers"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

export async function setCookie(cookie: ResponseCookie) {
  ;(await cookies()).set(cookie)
}

export async function removeCookie(cookieName: string) {
  ;(await cookies()).delete(cookieName)
}

export async function getSidebarState(): Promise<boolean> {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar:state")

  if (sidebarCookie?.value === "true") {
    return true
  } else if (sidebarCookie?.value === "false") {
    return false
  }

  // Default to true if no cookie exists
  return true
}

// Community sidebar width cookie
const COMMUNITY_SIDEBAR_WIDTH_COOKIE = "community-sidebar-width"
const DEFAULT_COMMUNITY_SIDEBAR_WIDTH = 240

export async function getCommunitySidebarWidth(): Promise<number> {
  const cookieStore = await cookies()
  const widthCookie = cookieStore.get(COMMUNITY_SIDEBAR_WIDTH_COOKIE)
  if (widthCookie?.value) {
    const parsed = parseInt(widthCookie.value, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }
  return DEFAULT_COMMUNITY_SIDEBAR_WIDTH
}

// Dismissed news cookie
const DISMISSED_NEWS_COOKIE = "dismissed-news"

export async function getDismissedNews(): Promise<string[]> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(DISMISSED_NEWS_COOKIE)
  if (cookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookie.value))
      if (Array.isArray(parsed)) return parsed
    } catch {}
  }
  return []
}

// Agents sidebar state and width cookies
const AGENTS_SIDEBAR_OPEN_COOKIE = "agents-sidebar-open"
const AGENTS_SIDEBAR_WIDTH_COOKIE = "agents-sidebar-width"
const DEFAULT_AGENTS_SIDEBAR_OPEN = true
const DEFAULT_AGENTS_SIDEBAR_WIDTH = 224

export interface AgentsSidebarState {
  sidebarOpen: boolean
  sidebarWidth: number
}

export async function getAgentsSidebarState(): Promise<AgentsSidebarState> {
  const cookieStore = await cookies()

  // Read sidebar open state
  const openCookie = cookieStore.get(AGENTS_SIDEBAR_OPEN_COOKIE)
  let sidebarOpen = DEFAULT_AGENTS_SIDEBAR_OPEN
  if (openCookie?.value === "true") {
    sidebarOpen = true
  } else if (openCookie?.value === "false") {
    sidebarOpen = false
  }

  // Read sidebar width
  const widthCookie = cookieStore.get(AGENTS_SIDEBAR_WIDTH_COOKIE)
  let sidebarWidth = DEFAULT_AGENTS_SIDEBAR_WIDTH
  if (widthCookie?.value) {
    const parsed = parseInt(widthCookie.value, 10)
    if (!isNaN(parsed) && parsed > 0) {
      sidebarWidth = parsed
    }
  }

  return { sidebarOpen, sidebarWidth }
}
