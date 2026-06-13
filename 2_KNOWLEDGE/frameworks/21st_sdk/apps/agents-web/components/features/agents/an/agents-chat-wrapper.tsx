"use client"

import { lazy, Suspense } from "react"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"

const DocsAgentSidebar = lazy(() =>
  import("./docs/docs-agent-chat").then((m) => ({
    default: m.DocsAgentSidebar,
  })),
)

/**
 * Renders the AI chat sidebar inline in the agents layout.
 * On docs pages, DocsShell renders its own sidebar.
 */
export function AgentsChatSidebar() {
  const pathname = useAgentsPathname()

  // DocsShell renders its own DocsAgentSidebar
  if (pathname.startsWith("/agents/docs")) return null

  return (
    <Suspense fallback={null}>
      <DocsAgentSidebar />
    </Suspense>
  )
}
