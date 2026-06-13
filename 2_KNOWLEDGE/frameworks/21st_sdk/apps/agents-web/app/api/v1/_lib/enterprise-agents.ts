import {
  dedupeAccessibleAgentConfigs,
  findAccessibleAgentBySlug,
  getAccessibleAgentTeamIds,
} from "@repo/sandbox-provider/enterprise-access"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/prisma/client"

export async function listAccessibleAgents(teamId: string) {
  const accessibleTeamIds = await getAccessibleAgentTeamIds(teamId)
  const agents = await prisma.anAgentConfig.findMany({
    where: { team_id: { in: accessibleTeamIds } },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      team_id: true,
      name: true,
      slug: true,
      runtime: true,
      deployed_at: true,
      created_at: true,
      updated_at: true,
      active_deployment_id: true,
      activeDeployment: {
        select: {
          id: true,
          version: true,
          status: true,
          deployed_at: true,
        },
      },
    },
  })

  return dedupeAccessibleAgentConfigs(agents, teamId)
}

export async function findApiAccessibleAgent(teamId: string, slug: string) {
  const resolved = await findAccessibleAgentBySlug(teamId, slug)
  if (!resolved) {
    return null
  }

  const agent = await prisma.anAgentConfig.findUnique({
    where: { id: resolved.agentId },
    select: {
      id: true,
      team_id: true,
      name: true,
      slug: true,
      runtime: true,
      env_vars: true,
      deployed_at: true,
      created_at: true,
      updated_at: true,
      active_deployment_id: true,
      activeDeployment: {
        select: {
          id: true,
          version: true,
          status: true,
          deployed_at: true,
          metadata: true,
        },
      },
    },
  })

  if (!agent) {
    return null
  }

  return {
    agent,
    isShared: resolved.isShared,
    ownerTeamId: resolved.ownerTeamId,
  }
}

export function sandboxLogsWhere(agentId: string, teamId: string, isShared: boolean): Prisma.AnSandboxWhereInput {
  if (!isShared) {
    return { agent_id: agentId }
  }

  return {
    agent_id: agentId,
    invocation_team_id: teamId,
  }
}
