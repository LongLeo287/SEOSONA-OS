# KI: buzinas/react-trace

## Overview
React Trace: batteries-included React visual inspector

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 119 files across 29 directories
- **File types:** .ts: 27, .tsx: 20, .json: 18, .mdx: 12, .md: 9, .mp4: 5, .webp: 5
- **Dev dependencies:** @changesets/cli, @types/node, oxfmt, oxlint, turbo, typescript
- **Keywords:** react-find, react-find-source, react-grab, react-inspect, react-inspector, react-trace

## Documentation Sections
- react-trace
- Installation
- Recommended: `@react-trace/kit`
- Alternative: `@react-trace/core` and specific plugins
- Official Plugins
- Writing your own plugin
- Contributing
- Monorepo layout
- Tooling
- Workspace commands
- Example app
- Note to contributors

## Available Commands
- `npm run build` -- turbo build
- `npm run dev` -- turbo dev
- `npm run test` -- turbo test
- `npm run lint` -- turbo lint
- `npm run typecheck` -- turbo typecheck
- `npm run fmt` -- oxfmt .
- `npm run fmt:check` -- oxfmt --check .
- `npm run create-plugin` -- USE_LOCAL=true node packages/create-react-trace-plugin/dist/index.mjs
- `npm run changeset` -- changeset
- `npm run version` -- changeset version
- `npm run release` -- pnpm build && changeset publish

## Core Structure
```
  .gitignore
  .npmrc
  .nvmrc
  .oxfmtrc.json
  .oxlintrc.json
  AGENTS.md
  LICENSE
  README.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.base.json
  turbo.json
  .changeset/
    config.json
  .github/
    workflows/
      deploy-website.yml
      release.yml
  apps/
    example/
      index.html
      package.json
      tsconfig.json
      vite-env.d.ts
      vite.config.ts
      src/
        App.tsx
        Card.tsx
        Header.tsx
        main.tsx
    website/
      og-template.svg
      ogPlugin.ts
      package.json
      postcss.config.mjs
      rspress.config.ts
      tailwind.css
      tsconfig.json
      docs/
        index.mdx
        _components/
          Hotkey.tsx
          Video.tsx
        extending/
          plugin-api.mdx
          ui-components.mdx
        guide/
          configuration.mdx
          index.mdx
          installation.mdx
          production-stubs.mdx
        plugins/
          comments.mdx
          copy-to-clipboard.mdx
          index.mdx
          open-editor.mdx
          preview.mdx
        public/
          CNAME
          favicon.svg
          google8a4eb9eb5a234514.html
          logo-dark.svg
          logo.svg
          robots.txt
      fonts/
        OpenSans-Bold.ttf
        OpenSans-Regular.ttf
        OpenSans-SemiBold.ttf
        fonts.conf
      stubs/
        empty.js
      theme/
        HomeLayout.tsx
        global.d.ts
        index.css
        index.tsx
        og-home.png
        videos/
          comments-demo.mp4
          comments-demo.webp
          copy-to-clipboard-demo.mp4
          copy-to-clipboard-demo.webp
          open-editor-demo.mp4
          open-editor-demo.webp
          preview-demo.mp4
          preview-demo.webp
          react-trace-demo.mp4
          react-trace-demo.webp
  packages/
    core/
      CHANGELOG.md
      README.md
      package.json
      tsconfig.json
      tsdown.config.ts
      src/
        env.d.ts
        hooks.ts
        index.prod.ts
        index.tsx
        store.ts
        types.ts
        components/
          ActionPanel.tsx
          ErrorBoundary.tsx
          Overlay.tsx
          SettingsMenu.tsx
          Toolbar.tsx
          Trace.tsx
        hooks/
          useEffectEvent.ts
          useInspectorBehavior.ts
          useLongPressHotkey.ts
        utils/
          fiber.ts
          path.ts
          platform.ts
    create-react-trace-plugin/
      CHANGELOG.md
      package.json
      tsconfig.json
      tsdown.
```

## Quick Start
```bash
pnpm add --dev @react-trace/kit
Then add it next to your app:
`root` should be the absolute path to the project being inspected. A common development setup is exporting it in your dev script, for example: `VITE_ROOT=$(pwd) vite`.
Use `@react-trace/core` when you want to choose plugins yourself. The official plugins also expect `@react-trace/ui-components` as a peer dependency.
| Package                                 | What it adds                                                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `@react-trace/plugin-preview`           | Project-folder access, Monaco-based source preview, optional inline editing, and preview settings.                         |
| `@react-trace/plugin-copy-to-clipboard` | An action-panel item that copies the selected source as a project-relative `path:lineNumber` reference.                    |
| `@react-trace/plugin-open-editor`       | An action-panel item for opening the selected source in supported local editors, plus editor selection in widget settings. |
| `@react-trace/plugin-comments`          | Toolbar comments UI, inline add-comment flow, and "Copy to Clipboard" + "Send to OpenCode" support for collected comments. |
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md — react-trace

Guidelines for AI coding agents working in this repository.

---

## Monorepo structure

```
packages/
  ui-components/            @react-trace/ui-components — Kbd, Tooltip, Button, IconButton,
                                                        PanelHeader, Popover, DropdownMenu,
                                                        icons (via @hugeicons/core-free-icons)
  core/                     @react-trace/core          — Trace component, plugin API, utilities
  plugin-preview/           @react-trace/plugin-preview — Monaco editor action panel, FS access
  plugin-comments/          @react-trace/plugin-comments — inline comments + Send to OpenCode
  plugin-copy-to-clipboard/ @react-trace/plugin-copy-to-clipboard
  plugin-open-editor/       @react-trace/plugin-open-editor
  react-trace/              @react-trace/kit               — batteries-included convenience wrapper
apps/
  example/                  Vite + React demo app
```

**Toolchain:** pnpm workspaces · Turborepo · tsdown (rolldown bundler) · TypeScript · oxlint · oxfmt · vitest

---

## Commands

### Root (all packages via Turborepo)

```bash
pnpm build          # build all packages in dependency order
pnpm dev            # watch mode (builds deps first, then watches)
pnpm typecheck      # tsc --noEmit across all packages
pnpm lint           # oxlint across all packages
pnpm fmt            # oxfmt . (auto-fix formatting)
pnpm fmt:check      # check formatting without writing
pnpm test           # vitest run across all packages
```

### Single package

```bash
pnpm --filter @react-trace/core build
pnpm --filter @react-trace/plugin-comments typecheck
pnpm --filter @react-trace/core test
```

### Single test file

```bash
pnpm --filter @react-trace/core exec vitest run src/path.test.ts
```

### Example app

```bash
pnpm --filter example dev    # start dev server
pnpm --filter example build  # production build (uses prod stubs — see below)
```

---

## Production stubs

Eve


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
