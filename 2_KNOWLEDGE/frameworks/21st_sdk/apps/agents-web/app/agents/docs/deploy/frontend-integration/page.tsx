import type { Metadata } from "next"
import { FrontendIntegrationContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Frontend Integration",
    description:
      "Add an agent chat to your app with the React SDK.",
    path: "/docs/deploy/frontend-integration",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Deploy & Operate", path: "/docs/deploy/deploy" },
    { name: "Frontend Integration", path: "/docs/deploy/frontend-integration" },
  ]),
]

export const metadata: Metadata = {
  title: "Frontend Integration",
  description:
    "Add an agent chat to your app with the React SDK.",
  alternates: { canonical: "/docs/deploy/frontend-integration" },
  openGraph: {
    title: "Frontend Integration - 21st Agents Docs",
    description:
      "Add an agent chat to your app with the React SDK.",
    url: "/docs/deploy/frontend-integration",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Integration - 21st Agents Docs",
    description:
      "Add an agent chat to your app with the React SDK.",
  },
}

export default function FrontendIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <FrontendIntegrationContent />
    </>
  )
}
