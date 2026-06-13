import { prisma } from "@/lib/prisma"
import { exchangeToken } from "@21st-sdk/nextjs/server"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import {
  CURRENT_AGENT_API_KEY_PREFIX,
  getApiKeyPrefix,
  hashApiKey,
} from "@repo/api-key-security"

/**
 * Token exchange for testing deployed agents in the quickstart.
 * Auto-resolves the user's team — no teamId needed from client.
 */
export async function POST(req: Request) {
  const session = await getAgentsRequestSession(req)
  const userId = session.internalUserId
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { agent, teamId: bodyTeamId } = body as { agent?: string; teamId?: string }

  // Use provided teamId, or find the user's team
  let teamId = bodyTeamId
  if (!teamId) {
    const team = await prisma.team.findFirst({
      where: { user_id: userId },
      select: { id: true },
    })
    if (!team) {
      return Response.json({ error: "No team found" }, { status: 400 })
    }
    teamId = team.id
  }

  // Get an active API key for the team
  let apiKey = await prisma.anApiKey.findFirst({
    where: { team_id: teamId, is_active: true },
    orderBy: { created_at: "desc" },
  })

  let plaintextApiKey = apiKey?.key ?? null

  if (!apiKey || !plaintextApiKey) {
    const crypto = await import("crypto")
    plaintextApiKey = CURRENT_AGENT_API_KEY_PREFIX + crypto.randomBytes(32).toString("hex")
    apiKey = await prisma.anApiKey.create({
      data: {
        key: plaintextApiKey,
        key_hash: hashApiKey(plaintextApiKey),
        key_prefix: getApiKeyPrefix(plaintextApiKey),
        team_id: teamId!,
        user_id: userId,
        name: "Default",
      },
    })
  }

  try {
    // Use the API key owner's userId — the Claude proxy only recognizes
    // users registered in its DB. The Clerk userId may not be in the proxy.
    const data = await exchangeToken({
      apiKey: plaintextApiKey,
      agent,
      userId: apiKey.user_id,
    })
    return Response.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Token exchange failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
