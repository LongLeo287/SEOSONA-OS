import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WhatsNewEntryContent } from "@/components/features/agents/an/docs/whats-new-page"
import {
  buildBreadcrumbJsonLd,
  buildDocArticleJsonLd,
} from "@/lib/agents-docs/structured-data"
import {
  getWhatsNewEntry,
  WHATS_NEW_ENTRIES,
} from "@/lib/agents-docs/whats-new"

export function generateStaticParams() {
  return WHATS_NEW_ENTRIES.map((entry) => ({
    slug: entry.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getWhatsNewEntry(slug)

  if (!entry) {
    return {
      title: "What's New",
      description: "Weekly digests for 21st Agents.",
    }
  }

  return {
    title: `${entry.weekLabel} - What's New`,
    description: entry.teaser,
    alternates: { canonical: `/docs/whats-new/${entry.slug}` },
    openGraph: {
      title: `${entry.weekLabel} - What's New - 21st Agents SDK Docs`,
      description: entry.teaser,
      url: `/docs/whats-new/${entry.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.weekLabel} - What's New - 21st Agents SDK Docs`,
      description: entry.teaser,
    },
  }
}

export default async function WhatsNewEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getWhatsNewEntry(slug)

  if (!entry) notFound()

  const jsonLd = [
    buildDocArticleJsonLd({
      title: `${entry.weekLabel} · ${entry.fullDateRange}`,
      description: entry.teaser,
      path: `/docs/whats-new/${entry.slug}`,
    }),
    buildBreadcrumbJsonLd([
      { name: "Docs", path: "/docs" },
      { name: "What's New", path: "/docs/whats-new" },
      { name: entry.weekLabel, path: `/docs/whats-new/${entry.slug}` },
    ]),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <WhatsNewEntryContent entry={entry} />
    </>
  )
}
