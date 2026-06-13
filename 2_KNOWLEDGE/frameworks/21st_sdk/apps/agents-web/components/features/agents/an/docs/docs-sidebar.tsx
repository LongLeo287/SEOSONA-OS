"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { CaretRightIcon } from "@/components/features/agents/an/docs/icons"
import { DocsCodeLanguageSwitch } from "@/components/features/agents/an/docs/docs-code-language-switch"
import { useSearch } from "@/components/features/agents/an/docs/search-context"
import { Input } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

export type NavItem = {
  title: string
  href: string
  items?: { title: string; href: string }[]
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      { title: "Introduction", href: "/agents/docs" },
      { title: "Try It Out", href: "/agents/docs/try-it-out" },
      { title: "Get Started", href: "/agents/docs/get-started" },
      { title: "Core Concepts", href: "/agents/docs/core-concepts" },
    ],
  },
  {
    label: "Build",
    items: [
      { title: "Agents", href: "/agents/docs/build/agents" },
      { title: "Models", href: "/agents/docs/build/models" },
      { title: "System Prompts", href: "/agents/docs/build/system-prompts" },
      {
        title: "Tools and MCPs",
        href: "/agents/docs/build/tools-and-mcps",
        items: [
          {
            title: "MCP Registry",
            href: "/agents/docs/build/tools-and-mcps/registry",
          },
        ],
      },
      {
        title: "Credential vaults",
        href: "/agents/docs/build/credentials",
        items: [
          {
            title: "Vault resolution",
            href: "/agents/docs/build/credentials/resolution",
          },
          {
            title: "Security & limits",
            href: "/agents/docs/build/credentials/security",
          },
        ],
      },
      { title: "Skills", href: "/agents/docs/build/skills" },
      { title: "Sandbox", href: "/agents/docs/build/sandbox" },
      { title: "Themes", href: "/agents/docs/build/themes" },
    ],
  },
  {
    label: "Deploy & Operate",
    items: [
      { title: "Deploy", href: "/agents/docs/deploy/deploy" },
      { title: "Frontend Integration", href: "/agents/docs/deploy/frontend-integration" },
      { title: "Backend Integration", href: "/agents/docs/deploy/backend-integration" },
      { title: "CLI", href: "/agents/docs/deploy/cli" },
      { title: "Logs", href: "/agents/docs/deploy/logs" },
      { title: "Observability", href: "/agents/docs/deploy/observability" },
    ],
  },
  {
    label: "Security & Access",
    items: [
      { title: "Security", href: "/agents/docs/security/overview" },
      { title: "API Keys & Env Vars", href: "/agents/docs/security/api-keys" },
    ],
  },
  {
    label: "Reference",
    items: [
      { title: "Server SDK", href: "/agents/docs/reference/server" },
    ],
  },
]

// Flat list for backwards compat (search, markdown export, etc.)
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

function isActive(href: string, pathname: string): boolean {
  if (href === "/agents/docs") return pathname === "/agents/docs"
  return pathname === href || pathname.startsWith(href + "/")
}

function SearchTrigger() {
  const { setOpen } = useSearch()

  return (
    <div className="relative">
      <Input
        readOnly
        tabIndex={-1}
        placeholder="Search..."
        onClick={() => setOpen(true)}
        className="w-full rounded-lg text-sm border border-border bg-foreground/[0.04] placeholder:text-muted-foreground/40 h-7 cursor-pointer pr-10 shadow-none"
      />
      <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-[18px] select-none items-center gap-0.5 rounded border border-border/60 bg-muted/40 px-1 font-mono text-[10px] text-muted-foreground/70">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
        K
      </kbd>
    </div>
  )
}

function CollapsibleSection({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <MintlifySection item={item} pathname={pathname} onNavigate={onNavigate} />
  )
}

function MintlifySection({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate?: () => void
}) {
  const isSectionActive =
    isActive(item.href, pathname) ||
    (item.items ?? []).some((sub) => isActive(sub.href, pathname))

  const [open, setOpen] = useState<boolean>(isSectionActive)
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname
      if (isSectionActive) setOpen(true)
    }
  }, [pathname, isSectionActive])

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <div
        className={cn(
          "flex items-center gap-0.5 rounded-md",
          pathname === item.href
            ? ""
            : "hover:bg-foreground/[0.04]",
        )}
      >
        <Link
          href={item.href}
          onClick={onNavigate}
          data-active={pathname === item.href}
          className={cn(
            "an-focus-btn relative z-[1] flex-1 rounded-md px-2 py-1.5 text-sm font-medium",
            pathname === item.href
              ? "text-foreground"
              : "text-foreground/50 dark:text-muted-foreground hover:text-foreground",
          )}
        >
          {item.title}
        </Link>
        <button
          type="button"
          aria-label={open ? "Collapse section" : "Expand section"}
          aria-expanded={open}
          onClick={toggle}
          className="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
        >
          <CaretRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
        </button>
      </div>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-0.5 flex flex-col gap-px pl-4">
          {(item.items ?? []).map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onNavigate}
              data-active={pathname === sub.href}
              className={cn(
                "an-focus-btn relative z-[1] rounded-md px-2 py-1.5 text-sm font-medium",
                pathname === sub.href
                  ? "text-foreground"
                  : "text-foreground/50 dark:text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              {sub.title}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function useActiveIndicator(pathname: string) {
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{
    top: number
    height: number
    opacity: number
  }>({ top: 0, height: 0, opacity: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)

  const updateIndicator = useCallback(() => {
    const nav = navRef.current
    if (!nav) return

    const activeEl = nav.querySelector("[data-active='true']") as HTMLElement | null
    if (!activeEl) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }))
      return
    }

    const navRect = nav.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    setIndicator({
      top: activeRect.top - navRect.top,
      height: activeRect.height,
      opacity: 1,
    })

    if (!hasAnimated) {
      requestAnimationFrame(() => setHasAnimated(true))
    }
  }, [pathname, hasAnimated])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  // Re-measure after collapsible sections animate open/closed
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new MutationObserver(() => {
      requestAnimationFrame(updateIndicator)
    })
    observer.observe(nav, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [updateIndicator])

  return { navRef, indicator, hasAnimated }
}

export function DocsSidebar() {
  const pathname = useAgentsPathname() ?? ""
  const { isMobile, setOpenMobile } = useSidebar()
  const { navRef, indicator, hasAnimated } = useActiveIndicator(pathname)

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-3 py-3">
        <div className="hidden md:flex flex-col gap-2">
          <SearchTrigger />
          <DocsCodeLanguageSwitch />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-1">
        <nav ref={navRef} className="relative flex flex-col gap-px">
          {/* Animated active indicator */}
          <div
            className="absolute left-0 right-0 rounded-md bg-foreground/[0.06] pointer-events-none z-0"
            style={{
              transform: `translateY(${indicator.top}px)`,
              height: indicator.height,
              opacity: indicator.opacity,
              transition: hasAnimated
                ? "transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1), height 250ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 150ms ease"
                : "none",
            }}
          />

          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={cn(gi > 0 && "mt-4")}>
              {group.label && (
                <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-foreground/40 dark:text-muted-foreground/70">
                  {group.label}
                </div>
              )}
              <div className="flex flex-col gap-px">
                {group.items.map((item) =>
                  item.items ? (
                    <CollapsibleSection
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      onNavigate={closeMobile}
                    />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      data-active={isActive(item.href, pathname)}
                      className={cn(
                        "an-focus-btn relative z-[1] rounded-md px-2 py-1.5 text-sm font-medium",
                        isActive(item.href, pathname)
                          ? "text-foreground"
                          : "text-foreground/50 dark:text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Link
          href="/agents/app"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/50 dark:text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
        >
          <span>Open App</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
