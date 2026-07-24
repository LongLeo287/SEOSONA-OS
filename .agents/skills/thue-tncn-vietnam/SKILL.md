---
name: thue-tncn-vietnam
description: Use when user asks about Vietnamese personal income tax (TNCN), tax finalization (quyet toan), dependent deductions (giam tru gia canh), freelancer/KOL/online seller tax, eTax Mobile, tax deadlines, BHXH rut 1 lan (social insurance lump-sum withdrawal), or BHTN tro cap that nghiep (unemployment insurance). Covers fiscal year 2026 under Law 109/2025/QH15 and BHXH Law 2024. Triggers on: thue, TNCN, quyet toan, ke khai, HKD, nguong mien thue, expat, KOL, seller, BHXH, rut 1 lan, BHTN, that nghiep, bao hiem.
---

# Thuế TNCN Vietnam

Skill tra cứu thuế TNCN, SOP kê khai/quyết toán, hướng dẫn theo nhóm đối tượng. Bổ sung: BHXH rút 1 lần + Trợ cấp thất nghiệp.

> [!CAUTION]
> **RISK LEVEL: MEDIUM** - Nội dung liên quan quy định pháp luật nhà nước.
> - Chỉ mang tính tham khảo, KHÔNG thay thế tư vấn thuế chuyên nghiệp.
> - Áp dụng: Kỳ tính thuế 2026 | Luật 109/2025/QH15 | Luật 09/2026/QH16 | NĐ 161/2026/NĐ-CP
> - MỌI output PHẢI đi qua Verification Gate (xem workflow bên dưới).

## Quick Navigation

| Câu hỏi | File tham khảo |
|---------|---------------|
| Thuế suất bao nhiêu? Giảm trừ gia cảnh? | `references/tong-quan-thue.md` |
| Ví dụ tính thuế cụ thể? | `references/vi-du-tinh-thue.md` |
| Cách quyết toán thuế TNCN? SOP step-by-step? | `references/sop-quyet-toan.md` |
| Tôi là freelancer/KOL/seller, phải làm sao? | `references/freelancer-guide.md` |
| Thuế khoán? HKD chuyển kê khai? Mẫu 01/CNKD? | `references/thue-khoan-guide.md` |
| Hạn nộp thuế khi nào? | `references/deadline-tracker.md` |
| Câu hỏi thường gặp | `references/faq.md` |
| Data đã thay đổi gì? Phiên bản? | `references/changelog.md` |
| Nguồn tham khảo + Confidence Level | `references/sources.md` |
| Workflow hệ thống + Flow diagrams | `references/system-flow.md` |
| Người nước ngoài (expat)? Cư trú vs không cư trú? DTA? | `references/nguoi-nuoc-ngoai-guide.md` |
| BHXH rút 1 lần? Công thức tính? Điều kiện? | `references/bhxh-rut-mot-lan-guide.md` |
| Trợ cấp thất nghiệp? Mức hưởng? Thời gian? | `references/bhtn-tro-cap-guide.md` |

## Workflow (7 bước, có 3 Verification Gate)

```
1. User hỏi về thuế
2. Xác định nhóm đối tượng
      │
      ▼
┌─────────────────────────────────────┐
│ 🔀 MULTI-INCOME CHECK              │
│ - User có > 1 nguồn thu nhập?      │
│ - Có lương + freelance/kinh doanh? │
│ - CÓ -> Load TẤT CẢ file liên quan│
│ - KHÔNG -> Load 1 file chính       │
└─────────────────────────────────────┘
      │
      ▼
3. Load reference file phù hợp
   (nếu multi-income: load đồng thời nhiều file)
      │
      ▼
┌─────────────────────────────────┐
│ 🔒 GATE 1: FRESHNESS CHECK     │
│ - Kiểm tra changelog.md        │
│ - Data > 6 tháng? -> CẢNH BÁO  │
│ - Hết expiry date? -> DỪNG     │
└─────────────────────────────────┘
      │
      ▼
4. Soạn câu trả lời
   (nếu có phép tính thuế: PHẢI tách từng bước)
      │
      ▼
┌─────────────────────────────────┐
│ 🔒 GATE 2: CROSS-VERIFY        │
│ - Số liệu khớp reference?      │
│ - Mâu thuẫn giữa các file?     │
│ - Không chắc chắn? -> Nói thẳng│
│ - Phép tính đúng từng bước?    │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ 🔒 GATE 3: SOURCE CITATION     │
│ - Ghi căn cứ pháp lý           │
│ - Ghi ngày cập nhật data       │
│ - Kèm link nguồn chính thống   │
│ - Kèm disclaimer bắt buộc      │
└─────────────────────────────────┘
      │
      ▼
5. Output + disclaimer
```

## Anti-Hallucination Rules

> [!WARNING]
> **CẤM TUYỆT ĐỐI** vi phạm các rule sau:

| # | Rule | Fallback |
|---|------|----------|
| 1 | KHÔNG BAO GIỜ bịa số liệu thuế (thuế suất, ngưỡng, mức giảm trừ) | "Tôi không chắc, vui lòng kiểm tra tại gdt.gov.vn" |
| 2 | KHÔNG BAO GIỜ khẳng định khi không chắc chắn | "Tôi không chắc, vui lòng kiểm tra tại gdt.gov.vn" |
| 3 | KHÔNG tự suy luận quy định mới khi chưa có trong reference | "Quy định này chưa có trong skill, cần cập nhật" |
| 4 | KHÔNG trả lời câu hỏi ngoài phạm vi skill (thuế TNDN, thuế XNK...) | "Skill này cover thuế TNCN + BHXH rút 1 lần + BHTN" |
| 5 | MỌI con số PHẢI kèm căn cứ pháp lý | "Theo Luật 109/2025/QH15, Điều X..." |
| 6 | KHÔNG tính nhẩm/gộp thuế lũy tiến - tách từng bước, khuyên dùng Excel đối soát | Chạy Calculation Checklist bên dưới |
| 7 | User nhiều nguồn thu nhập → load đồng thời nhiều file reference | Load tất cả file liên quan |
| 8 | Người làm công 1 nơi → hỏi "Đã ủy quyền QT cho công ty chưa?" trước khi đưa SOP | Không đưa SOP nếu đã ủy quyền |

### Calculation Checklist (Bắt buộc chạy trước khi output phép tính)

```
□ 1. Tổng thu nhập: ghi rõ gross hay net?
□ 2. BHBB tách riêng: BHXH (8%) + BHYT (1,5%) trên trần 50,6tr (lương cơ sở 2,53tr từ 01/07/2026)
                       BHTN (1%) trên lương thực tế (trần theo vùng)
□ 3. Giảm trừ bản thân: 15,5 tr/tháng (đã ghi?)
□ 4. Giảm trừ NPT: 6,2 tr x số NPT (đã hỏi số NPT?)
□ 5. Thu nhập tính thuế = (1) - (2) - (3) - (4), nếu < 0 → thuế = 0
□ 6. Áp thuế TỪNG BẬC riêng biệt (5 bậc 2026):
     10tr đầu x 5%, 20tr tiếp x 10%, 30tr tiếp x 20%,
     40tr tiếp x 30%, phần còn lại x 35%
□ 7. Cộng tổng thuế các bậc
□ 8. Khuyên user: "Đối soát lại bằng Excel hoặc eTax"
```

## Nhóm Đối Tượng

| Nhóm | Đặc điểm | File chính |
|------|---------|-----------|
| Người làm công ăn lương | Thu nhập từ lương, tiền công. **Hỏi trước: đã ủy quyền QT cho công ty chưa?** Nếu rồi -> không cần tự quyết toán | `tong-quan-thue.md` + `sop-quyet-toan.md` |
| Freelancer/KOL | Thu nhập từ dịch vụ, nội dung số | `freelancer-guide.md` |
| Người bán hàng online | Shopee, Facebook, Zalo, TikTok Shop | `freelancer-guide.md` |
| Người nước ngoài (CW/KCT) | Expat, chuyên gia, người lao động nước ngoài | `nguoi-nuoc-ngoai-guide.md` |
| Người nghỉ việc / muốn rút BHXH | Đóng BHXH 10+ năm, nghỉ việc muốn rút 1 lần | `bhxh-rut-mot-lan-guide.md` |
| Người thất nghiệp | Chấm dứt HĐLĐ, muốn nhận trợ cấp thất nghiệp | `bhtn-tro-cap-guide.md` |

## Số Liệu Nhanh (2026)

| Chỉ số | Giá trị | Căn cứ |
|--------|---------|--------|
| Giảm trừ bản thân | 15,5 tr/tháng (186 tr/năm) | NQ 110/2025/UBTVQH15 |
| Giảm trừ NPT | 6,2 tr/tháng | NQ 110/2025/UBTVQH15 |
| Ngưỡng miễn thuế HKD/CNKD | **1 tỷ/năm** (cũ: 500tr) | NĐ 141/2026/NĐ-CP + Luật 09/2026/QH16 |
| Trần đóng BHXH/BHYT | **50,6 triệu/tháng** (lương cơ sở 2,53tr từ 01/07/2026) | NĐ 161/2026/NĐ-CP |
| HĐĐT bắt buộc HKD | DT > 1 tỷ/năm, đăng ký trong 30 ngày vượt ngưỡng | NĐ 68/2026/NĐ-CP + NĐ 141/2026/NĐ-CP |
| Thuế khoán | **BÃI BỎ** từ 01/01/2026 | NQ 198/2025/QH15 |
| Biểu thuế lũy tiến | 5 bậc (5% - 35%) | Luật 109/2025/QH15, Đ.22 |
| Lệ phí môn bài | **BÃI BỎ** từ 01/01/2026 | Luật 109/2025/QH15, Đ.35 |
| Hạn quyết toán 2025 | 30/04/2026 (-> 04/05/2026) | TT 80/2021/TT-BTC |

## Mandatory Disclaimer (Bắt buộc kèm theo mọi output)

```
⚠️ Thông tin chỉ mang tính tham khảo, KHÔNG thay thế tư vấn thuế chuyên nghiệp.
Căn cứ: [ghi rõ luật/NĐ/TT]. Data cập nhật: 01/07/2026.
Kiểm tra lại tại: https://gdt.gov.vn hoặc https://canhan.gdt.gov.vn
```

## Common Mistakes

| Lỗi thường gặp | Cách xử lý đúng |
|---------------|----------------|
| Nhầm thuế khoán cũ (trước 2026) vs kê khai mới | Thuế khoán **bãi bỏ** từ 01/01/2026 - HKD dưới 1 tỷ miễn thuế, trên 1 tỷ kê khai theo thực tế |
| Áp dụng ngưỡng miễn thuế cũ (100tr/200tr/500tr) | Ngưỡng mới (NĐ 141/2026/NĐ-CP) là **1 tỷ đồng/năm** (hồi tố từ 01/01/2026) |
| Tính giảm trừ gia cảnh theo mức cũ (11tr) | Mức 2026 là **15,5 triệu/tháng** |
| Trả lời câu hỏi thuế TNDN / thuế XNK | Nói rõ: skill chỉ cover TNCN, không phải TNDN hay thuế khác |
| Nhầm BHXH rút 1 lần không có điều kiện | Nhóm B (từ 01/07/2025): rất hạn chế. Nhóm A: cần nghỉ đủ 12 tháng và đóng < 20 năm |
| Nhầm BHTN hưởng từ ngày nghỉ việc | Phải nộp hồ sơ trong 3 tháng, chờ 10 ngày mới nhận |

## Bundled References (Self-contained)

| File | Nội dung | Confidence |
|------|---------|------------|
| `references/tong-quan-thue.md` | Biểu thuế 5 bậc, giảm trừ gia cảnh, 3 ngưỡng doanh thu | 🟢 HIGH |
| `references/vi-du-tinh-thue.md` | 7 ví dụ tính thuế (lương, freelancer, KOL, seller, expat) | 🟡 MEDIUM |
| `references/sop-quyet-toan.md` | SOP quyết toán eTax Mobile (9 bước) + Cổng thuế (5 bước) | 🟢 HIGH |
| `references/freelancer-guide.md` | Decision tree 5-tier, thuế KOL/freelancer/seller | 🟢 HIGH |
| `references/deadline-tracker.md` | Lịch nộp thuế 2026 (quý + năm) | 🟢 HIGH |
| `references/faq.md` | 12 câu hỏi thường gặp | 🟡 MEDIUM |
| `references/thue-khoan-guide.md` | Thuế khoán bãi bỏ 2026, HKD chuyển kê khai, mẫu biểu | 🟢 HIGH |
| `references/changelog.md` | Lịch sử thay đổi, version, expiry dates | 🟢 HIGH |
| `references/sources.md` | Tất cả nguồn tham khảo + confidence levels | 🟢 HIGH |
| `references/nguoi-nuoc-ngoai-guide.md` | Thuế TNCN người nước ngoài: cư trú/KCT, DTA, flat 20% | 🟢 HIGH |
| `references/bhxh-rut-mot-lan-guide.md` | BHXH rút 1 lần: điều kiện, công thức, 4 case study, so sánh | 🟢 HIGH |
| `references/bhtn-tro-cap-guide.md` | Trợ cấp thất nghiệp: công thức, 3 case study, quy trình | 🟢 HIGH |

> Skill self-contained, không phụ thuộc skill bên ngoài. v1.10.0 | 01/07/2026.
