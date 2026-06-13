import type { Metadata } from "next"
import { TemplatesContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Templates",
    description:
      "Pre-built agent templates to get started quickly. Chat apps, form filling, email agents, note takers, and monitoring - ready to deploy.",
    path: "/docs/templates",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Templates", path: "/docs/templates" },
  ]),
]


export const metadata: Metadata = {
  title: "Templates",
  description:
    "Pre-built agent templates to get started quickly. Chat apps, form filling, email agents, note takers, and monitoring - ready to deploy.",
  alternates: { canonical: "/docs/templates" },
  openGraph: {
    title: "Templates - 21st Agents Docs",
    description:
      "Pre-built agent templates to get started quickly. Chat apps, form filling, email agents, note takers, and monitoring - ready to deploy.",
    url: "/docs/templates",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates - 21st Agents Docs",
    description:
      "Pre-built agent templates to get started quickly. Chat apps, form filling, email agents, note takers, and monitoring - ready to deploy.",
  },
}

export default function TemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TemplatesContent />
    </>
  )
}
