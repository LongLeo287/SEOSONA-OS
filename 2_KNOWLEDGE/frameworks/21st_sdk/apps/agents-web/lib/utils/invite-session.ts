/**
 * Utilities for managing invite code during OAuth flow
 * Uses cookies to persist invite code across auth redirects
 */

const INVITE_CODE_COOKIE_NAME = "agent_invite_code"
const COOKIE_MAX_AGE = 60 * 60 // 1 hour in seconds

/**
 * Set invite code in cookie for OAuth flow
 */
export function setInviteCodeCookie(code: string): void {
  if (typeof document === "undefined") return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000)
  
  document.cookie = `${INVITE_CODE_COOKIE_NAME}=${code}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

/**
 * Get invite code from cookie
 */
export function getInviteCodeCookie(): string | null {
  if (typeof document === "undefined") return null
  
  const cookies = document.cookie.split(";")
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === INVITE_CODE_COOKIE_NAME) {
      return value
    }
  }
  
  return null
}

/**
 * Clear invite code cookie
 */
export function clearInviteCodeCookie(): void {
  if (typeof document === "undefined") return
  
  document.cookie = `${INVITE_CODE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Build invite URL for sharing
 */
export function buildAgentInviteUrl(code: string): string {
  if (typeof window === "undefined") {
    return `${process.env.NEXT_PUBLIC_APP_URL || ""}/invite/${code}`
  }
  return `${window.location.origin}/invite/${code}`
}



