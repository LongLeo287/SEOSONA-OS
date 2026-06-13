import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { createDesktopAuthCode } from "@/lib/desktop-auth"

/**
 * POST /api/auth/desktop/create-code
 *
 * Creates a one-time auth code for desktop app authentication.
 * Requires an authenticated Clerk session.
 *
 * Returns: { code: string, expiresAt: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      )
    }

    const authCode = await createDesktopAuthCode(userId)

    return NextResponse.json({
      code: authCode.code,
      expiresAt: authCode.expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Failed to create desktop auth code:", error)
    return NextResponse.json(
      { error: "Failed to create auth code" },
      { status: 500 },
    )
  }
}
