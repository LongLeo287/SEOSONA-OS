import { generateDocsOgImage } from "@/lib/agents-docs/og"

export const runtime = "edge"
export const alt = "Server SDK - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return generateDocsOgImage({
    title: "Server SDK",
    description:
      "Reference for 21st Agents server-side APIs: server SDK methods, token exchange helpers, and session lifecycle patterns.",
    section: "reference",
  })
}
