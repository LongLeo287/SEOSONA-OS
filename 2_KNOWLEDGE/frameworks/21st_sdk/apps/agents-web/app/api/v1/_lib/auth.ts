import { prisma } from "@/lib/prisma"
import { hashApiKey, isAgentApiKey } from "@repo/api-key-security"

export interface ApiKeyAuth {
  userId: string
  teamId: string
  apiKeyId: string
  plan: string
  requestsRemaining: number
}

export async function authenticateApiKey(req: Request): Promise<ApiKeyAuth> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw {
      status: 401,
      error: "unauthorized",
      message:
        "Missing or invalid Authorization header. Use: Authorization: Bearer <API_KEY>",
    }
  }

  const apiKey = authHeader.slice(7).trim()
  if (!apiKey) {
    throw {
      status: 401,
      error: "unauthorized",
      message: "API key is empty",
    }
  }

  // Try current 21st keys and legacy an_sk_ keys first, then fall back to api_keys.
  const isAnKey = isAgentApiKey(apiKey)
  const apiKeyHash = hashApiKey(apiKey)

  const keyRecord = isAnKey
    ? await prisma.anApiKey.findFirst({
        where: {
          OR: [{ key_hash: apiKeyHash }, { key: apiKey }],
        },
        select: {
          id: true,
          user_id: true,
          team_id: true,
          is_active: true,
          expires_at: true,
          requests_count: true,
          requests_limit: true,
        },
      })
    : await prisma.apiKey.findFirst({
        where: {
          OR: [{ key_hash: apiKeyHash }, { key: apiKey }],
        },
        select: {
          id: true,
          user_id: true,
          team_id: true,
          plan: true,
          is_active: true,
          expires_at: true,
          requests_count: true,
          requests_limit: true,
        },
      })

  if (!keyRecord) {
    throw {
      status: 401,
      error: "invalid_api_key",
      message: "Invalid API key",
    }
  }

  if (keyRecord.is_active === false) {
    throw {
      status: 401,
      error: "api_key_inactive",
      message: "API key is inactive",
    }
  }

  if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
    throw {
      status: 401,
      error: "api_key_expired",
      message: "API key has expired",
    }
  }

  if (!keyRecord.team_id) {
    throw {
      status: 403,
      error: "no_team",
      message:
        "This API key is not associated with a team. Create a team-scoped API key.",
    }
  }

  const requestsLimit = keyRecord.requests_limit ?? 1000
  const requestsCount = keyRecord.requests_count ?? 0
  const requestsRemaining = Math.max(0, requestsLimit - requestsCount)

  // Update last_used_at (fire and forget)
  const model = isAnKey ? prisma.anApiKey : prisma.apiKey
  ;(model as any)
    .update({
      where: { id: keyRecord.id },
      data: { last_used_at: new Date() },
    })
    .catch(() => {})

  return {
    userId: keyRecord.user_id,
    teamId: keyRecord.team_id,
    apiKeyId: keyRecord.id,
    plan: ("plan" in keyRecord ? keyRecord.plan : null) ?? "free",
    requestsRemaining,
  }
}
