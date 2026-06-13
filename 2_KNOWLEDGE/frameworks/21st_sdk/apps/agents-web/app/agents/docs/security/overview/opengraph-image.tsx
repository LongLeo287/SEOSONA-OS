import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Security - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Security",
    description:
      "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.",
    section: "security",
  })
}
