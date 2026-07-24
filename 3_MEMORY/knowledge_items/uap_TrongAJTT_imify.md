# KI: TrongAJTT/imify

## Overview
> A privacy-first, 100% client-side image processing suite. Available as a **Next.js Web Application** and a **Browser Extension**. Save, convert, resize, split, splice, and audit images directly in your browser — without uploading anything to a server.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 111 files across 31 directories
- **File types:** .tsx: 55, .ts: 28, .md: 12, .json: 6, .yaml: 2, .yml: 2, .js: 2

## Core Capabilities
* **Dual Platforms**: Use Imify as a standalone web application or as a tightly integrated browser extension.
* **100% Client-Side Processing**: Zero server dependencies. Complete data privacy using WebAssembly and Web Workers.
* **Rich Format Support**: Read and convert to `JPG`, `PNG` (Tiny mode, Floyd-Steinberg dithering, and OxiPNG WASM optimization), `WebP`, `AVIF`, `JXL` (JPEG XL), `TIFF`, `ICO`, `BMP`, and `PDF`.
* **Advanced Processing Tools (Available in both the web application and the browser extension)**:
  * **Batch Processor**: Drag-and-drop multiple files to convert them in bulk. Includes ZIP packaging.
  * **Image Splitter**: Slice images via grid systems or custom percentage/pixel sequences with a reorderable guide UI.
  * **Image Splicing**: Vertically or horizontally stitch multiple images together with gap controls.
  * **Pattern & Fill**: Generate seamless patterns and use symmetric edge-filling techniques.
  * **Difference Checker**: Pixel-perfect visual comparison tool for QA and analysis.
  * **Image Inspector**: Deep dive into image metadata and EXIF data.
* **Extension-Exclusive Features**:
  * **Right-Click Context Menu**: Instantly convert and download any web image using your preferred presets.
  * **SEO Audit (Chrome & Edge)**: Deep DOM scanning to detect oversized images, missing alt text, and potential bandwidth savings via modern formats. (Note: Currently unavailable on Firefox because this feature requires Side Panel API).
* **Smart Resizing Engine**: Scale by dimension, percentage, or match standard physical paper sizes (A4, Letter) with DPI controls.
* **Modern Workspace UI**: A unified, desktop-like layout with collapsible navigation, reorderable sidebar configurations (`dnd-kit`), and dark mode support.

## Documentation Sections
- <img src="/assets/icon.png" alt="Imify" width="24" height="24" style="vertical-align: middle;"> Imify - Powerful Image Toolkit
- ✨ Key Features (v2 Suite)
- 📸 Screenshots
- 💝 Support & Donate
- 📥 Installation
- 🛠️ Tech Stack
- 📂 Monorepo Structure
- 🚀 Getting Started
- Prerequisites
- Installation
- Development
- Sync package versions and metadata from root to all packages
- Start all development servers (Web app + Extension on Chrome)
- Start only the Web app (automatically syncs assets)
- Start only the Extension (Targeting specific browsers, automatically syncs assets)
- Loading the Extension
- 📦 Building for Production
- Build all and verify (CI mode)
- Build specific target
- 🚀 Packaging for Distribution
- 🦊 Note for Mozilla AMO Reviewers
- 🔒 Privacy & Security
- 📄 License

## Core Structure
```
  .antigravityignore
  .gitignore
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CREDITS.md
  LICENSE
  README.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  .claude/
    skills/
      gitnexus/
        gitnexus-cli/
          SKILL.md
        gitnexus-debugging/
          SKILL.md
        gitnexus-exploring/
          SKILL.md
        gitnexus-guide/
          SKILL.md
        gitnexus-impact-analysis/
          SKILL.md
        gitnexus-refactoring/
          SKILL.md
  .github/
    workflows/
      ci-manifest-check.yml
      submit.yml
  .vscode/
    mcp.json
    settings.json
  apps/
    extension/
      .prettierrc.mjs
      LICENSE
      README.md
      package.json
      postcss.config.js
      tailwind.config.js
      tsconfig.json
      src/
        popup.tsx
        sidepanel.tsx
        style.css
        style.d.ts
        adapters/
          bootstrap-extension-adapters.ts
          chrome-storage-state.ts
          plasmo-storage-adapter.ts
        background/
          context-menu-builder.ts
          index.ts
          message-hub.ts
          offscreen-bridge.ts
          offscreen-types.ts
        contents/
          progress-toast.tsx
          seo-audit-listener.tsx
        features/
          seo-audit/
            dom-scan.ts
            index.ts
            run-active-tab-audit.ts
            snapshot-store.ts
            tooltips.ts
            types.ts
        options/
          index.tsx
          shared.ts
          components/
            attribution-dialog-wrapper.tsx
            batch-processor-tab.tsx
            ico-size-selector.tsx
            image-url-import-control.tsx
            loading-spinner.tsx
            paper-config.tsx
            section-placeholder.tsx
            settings-shortcuts-panel.tsx
            single-processor-tab.tsx
            smart-resize-module.tsx
            tab-button.tsx
            tooltip.tsx
            batch/
              download-confirm-dialog.tsx
              index.ts
              pipeline.ts
              save-preset-dialog.tsx
              sortable-queue-item.tsx
              types.ts
              utils.ts
            context-menu/
              context-menu-info-panel.tsx
              context-menu-settings-tab.tsx
              custom-format-form.tsx
              custom-formats-tab.tsx
              custom-preset-advanced-settings.tsx
              global-format-target-quality.tsx
              global-formats-tab.tsx
              menu-preview-tab.tsx
```

## Quick Start
```bash
* [Node.js](https://nodejs.org/) (v18 or higher)
* [pnpm](https://pnpm.io/) (Recommended package manager)
1. Clone the repository:
2. Install dependencies:
We use Turborepo and root-level scripts to manage tasks across the monorepo.
1. Open your browser and navigate to:
* Chrome: `chrome://extensions/`
* Firefox: `about:debugging#/runtime/this-extension`
2. Enable **Developer mode** (for Chrome).
3. Click **Load unpacked** (Chrome) or **Load Temporary Add-on** (Firefox).
```

## Agent Configuration

--- AGENTS.md ---
<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **imify** (3815 symbols, 10437 relationships, 287 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/imify/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({

--- CLAUDE.md ---
<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **imify** (3815 symbols, 10437 relationships, 287 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method,

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
