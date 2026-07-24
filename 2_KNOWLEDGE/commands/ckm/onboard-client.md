---
name: onboard-client
description: "Onboard khách hàng mới: tạo workspace, KPIs, timeline, checklist theo quy trình 10 bước SEOSONA."
---

# /onboard-client

Kích hoạt skill `client_onboarding_automation` để onboard khách hàng mới.

## Input cần cung cấp
- Tên khách hàng
- Ngành nghề
- Loại dịch vụ (SEO Tổng Thể / SEO Hotkey / Google Ads / Đào tạo / Combo)
- Ngân sách (nếu có)
- Brief ban đầu

## Agent thực hiện
`client-success-manager`

## Output
- Thư mục dự án tại `3_MEMORY/projects/{client_name}/`
- KPI template phù hợp loại dịch vụ
- Timeline dự án theo 10 bước SEOSONA
- Checklist theo dõi cho PM
