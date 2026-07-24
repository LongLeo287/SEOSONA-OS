# KI: CodebuffAI/codebuff

## Overview
**[Codebuff](https://codebuff.com)** is an open-source AI coding assistant that edits your codebase through natural language instructions. **[Freebuff](https://www.npmjs.com/package/freebuff)** is the free, ad-supported version — no subscription, no credits, no configuration.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Zod
- **Total files:** 127 files across 21 directories
- **File types:** .ts: 92, .md: 9, .json: 9, .js: 7, .gitignore: 2, .png: 2, .bun-version: 1
- **Key dependencies:** canvas, gif-encoder-2, zod
- **Dev dependencies:** @tanstack/react-query, @types/bun, @types/js-yaml, @types/lodash, @types/node, @types/node-fetch, @types/parse-path, @typescript-eslint/eslint-plugin

## Documentation Sections
- Codebuff & Freebuff
- Freebuff: the free coding agent
- Install
- Usage
- Why Freebuff?
- Features
- Commands
- FAQ
- How it works
- CLI: Install and start coding
- Create custom agents
- SDK: Run agents in production
- Why choose Codebuff
- Advanced Usage
- Custom Agent Workflows
- Contributing to Codebuff
- Running Tests
- macOS
- Ubuntu/Debian
- Windows (via WSL)
- Get started
- Install
- Resources
- Star History

## Available Commands
- `npm run start-cli` -- bun --cwd cli dev
- `npm run dev` -- bun start-cli
- `npm run dev:freebuff` -- FREEBUFF_MODE=true bun --cwd cli dev
- `npm run release:cli` -- bun run --cwd=cli release
- `npm run release:sdk` -- bun run --cwd=sdk release
- `npm run release:freebuff` -- bun run --cwd=freebuff release
- `npm run build:sdk` -- cd sdk && bun run build
- `npm run build:freebuff` -- bun freebuff/cli/build.ts 0.0.0-dev
- `npm run buffbench` -- bun --cwd evals run-buffbench
- `npm run ci` -- bun run build:sdk && bun run build:freebuff

## Core Structure
```
  .bun-version
  .codebuffignore
  .gitignore
  .prettierrc
  AGENTS.md
  CONTRIBUTING.md
  LICENSE
  NOTICE
  README.md
  README.zh-CN.md
  SECURITY.md
  WINDOWS.md
  bun.lock
  bunfig.toml
  eslint.config.js
  package.json
  tsconfig.base.json
  tsconfig.json
  agents/
    base-chat.ts
    basher.ts
    constants.ts
    context-pruner.ts
    package.json
    tmux-cli.ts
    tsconfig.json
    __tests__/
      base2.test.ts
      basher.test.ts
      context-pruner.test.ts
      editor.test.ts
      file-picker.test.ts
      thinker.test.ts
    base2/
      base-deep-evals.ts
      base-deep.ts
      base2-evals.ts
      base2-fast-no-validation.ts
      base2-fast.ts
      base2-free-deepseek-flash.ts
      base2-free-deepseek.ts
      base2-free-evals.ts
      base2-free-glm.ts
      base2-free-kimi.ts
      base2-free-mimo-pro.ts
      base2-free-mimo.ts
      base2-free-minimax-m3.ts
      base2-free.ts
      base2-gemini-evals.ts
      base2-kimi-2-7-code.ts
      base2-lite.ts
      base2-max-evals.ts
      base2-max.ts
      base2-mimo.ts
      base2-plan.ts
      base2.ts
    browser-use/
      browser-use.test.ts
      browser-use.ts
    e2e/
      base-deep.e2e.test.ts
      base2-free-summary-format.e2e.test.ts
      context-pruner.e2e.test.ts
      context-pruning-threshold.e2e.test.ts
      editor-best-of-n.e2e.test.ts
      file-explorer.e2e.test.ts
      gravity-index.e2e.test.ts
    editor/
      editor-gpt-5.ts
      editor.ts
      best-of-n/
        best-of-n-selector2.ts
        editor-implementor-gpt-5.ts
        editor-implementor-opus.ts
        editor-implementor.ts
        editor-multi-prompt.ts
    file-explorer/
      code-searcher.ts
      directory-lister.ts
      file-lister-max.ts
      file-lister.ts
      file-picker-max.ts
      file-picker.ts
      glob-matcher.ts
    general-agent/
      general-agent.ts
      gpt-5-agent.ts
      opus-agent.ts
    librarian/
      librarian.test.ts
      librarian.ts
    researcher/
      researcher-docs.ts
      researcher-web.ts
    reviewer/
      code-reviewer-deepseek-flash.ts
      code-reviewer-deepseek.ts
      code-reviewer-glm.ts
      code-reviewer-gpt.ts
      code-reviewer-kimi.ts
      code-reviewer-lite.ts
      code-reviewer-mimo-pro.ts
      code-reviewer-mimo.ts
      code-reviewer-minimax-m3.ts
      code-reviewer-minimax.ts
      code-reviewer-opus.ts
      code-reviewer.ts
      multi-prompt/
        code-reviewer-multi-prompt.ts
    thinker/
      thinker-gemini.ts
```

## Quick Start
```bash
npm install -g freebuff
cd ~/my-project
freebuff
npm install -g codebuff
cd your-project
codebuff
codebuff
```

## Agent Configuration

--- AGENTS.md ---
# Freebuff

Freebuff is the public, free coding agent built from the Codebuff agent framework.

## Key Technologies

- TypeScript monorepo
- Bun runtime and package manager
- OpenTUI + React CLI
- JS/TS SDK
- Composable agent runtime

## Repo Map

- `cli/` - TUI client and local UX
- `sdk/` - JS/TS SDK used by the CLI and external users
- `common/` - shared types, tools, schemas, and utilities
- `agents/` - public agent definitions
- `packages/agent-runtime/` - agent runtime and tool handling
- `packages/code-map/` - source parsing helpers
- `packages/llm-providers/` - public LLM provider shims
- `freebuff/` - Freebuff CLI, release files, and e2e tests
- `scripts/tmux/` - tmux helpers for CLI testing

## Conventions

- Use `bun install` and `bun run`.
- Prefer dependency injection over module mocking.
- Run interactive CLI tests in tmux.
- Do not force-push `main`.

## Docs

- `docs/agents-and-tools.md`
- `docs/testing.md`


--- CONTRIBUTING.md ---
# Contributing

This repository is a public mirror of the Freebuff/Codebuff source tree. The private repository is the source of truth, so accepted public contributions are ported into the private repo and then exported back here.

## Public Contributions

Good public PRs are usually scoped to:

- `cli/`
- `sdk/`
- `common/`
- `agents/`
- `packages/agent-runtime/`
- `packages/code-map/`
- `packages/llm-providers/`
- `freebuff/`, excluding the private web app
- `scripts/tmux/`
- public docs

Please do not add backend, database, billing, deployment, or secret-management code to the public repo.

## Development

Install dependencies:

```bash
bun install
```

Build the SDK:

```bash
bun run build:sdk
```

Build the Freebuff binary:

```bash
bun run build:freebuff
```

## Pull Request Flow

1. Open the PR against the public repo.
2. Public CI validates the exported public packages.
3. A maintainer reviews the change.
4. If accepted, a maintainer ports the patch into the private source repo.
5. The next public export brings the accepted change back into this repo.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
