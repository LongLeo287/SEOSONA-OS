# SOP: Output Delivery — Quy trình bàn giao báo cáo
> Đây là bước CUỐI CÙNG của mỗi audit. Chạy CHECKLIST.md trước khi deliver.

---

## Deliverable Set — 9 Files Bắt Buộc

Tất cả nằm trong **`3_MEMORY/seo_exports/{domain}/`**:

| # | File | Audience | Template |
|---|------|----------|---------|
| 1 | `{domain}_audit_{date}.md` | SEO Team | `templates/seo_audit_report.md` |
| 2 | `{domain}_executive_{date}.md` | CEO/Client | `templates/executive_summary.md` |
| 3 | `{domain}_action_plan_{date}.md` | Dev/Content | `templates/action_plan.md` |
| 4 | `keyword_research_{domain}_{date}.csv` | Analyst | `templates/keyword_research_template.csv` |
| 5 | `competitor_matrix_{domain}_{date}.csv` | SEO Lead | `templates/competitor_matrix_template.csv` |
| 6 | `backlink_report_{domain}_{date}.csv` | SEO Team | `templates/backlink_report_template.csv` |
| 7 | `rank_tracking_{domain}_{date}.csv` | SEO Team | `templates/rank_tracking_template.csv` |
| 8 | `gsc_report_{domain}_{date}.csv` | Analyst | `templates/gsc_report_template.csv` |
| 9 | `seo_dashboard_{domain}.html` | All | Built fresh — self-contained HTML |

---

## Output Format theo Audience

| Audience | Files chia sẻ | Detail Level |
|----------|--------------|-------------|
| CEO / Chủ shop | executive.md → PDF hoặc copy text | High-level, business impact |
| SEO Lead | audit.md + all CSVs | Chi tiết đầy đủ |
| Dev Team | action_plan.md (P0/P1 only) | Technical + code snippets |
| Content Team | keyword_research.csv + audit Pillar 2 section | Topic/keyword focused |
| All stakeholders | seo_dashboard_{domain}.html | Visual 8-tab report |

---

## Dashboard Build Protocol

Dashboard là file HTML **self-contained** (không cần server):

```
Tabs bắt buộc (8):
  1. Tổng Quan      — Score cards + KPIs + competitive summary
  2. Issues         — P0/P1/P2/P3 cards với fix code snippets
  3. Keyword Research — Table 10+ keywords + priority
  4. Content Gap    — Pages thiếu vs competitor (visual)
  5. Đối Thủ        — 4 competitor score cards + head-to-head table
  6. Điểm Mạnh      — Strengths với business impact
  7. Technical      — Full technical check table
  8. Action Plan    — Timeline table P0→P3 + owners

File location: 3_MEMORY/seo_exports/{domain}/seo_dashboard_{domain}.html
Open from the repository root: `3_MEMORY/seo_exports/{domain}/seo_dashboard_{domain}.html`
```

---

## Quality Check Before Delivery

Tự review 5 phút:
- [ ] Overall score tính đúng công thức: `(P1×0.25)+(P2×0.25)+(P3×0.20)+(P4×0.20)+(P5×0.10)`
- [ ] P0 issues không có false positive
- [ ] Action plan có realistic timeline
- [ ] Executive summary không có techspeak
- [ ] Tất cả số liệu có nguồn gốc rõ ràng
- [ ] Không có `{placeholder}` nào chưa điền
- [ ] Dashboard mở được bằng double-click (không cần server)

---

## Delivery Template (Message/Email)

```
📊 SEO Audit — {domain} — {date}

Điểm SEO tổng: {score}/100 — {grade}
Dashboard: [đường dẫn file HTML]

3 vấn đề cần xử lý ngay:
1. 🔴 {P0 issue 1}
2. 🔴 {P0 issue 2}
3. 🟠 {P1 issue 1}

3 cơ hội tăng trưởng:
1. {opportunity 1} — est. {impact}
2. {opportunity 2}
3. {opportunity 3}

Files đính kèm: Executive Summary + Action Plan

SEOSONA OS
```

---

## Archive Protocol

Không cần archive thêm — tất cả files đã trong `seo_exports/{domain}/`.

Ghi nhận vào audit log:
```bash
echo "✅ {domain} — {date} — Score: {n}/100 — Files: 9" >> 3_MEMORY/logs/audit_log.md
```

> ⚠️ Nhớ: `3_MEMORY/seo_exports/` là GITIGNORED — không push client data lên git.
