import type { SourceType } from "../icons/source-icons"

export type SearchResult = { source: SourceType; title: string; date: string }
export type SearchResultSet = { results: SearchResult[]; tabs: { source: SourceType; label: string; count: number }[] }

export const SEARCH_RESULT_SETS: Record<string, SearchResultSet> = {
  "default-1": {
    results: [
      { source: "google", title: "United UA837 SFO\u2192NRT \u00b7 $1,105 economy", date: "google.com/flights" },
      { source: "expedia", title: "SFO\u2013Tokyo \u00b7 14 results from $1,089", date: "expedia.com" },
      { source: "google", title: "ANA NH7 Direct SFO\u2192NRT \u00b7 $1,240 rt", date: "google.com/flights" },
      { source: "expedia", title: "JAL JL1 SFO\u2192HND \u00b7 $1,180 economy", date: "expedia.com" },
      { source: "google", title: "Cheapest: $1,089 \u00b7 Zipair nonstop", date: "google.com/flights" },
    ],
    tabs: [
      { source: "google", label: "Google", count: 5 },
      { source: "expedia", label: "Expedia", count: 4 },
    ],
  },
  "default-2": {
    results: [
      { source: "booking", title: "Shinjuku Granbell \u00b7 4.2\u2605 \u00b7 \u00a518,500/nt", date: "booking.com" },
      { source: "tripadvisor", title: "Granbell Hotel Reviews \u2014 1,847 ratings", date: "tripadvisor.com" },
      { source: "airbnb", title: "Shinjuku loft \u00b7 Superhost \u00b7 $95/nt", date: "airbnb.com" },
      { source: "booking", title: "Granbell Shinjuku \u2014 Available Mar 15-22", date: "booking.com" },
      { source: "tripadvisor", title: "Top 10 Shinjuku Hotels \u00b7 2025 Picks", date: "tripadvisor.com" },
    ],
    tabs: [
      { source: "booking", label: "Booking", count: 4 },
      { source: "tripadvisor", label: "Tripadvisor", count: 3 },
      { source: "airbnb", label: "Airbnb", count: 2 },
    ],
  },
  zendesk: {
    results: [
      { source: "zendesk", title: "Account: sarah.chen@acme.co \u00b7 Business plan", date: "internal CRM" },
      { source: "stripe", title: "sub_1N8k2m \u00b7 $49/mo \u00b7 active since Oct 2024", date: "stripe.com" },
      { source: "zendesk", title: "Workspace ws_8k2m9 \u00b7 12 users \u00b7 migrated Nov 3", date: "internal CRM" },
    ],
    tabs: [
      { source: "zendesk", label: "Zendesk", count: 3 },
      { source: "stripe", label: "Stripe", count: 2 },
    ],
  },
  stripe: {
    results: [
      { source: "stripe", title: "sub_1N8k2m \u00b7 Business ($49/mo) \u00b7 active", date: "stripe.com" },
      { source: "stripe", title: "Entitlements: export, api, analytics, sso", date: "stripe.com" },
      { source: "zendesk", title: "Migration log: ws_8k2m9 \u00b7 legacy\u2192business \u00b7 Nov 3", date: "internal CRM" },
    ],
    tabs: [
      { source: "stripe", label: "Stripe", count: 2 },
      { source: "zendesk", label: "Zendesk", count: 2 },
    ],
  },
  github: {
    results: [
      { source: "github", title: "src/routes/messages.ts \u00b7 Express router, 4 middleware", date: "github.com" },
      { source: "github", title: "package.json \u00b7 ioredis@5.3, express@4.18", date: "github.com" },
      { source: "stackoverflow", title: "Redis sliding window rate limiting \u00b7 847 votes", date: "stackoverflow.com" },
    ],
    tabs: [
      { source: "github", label: "GitHub", count: 4 },
      { source: "stackoverflow", label: "SO", count: 1 },
    ],
  },
  arxiv: {
    results: [
      { source: "arxiv", title: "Quantum error correction below threshold \u00b7 Acharya 2024", date: "arxiv.org" },
      { source: "arxiv", title: "Interferometric parity measurement \u00b7 Aghaee 2025", date: "arxiv.org" },
      { source: "scholar", title: "Utility of quantum computing \u00b7 Kim et al \u00b7 567 cites", date: "scholar.google.com" },
    ],
    tabs: [
      { source: "arxiv", label: "arXiv", count: 3 },
      { source: "scholar", label: "Scholar", count: 2 },
    ],
  },
  scholar: {
    results: [
      { source: "scholar", title: "Acharya et al 2024 \u00b7 Nature \u00b7 342 citations", date: "scholar.google.com" },
      { source: "scholar", title: "Kim et al 2024 \u00b7 Nature \u00b7 567 citations", date: "scholar.google.com" },
      { source: "arxiv", title: "2408.13687 \u00b7 open-access \u00b7 companion blog post", date: "arxiv.org" },
    ],
    tabs: [
      { source: "scholar", label: "Scholar", count: 3 },
      { source: "arxiv", label: "arXiv", count: 1 },
    ],
  },
}
