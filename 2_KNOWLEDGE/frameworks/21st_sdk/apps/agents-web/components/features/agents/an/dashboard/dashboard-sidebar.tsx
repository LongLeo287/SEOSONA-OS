"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import {
  Activity,
  BarChart3,
  BookOpen,
  Cloud,
  CreditCard,
  FileCode,
  KeyRound,
  LayoutDashboard,
  ScrollText,
  Server,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { useAgentsViewer } from "@/lib/agents/auth/client"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/features/agents/an/dashboard/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { AgentAvatar } from "./agent-avatar"
import { useAtomValue } from "jotai"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  comingSoon?: boolean
  needsAgent?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Agents", href: "/agents/overview", icon: LayoutDashboard },
  { label: "Deployments", href: "/agents/deployments", icon: Cloud },
  { label: "Threads", href: "/agents/threads", icon: ScrollText },
  { label: "Observability", href: "/agents/observability", icon: Activity },
  { label: "Env Variables", href: "/agents/environment-variables", icon: Server },
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

const LOGO_SVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="21st logo"
    className="shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M358.333 0C381.345 0 400 18.6548 400 41.6667V295.833C400 298.135 398.134 300 395.833 300H270.833C268.532 300 266.667 301.865 266.667 304.167V395.833C266.667 398.134 264.801 400 262.5 400H41.6667C18.6548 400 0 381.345 0 358.333V304.72C0 301.793 1.54269 299.081 4.05273 297.575L153.76 207.747C157.159 205.708 156.02 200.679 152.376 200.065L151.628 200H4.16667C1.86548 200 6.71103e-08 198.135 0 195.833V104.167C1.07376e-06 101.865 1.86548 100 4.16667 100H162.5C164.801 100 166.667 98.1345 166.667 95.8333V4.16667C166.667 1.86548 168.532 1.00666e-07 170.833 0H358.333ZM170.833 100C168.532 100 166.667 101.865 166.667 104.167V295.833C166.667 298.135 168.532 300 170.833 300H262.5C264.801 300 266.667 298.135 266.667 295.833V104.167C266.667 101.865 264.801 100 262.5 100H170.833Z"
      fill="currentColor"
    />
  </svg>
)

export function DashboardSidebar() {
  const pathname = useAgentsPathname() ?? ""
  const clerkUser = useAgentsViewer()
  const selectedAgent = useAtomValue(anSelectedAgentAtom)

  // Dynamic overview href based on current agent
  const overviewHref = selectedAgent
    ? `/agents/overview/${selectedAgent.id}`
    : "/agents/overview"

  return (
    <div className="flex h-full w-[200px] flex-shrink-0 flex-col border-r bg-tl-background" style={{ borderRightWidth: "0.5px" }}>
      {/* Header — logo + user avatar */}
      <div className="px-2 pt-1 pb-2 flex items-center gap-1">
        <Link
          href="/agents/overview"
          className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-foreground"
        >
          {LOGO_SVG}
          <span className="truncate text-left text-sm font-semibold tracking-tight">
            An
          </span>
        </Link>
        {clerkUser && (
          <Link
            href="/agents/profile"
            className="an-focus-btn flex items-center justify-center rounded-full transition-opacity hover:opacity-80 shrink-0"
          >
            <Avatar className={cn("h-5 w-5 transition-[box-shadow] duration-200", isActive("/agents/profile", pathname) ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "ring-0 ring-transparent ring-offset-0")}>
              <AvatarImage src={clerkUser.imageUrl ?? undefined} alt={clerkUser.fullName ?? "Profile"} />
              <AvatarFallback className="text-[9px]">
                {(clerkUser.fullName ?? clerkUser.username ?? "U")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div className="px-2 flex-1 min-h-0 overflow-y-auto -mx-1">
        <div className="space-y-0.5">
          {NAV_ITEMS.filter(
            (item) => !(IS_STANDALONE_APP && item.href === "/agents/billing"),
          ).map((item) => {
            // Hide items that require an agent when none is selected
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
                  "an-focus-btn flex items-center gap-2.5 w-full pl-2 pr-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                  active
                    ? "bg-foreground/5 text-foreground"
                    : disabled
                      ? "text-muted-foreground/50 cursor-default"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
                onClick={
                  disabled
                    ? (e) => e.preventDefault()
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
          className="an-focus-btn flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span>Documentation</span>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  )
}
