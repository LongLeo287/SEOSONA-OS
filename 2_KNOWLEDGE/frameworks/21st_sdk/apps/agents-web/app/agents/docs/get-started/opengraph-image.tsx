import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Get Started - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Get Started",
    description:
      "Create an agent, deploy it, and add it to your Next.js app. Full step-by-step guide with code examples.",
  })
}
