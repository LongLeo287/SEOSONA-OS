---
description: Compare two SEO snapshots (GSC / GSC AI Performance / rank tracker / AEO probe) and surface top movers per metric with auto-classification — growth / decline / reshuffle / stable / new / lost
argument-hint: "<baseline.csv> <current.csv> [--noise 5]"
---

# SEO Drift

> If you see unfamiliar placeholders or need to check which data sources are connected, see [CONNECTORS.md](../CONNECTORS.md).

Takes two snapshots of SEO performance data — separated by weeks, a Core Update, a content refresh, or an algorithm change — and produces a structured drift report. Works with classic GSC exports, the new GSC AI Performance Report (3 Jun 2026), rank-tracker exports, and `aeo-audit` probe results. Routes to `skills/seo-drift/SKILL.md`.

## Trigger

User runs `/digital-marketing-pro:seo-drift` or asks for:
- "Compare this month vs last month"
- "What changed since the Core Update?"
- "Track AI Mode citation drift"
- "Before/after for the content refresh"
- "Site migration impact audit"

## Inputs

1. **Baseline CSV** — older snapshot
2. **Current CSV** — newer snapshot
3. **Source type** — auto-detected via columns (GSC / GSC AI / rank tracker / AEO probe). Both snapshots must be from same source.
4. **Noise threshold** (optional) — default 5%, below which moves are classified `stable`. YMYL industries should use 10% to filter out Quality Rater Guidelines volatility.

## Process

1. Load brand context
2. Place baseline + current CSV exports into the dated output folder
3. Run `scripts/seo_drift.py` to compute per-row deltas + classifications
4. Validate the four quality gates (date_range_distinct / sample_size / metric_compatibility / no_lookup_collisions)
5. Narrative analysis of top 10 gainers (cause hypotheses → amplification candidates)
6. Triage matrix for top 10 losers (`is_yMYL × had_recent_change × Core_Update_window` → action)
7. If source is GSC AI Performance Report: cross-reference AI Mode citation losses with `/digital-marketing-pro:aeo-audit`
8. Classification distribution analysis (high reshuffle = AI Mode intent reweighting)
9. Write `PLAN.md` to `${CLAUDE_PLUGIN_DATA}/{brand}/seo/seo-drift/{date}/`

## Output

Numbered intermediate files under `${CLAUDE_PLUGIN_DATA}/{brand}/seo/seo-drift/{YYYY-MM-DD}/`:

- `00-input.md`, `01-baseline.csv`, `02-current.csv`
- `03-drift-run.json` (raw script output), `04-quality-scorecard.md`
- `05-biggest-gainers.md`, `05-biggest-losers.md`
- `06-ai-mode-shift.md` (only when source is GSC AI Performance Report)
- `07-classification-distribution.md`
- `PLAN.md` (the deliverable)

## After the drift

Branch by finding:

- **High decline (>40% of rows)**: "Likely Core Update or competitor catch-up. Run `/digital-marketing-pro:seo-audit` for diagnosis."
- **High reshuffle (>20% of rows)**: "Likely intent shift (AI Mode reweighting). Run `/digital-marketing-pro:aeo-geo` to align with new intent patterns."
- **High growth (>30% of rows)**: "Find amplification opportunities. Run `/digital-marketing-pro:content-engine` to brief follow-ups."
- **High new (>15% of rows)**: "New SERP coverage — track and validate intent fit."

For the full skill spec including classification rules, position-delta inversion, and Core Update timing guidance, see [skills/seo-drift/SKILL.md](../skills/seo-drift/SKILL.md).
