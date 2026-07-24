# Knowledge Item: Skill Creator Ultra
**Nguồn:** `marketingjuliancongdanh79-pixel/skill-generator`
**Tier:** S - Core
**Danh mục:** Agent Skills / Prompt Ops
**Trạng thái:** Đã nạp (Ingested)

## Tóm tắt Hệ thống (Core Concept)
Dự án là một meta-skill (skill để tạo skill), đóng vai "Skill Architect". Nó không chỉ là một file prompt đơn giản mà là một hệ thống 8 pha (8-Phase Pipeline) giúp biến ý tưởng thô của người dùng thành một AI Skill hoàn chỉnh đạt chuẩn production.

## Kiến trúc 8 Phase
1. **Interview (Deep Interview):** Khảo sát mục tiêu, input/output, edge cases. Hỗ trợ Fast Track nếu user đã rõ luồng.
2. **Extract:** Trích xuất thông tin thô thành cấu trúc skill chuẩn.
3. **Detect:** Đánh giá độ phức tạp (1-21+ điểm) để thiết kế kiến trúc thư mục cho skill (chỉ cần SKILL.md hay cần cả resources/, scripts/).
4. **Generate:** Viết SKILL.md (với 4 thành phần bắt buộc: Goal, Instructions, Examples, Constraints).
5. **Test:** Chạy dry-run, xác nhận validation.
6. **Eval (Tùy chọn):** Đánh giá định lượng qua 7 tiêu chí.
7. **Iterate (Tùy chọn):** Vòng lặp tối ưu hóa.
8. **Optimize (Tùy chọn):** Tối ưu Description làm semantic trigger.

## Bài học thiết kế Agent Skill (Learnings)
- **Atomic Logic:** 1 skill = 1 việc. Tên có chữ "and" thì nên tách ra.
- **Show Don't Tell:** Cung cấp 2-3 ví dụ hoàn hảo hiệu quả hơn 50 dòng mô tả quy tắc (rules).
- **Black Box Scripts:** AI dùng script thông qua flag `--help`, không nên yêu cầu AI tự phân tích source code của script.
- **Semantic Trigger:** Description phải viết kiểu "pushy" (e.g. Dùng khi user nói "tạo skill", "make a new skill"...) để LLM tự động kích hoạt.
- **Giới hạn 500 dòng:** SKILL.md không nên vượt quá 500 dòng để tránh loãng context. Nếu dài hơn, phân mảnh vào `resources/`.

## Ứng dụng trong SEOSONA OS
Hệ thống Skill Creator Ultra này phải được nạp nguyên bản vào SEOSONA OS dưới dạng một plugin / skill lõi (`.agents/skills/skill-creator-ultra/`). Nó sẽ giúp Antigravity và các persona khác trong SEOSONA tự động sản xuất thêm hàng trăm skill khác một cách có hệ thống.
