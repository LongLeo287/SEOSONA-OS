import type { AnAgentConfig, AnDeployment } from "@/prisma/client"

export type DeploymentStatus = "building" | "ready" | "failed"

export type ConfigWithDeployment = AnAgentConfig & {
  activeDeployment: Pick<
    AnDeployment,
    "id" | "version" | "bundle_hash" | "bundle_url" | "deployed_at" | "metadata" | "status" | "error" | "completed_at"
  > | null
  deployments?: { id: string; version: number; status: string; created_at: Date }[]
}

export function resolveDeploymentStatus(
  config: ConfigWithDeployment,
): DeploymentStatus | "idle" {
  const latestDep = config.deployments?.[0]
  const dep = config.activeDeployment
  // Check latest (non-active) deployment first — it may be building or failed
  if (latestDep?.status === "building") return "building"
  if (latestDep?.status === "failed") return "failed"
  if (dep?.status === "ready") return "ready"
  if (dep?.status === "failed") return "failed"
  return "idle"
}

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1_000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export function formatDuration(ms: number): string | null {
  const totalSeconds = Math.floor(ms / 1_000)
  if (totalSeconds <= 0) return null
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}
