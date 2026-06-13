"use client"

import { Suspense, useState } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { useAgentsSession } from "@/lib/agents/auth/client"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { apiRefSelectedAgentSlugAtom } from "@/lib/atoms/agents-docs"
import { api } from "@/trpc/client"
import { ChevronsUpDown, Check } from "lucide-react"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const API_REF_NAV_ITEMS = [
  { title: "Overview", href: "/agents/docs/api-reference" },
  { title: "Sandboxes", href: "/agents/docs/api-reference/sandboxes" },
  { title: "Sandbox Operations", href: "/agents/docs/api-reference/sandbox-operations" },
  { title: "Threads", href: "/agents/docs/api-reference/threads" },
  { title: "Chat", href: "/agents/docs/api-reference/chat" },
  { title: "Vaults", href: "/agents/docs/api-reference/vaults" },
  { title: "Errors", href: "/agents/docs/api-reference/errors" },
]

function isActive(href: string, pathname: string): boolean {
  if (href === "/agents/docs/api-reference") return pathname === "/agents/docs/api-reference"
  return pathname === href || pathname.startsWith(href + "/")
}

function ApiRefAgentSwitch() {
  const { isSignedIn } = useAgentsSession()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const [selectedSlug, setSelectedSlug] = useAtom(apiRefSelectedAgentSlugAtom)
  const [open, setOpen] = useState(false)

  const { data: teams } = api.teams.getUserTeams.useQuery(undefined, {
    enabled: !!isSignedIn && !teamId,
    staleTime: 5 * 60_000,
  })
  const resolvedTeamId = teamId || teams?.[0]?.id
  const canFetch = !!isSignedIn && !!resolvedTeamId

  const { data: configs } = api.agentConfigs.listConfigs.useQuery(
    { teamId: resolvedTeamId! },
    { enabled: canFetch },
  )

  const agents = configs?.map((c) => ({ id: c.id, slug: c.slug, name: c.name })) || []

  if (!isSignedIn || agents.length === 0) return null

  const defaultSlug = selectedAgent?.slug || agents[0]?.slug
  const activeSlug = selectedSlug && agents.some((a) => a.slug === selectedSlug)
    ? selectedSlug
    : defaultSlug
  const activeAgent = agents.find((a) => a.slug === activeSlug)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Select agent for examples"
          className={cn(
            "an-focus-input flex h-7 w-full items-center gap-2 rounded-md border border-border/70 px-2.5 text-[12px] font-medium shadow-none",
            open ? "bg-muted" : "bg-foreground/[0.03] hover:bg-muted/60",
          )}
        >
          {activeAgent ? (
            <AgentAvatar name={activeAgent.name} size="xs" />
          ) : (
            <div className="h-3.5 w-3.5 shrink-0 rounded-[2px] bg-muted" />
          )}
          <span className="flex-1 truncate text-left font-mono">
            {activeSlug || "Select agent"}
          </span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {agents.map((a) => {
          const isSelected = activeSlug === a.slug
          return (
            <DropdownMenuItem
              key={a.id}
              onSelect={() => setSelectedSlug(a.slug)}
              className="text-[12px]"
            >
              <AgentAvatar name={a.name} size="xs" />
              <span className="flex-1 truncate font-mono">{a.slug}</span>
              {isSelected && (
                <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ApiReferenceNav() {
  const pathname = useAgentsPathname() ?? ""

  return (
    <nav className="hidden md:flex flex-col gap-px w-[200px] shrink-0 sticky top-0 px-1 pt-6 pb-10 overflow-y-auto max-h-[calc(100svh-var(--agents-header-h,96px))]">
      <div className="mb-3">
        <Suspense>
          <ApiRefAgentSwitch />
        </Suspense>
      </div>
      {API_REF_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium",
            isActive(item.href, pathname)
              ? "bg-foreground/[0.06] text-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
