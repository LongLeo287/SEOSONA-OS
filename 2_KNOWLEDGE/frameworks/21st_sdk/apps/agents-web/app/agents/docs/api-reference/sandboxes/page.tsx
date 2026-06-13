import type { Metadata } from "next"
import { SandboxesContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Sandboxes API",
    description:
      "Create, retrieve, and delete sandbox environments. A sandbox is a persistent runtime with its own filesystem, git state, and sessions.",
    path: "/docs/api-reference/sandboxes",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Sandboxes", path: "/docs/api-reference/sandboxes" },
  ]),
]

export const metadata: Metadata = {
  title: "Sandboxes API",
  description:
    "Create, retrieve, and delete sandbox environments. A sandbox is a persistent runtime with its own filesystem, git state, and sessions.",
  alternates: { canonical: "/docs/api-reference/sandboxes" },
  openGraph: {
    title: "Sandboxes API - 21st Agents Docs",
    description:
      "Create, retrieve, and delete sandbox environments for 21st Agents.",
    url: "/docs/api-reference/sandboxes",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandboxes API - 21st Agents Docs",
    description:
      "Create, retrieve, and delete sandbox environments for 21st Agents.",
  },
}

export default function SandboxesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SandboxesContent />
    </>
  )
}
