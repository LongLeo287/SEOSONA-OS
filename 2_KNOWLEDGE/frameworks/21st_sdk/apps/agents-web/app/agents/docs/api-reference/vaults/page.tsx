import type { Metadata } from "next"
import { VaultsContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const DESCRIPTION =
  "REST API for managing credential vaults and credentials. Create, list, update, archive, and delete vaults; add bearer or OAuth credentials per MCP server URL; set a default vault; archive and hard-delete."

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Vaults API",
    description: DESCRIPTION,
    path: "/docs/api-reference/vaults",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Vaults", path: "/docs/api-reference/vaults" },
  ]),
]

export const metadata: Metadata = {
  title: "Vaults API",
  description: DESCRIPTION,
  alternates: { canonical: "/docs/api-reference/vaults" },
  openGraph: {
    title: "Vaults API - 21st Agents Docs",
    description: DESCRIPTION,
    url: "/docs/api-reference/vaults",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaults API - 21st Agents Docs",
    description: DESCRIPTION,
  },
}

export default function VaultsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <VaultsContent />
    </>
  )
}
