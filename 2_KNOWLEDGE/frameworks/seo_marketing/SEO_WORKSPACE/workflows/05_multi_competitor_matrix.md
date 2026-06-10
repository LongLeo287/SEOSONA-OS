# Workflow 05 — Competitor Analysis
> Thời gian: 2-3 giờ | Output: competitor_matrix_{domain}_{date}.csv

---

## Mục tiêu

Crawl và phân tích **3-5 đối thủ cạnh tranh trực tiếp** — so sánh theo 5 Pillars — để xác định gaps, opportunities, và positioning strategy cho domain đang audit.

---

## PHASE 1 — Xác Định Đối Thủ (10 phút)

### Step 1: Identify Competitors

**Tier 1 — Direct competitors** (cùng ngành, cùng target audience):
```
→ Google: "[dịch vụ chính] [thành phố]" → xem top 5-10
→ Google: "top [ngành] agency vietnam 2026" → xem list articles
→ Client nói ai là đối thủ
```

**Tier 2 — Indirect competitors** (cùng keywords, khác target):
```
→ Ai rank cho informational keywords của bạn?
→ Trang review/comparison nào đang list competitors?
```

**Chọn 3-5 đối thủ chính để phân tích sâu.**

---

## PHASE 2 — Data Collection (60-90 phút)

### Step 2: Crawl Competitor Homepages

Cho mỗi competitor, fetch:
```
GET https://{competitor}/
GET https://{competitor}/robots.txt
GET https://{competitor}/sitemap.xml

Extract:
- Title tag, meta description
- H1, H2s (first 5)
- Schema types present (JSON-LD)
- CMS/plugins detected (generator meta, CSS patterns)
- SEO plugin (Yoast/Rank Math/custom)
- Tracking codes (GTM ID, GA4, FB Pixel)
- Service pages (nav menu links)
- Blog/content volume (sitemap count)
- Social profiles (footer links)
- Viewport issues
- Notable features (pricing page, case studies, reviews)
```

### Step 3: Service Page Inventory

```
For each competitor:
→ Map all service/product pages from nav + sitemap
→ List pages seosona DOES NOT have → content gap
→ Note unique differentiators (methodology names, awards, clients)
```

### Step 4: Schema Analysis

```
For each competitor:
→ What @types are used?
→ Is there Person schema with author? (E-E-A-T signal)
→ Is there FAQPage? (Rich result opportunity)
→ Is there Review/AggregateRating?
→ Is priceRange declared?
→ Any schema errors?
```

### Step 5: Technical Quick-Check

```
For each competitor:
→ Mobile viewport OK? (no maximum-scale=1)
→ HTTPS active?
→ robots.txt Sitemap declared?
→ Any critical console errors visible in source?
→ Core Web Vitals estimate (image lazy load, hero preload)
```

---

## PHASE 3 — Analysis (30 phút)

### Step 6: Score Each Competitor (5 Pillars)

Dùng `sops/scoring_rubric.md` → score mỗi competitor:

| Competitor | P1 Technical | P2 Content | P3 Authority | P4 Visibility | P5 Competitive | Total |
|------------|-------------|------------|-------------|---------------|----------------|-------|
| Target domain | ? | ? | ? | ? | ? | ? |
| Competitor 1 | ? | ? | ? | ? | ? | ? |
| Competitor 2 | ? | ? | ? | ? | ? | ? |

### Step 7: Positioning Matrix

Xác định vị trí của mỗi brand trên 2 axes:
```
Axis X: Phạm vi dịch vụ (Narrow → Broad)
Axis Y: Positioning (Budget → Premium)

→ Seosona nên ở đâu?
→ Có white space chưa ai khai thác?
```

### Step 8: SWOT Competitor Summary

Cho mỗi competitor:
```
STRENGTHS:    [ưu điểm của họ mà bạn chưa có]
WEAKNESSES:   [điểm yếu của họ mà bạn có thể exploit]
OPPORTUNITIES:[gaps bạn có thể fill nhanh hơn họ]
THREATS:      [họ đang làm gì mà sẽ impact bạn trong 6 tháng tới]
```

---

## PHASE 4 — Output (20 phút)

### Step 9: Tạo Competitor Matrix CSV

**File:** `competitor_matrix_{domain}_{date}.csv`

**Columns:**
```
competitor, domain, founded, cms_plugin, tagline, services_count,
has_ecommerce, has_pricing_page, has_case_studies, has_ai_seo_services,
has_local_seo_pages, blog_posts_est, schema_types, backlinks_notable,
viewport_issue, pixel_duplicate, seo_plugin,
overall_tech_score, content_score, authority_score, visibility_score,
competitive_score, total_score, grade, key_differentiator
```

### Step 10: Update Dashboard Competitor Tab

Competitor tab trong dashboard phải bao gồm:
- [ ] Score comparison card (4-competitor grid)
- [ ] Head-to-head feature matrix table
- [ ] Key differentiator summary
- [ ] Strategic recommendations (where to attack, where to defend)

---

## Checklist Hoàn Thành

- [ ] 3-5 competitors identified
- [ ] Homepages crawled
- [ ] Service inventory completed
- [ ] Schema types logged
- [ ] Technical issues noted
- [ ] All competitors scored (5 Pillars)
- [ ] Positioning matrix mapped
- [ ] SWOT summaries written
- [ ] `competitor_matrix_{domain}_{date}.csv` exported
- [ ] Dashboard competitor tab updated

---

## Output Files

```
3_MEMORY/seo_data/{domain}/
  ✅ competitor_matrix_{domain}_{date}.csv
```

> ⚠️ File này là dữ liệu khách hàng — KHÔNG push lên git. Lưu local hoặc Google Drive.

---

## Competitors Đã Analyze

| Domain | Date | Analyst Note |
|--------|------|-------------|
| gtvseo.com | Benchmark trong workflow này | GTV = Best-in-class schema + AI SEO |
| seongon.com | Benchmark | Oldest + PPP methodology |
| toponseek.com | Benchmark | Most services + enterprise clients |
