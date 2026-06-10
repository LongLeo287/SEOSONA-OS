---
name: seo-workspace
description: >-
  SEOSONA OS core SEO Analysis Framework (5 Pillars) for auditing websites, tracking metrics, and scoring. Use this to conduct an end-to-end SEO Audit.
---

# SEOSONA SEO Analysis Framework
> Version: 3.0 | Last Updated: 2026-06-08 | Standard: Enterprise-Grade

---

## Overview

This framework defines the **standard methodology** to analyze, evaluate, and compare any website from a comprehensive SEO perspective. Applicable for:
- ✅ Single-site audit
- ✅ Multi-site comparison
- ✅ Competitor analysis
- ✅ Ongoing performance monitoring

---

## 5 PILLARS — Analysis Framework

### PILLAR 1 — Technical Foundation
**Weight: 25%**

Evaluates the ability of Google to crawl, index, and understand the website.

| Category | Tool | Key Metrics |
|---|---|---|
| Crawlability | Playwright, robots.txt | Blocked URLs, crawl depth |
| Indexation | GSC URL Inspection | Index coverage, exclusions |
| Page Speed | PageSpeed Insights API, CrUX | LCP, INP, CLS (Core Web Vitals) |
| Mobile Usability | PSI Mobile | Mobile-friendly score |
| Security | HTTPS check, headers | SSL, HSTS, mixed content |
| URL Structure | Crawler | URL length, parameters, duplication |
| Structured Data | Schema validator | Schema types, errors |
| Internal Linking | Crawler | Orphan pages, link depth |
| Sitemap | sitemap.xml fetch | Coverage, freshness, errors |
| Hreflang | Tag checker | Self-referencing, return tags |

**Scoring:** Based on `sops/scoring_rubric.md`

---

### PILLAR 2 — Content Intelligence
**Weight: 25%**

Evaluates the quality, depth, and relevance of the content.

| Category | Tool | Key Metrics |
|---|---|---|
| E-E-A-T | Manual + AI analysis | Author bio, citations, first-hand experience |
| Content Depth | Word count analyzer | Avg words/page vs top 3 competitors |
| Content Freshness | Last-modified headers | % pages updated in last 90 days |
| Topical Coverage | Keyword cluster map | Topic authority score |
| Readability | Flesch-Kincaid | Reading level match to audience |
| Thin Content | Crawler | Pages < 300 words |
| Duplicate Content | Canonical checker | Duplicate titles, bodies |
| AEO/GEO Readiness | GEOFlow framework | AI Overview citability score |
| FAQ / PAA Coverage | SERP scraper | Questions answered vs PAA |
| Multimedia | Image/video checker | Alt text, video transcripts |

---

### PILLAR 3 — Authority & Trust
**Weight: 20%**

Evaluates domain strength and trust levels from external sources.

| Category | Tool | Key Metrics |
|---|---|---|
| Domain Rank | Moz/Open PageRank | DR/DA score |
| Referring Domains | Common Crawl/DataForSEO | Total unique referring domains |
| Link Quality | Backlink analysis | % high-DA dofollow links |
| Toxic Links | Backlink classifier | Spam score, risky anchor % |
| Anchor Text Profile | Backlink analysis | Branded/exact/generic ratio |
| Brand Mentions | Google search | Unlinked brand mentions |
| Social Proof | Manual check | Reviews, ratings, social following |
| E-E-A-T Signals | Manual | Author credentials, About page |

---

### PILLAR 4 — Visibility & Rankings
**Weight: 20%**

Evaluates SERP positions and overall visibility.

| Category | Tool | Key Metrics |
|---|---|---|
| Keyword Rankings | GSC / DataForSEO | # keywords in top 10, top 3 |
| SERP Features | SERP scraper | Featured snippets, PAA, local pack owned |
| Click-Through Rate | GSC | Avg CTR vs benchmark (3%+) |
| Impressions | GSC | Total impressions trend |
| AI Overview Presence | GSC / manual | Cited in AI Overviews? |
| Position 4-20 Wins | GSC | Quick-win keyword count |
| Keyword Cannibalization | Crawler | Multiple pages targeting same keyword |
| Brand SERP | Manual | Knowledge panel, brand queries |

---

### PILLAR 5 — Competitive Position
**Weight: 10%**

Evaluates position against direct SERP competitors.

| Category | Tool | Key Metrics |
|---|---|---|
| SERP Overlap | SERP scraper | % keyword overlap with top competitors |
| Keyword Gap | Competitor analysis | Keywords competitors rank for, you don't |
| Backlink Gap | Backlink comparison | Domains linking to them but not you |
| Content Gap | Topic comparison | Topics covered by them but not you |
| SERP Feature Gap | SERP analysis | Features they own, you don't |
| Estimated Traffic Gap | Position × CTR model | Monthly organic traffic estimate |

---

## Scoring System

### Overall SEO Health Score (0-100)
```
Score = (P1 × 0.25) + (P2 × 0.25) + (P3 × 0.20) + (P4 × 0.20) + (P5 × 0.10)
```

### Grade Scale
| Score | Grade | Label |
|-------|-------|-------|
| 90-100 | A+ | Excellent — maintain & optimize |
| 80-89 | A | Strong — minor improvements |
| 70-79 | B | Good — several opportunities |
| 60-69 | C | Fair — significant gaps |
| 50-59 | D | Poor — major issues |
| < 50 | F | Critical — immediate action |

### Priority Classification
| Priority | Label | SLA |
|----------|-------|-----|
| P0 | 🔴 Critical | Fix within 24 hours |
| P1 | 🟠 High | Fix within 1 week |
| P2 | 🟡 Medium | Fix within 1 month |
| P3 | 🟢 Low | Fix within 1 quarter |

---

## SOPs

| SOP | File | Purpose |
|-----|------|---------|
| Data Collection | `sops/data_collection.md` | Sources, naming, freshness rules |
| Scoring Rubric | `sops/scoring_rubric.md` | 5-Pillar scoring criteria |
| Output Delivery | `sops/output_delivery.md` | 9-file delivery standard |
| Dashboard Build | `sops/dashboard_build.md` | HTML 8-tab build spec |

---

## Templates

| Template | File | Usage |
|----------|------|-------|
| Full Audit Report | `templates/seo_audit_report.md` | 5-Pillar audit report |
| Executive Summary | `templates/executive_summary.md` | 1-page CEO/client summary |
| Action Plan | `templates/action_plan.md` | Dev-ready tasks |
| Keyword Research | `templates/keyword_research_template.csv` | CSV template |
| Competitor Matrix | `templates/competitor_matrix_template.csv` | CSV template |
| SERP Analysis | `templates/serp_analysis_template.csv` | CSV template |
| Backlink Report | `templates/backlink_report_template.csv` | CSV template |
| Rank Tracking | `templates/rank_tracking_template.csv` | CSV template |
| GSC Report | `templates/gsc_report_template.csv` | CSV template |
| Comparison Matrix | `templates/comparison_matrix.md` | Multi-site comparison |

---

## Quality Gates

> ⚠️ **CHECKLIST.md — MUST RUN after every audit**
>
> File: `SEO_WORKSPACE/CHECKLIST.md`
>
> Defines: naming convention, required files (8 data + 1 dashboard), score validation, dashboard quality, git security.

**Do not report results if quality gates are not passed.**

---

## Data Storage Policy

> ⚠️ **IMPORTANT — Client data MUST NOT be pushed to Git**

| Folder | Git | Reason |
|--------|-----|-------|
| `2_KNOWLEDGE/` | ✅ Commit | Framework, workflows, templates — public OK |
| `3_MEMORY/seo_exports/` | ❌ Gitignored | All client data: CSV + MD reports + HTML dashboard |
| `3_MEMORY/logs/` | ❌ Gitignored | Session logs — private |

**Single Directory Structure:**
```
3_MEMORY/seo_exports/
  {domain}/
    {domain}_audit_{date}.md
    {domain}_executive_{date}.md
    {domain}_action_plan_{date}.md
    keyword_research_{domain}_{date}.csv
    competitor_matrix_{domain}_{date}.csv
    backlink_report_{domain}_{date}.csv
    rank_tracking_{domain}_{date}.csv
    gsc_report_{domain}_{date}.csv
    seo_dashboard_{domain}.html
```

---

## Version History
- v3.0 (2026-06-08): System audit — 6 new templates, new Dashboard Build SOP, fix all paths, remove orphan files
- v2.3 (2026-06-08): Merge seo_data + seo_exports → 1 single folder
- v2.2 (2026-06-08): CHECKLIST.md + rename 05_multi_competitor_matrix
- v2.1 (2026-06-08): Workflows 04 + 05, CSV templates
- v2.0 (2026-06-08): Full 5-Pillar system
- v1.0 (initial): Basic framework
