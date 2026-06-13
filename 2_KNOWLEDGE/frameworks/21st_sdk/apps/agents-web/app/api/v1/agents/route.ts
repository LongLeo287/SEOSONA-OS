import { NextResponse } from "next/server"
import { authenticateApiKey } from "../_lib/auth"
import { listAccessibleAgents } from "../_lib/enterprise-agents"
import { withApiErrorHandling } from "../_lib/errors"
import { checkApiRateLimits } from "../_lib/rate-limit"

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const agents = await listAccessibleAgents(auth.teamId)

  return NextResponse.json({
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      runtime: a.runtime,
      ownerTeamId: a.team_id,
      isShared: a.team_id !== auth.teamId,
      deployedAt: a.deployed_at?.toISOString() ?? null,
      createdAt: a.created_at.toISOString(),
      updatedAt: a.updated_at.toISOString(),
      activeVersion: a.activeDeployment?.version ?? null,
      activeDeploymentStatus: a.activeDeployment?.status ?? null,
    })),
  })
})
