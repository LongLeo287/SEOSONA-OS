"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BookOpen,
  ChevronDown,
  Cloud,
  CreditCard,
  FileCode,
  KeyRound,
  LayoutDashboard,
  Lock,
  ScrollText,
  Server,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"
import { ThemeToggle } from "@/components/features/agents/an/dashboard/theme-toggle"
import { Button as ButtonCustom } from "@/components/ui/button"
import { useAtomValue, useSetAtom } from "jotai"
import { sidebarViewModeAtom } from "@/app/(alpha)/atoms"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { LogoDropdownContent } from "@/components/features/agents/ui/canvas/{components}/logo-dropdown-content"
import {
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/features/agents/ui/canvas/{components}/ui/sidebar"
import {
  useAgentsSession,
  useAgentsSignOut,
  useAgentsViewer,
} from "@/lib/agents/auth/client"
import { agentsHref } from "@/lib/utils/agents-href"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/tooltip"
import { Kbd } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/kbd"
import { IconDoubleChevronLeft } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"

const NAV_ITEMS: {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
  needsAgent?: boolean
}[] = [
  { label: "Overview", href: "/agents/overview", icon: LayoutDashboard },
  { label: "Deployments", href: "/agents/deployments", icon: Cloud },
  { label: "Threads", href: "/agents/threads", icon: ScrollText },
  { label: "Observability", href: "/agents/observability", icon: Activity },
  { label: "Env Variables", href: "/agents/environment-variables", icon: Server },
  { label: "Vaults", href: "/agents/vaults", icon: Lock },
  { label: "Usage", href: "/agents/usage", icon: BarChart3 },
  { label: "Billing", href: "/agents/billing", icon: CreditCard },
  { label: "API Keys", href: "/agents/api-keys", icon: KeyRound },
  { label: "API Reference", href: "/agents/api", icon: FileCode },
  { label: "Settings", href: "/agents/settings", icon: Settings, needsAgent: true },
]

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/")
}

function isOverviewActive(pathname: string): boolean {
  return pathname === "/agents/overview" || pathname.startsWith("/agents/overview/")
}

interface AgentsSidebarContentProps {
  onBack: () => void
  hideBackButton?: boolean
}

export function AgentsSidebarContent({
  onBack,
  hideBackButton = false,
}: AgentsSidebarContentProps) {
  const pathname = usePathname() ?? ""
  const [isSidebarHovered, setIsSidebarHovered] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [showAuthDialog, setShowAuthDialog] = React.useState(false)
  const { userId } = useAgentsSession()
  const viewer = useAgentsViewer()
  const signOut = useAgentsSignOut()
  const { toggleSidebar, isMobile: isMobileSidebar } = useSidebar()
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const setSidebarViewMode = useSetAtom(sidebarViewModeAtom)
  const clerkUsername = viewer?.username ?? undefined

  const overviewHref = selectedAgent
    ? `/agents/overview/${selectedAgent.id}`
    : "/agents/overview"

  return (
    <div
      className="flex h-full flex-col bg-tl-background"
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <div className="flex-shrink-0">
        <SidebarGroup className="!pt-2">
          <SidebarGroupContent>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <ButtonCustom
                      variant="ghost"
                      className="an-focus-btn h-6 px-1.5 justify-start hover:bg-foreground/10 rounded-md group/team-button max-w-full focus-visible:!outline-none"
                      suppressHydrationWarning
                    >
                      <div className="flex min-w-0 max-w-full items-center gap-1.5">
                        <div className="flex flex-shrink-0 items-center justify-center">
                          <Logo className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium text-foreground">
                            21st
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-3 flex-shrink-0 overflow-hidden text-muted-foreground",
                            isDropdownOpen
                              ? "w-3 opacity-100"
                              : isMobileSidebar
                                ? "w-3 opacity-100"
                                : "w-0 opacity-0 group-hover/team-button:w-3 group-hover/team-button:opacity-100",
                          )}
                        />
                      </div>
                    </ButtonCustom>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-48"
                    sideOffset={8}
                  >
                    <LogoDropdownContent
                      userId={userId}
                      clerkUser={viewer}
                      clerkUsername={clerkUsername}
                      onClose={() => setIsDropdownOpen(false)}
                      onSignOut={() => {
                        void signOut(agentsHref("/agents"))
                      }}
                      onLogin={() => setShowAuthDialog(true)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={cn(
                  "flex-shrink-0 transition-all duration-300 ease-in-out",
                  isSidebarHovered || isDropdownOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0",
                )}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <ButtonCustom
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="an-focus-btn h-6 w-6 p-0 hover:bg-foreground/10 active:scale-[0.97] text-foreground flex-shrink-0 rounded-md focus-visible:!outline-none"
                        aria-label="Close sidebar"
                      >
                        <IconDoubleChevronLeft className="h-4 w-4" />
                      </ButtonCustom>
                    </TooltipTrigger>
                    <TooltipContent>
                      Close sidebar
                      <Kbd>⌘\</Kbd>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>

      {!hideBackButton && (
        <div className="px-2 pt-2 pb-1">
          <button
            type="button"
            onClick={onBack}
            className="an-focus-btn relative flex items-center w-full px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 absolute left-2" />
            <span className="flex-1 text-center font-medium">Agents</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="px-1 flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-0.5">
          {NAV_ITEMS.filter(
            (item) => !(IS_STANDALONE_APP && item.href === "/agents/billing"),
          ).map((item) => {
            if (item.needsAgent && !selectedAgent) return null

            const isOverviewItem = item.href === "/agents/overview"
            const isSettingsItem = item.href === "/agents/settings"
            const href = isOverviewItem
              ? overviewHref
              : isSettingsItem && selectedAgent
                ? `/agents/settings/${selectedAgent.id}`
                : item.href
            const active = isOverviewItem
              ? isOverviewActive(pathname)
              : isActive(item.href, pathname)
            const disabled = item.comingSoon

            return (
              <Link
                key={item.href}
                href={disabled ? "#" : href}
                className={cn(
                  "an-focus-btn flex items-center gap-2.5 w-full pl-2 pr-2 py-1.5 rounded-md text-sm",
                  active
                    ? "bg-foreground/5 text-foreground"
                    : disabled
                      ? "text-muted-foreground/50 cursor-default"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
                onClick={
                  disabled
                    ? (e) => e.preventDefault()
                    : item.href === "/agents/threads" && isActive("/agents/threads", pathname)
                      ? (e) => { e.preventDefault(); setSidebarViewMode("agents-threads") }
                      : undefined
                }
              >
                {isOverviewItem && selectedAgent ? (
                  <AgentAvatar name={selectedAgent.name} size="sm" />
                ) : (
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="flex-1 text-left">
                  {isOverviewItem && selectedAgent ? "Overview" : item.label}
                </span>
                {disabled && (
                  <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium text-muted-foreground/50">
                    Soon
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 flex items-center justify-between">
        <Link
          href="/agents/docs"
          className="an-focus-btn flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-[0.97]"
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span>Documentation</span>
        </Link>
        <ThemeToggle />
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  )
}
