# KI: Desktop App Packaging Patterns (Pake)

_Source: [tw93/Pake](https://github.com/tw93/Pake) | Wave 4 (2026-06-22) | 36k+ stars_

## Core Concept

Pake turns any webpage into a lightweight desktop app with a single command. Built with Rust + Tauri, it produces native apps that are ~20x smaller than Electron equivalents. Supports Windows, macOS, and Linux.

## Key Patterns for SEOSONA OS

### 1. One-Command Desktop Packaging
```bash
pake https://your-website.com --name "App Name" --icon icon.png
```
- Generates a native desktop app from any URL
- Output: `.exe` (Windows), `.dmg` (macOS), `.deb` (Linux)
- App size: typically 2-5MB vs 100-200MB for Electron

### 2. Configuration Options
- `--width`, `--height` — window dimensions
- `--fullscreen` — launch fullscreen
- `--transparent` — transparent window background
- `--user-agent` — custom user agent string
- `--inject` — inject custom CSS/JS into the webview
- `--system-tray` — add system tray icon
- `--multi-arch` — build for multiple architectures

### 3. Architecture (Rust + Tauri)
- **Tauri**: Rust-based framework using system webview (not bundled Chromium)
- **WRY**: Cross-platform webview rendering library
- **Result**: Tiny binary size, native performance, minimal memory usage

### 4. SEOSONA Use Cases
- **SEOSONA Dashboard**: Package the project dashboard as a desktop app
- **HyperFrames Preview**: Turn the HyperFrames preview server into a standalone app
- **SEO Tools**: Package web-based SEO audit tools as desktop utilities
- **Star Office UI**: Package the pixel office kanban as a desktop widget

## Actionable Takeaways

1. Pake is already in the SEOSONA ecosystem (`2_KNOWLEDGE/repos/Pake.md`)
2. For production use, install via: `npm install -g pake-cli`
3. The `--inject` flag enables custom branding/theming for SEOSONA apps
4. GitHub Actions workflow exists for automated builds across all platforms

## SEOSONA Integration Points

- `~/.seosona/2_KNOWLEDGE/frameworks/` — reference for desktop packaging workflows
- `~/.seosona/scripts/` — potential `build_desktop_app.sh` wrapper script
- `~/.seosona/2_KNOWLEDGE/workflows/` — add `desktop-app-packaging.md` workflow
