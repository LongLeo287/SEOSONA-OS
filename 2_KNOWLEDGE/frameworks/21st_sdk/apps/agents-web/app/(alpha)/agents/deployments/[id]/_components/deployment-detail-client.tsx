"use client"

import "@21st-sdk/react/styles.css"

import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { anPlaygroundSandboxMapAtom } from "@/lib/atoms/an-agent"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { formatRelativeTime, type DeploymentStatus } from "@/lib/utils/deployment-utils"
import type { AnAgentConfig } from "@/prisma/client"
import { api, type RouterOutputs } from "@/trpc/client"
import { AgentChat } from "@21st-sdk/react"
import { DefaultChatTransport } from "ai-latest"
import { Chat, useChat } from "ai-latest-react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { AlertCircle, RotateCcw } from "lucide-react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { sidebarViewModeAtom } from "../../../../atoms"
import { CopyText } from "../../../threads/_components/copy-button"
import {
  logsDateRangeAtom,
  logsGroupBySandboxAtom,
  logsSandboxFilterAtom,
  logsSearchQueryAtom,
  logsStatusFilterAtom
} from "../../../threads/_components/logs-constants"
import { ThreadLogsView } from "../../../threads/_components/thread-logs-view"
import { AgentDetailsPanel } from "../../_components/agent-details-panel"
import { CurrentBadge, DeploymentStatusBadge } from "../../_components/deployment-status-badge"
import { EnvVarsSection } from "../../_components/env-vars-section"

type TabId = "overview" | "playground" | "logs"

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "playground", label: "Playground" },
  { id: "logs", label: "Threads" },
]

type DeploymentData = NonNullable<RouterOutputs["agentConfigs"]["getDeployment"]>

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://relay.an.dev"

async function fetchRelayToken(teamId: string, agentSlug: string): Promise<string> {
  const res = await fetch("/api/agents/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId, agent: agentSlug }),
  })
  if (!res.ok) throw new Error("Failed to get token")
  const data = await res.json()
  return data.token as string
}

export function DeploymentDetailClient({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const tabParam = searchParams.get("tab")
  const initialTab: TabId = TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : "overview"
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [chatKey, setChatKey] = useState(0)
  const [sandboxMap, setSandboxMap] = useAtom(anPlaygroundSandboxMapAtom)

  const { data: deployment, isLoading } = api.agentConfigs.getDeployment.useQuery(
    { id: id },
    {
      enabled: !!id,
      refetchInterval: (query) => {
        const status = query.state.data?.status
        if (status === "ready" || status === "failed") return false
        return status === "building" ? 3_000 : 10_000
      },
    },
  )

  const agentConfig = deployment?.agent
  const activeDeploymentId = agentConfig?.activeDeployment?.id ?? null
  const isCurrentDeployment = deployment?.id === activeDeploymentId

  useEffect(() => {
    if (!agentConfig?.slug || !activeDeploymentId) return
    const existing = sandboxMap[agentConfig.slug]
    if (existing && existing.deploymentId === activeDeploymentId) return
    const newId = `playground-${agentConfig.slug}-${Date.now()}`
    setSandboxMap((prev) => ({ ...prev, [agentConfig.slug]: { sandboxId: newId, deploymentId: activeDeploymentId } }))
  }, [agentConfig?.slug, activeDeploymentId, setSandboxMap]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeSandboxId = useMemo(() => {
    if (!agentConfig?.slug || !activeDeploymentId) return null
    const existing = sandboxMap[agentConfig.slug]
    if (existing && existing.deploymentId === activeDeploymentId) return existing.sandboxId
    return null
  }, [agentConfig?.slug, activeDeploymentId, sandboxMap])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  if (!deployment || !agentConfig) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[13px] text-muted-foreground">
          Deployment not found.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex h-10 shrink-0 items-center border-b border-border px-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex h-full items-center px-2.5 text-[12px] transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`absolute inset-x-1 inset-y-1.5 rounded-md transition-colors ${isActive ? "bg-foreground/5" : "group-hover:bg-foreground/5"}`} />
              {isActive && (
                <motion.div
                  layoutId="deployment-tab-line"
                  className="absolute inset-x-1 bottom-0 h-[1.5px] bg-foreground rounded-full"
                  transition={{ duration: 0.15 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          )
        })}

        {activeTab === "playground" && (
          <button
            onClick={() => {
              if (agentConfig.slug && activeDeploymentId) {
                const newId = `playground-${agentConfig.slug}-${Date.now()}`
                setSandboxMap((prev) => ({ ...prev, [agentConfig.slug]: { sandboxId: newId, deploymentId: activeDeploymentId } }))
              }
              setChatKey((k) => k + 1)
            }}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
          >
            <RotateCcw className="h-3 w-3" />
            New chat
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {activeTab === "overview" && (
          <OverviewTab
            deployment={deployment}
            agentConfig={agentConfig}
            isCurrentDeployment={isCurrentDeployment}
          />
        )}
        {activeTab === "playground" && activeSandboxId && (
          <PlaygroundTab
            config={agentConfig}
            teamId={teamId}
            chatKey={chatKey}
            sandboxId={activeSandboxId}
          />
        )}
        {activeTab === "logs" && (
          <LogsTab config={agentConfig} teamId={teamId} />
        )}
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────

function OverviewTab({
  deployment,
  agentConfig,
  isCurrentDeployment,
}: {
  deployment: DeploymentData
  agentConfig: DeploymentData["agent"]
  isCurrentDeployment: boolean
}) {
  const endpointUrl = `https://api.an.dev/v1/chat/${agentConfig.slug}`
  const deployedAt = deployment.deployed_at ? new Date(deployment.deployed_at) : null
  const depStatus = deployment.status as DeploymentStatus

  const deploymentMetadata = deployment.metadata as Record<string, unknown> | null | undefined
  const activeMetadata = agentConfig.activeDeployment?.metadata as Record<string, unknown> | null | undefined
  const displayMetadata = deploymentMetadata ?? activeMetadata

  return (
    <motion.div
      className="flex-1 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto w-full max-w-5xl px-8 py-4 space-y-4">
        {/* ── Full-width: Endpoint + Status ── */}
        <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-[10px] font-medium text-foreground/40 mb-1">
              Endpoint
            </p>
            <CopyText value={endpointUrl} className="max-w-full">
                <span className="truncate font-mono text-[12px] text-foreground">
                {endpointUrl}
              </span>
            </CopyText>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border/50 sm:grid-cols-4">
            <div className="px-4 py-3">
              <p className="text-[10px] font-medium text-foreground/40 mb-1">
                Status
              </p>
              <DeploymentStatusBadge status={depStatus} />
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-medium text-foreground/40 mb-1">
                Runtime
              </p>
              <p className="text-[12px] text-foreground">{agentConfig.runtime}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-medium text-foreground/40 mb-1">
                Deployed
              </p>
              <p className="text-[12px] tabular-nums text-foreground">
                {deployedAt ? formatRelativeTime(deployedAt) : "—"}
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-medium text-foreground/40 mb-1">
                Version
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[12px] text-foreground">
                <span>v{deployment.version} ·</span>
                <CopyText value={deployment.id}>
                  <span className="text-muted-foreground">{deployment.id.slice(0, 8)}</span>
                </CopyText>
                {isCurrentDeployment && <CurrentBadge />}
              </div>
            </div>
          </div>
        </div>

        {/* ── Full-width alerts ── */}
        {!isCurrentDeployment && !deploymentMetadata && (
          <div className="rounded-lg border-[0.5px] border-border bg-muted/30 overflow-hidden">
            <div className="px-4 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                Config snapshot not available for this version — showing current agent configuration.
              </p>
            </div>
          </div>
        )}

        {deployment.status === "failed" && deployment.error && (
          <div className="rounded-lg border-[0.5px] border-red-500/30 bg-red-500/5 overflow-hidden">
            <div className="px-4 py-3 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400 mb-1">
                  Deploy Error
                </p>
                <p className="text-[12px] text-red-600/80 dark:text-red-400/80 font-mono break-all">
                  {deployment.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Two balanced columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AgentDetailsPanel
            metadata={displayMetadata}
            sections={["config", "prompt"]}
            title="Agent Configuration"
          />
          <div className="flex flex-col gap-3">
            <AgentDetailsPanel
              metadata={displayMetadata}
              sections={["tools", "hooks", "sandbox"]}
              hideTitle
            />
            <EnvVarsSection agentConfig={agentConfig} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Playground Tab ───────────────────────────────────────────
function DeploymentAgentChat({
  teamId,
  agentSlug,
  sandboxId,
}: {
  teamId: string
  agentSlug: string
  sandboxId: string
}) {
  const { resolvedTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"

  const chat = useMemo(() => {
    return new Chat({
      id: sandboxId,
      transport: new DefaultChatTransport({
        api: `${RELAY_URL}/v1/chat/${agentSlug}`,
        headers: async () => {
          const token = await fetchRelayToken(teamId, agentSlug)
          return { Authorization: `Bearer ${token}` }
        },
        body: { sandboxId },
      }),
    })
  }, [teamId, agentSlug, sandboxId])

  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  const handleSend = useCallback(
    (message: { role: "user"; content: string }) => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message.content }],
      })
    },
    [sendMessage],
  )

  return (
    <AgentChat
      messages={messages}
      onSend={handleSend}
      status={status}
      onStop={() => stop()}
      error={error ?? undefined}
      colorMode={colorMode}
      className="h-full"
    />
  )
}

function PlaygroundTab({
  config,
  teamId,
  chatKey,
  sandboxId,
}: {
  config: Pick<AnAgentConfig, "id" | "slug">
  teamId: string | null
  chatKey: number
  sandboxId: string
}) {
  if (!teamId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-1 flex-col min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 min-h-0">
        <DeploymentAgentChat
          key={chatKey}
          teamId={teamId}
          agentSlug={config.slug}
          sandboxId={sandboxId}
        />
      </div>
    </motion.div>
  )
}

// ─── Threads Tab ──────────────────────────────────────────────
function LogsTab({
  config,
  teamId,
}: {
  config: Pick<AnAgentConfig, "id" | "slug">
  teamId: string | null
}) {
  const [statusFilter, setStatusFilter] = useAtom(logsStatusFilterAtom)
  const [dateRange, setDateRange] = useAtom(logsDateRangeAtom)
  const [searchQuery, setSearchQuery] = useAtom(logsSearchQueryAtom)
  const [sandboxFilter, setSandboxFilter] = useAtom(logsSandboxFilterAtom)
  const groupBySandbox = useAtomValue(logsGroupBySandboxAtom)

  const setSidebarViewMode = useSetAtom(sidebarViewModeAtom)
  useEffect(() => {
    setSidebarViewMode("agents-threads")
    return () => { setSidebarViewMode("agents") }
  }, [setSidebarViewMode])

  if (!teamId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  return (
    <ThreadLogsView
      teamId={teamId}
      agentId={config.id}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      sandboxFilter={sandboxFilter}
      onSandboxFilterChange={setSandboxFilter}
      groupBySandbox={groupBySandbox}
      hideToolbar
    />
  )
}
