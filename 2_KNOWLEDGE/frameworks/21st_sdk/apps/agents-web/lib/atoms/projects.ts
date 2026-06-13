"use client"

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export interface Project {
  id: string
  name: string
  preview_url?: string | null
  created_at: string | Date
  chats?: Array<{
    id: string
    sandbox_id: string | null
  }>
}

export interface ProjectsData {
  projects: Project[]
  nextCursor?: string
  lastFetched?: number
}

// Canvas projects atom with localStorage caching
export const canvasProjectsAtom = atomWithStorage<ProjectsData>(
  "canvas_projects_cache",
  { projects: [], lastFetched: 0 },
)

// Loading state
export const canvasProjectsLoadingAtom = atom(false)

// Cache expiry time (immediate - always fetch fresh)
const CACHE_EXPIRY_MS = 0

// Helper to check if data is stale
export const isDataStale = (lastFetched: number): boolean => {
  return Date.now() - lastFetched > CACHE_EXPIRY_MS
}

// Action atom for refreshing projects
export const refreshProjectsAtom = atom(
  null,
  async (get, set, { force = false }: { force?: boolean } = {}) => {
    const currentData = get(canvasProjectsAtom)
    if (!force && !isDataStale(currentData.lastFetched || 0)) {
      return // Data is fresh, no need to refresh
    }
    set(canvasProjectsLoadingAtom, true)
    // Loading logic will be handled by the hook
  },
)

// Action atom for clearing project caches
export const clearProjectsCacheAtom = atom(null, (get, set) => {
  set(canvasProjectsAtom, { projects: [], lastFetched: 0 })
  set(canvasProjectsLoadingAtom, false)
})
