import { MetadataRoute } from "next"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"
import { WHATS_NEW_ENTRIES } from "@/lib/agents-docs/whats-new"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

const AGENTS_DOCS_PAGES = [
  { path: "/agents/docs", priority: 1.0, changeFrequency: "weekly" as const },
  // Get Started
  { path: "/agents/docs/try-it-out", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/agents/docs/get-started", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/core-concepts", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/whats-new", priority: 0.8, changeFrequency: "weekly" as const },
  // Build
  { path: "/agents/docs/build/agents", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/build/system-prompts", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/build/tools-and-mcps", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/build/skills", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/build/sandbox", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/build/themes", priority: 0.8, changeFrequency: "weekly" as const },
  // Deploy & Operate
  { path: "/agents/docs/deploy/deploy", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/deploy/frontend-integration", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/deploy/backend-integration", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/deploy/cli", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/deploy/logs", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/agents/docs/deploy/observability", priority: 0.8, changeFrequency: "weekly" as const },
  // Security & Access
  { path: "/agents/docs/security/overview", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/agents/docs/security/api-keys", priority: 0.8, changeFrequency: "weekly" as const },
  // Reference
  { path: "/agents/docs/reference/server", priority: 0.8, changeFrequency: "weekly" as const },
  // API Reference
  { path: "/agents/docs/api-reference", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/api-reference/sandboxes", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/api-reference/sandbox-operations", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/api-reference/threads", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/api-reference/chat", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/agents/docs/api-reference/errors", priority: 0.8, changeFrequency: "weekly" as const },
  // Knowledge Base
  { path: "/agents/docs/knowledge-base", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/agents/docs/knowledge-base/messages-and-history", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/agents/docs/knowledge-base/sandboxes", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/agents/docs/knowledge-base/troubleshooting", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/agents/docs/knowledge-base/best-practices", priority: 0.7, changeFrequency: "weekly" as const },
  // Templates
  { path: "/agents/docs/templates", priority: 0.8, changeFrequency: "weekly" as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Template detail pages from constants
  const templatePages = AN_TEMPLATES.map((t) => ({
    url: `${BASE_URL}/agents/docs/templates/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const whatsNewPages = WHATS_NEW_ENTRIES.map((entry) => ({
    url: `${BASE_URL}/agents/docs/whats-new/${entry.slug}`,
    lastModified: entry.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: `${BASE_URL}/agents`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...AGENTS_DOCS_PAGES.map((page) => ({
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...whatsNewPages,
    ...templatePages,
  ]
}
