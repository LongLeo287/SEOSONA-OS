import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "API Reference - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "API Reference",
    description:
      "Complete API reference for 21st Agents. REST endpoints, SSE streaming, authentication, and SDK integration.",
  section: "reference",
  })
}
