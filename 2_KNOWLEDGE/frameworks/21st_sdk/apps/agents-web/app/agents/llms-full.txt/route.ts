import fs from "fs"
import path from "path"

export async function GET() {
  const allMarkdownFile = path.join(
    process.cwd(),
    "public",
    "an-docs-markdown",
    "all.md",
  )

  let content: string | null = null
  if (fs.existsSync(allMarkdownFile)) {
    try {
      content = fs.readFileSync(allMarkdownFile, "utf-8")
    } catch {
      content = null
    }
  }

  if (!content) {
    return new Response(
      "No generated all.md found. Run pnpm docs:export-markdown first.\n",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    )
  }

  return new Response(content.trimEnd() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
