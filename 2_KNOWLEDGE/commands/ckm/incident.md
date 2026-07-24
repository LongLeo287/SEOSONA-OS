---
name: incident
description: "Kích hoạt quy trình ứng phó sự cố khẩn cấp (website bị hack, sập, mất ranking)."
---

# /incident

Kích hoạt `incident_response_sop.md`.

## Input
- Loại sự cố (hack / downtime / penalty / data loss)
- URL/domain bị ảnh hưởng
- Thời điểm phát hiện

## Agent thực hiện
`security-auditor` (cho hack), `seo-specialist` (cho penalty), `fullstack-developer` (cho downtime)

## Output
- Đánh giá mức độ nghiêm trọng (P0–P3)
- Kế hoạch khắc phục
- Incident log tại `3_MEMORY/errors/`
