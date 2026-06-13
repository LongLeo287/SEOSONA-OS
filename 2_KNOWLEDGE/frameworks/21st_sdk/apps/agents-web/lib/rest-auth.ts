import { auth } from "@clerk/nextjs/server"
import { verifyDesktopToken } from "./desktop-auth"

export interface RestAuthResult {
  userId: string | null
  isDesktopAuth: boolean
}

/**
 * Get authenticated user ID from either Clerk or desktop token
 * Use this in REST API routes that need to support both auth methods
 * 
 * @param request - The incoming request object
 * @returns Object with userId and whether it's desktop auth
 */
export async function getRestAuth(request: Request): Promise<RestAuthResult> {
  // First try Clerk auth
  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    return { userId: clerkUserId, isDesktopAuth: false }
  }

  // Then try desktop token from header (sent by Electron)
  const desktopTokenHeader = request.headers.get("X-Desktop-Token")
  if (desktopTokenHeader) {
    const userId = await verifyDesktopToken(desktopTokenHeader)
    if (userId) {
      return { userId, isDesktopAuth: true }
    }
  }

  // Then try desktop token from cookie (for SSR requests from Electron)
  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim())
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=")
      if (name === "x-desktop-token" && value) {
        const userId = await verifyDesktopToken(value)
        if (userId) {
          return { userId, isDesktopAuth: true }
        }
      }
    }
  }

  return { userId: null, isDesktopAuth: false }
}

/**
 * Require authentication - throws if not authenticated
 * Convenience wrapper for getRestAuth
 */
export async function requireRestAuth(request: Request): Promise<{ userId: string; isDesktopAuth: boolean }> {
  const result = await getRestAuth(request)
  if (!result.userId) {
    throw new Error("Unauthorized")
  }
  return { userId: result.userId, isDesktopAuth: result.isDesktopAuth }
}

