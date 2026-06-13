import { AgentClient } from "@21st-sdk/node"
import {
  listStudioWorkspaceFiles,
  prefixWorkspaceFiles,
  STUDIO_WORKSPACE_DIR,
  toStudioWorkspaceAbsolutePath,
} from "./workspace"
import { getStudioWizardApiKey, getStudioWizardSlug } from "./config"

const STUDIO_FILE_LIST_DEPTH = 20
const HIDDEN_STUDIO_FILES = new Set([
  ".claude-proxy-config",
  ".codex-proxy-config",
  ".claude-oauth-token",
])

function isRequestFailed404(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Request failed: 404")
}

function shouldHideStudioPath(path: string): boolean {
  return (
    path === "node_modules" ||
    path.startsWith("node_modules/") ||
    HIDDEN_STUDIO_FILES.has(path)
  )
}

export function createStudioAgentClient(): AgentClient {
  const apiKey = getStudioWizardApiKey()
  if (!apiKey) {
    throw new Error("Studio not provisioned. Set BUILDER_WIZARD_API_KEY or AN_API_KEY.")
  }

  return new AgentClient({ apiKey })
}

export async function createStudioWorkspaceSandbox({
  client,
  projectId,
  deployedSlug,
  workspaceFiles,
}: {
  client: AgentClient
  projectId: string
  deployedSlug: string
  workspaceFiles: Record<string, string>
}): Promise<string> {
  const sandbox = await client.sandboxes.create({
    agent: getStudioWizardSlug(),
    envs: {
      PROJECT_ID: projectId,
      DEPLOYED_SLUG: deployedSlug,
    },
  })

  try {
    // The relay currently drops create-time `files` overrides when the agent
    // runs from a deployed template, so seed the Studio workspace immediately
    // after sandbox creation instead.
    if (Object.keys(workspaceFiles).length > 0) {
      await client.sandboxes.files.write({
        sandboxId: sandbox.id,
        files: prefixWorkspaceFiles(workspaceFiles),
      })
    }

    return sandbox.id
  } catch (error) {
    await client.sandboxes.delete(sandbox.id).catch(() => {})
    throw error
  }
}

export async function listStudioWorkspaceFilePaths(
  client: AgentClient,
  sandboxId: string,
): Promise<string[]> {
  try {
    const entries = await client.sandboxes.files.list({
      sandboxId,
      path: STUDIO_WORKSPACE_DIR,
      depth: STUDIO_FILE_LIST_DEPTH,
    })

    return listStudioWorkspaceFiles(entries).filter(
      (path) => !shouldHideStudioPath(path),
    )
  } catch (error) {
    if (!isRequestFailed404(error)) {
      throw error
    }
  }

  const result = await client.sandboxes.exec({
    sandboxId,
    command: [
      `cd ${STUDIO_WORKSPACE_DIR}`,
      `find . \\( -path './node_modules' -o -path './node_modules/*' \\) -prune -o -type f -print | sed 's#^./##' | sort`,
    ].join(" && "),
    timeoutMs: 30_000,
  })
  if (result.exitCode !== 0) {
    throw new Error(result.stderr || result.stdout || "Failed to list workspace files")
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((path) => !shouldHideStudioPath(path))
}

export async function readStudioWorkspaceFile(
  client: AgentClient,
  sandboxId: string,
  path: string,
): Promise<string> {
  const file = await client.sandboxes.files.read({
    sandboxId,
    path: toStudioWorkspaceAbsolutePath(path),
  })

  return file.content
}

export async function writeStudioWorkspaceFile(
  client: AgentClient,
  sandboxId: string,
  path: string,
  content: string,
): Promise<void> {
  await client.sandboxes.files.write({
    sandboxId,
    files: {
      [toStudioWorkspaceAbsolutePath(path)]: content,
    },
  })
}

export async function studioWorkspaceFileExists(
  client: AgentClient,
  sandboxId: string,
  path: string,
): Promise<boolean> {
  const absolutePath = toStudioWorkspaceAbsolutePath(path)

  try {
    return await client.sandboxes.files.exists({
      sandboxId,
      path: absolutePath,
    })
  } catch (error) {
    if (!isRequestFailed404(error)) {
      throw error
    }
  }

  try {
    await client.sandboxes.files.read({
      sandboxId,
      path: absolutePath,
    })
    return true
  } catch (error) {
    if (isRequestFailed404(error)) {
      return false
    }
    throw error
  }
}
