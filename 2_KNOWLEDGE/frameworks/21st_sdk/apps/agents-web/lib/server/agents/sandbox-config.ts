export type SandboxProvider = "e2b" | "opensandbox"

export type RawSandboxConfig = {
  runtimeImage?: string
  cpuCount?: number
  memoryMB?: number
  apt?: string[]
  build?: string[]
  setup?: string[]
  files?: Record<string, string>
  cwd?: string
  timeoutMs?: number
  networkAllowOut?: string[]
  networkDenyOut?: string[]
}

export type ResolvedE2BSandboxConfig = {
  provider: "e2b"
  templateId?: string
  cpuCount?: number
  memoryMB?: number
  apt?: string[]
  build?: string[]
  setup?: string[]
  files?: Record<string, string>
  cwd?: string
  timeoutMs?: number
  networkAllowOut?: string[]
  networkDenyOut?: string[]
}

export type ResolvedOpenSandboxConfig = {
  provider: "opensandbox"
  runtimeImage?: string
  cpuCount?: number
  memoryMB?: number
  setup?: string[]
  files?: Record<string, string>
  cwd?: string
  timeoutMs?: number
  networkAllowOut?: string[]
  networkDenyOut?: string[]
}

export type ResolvedSandboxConfig =
  | ResolvedE2BSandboxConfig
  | ResolvedOpenSandboxConfig

function getEnvProvider(rawProvider: string | undefined): SandboxProvider {
  const provider = rawProvider?.trim().toLowerCase()
  if (!provider || provider === "e2b") return "e2b"
  if (provider === "opensandbox") return "opensandbox"
  throw new Error(
    `Unsupported sandbox provider "${rawProvider}". Expected "e2b" or "opensandbox".`,
  )
}

export function getDefaultSandboxProvider(): SandboxProvider {
  return getEnvProvider(process.env.SANDBOX_PROVIDER)
}

export function resolveSandboxConfig(params: {
  sandboxConfig?: RawSandboxConfig | null
  provider?: SandboxProvider
}): ResolvedSandboxConfig {
  const provider = params.provider ?? getDefaultSandboxProvider()
  const sandboxConfig = params.sandboxConfig ?? {}

  if (provider === "opensandbox") {
    return {
      provider,
      ...(sandboxConfig.runtimeImage ? { runtimeImage: sandboxConfig.runtimeImage } : {}),
      ...(sandboxConfig.cpuCount ? { cpuCount: sandboxConfig.cpuCount } : {}),
      ...(sandboxConfig.memoryMB ? { memoryMB: sandboxConfig.memoryMB } : {}),
      ...(sandboxConfig.setup ? { setup: sandboxConfig.setup } : {}),
      ...(sandboxConfig.files ? { files: sandboxConfig.files } : {}),
      ...(sandboxConfig.cwd ? { cwd: sandboxConfig.cwd } : {}),
      ...(sandboxConfig.timeoutMs ? { timeoutMs: sandboxConfig.timeoutMs } : {}),
      ...(sandboxConfig.networkAllowOut ? { networkAllowOut: sandboxConfig.networkAllowOut } : {}),
      ...(sandboxConfig.networkDenyOut ? { networkDenyOut: sandboxConfig.networkDenyOut } : {}),
    }
  }

  return {
    provider,
    ...(sandboxConfig.cpuCount ? { cpuCount: sandboxConfig.cpuCount } : {}),
    ...(sandboxConfig.memoryMB ? { memoryMB: sandboxConfig.memoryMB } : {}),
    ...(sandboxConfig.apt ? { apt: sandboxConfig.apt } : {}),
    ...(sandboxConfig.build ? { build: sandboxConfig.build } : {}),
    ...(sandboxConfig.setup ? { setup: sandboxConfig.setup } : {}),
    ...(sandboxConfig.files ? { files: sandboxConfig.files } : {}),
    ...(sandboxConfig.cwd ? { cwd: sandboxConfig.cwd } : {}),
    ...(sandboxConfig.timeoutMs ? { timeoutMs: sandboxConfig.timeoutMs } : {}),
    ...(sandboxConfig.networkAllowOut ? { networkAllowOut: sandboxConfig.networkAllowOut } : {}),
    ...(sandboxConfig.networkDenyOut ? { networkDenyOut: sandboxConfig.networkDenyOut } : {}),
  }
}

export function withTemplateId(
  sandboxConfig: ResolvedSandboxConfig,
  templateId: string,
): ResolvedSandboxConfig {
  if (sandboxConfig.provider !== "e2b") {
    return sandboxConfig
  }

  return {
    ...sandboxConfig,
    templateId,
  }
}

export function validateResolvedSandboxConfig(params: {
  sandboxConfig: ResolvedSandboxConfig
  rawSandboxConfig?: RawSandboxConfig | null
  hasTemplateArchive: boolean
  agentLanguage?: "js" | "go"
}) {
  if (params.sandboxConfig.provider !== "opensandbox") {
    return
  }

  if (params.hasTemplateArchive) {
    throw new Error(
      "OpenSandbox deployments do not support template directories or templateArchive uploads in v1.",
    )
  }

  if (params.agentLanguage === "go") {
    throw new Error(
      "OpenSandbox deployments do not support Go agents in v1.",
    )
  }
}
