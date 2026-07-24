# KI: tw93/Pake

## Overview
🤱🏻 Turn any webpage into a desktop app with one command. 🤱🏻 一键打包网页生成轻量桌面应用。

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 118 files across 29 directories
- **File types:** .ts: 31, .md: 25, .icns: 17, .yml: 10, .json: 9, .yaml: 3, .toml: 3
- **Key dependencies:** @tauri-apps/api, @tauri-apps/cli, chalk, commander, execa, file-type, fs-extra, icon-gen, loglevel, ora, prompts, psl
- **Dev dependencies:** @rollup/plugin-alias, @rollup/plugin-commonjs, @rollup/plugin-json, @rollup/plugin-replace, @rollup/plugin-terser, @types/fs-extra, @types/node, @types/prompts
- **Keywords:** pake, pake-cli, rust, tauri, no-electron, productivity

## Core Capabilities
- 🎐 **Lightweight**: Installer is nearly 20 times smaller than Electron packages, typically under 10M on disk
- 🚀 **Fast**: Built with Rust Tauri, much faster than traditional JS frameworks with lower memory usage
- ⚡ **Easy to use**: One-command packaging via CLI or online building, no complex configuration needed
- 📦 **Feature-rich**: Supports shortcuts, immersive windows, drag & drop, style customization, ad removal

## Documentation Sections
- Features
- Getting Started
- Popular Packages
- Command-Line Packaging
- Install Pake CLI
- Basic usage - automatically fetches website icon
- Advanced usage with custom options
- Development
- Install dependencies
- Local development [right-click to open debug mode]

## Available Commands
- `npm run start` -- pnpm run dev
- `npm run dev` -- pnpm run tauri dev
- `npm run build` -- tauri build
- `npm run build:debug` -- tauri build --debug
- `npm run build:mac` -- tauri build --target universal-apple-darwin
- `npm run analyze` -- cd src-tauri && cargo bloat --release --crates
- `npm run tauri` -- tauri
- `npm run cli` -- cross-env NODE_ENV=development rollup -c -w
- `npm run cli:dev` -- cross-env NODE_ENV=development rollup -c -w
- `npm run cli:build` -- cross-env NODE_ENV=production rollup -c
- `npm run test` -- pnpm run cli:build && cross-env PAKE_CREATE_APP=1 node tests/index.js
- `npm run format` -- prettier --write . --ignore-unknown && find tests -name '*.js' -exec sed -i '' '

## Core Structure
```
  .dockerignore
  .editorconfig
  .gitattributes
  .gitignore
  .npmignore
  .npmrc
  .pnpmrc
  .prettierignore
  AGENTS.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  CONTRIBUTORS.svg
  Dockerfile
  LICENSE
  LICENSE-EXCEPTION
  README.md
  README_CN.md
  TRADEMARK.md
  action.yml
  default_app_list.json
  icns2png.py
  package.json
  pnpm-lock.yaml
  rollup.config.js
  rust-toolchain.toml
  tsconfig.json
  vitest.config.ts
  .agents/
    skills/
      code-review/
        SKILL.md
      github-ops/
        SKILL.md
      release/
        SKILL.md
      use-pake/
        SKILL.md
  .claude/
    rules/
      rust.md
    skills/
      release/
        SKILL.md
  .github/
    FUNDING.yml
    copilot-instructions.md
    ISSUE_TEMPLATE/
      bug-report.yml
      config.yml
      feature.yml
    actions/
      setup-env/
        action.yml
    workflows/
      npm-publish.yml
      pake-cli.yaml
      quality-and-test.yml
      release.yml
      single-app.yaml
      update-contributors.yml
  bin/
    cli.ts
    defaults.ts
    dev.ts
    types.ts
    builders/
      BaseBuilder.ts
      BuilderProvider.ts
      LinuxBuilder.ts
      MacBuilder.ts
      WinBuilder.ts
      env.ts
    helpers/
      cli-program.ts
      merge.ts
      rust.ts
      tauriConfig.ts
    options/
      icon.ts
      index.ts
      logger.ts
    utils/
      combine.ts
      dir.ts
      error.ts
      ico.ts
      icon-source.ts
      info.ts
      mirror.ts
      name.ts
      platform.ts
      shell.ts
      targets.ts
      url.ts
      validate.ts
  docs/
    README.md
    README_CN.md
    advanced-usage.md
    advanced-usage_CN.md
    cli-usage.md
    cli-usage_CN.md
    faq.md
    faq_CN.md
    github-actions-usage.md
    github-actions-usage_CN.md
    pake-action.md
  scripts/
    check-release-version.mjs
  src-tauri/
    .gitignore
    Cargo.lock
    Cargo.toml
    Info.plist
    build.rs
    entitlements.plist
    pake.json
    rust_proxy.toml
    tauri.conf.json
    tauri.linux.conf.json
    tauri.macos.conf.json
    tauri.windows.conf.json
    assets/
      main.wxs
      macos/
        dmg/
          background.png
    capabilities/
      default.json
    icons/
      chatgpt.icns
      deepseek.icns
      excalidraw.icns
      flomo.icns
      gemini.icns
      grok.icns
      icon.icns
      icon.png
      lizhi.icns
      programmusic.icns
      qwerty.icns
      twitter.icns
      wechat.icns
      weekly.icns
      weread.icns
      xiaohongshu.icns
     
```

## Quick Start
```bash
pnpm install -g pake-cli
pake https://github.com --name GitHub
pake https://weekly.tw93.fun --name Weekly --icon https://cdn.tw93.fun/pake/weekly.icns --width 1200 --height 800 --hide-title-bar
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md - Pake Project Knowledge Base

> Project-specific Rust + Tauri rules: `.claude/rules/rust.md`. Release runbook: `.claude/skills/release/SKILL.md` (run `/release`).

## Project Identity

**Pake** - Turn any webpage into a lightweight desktop app with one command.

- **Purpose**: Package any website into a ~5MB desktop app (20x smaller than Electron)
- **Stack**: Tauri v2 (Rust) + TypeScript CLI
- **Platforms**: macOS, Windows, Linux
- **Mechanism**: Uses system webview (WebKit on macOS/Linux, WebView2 on Windows)

## Repository Structure

```
Pake/
├── bin/                   # CLI source code (TypeScript)
│   └── cli.ts            # Main CLI entry (Commander.js)
├── src-tauri/             # Tauri Rust application
│   ├── src/              # Rust source code
│   ├── src/app/          # window creation, setup, menu, config, and invokes
│   ├── src/inject/       # injected JS/CSS behavior
│   ├── Cargo.toml        # Rust dependencies and version
│   ├── tauri.conf.json   # Tauri configuration and version
│   └── .cargo/           # Cargo configuration (gitignored)
├── dist/                 # Compiled CLI output
├── docs/                 # Documentation
│   ├── cli-usage.md      # CLI parameters
│   ├── advanced-usage.md # Customization guide
│   └── faq.md           # Troubleshooting
├── scripts/              # Utility scripts
├── tests/                # Unit, integration, and release-flow tests
├── .github/workflows/     # quality/test and release automation
├── default_app_list.json # Popular apps config for release builds
├── package.json          # Node.js dependencies and version
└── rollup.config.js      # CLI build configuration
```

## Development Commands

| Command                              | Purpose                                                         |
| ------------------------------------ | --------------------------------------------------------------- |
| `pnpm install`                       | Install dependencies                       

--- CLAUDE.md ---
AGENTS.md

--- CONTRIBUTING.md ---
## How to contribute to Pake

**Welcome to create [pull requests](https://github.com/tw93/Pake/compare/) for bugfix, new component, doc, example, suggestion and anything.**

## Branch Management

All development happens directly on `main`. Submit pull requests to `main`.

## Development Setup

### Prerequisites

- Node.js ≥22.0.0 (recommended LTS, older versions ≥18.0.0 may work)
- Rust ≥1.85.0 (required for edition2024 su

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
