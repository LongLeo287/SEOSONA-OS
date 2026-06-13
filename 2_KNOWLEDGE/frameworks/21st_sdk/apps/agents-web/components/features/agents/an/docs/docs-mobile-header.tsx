"use client"

import { useState } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { useSearch } from "./search-context"
import { SearchIcon, CaretRightIcon } from "./icons"
import { NAV_ITEMS, NAV_GROUPS, type NavItem } from "./docs-sidebar"
import { API_REF_NAV_ITEMS } from "./api-reference-nav"
import { KB_NAV_ITEMS } from "./knowledge-base-nav"
import { WHATS_NEW_NAV_ITEMS } from "@/lib/agents-docs/whats-new"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

function isActive(href: string, pathname: string): boolean {
  if (href === "/agents/docs") return pathname === "/agents/docs"
  return pathname === href || pathname.startsWith(href + "/")
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/agents/docs/whats-new")) {
    return (
      WHATS_NEW_NAV_ITEMS.find((item) => item.href === pathname)?.title ??
      "What's New"
    )
  }
  for (const item of API_REF_NAV_ITEMS) {
    if (item.href === pathname) return item.title
  }
  for (const item of KB_NAV_ITEMS) {
    if (item.href === pathname) return item.title
  }
  for (const item of NAV_ITEMS) {
    if (item.href === pathname) return item.title
    if (item.items) {
      for (const sub of item.items) {
        if (sub.href === pathname) return sub.title
      }
    }
  }
  return "Docs"
}

function getNavItems(pathname: string): NavItem[] {
  if (pathname.startsWith("/agents/docs/whats-new")) return WHATS_NEW_NAV_ITEMS
  if (pathname.startsWith("/agents/docs/api-reference")) return API_REF_NAV_ITEMS
  if (pathname.startsWith("/agents/docs/knowledge-base")) return KB_NAV_ITEMS
  return NAV_ITEMS
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M2 4h12M2 8h12M2 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MobileCollapsibleSection({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  return (
    <Collapsible
      defaultOpen={isActive(item.href, pathname)}
      className="group/collapsible"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground">
        <span>{item.title}</span>
        <CaretRightIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-0.5 flex flex-col gap-px pl-2">
          {item.items!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onNavigate}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm font-medium",
                pathname === sub.href
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
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

export function DocsMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = useAgentsPathname() ?? ""
  const { setOpen: setSearchOpen } = useSearch()
  const title = getPageTitle(pathname)
  const isMainDocs =
    !pathname.startsWith("/agents/docs/api-reference") &&
    !pathname.startsWith("/agents/docs/knowledge-base") &&
    !pathname.startsWith("/agents/docs/whats-new")

  return (
    <div className="md:hidden">
      {/* Header bar */}
      <header className="sticky top-0 z-40 flex items-center h-12 px-3 gap-1 border-b border-border bg-background/95 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setOpen(!open)}
        >
          <HamburgerIcon />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <button
          type="button"
          className="flex-1 min-w-0 text-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-sm font-medium truncate block">{title}</span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </header>

      {/* Drawer */}
      {open && (
        <div className="border-b border-border bg-background px-3 py-2">
          <nav className="flex flex-col gap-px">
            {isMainDocs ? (
              NAV_GROUPS.map((group, gi) => (
                <div key={gi} className={cn("flex flex-col gap-px", gi > 0 && "mt-3")}>
                  {group.label && (
                    <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) =>
                    item.items ? (
                      <MobileCollapsibleSection
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setOpen(false)}
                      />
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-sm font-medium",
                          isActive(item.href, pathname)
                            ? "bg-foreground/[0.06] text-foreground"
                            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                        )}
                      >
                        {item.title}
                      </Link>
                    ),
                  )}
                </div>
              ))
            ) : (
              getNavItems(pathname).map((item) =>
                item.items ? (
                  <MobileCollapsibleSection
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={() => setOpen(false)}
                  />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-sm font-medium",
                      isActive(item.href, pathname)
                        ? "bg-foreground/[0.06] text-foreground"
                        : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ),
              )
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
