---
name: document-analysis-prompts
description: A collection of 7 advanced structural prompts for analyzing, extracting, and synthesizing complex PDF documents.
---

# Document Analysis Prompts

This skill provides 7 advanced mental models (prompts) for the R&D and OSINT Agents to process heavy PDF documents, research papers, or reports. Combine these with `autoresearch` for maximum impact.

## 1. ELI5 (Đơn giản hóa nhưng không làm mất chiều sâu)
Sử dụng khi cần diễn giải tài liệu học thuật phức tạp cho người mới:
> “Hãy giải thích tài liệu PDF này theo cách đơn giản nhất có thể cho người mới bắt đầu, nhưng vẫn giữ được chiều sâu nội dung.
> Với mỗi ý chính:
> → Giải thích bằng ngôn ngữ dễ hiểu, gần gũi.
> → Đưa ra một ví dụ/so sánh thực tế.
> → Chia nhỏ logic thành các bước rõ ràng, từng bước một.
> Sau đó, thêm phần ‘tại sao điều này quan trọng’ cho mỗi khái niệm.”

## 2. Executive Briefing (Thông tin cho cấp quản lý)
Sử dụng khi cần báo cáo cho CEO/C-level để ra quyết định:
> “Hãy chuyển tài liệu PDF này thành một bản tóm tắt điều hành (executive briefing) có thể dùng ngay để ra quyết định.
> Cấu trúc gồm:
> → Insight cốt lõi (điều gì đang diễn ra)
> → Tại sao điều này quan trọng (tác động)
> → Bằng chứng (dữ liệu hoặc ví dụ)
> → Hành động đề xuất
> Kết thúc bằng: 3 ưu tiên hàng đầu và Quyết định quan trọng nhất cần đưa ra.”

## 3. Skeptic’s Review (Tư duy phản biện)
Sử dụng khi cần Audit một tài liệu chiến lược, tìm lỗ hổng:
> “Hãy đóng vai một nhà phân tích phản biện và kiểm tra độ vững của nội dung trong tài liệu PDF này.
> Với mỗi luận điểm chính:
> → Xác định các giả định nền tảng.
> → Đánh giá độ mạnh/yếu của bằng chứng.
> → Chỉ ra những thiên lệch hoặc góc nhìn còn thiếu.
> Sau đó, tóm tắt những điểm yếu lớn nhất và đề xuất cách cải thiện để lập luận thuyết phục hơn.”

## 4. Data Miner (Khai thác số liệu)
Sử dụng khi cần đọc báo cáo tài chính, báo cáo SEO:
> “Hãy trích xuất toàn bộ dữ liệu số từ tài liệu PDF này và sắp xếp chúng một cách rõ ràng.
> Sau đó:
> → Xác định các xu hướng hoặc mẫu hình (patterns).
> → Chỉ ra những điểm mâu thuẫn hoặc bất thường.
> → Giải thích dữ liệu đó thực sự hàm ý điều gì.
> Tập trung biến những con số thô thành các insight có ý nghĩa.”

## 5. Study Guide (Học để làm chủ)
Sử dụng khi Agent cần hấp thụ tài liệu để tự học (Self-learning):
> “Hãy chuyển tài liệu PDF này thành một tài liệu học tập.
> → Chia nội dung thành các chủ đề chính kèm giải thích rõ ràng.
> → Làm nổi bật những ý quan trọng.
> → Chỉ ra các hiểu lầm phổ biến.
> → Thể hiện mối liên kết giữa các ý tưởng.
> Sau đó, bổ sung 5 câu hỏi mang tính thử thách kèm đáp án để kiểm tra mức độ hiểu sâu.”

## 6. So What? Action Plan (Từ Insight đến Hành động)
Sử dụng khi phân tích Case Study để lập kế hoạch triển khai cho SEOSONA:
> “Hãy chuyển tài liệu PDF này thành một kế hoạch hành động thực tế.
> Với mỗi insight chính:
> → Xác định hành động cần thực hiện & Vì sao nó hiệu quả.
> → Xác định nguồn lực cần thiết & Nêu rõ rủi ro.
> Sau đó, ưu tiên các hành động dựa trên (Mức độ tác động / Công sức), và phác thảo 3 bước đầu tiên để bắt đầu ngay lập tức.”

## 7. Structure Hacker (Đọc nhanh 100 trang / 10 phút)
Sử dụng trong khâu Triage (Sàng lọc) tài liệu nhanh của UAP:
> “Hãy phân tích cấu trúc của tài liệu PDF này để hiểu nhanh nội dung.
> → Chia nhỏ từng phần và nêu rõ mục đích của mỗi phần.
> → Tóm tắt mỗi phần trong một câu.
> → Làm nổi bật những trang quan trọng nhất nên đọc trước.
> Sau đó, tạo một ‘lộ trình đọc nhanh’ giúp hiểu 80% nội dung tài liệu trong thời gian ngắn nhất.”

## Trigger Conditions
Activate these prompt templates whenever the `autoresearch` agent or `prompt-master` needs to extract knowledge from PDFs, Whitepapers, or lengthy web pages.
