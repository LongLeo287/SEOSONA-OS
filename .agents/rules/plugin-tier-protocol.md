# Giao thức Plugin 3 Tầng (3-Tier Protocol)
# Được đồng hóa từ kiến trúc OmniClaw

Mọi Agent và System Daemon trong SEOSONA OS phải tuân thủ nghiêm ngặt nguyên tắc phân bổ tài nguyên này để hệ thống không bị sập (OOM) hoặc quá tải.

## Tier 1 (Core Infrastructure)
- **Vị trí**: `.agents/skills/_TIER_1_CORE/`
- **Quyền hạn**: Luôn luôn chạy (Always On).
- **Phạm vi**: Gồm các kỹ năng nền tảng như: Bộ nhớ (MemPalace), Thu thập dữ liệu (UAP), Trình thông dịch lõi.
- **Yêu cầu**: Cấm đưa các model nặng (như image generation, pdf parser nặng) vào Tier 1.

## Tier 2 (Lazy-Load Plugins)
- **Vị trí**: `.agents/skills/_TIER_2_LAZY_LOAD/`
- **Quyền hạn**: Load theo yêu cầu (Spin up on demand).
- **Phạm vi**: Chứa các kỹ năng chuyên biệt nặng (Tạo ảnh, crawl web nặng bọc Chromium, NLP phân tích sâu).
- **Yêu cầu**: Agent CHỈ được phép load các tool ở Tier 2 khi có Task cụ thể. Sau khi hoàn thành Task, phải tự động đóng tiến trình/hủy vùng nhớ liên quan. KHÔNG để ngầm (zombie).

## Tier 3 (Blacklisted/Deprecate)
- **Vị trí**: `.agents/skills/_TIER_3_BLACKLIST/`
- **Quyền hạn**: Cấm kích hoạt (Zero Execution).
- **Phạm vi**: Các module cũ, chứa mã độc bị `02b_security_guard` bắt, hoặc gây rò rỉ RAM.
- **Yêu cầu**: Mọi lời gọi API/CLI tới mã nguồn trong Tier 3 đều bị cấm.

---
> Các Agent như Orchestrator hay OA Academy khi tạo Skill mới phải gán nhãn Tier rõ ràng trong `SKILL.md`.
