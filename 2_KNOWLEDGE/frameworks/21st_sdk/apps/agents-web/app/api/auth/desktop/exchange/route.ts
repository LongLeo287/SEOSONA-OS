import { NextRequest, NextResponse } from "next/server"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { exchangeDesktopAuthCode } from "@/lib/desktop-auth"
import { redis } from "@/lib/redis"

const RATE_LIMIT_WINDOW = 60 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 attempts per window

/**
 * Simple rate limiting using Redis
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  if (IS_STANDALONE_APP) {
    return true
  }

  const key = `desktop-exchange:${ip}`
  try {
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW)
    }
    return current <= RATE_LIMIT_MAX
  } catch {
    // If Redis fails, allow the request (fail open for availability)
    return true
  }
}

/**
 * POST /api/auth/desktop/exchange
 *
 * Exchanges a one-time auth code for a desktop session.
 * This is called by the Electron app after receiving the code via deep link.
 *
 * Body: { code: string, deviceInfo?: string }
 * Returns: { token, refreshToken, expiresAt, user }
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limit by IP to prevent brute force
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { code, deviceInfo } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Auth code is required" },
        { status: 400 },
      )
    }

    const session = await exchangeDesktopAuthCode(code, deviceInfo)

    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired auth code" },
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
    console.error("Failed to exchange desktop auth code:", error)
    return NextResponse.json(
      { error: "Failed to exchange auth code" },
      { status: 500 },
    )
  }
}
