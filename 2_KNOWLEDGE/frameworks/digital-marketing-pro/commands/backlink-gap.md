---
description: Find domains linking to your competitors but not to you, ranked by priority score (DR + link-overlap + traffic + topical relevance) with a four-gate quality scorecard
argument-hint: "<your-domain> <competitor-1> [competitor-2 ...]"
---

# Backlink Gap

> If you see unfamiliar placeholders or need to check which backlink data sources are connected, see [CONNECTORS.md](../CONNECTORS.md).

Identifies the highest-leverage backlink prospects — domains that link to multiple competitors but not to you — and ranks them by an opinionated priority score combining authority, link-overlap signal, downstream traffic, and topical relevance. Routes to `skills/backlink-gap/SKILL.md`.

## Trigger

User runs `/digital-marketing-pro:backlink-gap` or asks for:
- "Find link prospects from my competitors"
- "Where did my competitors gain links?"
- "Backlink-gap audit"
- "Run a digital PR target list"
- "Find broken-link replacement opportunities"

## Inputs

1. **Your domain** — the brand's primary domain
2. **Competitors** — 2 minimum (1 allowed but warns), 3–5 is the sweet spot. Auto-fetched from `/digital-marketing-pro:competitor-analysis` if a fresh run exists.
3. **Backlink data source** — Ahrefs / Semrush / SE Ranking / Moz MCP. Connector must be configured.
4. **Minimum DR filter** (optional) — default 20; YMYL industries should set 40

## Process

1. Load brand context
2. Pick competitors (re-use latest `competitor-analysis` PLAN.md if fresh)
3. Pull backlinks for own domain + each competitor via connected backlink MCP (with budget guard at 200 credits)
4. Run `scripts/backlink_gap.py` to compute gap + priority scores
5. Validate the four quality gates (data_freshness / sample_size / competitor_coverage / link_overlap_signal)
6. Build prospect shortlist with outreach angles (guest post / broken-link / resource-page)
7. HTTP-HEAD scan competitor backlinks for 4xx — these are broken-link replacement candidates (highest hit rate)
8. Draft 3 outreach template variants pre-filled with brand voice
9. Write `PLAN.md` to `${CLAUDE_PLUGIN_DATA}/{brand}/seo/backlink-gap/{date}/`

## Output

Numbered intermediate files under `${CLAUDE_PLUGIN_DATA}/{brand}/seo/backlink-gap/{YYYY-MM-DD}/`:

- `00-input.md`, `01-data-pull.md`, `02-ours.csv`, `03-comp-*.csv`
- `04-gap-run.json` (raw script output), `05-quality-scorecard.md`
- `06-prospect-shortlist.md`, `07-broken-link-candidates.md`, `08-outreach-templates.md`
- `PLAN.md` (the deliverable)

## After the audit

Ask: "Would you like me to:
- Send the top 10 prospects to a digital PR workflow? (`/digital-marketing-pro:digital-pr`)
- Draft pitches for the top 5 broken-link replacements? (`/digital-marketing-pro:pr-pitch`)
- Schedule quarterly re-runs to track gains? (`/digital-marketing-pro:seo-drift`)
- Open the prospect shortlist for review?"

For the full skill spec including the priority-score formula, why link-count is weighted higher than traffic, and chain handoffs, see [skills/backlink-gap/SKILL.md](../skills/backlink-gap/SKILL.md).
