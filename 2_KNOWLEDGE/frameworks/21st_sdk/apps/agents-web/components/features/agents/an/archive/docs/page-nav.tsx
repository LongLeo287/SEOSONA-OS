"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import {
  getTabForPath,
  flattenItems,
  sdkOverview,
  sdkReferenceItems,
  uiComponentsOverview,
  uiComponentsItems,
  backendApiOverview,
  backendApiItems,
} from "@/lib/agents-docs/manifest"
import { useFramework } from "@/lib/agents-docs/framework-context"
import { CaretRightIcon } from "./icons"

export function PageNav() {
  const pathname = useAgentsPathname()
  const { framework } = useFramework()
  const tab = getTabForPath(pathname)

  let pages
  if (tab.title === "Reference") {
    // Scope prev/next to current framework's SDK pages + shared pages
    pages = [
      sdkOverview[framework],
      ...flattenItems(sdkReferenceItems[framework]),
      uiComponentsOverview,
      ...flattenItems(uiComponentsItems),
      backendApiOverview,
      ...flattenItems(backendApiItems),
    ].filter((p) => p.href)
  } else {
    pages = flattenItems(tab.items)
  }

  const idx = pages.findIndex((p) => p.href === pathname)
  const prev = idx > 0 ? pages[idx - 1] : null
  const next = idx < pages.length - 1 ? pages[idx + 1] : null

  if (!prev && !next) return null

  return (
    <div className="mt-16 grid grid-cols-2 gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href!}
          className="group flex flex-col gap-1.5 rounded-xl border border-border bg-secondary px-4 py-3.5 transition-all hover:border-border hover:bg-accent"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CaretRightIcon className="h-3 w-3 rotate-180" />
            Previous
          </span>
          <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href!}
          className="group flex flex-col items-end gap-1.5 rounded-xl border border-border bg-secondary px-4 py-3.5 transition-all hover:border-border hover:bg-accent"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            Next
            <CaretRightIcon className="h-3 w-3" />
          </span>
          <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
