import type { FileEntryInfo } from "@21st-sdk/node"
import { parse as parseDotenv } from "dotenv"

export const STUDIO_WORKSPACE_DIR = "/home/user/workspace"
export const STUDIO_CREDENTIALS_FILE = "/home/user/.an/credentials"
export const STUDIO_PRIVATE_ENV_FILE = "/home/user/.env"
export const STUDIO_MAX_FILE_SIZE_BYTES = 100 * 1024
export const STUDIO_MAX_FILES_PER_PROJECT = 50

export function decodeStudioPath(segments: string[]): string {
  return segments.map((segment) => decodeURIComponent(segment)).join("/")
}

export function isSafeStudioWorkspacePath(path: string): boolean {
  if (!path || path.startsWith("/")) return false
  for (const part of path.split("/")) {
    if (part === "" || part === "." || part === "..") return false
  }
  return true
}

export function toWorkspaceFiles(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const workspace: Record<string, string> = {}
  for (const [path, content] of Object.entries(value as Record<string, unknown>)) {
    if (typeof content === "string") {
      workspace[path] = content
    }
  }
  return workspace
}

export function prefixWorkspaceFiles(
  workspace: Record<string, string>,
): Record<string, string> {
  const files: Record<string, string> = {}
  for (const [relPath, content] of Object.entries(workspace)) {
    files[`${STUDIO_WORKSPACE_DIR}/${relPath.replace(/^\/+/, "")}`] = content
  }
  return files
}

export function toStudioWorkspaceAbsolutePath(path: string): string {
  const normalized = path.replace(/^\/+/, "")
  if (!isSafeStudioWorkspacePath(normalized)) {
    throw new Error(`Invalid workspace path: ${path}`)
  }
  return `${STUDIO_WORKSPACE_DIR}/${normalized}`
}

export function toStudioWorkspaceRelativePath(path: string): string | null {
  const prefix = `${STUDIO_WORKSPACE_DIR}/`
  if (!path.startsWith(prefix)) return null

  const relativePath = path.slice(prefix.length)
  return isSafeStudioWorkspacePath(relativePath) ? relativePath : null
}

export function listStudioWorkspaceFiles(entries: FileEntryInfo[]): string[] {
  return entries
    .filter((entry) => entry.type === "file")
    .map((entry) => toStudioWorkspaceRelativePath(entry.path))
    .filter((path): path is string => !!path)
    .sort((a, b) => a.localeCompare(b))
}

export function mergePrivateEnv(
  currentEnvContent: string,
  overrides: Record<string, string>,
): string {
  const env = parseDotenv(currentEnvContent)
  for (const [key, value] of Object.entries(overrides)) {
    env[key] = value
  }

  return Object.entries(env)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
}
