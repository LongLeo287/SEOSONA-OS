export type DeploymentMetadata = {
  templateId?: string
  mcpConfigUrl?: string
  source?: string
  maxSandboxBudgetUsd?: number
  agentConfig?: Record<string, unknown>
  tools?: Array<{ name?: string; description?: string }>
  mcpServers?: Array<{ name?: string; url?: string }>
  vaultIds?: string[]
}

export type PortableSandboxConfig = {
  setup?: string[]
  files?: Record<string, string>
  cwd?: string
  timeoutMs?: number
  networkAllowOut?: string[]
  networkDenyOut?: string[]
}

export type LegacySandboxSetupConfig = PortableSandboxConfig & {
  cpuCount?: number
  memoryMB?: number
  apt?: string[]
  build?: string[]
}

export type ResolvedE2BSandboxConfig = LegacySandboxSetupConfig & {
  provider: "e2b"
  templateId?: string | null
}

export type ResolvedOpenSandboxConfig = PortableSandboxConfig & {
  cpuCount?: number
  memoryMB?: number
  provider: "opensandbox"
  runtimeImage?: string
}

export type ResolvedSandboxConfig =
  | ResolvedE2BSandboxConfig
  | ResolvedOpenSandboxConfig

export type SandboxProvider = ResolvedSandboxConfig["provider"]

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function getField(
  metadata: unknown,
  field: keyof DeploymentMetadata,
): string | null {
  if (!metadata || typeof metadata !== "object") return null
  const value = (metadata as DeploymentMetadata)[field]
  return typeof value === "string" && value.length > 0 ? value : null
}

export const getDeploymentTemplateId = (metadata: unknown) =>
  getField(metadata, "templateId")
export const getDeploymentMcpConfigUrl = (metadata: unknown) =>
  getField(metadata, "mcpConfigUrl")
export const getDeploymentSource = (metadata: unknown) =>
  getField(metadata, "source")

function getPositiveNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null
}

export function getDeploymentMaxSandboxBudgetUsd(metadata: unknown): number | null {
  if (!isRecord(metadata)) return null

  const direct = getPositiveNumber(metadata.maxSandboxBudgetUsd)
  if (direct !== null) return direct

  const agentConfig = metadata.agentConfig
  if (!isRecord(agentConfig)) return null

  return getPositiveNumber(agentConfig.maxSandboxBudgetUsd)
}

export function normalizeDeploymentSandboxConfig(
  sandboxConfig: unknown,
  metadata: unknown,
): ResolvedSandboxConfig {
  if (!isRecord(sandboxConfig)) {
    return {
      provider: "e2b",
      templateId: getDeploymentTemplateId(metadata),
    }
  }

  const provider =
    sandboxConfig.provider === "opensandbox" ? "opensandbox" : "e2b"

  if (provider === "opensandbox") {
    return {
      provider,
      ...(typeof sandboxConfig.runtimeImage === "string"
        ? { runtimeImage: sandboxConfig.runtimeImage }
        : {}),
      ...(typeof sandboxConfig.cpuCount === "number"
        ? { cpuCount: sandboxConfig.cpuCount }
        : {}),
      ...(typeof sandboxConfig.memoryMB === "number"
        ? { memoryMB: sandboxConfig.memoryMB }
        : {}),
      ...(Array.isArray(sandboxConfig.setup)
        ? { setup: sandboxConfig.setup as string[] }
        : {}),
      ...(isRecord(sandboxConfig.files)
        ? { files: sandboxConfig.files as Record<string, string> }
        : {}),
      ...(typeof sandboxConfig.cwd === "string"
        ? { cwd: sandboxConfig.cwd }
        : {}),
      ...(typeof sandboxConfig.timeoutMs === "number"
        ? { timeoutMs: sandboxConfig.timeoutMs }
        : {}),
      ...(Array.isArray(sandboxConfig.networkAllowOut)
        ? { networkAllowOut: sandboxConfig.networkAllowOut as string[] }
        : {}),
      ...(Array.isArray(sandboxConfig.networkDenyOut)
        ? { networkDenyOut: sandboxConfig.networkDenyOut as string[] }
        : {}),
    }
  }

  return {
    provider,
    templateId:
      typeof sandboxConfig.templateId === "string"
        ? sandboxConfig.templateId
        : getDeploymentTemplateId(metadata),
    ...(typeof sandboxConfig.cpuCount === "number"
      ? { cpuCount: sandboxConfig.cpuCount }
      : {}),
    ...(typeof sandboxConfig.memoryMB === "number"
      ? { memoryMB: sandboxConfig.memoryMB }
      : {}),
    ...(Array.isArray(sandboxConfig.apt)
      ? { apt: sandboxConfig.apt as string[] }
      : {}),
    ...(Array.isArray(sandboxConfig.build)
      ? { build: sandboxConfig.build as string[] }
      : {}),
    ...(Array.isArray(sandboxConfig.setup)
      ? { setup: sandboxConfig.setup as string[] }
      : {}),
    ...(isRecord(sandboxConfig.files)
      ? { files: sandboxConfig.files as Record<string, string> }
      : {}),
    ...(typeof sandboxConfig.cwd === "string"
      ? { cwd: sandboxConfig.cwd }
      : {}),
    ...(typeof sandboxConfig.timeoutMs === "number"
      ? { timeoutMs: sandboxConfig.timeoutMs }
      : {}),
    ...(Array.isArray(sandboxConfig.networkAllowOut)
      ? { networkAllowOut: sandboxConfig.networkAllowOut as string[] }
      : {}),
    ...(Array.isArray(sandboxConfig.networkDenyOut)
      ? { networkDenyOut: sandboxConfig.networkDenyOut as string[] }
      : {}),
  }
}

export function getDeploymentAgentConfig(
  metadata: unknown,
): Record<string, unknown> | null {
  if (!metadata || typeof metadata !== "object") return null
  const config = (metadata as DeploymentMetadata).agentConfig
  return config && typeof config === "object" ? config : null
}

export function getDeploymentMcpServers(
  metadata: unknown,
): Array<{ name: string; url: string }> {
  if (!metadata || typeof metadata !== "object") return []

  const servers = (metadata as DeploymentMetadata).mcpServers
  if (!Array.isArray(servers)) return []

  return servers
    .filter(
      (entry): entry is { name?: string; url?: string } =>
        !!entry && typeof entry === "object",
    )
    .filter(
      (entry): entry is { name: string; url: string } =>
        typeof entry.name === "string" &&
        entry.name.length > 0 &&
        typeof entry.url === "string" &&
        entry.url.length > 0,
    )
}

export function getDeploymentVaultIds(metadata: unknown): string[] {
  if (!metadata || typeof metadata !== "object") return []

  const vaultIds = (metadata as DeploymentMetadata).vaultIds
  if (!Array.isArray(vaultIds)) return []

  return vaultIds.filter(
    (vaultId): vaultId is string =>
      typeof vaultId === "string" && vaultId.length > 0,
  )
}
