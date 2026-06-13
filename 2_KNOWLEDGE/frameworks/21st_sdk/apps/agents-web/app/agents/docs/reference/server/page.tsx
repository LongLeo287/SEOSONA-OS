import type { Metadata } from "next"
import { ServerSdkContent } from "./content"
import {
  buildBreadcrumbJsonLd,
  buildDocArticleJsonLd,
} from "@/lib/agents-docs/structured-data"

const DESCRIPTION =
  "Reference for 21st Agents server-side APIs: TypeScript, Python, and Go SDK methods, sandbox and thread operations, token exchange helpers, and session patterns."

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Server SDK",
    description: DESCRIPTION,
    path: "/docs/reference/server",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Reference", path: "/docs/reference/server" },
    { name: "Server SDK", path: "/docs/reference/server" },
  ]),
]


export const metadata: Metadata = {
  title: "Server SDK",
  description: DESCRIPTION,
  alternates: { canonical: "/docs/reference/server" },
  openGraph: {
    title: "Server SDK - 21st Agents Docs",
    description: DESCRIPTION,
    url: "/docs/reference/server",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Server SDK - 21st Agents Docs",
    description: DESCRIPTION,
  },
}

export default function ServerSdkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ServerSdkContent />
    </>
  )
}
