# KI: withastro/astro

## Overview
![Build the web you want](.github/assets/banner.jpg 'Build the web you want')

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 104 files across 43 directories
- **File types:** .json: 30, .md: 24, .svg: 18, .ts: 6, .yml: 4, .mjs: 4, .png: 3

## Documentation Sections
- Install
- Documentation
- Support
- Contributing
- Directory
- Links
- Sponsors

## Core Structure
```
  .editorconfig
  .git-blame-ignore-revs
  .gitignore
  .gitpod.yml
  .nvmrc
  .prettierignore
  AGENTS.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  SECURITY_CONTACTS
  STYLE_GUIDE.md
  biome.jsonc
  eslint.config.js
  knip.js
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  prettier.config.mjs
  tsconfig.json
  turbo.json
  .agents/
    skills/
      analyze-github-action-logs/
        SKILL.md
      astro-developer/
        SKILL.md
        architecture.md
        constraints.md
        debugging.md
        testing.md
      astro-pr-writer/
        SKILL.md
      changeset/
        SKILL.md
      merge/
        SKILL.md
        clean-changesets.md
        fix-ci.md
        resolve-conflicts.md
      triage/
        SKILL.md
        diagnose.md
        fix.md
        reproduce.md
        verify.md
  .changeset/
    README.md
    config.json
  .devcontainer/
    Dockerfile
    devcontainer.json
    example-welcome-message.txt
    examples.Dockerfile
    welcome-message.txt
    basics/
      devcontainer.json
    blog/
      devcontainer.json
    component/
      devcontainer.json
    docs/
      devcontainer.json
    framework-alpine/
      devcontainer.json
    framework-lit/
      devcontainer.json
    framework-multiple/
      devcontainer.json
    framework-preact/
      devcontainer.json
    framework-react/
      devcontainer.json
    framework-solid/
      devcontainer.json
    framework-svelte/
      devcontainer.json
    framework-vue/
      devcontainer.json
    hackernews/
      devcontainer.json
    integration/
      devcontainer.json
    minimal/
      devcontainer.json
    non-html-pages/
      devcontainer.json
    portfolio/
      devcontainer.json
    ssr/
      devcontainer.json
    with-markdown-plugins/
      devcontainer.json
    with-markdown-shiki/
      devcontainer.json
    with-mdx/
      devcontainer.json
    with-nanostores/
      devcontainer.json
    with-tailwindcss/
      devcontainer.json
    with-vitest/
      devcontainer.json
  .flue/
    lib/
      github.ts
    workflows/
      merge-fix.ts
      merge-resolve.ts
      merge-fix/
        WORKFLOW.ts
        github.ts
      merge-resolve/
        WORKFLOW.ts
  .github/
    PULL_REQUEST_TEMPLATE.md
    labeler.yml
    renovate.json5
    ISSUE_TEMPLATE/
      ---01-bug-report.yml
      config.yml
    assets/
      banner.jpg
      banner.png
      deepgram-dark.svg
      deepgram.svg
      divriots-dark.svg
      divriots.svg
      monogram-dark.svg

```

## Quick Start
```bash
npm create astro@latest
npm install astro
```

## Agent Configuration

--- AGENTS.md ---
# Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

# Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

# Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

# Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

# Style Guide

- Not defined here. For now, follow the same conventions and patterns th

--- CONTRIBUTING.md ---
# Contributor Manual

We welcome contributions of any size and skill level. As an open source project, we believe in giving back to our contributors and are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.

> [!Tip]
>
> **For new contributors:** Take a look at [https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions) for helpful information 

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
