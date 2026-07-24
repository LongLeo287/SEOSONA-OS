---
description: Build a pillar+spokes content cluster plan from seed keywords with SERP-overlap clustering, intent grouping, internal-link map, and a four-gate quality scorecard
argument-hint: "<seed-keywords or path/to/seeds.csv> [target-country]"
---

# Keyword Cluster

> If you see unfamiliar placeholders or need to check which keyword data sources are connected, see [CONNECTORS.md](../CONNECTORS.md).

Takes a set of seed keywords and produces a publication-ready cluster plan: pillar pages with their spokes, intent-grouped, prioritised by an opinionated scoring formula, with an internal-link map and a four-gate quality scorecard. Routes to `skills/keyword-cluster/SKILL.md`.

## Trigger

User runs `/digital-marketing-pro:keyword-cluster` or asks for:
- "Cluster these keywords into a content plan"
- "Build a pillar/spokes architecture for this topic"
- "Design a topic hub for X"
- "Dedupe my cannibalising pages"
- "Plan a programmatic SEO rollout"

## Inputs

1. **Seeds** — either a list of 3–20 seed keywords inline, or a path to a CSV with at least a `keyword` column (plus optional `volume`, `kd`, `intent`)
2. **Target country / language** (optional — uses brand profile default)
3. **SERP data** (strongly recommended) — JSON map of keyword → top-N result URLs from connected rank-tracker MCP. Without this, falls back to lower-confidence lexical clustering.
4. **Filter thresholds** (optional) — minimum search volume, maximum keyword difficulty

## Process

1. Load brand context + auto-apply industry / compliance rules
2. Optionally expand seeds via brand's keyword-research MCP (`/digital-marketing-pro:keyword-research`) if input is < 20 keywords
3. Filter seeds by min-volume / max-KD / banned-word lists
4. Fetch top-10 SERPs per keyword via connected rank-tracker (with budget guard at 500-credit threshold)
5. Run `scripts/keyword_cluster.py` with SERP mode (or lexical fallback)
6. Validate the four quality gates (cannibalisation / orphan / coverage / anchor_diversity) — surface `needs_review` diagnostics if any fail
7. Draft pillar-page briefs for clusters with `priority_score >= 0.5`
8. Build internal-link map
9. Sort by priority for build-order recommendation
10. Write `PLAN.md` to `${CLAUDE_PLUGIN_DATA}/{brand}/seo/keyword-cluster/{date}/`

## Output

Numbered intermediate files under `${CLAUDE_PLUGIN_DATA}/{brand}/seo/keyword-cluster/{YYYY-MM-DD}/`:

- `00-input.md`, `01-seed-expansion.md`, `02-filtered.csv`, `03-serps.json` (if SERP mode)
- `04-cluster-run.json` (raw script output), `05-quality-scorecard.md`
- `06-pillar-pages.md`, `07-internal-link-map.md`, `08-build-order.md`
- `PLAN.md` (the deliverable)

## After the cluster

Ask: "Would you like me to:
- Brief the top pillar pages? (`/digital-marketing-pro:content-brief`)
- Start writing the highest-priority pillar? (`/digital-marketing-pro:content-engine`)
- Apply the internal-link map to your CMS? (`/digital-marketing-pro:seo-implement`)
- Schedule a quarterly re-run via `/digital-marketing-pro:seo-drift`?"

For the full skill spec including the four quality gates, priority-score formula, and chain handoffs, see [skills/keyword-cluster/SKILL.md](../skills/keyword-cluster/SKILL.md).
