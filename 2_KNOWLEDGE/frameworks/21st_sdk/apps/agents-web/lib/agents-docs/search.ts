import { AN_DOC_PAGES } from "./markdown-content"
import { WHATS_NEW_ENTRIES, WHATS_NEW_OVERVIEW } from "./whats-new"

export interface SearchRecord {
  title: string
  description: string
  href: string
  section: string
  tab: string
  excerpt: string
  content: string
}

export function buildSearchIndex(): SearchRecord[] {
  const docsRecords = AN_DOC_PAGES.map((page) => {
    // Strip leading heading and take first ~200 chars for excerpt
    const stripped = page.markdown.replace(/^#[^\n]*\n+/, "").trim()
    const excerpt = stripped.slice(0, 200).replace(/\n/g, " ").trim()

    return {
      title: page.title,
      description: page.description,
      // AN_DOC_PAGES uses "/docs/..." but routes are "/agents/docs/..."
      href: `/an${page.path}`,
      section: page.section,
      tab: "Docs",
      excerpt,
      content: page.markdown,
    }
  })

  const whatsNewOverviewRecord: SearchRecord = {
    title: "What's new",
    description: WHATS_NEW_OVERVIEW.description,
    href: "/agents/docs/whats-new",
    section: "What's New",
    tab: "What's New",
    excerpt: WHATS_NEW_OVERVIEW.intro,
    content: [
      WHATS_NEW_OVERVIEW.description,
      WHATS_NEW_OVERVIEW.intro,
      WHATS_NEW_OVERVIEW.body,
      ...WHATS_NEW_ENTRIES.map(
        (entry) =>
          `${entry.weekLabel} ${entry.shortDateRange} ${entry.title} ${entry.teaser}`,
      ),
    ].join("\n"),
  }

  const whatsNewRecords = WHATS_NEW_ENTRIES.map((entry) => ({
    title: `${entry.weekLabel} · ${entry.shortDateRange}`,
    description: entry.title,
    href: `/agents/docs/whats-new/${entry.slug}`,
    section: "What's New",
    tab: "What's New",
    excerpt: entry.teaser,
    content: [
      entry.title,
      entry.teaser,
      entry.overviewBody,
      entry.intro,
      ...entry.alsoIncludes,
      ...entry.changes,
    ].join("\n"),
  }))

  return [whatsNewOverviewRecord, ...whatsNewRecords, ...docsRecords]
}
