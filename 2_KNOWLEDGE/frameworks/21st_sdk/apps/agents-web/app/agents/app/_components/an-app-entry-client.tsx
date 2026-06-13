"use client"

import { useEffect, useRef } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { useAgentsViewer } from "@/lib/agents/auth/client"
import { useAtomValue, useSetAtom } from "jotai"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentIdAtom } from "@/lib/atoms/an-agent"
import { useSearchParams } from "next/navigation"
import { AnAuthRedirectLoader } from "@/app/agents/_components/an-auth-redirect-loader"

function SmartRedirect() {
  const router = useAgentsRouter()
  const user = useAgentsViewer()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const setSelectedTeamId = useSetAtom(selectedTeamIdAtom)
  const setSelectedAgentId = useSetAtom(anSelectedAgentIdAtom)
  const searchParams = useSearchParams()
  const adminOverrideApplied = useRef(false)

  const adminTeamId = searchParams.get("admin_team_id")
  const adminAgentId = searchParams.get("admin_agent_id")

  const { data: teams, isLoading: teamsLoading } =
    api.teams.getUserTeams.useQuery(undefined, { staleTime: 5 * 60 * 1000 })

  const createTeam = api.teams.createTeam.useMutation({
    onSuccess: (team) => {
      setSelectedTeamId(team.id)
    },
  })

  useEffect(() => {
    if (adminTeamId && adminAgentId && !adminOverrideApplied.current) {
      adminOverrideApplied.current = true
      setSelectedTeamId(adminTeamId)
      setSelectedAgentId(adminAgentId)
      router.replace("/agents/threads")
    }
  }, [adminTeamId, adminAgentId, setSelectedTeamId, setSelectedAgentId, router])

  useEffect(() => {
    if (adminTeamId && adminAgentId) return
    if (teamsLoading || !teams) return

    if (teams.length > 0) {
      const exists = teams.some((t) => t.id === teamId)
      if (!exists) {
        setSelectedTeamId(teams[0]!.id)
      }
      return
    }

    if (
      !createTeam.isPending &&
      !createTeam.isSuccess &&
      !createTeam.isError
    ) {
      const name = user?.firstName
        ? `${user.firstName}'s Team`
        : user?.email?.split("@")[0] || "My Team"
      createTeam.mutate({ name })
    }
  }, [
    teamsLoading,
    teams,
    teamId,
    setSelectedTeamId,
    user,
    createTeam.isPending,
    createTeam.isSuccess,
    createTeam.isError,
    adminTeamId,
    adminAgentId,
  ])

  useEffect(() => {
    if (adminTeamId && adminAgentId) return
    if (!teamId) return
    router.replace("/agents/overview")
  }, [teamId, router, adminTeamId, adminAgentId])

  return <AnAuthRedirectLoader />
}

export function AnAppEntryClient() {
  return <SmartRedirect />
}
