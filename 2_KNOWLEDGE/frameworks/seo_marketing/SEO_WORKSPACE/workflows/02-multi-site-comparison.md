# Workflow 02 — Multi-Site SEO Comparison
> Thời gian: 1-2h/site | Output: Comparison Matrix + Winner Analysis + Opportunity Map

---

## Tổng quan

So sánh **N website** (tối đa không giới hạn, thực tế 3-10 site) trên cùng bộ tiêu chí 5 Pillars. Dùng khi:
- So sánh website của bạn với đối thủ
- Client muốn biết họ đứng đâu trong ngành
- Cần xác định "best-in-class" benchmark

---

## Setup

### Định nghĩa nhóm so sánh
```
PRIMARY: {your_domain}         ← Website chính cần đánh giá
BENCHMARK: {competitor_1}     ← Đối thủ số 1 trên SERP
BENCHMARK: {competitor_2}     ← Đối thủ số 2
BENCHMARK: {competitor_3}     ← Đối thủ số 3
[Optional thêm site...]

Target Industry/Niche: ___
Primary Language/Market: ___
Comparison Date: {YYYY-MM-DD}
```

---

## Execution Protocol

### Bước 1: Run Single-Site Audit cho mỗi domain
Chạy `01_single_site_audit.md` cho từng domain trong danh sách.
- Thu thập tất cả scores P1→P5
- Lưu data vào `3_MEMORY/seo_data/{domain}/`
- **Song song hóa** nếu có thể (mỗi domain là 1 luồng riêng)

### Bước 2: Điền Comparison Matrix
Sau khi có scores của tất cả domain, điền vào template `templates/comparison_matrix.md`:

```
| Metric                  | {domain_1} | {domain_2} | {domain_3} | Winner |
|------------------------|------------|------------|------------|--------|
| P1: Technical (25%)    | ___        | ___        | ___        | 🏆 ___ |
| P2: Content (25%)      | ___        | ___        | ___        | 🏆 ___ |
| P3: Authority (20%)    | ___        | ___        | ___        | 🏆 ___ |
| P4: Visibility (20%)   | ___        | ___        | ___        | 🏆 ___ |
| P5: Competitive (10%)  | ___        | ___        | ___        | 🏆 ___ |
| OVERALL SCORE          | ___        | ___        | ___        | 🏆 ___ |
```

### Bước 3: Deep-Dive So sánh từng Pillar

#### Technical Comparison
| Check | {d1} | {d2} | {d3} |
|-------|------|------|------|
| LCP | ___s | ___s | ___s |
| INP | ___ms | ___ms | ___ms |
| CLS | ___ | ___ | ___ |
| Mobile Score | ___ | ___ | ___ |
| Indexed Pages | ___ | ___ | ___ |
| Schema Types | ___ | ___ | ___ |

#### Keyword Overlap Analysis
```
Lấy top 50 keywords của mỗi domain từ GSC/DataForSEO
→ Tính overlap matrix:
   {d1} ∩ {d2}: ___%
   {d1} ∩ {d3}: ___%
   {d2} ∩ {d3}: ___%
   All 3 overlap: ___%
→ Keywords only {d1} ranks for (unique advantage): list
→ Keywords only {d2} ranks for (opportunity gap): list
```

#### Backlink Domain Comparison
| Metric | {d1} | {d2} | {d3} | Industry Avg |
|--------|------|------|------|-------------|
| Domain Rank | ___ | ___ | ___ | ___ |
| Referring Domains | ___ | ___ | ___ | ___ |
| Avg Linking DR | ___ | ___ | ___ | ___ |

#### Content Depth Comparison
```
For top 5 shared keywords, compare content on each domain:
Keyword: ___
  {d1}: ___ words, schema: ___, has FAQ: Y/N, last updated: ___
  {d2}: ___ words, schema: ___, has FAQ: Y/N, last updated: ___
  {d3}: ___ words, schema: ___, has FAQ: Y/N, last updated: ___
  Best performer: ___
  Why: ___
```

### Bước 4: Identify Opportunity Map
Cho mỗi weakness của PRIMARY domain so với competitors:

| Gap | Competitor Advantage | Effort to Close | Priority |
|-----|---------------------|----------------|----------|
| Content depth on keyword X | {d2} has 3x more content | Medium | P1 |
| Backlinks from domain Y | {d3} has 50 links | High | P2 |
| Featured snippet for Z | {d2} owns it | Low | P0 |

---

## Output Files

```
3_MEMORY/seo_exports/
  _comparisons/                     ← Folder cho multi-site comparison
    comparison_{date}_matrix.csv
    comparison_{date}_executive.md
    comparison_{date}_dashboard.html
    comparison_{date}_opportunity_map.csv
```

> ⚠️ Mỗi domain riêng lẻ vẫn có folder `seo_exports/{domain}/` với đủ 9 files.
> Multi-site comparison output đặt trong `seo_exports/_comparisons/`.

---

## Visualization: Radar Chart Data
Chuẩn bị data cho radar chart (có trong seo_dashboard.html):
```json
{
  "labels": ["Technical", "Content", "Authority", "Visibility", "Competitive"],
  "datasets": [
    { "label": "{domain_1}", "data": [P1, P2, P3, P4, P5] },
    { "label": "{domain_2}", "data": [P1, P2, P3, P4, P5] },
    { "label": "{domain_3}", "data": [P1, P2, P3, P4, P5] }
  ]
}
```

---

## Quick Summary Template
```
# {domain_1} vs {domain_2} vs {domain_3}
Overall: {d1}=___ | {d2}=___ | {d3}=___
Winner: {domain}

Your biggest strengths vs competitors:
1. ...
2. ...

Your biggest gaps vs competitors:
1. ...
2. ...

3 Highest-impact actions:
1. [P0] ...
2. [P1] ...
3. [P1] ...
```
