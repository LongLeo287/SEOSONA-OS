import type { Metadata } from "next"
import ObservabilityContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Observability",
    description:
      "Monitor agent activity, track costs and token usage, and identify issues across all your agents.",
    path: "/docs/deploy/observability",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Deploy", path: "/docs/deploy" },
    { name: "Observability", path: "/docs/deploy/observability" },
  ]),
]

export const metadata: Metadata = {
  title: "Observability",
  description:
    "Monitor agent activity, track costs and token usage, and identify issues across all your agents.",
  alternates: { canonical: "/docs/deploy/observability" },
  openGraph: {
    title: "Observability - 21st Agents Docs",
    description:
      "Monitor agent activity, track costs and token usage, and identify issues across all your agents.",
    url: "/docs/deploy/observability",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Observability - 21st Agents Docs",
    description:
      "Monitor agent activity, track costs and token usage, and identify issues across all your agents.",
  },
}

export default function ObservabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ObservabilityContent />
    </>
  )
}
