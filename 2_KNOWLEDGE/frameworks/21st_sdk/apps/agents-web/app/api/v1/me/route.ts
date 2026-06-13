import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../_lib/auth"
import { checkApiRateLimits } from "../_lib/rate-limit"
import { withApiErrorHandling } from "../_lib/errors"

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const [user, team] = await Promise.all([
    prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image_url: true,
      },
    }),
    prisma.team.findUnique({
      where: { id: auth.teamId },
      select: {
        id: true,
        name: true,
        github_integration: true,
        github_installation_id: true,
      },
    }),
  ])

  if (!user) {
    throw {
      status: 404,
      error: "user_not_found",
      message: "User associated with this API key was not found",
    }
  }

  if (!team) {
    throw {
      status: 404,
      error: "team_not_found",
      message: "Team associated with this API key was not found",
    }
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.name || user.username,
    },
    team: {
      id: team.id,
      name: team.name,
      hasGithub: !!team.github_installation_id,
    },
    plan: auth.plan,
    requestsRemaining: auth.requestsRemaining,
  })
})
