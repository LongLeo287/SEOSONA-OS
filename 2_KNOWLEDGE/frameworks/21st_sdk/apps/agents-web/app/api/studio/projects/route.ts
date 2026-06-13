import { prisma } from "@/lib/prisma"
import { loadTemplate, listTemplates } from "@/lib/agent-templates"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import {
  createStudioAgentClient,
  createStudioWorkspaceSandbox,
} from "@/lib/server/studio/sandbox"
import {
  reserveStudioDeployedSlug,
  studioProjectSelect,
  syncStudioProjectDeploymentBindings,
  verifyUserTeamAccess,
} from "@/lib/server/studio/projects"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: Request) {
  const session = await getAgentsRequestSession(req)
  const userId = session.internalUserId
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const teamId = new URL(req.url).searchParams.get("teamId")
  if (!teamId || !UUID_RE.test(teamId)) {
    return Response.json({ error: "teamId query param is required" }, { status: 400 })
  }

  const access = await verifyUserTeamAccess(teamId, userId)
  if (!access.ok) {
    return Response.json({ error: access.message }, { status: access.status })
  }

  const projects = await prisma.studioProject.findMany({
    where: { team_id: access.teamId },
    select: studioProjectSelect,
    orderBy: { updated_at: "desc" },
    take: 50,
  })

  const syncedProjects = await syncStudioProjectDeploymentBindings(projects)
  return Response.json({
    projects: syncedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      deployed_slug: project.deployed_slug,
      deployed_agent_id: project.deployed_agent_id,
      created_at: project.created_at,
      updated_at: project.updated_at,
      hasDeployment: !!project.deployedAgent?.active_deployment_id,
    })),
  })
}

export async function POST(req: Request) {
  const session = await getAgentsRequestSession(req)
  const userId = session.internalUserId
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { templateSlug?: unknown; name?: unknown; teamId?: unknown }
  try {
    body = (await req.json()) as {
      templateSlug?: unknown
      name?: unknown
      teamId?: unknown
    }
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { templateSlug, name: requestedName, teamId } = body
  if (typeof templateSlug !== "string" || templateSlug.length === 0) {
    return Response.json({ error: "templateSlug is required" }, { status: 400 })
  }
  if (typeof teamId !== "string" || !UUID_RE.test(teamId)) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  const access = await verifyUserTeamAccess(teamId, userId)
  if (!access.ok) {
    return Response.json({ error: access.message }, { status: access.status })
  }

  const templates = await listTemplates()
  const template = templates.find((entry) => entry.slug === templateSlug)
  if (!template) {
    console.error("[studio/projects] Template missing", {
      templateSlug,
      availableTemplates: templates.map((entry) => entry.slug),
      cwd: process.cwd(),
    })
    return Response.json(
      { error: `Template "${templateSlug}" not found` },
      { status: 404 },
    )
  }

  let workspaceFiles: Record<string, string>
  try {
    workspaceFiles = await loadTemplate(templateSlug)
  } catch (error) {
    console.error("[studio/projects] Failed to load template", templateSlug, error)
    return Response.json({ error: "Failed to load template" }, { status: 500 })
  }

  let deployedSlug: string
  try {
    deployedSlug = await reserveStudioDeployedSlug(access.teamId, template.slug)
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not reserve deploy slug",
      },
      { status: 500 },
    )
  }

  const name =
    typeof requestedName === "string" && requestedName.trim().length > 0
      ? requestedName.trim().slice(0, 100)
      : template.name

  const project = await prisma.studioProject.create({
    data: {
      user_id: userId,
      team_id: access.teamId,
      name,
      workspace_files: workspaceFiles,
      deployed_slug: deployedSlug,
    },
    select: {
      id: true,
      name: true,
      deployed_slug: true,
      created_at: true,
      updated_at: true,
    },
  })

  try {
    const client = createStudioAgentClient()
    const sandboxId = await createStudioWorkspaceSandbox({
      client,
      projectId: project.id,
      deployedSlug: deployedSlug,
      workspaceFiles,
    })

    await prisma.studioProject.update({
      where: { id: project.id },
      data: {
        sandbox_id: sandboxId,
        updated_at: new Date(),
      },
    })
  } catch (error) {
    await prisma.studioProject.delete({ where: { id: project.id } }).catch(() => {})
    console.error(
      `[studio/projects] Failed to provision sandbox for project ${project.id}`,
      error,
    )
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to provision Studio sandbox",
      },
      { status: 500 },
    )
  }

  console.log(
    `[studio/projects] Created project ${project.id} (${project.deployed_slug}) from template ${templateSlug}`,
  )

  return Response.json({
    projectId: project.id,
    deployedSlug: project.deployed_slug,
    name: project.name,
  })
}
