# SOP: Dashboard Build — Tạo HTML Report chuẩn
> Chạy sau khi có đủ data. Output: 1 file HTML self-contained, mở bằng 2 click.

---

## Yêu cầu bắt buộc

| # | Yêu cầu | Chi tiết |
|---|---------|---------|
| 1 | **Self-contained** | Không phụ thuộc CDN, server, internet |
| 2 | **8 tabs tối thiểu** | Xem danh sách bên dưới |
| 3 | **Dark mode design** | Nền tối, màu sắc có độ tương phản cao |
| 4 | **Responsive** | Xem được ở bất kỳ màn hình nào |
| 5 | **Score visual** | Gauge/progress bar cho mỗi pillar |
| 6 | **P0 highlighted** | Critical issues nổi bật màu đỏ |
| 7 | **File size** | Tối đa 200KB — nhúng CSS/JS inline |

---

## 8 Tabs Bắt Buộc

### Tab 1: Tổng Quan
```
Content:
- Header: Domain name + audit date + Overall score (lớn, nổi bật)
- 5 Pillar score cards (Technical, Content, Authority, Visibility, Competitive)
- Score bar / gauge visualization
- P0 alert box (nếu có)
- Competitive comparison mini-table
- KPIs: Total pages, Last crawl, Blog posts, Schema types
```

### Tab 2: Issues
```
Content:
- P0 🔴 cards — đỏ, lớn, có code snippet fix
- P1 🟠 cards
- P2 🟡 cards
- P3 🟢 cards
- Mỗi card: Issue title + URL + Impact + Fix instructions
```

### Tab 3: Keyword Research
```
Content:
- Table with columns: keyword, group, intent, est_volume, priority, competitor_rankings, content_gap
- Filter by priority (P0/P1/P2/P3)
- Color-coded priority badges
```

### Tab 4: Content Gap
```
Content:
- Missing pages table (URL, keyword, competitor who has it, priority)
- Existing pages needing improvement
- Content opportunity map
```

### Tab 5: Đối Thủ (Competitor)
```
Content:
- 4 competitor score cards với overall score
- Head-to-head comparison table (all pillars)
- Feature gap table (pricing, case studies, AI SEO, etc.)
- Keyword gap summary
```

### Tab 6: Điểm Mạnh (Strengths)
```
Content:
- Strengths list với business impact explanation
- Competitive advantages vs field
- Moat analysis
```

### Tab 7: Technical
```
Content:
- Full technical check table (crawlability, schema, security, performance, mobile)
- Status: ✅ Pass / ⚠️ Warning / ❌ Fail
- Schema inventory table
- Tracking & analytics check
```

### Tab 8: Action Plan
```
Content:
- Timeline table: P0 (24h) → P1 (1 tuần) → P2 (1 tháng) → P3 (quý)
- Each row: Priority | Action | Owner | Deadline | Impact | Done checkbox
- KPI tracking table (baseline vs target)
- Review schedule
```

---

## Code Standards

```html
<!-- HTML structure -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Dashboard — {domain}</title>
  <style>/* All CSS inline — NO external CDN */</style>
</head>
<body>
  <!-- Tab navigation -->
  <!-- Tab content sections -->
  <script>/* All JS inline — NO external CDN */</script>
</body>
</html>

<!-- Design tokens -->
:root {
  --bg: #0f172a;           /* Dark navy background */
  --card: #1e293b;         /* Card background */
  --accent: #6366f1;       /* Indigo accent */
  --success: #10b981;      /* Green for pass */
  --warning: #f59e0b;      /* Yellow for warning */
  --danger: #ef4444;       /* Red for fail/P0 */
  --text: #f1f5f9;         /* Light text */
  --muted: #94a3b8;        /* Muted text */
}
```

---

## Quality Check

- [ ] Mở file HTML bằng double-click — không cần server
- [ ] 8 tabs đều hoạt động, click chuyển tab không lỗi
- [ ] Tất cả số liệu đúng với audit report
- [ ] P0 issues hiển thị đầu tiên và màu đỏ
- [ ] Không có broken layout ở màn hình 1366px
- [ ] File size < 200KB

---

## File Naming

```
seo_dashboard_{domain}.html

Ví dụ:
  seo_dashboard_seosona.com.html
  seo_dashboard_vua2hand.vn.html

Lưu tại: 3_MEMORY/seo_exports/{domain}/seo_dashboard_{domain}.html
```
