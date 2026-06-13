import { getGeneratedDocByPath } from "@/lib/agents-docs/generated-markdown"

function resolveDocPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/docs"
  return `/docs/${slug.join("/")}`
}

function toPublicDocsPath(pathname: string): string {
  if (pathname === "/docs") return "/agents/docs"
  if (pathname.startsWith("/docs/")) return `/agents${pathname}`
  return pathname
}

function rewriteDocsLinks(markdown: string): string {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (_match, url: string) => {
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params
  const path = resolveDocPath(slug)
  const doc = getGeneratedDocByPath(path)

  if (!doc) {
    return new Response(`Page not found: ${path}\n`, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const markdown = rewriteDocsLinks(doc.markdown.trim()) + "\n"

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
