"use client"

import { useIsAdmin } from "@/components/features/agents/ui/publish/hooks/use-is-admin"
import NonAdminPlaceholder from "@/components/features/agents/ui/admin/NonAdminPlaceholder"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Cloud,
  FolderTree,
  LayoutDashboard,
  ScrollText,
  Tag,
  ArrowLeft,
  Menu,
  Table2,
  Hammer,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/features/agents/an/dashboard/theme-toggle"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React from "react"
import { ActiveFilterProvider, useActiveFilter } from "./_context/active-filter-context"
import { MIN_ACTIVE_THREADS } from "./directory/_constants"

const NAV_ITEMS = [
  { label: "Overview", href: "/agents/internal/admin", icon: LayoutDashboard },
  {
    label: "Deployments",
    href: "/agents/internal/admin/deployments",
    icon: Cloud,
  },
  {
    label: "Directory",
    href: "/agents/internal/admin/directory",
    icon: FolderTree,
  },
  {
    label: "Agents Table",
    href: "/agents/internal/admin/directory/agents",
    icon: Table2,
  },
  {
    label: "Tools Matrix",
    href: "/agents/internal/admin/directory/tools",
    icon: Hammer,
  },
  { label: "Chat Logs", href: "/agents/internal/admin/logs", icon: ScrollText },
  { label: "Coupons", href: "/agents/internal/admin/coupons", icon: Tag },
]

const ROUTE_TITLES: Record<string, string> = {
  "/agents/internal/admin": "Overview",
  "/agents/internal/admin/deployments": "Deployments",
  "/agents/internal/admin/directory": "Directory",
  "/agents/internal/admin/directory/agents": "Agents Table",
  "/agents/internal/admin/directory/tools": "Tools Matrix",
  "/agents/internal/admin/logs": "Chat Logs",
  "/agents/internal/admin/coupons": "Coupons",
}

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route + "/")) return title
  }
  return ""
}

function getDeploymentId(pathname: string): string | null {
  const match = pathname.match(
    /^\/agents\/internal\/admin\/deployments\/([^/]+)$/,
  )
  return match?.[1] ?? null
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

function isActive(href: string, pathname: string): boolean {
  if (href === "/agents/internal/admin") {
    return pathname === href
  }
  if (pathname === href) return true
  if (!pathname.startsWith(href + "/")) return false
  // Don't match parent if a more specific nav item matches
  const hasMoreSpecificMatch = NAV_ITEMS.some(
    (item) =>
      item.href !== href &&
      item.href.startsWith(href + "/") &&
      (pathname === item.href || pathname.startsWith(item.href + "/")),
  )
  return !hasMoreSpecificMatch
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? ""

  return (
    <div className="flex h-full flex-col">
      {/* Header — logo */}
      <div className="px-2 pt-1 pb-2 flex items-center gap-1">
        <Link
          href="/agents/internal/admin"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-foreground"
        >
          {LOGO_SVG}
          <span className="truncate text-left text-sm font-semibold tracking-tight">
            An Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="px-2 flex-1 min-h-0 overflow-y-auto -mx-1">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 w-full pl-2 pr-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                  active
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          <span>Back to Admin</span>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  )
}

function AdminSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[260px] bg-tl-background p-0 [&>button]:hidden"
          hideCloseButton
        >
          <SidebarContent onNavigate={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="hidden md:flex h-full w-[200px] flex-shrink-0 flex-col border-r bg-tl-background"
      style={{ borderRightWidth: "0.5px" }}
    >
      <SidebarContent />
    </div>
  )
}

function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const pathname = usePathname() ?? ""
  const title = getPageTitle(pathname)
  const deploymentId = getDeploymentId(pathname)
  const { activeOnly, setActiveOnly } = useActiveFilter()

  return (
    <div
      className="absolute top-0 left-0 right-0 h-10 text-sm z-10 bg-tl-background border-b border-border"
      style={{ borderBottomWidth: "0.5px" }}
    >
      <div className="relative h-full flex items-center justify-between px-2.5">
        {/* Left: menu button (mobile) + label */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="flex h-7 items-center rounded-md px-2.5 text-[12px] font-medium bg-muted/50 text-muted-foreground">
            Admin
          </span>
        </div>

        {/* Center: page title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto">
            {deploymentId ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/agents/internal/admin/deployments"
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                >
                  Deployments
                </Link>
                <span className="text-[13px] text-muted-foreground/50 hidden sm:inline">
                  /
                </span>
                <span className="text-[13px] font-medium text-foreground font-mono">
                  {deploymentId.slice(0, 8)}
                </span>
              </div>
            ) : title ? (
              <span className="text-[13px] font-medium text-foreground">
                {title}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right: active filter toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1 h-7 text-[11px] transition-colors rounded-md border px-2",
              activeOnly
                ? "bg-green-500/10 text-green-600 border-green-500/30"
                : "text-muted-foreground border-border bg-foreground/[0.05] hover:border-foreground/15",
            )}
          >
            <Zap className="h-3 w-3" />
            {activeOnly ? `Active (${MIN_ACTIVE_THREADS}+)` : "All agents"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgentsInternalAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = useIsAdmin()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (!isAdmin) {
    return <NonAdminPlaceholder />
  }

  return (
    <ActiveFilterProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="relative flex min-w-0 flex-1 flex-col h-full bg-tl-background">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex min-w-0 flex-1 flex-col overflow-auto pt-10">
            {children}
          </main>
        </div>
      </div>
    </ActiveFilterProvider>
  )
}
