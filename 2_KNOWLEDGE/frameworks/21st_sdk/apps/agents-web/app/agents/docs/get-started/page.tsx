import type { Metadata } from "next"
import { GetStartedContent } from "./content"
import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Get Started",
    description:
      "Create an agent, deploy it, and connect from Next.js, Python, or Go. Full step-by-step guide with code examples.",
    path: "/docs/get-started",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Get Started", path: "/docs/get-started" },
  ]),
]


export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Create an agent, deploy it, and connect from Next.js, Python, or Go. Full step-by-step guide with code examples.",
  alternates: { canonical: "/docs/get-started" },
  openGraph: {
    title: "Get Started - 21st Agents SDK Docs",
    description:
      "Create an agent, deploy it, and connect from Next.js, Python, or Go. Full step-by-step guide with code examples.",
    url: "/docs/get-started",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started - 21st Agents SDK Docs",
    description:
      "Create an agent, deploy it, and connect from Next.js, Python, or Go. Full step-by-step guide with code examples.",
  },
}

export default async function GetStartedPage({
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
      <GetStartedContent lang={lang} />
    </>
  )
}
