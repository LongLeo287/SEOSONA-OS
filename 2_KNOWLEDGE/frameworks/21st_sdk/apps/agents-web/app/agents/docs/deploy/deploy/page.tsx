import type { Metadata } from "next"
import { AgentProjectsContent } from "./content"
import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Deploy",
    description:
      "CLI commands, deploy pipeline, redeploying, and what lives where.",
    path: "/docs/deploy/deploy",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Deploy", path: "/docs/deploy" },
    { name: "Deploy", path: "/docs/deploy/deploy" },
  ]),
]


export const metadata: Metadata = {
  title: "Deploy",
  description:
    "CLI commands, deploy pipeline, redeploying, and what lives where.",
  alternates: { canonical: "/docs/deploy/deploy" },
  openGraph: {
    title: "Deploy - 21st Agents Docs",
    description:
      "CLI commands, deploy pipeline, redeploying, and what lives where.",
    url: "/docs/deploy/deploy",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deploy - 21st Agents Docs",
    description:
      "CLI commands, deploy pipeline, redeploying, and what lives where.",
  },
}

export default async function AgentProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const lang = getDocsLang(await searchParams)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AgentProjectsContent lang={lang} />
    </>
  )
}
