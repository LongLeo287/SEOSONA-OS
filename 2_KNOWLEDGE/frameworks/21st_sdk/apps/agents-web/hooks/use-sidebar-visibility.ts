"use client"

import { useIsMobile } from "@/hooks/use-media-query"
import { usePathname } from "next/navigation"

export function useSidebarVisibility() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Don't show sidebar on mobile devices
  if (isMobile) {
    return false
  }

  // Show sidebar only on specific pages
  const shouldShowSidebar =
    pathname === "/" ||
    pathname.startsWith("/bundles") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/collections") ||
    pathname.startsWith("/community/components") ||
    pathname.startsWith("/contest") ||
    pathname.startsWith("/authors") ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/inspiration") ||
    pathname.startsWith("/pro") ||
    pathname.startsWith("/community/components/s/") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/community/components/s/") ||
    pathname.startsWith("/q/") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/magic/onboarding") ||
    pathname.startsWith("/magic/console")

  return shouldShowSidebar
}
