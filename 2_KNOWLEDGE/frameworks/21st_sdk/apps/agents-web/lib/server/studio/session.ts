import crypto from "node:crypto"
import {
  CURRENT_AGENT_API_KEY_PREFIX,
  getApiKeyPrefix,
  hashApiKey,
} from "@repo/api-key-security"
import { prisma } from "@/lib/prisma"
import {
  createStudioAgentClient,
  createStudioWorkspaceSandbox,
} from "./sandbox"
import { getStudioWizardSlug } from "./config"
import { getStudioProjectById, syncStudioProjectDeploymentBinding } from "./projects"
import { STUDIO_CREDENTIALS_FILE, toWorkspaceFiles } from "./workspace"

type EnsureStudioProjectSessionInput = {
  projectId: string
  userId: string
}

export type StudioSessionInfo = {
  sandboxId: string
  threadId: string
  wizardSlug: string
  expiresAt: number
  initialMessages: unknown[]
  project: {
    id: string
    teamId: string
    name: string
    deployedSlug: string
    deployedAgentId: string | null
    hasDeployment: boolean
  }
}

function generateAnApiKey() {
  return CURRENT_AGENT_API_KEY_PREFIX + crypto.randomBytes(32).toString("hex")
}

export class StudioSessionError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly reason?: string,
  ) {
    super(message)
  }
}

function createSessionClient() {
  try {
    return createStudioAgentClient()
  } catch (error) {
    throw new StudioSessionError(
      error instanceof Error ? error.message : "Studio not provisioned",
      503,
      "not_provisioned",
    )
  }
}

function hasWorkspaceFiles(workspaceFiles: Record<string, string>): boolean {
  return Object.keys(workspaceFiles).length > 0
}

async function ensureStudioThread({
  client,
  sandboxId,
  threadId,
  projectName,
  projectId,
}: {
  client: ReturnType<typeof createStudioAgentClient>
  sandboxId: string
  threadId: string | null
  projectName: string
  projectId: string
}): Promise<string> {
  if (threadId) {
    try {
      await client.threads.get({ sandboxId, threadId })
      return threadId
    } catch (error) {
      console.warn(
        `[studio/session] Thread ${threadId} for project ${projectId} is unavailable, creating a replacement`,
        error,
      )
    }
  }

  const thread = await client.threads.create({
    sandboxId,
    name: `Studio project ${projectName}`,
  })
  return thread.id
}

export async function ensureStudioProjectSession(
  input: EnsureStudioProjectSessionInput,
): Promise<StudioSessionInfo> {
  const wizardSlug = getStudioWizardSlug()

  const project = await syncStudioProjectDeploymentBinding(input.projectId)
  if (!project) {
    throw new StudioSessionError("Project not found", 404, "not_found")
  }
  if (project.user_id !== input.userId) {
    throw new StudioSessionError(
      "Project does not belong to this user",
      403,
      "forbidden",
    )
  }

  const workspaceFiles = toWorkspaceFiles(project.workspace_files)
  const client = createSessionClient()

  let teamApiKey = await prisma.anApiKey.findFirst({
    where: { team_id: project.team_id, is_active: true },
    orderBy: { created_at: "desc" },
    select: { key: true },
  })

  if (!teamApiKey?.key) {
    const key = generateAnApiKey()
    teamApiKey = await prisma.anApiKey.create({
      data: {
        key,
        key_hash: hashApiKey(key),
        key_prefix: getApiKeyPrefix(key),
        team_id: project.team_id,
        user_id: input.userId,
        name: "Studio",
      },
      select: { key: true },
    })
  }
  const plaintextTeamApiKey = teamApiKey.key
  if (!plaintextTeamApiKey) {
    throw new StudioSessionError(
      "No active API key found for this team. Create one first so Studio can deploy.",
      400,
    )
  }

  let sandboxId = project.sandbox_id ?? null
  let threadId = project.thread_id ?? null

  if (sandboxId) {
    try {
      await client.sandboxes.get(sandboxId)
    } catch (error) {
      console.warn(
        `[studio/session] Sandbox ${sandboxId} for project ${project.id} is unavailable`,
        error,
      )
      sandboxId = null
      threadId = null
    }
  }

  if (!sandboxId) {
    if (!hasWorkspaceFiles(workspaceFiles)) {
      throw new StudioSessionError(
        project.sandbox_id
          ? "Studio sandbox is unavailable and this project has no stored workspace to restore from."
          : "Project has no workspace. Create from a template first.",
        409,
        project.sandbox_id ? "sandbox_unavailable" : "workspace_empty",
      )
    }

    console.warn(
      `[studio/session] Bootstrapping replacement sandbox for project ${project.id} from stored workspace files`,
    )

    try {
      sandboxId = await createStudioWorkspaceSandbox({
        client,
        projectId: project.id,
        deployedSlug: project.deployed_slug,
        workspaceFiles,
      })
      threadId = null
    } catch (error) {
      throw new StudioSessionError(
        `Failed to prepare Studio sandbox: ${
          error instanceof Error ? error.message : String(error)
        }`,
        500,
      )
    }
  }

  const ensuredThreadId = await ensureStudioThread({
    client,
    sandboxId,
    threadId,
    projectName: project.name,
    projectId: project.id,
  })

  try {
    await client.sandboxes.files.write({
      sandboxId,
      files: {
        [STUDIO_CREDENTIALS_FILE]: JSON.stringify(
          { apiKey: plaintextTeamApiKey },
          null,
          2,
        ),
      },
    })
  } catch (error) {
    throw new StudioSessionError(
      `Failed to prepare Studio sandbox: ${
        error instanceof Error ? error.message : String(error)
      }`,
      500,
    )
  }

  await prisma.studioProject.update({
    where: { id: project.id },
    data: {
      sandbox_id: sandboxId,
      thread_id: ensuredThreadId,
      session_status: "active",
      session_last_seen_at: new Date(),
      updated_at: new Date(),
    },
  })

  const currentProject = await getStudioProjectById(project.id)
  if (!currentProject) {
    throw new StudioSessionError(
      "Project not found after session bootstrap",
      404,
    )
  }

  const thread = await client.threads
    .get({ sandboxId, threadId: ensuredThreadId })
    .catch(() => null)

  return {
    sandboxId,
    threadId: ensuredThreadId,
    wizardSlug,
    expiresAt: Date.now() + 60 * 60 * 1000,
    initialMessages:
      thread && Array.isArray(thread.messages)
        ? (thread.messages as unknown[])
        : [],
    project: {
      id: currentProject.id,
      teamId: currentProject.team_id,
      name: currentProject.name,
      deployedSlug: currentProject.deployed_slug,
      deployedAgentId: currentProject.deployed_agent_id,
      hasDeployment: !!currentProject.deployedAgent?.active_deployment_id,
    },
  }
}
