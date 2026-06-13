import type { Metadata } from "next"
import BestPracticesContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Best Practices",
    description:
      "Optimizing cost, choosing between skills and system prompts, and security considerations.",
    path: "/docs/knowledge-base/best-practices",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    { name: "Best Practices", path: "/docs/knowledge-base/best-practices" },
  ]),
]

export const metadata: Metadata = {
  title: "Best Practices",
  description:
    "Optimizing cost, choosing between skills and system prompts, and security considerations.",
  alternates: { canonical: "/docs/knowledge-base/best-practices" },
  openGraph: {
    title: "Best Practices - 21st Agents Docs",
    description:
      "Optimizing cost, choosing between skills and system prompts, and security considerations.",
    url: "/docs/knowledge-base/best-practices",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Practices - 21st Agents Docs",
    description:
      "Optimizing cost, choosing between skills and system prompts, and security considerations.",
  },
}

export default function BestPracticesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BestPracticesContent />
    </>
  )
}
