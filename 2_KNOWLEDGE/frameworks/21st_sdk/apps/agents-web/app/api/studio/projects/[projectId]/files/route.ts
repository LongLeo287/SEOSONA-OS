import { prisma } from "@/lib/prisma"
import { authorizeStudioProjectRequest } from "@/lib/server/studio/auth"
import {
  createStudioAgentClient,
  listStudioWorkspaceFilePaths,
} from "@/lib/server/studio/sandbox"
import { toWorkspaceFiles } from "@/lib/server/studio/workspace"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const authResult = await authorizeStudioProjectRequest(request, projectId)
  if (!authResult.ok) {
    return Response.json({ error: authResult.error }, { status: authResult.status })
  }

  const project = await prisma.studioProject.findUnique({
    where: { id: projectId },
    select: { sandbox_id: true, workspace_files: true },
  })
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 })
  }

  if (project.sandbox_id) {
    try {
      const client = createStudioAgentClient()
      const files = await listStudioWorkspaceFilePaths(client, project.sandbox_id)
      return Response.json({ files })
    } catch (error) {
      console.warn(
        `[studio/files] Falling back to stored workspace for project ${projectId}`,
        error,
      )
    }
  }

  const files = Object.keys(toWorkspaceFiles(project.workspace_files)).sort()
  return Response.json({ files })
}
