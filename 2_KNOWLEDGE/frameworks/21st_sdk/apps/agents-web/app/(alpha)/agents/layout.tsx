import "../canvas/canvas-styles.css"
import { getAgentsServerSession } from "@/lib/agents/auth/server"
import { getAgentsSidebarState } from "@/lib/cookies"
import { redirect } from "next/navigation"
import { DashboardLayoutClient } from "./_components/dashboard-layout-client"
import { Agents21stPostHogProvider } from "@/components/providers/agents21st-posthog-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAgentsServerSession()
  if (!session.isAuthenticated) redirect("/agents/app")
  const { sidebarOpen, sidebarWidth } = await getAgentsSidebarState()

  return (
    <Agents21stPostHogProvider>
      <div data-alpha-page className="h-full">
        <DashboardLayoutClient
          initialSidebarOpen={sidebarOpen}
          initialSidebarWidth={sidebarWidth}
        >
          {children}
        </DashboardLayoutClient>
      </div>
    </Agents21stPostHogProvider>
  )
}
