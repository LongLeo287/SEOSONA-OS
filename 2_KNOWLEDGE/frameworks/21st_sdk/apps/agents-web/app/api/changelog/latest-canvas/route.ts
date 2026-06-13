import { NextResponse } from "next/server"
import { changelogService } from "@/lib/changelog"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCanvas = searchParams.get("canvas") === "true"

    const releases = await changelogService.getCombinedReleases(
      1,
      includeCanvas,
    )

    if (releases.length === 0) {
      return NextResponse.json({ error: "No releases found" }, { status: 404 })
    }

    const latestRelease = releases[0]
    const parsedChangelog = changelogService.parseChangelog(
      latestRelease.content,
    )

    return NextResponse.json({
      release: latestRelease,
      changelog: parsedChangelog,
    })
  } catch (error) {
    console.error("Failed to fetch latest release:", error)
    return NextResponse.json(
      { error: "Failed to fetch latest release" },
      { status: 500 },
    )
  }
}
