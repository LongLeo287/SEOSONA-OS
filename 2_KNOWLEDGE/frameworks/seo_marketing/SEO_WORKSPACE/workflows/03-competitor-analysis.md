# Workflow 03 — Deep Competitor Analysis
> Thời gian: 3-5 giờ | Output: Competitor Profile + Gap Analysis + Attack Strategy

---

## Tổng quan

Phân tích sâu **1 đối thủ cụ thể** để hiểu toàn bộ chiến lược SEO của họ và tìm điểm yếu để khai thác. Dùng khi:
- Muốn overtake 1 competitor cụ thể đang rank trên bạn
- Cần hiểu tại sao họ thành công
- Xây dựng chiến lược content và link building dựa trên competitor data

---

## Setup

```
YOUR DOMAIN: {your_domain}
TARGET COMPETITOR: {competitor_domain}
PRIMARY OBJECTIVE: [ ] Overtake in search [ ] Content gap [ ] Link building
Focus Keywords: (keywords bạn cạnh tranh nhau)
Date: {YYYY-MM-DD}
```

---

## MODULE 1 — Competitor Keyword Intelligence

### 1.1 Tổng quan keyword portfolio
```
Fetch from DataForSEO or GSC comparison:
- Total keywords ranking top 10: ___
- Total keywords ranking top 100: ___
- Estimated monthly organic traffic: ___
- Top 20 keywords by traffic contribution
```

### 1.2 Keyword Gap Analysis
```
YOUR keywords (top 100) vs COMPETITOR keywords (top 100)
→ Keywords they rank for, you don't: [LIST] ← ATTACK THESE
→ Keywords you rank for, they don't: [LIST] ← DEFEND THESE
→ Keywords you both rank for: [LIST]
   → Where they beat you: [CLOSE THE GAP]
   → Where you beat them: [REINFORCE]
```

### 1.3 Content Category Mapping
Phân loại competitor's content theo nhóm:
```
Blog/Guides: ___ posts, avg ___ words, updated ___
Product Pages: ___
Landing Pages: ___
Tools/Calculators: ___
Case Studies: ___
Comparison Pages: ___
→ Most traffic-driving category: ___
```

---

## MODULE 2 — Competitor Content Analysis

### 2.1 Top 10 Pages Dissection
Cho mỗi trong top 10 trang nhiều traffic nhất của competitor:

| # | URL | Est. Traffic | Word Count | Schema | Last Updated | Why it Works |
|---|-----|-------------|-----------|--------|-------------|-------------|
| 1 | ... | ... | ... | ... | ... | ... |

### 2.2 Content Format Audit
Xác định format nào họ dùng nhiều và hiệu quả nhất:
- [ ] Long-form guides (2000+ words)
- [ ] List posts (Top X)
- [ ] How-to tutorials
- [ ] Comparison pages (A vs B)
- [ ] Tool/calculator pages
- [ ] Data studies / original research
- [ ] Video content
- [ ] Infographics

### 2.3 GEO/AEO Strategy
```
Competitor's AI Overview citability:
- Do they appear in AI Overviews for target keywords? Y/N
- What content format triggers citations?
- What schema types do they use?
- How structured/direct are their answers?
```

### 2.4 Content Gap: Topics They Cover, You Don't
```
Topics:
1. [Topic] - Est. traffic: ___ - Difficulty: ___ - Priority: ___
2. [Topic] - Est. traffic: ___ - Difficulty: ___ - Priority: ___
...
→ Create content calendar entries for top 10 gaps
```

---

## MODULE 3 — Competitor Backlink Strategy

### 3.1 Link Building Pattern
```
Fetch top 50 referring domains:
- What types of sites link to them? (editorial, directory, guest post, resource page, sponsor)
- What anchor text do they use?
- Which content pieces attract the most links (linkbait analysis)?
```

### 3.2 Link Acquisition Channels
Identify HOW they built links:
- [ ] Guest posting (check for author bylines on other sites)
- [ ] Digital PR / data studies (earned links from news sites)
- [ ] Resource pages ("Best X" lists)
- [ ] Tool pages (people link to free tools)
- [ ] Community (Reddit, forums, Quora)
- [ ] Social media profiles

### 3.3 Link Gap: Domains Linking to Them, Not You
```
Priority outreach targets:
| Domain | DR | Why They Link to Competitor | Approach |
|--------|----|-----------------------------|---------|
| ...    | ... | Guest post | Pitch article |
| ...    | ... | Resource page | Add your tool |
| ...    | ... | Data citation | Publish better data |
```

---

## MODULE 4 — Competitor Technical Audit

### 4.1 Technical Superiority Check
```
Their CWV vs yours:
  LCP: them ___ vs you ___
  INP: them ___ vs you ___
  CLS: them ___ vs you ___

Their schema vs yours:
  They have: [list schema types]
  You have: [list]
  Gap: [what to add]

Their mobile UX vs yours:
  PSI mobile: them ___ vs you ___
```

### 4.2 Site Architecture
```
URL structure: {pattern}
Internal link depth to key pages: ___
Breadcrumb structure: Y/N
Hub-and-spoke content model: Y/N
→ What's their content architecture strategy?
```

---

## MODULE 5 — Attack Strategy

Based on all analysis, define the attack plan:

### Priority Attacks (where you can win fastest)
```
Attack 1: [Specific action]
  Why: They're weak here (score ___) and you can close gap quickly
  How: [specific tactic]
  Timeline: [X weeks]
  Est. Traffic Gain: ___/month

Attack 2: [Specific action]
  ...
```

### Defense Plan (where they might attack you)
```
Your vulnerabilities vs this competitor:
1. [Your weak point they could exploit]
   → Defensive action: ___

2. ...
```

---

## Output Files

```
3_MEMORY/seo_data/competitor_{competitor_domain}_{date}/
  competitor_keyword_gap.csv
  competitor_backlink_gap.csv
  competitor_content_gap.csv
  competitor_full_profile.md

3_MEMORY/seo_exports/
  competitor_{domain}_{date}_attack_strategy.md
  competitor_{domain}_{date}_executive.md
```

---

## Competitor Profile One-Pager
```
# Competitor Profile: {competitor_domain}
Date: {YYYY-MM-DD}

## At a Glance
- Domain Rank: ___   | Your DR: ___
- Keywords Top 10: ___  | Yours: ___
- Est. Monthly Traffic: ___  | Yours: ___
- Referring Domains: ___  | Yours: ___

## Their Biggest Strengths
1. ...
2. ...
3. ...

## Their Vulnerabilities
1. ...
2. ...

## Your #1 Attack Vector
→ ___

## 90-Day Action Plan to Compete
Week 1-2: [Quick wins]
Week 3-6: [Content creation]
Week 7-12: [Link building]
```
