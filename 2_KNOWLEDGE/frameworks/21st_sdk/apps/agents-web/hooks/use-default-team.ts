import { api } from "@/trpc/client"
import { useMemo } from "react"
import { useAuth } from "@clerk/nextjs"

export function useDefaultTeam() {
  const { userId } = useAuth()
  const { data: teams, isLoading } = api.teams.getUserTeams.useQuery(
    undefined,
    {
      enabled: !!userId,
    },
  )

  const defaultTeam = useMemo(() => {
    if (!teams?.length) return null
    // Use first available team as default
    return teams[0]
  }, [teams])

  return {
    team: defaultTeam,
    teamId: defaultTeam?.id || "",
    isLoading,
  }
}
