import { auth } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { verifyDesktopToken } from "./desktop-auth"

export interface ServerAuthResult {
  userId: string | null
  isDesktopAuth: boolean
}

/**
 * Get authenticated user ID from either Clerk or desktop token
 * This should be used in Server Components that need to support both auth methods
 */
export async function getServerAuth(): Promise<ServerAuthResult> {
  // First try Clerk auth
  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    return { userId: clerkUserId, isDesktopAuth: false }
  }

  // Then try desktop token from cookie
  const cookieStore = await cookies()
  const desktopToken = cookieStore.get("x-desktop-token")?.value

  if (desktopToken) {
    const userId = await verifyDesktopToken(desktopToken)
    if (userId) {
      return { userId, isDesktopAuth: true }
    }
  }

  return { userId: null, isDesktopAuth: false }
}
