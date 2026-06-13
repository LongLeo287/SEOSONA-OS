import { NextRequest, NextResponse } from "next/server"
import { refreshDesktopSession } from "@/lib/desktop-auth"

/**
 * POST /api/auth/desktop/refresh
 *
 * Refreshes a desktop session using the refresh token.
 * Returns new tokens with extended expiration.
 *
 * Body: { refreshToken: string }
 * Returns: { token, refreshToken, expiresAt, user }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 },
      )
    }

    const session = await refreshDesktopSession(refreshToken)

    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 },
      )
    }

    return NextResponse.json({
      token: session.token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt.toISOString(),
      user: session.user,
    })
  } catch (error) {
    console.error("Failed to refresh desktop session:", error)
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 },
    )
  }
}
