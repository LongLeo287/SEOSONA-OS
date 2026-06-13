// ─── Client config ──────────────────────────────────────────

export interface AgentClientConfig {
  apiKey: string
  baseUrl?: string
}

// ─── Sandbox types ──────────────────────────────────────────

export interface CreateSandboxParams {
  agent: string
  files?: Record<string, string>
  envs?: Record<string, string>
  setup?: string[]
  timeoutMs?: number
  networkAllowOut?: string[]
  networkDenyOut?: string[]
}

export interface Sandbox {
  id: string
  sandboxId: string
  status: string
  createdAt: string
}

export interface SandboxDetail {
  id: string
  sandboxId: string
  status: string
  error?: string | null
  agent: { slug: string; name: string }
  threads: ThreadSummary[]
  createdAt: string
  updatedAt: string
}

// ─── Thread types ───────────────────────────────────────────

export interface ThreadSummary {
  id: string
  name?: string | null
  status: string
  createdAt: string
}

export interface CreateThreadParams {
  sandboxId: string
  name?: string
}

export interface ListThreadsParams {
  sandboxId: string
}

export interface GetThreadParams {
  sandboxId: string
  threadId: string
}

export interface DeleteThreadParams {
  sandboxId: string
  threadId: string
}

export interface RunThreadMessagePart {
  type: string
  [key: string]: unknown
}

export interface RunThreadMessage {
  id?: string
  role: string
  parts: RunThreadMessagePart[]
}

export interface RunThreadParams {
  agent: string
  messages: RunThreadMessage[]
  sandboxId?: string
  threadId?: string
  vaultIds?: string[]
  /** @deprecated Use vaultIds: string[] instead. */
  vaultId?: string
  externalUserId?: string
  name?: string
  /** Run mode: 'stream' (default) holds connection open, 'background' returns immediately */
  mode?: 'stream' | 'background'
  /** Per-invocation agent configuration options */
  options?: AgentRequestOptions
}

export interface RunThreadResult {
  sandboxId: string
  threadId: string
  response: Response
  resumeUrl: string
}

export interface BackgroundRunResult {
  sandboxId: string
  threadId: string
  status: 'running'
}

export interface ThreadUsage {
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
  totalCostUsd: number | null
  durationMs: number | null
}

export interface Thread {
  id: string
  name?: string | null
  status: string
  messages?: unknown
  usage: ThreadUsage
  error?: string | null
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

// ─── Token types ────────────────────────────────────────────

export interface CreateTokenParams {
  agent?: string
  userId?: string
  expiresIn?: string
}

export interface Token {
  token: string
  expiresAt: string
}

// ─── Files types ───────────────────────────────────────────

export type FileType = "file" | "dir"

export interface FileEntryInfo {
  name: string
  path: string
  type?: FileType
  size?: number
  mode?: number
  permissions?: string
  owner?: string
  group?: string
  modifiedTime?: string
  symlinkTarget?: string
}

export interface WriteFilesParams {
  sandboxId: string
  files: Record<string, string>
}

export interface ReadFileParams {
  sandboxId: string
  path: string
}

export interface FileContent {
  path: string
  content: string
}

export interface ListFilesParams {
  sandboxId: string
  path: string
  depth?: number
}

export interface GetFileInfoParams {
  sandboxId: string
  path: string
}

export interface ExistsFileParams {
  sandboxId: string
  path: string
}

export interface MakeDirParams {
  sandboxId: string
  path: string
}

export interface RenameFileParams {
  sandboxId: string
  oldPath: string
  newPath: string
}

export interface RemoveFileParams {
  sandboxId: string
  path: string
}

// ─── Exec types ────────────────────────────────────────────

export interface ExecParams {
  sandboxId: string
  command: string
  cwd?: string
  envs?: Record<string, string>
  timeoutMs?: number
}

export interface ExecResult {
  exitCode: number
  stdout: string
  stderr: string
}

// ─── Git types ─────────────────────────────────────────────

/** @deprecated Use `ExecParams` with a git clone command instead. */
export interface GitCloneParams {
  sandboxId: string
  url: string
  path?: string
  token?: string
  depth?: number
}

/** @deprecated Use `ExecResult` from the exec endpoint instead. */
export interface GitCloneResult {
  path: string
}

// ─── Agent request options ─────────────────────────────────

/** Per-invocation agent configuration options passed through to the runtime. */
export interface AgentRequestOptions {
  model?: string
  systemPrompt?:
    | string
    | { type: "preset"; preset: "claude_code"; append?: string }
  maxTurns?: number
  maxBudgetUsd?: number
  maxSandboxBudgetUsd?: number
  permissionMode?: string
  disallowedTools?: string[]
}

// ─── Error types ────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
  missing?: string[]
}

// Legacy type aliases kept for compatibility.
export type AnClientConfig = AgentClientConfig
export type AnApiError = ApiError
