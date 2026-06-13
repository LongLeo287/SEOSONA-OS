import { prisma } from "@/lib/prisma"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { verifyStudioToken } from "./jwt"

export type StudioAuthContext = {
  userId: string
  teamId: string
  projectId: string
  sandboxId: string | null
  threadId: string | null
  source: "clerk" | "studio-token"
}

export type StudioAuthResult =
  | { ok: true; ctx: StudioAuthContext }
  | { ok: false; status: 401 | 403 | 404; error: string }

export async function authorizeStudioProjectRequest(
  request: Request,
  projectId: string,
): Promise<StudioAuthResult> {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim()

    try {
      const claims = await verifyStudioToken(token)
      if (claims.projectId !== projectId) {
        return {
          ok: false,
          status: 403,
          error: "Studio token scoped to a different project",
        }
      }

      const project = await prisma.studioProject.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          user_id: true,
          team_id: true,
          sandbox_id: true,
          thread_id: true,
        },
      })

      if (!project) {
        return { ok: false, status: 404, error: "Project not found" }
      }
      if (project.user_id !== claims.userId || project.team_id !== claims.teamId) {
        return { ok: false, status: 403, error: "Studio token user/team mismatch" }
      }
      if (
        project.sandbox_id !== claims.sandboxId ||
        project.thread_id !== claims.threadId
      ) {
        return {
          ok: false,
          status: 403,
          error: "Studio token no longer matches the current project session",
        }
      }

      return {
        ok: true,
        ctx: {
          userId: claims.userId,
          teamId: claims.teamId,
          projectId,
          sandboxId: project.sandbox_id,
          threadId: project.thread_id,
          source: "studio-token",
        },
      }
    } catch {
      return { ok: false, status: 401, error: "Invalid Studio token" }
    }
  }

  const session = await getAgentsRequestSession(request)
  const userId = session.internalUserId
  if (!userId) {
    return { ok: false, status: 401, error: "Unauthorized" }
  }

  const project = await prisma.studioProject.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      user_id: true,
      team_id: true,
      sandbox_id: true,
      thread_id: true,
    },
  })

  if (!project) {
    return { ok: false, status: 404, error: "Project not found" }
  }
  if (project.user_id !== userId) {
    return { ok: false, status: 403, error: "Project does not belong to this user" }
  }

  return {
    ok: true,
    ctx: {
      userId,
      teamId: project.team_id,
      projectId,
      sandboxId: project.sandbox_id,
      threadId: project.thread_id,
      source: "clerk",
    },
  }
}
