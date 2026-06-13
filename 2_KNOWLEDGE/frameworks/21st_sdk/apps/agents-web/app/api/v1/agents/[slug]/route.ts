import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { authenticateApiKey } from "../../_lib/auth"
import { findApiAccessibleAgent } from "../../_lib/enterprise-agents"
import { validateSlugParam, withApiErrorHandling } from "../../_lib/errors"
import { checkApiRateLimits } from "../../_lib/rate-limit"

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
    const agent = await prisma.anAgentConfig.findUnique({
      where: { id: resolvedAgent.agent.id },
      select: {
        id: true,
        team_id: true,
        name: true,
        slug: true,
        runtime: true,
        deployed_at: true,
        created_at: true,
        updated_at: true,
        activeDeployment: {
          select: {
            id: true,
            version: true,
            status: true,
            deployed_at: true,
            metadata: true,
          },
        },
        _count: { select: { deployments: true } },
      },
    })

    if (!agent) {
      throw {
        status: 404,
        error: "not_found",
        message: `Agent "${slug}" not found`,
      }
    }

    const metadata = agent.activeDeployment?.metadata as Record<
      string,
      unknown
    > | null

    return NextResponse.json({
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      runtime: agent.runtime,
      ownerTeamId: agent.team_id,
      isShared: agent.team_id !== auth.teamId,
      deployedAt: agent.deployed_at?.toISOString() ?? null,
      createdAt: agent.created_at.toISOString(),
      updatedAt: agent.updated_at.toISOString(),
      activeVersion: agent.activeDeployment?.version ?? null,
      activeDeploymentStatus: agent.activeDeployment?.status ?? null,
      model: (metadata?.model as string) ?? null,
      mcpServers: Array.isArray(metadata?.mcpServers)
        ? metadata?.mcpServers
        : [],
      vaultIds: Array.isArray(metadata?.vaultIds) ? metadata?.vaultIds : [],
      totalDeployments: agent._count.deployments,
    })
  },
)

export const DELETE = withApiErrorHandling(
  async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const slugErr = validateSlugParam(slug)
    if (slugErr) return slugErr
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const agent = await prisma.anAgentConfig.findUnique({
      where: { team_id_slug: { team_id: auth.teamId, slug } },
      select: { id: true },
    })

    if (!agent) {
      throw {
        status: 404,
        error: "not_found",
        message: `Agent "${slug}" not found`,
      }
    }

    // Single delete — deployments and sandboxes are removed via DB cascade
    await prisma.anAgentConfig.delete({
      where: { id: agent.id },
    })

    return NextResponse.json({
      success: true,
      slug,
      message: `Agent "${slug}" deleted`,
    })
  },
)
