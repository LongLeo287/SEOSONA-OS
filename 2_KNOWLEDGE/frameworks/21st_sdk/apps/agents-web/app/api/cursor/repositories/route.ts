import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getTeamCursorIntegration,
  saveCursorRepositories,
} from "@/lib/server/cursor-integration"
import { CursorBGAgentsAPI } from "@/lib/server/cursor-bg-agents-api"

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let payload: { apiKey?: string; teamId?: string }

  try {
    payload = (await request.json()) as { apiKey?: string; teamId?: string }
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  const apiKeyInput =
    typeof payload.apiKey === "string" ? payload.apiKey.trim() : ""
  const teamId = payload.teamId?.trim()

  let apiKey = apiKeyInput

  try {
    if (!apiKey) {
      if (!teamId) {
        return NextResponse.json(
          { message: "Either apiKey or teamId must be provided" },
          { status: 400 },
        )
      }

      const integration = await getTeamCursorIntegration(teamId, userId)

      if (!integration.apiKey) {
        return NextResponse.json(
          {
            message: "Cursor API key not configured",
            needsConfiguration: true,
          },
          { status: 400 },
        )
      }

      apiKey = integration.apiKey
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load Cursor integration"
    return NextResponse.json({ message }, { status: 400 })
  }

  try {
    const cursorAPI = new CursorBGAgentsAPI(apiKey)
    const data = await cursorAPI.listRepositories()

    // Save repositories to database if teamId is provided
    if (teamId && data.repositories) {
      try {
        await saveCursorRepositories(teamId, userId, data.repositories)
      } catch (saveError) {
        console.error("Failed to save repositories to database", saveError)
        // Don't fail the entire request if saving fails
      }
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch Cursor repositories", error)

    // Fallback: Check if team has stored repositories from previous successful calls
    if (teamId) {
      try {
        const integration = await getTeamCursorIntegration(teamId, userId)
        if (integration.repositories && integration.repositories.length > 0) {
          console.log("Using cached repositories from team integration")
          return NextResponse.json(
            { repositories: integration.repositories },
            { status: 200 }
          )
        }
      } catch (fallbackError) {
        console.error("Failed to fetch cached repositories", fallbackError)
      }
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch repositories"
    return NextResponse.json({ message }, { status: 500 })
  }
}
