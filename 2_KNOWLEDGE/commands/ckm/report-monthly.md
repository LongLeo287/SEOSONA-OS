---
name: report-monthly
description: "Tạo báo cáo SEO hàng tháng tự động từ dữ liệu GSC, GA4, và Rank Tracker."
---

# /report-monthly

Kích hoạt skill `report_generator` để tạo báo cáo tháng cho khách hàng.

## Input cần cung cấp
- Tên khách hàng
- Tháng báo cáo
- Metrics cần bao gồm (rankings, traffic, conversions — mặc định: tất cả)

## Agent thực hiện
`analytics-analyst`

## Output
- Báo cáo SEO theo format `seo_reporting_sop.md`
- Lưu tại `3_MEMORY/seo_exports/{client_name}/reports/`
