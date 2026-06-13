import type { Metadata } from "next"
import { ChatContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Chat API",
    description:
      "SSE streaming chat endpoint with AI SDK compatibility. Send messages, resume streams, and cancel active requests.",
    path: "/docs/api-reference/chat",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "API Reference", path: "/docs/api-reference" },
    { name: "Chat", path: "/docs/api-reference/chat" },
  ]),
]

export const metadata: Metadata = {
  title: "Chat API",
  description:
    "SSE streaming chat endpoint with AI SDK compatibility. Send messages, resume streams, and cancel active requests.",
  alternates: { canonical: "/docs/api-reference/chat" },
  openGraph: {
    title: "Chat API - 21st Agents Docs",
    description:
      "SSE streaming chat endpoint with AI SDK compatibility.",
    url: "/docs/api-reference/chat",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat API - 21st Agents Docs",
    description:
      "SSE streaming chat endpoint with AI SDK compatibility.",
  },
}

export default function ChatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ChatContent />
    </>
  )
}
