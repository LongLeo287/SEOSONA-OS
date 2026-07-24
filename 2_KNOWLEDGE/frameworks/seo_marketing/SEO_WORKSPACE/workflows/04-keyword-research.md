# Workflow 04 — Keyword Research
> Thời gian: 1-2 giờ | Output: keyword_research_{domain}_{date}.csv

---

## Mục tiêu

Xây dựng **Keyword Universe** cho 1 domain — bao gồm seed keywords, long-tail, PAA (People Also Ask), keyword gaps vs đối thủ — để làm nền tảng cho content strategy và SEO roadmap.

---

## PHASE 1 — Seed Keywords (10 phút)

### Step 1: Xác định Seed Keywords

Từ thông tin về website/ngành, liệt kê **10-20 seed keywords** chia theo nhóm:

```
NHÓM 1 — Pillar/Service Keywords (Commercial)
  → "dịch vụ [ngành]", "[ngành] tổng thể", "mua [sản phẩm]"

NHÓM 2 — Informational Keywords
  → "[chủ đề] là gì", "cách làm [X]", "hướng dẫn [X]"

NHÓM 3 — Transactional Keywords (High Intent)
  → "báo giá [dịch vụ]", "mua [X] ở đâu", "thuê [dịch vụ]"

NHÓM 4 — Local Keywords
  → "[dịch vụ] [thành phố]", "[ngành] hcm/hanoi/danang"

NHÓM 5 — Brand/Comparison Keywords
  → "[brand] review", "[brand] vs [competitor]", "[brand] có tốt không"

NHÓM 6 — Emerging/Trending (2025-2026)
  → "AI [ngành]", "GEO/AIO [dịch vụ]", "[X] 2026"
```

---

## PHASE 2 — Research & Enrichment (30-60 phút)

### Step 2: Google Autocomplete Mining

Cho mỗi seed keyword, thu thập:
```
Input: "dịch vụ SEO ___"
→ Google autocomplete suggestions (a-z)
→ People Also Ask (PAA) boxes
→ Related searches ở cuối SERP
→ "Searches related to" section
```

### Step 3: Competitor Keyword Gaps

Crawl top 3 đối thủ → so sánh:
```
FOR EACH competitor:
  - Liệt kê services/pages chính
  - Extract keywords từ title tags + H1s + meta descriptions
  - Identify pages không có trên site mình (= content gap)
  
Output: keyword_gap_{domain}_{date}.csv
```

### Step 4: Volume & Difficulty Estimation

**Nếu có Ahrefs/SEMrush:**
```
→ Pull: Volume, KD, CPC, SERP features, top 3 URLs
→ Filter: Volume > 100/month, KD < 50 (for new sites)
```

**Nếu không có tool:**
```
→ Estimate: Very High / High / Medium / Low / Micro
→ Dựa trên: Google autocomplete suggestions count, PAA presence, SERP ad density
```

### Step 5: Intent Classification

Mỗi keyword assign 1 intent:
```
🛒 Transactional  → User muốn mua/thuê ngay
💡 Commercial     → User đang so sánh, cân nhắc
📖 Informational  → User muốn học/tìm hiểu
🧭 Navigational   → User muốn đến 1 site cụ thể
```

---

## PHASE 3 — Prioritization (15 phút)

### Step 6: Scoring Matrix

Cho mỗi keyword, đánh:

| Criteria | Điểm | Ghi chú |
|---------|------|---------|
| Volume | 1-5 | Very High=5, High=4, Med=3, Low=2, Micro=1 |
| Intent value | 1-5 | Transactional=5, Commercial=4, Info=2, Nav=1 |
| KD (inverse) | 1-5 | Easy=5, Hard=1 |
| Current content | 1-5 | None=5 (gap), Partial=3, Exists=1 |
| Competitor ranking | 1-5 | All rank=5 (confirmed demand), None rank=2 |

**Priority Score = Sum / 5**
```
P0 = Score > 4.0 (làm ngay)
P1 = Score 3.0-4.0 (1 tuần)
P2 = Score 2.0-3.0 (1 tháng)
P3 = Score < 2.0 (backlog)
```

---

## PHASE 4 — Output (15 phút)

### Step 7: Tạo CSV Output

**File:** `keyword_research_{domain}_{date}.csv`

**Columns:**
```
keyword, keyword_group, search_intent, est_volume, est_difficulty,
current_rank_{domain}, competitor_ranking_{comp1}, competitor_ranking_{comp2},
content_exists_{domain}, content_gap, priority
```

### Step 8: Keyword Universe Map

Tạo cluster map:
```
PILLAR PAGE (Cluster Hub)
  └── Content Cluster Article 1
  └── Content Cluster Article 2
  └── Content Cluster Article 3
  └── → Internal link về Pillar
```

---

## Checklist Hoàn Thành

- [ ] Seed keywords identified (min 10, recommended 20+)
- [ ] Autocomplete mining done
- [ ] PAA questions captured
- [ ] Intent classified for each keyword
- [ ] Volume/difficulty estimated
- [ ] Competitor keyword gaps identified
- [ ] Priority assigned (P0/P1/P2/P3)
- [ ] `keyword_research_{domain}_{date}.csv` exported
- [ ] Content cluster map created

---

## Output File

```
3_MEMORY/seo_data/{domain}/
  ✅ keyword_research_{domain}_{date}.csv
```

> ⚠️ File này là dữ liệu khách hàng — KHÔNG push lên git. Lưu local hoặc Google Drive.
