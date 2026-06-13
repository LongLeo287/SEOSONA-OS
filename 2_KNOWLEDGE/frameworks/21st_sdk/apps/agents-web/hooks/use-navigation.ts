"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
  AppSection,
  MainTabType,
  currentSectionAtom,
  isMainTabType,
  sortByAtom,
} from "@/lib/atoms"
import { setCookie } from "@/lib/cookies"
import type { SortOption } from "@/types/global"
import { useAtom } from "jotai"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export interface UseNavigationOptions {
  syncWithUrl?: boolean
  onTabChange?: (tab: MainTabType | "home") => void
  useResponsiveDefaults?: boolean
}

export interface NavigationResult {
  activeTab: MainTabType | undefined
  currentSection: AppSection
  navigateToTab: (tab: MainTabType | "home") => void
  isDesktop: boolean
  sortBy: SortOption
  handleSortChange: (value: string) => void
}

export function useNavigation(
  options: UseNavigationOptions = {},
): NavigationResult {
  const {
    syncWithUrl = true,
    onTabChange,
    useResponsiveDefaults = true,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const [searchParams, setSearchParams] = useState<URLSearchParams>()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const getMainTabFromPathname = (
    pathname: string,
  ): MainTabType | undefined => {
    const tab = pathname.split("/")[1]
    return isMainTabType(tab) ? tab : undefined
  }

  const [currentSection, setCurrentSection] = useAtom(currentSectionAtom)
  const [selectedMainTab, setSelectedMainTab] = useState<
    MainTabType | undefined
  >(getMainTabFromPathname(pathname))
  const [sortBy, setSortBy] = useAtom(sortByAtom)

  const urlTab = searchParams?.get("tab") as Exclude<AppSection, "magic"> | null

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search))
  }, [])

  useEffect(() => {
    if (syncWithUrl) {
      if (pathname.startsWith("/magic")) {
        setCurrentSection("magic")
        return
      }

      const tab = getMainTabFromPathname(pathname)
      if (tab) {
        setCurrentSection("home")
        setSelectedMainTab(tab)
      }
    }
  }, [
    pathname,
    urlTab,
    isDesktop,
    setCurrentSection,
    setSelectedMainTab,
    useResponsiveDefaults,
    syncWithUrl,
    router,
    searchParams,
  ])

  const navigateToTab = (tab: MainTabType | "home") => {
    setSelectedMainTab(tab)
    setCurrentSection(tab === "home" ? "home" : "components")

    if (onTabChange) {
      onTabChange(tab)
    }

    if (syncWithUrl) {
      router.push(`/${tab}`)
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption)

    setCookie({
      name: "saved_sort_by",
      value: value,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
    })

    if (syncWithUrl && selectedMainTab === "components") {
      const params = new URLSearchParams(searchParams?.toString() ?? "")
      params.set("sort", value)
      params.set("tab", "components")
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }

  return {
    activeTab: selectedMainTab,
    currentSection,
    navigateToTab,
    isDesktop,
    sortBy,
    handleSortChange,
  }
}
