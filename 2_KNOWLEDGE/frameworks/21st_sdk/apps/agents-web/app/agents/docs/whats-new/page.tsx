import type { Metadata } from "next"
import { WhatsNewIndexContent } from "@/components/features/agents/an/docs/whats-new-page"
import {
  buildBreadcrumbJsonLd,
  buildDocArticleJsonLd,
} from "@/lib/agents-docs/structured-data"
import { WHATS_NEW_OVERVIEW } from "@/lib/agents-docs/whats-new"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "What's New",
    description: WHATS_NEW_OVERVIEW.description,
    path: "/docs/whats-new",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "What's New", path: "/docs/whats-new" },
  ]),
]

export const metadata: Metadata = {
  title: "What's New",
  description: WHATS_NEW_OVERVIEW.description,
  alternates: { canonical: "/docs/whats-new" },
  openGraph: {
    title: "What's New - 21st Agents SDK Docs",
    description: WHATS_NEW_OVERVIEW.description,
    url: "/docs/whats-new",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's New - 21st Agents SDK Docs",
    description: WHATS_NEW_OVERVIEW.description,
  },
}

export default function WhatsNewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <WhatsNewIndexContent />
    </>
  )
}
