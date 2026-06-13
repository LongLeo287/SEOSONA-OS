"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, ScrollText, type LucideIcon } from "lucide-react"
import { AgentAvatar } from "./agent-avatar"
import { MiniSparkline } from "./mini-sparkline"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { api } from "@/trpc/client"

interface SelectAgentPromptProps {
  title: string
  icon?: LucideIcon
}

export function SelectAgentPrompt({
  title,
  icon: Icon = ScrollText,
}: SelectAgentPromptProps) {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [, setSelectedAgent] = useAtom(anSelectedAgentAtom)
  const [search, setSearch] = useState("")

  const { data: configs } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const createdAfter7d = useMemo(
    () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    [],
  )

  const {
    data: sandboxesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentConfigs.listSandboxes.useInfiniteQuery(
    {
      teamId: teamId!,
      createdAfter: createdAfter7d,
      limit: 100,
    },
    {
      enabled: !!teamId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allSandboxes = useMemo(
    () => sandboxesData?.pages.flatMap((page) => page.sandboxes) ?? [],
    [sandboxesData],
  )

  const now = useRef(new Date()).current

  const perAgentDailyThreads = useMemo(() => {
    const map = new Map<string, number[]>()
    const dayMs = 24 * 60 * 60 * 1000
    const nowMs = now.getTime()

    for (const sandbox of allSandboxes) {
      const agentId = (sandbox as any).agent_id
      if (!agentId) continue
      const threads = (sandbox as any).threads ?? []
      if (!map.has(agentId)) {
        map.set(agentId, [0, 0, 0, 0, 0, 0, 0])
      }
      const daily = map.get(agentId)!
      for (const t of threads) {
        const daysAgo = Math.floor((nowMs - new Date(t.created_at).getTime()) / dayMs)
        if (daysAgo >= 0 && daysAgo < 7) {
          daily[6 - daysAgo] += 1
        }
      }
    }
    return map
  }, [allSandboxes, now])

  const agents = useMemo(
    () =>
      configs?.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
      })) ?? [],
    [configs],
  )

  const filtered = useMemo(() => {
    if (!search) return agents
    const q = search.toLowerCase()
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q),
    )
  }, [agents, search])

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-5">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-[15px] font-medium text-foreground">
            Continue to {title}
          </p>
          <p className="text-[13px] text-muted-foreground">
            To continue to {title}, choose an agent
          </p>
        </div>

        {/* Search + List card */}
        <div className="w-full rounded-lg border border-border bg-background overflow-visible">
          {/* Search */}
          <div className="relative border-b border-border">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Agent..."
              className="h-10 w-full bg-transparent pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>

          {/* Agent list */}
          <div className="max-h-[240px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
                {agents.length === 0
                  ? "No agents yet"
                  : "No agents match your search"}
              </div>
            ) : (
              filtered.map((agent) => {
                const dailyThreads = perAgentDailyThreads.get(agent.id) ?? [0, 0, 0, 0, 0, 0, 0]
                const totalThreads = dailyThreads.reduce((s, v) => s + v, 0)

                return (
                  <button
                    key={agent.id}
                    onClick={() =>
                      setSelectedAgent({
                        id: agent.id,
                        name: agent.name,
                        slug: agent.slug,
                      })
                    }
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <AgentAvatar name={agent.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-foreground truncate">
                        {agent.name}
                      </p>
                      {agent.slug && (
                        <p className="text-[11px] text-muted-foreground/60 truncate">
                          {agent.slug}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {totalThreads > 0 && (
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {totalThreads}
                        </span>
                      )}
                      <MiniSparkline data={dailyThreads} width={72} height={24} label="threads" />
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
