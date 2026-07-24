---
name: zalo-publish
description: "Đăng bài lên Zalo Official Account cho thị trường Việt Nam."
---

# /zalo-publish

Kích hoạt skill `zalo_oa_integration` với action `publish_article`.

## Input
- Tiêu đề bài viết
- Nội dung (hoặc URL bài blog để auto-adapt)
- Ảnh bìa (tùy chọn)

## Agent thực hiện
`social-media-manager`

## Output
- Bài viết đã publish lên Zalo OA
- Article ID để tracking
- Log action tại `3_MEMORY/seo_exports/zalo/`
