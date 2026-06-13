import { NextRequest, NextResponse } from "next/server"
import { cleanupExpiredDesktopAuth } from "@/lib/desktop-auth"

/**
 * GET /api/cron/desktop-auth-cleanup
 *
 * Cron job to clean up expired desktop auth codes and sessions.
 * Should be called periodically (e.g., daily) via Vercel Cron.
 *
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/desktop-auth-cleanup",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await cleanupExpiredDesktopAuth()

    console.log(
      `Desktop auth cleanup: deleted ${result.codes} expired codes, ${result.sessions} expired sessions`,
    )

    return NextResponse.json({
      success: true,
      deletedCodes: result.codes,
      deletedSessions: result.sessions,
    })
  } catch (error) {
    console.error("Desktop auth cleanup failed:", error)
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 },
    )
  }
}

