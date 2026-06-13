import { authorizeStudioProjectRequest } from "@/lib/server/studio/auth"
import {
  ensureStudioProjectSession,
  StudioSessionError,
} from "@/lib/server/studio/session"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const authResult = await authorizeStudioProjectRequest(request, projectId)
  if (!authResult.ok) {
    return Response.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const session = await ensureStudioProjectSession({
      projectId,
      userId: authResult.ctx.userId,
    })
    return Response.json(session)
  } catch (error) {
    if (error instanceof StudioSessionError) {
      return Response.json(
        { error: error.message, reason: error.reason },
        { status: error.status },
      )
    }

    console.error("[studio/session] Failed to ensure project session", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to ensure Studio session",
      },
      { status: 500 },
    )
  }
}
