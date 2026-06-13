import { Prisma } from "@/prisma/client"
import { prisma } from "@/lib/prisma"

export const studioProjectSelect = {
  id: true,
  user_id: true,
  team_id: true,
  name: true,
  workspace_files: true,
  deployed_slug: true,
  deployed_agent_id: true,
  sandbox_id: true,
  thread_id: true,
  session_status: true,
  session_last_seen_at: true,
  created_at: true,
  updated_at: true,
  deployedAgent: {
    select: {
      id: true,
      slug: true,
      name: true,
      active_deployment_id: true,
    },
  },
} satisfies Prisma.StudioProjectSelect

export type StudioProjectRecord = Prisma.StudioProjectGetPayload<{
  select: typeof studioProjectSelect
}>

export type TeamAccessResult =
  | { ok: true; teamId: string }
  | { ok: false; status: 404 | 403; message: string }

export async function verifyUserTeamAccess(
  teamId: string,
  userId: string,
): Promise<TeamAccessResult> {
  const [team, membership, user] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamId }, select: { id: true, user_id: true } }),
    prisma.teamMember.findUnique({
      where: { team_id_user_id: { team_id: teamId, user_id: userId } },
      select: { user_id: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { is_admin: true } }),
  ])

  if (!team) {
    return { ok: false, status: 404, message: "Team not found" }
  }
  if (team.user_id === userId || !!membership || user?.is_admin) {
    return { ok: true, teamId: team.id }
  }
  return { ok: false, status: 403, message: "You do not have access to this team" }
}

export async function reserveStudioDeployedSlug(teamId: string, baseSlug: string) {
  let slug = baseSlug
  let suffix = 1

  while (suffix <= 100) {
    const [project, agent] = await Promise.all([
      prisma.studioProject.findUnique({
        where: { team_id_deployed_slug: { team_id: teamId, deployed_slug: slug } },
        select: { id: true },
      }),
      prisma.anAgentConfig.findUnique({
        where: { team_id_slug: { team_id: teamId, slug } },
        select: { id: true },
      }),
    ])

    if (!project && !agent) {
      return slug
    }

    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }

  throw new Error("Could not generate unique Studio deploy slug")
}

export async function getStudioProjectById(projectId: string) {
  return prisma.studioProject.findUnique({
    where: { id: projectId },
    select: studioProjectSelect,
  })
}

export async function syncStudioProjectDeploymentBinding(
  projectOrId: string | StudioProjectRecord,
): Promise<StudioProjectRecord | null> {
  const project =
    typeof projectOrId === "string"
      ? await getStudioProjectById(projectOrId)
      : projectOrId

  if (!project) return null

  const deployedAgent = await prisma.anAgentConfig.findUnique({
    where: {
      team_id_slug: {
        team_id: project.team_id,
        slug: project.deployed_slug,
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      active_deployment_id: true,
    },
  })

  const desiredAgentId = deployedAgent?.id ?? null
  const currentAgentId = project.deployed_agent_id ?? null

  if (desiredAgentId === currentAgentId) {
    return {
      ...project,
      deployedAgent: deployedAgent ?? null,
    }
  }

  return prisma.studioProject.update({
    where: { id: project.id },
    data: {
      deployed_agent_id: desiredAgentId,
      updated_at: new Date(),
    },
    select: studioProjectSelect,
  })
}

export async function syncStudioProjectDeploymentBindings(
  projects: StudioProjectRecord[],
): Promise<StudioProjectRecord[]> {
  if (projects.length === 0) return projects

  const byTeam = new Map<string, StudioProjectRecord[]>()
  for (const project of projects) {
    const bucket = byTeam.get(project.team_id) ?? []
    bucket.push(project)
    byTeam.set(project.team_id, bucket)
  }

  const synced: StudioProjectRecord[] = []

  for (const [teamId, teamProjects] of byTeam.entries()) {
    const deployedSlugs = [...new Set(teamProjects.map((project) => project.deployed_slug))]
    const deployedAgents = await prisma.anAgentConfig.findMany({
      where: {
        team_id: teamId,
        slug: { in: deployedSlugs },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        active_deployment_id: true,
      },
    })

    const agentBySlug = new Map(
      deployedAgents.map((agent) => [agent.slug, agent] as const),
    )

    for (const project of teamProjects) {
      const deployedAgent = agentBySlug.get(project.deployed_slug) ?? null
      const desiredAgentId = deployedAgent?.id ?? null
      const currentAgentId = project.deployed_agent_id ?? null

      if (desiredAgentId !== currentAgentId) {
        const updated = await prisma.studioProject.update({
          where: { id: project.id },
          data: {
            deployed_agent_id: desiredAgentId,
            updated_at: new Date(),
          },
          select: studioProjectSelect,
        })
        synced.push(updated)
        continue
      }

      synced.push({
        ...project,
        deployedAgent,
      })
    }
  }

  return synced.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
}
