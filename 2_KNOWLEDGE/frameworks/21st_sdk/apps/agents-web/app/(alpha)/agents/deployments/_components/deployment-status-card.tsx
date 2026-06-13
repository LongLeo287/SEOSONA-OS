"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, AlertCircle } from "lucide-react"
import { DeploymentStatusBadge } from "./deployment-status-badge"
import { formatRelativeTime, resolveDeploymentStatus, type ConfigWithDeployment } from "@/lib/utils/deployment-utils"

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1_500)
        } catch {
          // Clipboard API may be unavailable in non-HTTPS contexts
        }
      }}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
      aria-label="Copy"
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <span className="text-[11px] font-medium text-muted-foreground shrink-0 w-[120px]">
        {label}
      </span>
      <div className="flex items-center gap-1.5 min-w-0 justify-end">
        {children}
      </div>
    </div>
  )
}

export function DeploymentStatusCard({ config }: { config: ConfigWithDeployment }) {
  const dep = config.activeDeployment
  const effectiveStatus = resolveDeploymentStatus(config)
  const endpointUrl = `https://api.an.dev/v1/chat/${config.slug}`
  const deployedAt = dep?.deployed_at ? new Date(dep.deployed_at) : null

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="text-[13px] font-medium text-foreground">
          Current Deployment
        </span>
        {effectiveStatus === "idle" ? (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="text-[11px] font-medium text-muted-foreground">
              Not Deployed
            </span>
          </div>
        ) : (
          <DeploymentStatusBadge status={effectiveStatus} />
        )}
      </div>

      <div className="px-5 py-1">
        <InfoRow label="Endpoint">
          <a
            href={endpointUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-mono text-foreground/70 truncate hover:text-foreground transition-colors"
          >
            {endpointUrl}
          </a>
          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          <CopyButton value={endpointUrl} />
        </InfoRow>

        {dep && (
          <InfoRow label="Version">
            <span className="text-[12px] font-mono text-foreground/70">
              v{dep.version} · {dep.bundle_hash}
            </span>
            <CopyButton value={dep.bundle_hash} />
          </InfoRow>
        )}

        {deployedAt && (
          <InfoRow label="Deployed At">
            <span
              className="text-[12px] text-foreground/70"
              title={deployedAt.toLocaleString()}
            >
              {formatRelativeTime(deployedAt)}
            </span>
          </InfoRow>
        )}
      </div>

      {dep?.status === "failed" && dep.error && (
        <div className="border-t border-red-500/20 bg-red-500/5 px-5 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500 mt-0.5" />
            <p className="text-[11px] text-red-600/80 dark:text-red-400/80 font-mono break-all">
              {dep.error}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
