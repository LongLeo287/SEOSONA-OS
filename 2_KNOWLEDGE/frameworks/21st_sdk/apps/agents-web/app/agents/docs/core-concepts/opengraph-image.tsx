import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Core Concepts - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Core Concepts",
    description:
      "Understand the key building blocks of 21st Agents SDK: agents, skills, sandboxes, threads, and the Relay runtime.",
  })
}
