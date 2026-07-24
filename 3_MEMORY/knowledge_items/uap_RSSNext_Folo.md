# KI: RSSNext/Folo

## Overview
As they say, your thoughts are what you read—and we’ve been consuming noisy feeds for too long! Folo organizes content into one timeline, keeping you updated on what matters, noise-free. Share lists, explore collections, and enjoy distraction-free browsing.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 125 files across 24 directories
- **File types:** .ts: 38, .yml: 24, .md: 22, .json: 15, .mjs: 7, .yaml: 4, .js: 2
- **Dev dependencies:** @babel/generator, @babel/parser, @babel/traverse, @babel/types, @electron-toolkit/tsconfig, @eslint/compat, @tsslint/cli, @tsslint/config

## Documentation Sections
- 👋🏻 Getting Started & Join Our Community
- ✨ Features
- Customized Information Hub
- AI At Your Fingertips

## Available Commands
- `npm run build:packages` -- turbo run build --filter="./packages/**/*"
- `npm run build:web` -- turbo run Folo#build:web
- `npm run dedupe:locales` -- eslint --fix locales/**
- `npm run depcheck` -- npx depcheck --quiet
- `npm run dev:web` -- turbo run @follow/web#dev @follow/ssr#dev
- `npm run format` -- prettier --write .
- `npm run format:check` -- prettier --check .
- `npm run icons:sync` -- tsx scripts/svg-to-rn.ts && prettier --write apps/mobile/src/icons/**/*.tsx && e
- `npm run icons:update` -- tsx scripts/update-icon.ts
- `npm run lint` -- pnpm run lint:tsl && eslint
- `npm run lint:fix` -- eslint --fix
- `npm run lint:tsl` -- tsslint --project apps/*/tsconfig.json

## Core Structure
```
  .cursorignore
  .easignore
  .editorconfig
  .gitattributes
  .gitignore
  .npmrc
  .nvmrc
  .prettierignore
  .prettierrc.mjs
  AGENTS.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  buildServer.json
  changelogithub.config.ts
  conductor.json
  eslint.config.mjs
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.json
  tsslint.config.ts
  turbo.json
  vercel.json
  vitest.workspace.js
  vitest.workspace.ts
  .agents/
    settings.local.json
    skills/
      desktop-release/
        SKILL.md
      installing-mobile-preview-builds/
        SKILL.md
      mobile-e2e/
        SKILL.md
      mobile-release/
        SKILL.md
      mobile-self-test/
        SKILL.md
      update-deps/
        SKILL.md
  .github/
    PULL_REQUEST_TEMPLATE.md
    advanced-issue-labeler.yml
    copilot-instructions.md
    dependabot.yaml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
      i18n.yml
      typo.yml
    actions/
      setup-version/
        action.yml
      setup-xcode/
        action.yml
    prompts/
      similar_issues.prompt.yml
    scripts/
      build-ota-release.mjs
      build-ota-release.test.ts
      extract-release-info.mjs
      release-workflow-guards.test.ts
      resolve-desktop-release-config.mjs
      resolve-desktop-release-config.test.ts
      resolve-mobile-release-config.mjs
      resolve-mobile-release-config.test.ts
      trigger-ota-sync.mjs
      trigger-ota-sync.test.ts
      upload-mas-pkg.sh
    workflows/
      build-android.yml
      build-desktop.yml
      build-ios-development.yml
      build-ios.yml
      build-web.yml
      deploy-cloudflare-desktop.yml
      deploy-cloudflare-landing.yml
      deploy-cloudflare-ssr.yml
      issue-labeler.yml
      lint.yml
      pr-title-check.yml
      publish-ota.yml
      similar-issues.yml
      sync.yaml
      tag.yml
      translator.yml
  .vscode/
    extensions.json
    launch.json
    settings.json
  api/
    vercel_webhook.ts
  apps/
    cli/
      package.json
      skill.md
      tsconfig.json
      tsup.config.ts
      vitest.config.ts
      src/
        args.test.ts
        args.ts
        auth-command.test.ts
        browser-login.test.ts
        browser-login.ts
        cli.e2e.test.ts
        client.ts
        command.ts
        config.ts
        index.ts
        output.test.ts
        output.ts
        commands/
          auth.ts
          collection.ts
          entry.ts
          feed.ts
      
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md

This file provides concise, agent-focused guidance for working in this monorepo. It consolidates the repository's CLAUDE.md guides, .cursor rules, Cursor rules improvements, and modern agent best practices.

## Project overview

- Monorepo managed by pnpm workspaces + Turbo.
- Apps:
  - `apps/desktop` – Electron app (Vite + React renderer is the primary web app)
  - `apps/mobile` – React Native app via Expo
  - `apps/ssr` – Minimal SSR site for external sharing
- Shared packages: `packages/internal` (components, atoms, hooks, store, utils, database, etc.).

## Setup commands

```bash
# Install deps
pnpm install

# Desktop – recommended (browser renderer)
cd apps/desktop && pnpm run dev:web

# Desktop – full Electron
cd apps/desktop && pnpm run dev:electron

# Mobile – Expo
cd apps/mobile && pnpm run dev
# or target platforms
cd apps/mobile && pnpm run ios
cd apps/mobile && pnpm run android

# SSR
cd apps/ssr && pnpm run dev

# Build web version (desktop renderer)
pnpm run build:web
```

## Quality gates (must-pass before commit/PR)

```bash
# 1) Typecheck first (required)
pnpm run typecheck

# 2) Lint and auto-fix
pnpm run lint:fix

# 3) Tests
pnpm run test
```

- Run the above at the root, or use per-package variants as needed.
- Follow this order strictly: typecheck → lint → test.
- After every modification, run the following checks to catch errors early:

```bash
npm exec turbo run format:check typecheck lint
npm exec turbo run test
```

## Code style and conventions

- TypeScript strict; avoid `any` (use precise types). Comments in English. Keep solutions simple and maintainable.
- Prefer CSS transitions/animations for simple UI interactions. Use JS-driven motion only when necessary to avoid frame drops.
- Imports: use `pathe` instead of `node:path` for cross‑platform paths.
- Organize shared, reusable UI in `packages/internal/components`; app-specific UI stays in its app.
- **Style extraction**: Avoid inline styles in JSX. Extract complex styles (e

--- CONTRIBUTING.md ---
# Contributing to Folo

Thank you for considering contributing to Folo! We welcome contributions from the community to help improve and expand the project.

## Getting Started

Before you start contributing, please ensure you have enabled [Corepack](https://nodejs.org/api/corepack.html). Corepack ensures you are using the correct version of the package manager specified in the `package.json`.

```sh
corepack enable && corepack prepare
```

### Install

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
