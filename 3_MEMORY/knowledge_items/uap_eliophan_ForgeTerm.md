# KI: eliophan/ForgeTerm

## Overview
ForgeTerm is designed to optimize the workflow of developers working on multiple projects at the same time. Instead of losing track of loose terminal windows, it provides a highly customizable, robust environment out of the box.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** React
- Rust
- **Total files:** 109 files across 37 directories
- **File types:** .png: 50, .ts: 14, .svg: 10, .json: 7, .tsx: 6, .yml: 3, .rs: 3
- **Key dependencies:** @radix-ui/react-slot, @tauri-apps/api, @tauri-apps/plugin-opener, @xterm/addon-fit, @xterm/addon-unicode11, @xterm/xterm, class-variance-authority, clsx, lucide-react, react, react-dom, react-resizable-panels
- **Dev dependencies:** @eslint/js, @tailwindcss/vite, @tauri-apps/cli, @testing-library/jest-dom, @testing-library/react, @types/node, @types/react, @types/react-dom

## Documentation Sections
- Overview
- Installation 
- Contributing
- Project Architecture
- Prerequisites
- Getting Started
- Building from Source
- Compile web frontend
- Compile Desktop app packages (.dmg, .app, .exe, etc)
- License

## Available Commands
- `npm run dev` -- vite
- `npm run build` -- tsc && vite build
- `npm run typecheck` -- tsc --noEmit
- `npm run lint` -- eslint .
- `npm run test` -- vitest run
- `npm run test:watch` -- vitest
- `npm run rust:fmt:check` -- cargo fmt --manifest-path src-tauri/Cargo.toml --all -- --check
- `npm run rust:clippy` -- cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
- `npm run rust:test` -- cargo test --manifest-path src-tauri/Cargo.toml
- `npm run check` -- pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm rust:fmt:check &&
- `npm run preview` -- vite preview
- `npm run tauri` -- tauri

## Core Structure
```
  .gitignore
  AGENTS.md
  LICENSE
  README.md
  components.json
  eslint.config.js
  index.html
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  vitest.config.ts
  .github/
    FUNDING.yml
    workflows/
      ci.yml
      release.yml
  .pnpm-store/
    v10/
      projects/
        3677839e8573fd579aecde06724842c4
  .vscode/
    extensions.json
  public/
    icon.png
    screenshot.png
    tauri.svg
    vite.svg
    Logo/
      claudecode.svg
      claudecodenocolor.svg
      codex.svg
      codexnocolor.svg
      cursor.svg
      opencode.svg
      windsurf.svg
  src/
    App.css
    App.tsx
    TerminalPane.tsx
    main.tsx
    vite-env.d.ts
    assets/
      react.svg
    components/
      ui/
        button.test.tsx
        button.tsx
        resizable.tsx
    features/
      explorer/
        types.ts
      git/
        types.ts
      layout/
        hooks/
          useLayoutTree.ts
          usePaneList.ts
      terminal/
        runners.ts
        types.ts
        hooks/
          useTerminalPaneRuntime.ts
    lib/
      utils.ts
    shared/
      ime.ts
      api/
        tauri.ts
    styles/
      globals.css
    test/
      setup.ts
  src-tauri/
    .gitignore
    Cargo.lock
    Cargo.toml
    build.rs
    tauri.conf.json
    capabilities/
      default.json
    icons/
      128x128.png
      128x128@2x.png
      32x32.png
      64x64.png
      Square107x107Logo.png
      Square142x142Logo.png
      Square150x150Logo.png
      Square284x284Logo.png
      Square30x30Logo.png
      Square310x310Logo.png
      Square44x44Logo.png
      Square71x71Logo.png
      Square89x89Logo.png
      StoreLogo.png
      icon.icns
      icon.ico
      icon.png
      android/
        mipmap-anydpi-v26/
          ic_launcher.xml
        mipmap-hdpi/
          ic_launcher.png
          ic_launcher_foreground.png
          ic_launcher_round.png
        mipmap-mdpi/
          ic_launcher.png
          ic_launcher_foreground.png
          ic_launcher_round.png
        mipmap-xhdpi/
          ic_launcher.png
          ic_launcher_foreground.png
          ic_launcher_round.png
        mipmap-xxhdpi/
          ic_launcher.png
          ic_launcher_foreground.png
          ic_launcher_round.png
        mipmap-xxxhdpi/
          ic_launcher.png
          ic_launcher_foreground.png
          ic_launcher_round.png
        values/
          ic_launcher_background.xml
      ios/
        AppIcon-20x20@1x.png
        A
```

## Quick Start
```bash
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)
- [Rust](https://www.rust-lang.org/tools/install) (Stable)
1. Clone the repository:
2. Install dependencies:
3. Run the desktop app in development mode (with Hot-Module Replacement):
To build production binaries yourself:
```

## Agent Configuration

--- AGENTS.md ---
# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React UI code (app shell, panes, styling).
- `src-tauri/`: Tauri backend (Rust PTY sessions, app config).
- `public/`: Static assets.
- `vite.config.ts`: Vite dev/build configuration.
- `src-tauri/tauri.conf.json`: Tauri app settings.

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies.
- `pnpm dev`: Run the Vite web dev server (UI only).
- `pnpm tauri dev`: Run the full desktop app (UI + Rust backend).
- `pnpm build`: Build the web frontend.
- `pnpm tauri build`: Package the desktop app.

## Coding Style & Naming Conventions
- TypeScript/React in `src/`, Rust in `src-tauri/`.
- Indentation: 2 spaces for TS/TSX, 2 spaces for JSON.
- Prefer descriptive component and file names (e.g., `TerminalPane.tsx`).
- Keep UI state in React; keep PTY/session logic in Rust.

## Testing Guidelines
- No formal test framework is set up yet.
- If adding tests, keep them close to the feature (e.g., `src/__tests__/`).
- Verify manually with `pnpm tauri dev` for terminal behavior.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and scoped to one change (e.g., `Add drag-to-resize split panes`).
- Keep commits atomic and focused.
- PRs should include a short summary and note any UX changes or new commands.

## Architecture Overview
- Frontend uses xterm.js for terminal rendering.
- Backend uses Tauri + Rust with `portable-pty` for PTY sessions.
- Split panes are managed in React and render isolated PTY sessions.

## Agent Instructions
- Auto-commit changes when finished.
- Avoid long-running UI work on the main thread (defer PTY spawn and heavy init).



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
