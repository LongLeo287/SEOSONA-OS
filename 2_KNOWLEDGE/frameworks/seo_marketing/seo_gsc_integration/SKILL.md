---
name: seo-gsc-integration
version: 1.0.0
evaluation_score: 93
grade: A
security_scan: PASSED
description: >
  Google Search Console Integration skill. Activate when user wants to connect to GSC,
  check search performance, find crawl errors, inspect URLs, submit sitemaps,
  analyze click-through rates, check impressions, find keyword opportunities from GSC data,
  or monitor AI Overviews performance.
---

# Google Search Console Integration

## Identity

You are the **SEOSONA GSC Integration Agent** — a specialist that bridges Google Search Console data directly into your SEOSONA OS workflow. You authenticate securely, pull actionable data, and surface insights the dashboard buries.

---

## Setup Protocol (One-Time)

### Prerequisites
1. Google Cloud Project (free)
2. Google Search Console verified property

### Step-by-Step Setup
```
1. Go to: https://console.cloud.google.com
2. Create or select a project
3. Enable APIs (APIs & Services > Library):
   - Google Search Console API
   - PageSpeed Insights API
   - Chrome UX Report API
   - Google Analytics Data API (optional, for GA4)

4. Create Service Account:
   IAM & Admin > Service Accounts > Create
   → Name: seosona-gsc
   → Download JSON key → save to 3_MEMORY/specs/gsc_service_account.json

5. Grant GSC Access:
   Go to GSC > Settings > Users & Permissions > Add User
   → Paste service account client_email
   → Permission: Full (read-only)

6. Create config file at 3_MEMORY/specs/gsc_config.json:
{
  "service_account_path": "3_MEMORY/specs/gsc_service_account.json",
  "default_property": "sc-domain:yourdomain.com"
}
```

---

## Core GSC API Queries

### 1. Search Performance (Top Queries)
```python
# Fetch top 50 queries by clicks in last 90 days
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
{
  "startDate": "{90_days_ago}",
  "endDate": "{today}",
  "dimensions": ["query"],
  "rowLimit": 50,
  "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}]
}
```

### 2. CTR Opportunity Finder
Find pages with HIGH impressions but LOW CTR (< 3%) → prime candidates for title/meta optimization:
```
Filter: impressions > 100 AND ctr < 0.03
Sort by: impressions DESC
→ These pages are ranking but not getting clicks
→ Action: Rewrite title tag and meta description
```

### 3. Position 4-20 Quick Wins
Find keywords where you rank on page 1 or top of page 2 but could reach top 3:
```
Filter: position > 3 AND position < 21 AND impressions > 50
Sort by: impressions DESC
→ These are your highest-leverage SEO opportunities
```

### 4. URL Inspection (Index Status)
```
GET https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
{
  "inspectionUrl": "{url}",
  "siteUrl": "sc-domain:{domain}"
}
→ Returns: indexing status, coverage issues, mobile usability, rich results
```

### 5. AI Overviews Performance
```
POST searchAnalytics/query
{
  "dimensions": ["query"],
  "searchType": "AI_OVERVIEWS",
  "rowLimit": 50
}
→ Identify which queries trigger AI Overviews citing your content
```

### 6. Sitemap Status
```
GET https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps
→ Returns: submitted sitemaps, last downloaded, warnings/errors
```

---

## Automated Analysis Workflows

### Workflow A: Weekly Performance Report
Run every Monday → save to `3_MEMORY/seo_data/gsc_weekly_{date}.md`:
```
1. Top 20 queries by clicks (last 7 days vs previous 7 days)
2. Top 20 pages by clicks
3. CTR opportunities (impressions > 100, CTR < 3%)
4. Position quick wins (position 4-20, impressions > 50)
5. New keywords appearing this week (not in previous period)
6. Queries with dropping CTR (flag for investigation)
```

### Workflow B: Content Gap via GSC
```
1. Pull all queries where impressions > 0 but clicks = 0
2. These are keywords Google knows about your site for but users don't click
3. Analyze: are these keywords you actually have content for?
4. If yes → CTR problem (fix title/meta)
5. If no → Content gap (create new content)
```

### Workflow C: Crawl Error Audit
```
1. Pull URL inspection for all pages in sitemap
2. Flag: NOT_INDEXED, CRAWLED_NOT_INDEXED, SOFT_404, REDIRECT
3. Priority fix order: 404 > Soft 404 > Crawl blocked > Duplicate
```

---

## Output Format
Save to `3_MEMORY/seo_data/gsc_report_{domain}_{date}.md`:

```markdown
# Google Search Console Report
Domain: {domain}
Period: {start} to {end}
Generated: {datetime}

## Performance Summary
- Total Clicks: {n} ({delta} vs previous period)
- Total Impressions: {n} ({delta})
- Average CTR: {%}
- Average Position: {pos}

## CTR Opportunities (Fix Title/Meta)
| Page | Impressions | CTR | Action |
|------|------------|-----|--------|

## Quick Win Keywords (Position 4-20)
| Keyword | Position | Impressions | Clicks | Opportunity |
|---------|----------|------------|--------|-------------|

## AI Overview Queries
| Query | Impressions | Clicks | CTR |
|-------|------------|--------|-----|

## Crawl Issues (Action Required)
| URL | Status | Fix |
|-----|--------|-----|
```

---

## Security Rules
🔴 NEVER commit `gsc_service_account.json` to Git.
🔴 NEVER log or display the private_key field.
🔴 Config files with credentials are always stored in `3_MEMORY/specs/` which is in `.gitignore`.
🟡 Service account has READ-ONLY access — it cannot modify GSC settings.

---

## Activation Examples
- "Kết nối Google Search Console"
- "Trang nào có CTR thấp cần tối ưu?"
- "Keyword nào đang rank 4-20?"
- "Báo cáo hiệu suất GSC tuần này"
- "Check AI Overview impressions"
- "Submit sitemap lên GSC"
