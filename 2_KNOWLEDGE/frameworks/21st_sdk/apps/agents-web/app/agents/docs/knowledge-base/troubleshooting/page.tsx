import type { Metadata } from "next"
import TroubleshootingContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Troubleshooting",
    description:
      "Solutions for auth issues, tool permission errors, and common agent problems.",
    path: "/docs/knowledge-base/troubleshooting",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    { name: "Troubleshooting", path: "/docs/knowledge-base/troubleshooting" },
  ]),
]

export const metadata: Metadata = {
  title: "Troubleshooting",
  description:
    "Solutions for auth issues, tool permission errors, and common agent problems.",
  alternates: { canonical: "/docs/knowledge-base/troubleshooting" },
  openGraph: {
    title: "Troubleshooting - 21st Agents Docs",
    description:
      "Solutions for auth issues, tool permission errors, and common agent problems.",
    url: "/docs/knowledge-base/troubleshooting",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troubleshooting - 21st Agents Docs",
    description:
      "Solutions for auth issues, tool permission errors, and common agent problems.",
  },
}

export default function TroubleshootingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TroubleshootingContent />
    </>
  )
}
