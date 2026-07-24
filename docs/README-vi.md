<div align="center">

<img src="https://raw.githubusercontent.com/LongLeo287/SEOSONA-OS/main/.github/assets/Seosona_Logo.png" alt="SEOSONA OS" width="600">

<br/>

**Hệ Điều Hành AI Toàn Diện Dành Cho Senior Developers**

[![NPM Version](https://img.shields.io/npm/v/seosona-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/seosona-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg?style=flat-square)](https://github.com/LongLeo287/SEOSONA-OS)

*Một lần cài đặt. Mọi công cụ AI. Ở mọi nơi.*

*Đọc bằng ngôn ngữ khác: [English](README.md).*

</div>

---

## 📑 Mục Lục
- [SEOSONA OS là gì?](#-seosona-os-la-gi)
- [Tính năng nổi bật](#-tinh-nang-noi-bat)

- [Tài Liệu Hệ Thống (Wiki)](#-tai-lieu-he-thong-wiki)
- [Các công cụ được hỗ trợ](#️-cac-cong-cu-duoc-ho-tro)
- [Cài đặt](#-cai-dat)
- [Cách sử dụng](#-cach-su-dung)
- [Cấu trúc mã nguồn](#️-cau-truc-ma-nguon)
- [Cách hoạt động](#️-cach-hoat-dong--duoi-goc-nhin-ky-thuat)

---

## 🧠 SEOSONA OS là gì?

SEOSONA OS là một **Hệ Điều Hành AI Toàn Diện** — một môi trường tự động cài đặt, tự động quét để phát hiện mọi công cụ lập trình AI trên máy tính của bạn và tiêm một **Lớp Trí Tuệ Trung Tâm** (file `SOUL.md` của bạn) vào từng công cụ một.

Không còn cảnh phải copy-paste các câu lệnh (prompt) hệ thống. Không còn phải cấu hình từng công cụ một cách riêng lẻ. Không còn cảnh AI không biết bạn là ai, cách bạn làm việc hay những quy tắc bạn tuân theo.

**Chỉ chạy một lệnh duy nhất. Mọi AI trên máy tính của bạn đều trở thành SEOSONA.**


---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🔍 **Quét toàn diện (Omni-Scanner)** | Tự động phát hiện mọi IDE và CLI tool được cài đặt trên máy |
| 🧬 **Tiêm DNA** | Bơm toàn bộ nội dung `SOUL.md` trực tiếp vào từng công cụ một cách động |
| 🌍 **Đa nền tảng** | Hoạt động trên Windows (PowerShell), macOS và Linux (Node.js CLI) |
| 🧠 **Hệ sinh thái Kỹ năng (Skills)** | Quản lý hệ thống Agents và Plugin kỹ năng thông minh, tránh phình to Context Window |
| 🔒 **Không Code Cứng (Zero Hardcodes)** | Hệ thống liên kết thư mục `~/.seosona` ảo giúp mã nguồn chạy được ở bất kì đâu |
| 🚨 **Giao thức Bảo mật** | Bộ quy tắc không khoan nhượng ngăn chặn việc bỏ qua quy trình |

---




## 🛠️ Các công cụ được hỗ trợ

SEOSONA OS tự động nhận diện và cấu hình các công cụ sau:

### 🖥️ IDEs
| Công cụ | Điểm Cấu Hình (Config Target) |
|---|---|
| **Cursor** | `cursor.general.rules` |
| **Windsurf** | `windsurf.general.rules` |
| **PearAI** | `pearai.general.rules` |
| **Trae** | `trae.general.rules` |
| **VSCode / VSCodium** | `github.copilot.chat.*`, `cline.customInstructions`, `roo-cline.customInstructions` |

### ⌨️ CLI Tools
| Công cụ | Điểm Cấu Hình (Config Target) |
|---|---|
| **Claude CLI** | Trình bao bọc PowerShell qua cờ `--system-prompt` |
| **Aider** | `~/.aider.conf.yml` |
| **OpenInterpreter** | `config.yaml` |
| **Codex** | `~/.codex/AGENTS.md` |
| **SecureCoder** | `~/.securecoder/AGENTS.md` |

---

## 🚀 Cài đặt

### Cách 1: Qua NPM (Khuyên Dùng — Đa Nền Tảng)

```bash
# Cài đặt CLI toàn cục thông qua npm
npm install -g seosona-cli

# Chạy trình thiết lập toàn cục
seosona setup
```

### Cách 2: Clone Thủ Công (Dành cho Lập Trình Viên)

```bash
# Clone mã nguồn
git clone https://github.com/LongLeo287/SEOSONA-OS.git
cd SEOSONA-OS/cli

# Cài đặt toàn cục từ mã nguồn cục bộ
npm install -g .

# Chạy setup
seosona setup
```

---

## 📖 Cách sử dụng

### Dành cho Người dùng Cơ bản (Tự động hóa hoàn toàn)
Chỉ cần chạy lệnh setup một lần duy nhất. Từ lúc đó, mọi IDE bạn mở lên sẽ đều hoạt động dưới quy tắc của SEOSONA.
```bash
seosona setup
```

### Dành cho Lập trình viên (Chế độ Chuyên Gia)
```bash
# Cài đặt toàn máy (chạy 1 lần cho mỗi máy)
seosona setup

# Gắn chặt vào một dự án cụ thể (chạy 1 lần tại thư mục dự án)
cd /path/to/your/project
seosona init
```

---

## 🏗️ Cấu trúc mã nguồn

```
SEOSONA OS/
├── 📂 1_CONFIG/        # Cấu hình, API keys, và Environment variables
├── 📂 1_CORE/          # Bộ Não — Chứa SOUL.md và các script vận hành
├── 📂 2_KNOWLEDGE/     # Kỹ Năng — Hệ thống plugin Frameworks và Skills được sinh tự động
├── 📂 3_MEMORY/        # Trí Nhớ — Lưu trữ SQLite db và file dữ liệu
├── 📂 cli/             # Mã nguồn của ứng dụng Node.js CLI
└── 📖 README.md        # Bạn đang ở đây
```

---

## ⚙️ Cách hoạt động — Dưới góc nhìn kỹ thuật

### Mỏ neo ảo (The Universal Anchor)
SEOSONA OS tạo ra một liên kết thư mục (junction/symlink) ảo tại `~/.seosona` trỏ thẳng tới nơi bạn đặt thư mục `SEOSONA OS`. Điều này mang lại lợi ích:
- Mọi công cụ sẽ đọc hệ thống từ `~/.seosona` bất kể bạn lưu mã nguồn thật ở ổ C hay ổ D.
- Nếu bạn đổi chỗ mã nguồn, chỉ cần chạy lại `seosona setup`, mỏ neo sẽ tự động cập nhật.
- **Không có bất kỳ đường dẫn tĩnh (hardcode path) nào trong toàn bộ hệ thống.**

---

<div align="center">
**Built by SEOSONA. Powered by the Prime Directive.**
</div>
