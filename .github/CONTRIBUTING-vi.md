<div align="center">
  <img src="https://raw.githubusercontent.com/LongLeo287/SEOSONA-OS/main/.github/assets/Seosona_Logo.png" alt="SEOSONA OS" width="400">
</div>

*Đọc bằng ngôn ngữ khác: [English](CONTRIBUTING.md).*

---

# Đóng Góp vào SEOSONA OS

Cảm ơn bạn đã quan tâm đến việc đóng góp cho hệ điều hành SEOSONA OS! Chúng tôi hoan nghênh mọi hình thức đóng góp, bao gồm báo lỗi (bug reports), đề xuất tính năng, và các bản vá lỗi mã nguồn.

## Hướng Dẫn Đóng Góp

### 1. Fork Repository
Đầu tiên, hãy fork (tạo bản sao) kho lưu trữ này về tài khoản GitHub cá nhân của bạn.

### 2. Tạo một Feature Branch
Tạo một nhánh mới (branch) cho tính năng hoặc bản vá lỗi của bạn:
```bash
git checkout -b feature/ten-tinh-nang-cua-ban
```

### 3. Thêm một Skill mới (Nếu có)
Nếu bạn đang đóng góp một kỹ năng (skill) mới, hãy đảm bảo rằng nó tuân theo cấu trúc chuẩn của hệ thống:
```
2_KNOWLEDGE/frameworks/<domain>/<skill-name>/
├── README.md         # Tổng quan và cách sử dụng Skill
├── SKILL.md          # Câu lệnh / SOP đầy đủ của skill
├── _DIR_IDENTITY.md  # Định dạng danh tính và phạm vi thư mục
├── schema.json       # Metadata cấu trúc dữ liệu
└── references/       # Các file tài liệu tham khảo đính kèm
```

### 4. Commit Thay Đổi
Thực hiện các thay đổi của bạn và commit chúng với các thông báo rõ ràng.
```bash
git commit -m 'feat: Add new skill pack for X'
```

### 5. Push và Mở Pull Request
Đẩy (push) nhánh của bạn lên fork và mở một Pull Request (Yêu cầu kéo) vào nhánh `main` của repo SEOSONA OS.

## Các Quy Tắc Quan Trọng
- Đảm bảo tất cả các quy tắc AI và quy trình hoạt động tiêu chuẩn (SOP) được viết rõ ràng bằng định dạng Markdown.
- Giữ cho file `SOUL.md` (nếu có) luôn theo hướng module. Nếu một bộ tính năng quá lớn, hãy tách nó ra thành một `.md` skill bên ngoài lưu trong `2_KNOWLEDGE`.
- Luôn kiểm tra CLI (`seosona-cli`) ở máy nội bộ nếu bạn có thay đổi mã nguồn trong thư mục `cli/src/`.
