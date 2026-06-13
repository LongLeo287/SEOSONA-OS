import { NextRequest, NextResponse } from "next/server"
import { changelogService } from "@/lib/changelog"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = parseInt(searchParams.get("per_page") || "10", 10)

    // Limit per_page to prevent abuse
    const limitedPerPage = Math.min(perPage, 50)

    const { releases, hasMore } = await changelogService.getDesktopReleases(
      limitedPerPage,
      page,
    )

    return NextResponse.json({
      releases,
      page,
      perPage: limitedPerPage,
      hasMore,
    })
  } catch (error) {
    console.error("Failed to fetch desktop releases:", error)
    return NextResponse.json(
      { error: "Failed to fetch desktop releases" },
      { status: 500 },
    )
  }
}
