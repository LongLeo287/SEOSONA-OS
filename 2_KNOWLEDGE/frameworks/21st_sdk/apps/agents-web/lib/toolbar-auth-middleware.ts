import { NextRequest } from "next/server"
import { verifyToolbarToken } from "@/lib/toolbar-tokens"

/**
 * Extract toolbar token from request headers
 */
function extractTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Check x-toolbar-token header as fallback
  const toolbarToken = request.headers.get("x-toolbar-token")
  if (toolbarToken) {
    return toolbarToken
  }

  return null
}

/**
 * Middleware to authenticate toolbar requests
 * Returns userId if authenticated, null if not
 */
export async function authenticateToolbarRequest(
  request: NextRequest,
): Promise<string | null> {
  try {
    const token = extractTokenFromRequest(request)

    if (!token) {
      return null
    }

    const userId = await verifyToolbarToken(token)
    return userId
  } catch (error) {
    console.error("Toolbar authentication failed:", error)
    return null
  }
}

/**
 * Check if request is from toolbar (has toolbar-specific headers)
 */
export function isToolbarRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || ""
  const origin = request.headers.get("origin") || ""

  // Check for localhost origins (toolbar runs on localhost)
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return true
  }

  // Check for toolbar-specific headers
  if (
    request.headers.get("x-toolbar-token") ||
    request.headers.get("x-toolbar-request")
  ) {
    return true
  }

  return false
}
