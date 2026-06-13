import type { Metadata } from "next"
import { ApiReferenceContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "API Reference",
    description:
      "Complete API reference for 21st Agents. REST endpoints, SSE streaming, authentication, and SDK integration.",
    path: "/docs/api-reference",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
  ]),
]

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "Complete API reference for 21st Agents. REST endpoints, SSE streaming, authentication, and SDK integration.",
  alternates: { canonical: "/docs/api-reference" },
  openGraph: {
    title: "API Reference - 21st Agents Docs",
    description:
      "Complete API reference for 21st Agents. REST endpoints, SSE streaming, authentication, and SDK integration.",
    url: "/docs/api-reference",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Reference - 21st Agents Docs",
    description:
      "Complete API reference for 21st Agents. REST endpoints, SSE streaming, authentication, and SDK integration.",
  },
}

export default function ApiReferencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ApiReferenceContent />
    </>
  )
}
