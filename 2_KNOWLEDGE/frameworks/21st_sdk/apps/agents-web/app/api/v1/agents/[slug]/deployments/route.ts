import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { authenticateApiKey } from "../../../_lib/auth"
import { findApiAccessibleAgent } from "../../../_lib/enterprise-agents"
import { validateSlugParam, withApiErrorHandling } from "../../../_lib/errors"
import { checkApiRateLimits } from "../../../_lib/rate-limit"

export const GET = withApiErrorHandling(
  async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const slugErr = validateSlugParam(slug)
    if (slugErr) return slugErr
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const resolvedAgent = await findApiAccessibleAgent(auth.teamId, slug)
    if (!resolvedAgent?.agent) {
      throw {
        status: 404,
        error: "not_found",
        message: `Agent "${slug}" not found`,
      }
    }
    const agent = resolvedAgent.agent

    const deps = await prisma.anDeployment.findMany({
      where: { agent_id: agent.id },
      orderBy: { version: "desc" },
      take: 50,
      select: {
        id: true,
        version: true,
        status: true,
        deployed_at: true,
        completed_at: true,
        error: true,
        metadata: true,
      },
    })

    const deployments = deps.map((d) => ({
      id: d.id,
      version: d.version,
      status: d.status,
      isActive: d.id === agent.active_deployment_id,
      deployedAt: d.deployed_at?.toISOString() ?? null,
      completedAt: d.completed_at?.toISOString() ?? null,
      error: d.error,
      metadata: d.metadata as Record<string, unknown> | null,
    }))

    return NextResponse.json({ deployments })
  },
)
