import type { Metadata } from "next"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"
import { TemplateDetailContent } from "./content"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return AN_TEMPLATES.map((t) => ({ slug: t.slug }))
}

function buildDescription(template: (typeof AN_TEMPLATES)[number]) {
  return `${template.description}. Built with ${template.stack.slice(0, 3).join(", ")}. Clone, deploy, and integrate into your app with 21st Agents SDK.`
}

function buildJsonLd(template: (typeof AN_TEMPLATES)[number]) {
  const title = `${template.name} Template`
  const description = buildDescription(template)
  const path = `/docs/templates/${template.slug}`

  return [
    buildDocArticleJsonLd({ title, description, path }),
    buildBreadcrumbJsonLd([
      { name: "Docs", path: "/docs" },
      { name: "Templates", path: "/docs/templates" },
      { name: template.name, path },
    ]),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const template = AN_TEMPLATES.find((t) => t.slug === slug)
  if (!template) {
    return { title: "Template Not Found" }
  }

  const title = `${template.name} Template`
  const description = buildDescription(template)
  const path = `/docs/templates/${slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} - 21st Agents Docs`,
      description,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 21st Agents Docs`,
      description,
    },
  }
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params
  const template = AN_TEMPLATES.find((t) => t.slug === slug)

  return (
    <>
      {template && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(template)).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <TemplateDetailContent />
    </>
  )
}
