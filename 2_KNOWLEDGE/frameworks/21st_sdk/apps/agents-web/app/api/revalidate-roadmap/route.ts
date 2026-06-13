import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Optional: On-demand revalidation endpoint
// Call this from a GitHub webhook when issues/project changes
// POST /api/revalidate-roadmap?secret=YOUR_SECRET

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")

  // Simple secret check - you can use CRON_SECRET or create a new one
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  try {
    // Revalidate all fetches tagged with "roadmap"
    await revalidateTag("roadmap", "default")

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    )
  }
}
