# Workflow 01 — Single Site SEO Audit
> Time: 2-4 hours | Output: Full audit report + CSV files + Dashboard HTML
> ⚠️ After completion: verify everything using `CHECKLIST.md` before reporting results

---

## Overview

This workflow guides the step-by-step complete analysis of **1 website** according to the 5 Pillars of the SEOSONA Framework.

---

## PHASE 1 — Setup (5-10 minutes)

### Step 1: Initialize Domain Workspace

**Naming convention — MUST BE CORRECT:**
```
Domain:   seosona.com  (keep the dot)
Folder:   3_MEMORY/seo_data/seosona.com/
Files:    seosona.com_audit_2026-06-08.md   ← CORRECT
          seosona-com_audit_2026-06-08.md  ← INCORRECT
          seosona_com_audit_2026-06-08.md  ← INCORRECT
```

```bash
# Create folder for domain (use root domain, keep the dot)
mkdir "3_MEMORY/seo_data/{domain}"
mkdir "3_MEMORY/seo_exports/{domain}"
```

**Fill in basic information:**
- Domain: `http~/.seosona/path/`
- Audit goal: [ ] Initial audit [ ] Periodic check [ ] Post-update check [ ] Client report
- Main competitors: (min 3 domains)
- Main target keywords: (min 10 keywords)
- Market / Language: (VN/EN/...)

### Step 2: Determine Scope
- [ ] Entire website (recommended)
- [ ] Only 1 section (blog, product, landing page)
- [ ] Only top N important pages

---

## PHASE 2 — Data Collection (30-60 minutes)

### Step 3: Technical Crawl
**Use Playwright scraper (Mandatory for JS Rendering):**
```
Crawl: sitemap.xml → get list of URLs
Fetch each URL: render JS DOM, status code, title, meta, H1, canonical, robots meta
Check: UX blockers, broken links, redirect chains, duplicate titles, CTA clickability
Output: technical_crawl_{domain}_{date}.json
```

**Quick check:**
- [ ] `{domain}/robots.txt` → accessible? Any important blocks?
- [ ] `{domain}/sitemap.xml` → exists? How many URLs?
- [ ] HTTPS → cert still valid? HSTS?
- [ ] `http~/.seosona/path/?url={domain}` → CWV scores

### Step 4: Google Search Console Pull
*(If GSC Integration is setup)*
```
Pull 90-day data:
- Top queries: clicks, impressions, CTR, position
- Top pages: clicks, impressions
- Coverage report: indexed vs not indexed
- Manual actions: any?
Output: gsc_report_{domain}_{date}.csv
```

**No GSC?** → Use Google `site:{domain}` to estimate indexed pages.

### Step 5: Keyword Research
```
Seed keywords: [keywords you want to rank for]
→ Run: seo_keyword_research/SKILL.md
→ Google Autocomplete + PAA + Related searches
Output: keyword_research_{domain}_{date}.csv
```

### Step 6: Backlink Profile
```
→ Run: seo_backlink_intel/SKILL.md
Sources: Common Crawl (free) → Moz (free signup) → DataForSEO ($)
Collect: DR, referring domains, anchor text, toxic flags
Output: backlink_report_{domain}_{date}.csv
```

### Step 7: SERP Snapshot (Top 5 Keywords)
```
→ Run: seo_serp_competitor/SKILL.md
For the 3-5 most important keywords:
- Fetch top 10 SERP
- Record current position of the domain
- Identify SERP features present
Output: serp_analysis_{keyword}_{date}.csv (1 file per keyword)
```

### Step 7.5: OSINT Entity Scan (NEW)
```
→ Run: osint-graph-investigation/SKILL.md
- Scan Author and Brand name on the deep web, social media.
- Determine if the Entity footprint is "real" or not (E-E-A-T Validation).
- Output: OSINT findings will be merged into the main Audit report.
```

---

## PHASE 3 — Analysis (45-90 minutes)

### Step 8: Score Pillar 1 — Technical & UX
Use `sops/scoring_rubric.md` → fill in scores:
```
CWV Score: ___/100
Crawlability: ___/100
JS Rendering & UX Friction (Playwright): ___/100
Indexation: ___/100
HTTPS/Security: ___/100
Mobile: ___/100
Schema: ___/100
Internal Linking: ___/100
→ P1 Average: ___/100
```

### Step 9: Score Pillar 2 — Content & Entities
```
E-E-A-T & OSINT Entity Trust: ___/100
Content Depth vs competitors: ___/100
Freshness: ___/100
AEO/GEO Readiness: ___/100
Thin Content: ___/100
→ P2 Average: ___/100
```

### Step 10: Score Pillar 3 — Authority
```
Domain Rank: ___/100
Referring Domains: ___/100
Toxic Ratio: ___/100
Anchor Text Health: ___/100
→ P3 Average: ___/100
```

### Step 11: Score Pillar 4 — Visibility
```
Keyword Portfolio (Top 10): ___/100
Avg CTR: ___/100
SERP Features: ___/100
AI Overview Presence: ___/100
→ P4 Average: ___/100
```

### Step 12: Score Pillar 5 — Competitive
```
SERP Overlap: ___/100
Keyword Gap: ___/100
→ P5 Average: ___/100
```

### Step 13: Calculate Overall Score
```
TOTAL = (P1 × 0.25) + (P2 × 0.25) + (P3 × 0.20) + (P4 × 0.20) + (P5 × 0.10)
TOTAL = ___/100 → Grade: ___
```

### Step 14: Identify Issues & Prioritize
List all issues by priority:

| Priority | Issue | Pillar | Est. Impact | Effort |
|----------|-------|--------|-------------|--------|
| P0 🔴 | ... | ... | High | ... |
| P1 🟠 | ... | ... | ... | ... |
| P2 🟡 | ... | ... | ... | ... |
| P3 🟢 | ... | ... | Low | ... |

---

## PHASE 4 — Output (15-30 minutes)

### Step 15: Create Deliverables

**Files to create — all in 1 folder:**
```
3_MEMORY/seo_exports/{domain}/     ← 1 single folder, 9 mandatory files
  {domain}_audit_{date}.md           ← from template: templates/seo_audit_report.md
  {domain}_executive_{date}.md       ← from template: templates/executive_summary.md
  {domain}_action_plan_{date}.md     ← from template: templates/action_plan.md
  keyword_research_{domain}_{date}.csv
  competitor_matrix_{domain}_{date}.csv
  backlink_report_{domain}_{date}.csv
  rank_tracking_{domain}_{date}.csv
  gsc_report_{domain}_{date}.csv
  seo_dashboard_{domain}.html        ← Build from scratch, self-contained HTML
```

**Dashboard must have 8 tabs:**
- Overview, Issues, Keyword Research, Content Gap, Competitors, Strengths, Technical, Action Plan

**Verify using CHECKLIST.md before reporting!**

---

## Completion Checklist

- [ ] Technical crawl done
- [ ] GSC data pulled (or noted as unavailable)
- [ ] Keyword research done
- [ ] Backlink profile done
- [ ] SERP snapshots done
- [ ] All 5 pillars scored
- [ ] Issue list with P0/P1/P2/P3 classification
- [ ] `seo_audit_report.md` filled
- [ ] CSVs exported
- [ ] Dashboard loaded and screenshotted
- [ ] Executive summary written
- [ ] Google Sheets link generated (if applicable)
- [ ] Action plan created with owners and deadlines

---

## Output Files Checklist

```
3_MEMORY/seo_exports/{domain}/     ← 1 folder, 9 mandatory files
  ✅ {domain}_audit_{date}.md         (≥10KB, all 5 Pillars)
  ✅ {domain}_executive_{date}.md     (1-page CEO)
  ✅ {domain}_action_plan_{date}.md   (dev tasks + code)
  ✅ keyword_research_{domain}_{date}.csv
  ✅ competitor_matrix_{domain}_{date}.csv
  ✅ backlink_report_{domain}_{date}.csv
  ✅ rank_tracking_{domain}_{date}.csv
  ✅ gsc_report_{domain}_{date}.csv
  ✅ seo_dashboard_{domain}.html      (self-contained, 8 tabs)
```

> ✅ Finally: run `CHECKLIST.md` to verify quality gates.
> ❌ DO NOT push client data to git — `3_MEMORY/seo_exports/` is gitignored.
