import type { Metadata } from "next"
import KnowledgeBaseContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Knowledge Base - Introduction",
    description:
      "Common questions, architecture details, and practical guidance for building agents with 21st SDK.",
    path: "/docs/knowledge-base",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
  ]),
]

export const metadata: Metadata = {
  title: "Knowledge Base - Introduction",
  description:
    "Common questions, architecture details, and practical guidance for building agents with 21st SDK.",
  alternates: { canonical: "/docs/knowledge-base" },
  openGraph: {
    title: "Knowledge Base - Introduction - 21st Agents Docs",
    description:
      "Common questions, architecture details, and practical guidance for building agents with 21st SDK.",
    url: "/docs/knowledge-base",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowledge Base - Introduction - 21st Agents Docs",
    description:
      "Common questions, architecture details, and practical guidance for building agents with 21st SDK.",
  },
}

export default function KnowledgeBasePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <KnowledgeBaseContent />
    </>
  )
}
