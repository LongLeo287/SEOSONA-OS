---
name: ckm:seo
description: SEO audits, keyword research (ReviewWeb.site API), on-page optimization, technical SEO, programmatic SEO (pSEO), JSON+LD schema, Google Search Console API, Core Web Vitals. Used by seo-specialist, attraction-specialist agents.
argument-hint: "[audit|keywords|pseo|optimize|schema] [target]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# SEO

Technical SEO, keyword research (ReviewWeb.site API), Google Search Console API, and programmatic SEO.

<args>$ARGUMENTS</args>

## When to Use

- Keyword research with real data (volume, difficulty, CPC)
- Competitor domain analysis (traffic, top keywords, backlinks)
- Google Search Console data (queries, clicks, impressions, CTR, position)
- SEO audit or technical analysis
- JSON+LD schema generation
- Programmatic SEO (pSEO) templates
- Core Web Vitals measurement

## Quick Start: Google Search Console

```bash
node scripts/gsc-auth.cjs --auth                     # Authenticate (one-time)
node scripts/gsc-query.cjs --sites                    # List sites
node scripts/gsc-query.cjs --top-queries -s URL       # Top queries
node scripts/gsc-query.cjs --low-ctr -s URL -o low-ctr.csv -f csv
```

Config: `google_client_secret.json` in `.opencode/secrets/` or `~/.opencode/secrets/`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `audit` | Technical SEO audit | `references/audit.md` |
| `keywords` | Keyword research & planning | `references/keywords.md` |
| `pseo` | Programmatic SEO template generation | `references/pseo.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/gsc-auth.cjs` | OAuth2 authentication flow |
| `scripts/gsc-query.cjs` | Query analytics, sitemaps, URL inspection |
| `scripts/gsc-config-loader.cjs` | Cross-platform config/token resolution |
| `scripts/analyze-keywords.cjs` | Keyword research via ReviewWeb.site API |
| `scripts/audit-core-web-vitals.cjs` | Core Web Vitals measurement |
| `scripts/generate-sitemap.cjs` | XML sitemap generation |
| `scripts/generate-schema.cjs` | JSON+LD schema generator |
| `scripts/validate-schema.cjs` | Validate JSON-LD |
| `scripts/pseo-generator.cjs` | pSEO page generation |

## References

**Search Console:** `references/google-search-console-api-guide.md`, `references/search-console-query-patterns.md`

**API:** `references/reviewweb-api.md`, `references/reviewweb-content-api.md`

**Audit:** `references/seo-audit-workflow.md`, `references/browser-seo-audit-workflow.md`

**Keyword Research:** `references/keyword-research-workflow.md`, `references/keyword-clustering-methodology.md`, `references/content-gap-analysis-framework.md`

**Technical SEO:** `references/technical-seo-checklist.md`, `references/core-web-vitals-remediation.md`, `references/sitemap-best-practices.md`, `references/robots-txt-best-practices-2025.md`, `references/canonical-url-strategy.md`, `references/mobile-seo-checklist.md`

**On-Page SEO:** `references/on-page-seo-checklist-2025.md`, `references/meta-tag-templates.md`, `references/semantic-seo-framework.md`, `references/readability-scoring-guide.md`, `references/internal-linking-automation.md`

**Programmatic SEO:** `references/pseo-templates.md`, `references/pseo-best-practices.md`, `references/pseo-template-syntax.md`, `references/pseo-url-structure-guide.md`, `references/pseo-scale-architecture.md`

**Link Building:** `references/backlink-analysis-framework.md`, `references/link-building-campaign-framework.md`, `references/outreach-email-templates.md`, `references/directory-submission-list.md`

**Schema:** `references/schema-generation.md`, `references/schema-templates/`

## Agents Used

- `seo-specialist` — SEO audit and optimization
- `attraction-specialist` — Keyword research

## Output

- Audit reports → `assets/reports/seo/{date}-{domain}-audit.md`
- Keyword reports → `assets/reports/seo/{date}-{topic}-keywords.md`
- CWV reports → `assets/reports/seo/{date}-{domain}-cwv.md`
- Schema files → `assets/seo/schemas/{page}-schema.json`

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
