---
name: perf-check
description: "Kiểm tra PageSpeed và Core Web Vitals cho 1 URL, đề xuất fix ngay."
---

# /perf-check

Kích hoạt skill `core_web_vitals_optimizer` để kiểm tra performance.

## Input
- URL cần kiểm tra

## Agent thực hiện
`performance-optimizer`

## Output
- Điểm PSI (Mobile + Desktop)
- 3 chỉ số CWV (LCP, INP, CLS)
- Top 5 bottlenecks và cách fix cụ thể
