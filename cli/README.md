# 🛠️ SEOSONA CLI

**[English]**  
This directory contains the source code for the `seosona-cli` NPM package. The CLI is the entry point for the SEOSONA Operating System, responsible for scanning the host machine, detecting installed IDEs/Tools, and injecting the `SOUL.md` intelligence layer.

**[Tiếng Việt]**  
Thư mục này chứa mã nguồn của gói NPM `seosona-cli`. CLI là điểm truy cập đầu tiên của Hệ Điều Hành SEOSONA, chịu trách nhiệm quét hệ thống máy tính, phát hiện các IDE/Công cụ đã cài đặt và tiêm lớp trí tuệ `SOUL.md` vào chúng.

---

## 📂 Structure / Cấu trúc
- `bin/seosona.js`: CLI entry point.
- `src/`: Core logic for global injection (`seosona setup`) and local project initialization (`seosona init`).
- `package.json`: NPM manifest, dependencies, and build scripts.

## ⚙️ Development / Phát triển
When developing or debugging the CLI, use the following commands:
*(Khi phát triển hoặc sửa lỗi CLI, sử dụng các lệnh sau)*

```bash
# Build and install locally for testing
npm run build
npm install -g .

# Run the CLI to test injection
seosona setup
```

## 🚨 Core Rules / Quy tắc Cốt lõi
- **Zero Hardcodes:** Do not hardcode absolute paths. Always use dynamic resolution based on `~/.seosona` or the current workspace root.
- **Cross-Platform:** All OS-level environment variables and file system operations must support Windows (PowerShell/CMD), macOS, and Linux.
- **Silent Fallbacks:** If an IDE is not detected, skip it silently. Do not crash the CLI or spam the user's terminal with errors.

## Contents

| Folder | What's inside |
|---|---|
| `src/` | CLI source (the `seosona` command implementation). |
| `bin/` | Executable entry point(s). |
| `scripts/` · `assets/` | Build/setup scripts + bundled assets. |

| File | Purpose |
|---|---|
| `package.json` | The publishable `seosona-cli` package manifest. |
