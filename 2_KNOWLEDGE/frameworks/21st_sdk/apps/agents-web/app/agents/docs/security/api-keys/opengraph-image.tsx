import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "API Keys & Environment Variables - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "API Keys & Environment Variables",
    description:
      "How to create, use, and protect API keys and manage environment variables for your agents.",
    section: "security",
  })
}
