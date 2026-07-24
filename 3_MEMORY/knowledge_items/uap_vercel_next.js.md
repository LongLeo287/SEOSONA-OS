# KI: vercel/next.js

## Overview
No description extracted.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Rust
- **Total files:** 110 files across 38 directories
- **File types:** .md: 33, .yml: 19, .json: 17, .toml: 6, .js: 6, .yaml: 5, .sh: 5

## Core Structure
```
  .alexignore
  .alexrc
  .cursorindexingignore
  .git-blame-ignore-revs
  .gitattributes
  .gitignore
  .ignore
  .node-version
  .npmrc
  .prettierignore
  .prettierrc.json
  .rustfmt.toml
  .typos.toml
  AGENTS.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  Cargo.lock
  Cargo.toml
  UPGRADING.md
  conductor.json
  contributing.md
  eslint.cli.config.mjs
  eslint.config.mjs
  jest.config.js
  jest.config.turbopack.js
  lerna.json
  license.md
  lint-staged.config.js
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  readme.md
  release.js
  run-evals.js
  run-tests.js
  rust-toolchain.toml
  sgconfig.yml
  skills-lock.json
  socket.yaml
  test-file.txt
  tsconfig-tsec.json
  tsconfig.json
  tsec-exemptions.json
  turbo.json
  vercel.json
  .agents/
    skills/
      README.md
      authoring-skills/
        SKILL.md
      backport-pr/
        SKILL.md
      create-pr/
        SKILL.md
      dce-edge/
        SKILL.md
      flags/
        SKILL.md
      gh-stack/
        SKILL.md
      insight-error-page/
        SKILL.md
      next-rspack/
        SKILL.md
      pr-status-triage/
        SKILL.md
        local-repro.md
        workflow.md
      react-vendoring/
        SKILL.md
      router-act/
        SKILL.md
      runtime-debug/
        SKILL.md
      update-docs/
        SKILL.md
        references/
          CODE-TO-DOCS-MAPPING.md
          DOC-CONVENTIONS.md
      v8-jit/
        SKILL.md
      write-api-reference/
        SKILL.md
      write-guide/
        SKILL.md
  .cargo/
    .vercel.approvers
    config.toml
  .claude/
    skills
  .conductor/
    README.md
    scripts/
      run.sh
      setup.sh
  .config/
    .vercel.approvers
    eslintignore.mjs
    nextest.toml
    ast-grep/
      rule-tests/
        no-context-format-test.yml
        no-context-test.yml
        no-err-anyhow-test.yml
        no-map-async-cell-test.yml
        __snapshots__/
          no-context-format-snapshot.yml
          no-context-snapshot.yml
          no-context-turbofmt-snapshot.yml
          no-err-anyhow-snapshot.yml
          no-map-async-cell-snapshot.yml
      rule-utils/
        .gitkeep
      rules/
        no-context-format.yml
        no-context.yml
        no-err-anyhow.yml
        no-map-async-cell.yml
  .cursor/
    worktrees.json
    commands/
      gt-workflow.md
  .devcontainer/
    devcontainer-lock.json
    devcontainer.json
    headless-browser/
      devcontainer-feature.json
      install.sh
    node-extras/
      devcontainer-feature.json
    
```

## Agent Configuration

--- AGENTS.md ---
# Next.js Development Guide

> **Note:** `CLAUDE.md` is a symlink to `AGENTS.md`. They are the same file.

## Codebase structure

### Monorepo Overview

This is a pnpm monorepo containing the Next.js framework and related packages.

```
next.js/
├── packages/           # Published npm packages
├── turbopack/          # Turbopack bundler (Rust) - git subtree
├── crates/             # Rust crates for Next.js SWC bindings
├── test/               # All test suites
├── examples/           # Example Next.js applications
├── docs/               # Documentation
└── scripts/            # Build and maintenance scripts
```

### Core Package: `packages/next`

The main Next.js framework lives in `packages/next/`. This is what gets published as the `next` npm package.

**Source code** is in `packages/next/src/`.

**Key entry points:**

- Dev server: `src/cli/next-dev.ts` → `src/server/dev/next-dev-server.ts`
- Production server: `src/cli/next-start.ts` → `src/server/next-server.ts`
- Build: `src/cli/next-build.ts` → `src/build/index.ts`

**Compiled output** goes to `packages/next/dist/` (mirrors src/ structure).

### Other Important Packages

- `packages/create-next-app/` - The `create-next-app` CLI tool
- `packages/next-swc/` - Native Rust bindings (SWC transforms)
- `packages/eslint-plugin-next/` - ESLint rules for Next.js
- `packages/font/` - `next/font` implementation
- `packages/third-parties/` - Third-party script integrations

### README files

Before editing or creating files in any subdirectory (e.g., `packages/*`, `crates/*`), read all `README.md` files in the directory path from the repo root up to and including the target file's directory. This helps identify any local patterns, conventions, and documentation.

**Example:** Before editing `turbopack/crates/turbopack-ecmascript-runtime/js/src/nodejs/runtime/runtime-base.ts`, read:

- `turbopack/README.md` (if exists)
- `turbopack/crates/README.md` (if exists)
- `turbopack/crates/turbopack-ecmascript-runtime/README.md` 

--- CLAUDE.md ---
AGENTS.md

--- CONTRIBUTING.md ---
# Contributing to Next.js

[Watch the 40-minute walkthrough video on how to contribute to Next.js.](https://www.youtube.com/watch?v=cuoNzXFLitc)

- Read about our [Commitment to Open Source](https://vercel.com/oss).
- Before jumping into a PR be sure to search [existing PRs](https://github.com/vercel/next.js/pulls) or [issues](https://github.com/vercel/next.js/issues) for an open or closed item that relates to your submiss

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
