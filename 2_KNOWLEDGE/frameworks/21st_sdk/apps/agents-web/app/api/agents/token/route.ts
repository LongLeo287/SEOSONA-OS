import crypto from "crypto"
import {
  CURRENT_AGENT_API_KEY_PREFIX,
  getApiKeyPrefix,
  hashApiKey,
} from "@repo/api-key-security"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { prisma } from "@/lib/prisma"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://relay.an.dev"

export async function POST(req: Request) {
  const session = await getAgentsRequestSession(req)
  if (!session.internalUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.internalUserId

  const body = await req.json()
  const { teamId, agent, expiresIn } = body as {
    teamId: string
    agent?: string
    expiresIn?: string
  }

  if (!teamId) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  try {
    await checkTeamAccess(teamId, userId)
  } catch (error) {
    const code =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : null

    const status =
      code === "NOT_FOUND" ? 404 : code === "FORBIDDEN" ? 403 : code === "UNAUTHORIZED" ? 401 : 403

    return Response.json(
      { error: error instanceof Error ? error.message : "Access denied" },
      { status },
    )
  }

  // Find or auto-create an active API key for this team.
  let apiKey = await prisma.anApiKey.findFirst({
    where: { team_id: teamId, is_active: true },
    orderBy: { created_at: "desc" },
  })

  let plaintextApiKey = apiKey?.key ?? null

  if (!apiKey || !plaintextApiKey) {
    plaintextApiKey = CURRENT_AGENT_API_KEY_PREFIX + crypto.randomBytes(32).toString("hex")
    apiKey = await prisma.anApiKey.create({
      data: {
        key: plaintextApiKey,
        key_hash: hashApiKey(plaintextApiKey),
        key_prefix: getApiKeyPrefix(plaintextApiKey),
        team_id: teamId,
        user_id: userId,
        name: "Default",
      },
    })
  }

  // Call relay to create a JWT token
  const res = await fetch(`${RELAY_URL}/v1/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${plaintextApiKey}`,
    },
    body: JSON.stringify({
      userId,
      agents: agent ? [agent] : undefined,
      expiresIn: expiresIn || "1h",
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create token" }))
    return Response.json(err, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
