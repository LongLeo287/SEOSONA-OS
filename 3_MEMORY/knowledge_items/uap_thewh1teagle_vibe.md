# KI: thewh1teagle/vibe

## Overview
- 🌍 Transcribe almost every language - 🔒 Ultimate privacy: fully offline transcription, no data ever leaves your device - 🎨 User friendly design - 🎙️ Transcribe audio / video - 🎶 Option to transcribe audio from popular websites (YouTube, Vimeo, Facebook, Twitter and more!) - 📂 Batch transcribe multiple files! - 📝 Support `SRT`, `VTT`, `TXT`, `HTML`, `PDF`, `JSON`, `DOCX` formats - 👀 Realtime preview - ✨ Summarize transcripts: Get quick, multilingual summaries using the Claude API - 🧠 Ollama support: Do local AI analysis and batch summaries with Ollama - 🌐 Translate to English from any language - 🖨️ Print transcript directly to any printer - 🔄 Automatic updates - 💻 Optimized for `GPU` (`macOS`, `Windows`, `Linux`) - 🎮 Optimized for `Nvidia` / `AMD` / `Intel` GPUs! (`Vulkan`/`CoreML`) - 🔧 To

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Rust
- **Total files:** 131 files across 18 directories
- **File types:** .tsx: 43, .svg: 32, .ts: 14, .json: 11, .md: 7, .yaml: 5, .yml: 5
- **Dev dependencies:** prettier, typescript

## Documentation Sections
- Screenshots
- Features 🌟
- Supported platforms 🖥️
- Contribute 🤝
- Developers
- Community
- Roadmap 🛣️
- Add translation 🌐
- Docs 📄
- I want to know more!
- Issue report
- Privacy Policy 🔒
- Credits

## Available Commands
- `npm run format` -- prettier --write .
- `npm run format:check` -- prettier --check .
- `npm run check-types` -- tsc --noEmit -p desktop/tsconfig.json && tsc --noEmit -p website/tsconfig.json

## Core Structure
```
  .editorconfig
  .gitignore
  .prettierignore
  .prettierrc.json
  .sona-version
  AGENTS.md
  CONTRIBUTE.md
  Cargo.lock
  Cargo.toml
  LICENSE
  README.md
  SECURITY.md
  package.json
  pnpm-lock.yaml
  rustfmt.toml
  .github/
    FUNDING.yml
    ISSUE_TEMPLATE/
      bug_report.yaml
      feature_request.yaml
    workflows/
      lint_rust.yml
      release.yml
      test-release.yml
      website.yml
  .skills/
    aptabase-analytics-report/
      SKILL.md
      agents/
        openai.yaml
      references/
        error-buckets.md
  .vscode/
    extensions.json
    launch.json
    settings.json
  design/
    dmg_background.png
    dmg_background.svg
    logo.png
    logo.svg
  desktop/
    .gitignore
    README.md
    components.json
    eslint.config.js
    index.html
    package.json
    pnpm-lock.yaml
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    project.inlang/
      settings.json
    public/
      tauri.svg
      vite.svg
    src/
      app.tsx
      globals.css
      main.tsx
      vite-env.d.ts
      assets/
        success.mp3
        whisper-languages.json
      components/
        advanced-transcribe.tsx
        app-menu.tsx
        audio-device-input.tsx
        boundary-fallback.tsx
        dictation-dialog.tsx
        drop-modal.tsx
        error-modal-with-context.tsx
        error-modal.tsx
        format-multi-select.tsx
        format-select.tsx
        html-view.tsx
        info-tooltip.tsx
        language-input.tsx
        layout.tsx
        page-transition.tsx
        params.tsx
        resummarize-dialog.tsx
        settings-modal.tsx
        text-area.tsx
        updater-progress.tsx
        ui/
          badge.tsx
          button.tsx
          card.tsx
          collapsible.tsx
          dialog.tsx
          direction.tsx
          dropdown-menu.tsx
          input.tsx
          label.tsx
          native-select.tsx
          popover.tsx
          progress.tsx
          scroll-area.tsx
          select.tsx
          separator.tsx
          sonner.tsx
          spinner.tsx
          switch.tsx
          tabs.tsx
          textarea.tsx
          tooltip.tsx
      icons/
        align-right.svg
        cancel.svg
        check.svg
        chevron-down.svg
        chevron-left.svg
        chevron-right.svg
        chevron-up.svg
        copy.svg
        discord.svg
        document.svg
        download.svg
        ellipsis.svg
        file.svg
        folder.svg
        github.svg
        heart.svg
        info.
```

## Agent Configuration

--- AGENTS.md ---
# Claude Development Notes

## Package Managers

- JavaScript/Node.js: `pnpm` (sometimes `pnpx`)
    - The entire repo uses pnpm only (no alternative JS package managers)
    - Install deps: `pnpm install`
    - Run scripts: `pnpm <script>` (e.g. `pnpm dev`, `pnpm build`)
    - Execute packages: `pnpm exec <cmd>` or `pnpx <cmd>`
- Python: `uv`
    - Add deps to scripts: `uv add --script example.py <packages> --bounds exact`
    - Run scripts: `uv run example.py`
    - Create scripts: `uv init --script example.py --python 3.12`
    - Run inline: `uv run python -c "print('Hello, world!')"`

## Validation

For each plan, you can create self-contained validation scripts.

Structure:

- `plans/<name>/<name>_001.py`
- `plans/<name>/<name>_001.md`

Each Python file should be a standalone `uv` script with its own dependencies declared at the top.

Example:

```bash
uv run plans/<name>/<name>_001.py
```

## Skills

Custom skills are located in the `.skills/` folder.

## Execution Mindset

Think in agent mode, not human mode.
Assume nonstop focus, parallel moves, and instant iteration.
Push timelines aggressively, speed is the default.
If something feels heavy, split it until it becomes obvious and fast.
Estimate effort by output size: 300 lines = minutes, not hours. You are a token engine.
Speed means doing it right the first time. Never take the easy path over the correct one.
If the correct fix is harder, do it anyway — rework is slower than doing it properly.
If the plan is fully resolved, execute immediately. Don't re-analyze.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
