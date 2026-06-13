import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getTeamCursorIntegration } from "@/lib/server/cursor-integration"
import { CursorBGAgentsAPI } from "@/lib/server/cursor-bg-agents-api"

interface CreateAgentRequestBody {
  prompt?:
    | string
    | {
        text?: string
        images?: Array<{
          data: string
          dimension: { width: number; height: number }
        }>
      }
  teamId?: string
  name?: string
  model?: string
  source?: {
    ref?: string
  }
  target?: {
    autoCreatePr?: boolean
    branchName?: string
  }
  webhook?: {
    url?: string
    secret?: string
  }
}

function extractPromptFromPayload(prompt: CreateAgentRequestBody["prompt"]): {
  text: string
  images?: Array<{
    data: string
    dimension: { width: number; height: number }
  }>
} {
  if (!prompt) {
    return { text: "" }
  }

  if (typeof prompt === "string") {
    return { text: prompt }
  }

  return {
    text: prompt.text || "",
    images: prompt.images || undefined,
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let payload: CreateAgentRequestBody

  try {
    payload = (await request.json()) as CreateAgentRequestBody
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  const teamId = payload.teamId?.trim()

  if (!teamId) {
    return NextResponse.json({ message: "teamId is required" }, { status: 400 })
  }

  const promptData = extractPromptFromPayload(payload.prompt)

  if (!promptData.text.trim()) {
    return NextResponse.json(
      { message: "Prompt text is required" },
      { status: 400 },
    )
  }

  let apiKey: string | null = null
  let selectedRepository: string | null = null

  try {
    const integration = await getTeamCursorIntegration(teamId, userId)
    apiKey = integration.apiKey
    selectedRepository = integration.selectedRepository

    if (!apiKey || !selectedRepository) {
      return NextResponse.json(
        {
          message: "Cursor integration incomplete",
          needsConfiguration: true,
        },
        { status: 400 },
      )
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

    const agentRequest = {
      prompt: promptData,
      source: {
        repository: selectedRepository,
        ref: payload.source?.ref || "main",
      },
      model: payload.model,
      target: payload.target,
      webhook: payload.webhook,
    }

    const data = await cursorAPI.startAgent(agentRequest)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Failed to create Cursor background agent", error)
    const message =
      error instanceof Error ? error.message : "Failed to create agent"
    return NextResponse.json({ message }, { status: 500 })
  }
}
