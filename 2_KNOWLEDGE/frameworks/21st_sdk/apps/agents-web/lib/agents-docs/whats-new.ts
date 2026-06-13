import {
  GENERATED_WHATS_NEW_ENTRIES,
  GENERATED_WHATS_NEW_OVERVIEW,
} from "./generated-whats-new"
import type { WhatsNewEntry, WhatsNewOverviewSource } from "./whats-new-types"

export type { WhatsNewEntry }

export const WHATS_NEW_OVERVIEW: WhatsNewOverviewSource =
  GENERATED_WHATS_NEW_OVERVIEW

export const WHATS_NEW_ENTRIES: WhatsNewEntry[] =
  GENERATED_WHATS_NEW_ENTRIES.map((entry) => ({
    ...entry,
    publishedAt: new Date(entry.publishedAt),
  }))

export const WHATS_NEW_NAV_ITEMS = [
  {
    title: "What's new",
    href: "/agents/docs/whats-new",
  },
  ...WHATS_NEW_ENTRIES.map((entry) => ({
    title: `${entry.weekLabel} · ${entry.shortDateRange}`,
    href: `/agents/docs/whats-new/${entry.slug}`,
  })),
]

export function getWhatsNewEntry(slug: string) {
  return WHATS_NEW_ENTRIES.find((entry) => entry.slug === slug) ?? null
}

export function getWhatsNewHref(slug?: string) {
  return slug ? `/agents/docs/whats-new/${slug}` : "/agents/docs/whats-new"
}
