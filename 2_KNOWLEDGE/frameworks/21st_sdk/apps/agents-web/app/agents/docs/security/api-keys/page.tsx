import type { Metadata } from "next"
import ApiKeysContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "API Keys & Environment Variables",
    description:
      "How to create, use, and protect API keys and manage environment variables for your agents.",
    path: "/docs/security/api-keys",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Keys", path: "/docs/security/api-keys" },
  ]),
]

export const metadata: Metadata = {
  title: "API Keys & Environment Variables",
  description:
    "How to create, use, and protect API keys and manage environment variables for your agents.",
  alternates: { canonical: "/docs/security/api-keys" },
  openGraph: {
    title: "API Keys & Environment Variables - 21st Agents Docs",
    description:
      "How to create, use, and protect API keys and manage environment variables for your agents.",
    url: "/docs/security/api-keys",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Keys & Environment Variables - 21st Agents Docs",
    description:
      "How to create, use, and protect API keys and manage environment variables for your agents.",
  },
}

export default function ApiKeysPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ApiKeysContent />
    </>
  )
}
