import type { Metadata } from "next"
import { BackendIntegrationContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Backend Integration",
    description:
      "Use agents from your server with the Server SDK.",
    path: "/docs/deploy/backend-integration",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Deploy & Operate", path: "/docs/deploy/deploy" },
    { name: "Backend Integration", path: "/docs/deploy/backend-integration" },
  ]),
]

export const metadata: Metadata = {
  title: "Backend Integration",
  description:
    "Use agents from your server with the Server SDK.",
  alternates: { canonical: "/docs/deploy/backend-integration" },
  openGraph: {
    title: "Backend Integration - 21st Agents Docs",
    description:
      "Use agents from your server with the Server SDK.",
    url: "/docs/deploy/backend-integration",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Integration - 21st Agents Docs",
    description:
      "Use agents from your server with the Server SDK.",
  },
}

export default function BackendIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BackendIntegrationContent />
    </>
  )
}
