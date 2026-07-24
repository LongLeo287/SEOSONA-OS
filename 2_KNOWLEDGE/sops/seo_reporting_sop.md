# SOP: SEO Performance Reporting

_Version 1.0 | Created: 2026-06-17_

## Purpose
Standardize the format, frequency, and delivery of SEO performance reports for all clients.

## Report Types & Frequency

| Report Type | Frequency | Audience | Depth |
|---|---|---|---|
| **Flash Update** | Weekly | Project Manager | Key metrics only (rankings, traffic delta) |
| **Monthly Report** | Monthly | Client + PM | Full analysis with insights and action items |
| **Quarterly Review** | Quarterly | Client C-Suite | Strategic overview with ROI and recommendations |

## Monthly Report Template

### 1. Executive Summary (1 page)
- Overall performance grade (🟢 On Track / 🟡 Needs Attention / 🔴 At Risk)
- Top 3 wins this month
- Top 3 priorities for next month

### 2. Organic Traffic (from GA4)
- Total organic sessions (vs. previous month, vs. same month last year)
- Top 10 landing pages by organic traffic
- New vs returning users breakdown

### 3. Keyword Rankings (from Rank Tracker)
- Total keywords tracked
- Keywords in Top 3 / Top 10 / Top 20 / Top 50
- Biggest movers (top 5 gains, top 5 losses)
- New keywords entered Top 100

### 4. Technical Health (from PSI + GSC)
- Core Web Vitals status (LCP, INP, CLS)
- Index coverage (indexed pages, errors, warnings)
- Crawl stats (pages crawled, avg response time)
- Mobile usability issues

### 5. Content Performance
- New content published this month
- Content performance (traffic per article, engagement)
- Content pipeline for next month

### 6. Backlink Profile (from Backlink Connector)
- Total referring domains (growth trend)
- New backlinks acquired
- Toxic/spam backlinks detected
- Domain Authority / Domain Rating trend

### 7. Competitive Landscape
- Ranking comparison vs top 3 competitors
- Competitor content gap analysis highlights

### 8. Action Items
- Prioritized task list for next month
- Dependencies and blockers

## Delivery Process
1. Run `report_generator` skill to auto-generate data sections.
2. Analyst adds insights and recommendations.
3. Review by `content-reviewer` agent for accuracy.
4. Export to PDF/Google Slides.
5. Schedule delivery to client via email.
6. Archive in `3_MEMORY/seo_exports/{client_name}/reports/`.
