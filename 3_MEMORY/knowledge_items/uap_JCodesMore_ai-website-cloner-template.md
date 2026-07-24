# KI: JCodesMore/ai-website-cloner-template

## Overview
Clone any website into a clean, modern Next.js codebase using AI coding agents

## Tech Stack (from code)
- TypeScript (React) (3 files)
- TypeScript (2 files)
- **Total:** 52 files, 39 directories
- **File types:** .md: 15, .gitkeep: 7, .json: 5, .mjs: 3, .tsx: 3, .yml: 2, .ts: 2, .clinerules: 1

## Public API / Exports
- `cn` from `src\lib\utils.ts`

## Dependencies
### Dependencies (from package.json)
- `@base-ui/react`: ^1.3.0
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `lucide-react`: ^1.6.0
- `next`: 16.2.1
- `react`: 19.2.4
- `react-dom`: 19.2.4
- `shadcn`: ^4.1.0
- `tailwind-merge`: ^3.5.0
- `tw-animate-css`: ^1.4.0

### Dev Dependencies
- `@tailwindcss/postcss`: ^4
- `@types/node`: ^24
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `eslint`: ^9
- `eslint-config-next`: 16.2.1
- `tailwindcss`: ^4
- `typescript`: ^5

## Imports Detected in Source
- `clsx`
- `next`
- `tailwind-merge`

## Available Commands
- `npm run dev` -- `next dev`
- `npm run build` -- `next build`
- `npm run start` -- `next start`
- `npm run lint` -- `eslint`
- `npm run typecheck` -- `tsc --noEmit`
- `npm run check` -- `npm run lint && npm run typecheck && npm run build`

## File Structure
```
  .aider.conf.yml
  .clinerules
  .dockerignore
  .gitattributes
  .gitignore
  .nvmrc
  .windsurfrules
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  Dockerfile
  Dockerfile.dev
  GEMINI.md
  LICENSE
  README.md
  components.json
  docker-compose.yml
  eslint.config.mjs
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  tsconfig.json
  .amazonq/
    cli-agents/
      clone-website.json
    rules/
      project.md
  .augment/
    commands/
      clone-website.md
  .claude/
    skills/
      clone-website/
        SKILL.md
  .codex/
    skills/
      clone-website/
        SKILL.md
  .continue/
    commands/
      clone-website.md
    rules/
      project.md
  .cursor/
    commands/
      clone-website.md
    rules/
      project.mdc
  .gemini/
    commands/
      clone-website.toml
  .opencode/
    commands/
      clone-website.md
  .windsurf/
    workflows/
      clone-website.md
  docs/
    design-references/
      .gitkeep
      comparison.png
    research/
      INSPECTION_GUIDE.md
  public/
    images/
      .gitkeep
    seo/
      .gitkeep
    videos/
      .gitkeep
  scripts/
    .gitkeep
    sync-agent-rules.sh
    sync-skills.mjs
  src/
    app/
      favicon.ico
      globals.css
      layout.tsx
      page.tsx
    components/
      ui/
        button.tsx
    hooks/
      .gitkeep
    lib/
      utils.ts
    types/
      .gitkeep
```

## Key Source Excerpts
### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
};

export default nextConfig;

```

### src\lib\utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

## Agent Configuration
### CLAUDE.md
@AGENTS.md


### AGENTS.md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. The Next.js + shadcn/ui + Tailwind v4 base is pre-scaffolded — just run `/clone-website <url1> [<url2> ...]`.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React (default — will be replaced/supplemented by extracted SVGs)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Pixel-perfect emulation** — match the target's spacing, colors, typography exactly
- **No personal aesthetic changes during emulation ph

### GEMINI.md
@AGENTS.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 28/100 · **Auto-apply:** False
- **Evidence:** `keyword`, `seo`
- **All scores:** {'seosona-os': 28, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 6}
