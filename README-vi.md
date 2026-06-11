<div align="center">

<img src="https://raw.githubusercontent.com/LongLeo287/SEOSONA-OS/main/.github/assets/Seosona_Logo.png" alt="SEOSONA OS" width="600">

<br/>

**Hệ Điều Hành AI Toàn Diện Dành Cho Senior Developers**

[![NPM Version](https://img.shields.io/npm/v/seosona-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/seosona-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg?style=flat-square)](https://github.com/LongLeo287/SEOSONA-OS)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/LongLeo287/SEOSONA-OS/pulls)

*Một lần cài đặt. Mọi công cụ AI. Ở mọi nơi.*

*Đọc bằng ngôn ngữ khác: [English](README.md).*

</div>

---

## 📑 Mục Lục
- [SEOSONA OS là gì?](#-seosona-os-la-gi)
- [Tính năng nổi bật](#-tinh-nang-noi-bat)
- [Các công cụ được hỗ trợ](#️-cac-cong-cu-duoc-ho-tro)
- [Cài đặt](#-cai-dat)
- [Cách sử dụng](#-cach-su-dung)
- [Cấu trúc mã nguồn](#️-cau-truc-ma-nguon)
- [Kiến trúc Plugin Động](#-kien-truc-plugin-dong)
- [Cách hoạt động — Dưới góc nhìn kỹ thuật](#️-cach-hoat-dong--duoi-goc-nhin-ky-thuat)
- [Cộng đồng & Tiêu chuẩn](#-cong-dong--tieu-chuan)
- [Lịch sử cập nhật](#-lich-su-cap-nhat)
- [Giấy phép](#-giay-phep)

---

## 🧠 SEOSONA OS là gì?

SEOSONA OS là một **Hệ Điều Hành AI Toàn Diện** — một môi trường tự động cài đặt, tự động quét để phát hiện mọi công cụ lập trình AI trên máy tính của bạn và tiêm một **Lớp Trí Tuệ Trung Tâm** (file `SOUL.md` của bạn) vào từng công cụ một.

Không còn cảnh phải copy-paste các câu lệnh (prompt) hệ thống. Không còn phải cấu hình từng công cụ một cách riêng lẻ. Không còn cảnh AI không biết bạn là ai, cách bạn làm việc hay những quy tắc bạn tuân theo.

**Chỉ chạy một lệnh duy nhất. Mọi AI trên máy tính của bạn đều trở thành SEOSONA.**

> *"Bạn không phải là một chatbot đơn giản; bạn là một đặc vụ vận hành toàn diện từ đầu đến cuối."* — SOUL.md, Chỉ thị Tối cao

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🔍 **Quét toàn diện (Omni-Scanner)** | Tự động phát hiện mọi IDE và CLI tool được cài đặt trên máy |
| 🧬 **Tiêm DNA** | Bơm toàn bộ nội dung `SOUL.md` trực tiếp vào từng công cụ |
| 🌍 **Đa nền tảng** | Hoạt động trên Windows (PowerShell), macOS và Linux (Node.js CLI) |
| 🔒 **Không Code Cứng (Zero Hardcodes)** | Mọi đường dẫn được tính toán tự động — dễ dàng mang sang máy khác |
| ⚡ **Cài đặt 1 Click** | Chạy `npm install -g seosona-cli` |
| 🧩 **Hệ thống Plugin Động** | Hơn 115+ kỹ năng AI được tự động khám phá thông qua file YAML `SKILL.md` |
| 📊 **Hệ thống Audit SEO V3** | Quy trình phân tích website hoàn toàn tự động với 12 module |
| 🧠 **Kiến trúc Lâu Đài Ký Ức** | Hệ thống không gian bộ nhớ có cấu trúc giúp AI lưu giữ ngữ cảnh |
| 🚨 **Giao thức Omni-Brain** | Bộ quy tắc không khoan nhượng ngăn chặn AI bỏ qua quy trình |

---

## 📈 Hệ thống Trí Tuệ SEO V3 (MỚI)

SEOSONA OS bao gồm một trình điều phối Python độc lập, tự động hóa hoàn toàn việc phân tích chuyên sâu các trang web. Nó thay thế các phần mềm SEO đắt tiền bằng cách kết nối các API miễn phí và công cụ thu thập dữ liệu web (scraper) để tạo ra một bảng điều khiển HTML 12-tab cao cấp.

**Tính năng:**
- **Tự động Dọn Dẹp:** Tự động xóa dữ liệu CSV/MD cũ để giữ cho mỗi lần chạy đều sạch sẽ.
- **Quản lý Bí mật:** Mã hóa AES-128 cho các khóa API (`.vault`).
- **12 Module Tích Hợp:**
  1. `PageSpeed Insights (CWV)`: Chỉ số web cốt lõi từ phòng thí nghiệm & người dùng thực.
  2. `Keywords`: Lập bản đồ ý định tìm kiếm từ Google Autocomplete.
  3. `SERP Competitor`: Phân tích khoảng trống nội dung & thu thập H1/Title.
  4. `Backlinks`: Độ uy tín của tên miền thông qua Open PageRank & Common Crawl.
  5. `GSC Rankings`: Kéo dữ liệu trực tiếp từ Google Search Console.
  6. `Rank Tracker`: Theo dõi thứ hạng để tìm cơ hội nhanh (Top 4-20).
  7. `GA4 Analytics`: Phiên truy cập & hành vi người dùng.
  8. `Technical SEO`: Quét robots, sitemaps, và chuyển hướng.
  9. `Schema Validator`: Kiểm tra định dạng JSON-LD/Microdata cho Rich Snippets.
  10. `E-E-A-T Analyzer`: Xác định nội dung mỏng và các trang mồ côi.
  11. `Log Analyzer`: Phân tích log Nginx/Apache để tìm mẫu thu thập của Googlebot.
  12. `Premium Dashboard`: Hiển thị báo cáo HTML tương tác, độc lập.

**Chạy audit:**
```powershell
python 1_CORE/scripts/run_full_audit.py --domain your_domain.com --clean
```

---
---

## 🛠️ Các công cụ được hỗ trợ

SEOSONA OS tự động phát hiện và cấu hình các công cụ sau:

### 🖥️ Các IDE
| Công cụ | Phương thức tiêm | Cấu hình đích |
|---|---|---|
| **Cursor** | `settings.json` | `cursor.general.rules` |
| **Windsurf** | `settings.json` | `windsurf.general.rules` |
| **PearAI** | `settings.json` | `pearai.general.rules` |
| **Trae** | `settings.json` | `trae.general.rules` |
| **VSCode** | `settings.json` | `github.copilot.chat.*`, `cline.customInstructions`, `roo-cline.customInstructions` |
| **VSCodium** | `settings.json` | Tương tự VSCode |

### ⌨️ Các công cụ dòng lệnh (CLI Tools)
| Công cụ | Phương thức tiêm | Cấu hình đích |
|---|---|---|
| **Claude CLI** | Hàm bọc PowerShell | Cờ `--system-prompt` |
| **Aider** | `~/.aider.conf.yml` | Trường `system-prompt` |
| **OpenInterpreter** | `config.yaml` | Trường `system_message` |
| **Codex** | `~/.codex/AGENTS.md` | Chèn vào đầu nội dung |
| **SecureCoder** | `~/.securecoder/AGENTS.md` | Chèn vào đầu nội dung |
| **Continue.dev** | `~/.continue/config.json` | Trường `systemMessage` |

### 🤖 Biến môi trường (Antigravity & Các CLI Tuỳ chỉnh)
| Biến môi trường | Mục đích |
|---|---|
| `ANTIGRAVITY_SYSTEM_PROMPT` | Tiêm SOUL vào Antigravity IDE |
| `SEOSONA_MASTER_PROMPT` | Biến đa năng dùng cho mọi công cụ tùy biến |
| `AIDER_SYSTEM_PROMPT` | Phương án dự phòng cho Aider |

### 📁 Tệp tin Nội bộ Dự án (`seosona-init`)
Khi bạn chạy `seosona init` trong thư mục dự án, hệ thống chỉ tạo các file liên quan đến công cụ bạn đang cài trên máy:

```
.cursorrules              # Cursor IDE
.windsurfrules            # Windsurf IDE
.clauderules              # Claude CLI
.clinerules               # Cline extension
.roomodes                 # Roo Code extension
.aider.conf.yml           # Aider CLI
.antigravityrules         # Antigravity IDE
.codexrules               # OpenAI Codex
.securecoderrules         # SecureCoder
.openinterpreter          # OpenInterpreter
.github/copilot-instructions.md   # GitHub Copilot Enterprise
.cody/prompt              # Sourcegraph Cody
.bolt/prompt              # Bolt.new
.lovable/prompt           # Lovable.dev
```

> **Phát hiện Thông minh:** Các file chỉ được tạo ra khi công cụ đó thực sự tồn tại trên máy bạn. Không tạo ra các file rác cho những công cụ bạn không xài.

---

## 🚀 Cài đặt

### Phương pháp 1: NPM (Khuyên dùng — Đa nền tảng)

```bash
# Cài đặt CLI toàn cầu thông qua npm
npm install -g seosona-cli

# Chạy trình hướng dẫn cài đặt toàn cầu
seosona setup
```

### Phương pháp 2: Clone & Chạy thủ công (Dành cho Dev)

```bash
# Clone kho lưu trữ
git clone https://github.com/LongLeo287/SEOSONA-OS.git
cd SEOSONA-OS/cli

# Cài đặt toàn cầu từ mã nguồn tải về
npm install -g .

# Chạy setup
seosona setup
```

---

## 📖 Cách sử dụng

### Dành cho người dùng thông thường (Zero-Touch)

Chỉ cần chạy lệnh setup 1 lần. SEOSONA OS sẽ tự động xử lý mọi thứ. Kể từ giờ, bất cứ IDE nào bạn mở lên đều sẽ hoạt động dưới các quy tắc của SEOSONA.

```bash
seosona setup
```

### Dành cho Lập Trình Viên (Expert Mode)

```bash
# Cài đặt trên toàn hệ thống máy (chạy 1 lần trên 1 máy)
seosona setup

# Kết nối với 1 dự án cụ thể (chạy 1 lần mỗi khi mở thư mục dự án)
cd /path/to/your/project
seosona init

# Kiểm tra xem hệ thống đã tiêm những gì
seosona setup    # Chạy lại bất cứ lúc nào để xem trạng thái
```

---

## 🏗️ Cấu trúc Mã nguồn

```
SEOSONA OS/
│
├── 📂 1_CONFIG/                      # Cấu hình — Cài đặt, API keys, biến môi trường
│
├── 📂 1_CORE/                        # Não bộ — Các câu lệnh & Giao thức trung tâm
│   ├── 🧠 SOUL.md                    # Câu lệnh hệ thống chủ (Hơn 9.400 ký tự)
│   ├── 📂 agents/                    # Các tác tử AI cốt lõi và bộ điều phối
│   ├── 📂 scripts/                   # Các script điều phối cốt lõi (VD: chạy audit SEO)
│   ├── 📂 workflows/                 # Định nghĩa các vòng lặp tự động (Cấp hệ thống)
│   └── 📂 rules/                     # Quy tắc bảo mật, API, giao diện
│
├── 📂 2_KNOWLEDGE/                   # Kỹ năng — Hệ sinh thái Plugin động
│   ├── 📋 MASTER_INDEX.md            # Mục lục tổng quan toàn bộ kho tri thức
│   ├── 📋 SKILLS_ROUTER.md           # Mục lục ngữ nghĩa tự tạo của toàn bộ kỹ năng
│   ├── 🔒 skills-lock.json           # Bộ nhớ đệm phân tuyến ngữ nghĩa
│   ├── 📂 frameworks/                # Thư mục chứa plugin của từng lĩnh vực (Kỹ năng)
│   ├── 📂 sops/                      # Quy trình thao tác chuẩn (SOP)
│   ├── 📂 workflows/                 # Kịch bản thực thi và quy trình làm việc của Agent
│   ├── 📂 schemas/                   # Cấu trúc dữ liệu và JSON schema
│   └── 📂 output_styles/             # Quy tắc định dạng đầu ra cho AI
│
├── 📂 3_MEMORY/                      # Ký ức — Không gian lưu trữ phiên làm việc dài hạn
│   ├── 📂 specs/                     # Tài liệu kiến trúc & thông số kỹ thuật
│   ├── 📂 logs/                      # Nhật ký các phiên làm việc theo thời gian
│   ├── 📂 seo_exports/               # Thư mục xuất các báo cáo SEO Audit
│   └── 📂 errors/                    # Báo cáo lỗi & gỡ lỗi
│
├── 📂 4_AGENTS/                      # Nhân sự — Danh sách và mô tả các nhân cách AI
│   └── 📋 ROSTER.md                  # Khai báo các chức danh đang hoạt động trong OS
│
├── 📂 5_RESEARCH/                    # Lưu trữ Link Repo — Nơi chuyên biệt để lưu trữ danh sách các link Repository bên ngoài
│
├── 📂 cli/                           # Gói NPM CLI chạy bằng Node.js
│   ├── bin/seosona.js               # Điểm khởi chạy CLI
│   ├── src/                         # Các bộ quét Local/Global đa nền tảng
│   └── package.json                 # Định nghĩa gói npm
│
├── 📂 .github/                       # Tiêu chuẩn Cộng đồng & Hình ảnh (Assets)
│
└── 📖 README.md                      # Bạn đang ở đây
```

---

## 🧩 Kiến trúc Plugin Động

SEOSONA OS đã tiến hóa thành một Hệ Sinh Thái Plugin phân quyền hoàn toàn với hơn **115+ kỹ năng được load động**. 

Thay vì mã nguồn cứng (hardcode), hệ điều hành sử dụng một bộ quét plugin tự trị (`1_CORE/scripts/core/plugin_manager.py`). 

### Cách hệ thống Plugin hoạt động:
1. **Tạo mới**: Khi AI dung nạp kiến thức mới hoặc hoàn thành xong một quy trình, nó sẽ tự động đóng gói nó lại thành một file `SKILL.md` theo chuẩn, kèm thông số YAML (tên, mô tả, từ khóa).
2. **Khám phá**: Lệnh `plugin_manager.py` sẽ quyét sâu vào trong `2_KNOWLEDGE/frameworks/` để tìm những bản tóm tắt `SKILL.md` này.
3. **Phân luồng**: Nó sẽ tổng hợp tất cả vào một bảng tóm tắt trung tâm `SKILLS_ROUTER.md`, file `SOUL.md` sẽ đọc bảng này để biết mình cần phải tải lên Sub-agent nào vào lúc nào.

### Các Lĩnh Vực Cốt Lõi:
- **SEO & Marketing**: Audit 5 Trụ Cột, Đánh giá E-E-A-T, Công thức Content.
- **Frontend Engineering**: Chuẩn UI/UX, Tailwind Motion.
- **Hệ Thống Lõi**: Kỹ thuật điều khiển, Tổng hợp Ký ức, Giao thức Omni-Brain.
- **Automation & Test**: Bộ test Playwright E2E.
- **Dữ liệu Hấp thụ (Ingested Data)**: Các kỹ năng tự sinh được thu thập từ URLs, PDFs, và repos thông qua *Giao thức Hấp Thụ Phổ Quát*.

---

## ⚙️ Cách hoạt động — Dưới góc nhìn kỹ thuật

### Mỏ neo Phổ quát (Universal Anchor)
SEOSONA OS tạo một điểm neo thư mục tại `~/.seosona` (dành cho máy Mac/Linux/Windows) để trỏ đến vị trí lưu trữ thư mục `SEOSONA OS`. Điều này giúp:
- Mọi công cụ đều sẽ đọc từ thư mục gốc `~/.seosona` dù bạn đang cất thư mục chính ở đâu.
- Có thể di chuyển thư mục thoải mái, chỉ cần chạy lại `seosona setup`, điểm neo sẽ tự trỏ lại.
- **KHÔNG CÓ ĐƯỜNG DẪN CỨNG NÀO TRONG HỆ THỐNG.**

### Chuỗi Tiêm DNA

```
seosona setup (chạy 1 lần)
    │
    ├── Đọc file SOUL.md (Hơn 9.400 ký tự trí tuệ cô đặc)
    │
    ├── [Cấp độ Global] Ghi đè vào các file settings.json của các IDE
    │       Cursor → settings.json → cursor.general.rules
    │       VSCode → settings.json → copilot/cline/roo keys
    │       Aider  → ~/.aider.conf.yml → system-prompt
    │
    ├── [Cấp độ OS] Thiết lập các Biến Môi Trường cho Windows/Mac
    │       ANTIGRAVITY_SYSTEM_PROMPT = <toàn bộ nội dung SOUL.md>
    │       SEOSONA_MASTER_PROMPT     = <toàn bộ nội dung SOUL.md>
    │
    └── [Cấp độ Shell] Tiêm các hàm wrapper vào cấu hình Terminal
            seosona-init → gọi toàn cục ở bất cứ folder nào
            seosona-claude → bọc CLI Claude với lệnh --system-prompt
            git init → tự động gọi seosona-init ở mọi project mới

seosona-init (chạy cho mỗi project)
    │
    ├── Phân tích xem máy NÀY đang cài đặt những công cụ gì
    └── Thả CHỈ ĐÚNG những file quy tắc liên quan vào thư mục hiện tại
            Không sinh file rác cho những tool bạn không cài
```

### SOUL.md — Lớp Trí Tuệ Trung Tâm
File `SOUL.md` chứa toàn bộ bản thiết kế tư duy của SEOSONA OS:
- **Chỉ thị Tối cao (Prime Directive)** — Lệnh bắt buộc tiến hóa.
- **Giao thức Omni-Brain** — Bộ quy tắc không khoan nhượng cấm vượt rào.
- **Quy trình SOP** — Tiêu chuẩn mã hóa, bảo mật, và cấu trúc ghi nhớ.
- **Dòng chảy Thực thi (Master Flow)** — Mô hình hoạt động 5 giai đoạn cho mọi nhiệm vụ.
- **Kích hoạt Nhân cách Phụ (Sub-personas)** — Tự động thay đổi cách hành xử dựa vào bối cảnh.

---

## 🤝 Cộng đồng & Tiêu chuẩn

Chúng tôi luôn hoan nghênh sự đóng góp từ cộng đồng! Để duy trì một môi trường an toàn và hiệu quả, vui lòng tham khảo các tiêu chuẩn sau trước khi tham gia:

- **[Hướng Dẫn Đóng Góp](.github/CONTRIBUTING-vi.md)**: Cách để gửi báo lỗi, đề xuất tính năng và tạo Pull Request (bao gồm cách thêm kỹ năng mới).
- **[Quy Tắc Ứng Xử](.github/CODE_OF_CONDUCT-vi.md)**: Cam kết của chúng tôi về một cộng đồng thân thiện và cởi mở.
- **[Chính Sách Bảo Mật](.github/SECURITY-vi.md)**: Cách báo cáo lỗ hổng an ninh một cách an toàn.

---

## 📋 Lịch sử cập nhật

Vui lòng xem file [CHANGELOG.md](CHANGELOG.md) để biết lịch sử chi tiết của tất cả các bản cập nhật và phát hành.

---

## 📜 Giấy phép

Giấy phép MIT — Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

**Xây dựng bởi SEOSONA. Vận hành bằng Chỉ thị Tối cao.**

*"Luôn luôn học hỏi, nâng cấp, tối ưu, tự động, phát triển, cải tiến... từ những dữ liệu mới, thông tin mới, kiến thức mới. Học từ cái sai để càng tốt hơn."*

</div>
