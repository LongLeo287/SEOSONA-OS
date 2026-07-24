---
name: schema-create
description: "Tạo JSON-LD schema markup cho bất kỳ loại trang nào (Article, FAQ, Product, LocalBusiness...)."
---

# /schema-create

Kích hoạt skill `schema_markup_generator`.

## Input
- URL hoặc nội dung trang
- Loại schema (tự phát hiện nếu không chỉ định)

## Agent thực hiện
`seo-specialist`

## Output
- Block `<script type="application/ld+json">` hoàn chỉnh
- Kết quả validate từ Google Rich Results Test
