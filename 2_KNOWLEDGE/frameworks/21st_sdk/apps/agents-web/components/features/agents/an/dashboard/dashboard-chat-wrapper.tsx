"use client"

import { lazy, Suspense } from "react"

const DocsAgentSidebar = lazy(() =>
  import("../docs/docs-agent-chat").then((m) => ({
    default: m.DocsAgentSidebar,
  })),
)

/**
 * Always mounted so ResizableSidebar can animate open/close.
 * When closed, ResizableSidebar renders with width 0.
 */
export function DashboardChatSidebar() {
  return (
    <Suspense fallback={null}>
      <DocsAgentSidebar />
    </Suspense>
  )
}
