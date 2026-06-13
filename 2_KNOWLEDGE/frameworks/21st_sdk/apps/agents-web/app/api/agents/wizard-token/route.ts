import { exchangeToken } from "@21st-sdk/nextjs/server"
import { getStudioWizardApiKey } from "@/lib/server/studio/config"

export async function POST(request: Request) {
  const apiKey = getStudioWizardApiKey()
  if (!apiKey) {
    return Response.json(
      { error: "Server misconfigured: BUILDER_WIZARD_API_KEY or AN_API_KEY is required" },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      agent?: string
      userId?: string
    }

    console.log("[wizard-token] exchanging token", { agent: body.agent, userId: body.userId, hasApiKey: !!apiKey })

    const token = await exchangeToken({
      apiKey,
      agent: body.agent,
      userId: body.userId,
    })
    console.log("[wizard-token] token exchanged ok")
    return Response.json(token)
  } catch (error) {
    console.error("[wizard-token] exchange failed:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to exchange token",
      },
      { status: 500 },
    )
  }
}
