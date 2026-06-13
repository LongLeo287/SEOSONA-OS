import type { Metadata } from "next"
import MessagesAndHistoryContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Messages & History",
    description:
      "How message persistence works, lazy loading history, and restoring conversations on mount.",
    path: "/docs/knowledge-base/messages-and-history",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    { name: "Messages & History", path: "/docs/knowledge-base/messages-and-history" },
  ]),
]

export const metadata: Metadata = {
  title: "Messages & History",
  description:
    "How message persistence works, lazy loading history, and restoring conversations on mount.",
  alternates: { canonical: "/docs/knowledge-base/messages-and-history" },
  openGraph: {
    title: "Messages & History - 21st Agents Docs",
    description:
      "How message persistence works, lazy loading history, and restoring conversations on mount.",
    url: "/docs/knowledge-base/messages-and-history",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Messages & History - 21st Agents Docs",
    description:
      "How message persistence works, lazy loading history, and restoring conversations on mount.",
  },
}

export default function MessagesAndHistoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MessagesAndHistoryContent />
    </>
  )
}
