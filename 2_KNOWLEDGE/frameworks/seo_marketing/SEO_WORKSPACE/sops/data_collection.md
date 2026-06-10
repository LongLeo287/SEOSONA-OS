# SOP: Data Collection — Thu thập Data chuẩn SEO
> Dùng trước khi bắt đầu bất kỳ audit nào. Đảm bảo data đầy đủ, tươi mới và đáng tin cậy.

---

## Checklist Data Sources theo Tier

### Tier 1 — Free, Dùng ngay (Không cần API key)

| Data | Nguồn | Cách lấy | Output |
|------|-------|---------|--------|
| robots.txt | `{domain}/robots.txt` | Fetch trực tiếp | Text |
| Sitemap | `{domain}/sitemap.xml` | Fetch trực tiếp | XML |
| HTML source | Playwright / read_url | Crawl & parse | JSON |
| Core Web Vitals | PageSpeed Insights | `https://pagespeed.web.dev/report?url={url}` | JSON (429 risk — use sparingly) |
| Google index count | Google `site:{domain}` | SERP scrape | Count |
| Keyword suggestions | Google Autocomplete | `suggestqueries.google.com/complete/search?q={keyword}` | JSON |
| SERP top 10 | Playwright | Crawl Google SERP | HTML |
| Competitor pages | Playwright / read_url | Fetch & parse | HTML |
| Common Crawl backlinks | index.commoncrawl.org | API query | JSON |

### Tier 2 — Free với Signup

| Data | Nguồn | Cách lấy | Ghi chú |
|------|-------|---------|--------|
| GSC Performance | Google Search Console API | Service Account auth | Cần verify domain + access grant |
| Domain Authority | Moz Link Explorer | Web interface / API | Free account |
| Domain PageRank | Open PageRank API | `domainpagerank.com/api/v1/urls` | 100 domains/day free |
| CrUX field data | Chrome UX Report API | API key (free) | Real user data |

### Tier 3 — Paid (Optional)

| Data | Nguồn | Chi phí | Cách lấy |
|------|-------|---------|---------|
| Backlinks full | DataForSEO | ~$50 credit free signup | MCP/API |
| SERP positions | DataForSEO SERP | Included | MCP/API |
| Keyword volumes | DataForSEO Labs | Included | MCP/API |
| Full backlink audit | Ahrefs | Paid | Web/API |

---

## Data Quality Rules

### Freshness Requirements
| Data Type | Max Age | Hành động nếu cũ hơn |
|-----------|---------|---------------------|
| GSC clicks/impressions | 7 ngày | Re-pull từ API |
| SERP positions | 7 ngày | Re-crawl |
| Backlink profile | 30 ngày | Re-query |
| Technical crawl | 30 ngày | Re-crawl |
| CWV scores | 30 ngày | Re-run PSI |

### Validation Checks
Trước khi dùng bất kỳ data nào, verify:
- [ ] Ngày thu thập data ghi rõ ràng trong filename
- [ ] Không có file rỗng (0 rows ngoài header)
- [ ] Domain trong data khớp với domain cần audit
- [ ] Không có ký tự lạ trong CSV (encoding UTF-8)

---

## File Naming Convention — BẮT BUỘC

```
# Format: {type}_{domain}_{YYYY-MM-DD}.{ext}
# Dùng domain NGUYÊN (giữ dấu chấm), KHÔNG dùng gạch ngang

✅ ĐÚNG:
  keyword_research_seosona.com_2026-06-08.csv
  backlink_report_vua2hand.vn_2026-06-08.csv
  serp_analysis_seosona.com_2026-06-08.csv
  gsc_report_seosona.com_2026-06-08.csv
  rank_tracking_seosona.com_2026-W23.csv

❌ SAI:
  keyword_research_seosona-com_2026-06-08.csv   ← gạch ngang thay chấm
  keyword_research_seosona_com_2026-06-08.csv   ← underscore thay chấm
```

---

## Storage Structure — 1 FOLDER DUY NHẤT

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
    serp_analysis_{domain}_{date}.csv
    seo_dashboard_{domain}.html
```

> ❌ KHÔNG dùng: `seo_data/`, `raw/`, `processed/` subfolder
> ✅ TẤT CẢ vào `seo_exports/{domain}/`

---

## Error Handling

| Lỗi | Hành động |
|-----|----------|
| GSC API 403 | Kiểm tra service account permissions trong GSC |
| PageSpeed 429 | Rate limited — đợi 60s hoặc dùng manual PSI |
| Playwright timeout | Giảm concurrency, retry với delay |
| Common Crawl no results | Domain quá mới hoặc ít traffic — note trong report |
| DataForSEO 402 | Credit hết — switch sang free tier |
| Google blocks scraper | Rotate user-agent, thêm delay, dùng proxy |

---

## GSC Access Setup (Nếu chưa có)

Yêu cầu chủ site thực hiện:
```
Google Search Console → Settings → Users & Permissions
→ Add user → nhập email analyst → Role: Full
→ Click Add
```
Sau khi có access, pull data: Search results → Export → CSV
