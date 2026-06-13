import { NextRequest, NextResponse } from "next/server"
import { StyleProfileDBService } from "../db-service"

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl, teamId } = await request.json()

    if (!websiteUrl || !teamId) {
      return NextResponse.json(
        { error: "Website URL and team ID are required" },
        { status: 400 },
      )
    }

    // Look for existing custom theme for this website URL and team
    const existingTheme =
      await StyleProfileDBService.findCustomThemeByWebsiteUrl(
        websiteUrl,
        teamId,
      )

    if (existingTheme) {
      return NextResponse.json({
        success: true,
        theme: {
          id: existingTheme.id,
          siteName: existingTheme.site_name,
          css: existingTheme.css,
          url: existingTheme.url,
          generatedAt: existingTheme.generated_at,
        },
      })
    }

    return NextResponse.json({
      success: false,
      theme: null,
    })
  } catch (error) {
    console.error("Failed to find theme by URL:", error)
    return NextResponse.json({ error: "Failed to find theme" }, { status: 500 })
  }
}
