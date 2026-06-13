import type { Metadata } from "next"
import SandboxesContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Sandboxes & Infrastructure",
    description:
      "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.",
    path: "/docs/knowledge-base/sandboxes",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    { name: "Sandboxes & Infrastructure", path: "/docs/knowledge-base/sandboxes" },
  ]),
]

export const metadata: Metadata = {
  title: "Sandboxes & Infrastructure",
  description:
    "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.",
  alternates: { canonical: "/docs/knowledge-base/sandboxes" },
  openGraph: {
    title: "Sandboxes & Infrastructure - 21st Agents Docs",
    description:
      "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.",
    url: "/docs/knowledge-base/sandboxes",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandboxes & Infrastructure - 21st Agents Docs",
    description:
      "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.",
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
