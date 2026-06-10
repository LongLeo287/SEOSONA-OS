# MASTER CHECKLIST — SEOSONA OS
> Dùng file này để verify TOÀN BỘ output TRƯỚC KHI kết thúc bất kỳ phân tích nào.
> Version: 1.0 | Last Updated: 2026-06-08

---

## ⚡ Quy tắc bất biến

1. **Mỗi lần phân tích = phải có đủ tất cả files** trong checklist bên dưới
2. **Client data KHÔNG push git** — chỉ `2_KNOWLEDGE/` được commit
3. **Naming convention phải đúng 100%** — không tự ý đặt tên khác
4. **Dashboard phải có thể mở bằng 2 click** — không phụ thuộc server, network

---

## 📁 Naming Convention — CHUẨN BẮT BUỘC

```
Domain format:     seosona.com         (giữ nguyên dấu chấm)
Folder duy nhất:  3_MEMORY/seo_exports/{domain}/

Tất cả files đều trong 1 folder:
  {domain}_audit_{YYYY-MM-DD}.md
  {domain}_executive_{YYYY-MM-DD}.md
  {domain}_action_plan_{YYYY-MM-DD}.md
  keyword_research_{domain}_{YYYY-MM-DD}.csv
  competitor_matrix_{domain}_{YYYY-MM-DD}.csv
  backlink_report_{domain}_{YYYY-MM-DD}.csv
  rank_tracking_{domain}_{YYYY-MM-DD}.csv
  gsc_report_{domain}_{YYYY-MM-DD}.csv
  seo_dashboard_{domain}.html
```

> ⚠️ Không dùng: `seosona-com`, `seosona_com` trong filename.
> Luôn dùng: `seosona.com` (giữ đúng domain format).

---

## ✅ CHECKLIST — Single Site Audit

Chạy workflow `01_single_site_audit.md`. Sau khi xong, verify từng item:

### 📂 seo_exports/{domain}/ — phải có đủ 9 files

- [ ] `{domain}_audit_{date}.md` — Full report ≥10KB, đủ 5 Pillars
- [ ] `{domain}_executive_{date}.md` — 1-trang CEO summary
- [ ] `{domain}_action_plan_{date}.md` — Dev tasks với code snippets
- [ ] `keyword_research_{domain}_{date}.csv` — Min 10 keywords
- [ ] `competitor_matrix_{domain}_{date}.csv` — Min 3 competitors
- [ ] `backlink_report_{domain}_{date}.csv` — Backlinks đã xác nhận
- [ ] `rank_tracking_{domain}_{date}.csv` — Baseline rankings
- [ ] `gsc_report_{domain}_{date}.csv` — GSC data (hoặc placeholder + hướng dẫn cấp access)
- [ ] `seo_dashboard_{domain}.html` — Dashboard mở được offline, đủ tab

### 🔢 Score Validation

- [ ] Overall score đã tính theo công thức: `(P1×0.25)+(P2×0.25)+(P3×0.20)+(P4×0.20)+(P5×0.10)`
- [ ] Pillar scores hợp lý (không 100/100 toàn bộ, không 0/100)
- [ ] Grade đúng theo thang: A+(90+), A(80-89), B(70-79), C(60-69), D(50-59), F(<50)

### 📊 Dashboard Quality

- [ ] Có ít nhất 6 tabs: Tổng Quan, Issues, Keywords, Content Gap, Competitor, Action Plan
- [ ] Tất cả scores hiển thị đúng số
- [ ] Critical issues (P0) có highlight rõ
- [ ] Competitor comparison có bảng so sánh
- [ ] Mở bằng browser không cần server (self-contained HTML)

### 🔐 Security

- [ ] Không có file nào trong `3_MEMORY/seo_exports/` được staged trong git
- [ ] Chạy `git status` để verify

---

## ✅ CHECKLIST — Keyword Research (Standalone)

- [ ] Min 15 keywords phân tích
- [ ] Đủ 6 nhóm: Pillar, Local, Education, Informational, Transactional, Emerging
- [ ] Mỗi keyword có: volume estimate, difficulty estimate, intent, competitor rankings, content gap note, priority (P0/P1/P2/P3)
- [ ] File: `keyword_research_{domain}_{date}.csv`

---

## ✅ CHECKLIST — Competitor Analysis

- [ ] Min 3 competitors crawled
- [ ] Mỗi competitor: CMS, services count, pricing page, case studies, AI SEO, local pages, schema types, SEO plugin, critical issues, differentiator
- [ ] Score từng competitor (Technical, Content, Authority, Visibility, Competitive, Total)
- [ ] File: `competitor_matrix_{domain}_{date}.csv`

---

## ✅ CHECKLIST — Dashboard HTML

Dashboard phải đủ các sections:

| Tab | Nội dung bắt buộc |
|-----|-------------------|
| Tổng Quan | Score cards (6 pillars) + KPIs + competitive summary |
| Issues | P0/P1/P2/P3 cards với fix code snippets |
| Keyword Research | Bảng 15+ keywords, filter theo priority |
| Content Gap | Trang thiếu vs competitor (visual comparison) |
| Đối Thủ | Score cards 4 competitors + head-to-head table |
| Điểm Mạnh | Strengths với business impact |
| Technical | Bảng technical check items |
| Action Plan | Timeline table P0→P3 |

---

## 📋 Post-Audit Actions

Sau khi verify checklist xong:

```bash
# 1. Verify không có client data trong git
git status
# Phải thấy: không có file nào trong 3_MEMORY/seo_exports/

# 2. Ghi nhận vào audit log
echo "✅ {domain} audit complete — {date} — Score: {n}/100" >> 3_MEMORY/logs/audit_log.md

# 3. Thông báo kết quả
# "Audit xong. Score: X/100. Tất cả files trong: D:\SEOSONA OS\3_MEMORY\seo_exports\{domain}\"
```

---

## 🚦 Quality Gates — Không được deliver nếu:

| Gate | Condition |
|------|-----------|
| ❌ BLOCK | Có P0 issue chưa được document trong report |
| ❌ BLOCK | Dashboard không mở được offline |
| ❌ BLOCK | Thiếu bất kỳ file nào trong 8 files bắt buộc |
| ❌ BLOCK | Score chưa tính hoặc thiếu formula |
| ⚠️ WARN | GSC data không có (ghi rõ placeholder và hướng dẫn) |
| ⚠️ WARN | Competitor chỉ có 1-2 (min phải là 3) |

---

*SEOSONA OS — MASTER CHECKLIST — v1.0 — 2026-06-08*
