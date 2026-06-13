import type { ReactNode } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { cn } from "@/lib/utils"
import {
  getWhatsNewHref,
  WHATS_NEW_ENTRIES,
  WHATS_NEW_NAV_ITEMS,
  WHATS_NEW_OVERVIEW,
  type WhatsNewEntry,
} from "@/lib/agents-docs/whats-new"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { WhatsNewPageActions } from "./whats-new-page-actions"

function WhatsNewSidebar({ currentHref }: { currentHref: string }) {
  return (
    <nav className="hidden md:flex flex-col gap-px w-[200px] shrink-0 sticky top-0 pt-6 pb-10 overflow-y-auto max-h-[calc(100svh-var(--agents-header-h,96px))]">
      <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-foreground/40 dark:text-muted-foreground/50">
        What's New
      </div>
      {WHATS_NEW_NAV_ITEMS.map((item) => {
        const active = item.href === currentHref
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium",
              active
                ? "bg-foreground/[0.06] text-foreground"
                : "text-foreground/50 dark:text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

function PageChrome({
  currentHref,
  currentSlug,
  children,
  showSidebar = true,
  showWeekRail = false,
}: {
  currentHref: string
  currentSlug?: string
  children: ReactNode
  showSidebar?: boolean
  showWeekRail?: boolean
}) {
  return (
    <div className="mx-auto flex max-w-[1360px] gap-6 px-4 sm:px-6">
      {showSidebar ? <WhatsNewSidebar currentHref={currentHref} /> : null}
      <div
        className={cn(
          "flex-1 min-w-0 py-6 md:py-10",
          showSidebar ? "md:px-8" : "mx-auto max-w-[860px]",
        )}
      >
        {children}
      </div>
      {showWeekRail ? <WeeksRail currentSlug={currentSlug} /> : null}
    </div>
  )
}

function MetaRow({ entry }: { entry: WhatsNewEntry }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
      <span className="font-medium text-foreground/80">{entry.weekLabel}</span>
      <span aria-hidden>·</span>
      <span>{entry.fullDateRange}</span>
      <span aria-hidden>·</span>
      <span>{entry.focus}</span>
    </div>
  )
}

function AlsoIncludes({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
      {items.map((item) => (
        <li
          key={item}
          className="list-disc list-inside marker:text-foreground/30"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function WeeksRail({ currentSlug }: { currentSlug?: string }) {
  return (
    <aside className="hidden xl:block w-[190px] shrink-0 pt-10">
      <div className="sticky top-24">
        <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40 dark:text-muted-foreground/50">
          Browse weeks
        </p>
        <nav className="mt-3 flex flex-col gap-1">
          {WHATS_NEW_ENTRIES.map((entry) => {
            const active = entry.slug === currentSlug

            return (
              <Link
                key={entry.slug}
                href={getWhatsNewHref(entry.slug)}
                className={cn(
                  "an-focus-btn rounded-lg px-3 py-2 text-left transition-colors",
                  active
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-foreground/55 hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                <div className="text-[13px] font-medium">{entry.weekLabel}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">
                  {entry.shortDateRange}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

function DigestCard({ entry }: { entry: WhatsNewEntry }) {
  return (
    <article
      id={entry.slug}
      className="border-t border-border/60 pt-6 first:border-t-0 first:pt-0"
    >
      <MetaRow entry={entry} />

      <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
        {entry.title}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        {entry.overviewBody}
      </p>

      <div className="mt-4 space-y-1.5">
        <p className="text-[13px] font-medium text-foreground/80">
          Also this week
        </p>
        <AlsoIncludes items={entry.alsoIncludes} />
      </div>

      <Link
        href={getWhatsNewHref(entry.slug)}
        className="an-focus-btn mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:opacity-70"
      >
        Read the {entry.weekLabel} digest
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  )
}

function ChangelogList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-foreground/85">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="shrink-0 select-none text-foreground/35">
            -
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function WeekMeta({ entry }: { entry: WhatsNewEntry }) {
  return (
    <div className="md:sticky md:top-24 md:border-l md:border-border/60 md:pl-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/45">
        Week
      </p>
      <p className="mt-1 text-[14px] font-medium text-foreground">
        {entry.weekLabel}
      </p>

      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-foreground/45">
        Published
      </p>
      <p className="mt-1 text-[14px] text-foreground/80">
        {entry.fullDateRange}
      </p>

      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-foreground/45">
        Focus
      </p>
      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
        {entry.focus}
      </p>
    </div>
  )
}

function WeekPager({ entry }: { entry: WhatsNewEntry }) {
  const currentIndex = WHATS_NEW_ENTRIES.findIndex(
    (candidate) => candidate.slug === entry.slug,
  )
  const newerEntry =
    currentIndex > 0 ? WHATS_NEW_ENTRIES[currentIndex - 1] : null
  const olderEntry =
    currentIndex >= 0 && currentIndex < WHATS_NEW_ENTRIES.length - 1
      ? WHATS_NEW_ENTRIES[currentIndex + 1]
      : null

  if (!newerEntry && !olderEntry) return null

  return (
    <nav className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-start sm:justify-between">
      {olderEntry ? (
        <Link
          href={getWhatsNewHref(olderEntry.slug)}
          className="an-focus-btn inline-flex items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[14px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Older week
            <span className="block font-medium text-foreground">
              {olderEntry.weekLabel} · {olderEntry.shortDateRange}
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {newerEntry ? (
        <Link
          href={getWhatsNewHref(newerEntry.slug)}
          className="an-focus-btn inline-flex items-start justify-end gap-2 rounded-lg px-2 py-1.5 text-right text-[14px] text-muted-foreground transition-colors hover:text-foreground sm:ml-auto"
        >
          <span>
            Newer week
            <span className="block font-medium text-foreground">
              {newerEntry.weekLabel} · {newerEntry.shortDateRange}
            </span>
          </span>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
        </Link>
      ) : null}
    </nav>
  )
}

export function WhatsNewIndexContent() {
  return (
    <PageChrome currentHref={getWhatsNewHref()}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">What's new</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {WHATS_NEW_OVERVIEW.description}
          </p>
        </div>
        <WhatsNewPageActions rssHref="/agents/docs/whats-new/rss.xml" />
      </div>

      <div className="mt-4 max-w-3xl space-y-2 text-[14px] leading-relaxed text-muted-foreground">
        <p>{WHATS_NEW_OVERVIEW.intro}</p>
        <p>{WHATS_NEW_OVERVIEW.body}</p>
      </div>

      <div className="mt-8 space-y-6">
        {WHATS_NEW_ENTRIES.map((entry) => (
          <DigestCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </PageChrome>
  )
}

export function WhatsNewEntryContent({ entry }: { entry: WhatsNewEntry }) {
  return (
    <PageChrome
      currentHref={getWhatsNewHref(entry.slug)}
      currentSlug={entry.slug}
      showSidebar={false}
      showWeekRail
    >
      <div className="flex items-center justify-between gap-4">
        <Link
          href={getWhatsNewHref()}
          className="an-focus-btn inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to What's new
        </Link>
        <WhatsNewPageActions rssHref="/agents/docs/whats-new/rss.xml" />
      </div>

      <div className="mt-6">
        <MetaRow entry={entry} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {entry.title}
        </h1>
      </div>

      <div className="mt-4 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
        <p>{entry.teaser}</p>
        <p>{entry.intro}</p>
      </div>

      <section className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Changelog</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Everything that shipped across {entry.shortDateRange}.
          </p>
          <ChangelogList items={entry.changes} />
        </div>
        <WeekMeta entry={entry} />
      </section>

      <WeekPager entry={entry} />
    </PageChrome>
  )
}
