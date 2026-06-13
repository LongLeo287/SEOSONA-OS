import type { Metadata } from "next"
import { ThreadsContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Threads API",
    description:
      "List, create, retrieve, and delete conversation threads within a sandbox.",
    path: "/docs/api-reference/threads",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Threads", path: "/docs/api-reference/threads" },
  ]),
]

export const metadata: Metadata = {
  title: "Threads API",
  description:
    "List, create, retrieve, and delete conversation threads within a sandbox.",
  alternates: { canonical: "/docs/api-reference/threads" },
  openGraph: {
    title: "Threads API - 21st Agents Docs",
    description:
      "Manage conversation threads within sandbox environments.",
    url: "/docs/api-reference/threads",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threads API - 21st Agents Docs",
    description:
      "Manage conversation threads within sandbox environments.",
  },
}

export default function ThreadsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ThreadsContent />
    </>
  )
}
