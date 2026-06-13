import {
  buildBreadcrumbJsonLd,
  buildDocArticleJsonLd,
} from "@/lib/agents-docs/structured-data"
import type { Metadata } from "next"
import DocsIntroductionContent from "./content"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "21st Agents SDK Docs - Agent Infrastructure",
    description:
      "The easiest way to add AI agents to your product. Skip months of infrastructure work - configure, deploy, and observe production-grade agents with a beautiful built-in UI.",
    path: "/docs",
  }),
  buildBreadcrumbJsonLd([{ name: "Docs", path: "/docs" }]),
]


export const metadata: Metadata = {
  title: "Introduction",
  description:
    "The easiest way to add AI agents to your product. Skip months of infrastructure work - configure, deploy, and observe production-grade agents with a beautiful built-in UI.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Introduction - 21st Agents SDK Docs",
    description:
      "The easiest way to add AI agents to your product. Configure, deploy, and observe production-grade agents with a beautiful built-in UI.",
    url: "/docs",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "21st Agents SDK Docs - Agent Infrastructure",
    description:
      "The easiest way to add AI agents to your product. Configure, deploy, and observe production-grade agents with a beautiful built-in UI.",
  },
}

export default function DocsIntroductionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <DocsIntroductionContent />
    </>
  )
}
