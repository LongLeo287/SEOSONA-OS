import type { Metadata } from "next"
import { ErrorsContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Error Codes",
    description:
      "HTTP status codes, error response format, and machine-readable error codes for the 21st Agents API.",
    path: "/docs/api-reference/errors",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Errors", path: "/docs/api-reference/errors" },
  ]),
]

export const metadata: Metadata = {
  title: "Error Codes",
  description:
    "HTTP status codes, error response format, and machine-readable error codes for the 21st Agents API.",
  alternates: { canonical: "/docs/api-reference/errors" },
  openGraph: {
    title: "Error Codes - 21st Agents Docs",
    description:
      "HTTP status codes and error handling for the 21st Agents API.",
    url: "/docs/api-reference/errors",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Error Codes - 21st Agents Docs",
    description:
      "HTTP status codes and error handling for the 21st Agents API.",
  },
}

export default function ErrorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ErrorsContent />
    </>
  )
}
