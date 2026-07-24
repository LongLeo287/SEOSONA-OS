# KI: microsoft/clarity

## Overview
Clarity is an open-source behavioral analytics library written in typescript, with two key goals: privacy & performance.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 129 files across 20 directories
- **File types:** .ts: 90, .json: 14, .md: 10, .png: 6, .html: 3, .npmignore: 2, .gitignore: 1
- **Dev dependencies:** @playwright/test, lerna, parse-url, ts-node

## Documentation Sections
- Clarity
- Project Structure
- Releasing new version
- Examples
- Privacy Notice
- Claude Code Setup (Optional)
- Prerequisites for MCP Server
- Enable MCP Server
- What It Provides
- Improving Clarity

## Available Commands
- `npm run version` -- npx lerna version
- `npm run build` -- npx lerna run build --stream
- `npm run build:js` -- yarn workspace clarity-js build
- `npm run build:decode` -- yarn workspace clarity-decode build
- `npm run build:visualize` -- yarn workspace clarity-visualize build
- `npm run build:devtools` -- yarn workspace clarity-devtools build
- `npm run test` -- playwright test
- `npm run test:ui` -- playwright test --ui
- `npm run bump-version` -- ts-node scripts/bump-version.ts

## Core Structure
```
  .gitignore
  .mcp.json
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  NOTICE.txt
  README.md
  SECURITY.md
  lerna.json
  package.json
  playwright.config.ts
  tsconfig.json
  yarn.lock
  .github/
    copilot-instructions.md
    ISSUE_TEMPLATE/
      bug_report.md
    workflows/
      pr-check.yml
  packages/
    clarity-decode/
      .npmignore
      README.md
      package.json
      rollup.config.ts
      tsconfig.json
      tslint.json
      src/
        clarity.ts
        data.ts
        diagnostic.ts
        global.ts
        index.ts
        interaction.ts
        layout.ts
        performance.ts
      test/
        decode.test.ts
      types/
        core.d.ts
        data.d.ts
        diagnostic.d.ts
        index.d.ts
        interaction.d.ts
        layout.d.ts
        performance.d.ts
    clarity-devtools/
      README.md
      package.json
      rollup.config.ts
      tsconfig.json
      tslint.json
      src/
        background.ts
        clarity.ts
        config.ts
        content.ts
        devtools.ts
        panel.ts
        popup.ts
      static/
        devtools.html
        icon-128.png
        icon-16.png
        icon-32.png
        icon-48.png
        icon-activated.png
        icon.png
        manifest.json
        panel.html
        popup.html
    clarity-js/
      .npmignore
      README.md
      package.json
      rollup.config.ts
      tsconfig.json
      tslint.json
      src/
        clarity.ts
        global.ts
        index.ts
        queue.ts
        core/
          api.ts
          config.ts
          copy.ts
          dynamic.ts
          event.ts
          hash.ts
          history.ts
          index.ts
          measure.ts
          report.ts
          scrub.ts
          task.ts
          throttle.ts
          time.ts
          timeout.ts
          version.ts
        data/
          baseline.ts
          compress.ts
          consent.ts
          cookie.ts
          custom.ts
          dimension.ts
          encode.ts
          envelope.ts
          extract.ts
          index.ts
          limit.ts
          metadata.ts
          metric.ts
          ping.ts
          signal.ts
          summary.ts
          token.ts
          upgrade.ts
          upload.ts
          util.ts
          variable.ts
        diagnostic/
          encode.ts
          fraud.ts
          index.ts
          internal.ts
          script.ts
        dynamic/
          agent/
            blank.ts
            crisp.ts
            en
```

## Quick Start
```bash
yarn bump-version
python3 --version  # Verify installation
pip3 install mcp-server-git
```

## Agent Configuration

--- CLAUDE.md ---
# Clarity Development Guidelines

## Repository Overview

Clarity is an open-source TypeScript behavioral analytics library for tracking user interactions and session replays. Monorepo with Lerna/Yarn workspaces:

- **clarity-js** (packages/clarity-js): Core instrumentation library
- **clarity-decode** (packages/clarity-decode): Data decoder
- **clarity-visualize** (packages/clarity-visualize): Session replay visualization
- **clarity-devtools** (packages/clarity-devtools): Chrome extension (private)

**Stack:** TypeScript, Rollup, TSLint, Playwright, Lerna, Yarn workspaces

## clarity-js Performance & Bundle Size Priorities

**Critical:** clarity-js has two top priorities that must guide all development decisions:

1. **Performance** - As an analytics library running on diverse websites, clarity-js must not hurt website performance or impact metrics like INP (Interaction to Next Paint) or PLT (Page Load Time). Balance data collection needs with:
   - Avoid blocking the main thread
   - Minimize network requests
   - Reduce payload size

2. **Bundle Size** - Small bundle size is crucial for loading clarity-js quickly and starting data collection as soon as possible. Every byte matters.

## Build & Development Commands

### Installation
**ALWAYS run `yarn install` before building or testing.** (~25s, peer dependency warnings are normal)

### Building

```bash
yarn build              # All packages (~45s, Lerna parallel build)
yarn build:js           # clarity-js only (~20s)
yarn build:decode       # clarity-decode only
yarn build:visualize    # clarity-visualize only
yarn build:devtools     # clarity-devtools only
```

Rollup + TypeScript → multiple formats (CJS, ESM, IIFE minified). Build artifacts auto-cleaned to `build/` or `extension/` (gitignored).

**Build outputs per package:**
- clarity-js: `clarity.js` (CJS), `clarity.module.js` (ESM), `clarity.min.js` (minified), plus variants: `clarity.extended.js`, `clarity.insight.js`, `clarity.performance.js`, `clarity.

--- CONTRIBUTING.md ---
# Contributing to Clarity

The goal of this document is to provide easy instructions to setup a development environment and provide clear contribution guidelines to encourage participation from more developers.

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For deta

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
