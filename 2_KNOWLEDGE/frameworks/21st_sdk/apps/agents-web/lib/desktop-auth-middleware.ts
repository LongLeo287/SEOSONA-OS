import { NextRequest } from "next/server"
import { verifyDesktopToken, getDesktopSessionUser } from "./desktop-auth"

/**
 * Extract desktop token from request headers
 */
export function getDesktopToken(request: NextRequest): string | null {
  return request.headers.get("X-Desktop-Token")
}

/**
 * Verify desktop authentication from request
 * Returns userId if valid, null otherwise
 */
export async function verifyDesktopAuth(request: NextRequest): Promise<string | null> {
  const token = getDesktopToken(request)
  if (!token) return null

  return await verifyDesktopToken(token)
}

/**
 * Get desktop user from request
 * Returns user data if authenticated via desktop, null otherwise
 */
export async function getDesktopUser(request: NextRequest) {
  const token = getDesktopToken(request)
  if (!token) return null

  return await getDesktopSessionUser(token)
}

/**
 * Check if request is from desktop app
 */
export function isDesktopRequest(request: NextRequest): boolean {
  return request.headers.has("X-Desktop-Token")
}
