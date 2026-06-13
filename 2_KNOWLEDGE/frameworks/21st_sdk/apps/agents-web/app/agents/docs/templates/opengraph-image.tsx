import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Templates - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Templates",
    description:
      "Pre-built agent templates to get started quickly. Chat apps, form filling, email agents, note takers, and monitoring.",
  section: "templates",
  })
}
