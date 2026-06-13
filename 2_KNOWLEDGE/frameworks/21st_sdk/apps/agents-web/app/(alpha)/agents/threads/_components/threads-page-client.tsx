"use client"

import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ScrollText } from "lucide-react"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { sidebarViewModeAtom } from "../../../atoms"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { SelectAgentPrompt } from "@/components/features/agents/an/dashboard/select-agent-prompt"
import {
  logsStatusFilterAtom,
  logsDateRangeAtom,
  logsSearchQueryAtom,
  logsAgentFilterAtom,
  logsSandboxFilterAtom,
  logsGroupBySandboxAtom,
} from "./logs-constants"
import { ThreadLogsView } from "./thread-logs-view"

export function ThreadsPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const searchParams = useSearchParams()
  const initialThreadId = searchParams.get("threadId")

  const [statusFilter, setStatusFilter] = useAtom(logsStatusFilterAtom)
  const [dateRange, setDateRange] = useAtom(logsDateRangeAtom)
  const [searchQuery, setSearchQuery] = useAtom(logsSearchQueryAtom)
  const [sandboxFilter, setSandboxFilter] = useAtom(logsSandboxFilterAtom)
  const groupBySandbox = useAtomValue(logsGroupBySandboxAtom)
  const agentFilter = useAtomValue(logsAgentFilterAtom)

  const setSidebarViewMode = useSetAtom(sidebarViewModeAtom)
  useEffect(() => {
    if (!selectedAgent) return
    setSidebarViewMode("agents-threads")
    return () => { setSidebarViewMode("agents") }
  }, [setSidebarViewMode, selectedAgent])

  if (!teamId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  if (!selectedAgent) {
    return <SelectAgentPrompt title="Threads" icon={ScrollText} />
  }

  return (
    <ThreadLogsView
      teamId={teamId}
      agentId={agentFilter.length === 1 ? agentFilter[0] : agentFilter.length === 0 ? selectedAgent.id : undefined}
      agentFilter={agentFilter}
      initialThreadId={initialThreadId}
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
