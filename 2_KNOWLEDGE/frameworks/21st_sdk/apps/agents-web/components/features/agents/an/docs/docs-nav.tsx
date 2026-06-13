"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { CaretRightIcon } from "@/components/features/agents/an/docs/icons"
import { DocsCodeLanguageSwitch } from "@/components/features/agents/an/docs/docs-code-language-switch"
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { NAV_GROUPS, type NavItem } from "./docs-sidebar"

function isActive(href: string, pathname: string): boolean {
  if (href === "/agents/docs") return pathname === "/agents/docs"
  return pathname === href || pathname.startsWith(href + "/")
}

function CollapsibleSection({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
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
      <div className="flex items-center gap-0.5 rounded-md">
        <Link
          href={item.href}
          data-active={pathname === item.href}
          className={cn(
            "an-focus-btn relative z-[1] flex-1 rounded-md px-2 py-1.5 text-sm font-medium",
            pathname === item.href
              ? "bg-foreground/[0.06] text-foreground"
              : "text-foreground/50 dark:text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
          )}
        >
          {item.title}
        </Link>
        <button
          type="button"
          aria-label={open ? "Collapse section" : "Expand section"}
          aria-expanded={open}
          onClick={toggle}
          className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
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
              className={cn(
                "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium",
                pathname === sub.href
                  ? "bg-foreground/[0.06] text-foreground"
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

export function DocsNav() {
  const pathname = useAgentsPathname() ?? ""

  return (
    <nav className="hidden md:flex flex-col gap-px w-[200px] shrink-0 sticky top-0 px-1 pt-6 pb-10 overflow-y-auto max-h-[calc(100svh-var(--agents-header-h,96px))]">
      <div className="mb-3">
        <DocsCodeLanguageSwitch />
      </div>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className={cn("flex flex-col gap-px", gi > 0 && "mt-4")}>
          {group.label && (
            <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-foreground/40 dark:text-muted-foreground/50">
              {group.label}
            </div>
          )}
          {group.items.map((item) =>
            item.items ? (
              <CollapsibleSection
                key={item.href}
                item={item}
                pathname={pathname}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium",
                  isActive(item.href, pathname)
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-foreground/50 dark:text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            ),
          )}
        </div>
      ))}
    </nav>
  )
}
