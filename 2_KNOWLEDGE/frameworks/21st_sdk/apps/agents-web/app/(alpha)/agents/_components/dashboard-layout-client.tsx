"use client"

import { DashboardHeader } from "@/components/features/agents/an/dashboard/dashboard-header"
import { DashboardChatSidebar } from "@/components/features/agents/an/dashboard/dashboard-chat-wrapper"
import { AgentsSidebarContent } from "@/components/features/agents/ui/agents-sidebar-content"
import {
  SidebarContent,
  SidebarProvider,
} from "@/components/features/agents/ui/canvas/{components}/ui/sidebar"
import { ResizableSidebar } from "@/components/features/agents/ui/canvas/[id]/{components}/resizable-sidebar"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { api } from "@/trpc/client"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import {
  anSelectedAgentIdAtom,
  anSelectedAgentAtom,
  type AnAgentConfig,
} from "@/lib/atoms/an-agent"
import { useMemo, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useIsAdmin } from "@/components/features/agents/ui/publish/hooks/use-is-admin"
import {
  AGENTS_SIDEBAR_CLOSE_HOTKEY,
  AGENTS_SIDEBAR_MAX_WIDTH,
  AGENTS_SIDEBAR_MIN_WIDTH,
  agentsSidebarOpenAtom,
  agentsSidebarWidthAtom,
  sidebarViewModeAtom,
} from "../../atoms"
import {
  logsStatusFilterAtom,
  logsDateRangeAtom,
  logsSearchQueryAtom,
  logsAgentFilterAtom,
  logsSandboxFilterAtom,
  logsGroupBySandboxAtom,
} from "../threads/_components/logs-constants"
import { LogsFilterSidebar } from "../threads/_components/logs-filter-sidebar"

const AGENTS_SHELL_RETURN_PATH_KEY = "agents-shell-return-path"

export function DashboardLayoutClient({
  children,
  initialSidebarOpen,
  initialSidebarWidth,
}: {
  children: React.ReactNode
  initialSidebarOpen: boolean
  initialSidebarWidth: number
}) {
  useHydrateAtoms([
    [agentsSidebarOpenAtom, initialSidebarOpen],
    [agentsSidebarWidthAtom, initialSidebarWidth],
  ])

  const [teamId, setTeamId] = useAtom(selectedTeamIdAtom)
  const setAgentId = useSetAtom(anSelectedAgentIdAtom)
  const [selectedAgent, setSelectedAgent] = useAtom(anSelectedAgentAtom)
  const [sidebarViewMode, setSidebarViewMode] = useAtom(sidebarViewModeAtom)
  const [sidebarOpen, setSidebarOpen] = useAtom(agentsSidebarOpenAtom)
  const sidebarWidth = useAtomValue(agentsSidebarWidthAtom)
  const searchParams = useSearchParams()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  const adminOverrideApplied = useRef(false)
  const isFirstRenderOpen = useRef(true)
  const isFirstRenderWidth = useRef(true)
  const handleBackToShell = useCallback(() => {
    if (typeof window === "undefined") return

    const storedReturnPath = window.sessionStorage.getItem(
      AGENTS_SHELL_RETURN_PATH_KEY,
    )
    const returnPath =
      storedReturnPath &&
      storedReturnPath.startsWith("/") &&
      !storedReturnPath.startsWith("/agents")
        ? storedReturnPath
        : "/home"

    window.location.assign(returnPath)
  }, [])

  const setStatusFilter = useSetAtom(logsStatusFilterAtom)
  const setDateRange = useSetAtom(logsDateRangeAtom)
  const setSearchQuery = useSetAtom(logsSearchQueryAtom)
  const setAgentFilter = useSetAtom(logsAgentFilterAtom)
  const setSandboxFilter = useSetAtom(logsSandboxFilterAtom)
  const setGroupBySandbox = useSetAtom(logsGroupBySandboxAtom)

  const adminTeamId = searchParams.get("admin_team_id")
  const adminAgentId = searchParams.get("admin_agent_id")

  useEffect(() => {
    if (isAdmin && adminTeamId && adminAgentId && !adminOverrideApplied.current) {
      adminOverrideApplied.current = true
      setTeamId(adminTeamId)
      setAgentId(adminAgentId)
      setStatusFilter([])
      setDateRange({ preset: "all" })
      setSearchQuery("")
      setAgentFilter([])
      setSandboxFilter([])
      setGroupBySandbox(false)
      const url = new URL(window.location.href)
      url.searchParams.delete("admin_team_id")
      url.searchParams.delete("admin_agent_id")
      router.replace(url.pathname + url.search)
    }
  }, [
    isAdmin,
    adminTeamId,
    adminAgentId,
    setTeamId,
    setAgentId,
    router,
    setStatusFilter,
    setDateRange,
    setSearchQuery,
    setAgentFilter,
    setSandboxFilter,
    setGroupBySandbox,
  ])

  useEffect(() => {
    if (sidebarViewMode !== "agents-threads") {
      setSidebarViewMode("agents")
    }
  }, [setSidebarViewMode, sidebarViewMode])

  useEffect(() => {
    if (typeof window === "undefined") return

    const referrer = document.referrer
    if (!referrer) return

    try {
      const referrerUrl = new URL(referrer)
      if (referrerUrl.origin !== window.location.origin) return
      if (referrerUrl.pathname.startsWith("/agents")) return

      window.sessionStorage.setItem(
        AGENTS_SHELL_RETURN_PATH_KEY,
        `${referrerUrl.pathname}${referrerUrl.search}${referrerUrl.hash}`,
      )
    } catch {
      // Ignore malformed referrers.
    }
  }, [])

  const { data: allConfigs = [] } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const agents: AnAgentConfig[] = useMemo(
    () => allConfigs.map((a) => ({ id: a.id, name: a.name, slug: a.slug })),
    [allConfigs],
  )

  const persistedAgentId = useAtomValue(anSelectedAgentIdAtom)
  useEffect(() => {
    if (agents.length === 0) return
    if (persistedAgentId) {
      const match = agents.find((a) => a.id === persistedAgentId)
      if (match && selectedAgent?.id !== match.id) {
        setSelectedAgent(match)
        return
      }
    }
    if (!selectedAgent && agents.length === 1) {
      setSelectedAgent(agents[0]!)
    }
  }, [agents, persistedAgentId, selectedAgent, setSelectedAgent])

  useEffect(() => {
    if (isFirstRenderOpen.current) {
      isFirstRenderOpen.current = false
      return
    }
    document.cookie = `agents-sidebar-open=${sidebarOpen}; path=/; max-age=${60 * 60 * 24 * 365}`
  }, [sidebarOpen])

  useEffect(() => {
    if (isFirstRenderWidth.current) {
      isFirstRenderWidth.current = false
      return
    }
    document.cookie = `agents-sidebar-width=${sidebarWidth}; path=/; max-age=${60 * 60 * 24 * 365}`
  }, [sidebarWidth])

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="bg-background"
    >
      <div
        data-alpha-page
        className="relative flex h-full w-full min-w-0 overflow-hidden bg-background select-none"
      >
        <ResizableSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          widthAtom={agentsSidebarWidthAtom}
          minWidth={AGENTS_SIDEBAR_MIN_WIDTH}
          maxWidth={AGENTS_SIDEBAR_MAX_WIDTH}
          side="left"
          closeHotkey={AGENTS_SIDEBAR_CLOSE_HOTKEY}
          showResizeTooltip
          keepMounted
          initialWidth={initialSidebarOpen ? initialSidebarWidth : 0}
          exitWidth={0}
          animationDuration={0.15}
          className="overflow-hidden bg-tl-background border-r"
          style={{ borderRightWidth: "0.5px" }}
        >
          <div className="flex h-full flex-col bg-tl-background">
            <SidebarContent className="flex flex-col bg-tl-background h-full gap-0 overflow-hidden">
              {sidebarViewMode === "agents-threads" ? (
                <LogsFilterSidebar onBack={() => setSidebarViewMode("agents")} />
              ) : (
                <AgentsSidebarContent
                  onBack={handleBackToShell}
                  hideBackButton={IS_STANDALONE_APP}
                />
              )}
            </SidebarContent>
          </div>
        </ResizableSidebar>

        <div className="relative flex min-w-0 min-h-0 flex-1 flex-col">
          <DashboardHeader agents={agents} />
          <main className="flex min-w-0 flex-1 flex-col overflow-auto pt-10">
            {children}
          </main>
        </div>

        <DashboardChatSidebar />
      </div>
    </SidebarProvider>
  )
}
