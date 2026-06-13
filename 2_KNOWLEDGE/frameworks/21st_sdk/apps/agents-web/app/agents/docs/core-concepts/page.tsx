import type { Metadata } from "next"
import CoreConceptsContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Core Concepts",
    description:
      "Understand the key building blocks of 21st Agents SDK: agents, skills, sandboxes, threads, and the Relay runtime.",
    path: "/docs/core-concepts",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Core Concepts", path: "/docs/core-concepts" },
  ]),
]


export const metadata: Metadata = {
  title: "Core Concepts",
  description:
    "Understand the key building blocks of 21st Agents SDK: agents, skills, sandboxes, threads, and the Relay runtime.",
  alternates: { canonical: "/docs/core-concepts" },
  openGraph: {
    title: "Core Concepts - 21st Agents SDK Docs",
    description:
      "Understand the key building blocks of 21st Agents SDK: agents, skills, sandboxes, threads, and the Relay runtime.",
    url: "/docs/core-concepts",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Concepts - 21st Agents SDK Docs",
    description:
      "Understand the key building blocks of 21st Agents SDK: agents, skills, sandboxes, threads, and the Relay runtime.",
  },
}

export default function CoreConceptsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CoreConceptsContent />
    </>
  )
}
