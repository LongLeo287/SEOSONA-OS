import type { Metadata } from "next"
import { AgentsHeader } from "@/components/features/agents/an/agents-header"
import { AgentsChatSidebar } from "@/components/features/agents/an/agents-chat-wrapper"
import { Agents21stPostHogProvider } from "@/components/providers/agents21st-posthog-provider"

export const metadata: Metadata = {
  title: {
    default: "21st",
    template: "%s — 21st",
  },
  icons: {
    icon: "/favicon-an.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "21st — The fastest way to add an AI agent to your app",
    description:
      "Built-in UI, chat history, spend limits, sandbox management, and observability.",
    images: [
      {
        url: "/opengraph-an.png",
        width: 1200,
        height: 630,
        alt: "21st — The fastest way to add an AI agent to your app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "21st — The fastest way to add an AI agent to your app",
    description:
      "Built-in UI, chat history, spend limits, sandbox management, and observability.",
    images: ["/opengraph-an.png"],
  },
}

export default function AnLayout({ children }: { children: React.ReactNode }) {
  return (
    <Agents21stPostHogProvider>
      <main className="an-theme flex flex-col h-svh bg-background">
        <AgentsHeader />
        <div className="flex min-h-0 flex-1">
          <div className="flex-1 min-w-0 overflow-auto">
            {children}
          </div>
          <AgentsChatSidebar />
        </div>
      </main>
    </Agents21stPostHogProvider>
  )
}
