import {
  getAllGeneratedDocs,
  getGeneratedDocByPath,
} from "@/lib/agents-docs/generated-markdown"
import { NextRequest } from "next/server"

function normalizePath(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith("/agents/docs")) {
    return trimmed.replace(/^\/an/, "")
  }
  return trimmed
}

function resolveRequestPath(pathParam: string | null, slugParam: string | null) {
  if (pathParam) return normalizePath(pathParam)
  if (!slugParam) return null

  const normalizedSlug = slugParam.trim().replace(/^\/+|\/+$/g, "")
  if (!normalizedSlug || normalizedSlug === "docs") return "/docs"
  if (normalizedSlug.startsWith("docs/")) return `/${normalizedSlug}`

  const knownDocs = getAllGeneratedDocs()
  const bySlug = knownDocs.find((doc) => doc.slug === normalizedSlug)
  if (bySlug) return bySlug.path

  const byPathTail = knownDocs.find(
    (doc) => doc.path.replace(/^\/docs\/?/, "") === normalizedSlug,
  )
  if (byPathTail) return byPathTail.path

  return null
}

export async function GET(request: NextRequest) {
  const pathParam = request.nextUrl.searchParams.get("path")
  const slugParam = request.nextUrl.searchParams.get("slug")
  const requestPath = resolveRequestPath(pathParam, slugParam)
  const allDocs = getAllGeneratedDocs()

  if (allDocs.length === 0) {
    return new Response(
      "No generated markdown docs found. Run pnpm docs:export-markdown first.\n",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    )
  }

  if (!requestPath) {
    const index = allDocs
      .map((d) => `- ${d.path}: ${d.title}`)
      .join("\n")
    return new Response(
      `Missing ?path= parameter. Available pages:\n\n${index}\n`,
      {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    )
  }

  const doc = getGeneratedDocByPath(requestPath)

  if (!doc) {
    return new Response(`Page not found: ${requestPath}\n`, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  return new Response(doc.markdown.trim() + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
