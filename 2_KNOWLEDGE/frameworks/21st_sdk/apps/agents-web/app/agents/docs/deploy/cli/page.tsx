import type { Metadata } from "next"
import CliContent from "./content"
import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "CLI",
    description:
      "Use @21st-sdk/cli to authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.",
    path: "/docs/deploy/cli",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Deploy", path: "/docs/deploy" },
    { name: "CLI", path: "/docs/deploy/cli" },
  ]),
]

export const metadata: Metadata = {
  title: "CLI",
  description:
    "Use @21st-sdk/cli to authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.",
  alternates: { canonical: "/docs/deploy/cli" },
  openGraph: {
    title: "CLI - 21st Agents Docs",
    description:
      "Authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.",
    url: "/docs/deploy/cli",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLI - 21st Agents Docs",
    description:
      "Authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.",
  },
}

export default async function CliPage({
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
      <CliContent lang={lang} />
    </>
  )
}
