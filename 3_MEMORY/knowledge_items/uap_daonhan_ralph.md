# KI: daonhan/ralph

## Overview
Ralph drives [Claude Code](https://docs.anthropic.com/claude/docs/claude-code) against a target repository in an iterating implementer → reviewer pipeline, isolated inside a custom Docker image. The harness ships as two npm packages, with thin bash shims that wire host paths + credentials into the CLI.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 99 files across 18 directories
- **File types:** .md: 41, .ts: 20, .mjs: 11, .json: 7, .yml: 6, .yaml: 2, .js: 2
- **Dev dependencies:** @types/node, husky, lint-staged, prettier, typescript

## Documentation Sections
- Ralph — Autonomous Claude Code Loop
- Architecture (AFK loops)
- Repo layout
- Prerequisites
- Supported shells / OS combinations
- Windows + WSL: credentials
- WSL bash — replace <WINUSER>
- First-run setup
- 1. Get the image
- 2. Log in to the image (one-off)

## Available Commands
- `npm run build` -- pnpm -r run build
- `npm run clean` -- pnpm -r run clean
- `npm run typecheck` -- pnpm -r run typecheck
- `npm run test` -- node --test scripts/runner-floating-ref.test.mjs scripts/release-please-config.t
- `npm run publish-all` -- pnpm -r publish --access public --no-git-checks
- `npm run prepare` -- husky || git config core.hooksPath .husky

## Core Structure
```
  .dockerignore
  .gitignore
  .lintstagedrc
  .npmrc
  .prettierignore
  .prettierrc
  .release-please-manifest.json
  CHANGELOG.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  QUICKSTART.md
  README.md
  RELEASING.md
  SECURITY.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  release-please-config.json
  tsconfig.base.json
  .claude/
    CLAUDE.md
  .github/
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      config.yml
      feature_request.md
    workflows/
      ci.yml
      publish-image.yml
      publish-npm.yml
      release-please.yml
  .husky/
    pre-commit
  apps/
    cli/
      CHANGELOG.md
      README.md
      package.json
      bin/
        ralph-afk.js
        ralph-ghafk.js
      scripts/
        afk.sh
        ghafk.sh
  docs/
    ARCHITECTURE.md
    PUBLISHING.md
    keep-alive.md
    ralph-stack.png
    ralph-stack.svg
    plans/
      README.md
      cli-output-prettifier.md
      keep-alive.md
      multi-version-runtime-support.md
      public-launch-readiness.md
      ralph-model.md
      release.md
      result-grace-timer.md
    prd/
      README.md
      keep-alive.md
      multi-version-runtime-support.md
      public-launch-readiness.md
      ralph-model.md
      release.md
      result-grace-timer.md
      shrink-agent-playbooks.md
  packages/
    core/
      CHANGELOG.md
      README.md
      package.json
      tsconfig.json
      src/
        cli-help.ts
        detach.ts
        gh-main.ts
        index.ts
        keepalive.ts
        loop.ts
        main.ts
        notify.ts
        render.ts
        retry.ts
        run-bin.ts
        runner.ts
        stages.ts
        stream-render.ts
        __tests__/
          detach.test.ts
          keepalive.test.ts
          loop.test.ts
          notify.test.ts
          retry.test.ts
          runner.test.ts
      templates/
        CHANGELOG.md
        Dockerfile
        afk.md
        ghafk.md
        ghprompt.md
        prompt.md
        review.md
  scripts/
    ensure-image-integration.mjs
    registries-not-behind-git.mjs
    registries-not-behind-git.test.mjs
    release-please-config.test.mjs
    runner-floating-ref.test.mjs
    smoke-render.mjs
    smoke-spill-large.mjs
    smoke-spill-size.mjs
    smoke-templates.mjs
    update-status-table.mjs
    update-status-table.test.mjs
```

## Quick Start
```bash
ralph-afk / ralph-ghafk               (bin entries from @daonhan/ralph, on PATH after `npm i -g`)
│
▼
@daonhan/ralph (CLI, apps/cli)        bin: ralph-afk, ralph-ghafk; scripts: afk.sh, ghafk.sh shims
│ imports
▼
@daonhan/ralph-core (packages/core)
├── runAfk / runGhAfk              (env-driven entry: argv → runLoop)
├── runLoop                        (drives stage chain per iteration; checks sentinel)
├── render                         (renderer: @include / @spill / !? / !`cmd` / {{ INPUTS }})
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. See [.claude/CLAUDE.md](.claude/CLAUDE.md) (behavioral rules).

## What this repo is

Ralph is a Node/TypeScript harness that drives the Claude Code CLI against a target repository in an iterating implementer → reviewer loop, inside an ephemeral Docker container (`ralph-sandbox`). It ships as a pnpm monorepo with two npm packages:

- `@daonhan/ralph-core` (`packages/core`) — library: loop driver, docker runner, template renderer, stage registry. ESM, TS-compiled to `dist/`.
- `@daonhan/ralph` (`apps/cli`) — CLI exposing `ralph-afk` (plan/PRD loop) and `ralph-ghafk` (GitHub-issue loop) bin entries. Hand-written JS bins, no build step. Depends on `@daonhan/ralph-core` via `workspace:^`.

## Commands

All commands run from the repo root unless noted. Node ≥20, pnpm ≥9.

```bash
pnpm install                 # link workspace, hoist devDeps
pnpm -r build                # compile packages/core/dist (tsc -p tsconfig.json)
pnpm -r typecheck            # tsc --noEmit across workspace
pnpm -r clean                # rm packages/core/dist
pnpm publish-all             # pnpm -r publish --access public --no-git-checks
```

Verification = `pnpm -r typecheck` + `pnpm -r test` (`packages/core` runs `vitest run`; `apps/cli` has no tests) + root `pnpm test` (`node --test` over `scripts/*.test.mjs`). A husky pre-commit hook runs `lint-staged` (`prettier --ignore-unknown --write` on staged files) then `pnpm typecheck`. Full contributor guide: [CONTRIBUTING.md](CONTRIBUTING.md).

Per-package: `pnpm --filter @daonhan/ralph-core build` (only core has a build).

### Smoke-test the published artifacts locally

```bash
pnpm -r build
(cd packages/core && pnpm pack --pack-destination /tmp/ralph-packs)
(cd apps/cli      && pnpm pack --pack-destination /tmp/ralph-packs)
npm i -g /tmp/ralph-packs/daonhan-ralph-core-*.tgz /tmp/ralph-packs/daonhan-ralph-*.tgz
ralph-afk          # → prin

--- CONTRIBUTING.md ---
# Contributing to Ralph

This guide is for **maintainers and contributors hacking on the monorepo itself** —
the loop driver, docker runner, template renderer, CLI bins, and release pipeline.
If you just want to _run_ Ralph against your own repo, see [`./README.md`](./README.md)
(and [`./QUICKSTART.md`](./QUICKSTART.md) for the short path). For the runtime model
(loop topology, stages, the docker run line), read [`./docs/ARCHITECTURE.md`](./docs/ARCHI

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
