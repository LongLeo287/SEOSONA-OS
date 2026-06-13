import type { Metadata } from "next"
import { TryItOutContent } from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Try It Out",
    description:
      "Interactive demo of the 21st Agents chat interface with a few example visual styles and live agent interactions.",
    path: "/docs/try-it-out",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Try It Out", path: "/docs/try-it-out" },
  ]),
]


export const metadata: Metadata = {
  title: "Try It Out",
  description:
    "Interactive demo of the 21st Agents chat interface with a few example visual styles and live agent interactions.",
  alternates: { canonical: "/docs/try-it-out" },
  openGraph: {
    title: "Try It Out - 21st Agents Docs",
    description:
      "Interactive demo of the 21st Agents chat interface with a few example visual styles and live agent interactions.",
    url: "/docs/try-it-out",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Try It Out - 21st Agents Docs",
    description:
      "Interactive demo of the 21st Agents chat interface with a few example visual styles and live agent interactions.",
  },
}

export default function TryItOutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TryItOutContent />
    </>
  )
}
