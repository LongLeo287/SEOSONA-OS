import type { Metadata } from "next"
import { AgentsLanding } from "./page.client"
import { buildSearchIndex } from "@/lib/agents-docs/search"

export const metadata: Metadata = {
  title: "21st — Ship agents to production",
  description:
    "The infrastructure platform for CLI-based AI agents. Sandboxing, credentials, UI, and observability — out of the box.",
  openGraph: {
    title: "21st — Ship agents to production",
    description:
      "The infrastructure platform for CLI-based AI agents. Sandboxing, credentials, UI, and observability — out of the box.",
    url: "https://21st.dev/agents",
    siteName: "21st.dev",
    type: "website",
    images: [
      {
        url: "/opengraph-an.png",
        width: 1200,
        height: 630,
        alt: "21st — Ship agents to production",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "21st — Ship agents to production",
    description:
      "The infrastructure platform for CLI-based AI agents. Sandboxing, credentials, UI, and observability — out of the box.",
    images: ["/opengraph-an.png"],
  },
}

export default function AnPage() {
  const searchIndex = buildSearchIndex()
  return <AgentsLanding searchIndex={searchIndex} />
}
