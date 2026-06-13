"use client"

import { useAgentsSession } from "@/lib/agents/auth/client"
import { useDesktopAuth } from "@/lib/contexts/desktop-auth-context"

/**
 * Combined auth hook that checks both Clerk and desktop auth
 * Use this instead of useAuth() when you need to support desktop authentication
 */
export function useCombinedAuth() {
  const auth = useAgentsSession()
  const { isDesktopAuth, desktopUserId } = useDesktopAuth()

  // If desktop auth is active, override Clerk's userId
  const userId = auth.userId || desktopUserId
  const isSignedIn = !!userId
  const isLoaded = auth.isLoaded || isDesktopAuth

  return {
    ...auth,
    userId,
    isSignedIn,
    isLoaded,
    isDesktopAuth,
  }
}
