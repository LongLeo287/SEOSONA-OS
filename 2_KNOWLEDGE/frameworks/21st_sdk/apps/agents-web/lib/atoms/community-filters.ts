import { atom } from "jotai"
import type { SortOption } from "@/types/global"

export interface DynamicTag {
  name: string
  slug: string
  count: number
}

export type CategoryFilter = "all" | "marketing" | "ui"
export type TimeFilter =
  | "all"
  | "last_week"
  | "last_month"
  | "last_3_months"
  | "last_year"

export interface CommunityFilters {
  searchQuery: string
  category: CategoryFilter
  tagSlugs: string[]
  sortBy: SortOption
  timeRange: TimeFilter
}

export const DEFAULT_COMMUNITY_FILTERS: CommunityFilters = {
  searchQuery: "",
  category: "all",
  tagSlugs: [],
  sortBy: "recommended",
  timeRange: "all",
}

export const communityFiltersAtom = atom<CommunityFilters>({
  ...DEFAULT_COMMUNITY_FILTERS,
})

export const activeFilterCountAtom = atom((get) => {
  const filters = get(communityFiltersAtom)
  let count = 0
  if (filters.category !== "all") count++
  if (filters.tagSlugs.length > 0) count += filters.tagSlugs.length
  if (filters.timeRange !== "all") count++
  if (filters.sortBy !== "recommended") count++
  if (filters.searchQuery !== "") count++
  return count
})

export const dynamicResultTagsAtom = atom<DynamicTag[]>([])

export const hasActiveFiltersAtom = atom((get) => {
  const filters = get(communityFiltersAtom)
  return (
    filters.category !== "all" ||
    filters.tagSlugs.length > 0 ||
    filters.timeRange !== "all" ||
    filters.sortBy !== "recommended" ||
    filters.searchQuery !== ""
  )
})
