"use client"

import { useAgentsRouter } from "@/hooks/use-agents-router"
import { ArrowLeft, ChevronRight } from "lucide-react"
import type { AnAgentConfig, AnDeployment } from "@/prisma/client"

type ConfigWithDeployment = AnAgentConfig & {
  activeDeployment: Pick<AnDeployment, "id" | "version" | "bundle_hash" | "deployed_at"> | null
}

export function DeploymentDetailHeader({
  config,
}: {
  config: ConfigWithDeployment
}) {
  const router = useAgentsRouter()
  const shortId = config.id.slice(0, 8)
  const isDeployed = !!config.activeDeployment

  return (
    <div
      className="flex h-10 shrink-0 items-center gap-2 px-4 border-b border-border"
      style={{ borderBottomWidth: "0.5px" }}
    >
      <button
        onClick={() => router.push("/agents/deployments")}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
        aria-label="Back to deployments"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/agents/deployments")}
        className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Deployments
      </button>
      <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
      <span className="text-[12px] font-medium text-foreground truncate max-w-[200px]">
        {config.name}
      </span>
      <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
      <span className="text-[12px] font-mono text-muted-foreground">
        {shortId}
      </span>

      {/* Status — right */}
      <div className="ml-auto flex items-center gap-1.5">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            isDeployed ? "bg-emerald-500" : "bg-muted-foreground/40"
          }`}
        />
        <span
          className={`text-[11px] font-medium ${
            isDeployed
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          }`}
        >
          {isDeployed ? "Ready" : "Idle"}
        </span>
      </div>
    </div>
  )
}
