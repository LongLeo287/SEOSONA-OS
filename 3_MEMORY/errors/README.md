# 🐛 Error & Debug Logs (Khu vực Lỗi)

**[English]**  
This directory holds raw, verbatim records of critical errors, recurring bugs, and stack traces encountered across different projects or within the OS itself.

**[Tiếng Việt]**  
Thư mục này lưu giữ các bản ghi lỗi nguyên bản (verbatim), các bug lặp đi lặp lại, và stack traces gặp phải trong quá trình vận hành hệ điều hành hoặc các dự án.

---

## 🚨 Core Rules / Quy tắc Cốt lõi

1. **Raw Preservation:** Never summarize or truncate raw error logs when saving them here. Full stack traces are required for the AI's "Fix Loop" mechanism to accurately diagnose context.
2. **Cross-Referencing:** Link to these error files from the corresponding project's memory or `specs/` to retain complete context of *why* a particular workaround was implemented.
