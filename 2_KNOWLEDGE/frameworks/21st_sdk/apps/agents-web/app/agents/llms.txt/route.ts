import { getAllGeneratedDocs } from "@/lib/agents-docs/generated-markdown"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

function toPublicDocsPath(pathname: string): string {
  if (pathname === "/docs") return "/agents/docs"
  if (pathname.startsWith("/docs/")) return `/agents${pathname}`
  return pathname
}

function rewriteDocsLinks(text: string): string {
  return text.replace(/\]\(([^)\s]+)\)/g, (_match, url: string) => {
    const value = url.trim()
    if (!value) return `](${url})`

    try {
      if (value.startsWith("/")) {
        const parsed = new URL(value, "https://21st.dev")
        const rewrittenPath = toPublicDocsPath(parsed.pathname)
        if (rewrittenPath === parsed.pathname) return `](${url})`
        return `](${rewrittenPath}${parsed.search}${parsed.hash})`
      }

      const parsed = new URL(value)
      const isInternalDocsHost =
        parsed.hostname === "an.dev" ||
        parsed.hostname === "www.an.dev" ||
        parsed.hostname === "21st.dev" ||
        parsed.hostname === "www.21st.dev"
      if (!isInternalDocsHost) return `](${url})`

      const rewrittenPath = toPublicDocsPath(parsed.pathname)
      if (rewrittenPath === parsed.pathname) return `](${url})`
      return `](${rewrittenPath}${parsed.search}${parsed.hash})`
    } catch {
      return `](${url})`
    }
  })
}

export async function GET() {
  const docs = getAllGeneratedDocs()

  if (docs.length === 0) {
    return new Response(
      "No generated markdown docs found. Run pnpm docs:export-markdown first.\n",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    )
  }

  const sections: Record<string, typeof docs> = {}
  for (const doc of docs) {
    if (!sections[doc.section]) sections[doc.section] = []
    sections[doc.section]!.push(doc)
  }

  let content = `# 21st Agents Documentation

> 21st Agents is agent infrastructure for shipping AI agents inside your product. Configure, deploy, and observe production-grade agents with a beautiful built-in UI. Works with Claude Code and OpenAI Codex runtimes.

21st Agents provides: agent-as-a-service runtime, SSE streaming, E2B sandboxed execution, tool orchestration, visual theme presets (Notion / Cursor / Minimal), skills system for on-demand context, a logs dashboard for debugging, and per-dialog cost tracking.

`

  for (const [section, pages] of Object.entries(sections)) {
    content += `## ${section}\n\n`
    for (const page of pages) {
      const publicPath = toPublicDocsPath(page.path)
      const description = rewriteDocsLinks(page.description)
      content += `- [${page.title}](${BASE_URL}${publicPath}): ${description}\n`
    }
    content += "\n"
  }

  content += `## OpenAPI Specs\n\n`
  content += `- [openapi](${BASE_URL}/agents/openapi.json)\n`

  return new Response(content.trimEnd() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
