"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { getTabForPath, findBreadcrumbTrail, getSdkOverviewHref } from "@/lib/agents-docs/manifest"
import { useFramework } from "@/lib/agents-docs/framework-context"

export function Breadcrumb() {
  const pathname = useAgentsPathname()
  const { framework } = useFramework()
  const tab = getTabForPath(pathname)
  const trail = findBreadcrumbTrail(pathname, tab.items)

  if (trail.length === 0) return null

  const crumbs = [
    {
      title: tab.title,
      href: tab.title === "Reference" ? getSdkOverviewHref(framework) : "/agents/docs",
    },
    ...trail,
  ]

  return (
    <nav className="mb-6 flex items-center gap-2 text-[13px]">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-muted-foreground">/</span>
            )}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-muted-foreground"
              >
                {crumb.title}
              </Link>
            ) : (
              <span className={isLast ? "text-muted-foreground" : "text-muted-foreground"}>
                {crumb.title}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
