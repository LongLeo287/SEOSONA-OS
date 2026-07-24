# KI: emdash-cms/emdash

## Overview
Agent-portable reimplementation of WordPress on Astro

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 119 files across 27 directories
- **File types:** .yml: 32, .md: 25, .ts: 24, .json: 19, .yaml: 5, .mjs: 5, .gitignore: 2
- **Dev dependencies:** @axe-core/playwright, @changesets/changelog-github, @changesets/cli, @e18e/eslint-plugin, @lunariajs/core, @playwright/test, @types/node, @typescript/native-preview

## Core Capabilities
**Content** -- Blog posts, pages, custom content types. Rich text editing via TipTap with Portable Text storage. Revisions, drafts, scheduled publishing, full-text search (FTS5), inline visual editing.

**Admin** -- Full admin panel with visual schema builder, media library (drag-drop uploads via signed URLs), navigation menus, taxonomies, widgets, and a WordPress import wizard.

**Auth** -- Passkey-first (WebAuthn) with OAuth and magic link fallbacks. Role-based access control: Administrator, Editor, Author, Contributor.

**Plugins** -- `definePlugin()` API with lifecycle hooks, KV storage, settings, admin pages, dashboard widgets, custom block types, and API routes. Sandboxed execution on Cloudflare via Dynamic Worker Loaders.

**Agents** -- Skill files for AI-assisted plugin and theme development. CLI for programmatic site management. Built-in MCP server for direct AI tool integration.

**WordPress migration** -- Import posts, pages, media, and taxonomies from WXR exports, the WordPress REST API, or WordPress.com. Agent skills help port plugins and themes.

## Documentation Sections
- EmDash
- Get Started
- Templates
- Blog
- Marketing
- Portfolio
- Why EmDash?
- How It Works
- Features
- Portable Platforms
- Status
- Development
- Repository Structure

## Available Commands
- `npm run typecheck` -- pnpm run --filter {./packages/**} typecheck
- `npm run typecheck:demos` -- pnpm run --workspace-concurrency=1 --filter {./demos/*} --filter !@emdash-cms/de
- `npm run typecheck:templates` -- pnpm run --workspace-concurrency=1 --filter {./templates/*} typecheck
- `npm run check` -- pnpm run typecheck && pnpm run --filter {./packages/*} check
- `npm run test` -- pnpm run --filter {./packages/*} test
- `npm run test:unit` -- pnpm run --filter emdash --filter @emdash-cms/auth --filter @emdash-cms/blocks -
- `npm run test:browser` -- pnpm run --filter @emdash-cms/admin test
- `npm run test:e2e` -- playwright test
- `npm run test:e2e:ui` -- playwright test --ui
- `npm run build` -- pnpm run --filter {./packages/**} build
- `npm run postbuild` -- node scripts/relink-bins-if-needed.mjs
- `npm run format` -- oxfmt --ignore-path .gitignore && prettier --write .

## Core Structure
```
  .dockerignore
  .gitignore
  .oxfmtrc.json
  .oxlintrc.json
  .prettierignore
  .prettierrc
  AGENTS.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  TEMPLATES.md
  compose.yaml
  knip.json
  lingui.config.ts
  lunaria.config.ts
  package.json
  playwright.config.ts
  pnpm-lock.yaml
  pnpm-workspace.yaml
  renovate.json
  tsconfig.base.json
  tsconfig.json
  .agents/
    skills
  .changeset/
    README.md
    admin-css-isolation.md
    config.json
    fix-1398-toolbar-injection-no-store.md
    fix-byline-avatar-lqip.md
    fix-export-seed-with-content-all.md
    fix-plugin-request-body-guard.md
    fix-text-align-frontend-render.md
    honor-image-alignment.md
    text-align-round-trip.md
  .claude/
    CLAUDE.md
    skills
  .flue/
    .gitignore
    README.md
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    tsconfig.json
    fixtures/
      issue-1021.json
      issue-1042.json
      issue-1046.json
      issue-1049.json
      issue-1080.json
    lib/
      capacity.ts
      classifier.ts
    scripts/
      run-local.ts
    skills/
      _INVESTIGATE.md
      diagnose/
        SKILL.md
      fix/
        SKILL.md
      repro-admin/
        SKILL.md
      repro-api/
        SKILL.md
      repro-public/
        SKILL.md
      verify/
        SKILL.md
    workflows/
      classify-maintainer-reply.ts
      classify-reply.ts
      investigate.ts
  .github/
    PULL_REQUEST_TEMPLATE.md
    bonk-models.json
    dependabot.yml
    zizmor.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
    scripts/
      attach-plugin-tarballs.mjs
      check-no-major.mjs
      release.mjs
      resolve-bonk-model.mjs
      review-queue.mjs
    workflows/
      auto-extract.yml
      auto-format.yml
      bonk.yml
      bot-cleanup.yml
      ci.yml
      cla.yml
      codeql.yml
      dependabot-approve.yml
      format-command.yml
      format.yml
      investigate.yml
      lunaria.yml
      maintainer-reply.yml
      playground-preview-comment.yml
      pr-compliance.yml
      pr-sweep.yml
      pr-triage.yml
      preview-releases.yml
      query-counts-apply.yml
      query-counts-label.yml
      query-counts.yml
      release.yml
      reporter-reply.yml
      review-state.yml
      review.yml
      sync-templates.yml
      triage-project-sync.yml
      zizmor.yml
  .opencode/
    agents/
      auto-implementer.md
      auto-reviewer.md
  .vscode/
    settings.json
  apps/
    aggregator/
      .env.example
      package.json
      t
```

## Quick Start
```bash
npm create emdash@latest
**Structured content, not serialized HTML.** WordPress stores rich text as HTML with metadata embedded in comments -- tying your content to its DOM representation. EmDash uses [Portable Text](https://www.portabletext.org/), a structured JSON format that decouples content from presentation. Your content can render as a web page, a mobile app, an email, or an API response without parsing HTML.
**Built for agents.** EmDash ships with agent skills for building plugins and themes, a CLI that lets agents manage content and schema programmatically, and a built-in [MCP server](https://modelcontextprotocol.io/) so AI tools like Claude and ChatGPT can interact with your site directly.
**Runs anywhere.** EmDash uses portable abstractions at every layer -- Kysely for SQL, S3 API for storage -- that work with SQLite, D1, Turso, PostgreSQL, R2, AWS S3, or local files. It runs best on Cloudflare, but it's not locked to it.
EmDash is an Astro integration. Add it to your config and you get a complete CMS: admin panel, REST API, authentication, media library, and plugin system.
Content types are defined in the database, not in code. Non-developers create and modify collections through the admin UI. Each collection gets a real SQL table with typed columns. Developers generate TypeScript types from the live schema:
Query content using Astro's Live Collections -- no rebuilds, no separate API:
**Content** -- Blog posts, pages, custom content types. Rich text editing via TipTap with Portable Text storage. Revisions, drafts, scheduled publishing, full-text search (FTS5), inline visual editing.
**Admin** -- Full admin panel with visual schema builder, media library (drag-drop uploads via signed URLs), navigation menus, taxonomies, widgets, and a WordPress import wizard.
**Auth** -- Passkey-first (WebAuthn) with OAuth and magic link fallbacks. Role-based access control: Administrator, Editor, Author, Contributor.
```

## Agent Configuration

--- AGENTS.md ---
This file provides guidance to agentic coding tools working in this repository.

For human-facing contributor info (setup, repo layout, PR policy, changesets, i18n), see [CONTRIBUTING.md](CONTRIBUTING.md). This file focuses on the patterns and gotchas an agent needs to write correct code.

`CLAUDE.md` is a symlink to this file. `.opencode/skills` and `.claude/skills` are symlinks to `skills/`. Don't try to sync between them.

# Rules

**Backwards compatibility matters.** EmDash is published and in active use, pre-1.0. Prefer additive changes (new fields, new routes, new options with defaults). Breaking changes need an explicit decision, a package bump, and a changeset that calls the break out clearly. Database migrations are forward-only -- never write one that leaves existing content inaccessible. When in doubt, open a Discussion.

**TDD for bugs.** Failing test -> fix -> verify. A bug without a reproducing test is not fixed.

**Localize everything user-facing.** All admin UI strings, aria labels, and toast messages go through Lingui. All admin layout uses RTL-safe logical Tailwind classes. See [Localization](#admin-ui-localization-lingui) and [RTL](#admin-ui-rtl-safe-tailwind).

**Scope discipline.** No drive-by refactors, no bulk lint/type cleanups, no "while I'm here" edits in unrelated files. If you see a systemic issue, open a Discussion. See [CONTRIBUTING.md § Contribution Policy](CONTRIBUTING.md#contribution-policy).

## Workflow

Run `pnpm lint:json | jq '.diagnostics | length'` before starting and confirm it's clean -- if it's failing after your edits, your changes caused it.

During work:

- `pnpm lint:quick` after every edit (sub-second)
- `pnpm typecheck` (packages) or `pnpm typecheck:demos` (Astro demos) after each round of edits
- `pnpm format` regularly (oxfmt, tabs)

Before opening a PR: tests pass, lint clean, formatted, changeset added if a published package changed. See [CONTRIBUTING.md § Changesets](CONTRIBUTING.md#changesets).

A changeset is r

--- CONTRIBUTING.md ---
# Contributing to EmDash

EmDash is published to npm and in active use. During development you work inside the monorepo -- packages use `workspace:*` links, so everything works without publishing.

This guide covers setup, policy, and the rules around opening a PR. For code patterns (SQL, API routes, authorization, performance, Lingui, RTL, etc.), see [AGENTS.md](AGENTS.md).

## Prerequisites

- **Node.js** 22+
- **pnpm** 10+ (`corepack enable` if you

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
