import type {
  AgentClientConfig,
  ApiError,
  CreateSandboxParams,
  Sandbox,
  SandboxDetail,
  CreateThreadParams,
  ListThreadsParams,
  GetThreadParams,
  DeleteThreadParams,
  RunThreadParams,
  RunThreadResult,
  BackgroundRunResult,
  Thread,
  ThreadSummary,
  CreateTokenParams,
  Token,
  WriteFilesParams,
  ReadFileParams,
  FileContent,
  FileEntryInfo,
  ListFilesParams,
  GetFileInfoParams,
  ExistsFileParams,
  MakeDirParams,
  RenameFileParams,
  RemoveFileParams,
  ExecParams,
  ExecResult,
  GitCloneParams,
  GitCloneResult,
} from "./types"

const DEFAULT_BASE_URL = "https://relay.an.dev"

export class VaultCoverageMissingError extends Error {
  readonly code = "vault_coverage_missing"
  readonly missing: string[]

  constructor(message: string, missing: string[] = []) {
    super(message)
    this.name = "VaultCoverageMissingError"
    this.missing = missing
  }
}

export class AgentClient {
  private readonly apiKey: string
  private readonly baseUrl: string

  readonly sandboxes: SandboxesResource
  readonly threads: ThreadsResource
  readonly tokens: TokensResource

  constructor(config: AgentClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "")
    this.sandboxes = new SandboxesResource(this)
    this.threads = new ThreadsResource(this)
    this.tokens = new TokensResource(this)
  }

  /** @internal */
  async _request(path: string, init?: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${path}`
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...init?.headers,
      },
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: ApiError }
      const msg = body.error?.message ?? `Request failed: ${res.status}`
      if (body.error?.code === "vault_coverage_missing") {
        throw new VaultCoverageMissingError(msg, body.error.missing ?? [])
      }
      throw new Error(msg)
    }

    return res
  }

  /** @internal */
  async _fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await this._request(path, init)

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  /** @internal */
  _getBaseUrl(): string {
    return this.baseUrl
  }
}

class FilesResource {
  constructor(private client: AgentClient) {}

  async write(params: WriteFilesParams): Promise<void> {
    return this.client._fetch<void>(`/v1/sandboxes/${params.sandboxId}/files`, {
      method: "POST",
      body: JSON.stringify({ files: params.files }),
    })
  }

  async read(params: ReadFileParams): Promise<FileContent> {
    const encodedPath = encodeURIComponent(params.path)
    return this.client._fetch<FileContent>(
      `/v1/sandboxes/${params.sandboxId}/files?path=${encodedPath}`,
    )
  }

  async list(params: ListFilesParams): Promise<FileEntryInfo[]> {
    const query = new URLSearchParams({ path: params.path })
    if (params.depth !== undefined) {
      query.set("depth", String(params.depth))
    }

    return this.client._fetch<FileEntryInfo[]>(
      `/v1/sandboxes/${params.sandboxId}/files/list?${query.toString()}`,
    )
  }

  async getInfo(params: GetFileInfoParams): Promise<FileEntryInfo> {
    const encodedPath = encodeURIComponent(params.path)
    return this.client._fetch<FileEntryInfo>(
      `/v1/sandboxes/${params.sandboxId}/files/info?path=${encodedPath}`,
    )
  }

  async exists(params: ExistsFileParams): Promise<boolean> {
    const encodedPath = encodeURIComponent(params.path)
    return this.client._fetch<boolean>(
      `/v1/sandboxes/${params.sandboxId}/files/exists?path=${encodedPath}`,
    )
  }

  async makeDir(params: MakeDirParams): Promise<boolean> {
    return this.client._fetch<boolean>(
      `/v1/sandboxes/${params.sandboxId}/files/mkdir`,
      {
        method: "POST",
        body: JSON.stringify({ path: params.path }),
      },
    )
  }

  async rename(params: RenameFileParams): Promise<FileEntryInfo> {
    return this.client._fetch<FileEntryInfo>(
      `/v1/sandboxes/${params.sandboxId}/files/rename`,
      {
        method: "POST",
        body: JSON.stringify({
          oldPath: params.oldPath,
          newPath: params.newPath,
        }),
      },
    )
  }

  async remove(params: RemoveFileParams): Promise<void> {
    const encodedPath = encodeURIComponent(params.path)
    return this.client._fetch<void>(
      `/v1/sandboxes/${params.sandboxId}/files?path=${encodedPath}`,
      { method: "DELETE" },
    )
  }
}

/** @deprecated Use `sandboxes.exec({ sandboxId, command: 'git clone ...' })` instead. */
class GitResource {
  constructor(private client: AgentClient) {}

  /** @deprecated Use `sandboxes.exec({ sandboxId, command: 'git clone ...' })` instead. */
  async clone(params: GitCloneParams): Promise<GitCloneResult> {
    console.warn(
      "[an-sdk] sandboxes.git.clone() is deprecated and will be removed in a future release. Use sandboxes.exec() instead.",
    )
    return this.client._fetch<GitCloneResult>(
      `/v1/sandboxes/${params.sandboxId}/git/clone`,
      {
        method: "POST",
        body: JSON.stringify({
          url: params.url,
          ...(params.path && { path: params.path }),
          ...(params.token && { token: params.token }),
          ...(params.depth && { depth: params.depth }),
        }),
      },
    )
  }
}

class SandboxesResource {
  readonly files: FilesResource
  /** @deprecated Use `sandboxes.exec({ sandboxId, command: 'git clone ...' })` instead. */
  readonly git: GitResource

  constructor(private client: AgentClient) {
    this.files = new FilesResource(client)
    this.git = new GitResource(client)
  }

  async create(params: CreateSandboxParams): Promise<Sandbox> {
    return this.client._fetch<Sandbox>("/v1/sandboxes", {
      method: "POST",
      body: JSON.stringify({
        agent: params.agent,
        ...(params.files && { files: params.files }),
        ...(params.envs && { envs: params.envs }),
        ...(params.setup && { setup: params.setup }),
        ...(params.timeoutMs !== undefined && { timeoutMs: params.timeoutMs }),
        ...(params.networkAllowOut && {
          networkAllowOut: params.networkAllowOut,
        }),
        ...(params.networkDenyOut && { networkDenyOut: params.networkDenyOut }),
      }),
    })
  }

  async get(sandboxId: string): Promise<SandboxDetail> {
    return this.client._fetch<SandboxDetail>(`/v1/sandboxes/${sandboxId}`)
  }

  async delete(sandboxId: string): Promise<void> {
    return this.client._fetch<void>(`/v1/sandboxes/${sandboxId}`, {
      method: "DELETE",
    })
  }

  async exec(params: ExecParams): Promise<ExecResult> {
    return this.client._fetch<ExecResult>(
      `/v1/sandboxes/${params.sandboxId}/exec`,
      {
        method: "POST",
        body: JSON.stringify({
          command: params.command,
          ...(params.cwd && { cwd: params.cwd }),
          ...(params.envs && { envs: params.envs }),
          ...(params.timeoutMs && { timeoutMs: params.timeoutMs }),
        }),
      },
    )
  }
}

class ThreadsResource {
  constructor(private client: AgentClient) {}

  async list(params: ListThreadsParams): Promise<ThreadSummary[]> {
    return this.client._fetch<ThreadSummary[]>(
      `/v1/sandboxes/${params.sandboxId}/threads`,
    )
  }

  async create(params: CreateThreadParams): Promise<ThreadSummary> {
    return this.client._fetch<ThreadSummary>(
      `/v1/sandboxes/${params.sandboxId}/threads`,
      {
        method: "POST",
        body: JSON.stringify({ name: params.name }),
      },
    )
  }

  async get(params: GetThreadParams): Promise<Thread> {
    return this.client._fetch<Thread>(
      `/v1/sandboxes/${params.sandboxId}/threads/${params.threadId}`,
    )
  }

  async delete(params: DeleteThreadParams): Promise<void> {
    return this.client._fetch<void>(
      `/v1/sandboxes/${params.sandboxId}/threads/${params.threadId}`,
      { method: "DELETE" },
    )
  }

  async run(params: RunThreadParams & { mode: 'background' }): Promise<BackgroundRunResult>
  async run(params: RunThreadParams): Promise<RunThreadResult>
  async run(params: RunThreadParams): Promise<RunThreadResult | BackgroundRunResult> {
    if (params.threadId && !params.sandboxId) {
      throw new Error("threadId requires sandboxId")
    }

    const encodedAgent = encodeURIComponent(params.agent)
    const sandboxId =
      params.sandboxId ??
      (await this.client.sandboxes.create({ agent: params.agent })).id
    const threadId =
      params.threadId ??
      (await this.create({ sandboxId, name: params.name })).id
    const vaultIds = normalizeVaultIds(params)

    if (params.mode === "background") {
      const response = await this.client._request(`/v1/chat/${encodedAgent}`, {
        method: "POST",
        body: JSON.stringify({
          messages: params.messages,
          sandboxId,
          threadId,
          mode: "background",
          ...(vaultIds && { vaultIds }),
          ...(params.externalUserId && { externalUserId: params.externalUserId }),
          ...(params.options && { options: params.options }),
        }),
      })

      // Older self-hosted relay builds may acknowledge background mode by
      // immediately opening an SSE stream instead of returning 202 JSON.
      // Treat that as "run started" so workflow callers can poll the thread.
      if (response.status !== 202) {
        void response.text().catch(() => {})
        return { sandboxId, threadId, status: "running" as const }
      }

      const result = (await response
        .json()
        .catch(() => ({ status: "running" as const }))) as {
        threadId?: string
        sandboxId?: string
        status?: "running"
      }

      return { sandboxId, threadId, status: result.status ?? "running" }
    }

    const response = await this.client._request(`/v1/chat/${encodedAgent}`, {
      method: "POST",
      body: JSON.stringify({
        messages: params.messages,
        sandboxId,
        threadId,
        ...(vaultIds && { vaultIds }),
        ...(params.externalUserId && { externalUserId: params.externalUserId }),
        ...(params.options && { options: params.options }),
      }),
    })

    return {
      sandboxId,
      threadId,
      response,
      resumeUrl: `${this.client._getBaseUrl()}/v1/chat/${encodedAgent}/${sandboxId}/stream`,
    }
  }
}

let didWarnVaultIdDeprecated = false
let didWarnVaultIdIgnored = false

function warnOnce(kind: "deprecated" | "ignored", message: string) {
  if (kind === "deprecated") {
    if (didWarnVaultIdDeprecated) return
    didWarnVaultIdDeprecated = true
  } else {
    if (didWarnVaultIdIgnored) return
    didWarnVaultIdIgnored = true
  }
  console.warn(message)
}

function normalizeVaultIds(params: RunThreadParams): string[] | undefined {
  if (params.vaultIds) {
    if (params.vaultId) {
      warnOnce("ignored", "vaultId was ignored because vaultIds was provided")
    }
    return [...new Set(params.vaultIds)]
  }

  if (params.vaultId) {
    warnOnce("deprecated", "vaultId is deprecated, use vaultIds: string[]")
    return [params.vaultId]
  }

  return undefined
}

class TokensResource {
  constructor(private client: AgentClient) {}

  async create(params: CreateTokenParams = {}): Promise<Token> {
    return this.client._fetch<Token>("/v1/tokens", {
      method: "POST",
      body: JSON.stringify({
        agents: params.agent ? [params.agent] : undefined,
        userId: params.userId,
        expiresIn: params.expiresIn ?? "1h",
      }),
    })
  }
}

// Legacy client alias kept for compatibility.
export const AnClient = AgentClient
