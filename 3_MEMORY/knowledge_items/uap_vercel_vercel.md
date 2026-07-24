# KI: vercel/vercel

## Overview
Vercel’s AI Cloud is a unified platform for building modern applications, giving teams the tools to be flexible, move fast, and stay secure while focusing on their products instead of infrastructure.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Python
- Rust
- **Total files:** 125 files across 22 directories
- **File types:** .md: 44, .yml: 29, .ts: 12, .json: 10, .rs: 9, .toml: 3, .gitignore: 2

## Documentation Sections
- Vercel
- Deploy
- Native CLI binaries
- Documentation
- Contributing
- Local development
- Verifying your change
- Pull Request Process
- Interpreting test errors
- Deploy a Builder with existing project
- Reference

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  .node_version
  .npmrc
  .nvmrc
  .prettierignore
  .syncpackrc.json
  .vercel.approvers
  .vercelignore
  AGENTS.md
  Cargo.lock
  Cargo.toml
  DEVELOPING_A_RUNTIME.md
  LICENSE
  README.md
  RELEASE.md
  biome.jsonc
  fx-diff-test.txt
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  pyproject.toml
  test-cursor-detection.js
  tsconfig.base.json
  turbo.json
  turbo.node-runtime.json
  uv.lock
  vercel.json
  vitest.config.mts
  .changeset/
    README.md
    angry-carrots-give.md
    backends-output-dir-dot.md
    canonical-services-config.md
    ci-unit-matrix-under-limit.md
    cli-dev-services-skip-detect-builders.md
    config.json
    container-dev-filter-host-env.md
    container-dev-honor-meta-port.md
    container-runtime.md
    dev-transforms.md
    fast-binary-validation.md
    fix-northstar-team-username-collision.md
    fix-vercel-auth-e2e-assertion.md
    fuzzy-geckos-upgrade.md
    great-carrots-dance.md
    next-large-functions.md
    reintroduce-vercel-passport.md
  .claude/
    skills/
      vercel-runtime-implementation-guide.md
  .github/
    AFFECTED_TESTING.md
    CODEOWNERS
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    EXAMPLE_README_TEMPLATE.md
    zizmor.yml
    DISCUSSION_TEMPLATE/
      general.yml
      help.yml
      ideas.yml
      show-and-tell.yml
    ISSUE_TEMPLATE/
      cli_bug_report.md
      config.yml
    aw/
      actions-lock.json
    workflows/
      agentics-maintenance.yml
      bootstrap-vercel-aws-placeholder.yml
      canary.yml
      ci-doctor.lock.yml
      ci-doctor.md
      cli-evals.yml
      comment-cli-tarball.yml
      cron-update-gatsby-fixtures.yml
      cron-update-next-canary.yml
      cron-update-next-latest.yml
      cron-update-turbo.yml
      discussions-auto-close.yml
      faster-template-prebuild-nextjs.yml
      release-binary.yml
      release-crates.yml
      release-python-package.yml
      release.yml
      rollback-latest-tag.yml
      test-lint.yml
      test-python-packages.yml
      test.yml
      update-remix-run-dev.yml
      update-sandbox.yml
      validate-binary.yml
  .husky/
    .gitignore
    pre-commit
  api/
    frameworks.ts
    package.json
    tsconfig.json
    _lib/
      types.ts
      examples/
        example-list.ts
        github-repo-info.ts
        gitlab-repo-info.ts
        map-old-to-new.ts
        summary.ts
      script/
        build.ts
      util/
        assert-env.ts
        error-handler.ts
       
```

## Quick Start
```bash
npm i -g vercel
npm i -g @vercel/vc-native --force
npm i -g @vercel/vc-native-darwin-x64 --force
git clone https://github.com/vercel/vercel
cd vercel
corepack enable
pnpm install
pnpm build
pnpm lint
pnpm test-unit
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md

Guidelines for AI agents working on the Vercel monorepo.

## Repository Structure

This is a pnpm monorepo containing 44+ packages for the Vercel CLI and runtimes:

- `/packages/*` - Public npm packages (@vercel scope)
- `/internals/*` - Internal shared packages (@vercel-internals scope)
- `/crates` - Rust workspace
- `/examples` - Framework examples for testing
- `/utils` - Build and test utilities

## Essential Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm type-check       # TypeScript validation
pnpm lint             # ESLint check
pnpm test-unit        # Run unit tests
pnpm test-e2e         # Run e2e tests
```

Run tests for a specific package:

```bash
cd packages/<name>
pnpm test-unit
```

## Changesets

**Always create a changeset for all PRs.**

```bash
pnpm changeset
```

A changeset is a markdown file in `.changeset/` with YAML frontmatter listing affected packages and their bump type (patch/minor/major).

### Changeset Rules

1. Every PR must include a changeset (use empty frontmatter for non-package changes).
2. If your change modifies a package in `/packages/*`, include it in the changeset frontmatter
3. If your change only affects non-package files (docs, config, examples, internal tooling), create a changeset with **empty frontmatter** - just the description
4. Packages in `/internals/*`, `/api`, and `/examples` are ignored by changesets (see `.changeset/config.json`)

Example changeset for a package change:

```md
---
'@vercel/node': patch
---

Fixed edge case in serverless function bundling.
```

Example changeset for non-package changes:

```md
---
---

Updated CI workflow configuration.
```

## Code Style

- **Formatting**: Prettier with single quotes, trailing commas (es5), no parens for single arrow params
- **Linting**: ESLint with TypeScript rules
- **No unused variables**: `@typescript-eslint/no-unused-vars` is enforced
- **No focused/disabled tests**: `jest/no-focu


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
