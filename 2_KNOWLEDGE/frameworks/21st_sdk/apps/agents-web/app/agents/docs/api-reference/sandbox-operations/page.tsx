import type { Metadata } from "next"
import { SandboxOperationsContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Sandbox Operations API",
    description:
      "Execute commands, read/write files, and clone git repos inside a sandbox environment.",
    path: "/docs/api-reference/sandbox-operations",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Sandbox Operations", path: "/docs/api-reference/sandbox-operations" },
  ]),
]

export const metadata: Metadata = {
  title: "Sandbox Operations API",
  description:
    "Execute commands, read/write files, and clone git repos inside a sandbox environment.",
  alternates: { canonical: "/docs/api-reference/sandbox-operations" },
  openGraph: {
    title: "Sandbox Operations API - 21st Agents Docs",
    description:
      "Execute commands, read/write files, and clone git repos inside a sandbox.",
    url: "/docs/api-reference/sandbox-operations",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandbox Operations API - 21st Agents Docs",
    description:
      "Execute commands, read/write files, and clone git repos inside a sandbox.",
  },
}

export default function SandboxOperationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SandboxOperationsContent />
    </>
  )
}
