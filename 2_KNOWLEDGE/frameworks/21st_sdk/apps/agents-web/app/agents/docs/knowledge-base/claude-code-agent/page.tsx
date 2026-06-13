import type { Metadata } from "next"
import ClaudeCodeAgentContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Build an Agent on Claude Code",
    description:
      "Learn how to build, deploy, and embed a production AI agent powered by Claude Code using 21st SDK - with sandboxing, streaming, custom tools, and React UI.",
    path: "/docs/knowledge-base/claude-code-agent",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    { name: "Claude Code Agent", path: "/docs/knowledge-base/claude-code-agent" },
  ]),
]

export const metadata: Metadata = {
  title: "Build an Agent on Claude Code - 21st Agents SDK",
  description:
    "Learn how to build, deploy, and embed a production AI agent powered by Claude Code using 21st SDK - with sandboxing, streaming, custom tools, and React UI.",
  keywords: [
    "claude code agent",
    "build agent claude code",
    "ai agent claude code",
    "claude code sdk",
    "anthropic agent sdk",
    "claude code api",
    "deploy claude code agent",
    "claude code headless",
    "claude code sandbox",
    "ai coding agent",
    "production ai agent",
    "claude agent framework",
    "21st SDK",
    "agent infrastructure",
  ],
  alternates: { canonical: "/docs/knowledge-base/claude-code-agent" },
  openGraph: {
    title: "Build an Agent on Claude Code - 21st Agents SDK Docs",
    description:
      "Learn how to build, deploy, and embed a production AI agent powered by Claude Code using 21st SDK - with sandboxing, streaming, custom tools, and React UI.",
    url: "/docs/knowledge-base/claude-code-agent",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build an Agent on Claude Code - 21st Agents SDK Docs",
    description:
      "Learn how to build, deploy, and embed a production AI agent powered by Claude Code using 21st SDK - with sandboxing, streaming, custom tools, and React UI.",
  },
}

export default function ClaudeCodeAgentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ClaudeCodeAgentContent />
    </>
  )
}
