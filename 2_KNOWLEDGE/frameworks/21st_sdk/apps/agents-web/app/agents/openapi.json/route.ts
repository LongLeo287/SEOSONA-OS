import fs from "fs"
import path from "path"

export async function GET() {
  const specPath = path.join(process.cwd(), "public", "agents-openapi.json")

  let content: string | null = null
  try {
    content = fs.readFileSync(specPath, "utf-8")
  } catch {
    return new Response("OpenAPI spec not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    })
  }

  return new Response(content, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
