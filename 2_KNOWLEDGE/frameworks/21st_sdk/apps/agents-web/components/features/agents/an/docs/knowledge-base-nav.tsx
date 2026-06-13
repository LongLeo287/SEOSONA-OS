"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { cn } from "@/lib/utils"

export const KB_NAV_ITEMS = [
  { title: "Overview", href: "/agents/docs/knowledge-base" },
  { title: "Claude Code", href: "/agents/docs/knowledge-base/claude-code-agent" },
  { title: "Models", href: "/agents/docs/knowledge-base/models-and-providers" },
  { title: "Messages", href: "/agents/docs/knowledge-base/messages-and-history" },
  { title: "Sandboxes", href: "/agents/docs/knowledge-base/sandboxes" },
  { title: "Troubleshooting", href: "/agents/docs/knowledge-base/troubleshooting" },
  { title: "Best Practices", href: "/agents/docs/knowledge-base/best-practices" },
]

export function KnowledgeBaseNav() {
  const pathname = useAgentsPathname() ?? ""

  return (
    <nav className="hidden md:flex flex-col gap-px w-[200px] shrink-0 sticky top-0 px-1 pt-6 pb-10 overflow-y-auto max-h-[calc(100svh-var(--agents-header-h,96px))]">
      {KB_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium",
            pathname === item.href
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
