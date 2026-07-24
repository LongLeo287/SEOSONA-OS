# KI: vercel-labs/agent-skills

## Overview
Repository with 326 files across 28 directories. Primary language: TypeScript (8 files).

## Tech Stack (from code)
- TypeScript (8 files)
- Shell (2 files)
- **Total:** 326 files, 28 directories
- **File types:** .md: 207, .mjs: 89, .json: 11, .ts: 8, .zip: 6, .gitignore: 2, .sh: 2, .yaml: 1

## File Structure
```
  .gitignore
  AGENTS.md
  CLAUDE.md
  README.md
  skills.sh.json
  packages/
    react-best-practices-build/
      .gitignore
      package.json
      pnpm-lock.yaml
      test-cases.json
      tsconfig.json
      src/
        build.ts
        config.ts
        extract-tests.ts
        migrate.ts
        parser.ts
        types.ts
        validate.ts
    vercel-optimize-tests/
      package.json
  skills/
    deploy-to-vercel.zip
    react-best-practices.zip
    react-view-transitions.zip
    vercel-cli-with-tokens.zip
    web-design-guidelines.zip
    composition-patterns/
      AGENTS.md
      README.md
      SKILL.md
      metadata.json
      rules/
        _sections.md
        _template.md
        architecture-avoid-boolean-props.md
        architecture-compound-components.md
        patterns-children-over-render-props.md
        patterns-explicit-variants.md
        react19-no-forwardref.md
        state-context-interface.md
        state-decouple-implementation.md
        state-lift-state.md
    deploy-to-vercel/
      Archive.zip
      SKILL.md
      resources/
        deploy-codex.sh
        deploy.sh
    react-best-practices/
      AGENTS.md
      README.md
      SKILL.md
      metadata.json
      rules/
        _sections.md
        _template.md
        advanced-effect-event-deps.md
        advanced-event-handler-refs.md
        advanced-init-once.md
        advanced-use-latest.md
        async-api-routes.md
        async-cheap-condition-before-await.md
        async-defer-await.md
        async-dependencies.md
        async-parallel.md
        async-suspense-boundaries.md
        bundle-analyzable-paths.md
        bundle-barrel-imports.md
        bundle-conditional.md
        bundle-defer-third-party.md
        bundle-dynamic-imports.md
        bundle-preload.md
        client-event-listeners.md
        client-localstorage-schema.md
        client-passive-event-listeners.md
        client-swr-dedup.md
        js-batch-dom-css.md
        js-cache-function-
```

## Agent Configuration
### AGENTS.md
# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with code in this repository.

## Repository Overview

A collection of skills for AI coding agents working with Vercel projects. Skills are packaged instructions and scripts that extend agent capabilities.

## Creating a New Skill

### Directory Structure

```
skills/
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition
    scripts/              # Optional: executable scripts
      {script-name}.sh    # Bash scripts
      {script-name}.mjs   # Node scripts
    references/           # Optional: supporting docs loaded on demand
    lib/                  # Optional: shared code for scripts
```

### Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `vercel-deploy`, `log-monitor`)
- **SKILL.md**: Always uppercase, always this exact filename
- **Scripts**: `kebab-case.sh` or `kebab-case.mjs` (e.g., `deploy.sh`, `collect-signals.mjs`)

### SKILL.md Format

```markdown
---
name: {skill-name}
description: {One sentence describing when to use this skill. Include trigger phrases like "Deploy my app", "Check logs", etc.}
---

# {Skill Title}

{Brief description of what the skill does.}

## How It Works

{Numbered list explaining the skill's workflow}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Description (defaults to X)

**Examples:**
{Show 2-

### CLAUDE.md
AGENTS.md

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
