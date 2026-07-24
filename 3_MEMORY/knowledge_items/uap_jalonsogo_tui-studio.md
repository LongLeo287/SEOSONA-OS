# KI: jalonsogo/tui-studio

## Overview
**Visual design tool for building Terminal User Interfaces**

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** React, Playwright
- **Total files:** 109 files across 25 directories
- **File types:** .ts: 38, .tsx: 19, .png: 10, .md: 8, .svg: 8, .json: 5, .js: 5
- **Key dependencies:** class-variance-authority, clsx, lucide-react, react, react-dom, react-router-dom, tailwind-merge, zustand
- **Dev dependencies:** @eslint/js, @types/react, @types/react-dom, @vitejs/plugin-react, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks

## Core Capabilities
- **Visual Canvas** — Drag-and-drop components with live ANSI preview at configurable zoom levels
- **20+ TUI Components** — Screen, Box, Button, TextInput, Checkbox, Radio, Select, Toggle, Text, Spinner, ProgressBar, Table, List, Tree, Menu, Tabs, Breadcrumb, Modal, Popover, Tooltip, Spacer
- **Layout Engine** — Absolute, Flexbox, and Grid layout modes with full property control
- **Color Themes** — Dracula, Nord, Solarized Dark/Light, Monokai, Gruvbox, Tokyo Night, Nightfox, Sonokai — all updating the canvas in real-time
- **Dark / Light Mode** — Toggle between dark and light editor UI; persists across sessions
- **Layers Panel** — Hierarchical component tree with drag-to-reorder, visibility toggle, lock, and inline rename
- **Property Panel** — Edit layout, style, and component-specific props for the selected component
- **Undo / Redo** — Full history for all tree mutations
- **Save / Load** — `.tui` JSON format via native OS file picker (Chrome/Edge) or browser download (Firefox/Safari)
- **Multi-Framework Export** — Generate code for Ink, BubbleTea, Blessed, Textual, OpenTUI, Tview
- **Command Palette** — `Cmd/Ctrl+P` for quick component creation, theme switching, and dark/light mode toggle
- **Gradient Backgrounds** — Add linear gradients to any element background with angle control and N color stops; rendered as discrete character-cell bands matching real ANSI terminal output
- **Settings** — Accent color presets, dark/light mode toggle, and default download folder

## Documentation Sections
- TUIStudio
- Features
- Star History
- Quick Start
- Keyboard Shortcuts
- File Format
- Export Frameworks
- Tech Stack
- Commands
- LOLcense

## Available Commands
- `npm run dev` -- vite
- `npm run build` -- tsc -b && vite build
- `npm run lint` -- eslint .
- `npm run preview` -- vite preview
- `npm run format` -- prettier --write .
- `npm run format:check` -- prettier --check .

## Core Structure
```
  .a2.yaml
  .dockerignore
  .gitignore
  .prettierignore
  .prettierrc.json
  CHANGELOG.md
  CLAUDE.md
  Dockerfile
  LICENSE
  README.md
  eslint.config.js
  index.html
  nginx.conf
  package-lock.json
  package.json
  package.json.md5
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  tsconfig.tsbuildinfo
  vite.config.ts
  docs/
    TUI_DESIGNER_CODE_EXAMPLE.md
    TUI_DESIGNER_IMPLEMENTATION_PLAN.md
    TUI_DESIGNER_LAYERS_AND_COMPONENTS.md
    TUI_DESIGNER_OVERVIEW.md
    TUI_DESIGNER_QUICKSTART.md
  public/
    cube.png
    favicon_dark.svg
    favicon_white.svg
    logo-tui-studio_dark.svg
    logo-tui-studio_light.svg
    screenshot-dracula.png
    screenshot-editor-md.png
    screenshot-editor-zoomed.png
    screenshot-editor.png
    screenshot-landing.png
    screenshot-light-mode.png
    screenshot-monokai.png
    screenshot-nord.png
    screenshot-tokyo-night.png
    tui-studio_dark.svg
    tui-studio_horizontal_dark.svg
    tui-studio_horizontal_light.svg
    tui-studio_light.svg
  scripts/
    screenshot.mjs
  src/
    App.css
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
    components/
      debug/
        LayoutDebugPanel.tsx
      editor/
        Canvas.tsx
        CommandPalette.tsx
        ComponentToolbar.tsx
        ComponentTree.tsx
        EditorLayout.tsx
        LeftSidebar.tsx
        Toolbar.tsx
        componentIcons.tsx
      export/
        ExportModal.tsx
        ExportPanel.tsx
      palette/
        ComponentPalette.tsx
      properties/
        ColorPicker.tsx
        DimensionInput.tsx
        LayoutEditor.tsx
        PropertyPanel.tsx
        StyleEditor.tsx
    constants/
      components.ts
    data/
      changelog.ts
    hooks/
      useDragAndDrop.ts
    stores/
      canvasStore.ts
      componentStore.ts
      index.ts
      selectionStore.ts
      themeStore.ts
    types/
      components.ts
      export.ts
      index.ts
      layout.ts
    utils/
      downloadManager.ts
      fileOps.ts
      idGenerator.ts
      treeUtils.ts
      validation.ts
      export/
        codeExporter.ts
        index.ts
        renderer.ts
        textExporter.ts
        exporters/
          ratatui.ts
      layout/
        absolute.ts
        engine.ts
        flexbox.ts
        grid.ts
        index.ts
        types.ts
      rendering/
        ansi.ts
        borders.ts
        canvas.ts
        components.ts
        index.ts
        text.ts
  themes/
    dracula-default.itermcolors
    nightfox-default.iter
```

## Quick Start
```bash
git clone https://github.com/jalonsogo/tui-studio.git
cd tui-studio
npm install
npm run dev
| Framework                                               | Language           |
| ------------------------------------------------------- | ------------------ |
| [Ink](https://github.com/vadimdemedes/ink)              | TypeScript / React |
| [BubbleTea](https://github.com/charmbracelet/bubbletea) | Go                 |
| [Blessed](https://github.com/chjj/blessed)              | JavaScript         |
| [Textual](https://github.com/Textualize/textual)        | Python             |
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TUIStudio is a Figma-like visual editor for Terminal User Interfaces (TUIs). It lets developers design terminal UIs visually and export them as code for multiple frameworks (Ink, BubbleTea, Blessed, Textual, OpenTUI, Tview).

## Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # TypeScript compile + Vite production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture

### State Management (Zustand stores in `src/stores/`)

- **componentStore.ts** — The core store. Manages the component tree (`ComponentNode[]`), history/undo-redo, and all tree mutations (add, remove, update, move, duplicate).
- **canvasStore.ts** — Viewport state: zoom, pan, grid settings, canvas dimensions.
- **selectionStore.ts** — Multi-selection (selected, hovered, focused component IDs).
- **themeStore.ts** — TUI color theme for rendering.

### Data Flow

1. User actions mutate `componentStore` (the source of truth).
2. `LayoutEngine` (`src/utils/layout/engine.ts`) computes positions/sizes from the component tree + canvas dimensions.
3. `Canvas.tsx` renders the computed layout using the ANSI rendering system.
4. `PropertyPanel.tsx` reads/writes the selected component's props via `componentStore`.

### Layout Engine (`src/utils/layout/`)

- `engine.ts` — Orchestrates layout calculation; dispatches to flexbox, grid, or absolute sub-engines.
- `flexbox.ts` / `grid.ts` / `absolute.ts` — Individual layout algorithm implementations.

### Rendering System (`src/utils/rendering/`)

Converts the component tree into a visual TUI representation using ANSI escape codes and Unicode box-drawing characters. Key files: `canvas.ts`, `components.ts`, `ansi.ts`, `borders.ts`.

### Component Library (`src/constants/components.ts`


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
