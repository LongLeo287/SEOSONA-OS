import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Observability - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Observability",
    description:
      "Monitor agent activity, track costs and token usage, and identify issues across all your agents.",
  })
}
