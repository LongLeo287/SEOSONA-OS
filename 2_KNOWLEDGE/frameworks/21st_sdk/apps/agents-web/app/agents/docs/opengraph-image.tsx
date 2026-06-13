import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Introduction - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Introduction",
    description:
      "The easiest way to add AI agents to your product. Configure, deploy, and observe production-grade agents.",
  })
}
