"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Paintbrush, RotateCcw, Plus, Check, ChevronsUpDown, LayoutDashboard, BookOpen, Layers3 } from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { ClaudeCodeIcon } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"
import { docsAgentSidebarOpenAtom } from "@/components/features/agents/an/docs/docs-agent-chat"
import { AgentAvatar } from "./agent-avatar"
import { useAtom, useAtomValue } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import { Spinner } from "@/components/icons/spinner"
import {
  anSelectedAgentAtom,
  anPlaygroundRestartAtom,
  anPlaygroundThemeToggleAtom,
  anSkillsCreateAtom,
  anSkillsSaveAtom,
  anApiKeysCreateAtom,
  anSettingsEditingAgentAtom,
  anStudioProjectAtom,
  type AnAgentConfig,
} from "@/lib/atoms/an-agent"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { CommunityHeader } from "@/components/features/agents/ui/canvas/features/navigation/community-header"
import { useAgentsSession } from "@/lib/agents/auth/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { api } from "@/trpc/client"

const ROUTE_TITLES: Record<string, string> = {
  "/agents/overview": "Overview",
  "/agents/playground": "Playground",
  "/agents/threads": "Threads",
  "/agents/observability": "Observability",
  "/agents/deployments": "Deployments",
  "/agents/environment-variables": "Environment Variables",
  "/agents/usage": "Usage",
  "/agents/billing": "Billing",
  "/agents/api-keys": "API Keys",
  "/agents/api": "API Reference",
  "/agents/vaults": "Vaults",
  "/agents/skills": "Skills",
  "/agents/profile": "Profile",
  "/agents/docs": "Documentation",
  "/agents/settings": "Settings",
  "/agents/studio": "Studio",
}

function getDeploymentId(pathname: string): string | null {
  const match = pathname.match(/^\/agents\/deployments\/([^/]+)$/)
  return match?.[1] ?? null
}

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route + "/")) return title
  }
  return ""
}

function AskAIButton() {
  const [isOpen, setIsOpen] = useAtom(docsAgentSidebarOpenAtom)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key === "i") {
        e.preventDefault()
        setIsOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [setIsOpen])

  if (isOpen) return null

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="an-focus-btn flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
    >
      <ClaudeCodeIcon className="h-3.5 w-3.5" />
      Ask AI
    </button>
  )
}

interface DashboardHeaderProps {
  agents?: AnAgentConfig[]
}

function getWorkspaceLabel(team: any, myWorkspaceId: string | null) {
  if (team.id === myWorkspaceId) {
    return "My Team"
  }
  return (
    team.user?.name ||
    team.user?.display_username ||
    team.user?.username ||
    team.user?.email ||
    team.name
  )
}

export function DashboardHeader({ agents = [] }: DashboardHeaderProps) {
  const pathname = usePathname() ?? ""
  const router = useRouter()
  const { userId } = useAgentsSession()
  const rawTitle = getPageTitle(pathname)
  const deploymentId = getDeploymentId(pathname)
  const [selectedAgent, setSelectedAgent] = useAtom(anSelectedAgentAtom)
  const [selectedTeamId, setSelectedTeamId] = useAtom(selectedTeamIdAtom)
  const playgroundRestart = useAtomValue(anPlaygroundRestartAtom)
  const playgroundThemeToggle = useAtomValue(anPlaygroundThemeToggleAtom)
  const skillsCreate = useAtomValue(anSkillsCreateAtom)
  const skillsSave = useAtomValue(anSkillsSaveAtom)
  const apiKeysCreate = useAtomValue(anApiKeysCreateAtom)
  const settingsEditingAgent = useAtomValue(anSettingsEditingAgentAtom)
  const studioProject = useAtomValue(anStudioProjectAtom)
  const [agentMenuOpen, setAgentMenuOpen] = useState(false)
  const [teamMenuOpen, setTeamMenuOpen] = useState(false)

  // Fetch teams
  const { data: teams } = api.teams.getUserTeams.useQuery(undefined, {
    enabled: !!userId,
  })
  const myWorkspaceId =
    teams?.find((team: any) => team.user?.id === userId)?.id ?? null
  const workspaceTeams = teams
    ? [...teams].sort((a: any, b: any) => {
        if (a.id === myWorkspaceId) return -1
        if (b.id === myWorkspaceId) return 1
        return 0
      })
    : []

  useEffect(() => {
    if (!workspaceTeams.length) return
    const hasSelectedTeam = workspaceTeams.some(
      (team: any) => team.id === selectedTeamId,
    )
    if (!hasSelectedTeam) {
      setSelectedTeamId(workspaceTeams[0]!.id)
    }
  }, [selectedTeamId, setSelectedTeamId, workspaceTeams])

  const selectedTeam = workspaceTeams.find((t: any) => t.id === selectedTeamId)
  const selectedTeamLabel = selectedTeam
    ? getWorkspaceLabel(selectedTeam, myWorkspaceId)
    : "Select Team"

  // Detect if we're on the overview page
  const isOnOverview = pathname === "/agents/overview" || pathname.startsWith("/agents/overview/")
  const title = isOnOverview
    ? selectedAgent ? "Overview" : "Agents"
    : rawTitle

  function handleAgentSelect(agent: AnAgentConfig | null) {
    setSelectedAgent(agent)
    if (isOnOverview) {
      if (agent) {
        router.push(`/agents/overview/${agent.id}`)
      } else if (pathname !== "/agents/overview") {
        router.push("/agents/overview")
      }
    }
  }

  function handleTeamSelect(teamId: string) {
    setSelectedTeamId(teamId)
    setSelectedAgent(null)

    if (isOnOverview && pathname !== "/agents/overview") {
      router.push("/agents/overview")
    }
  }

  // Team selector dropdown
  const teamSelector = workspaceTeams.length > 0 ? (
    <DropdownMenu open={teamMenuOpen} onOpenChange={setTeamMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className={`an-focus-btn flex h-7 items-center gap-2 rounded-md px-2.5 text-[12px] font-medium ${teamMenuOpen ? "bg-muted" : "bg-muted/50 hover:bg-muted"}`}>
          <Layers3 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-left max-w-[120px]">
            {selectedTeamLabel}
          </span>
          <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        {workspaceTeams.map((team: any) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => handleTeamSelect(team.id)}
          >
            <span className="flex-1 truncate">
              {getWorkspaceLabel(team, myWorkspaceId)}
            </span>
            {team.id === selectedTeamId && (
              <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null

  const isOnStudioLanding = pathname === "/agents/studio"
  const isOnStudioWorkspace =
    pathname.startsWith("/agents/studio/") && pathname !== "/agents/studio"

  // Agent selector dropdown
  const agentSelector = isOnStudioWorkspace ? null : (agents.length > 0 || isOnStudioLanding) ? (
    <DropdownMenu open={agentMenuOpen} onOpenChange={setAgentMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className={`an-focus-btn flex h-7 min-w-[120px] items-center gap-2 rounded-md px-2.5 text-[12px] font-medium ${agentMenuOpen ? "bg-muted" : "bg-muted/50 hover:bg-muted"}`}>
          {isOnStudioLanding ? (
            <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : selectedAgent ? (
            <AgentAvatar name={selectedAgent.name} size="sm" />
          ) : (
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="flex-1 truncate text-left">
            {isOnStudioLanding ? "New Agent" : selectedAgent?.name ?? "All Agents"}
          </span>
          <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        <DropdownMenuItem onClick={() => router.push("/agents/studio")}>
          <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1">New Agent</span>
          {isOnStudioLanding && (
            <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAgentSelect(null)}>
          <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1">All Agents</span>
          {!isOnStudioLanding && !selectedAgent && (
            <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        {agents.map((agent) => (
          <DropdownMenuItem
            key={agent.id}
            onClick={() => handleAgentSelect(agent)}
          >
            <AgentAvatar name={agent.name} size="sm" />
            <span className="flex-1 truncate">{agent.name}</span>
            {!isOnStudioLanding && selectedAgent?.id === agent.id && (
              <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null

  // Center content (page title)
  const pageTitleContent = title ? (
    <div className="flex items-center justify-center pointer-events-none">
      {deploymentId ? (
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => router.push("/agents/deployments")}
            className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Deployments
          </button>
          <span className="text-[13px] text-muted-foreground/50">/</span>
          <span className="text-[13px] font-medium text-foreground font-mono">
            {deploymentId.slice(0, 8)}
          </span>
        </div>
      ) : isOnStudioWorkspace && studioProject ? (
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => router.push("/agents/studio")}
            className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Studio
          </button>
          <span className="text-[13px] text-muted-foreground/50">/</span>
          <span className="text-[13px] font-medium text-foreground">
            {studioProject.name}
          </span>
        </div>
      ) : pathname.startsWith("/agents/settings/") && settingsEditingAgent ? (
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => router.push("/agents/settings")}
            className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </button>
          <span className="text-[13px] text-muted-foreground/50">/</span>
          <span className="text-[13px] font-medium text-foreground">
            {settingsEditingAgent.name}
          </span>
        </div>
      ) : (
        <span className="text-[13px] font-medium text-foreground">
          {title}
        </span>
      )}
    </div>
  ) : undefined

  // Right actions
  const actionsContent = (
    <div className="flex items-center gap-1">
      <a
        href="/agents/docs"
        className="an-focus-btn flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Docs
      </a>
      <a
        href="https://discord.gg/yn3pzMb7VR"
        target="_blank"
        rel="noopener noreferrer"
        className="an-focus-btn flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
      >
        <DiscordIcon className="h-3.5 w-3.5" />
        Discord
      </a>
      <AskAIButton />
      {playgroundThemeToggle && selectedAgent && (
        <button
          onClick={playgroundThemeToggle}
          className="an-focus-btn flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
        >
          <Paintbrush className="h-3.5 w-3.5" />
          Theme Builder
        </button>
      )}
      {playgroundRestart && selectedAgent && (
        <button
          onClick={playgroundRestart}
          className="an-focus-btn flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
          aria-label="Restart chat"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
      {skillsSave && (
        <button
          onClick={skillsSave.onSave}
          disabled={skillsSave.disabled}
          className="an-focus-btn relative h-7 px-3 rounded-md bg-foreground text-background text-[12px] font-medium transition-all hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-40 overflow-hidden"
        >
          <span className={skillsSave.state === "saving" ? "opacity-0" : skillsSave.state === "saved" ? "flex items-center gap-1.5" : ""}>
            {skillsSave.state === "saved" ? <><Check className="h-3.5 w-3.5" /> Saved</> : skillsSave.label}
          </span>
          <AnimatePresence>
            {skillsSave.state === "saving" && (
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Spinner size={14} color="currentColor" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
      {skillsCreate && !skillsSave && (
        <button
          onClick={skillsCreate}
          className="an-focus-btn flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
          aria-label="Create skill"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
      {apiKeysCreate && (
        <button
          onClick={apiKeysCreate}
          className="an-focus-btn flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
          aria-label="Create API key"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )

  const leftSelectors = (teamSelector || agentSelector) ? (
    <div className="flex items-center gap-1.5">
      {teamSelector}
      {teamSelector && agentSelector && (
        <span className="text-[13px] text-muted-foreground/50">/</span>
      )}
      {agentSelector}
    </div>
  ) : null

  return (
    <CommunityHeader
      baseLabel={leftSelectors}
      centerContent={pageTitleContent}
      extraActionsRight={actionsContent}
      hideActions
    />
  )
}
