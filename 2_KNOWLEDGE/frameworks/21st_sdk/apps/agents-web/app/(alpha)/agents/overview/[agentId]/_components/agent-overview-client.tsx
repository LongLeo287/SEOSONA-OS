"use client"

import { useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { api } from "@/trpc/client"
import { OverviewContent } from "../../../_components/overview-content"

export function AgentOverviewClient({ agentId }: { agentId: string }) {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [selectedAgent, setSelectedAgent] = useAtom(anSelectedAgentAtom)

  const { data: allConfigs } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  // Sync agent from URL param
  useEffect(() => {
    if (!allConfigs?.length || !agentId) return
    if (selectedAgent?.id === agentId) return

    const agent = allConfigs.find((a) => a.id === agentId)
    if (agent) {
      setSelectedAgent({ id: agent.id, name: agent.name, slug: agent.slug })
    }
  }, [agentId, allConfigs, selectedAgent?.id])

  return <OverviewContent />
}
