import type { Metadata } from "next"
import { DocsShell } from "@/components/features/agents/an/docs/docs-shell"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "21st Agents SDK Docs",
    template: "%s - 21st Agents SDK Docs",
  },
  description:
    "Documentation for 21st Agents SDK - the easiest way to add AI agents to your product. Configure, deploy, and observe production-grade agents with a beautiful built-in UI.",
  openGraph: {
    title: "21st Agents SDK Docs - Agent Infrastructure Documentation",
    description:
      "Configure, deploy, and observe production-grade AI agents with a beautiful built-in UI.",
    type: "website",
    siteName: "21st Agents SDK",
  },
  twitter: {
    card: "summary_large_image",
    title: "21st Agents SDK Docs - Agent Infrastructure Documentation",
    description:
      "Configure, deploy, and observe production-grade AI agents with a beautiful built-in UI.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AnDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link
        rel="help"
        type="text/plain"
        href="/agents/llms.txt"
        title="LLM Documentation"
      />
      <DocsShell>{children}</DocsShell>
    </>
  )
}
