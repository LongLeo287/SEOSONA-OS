"use client"

import { useAtomValue } from "jotai"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"
import { cn } from "@/lib/utils"

export function SettingsPageClient() {
  const router = useAgentsRouter()
  const teamId = useAtomValue(selectedTeamIdAtom)

  const { data: agents, isLoading } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <AnLogoSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10 space-y-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      {/* Agents list — click navigates to /an/settings/[agentId] */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-medium">Agents</h2>
        </div>
        {agents && agents.length > 0 ? (
          agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => router.push(`/agents/settings/${agent.id}`)}
              className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50"
            >
              <AgentAvatar name={agent.name} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{agent.name}</p>
                <p className="text-sm text-muted-foreground truncate font-mono">
                  {agent.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    agent.deployed_at
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-foreground/[0.06] text-muted-foreground",
                  )}
                >
                  {agent.deployed_at ? "Deployed" : "Draft"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No agents yet
          </div>
        )}
      </div>
    </div>
  )
}
