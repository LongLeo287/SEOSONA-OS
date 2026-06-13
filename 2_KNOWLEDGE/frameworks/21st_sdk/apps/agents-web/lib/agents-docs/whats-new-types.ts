export interface WhatsNewEntrySource {
  slug: string
  weekLabel: string
  shortDateRange: string
  fullDateRange: string
  publishedAt: string
  focus: string
  title: string
  teaser: string
  overviewBody: string
  alsoIncludes: string[]
  intro: string
  changes: string[]
}

export interface WhatsNewEntry
  extends Omit<WhatsNewEntrySource, "publishedAt"> {
  publishedAt: Date
}

export interface WhatsNewOverviewSource {
  title: string
  description: string
  intro: string
  body: string
}
