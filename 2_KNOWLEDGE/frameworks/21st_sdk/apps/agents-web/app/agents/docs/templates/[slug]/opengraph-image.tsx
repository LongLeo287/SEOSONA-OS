import { generateDocsOgImage } from "@/lib/agents-docs/og"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"

export const runtime = "edge"
export const alt = "Template - 21st Agents SDK Docs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const template = AN_TEMPLATES.find((t) => t.slug === slug)

  const title = template ? `${template.name} Template` : "Template"
  const description = template
    ? `${template.description}. Built with ${template.stack.slice(0, 3).join(", ")}.`
    : ""

  return generateDocsOgImage({
    title,
    description,
    section: "templates",
  })
}
