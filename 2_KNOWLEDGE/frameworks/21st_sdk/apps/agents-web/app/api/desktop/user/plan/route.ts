import { verifyDesktopAuth } from "@/lib/desktop-auth-middleware"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Get user's subscription plan for PostHog analytics
 * Returns only email and plan name - minimal data for analytics enrichment
 */
export async function GET(req: NextRequest) {
  const userId = await verifyDesktopAuth(req)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        agentsPlansInfo: {
          select: {
            plan: { select: { type: true } },
            status: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      email: user.email,
      plan: user.agentsPlansInfo?.plan?.type || "free",
      status: user.agentsPlansInfo?.status || null,
    })
  } catch (error) {
    console.error("[Desktop User Plan API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user plan" },
      { status: 500 },
    )
  }
}
