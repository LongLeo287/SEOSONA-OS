import type { Metadata } from "next"
import SecurityContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Security",
    description:
      "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.",
    path: "/docs/security/overview",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Security", path: "/docs/security/overview" },
  ]),
]

export const metadata: Metadata = {
  title: "Security",
  description:
    "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.",
  alternates: { canonical: "/docs/security/overview" },
  openGraph: {
    title: "Security - 21st Agents Docs",
    description:
      "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.",
    url: "/docs/security/overview",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security - 21st Agents Docs",
    description:
      "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.",
  },
}

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SecurityContent />
    </>
  )
}
