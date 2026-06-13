import { prisma } from "@/lib/prisma"
import { authorizeStudioProjectRequest } from "@/lib/server/studio/auth"
import {
  createStudioAgentClient,
  listStudioWorkspaceFilePaths,
  readStudioWorkspaceFile,
  studioWorkspaceFileExists,
  writeStudioWorkspaceFile,
} from "@/lib/server/studio/sandbox"
import {
  decodeStudioPath,
  isSafeStudioWorkspacePath,
  STUDIO_MAX_FILES_PER_PROJECT,
  STUDIO_MAX_FILE_SIZE_BYTES,
  toWorkspaceFiles,
} from "@/lib/server/studio/workspace"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; path: string[] }> },
) {
  const { projectId, path: pathSegments } = await params
  const authResult = await authorizeStudioProjectRequest(request, projectId)
  if (!authResult.ok) {
    return Response.json({ error: authResult.error }, { status: authResult.status })
  }

  const filePath = decodeStudioPath(pathSegments)
  if (!isSafeStudioWorkspacePath(filePath)) {
    return Response.json({ error: "Invalid path" }, { status: 400 })
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
      const content = await readStudioWorkspaceFile(
        client,
        project.sandbox_id,
        filePath,
      )
      return Response.json({ path: filePath, content, size: content.length })
    } catch (error) {
      console.warn(
        `[studio/file] Falling back to stored workspace for project ${projectId} path ${filePath}`,
        error,
      )
    }
  }

  const workspace = toWorkspaceFiles(project.workspace_files)
  const content = workspace[filePath]
  if (content === undefined) {
    return Response.json({ error: "File not found", path: filePath }, { status: 404 })
  }

  return Response.json({ path: filePath, content, size: content.length })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string; path: string[] }> },
) {
  const { projectId, path: pathSegments } = await params
  const authResult = await authorizeStudioProjectRequest(request, projectId)
  if (!authResult.ok) {
    return Response.json({ error: authResult.error }, { status: authResult.status })
  }

  let body: { content?: unknown }
  try {
    body = (await request.json()) as { content?: unknown }
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.content !== "string") {
    return Response.json({ error: "`content` must be a string" }, { status: 400 })
  }
  const content = body.content

  const sizeBytes = Buffer.byteLength(content, "utf8")
  if (sizeBytes > STUDIO_MAX_FILE_SIZE_BYTES) {
    return Response.json(
      {
        error: "File too large",
        limit: STUDIO_MAX_FILE_SIZE_BYTES,
        received: sizeBytes,
      },
      { status: 413 },
    )
  }

  const filePath = decodeStudioPath(pathSegments)
  if (!isSafeStudioWorkspacePath(filePath)) {
    return Response.json({ error: "Invalid path" }, { status: 400 })
  }

  const project = await prisma.studioProject.findUnique({
    where: { id: projectId },
    select: {
      sandbox_id: true,
      workspace_files: true,
    },
  })
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 })
  }

  if (project.sandbox_id) {
    try {
      const client = createStudioAgentClient()
      const existed = await studioWorkspaceFileExists(
        client,
        project.sandbox_id,
        filePath,
      )

      await writeStudioWorkspaceFile(
        client,
        project.sandbox_id,
        filePath,
        content,
      )

      const files = await listStudioWorkspaceFilePaths(client, project.sandbox_id)

      await prisma.studioProject.update({
        where: { id: projectId },
        data: {
          updated_at: new Date(),
          session_last_seen_at: new Date(),
        },
      })

      return Response.json({
        path: filePath,
        size: sizeBytes,
        totalFiles: files.length,
        created: !existed,
      })
    } catch (error) {
      console.error(
        `[studio/file] Failed to write sandbox file for project ${projectId} path ${filePath}`,
        error,
      )
      return Response.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to write sandbox file",
        },
        { status: 500 },
      )
    }
  }

  const updated = await prisma
    .$transaction(async (tx) => {
      await tx.$executeRaw`SELECT id FROM studio_projects WHERE id = ${projectId}::uuid FOR UPDATE`
      const project = await tx.studioProject.findUnique({
        where: { id: projectId },
        select: { workspace_files: true },
      })
      if (!project) return null

      const workspace = toWorkspaceFiles(project.workspace_files)
      const isNew = !(filePath in workspace)
      if (isNew && Object.keys(workspace).length >= STUDIO_MAX_FILES_PER_PROJECT) {
        throw new Error("FILE_COUNT_LIMIT")
      }

      workspace[filePath] = content
      await tx.studioProject.update({
        where: { id: projectId },
        data: {
          workspace_files: workspace,
          updated_at: new Date(),
        },
      })

      return { totalFiles: Object.keys(workspace).length, wasNew: isNew }
    })
    .catch((error: unknown) => {
      if (error instanceof Error && error.message === "FILE_COUNT_LIMIT") {
        return "FILE_COUNT_LIMIT" as const
      }
      throw error
    })

  if (updated === "FILE_COUNT_LIMIT") {
    return Response.json(
      { error: "Too many files", limit: STUDIO_MAX_FILES_PER_PROJECT },
      { status: 413 },
    )
  }
  if (!updated) {
    return Response.json({ error: "Project not found" }, { status: 404 })
  }

  return Response.json({
    path: filePath,
    size: sizeBytes,
    totalFiles: updated.totalFiles,
    created: updated.wasNew,
  })
}
