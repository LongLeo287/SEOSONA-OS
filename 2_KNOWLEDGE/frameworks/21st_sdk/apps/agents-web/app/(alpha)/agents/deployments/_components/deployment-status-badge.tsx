import { cn } from "@/lib/utils"
import type { DeploymentStatus } from "@/lib/utils/deployment-utils"

export type { DeploymentStatus }

const STATUS_CONFIG: Record<DeploymentStatus, {
  label: string
  dotClass: string
  textClass: string
}> = {
  building: {
    label: "Deploying",
    dotClass: "bg-amber-500 animate-pulse",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  ready: {
    label: "Ready",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    dotClass: "bg-red-500",
    textClass: "text-red-600 dark:text-red-400",
  },
}

export function DeploymentStatusBadge({
  status,
  className,
}: {
  status: DeploymentStatus
  className?: string
}) {
  const config = STATUS_CONFIG[status]

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      <span className={cn("text-[12px] font-medium", config.textClass)}>
        {config.label}
      </span>
    </div>
  )
}

export function DeploymentStatusDot({
  status,
  className,
}: {
  status: DeploymentStatus
  className?: string
}) {
  const config = STATUS_CONFIG[status]

  return (
    <div
      className={cn("h-1.5 w-1.5 rounded-full", config.dotClass, className)}
      title={config.label}
    />
  )
}

export function CurrentBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-blue-500/25 bg-blue-500/10 px-1.5 py-[1px] text-[9px] font-semibold text-blue-600 dark:text-blue-400 leading-none",
        className,
      )}
    >
      Current
    </span>
  )
}
