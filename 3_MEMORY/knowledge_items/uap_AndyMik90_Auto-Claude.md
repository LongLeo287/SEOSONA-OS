# KI: AndyMik90/Auto-Claude

## Overview
Autonomous multi-agent coding framework powered by Claude AI

## Tech Stack (from code)
- TypeScript (667 files)
- TypeScript (React) (324 files)
- JavaScript (3 files)
- **Total:** 1177 files, 156 directories
- **File types:** .ts: 667, .tsx: 324, .md: 102, .json: 30, .txt: 10, .png: 9, .cjs: 5, .yaml: 4

## Dependencies
### Dependencies (from package.json)
- `lucide-react`: ^0.562.0

### Dev Dependencies
- `jsdom`: ^27.4.0

## Available Commands
- `npm run install:all` -- `cd apps/desktop && npm install`
- `npm run start` -- `cd apps/desktop && npm run build && npm run start`
- `npm run dev` -- `cd apps/desktop && npm run dev`
- `npm run dev:debug` -- `cd apps/desktop && npm run dev:debug`
- `npm run dev:mcp` -- `cd apps/desktop && npm run dev:mcp`
- `npm run build` -- `cd apps/desktop && npm run build`
- `npm run lint` -- `cd apps/desktop && npm run lint`
- `npm run test` -- `cd apps/desktop && npm test`
- `npm run package` -- `cd apps/desktop && npm run package`
- `npm run package:mac` -- `cd apps/desktop && npm run package:mac`
- `npm run package:win` -- `cd apps/desktop && npm run package:win`
- `npm run package:linux` -- `cd apps/desktop && npm run package:linux`

## File Structure
```
  .coderabbit.yaml
  .gitignore
  .pre-commit-config.yaml
  .secretsignore.example
  CHANGELOG.md
  CLA.md
  CLAUDE.md
  CODEX_RATE_LIMITS_RESEARCH.md
  CONTRIBUTING.md
  LICENSE
  Memory.md
  README.md
  RELEASE.md
  card_data.txt
  package-lock.json
  package.json
  pnpm-lock.yaml
  ruff.toml
  .claude/
    commands/
      setup-statusline.md
  .design-system/
    .gitignore
    REFACTORING_SUMMARY.md
    index.html
    package-lock.json
    package.json
    pnpm-lock.yaml
    postcss.config.js
    tsconfig.json
    vite.config.ts
    public/
      vite.svg
    src/
      App.tsx
      App.tsx.backup
      App.tsx.original
      main.tsx
      styles.css
      animations/
        constants.ts
        index.ts
      components/
        Avatar.tsx
        Badge.tsx
        Button.tsx
        Card.tsx
        Input.tsx
        ProgressCircle.tsx
        Toggle.tsx
        index.ts
      demo-cards/
        CalendarCard.tsx
        IntegrationsCard.tsx
        MilestoneCard.tsx
        NotificationsCard.tsx
        ProfileCard.tsx
        ProjectStatusCard.tsx
        TeamMembersCard.tsx
        index.ts
      lib/
        icons.ts
        utils.ts
      theme/
        ThemeSelector.tsx
        constants.ts
        index.ts
        types.ts
        useTheme.ts
  apps/
    desktop/
      .env.example
      .gitignore
      COMPLETION_SUMMARY.md
      CONTRIBUTING.md
      README.md
      VERIFICATION_SUMMARY.md
      XSTATE_MIGRATION_SUMMARY.md
      biome.jsonc
      design.json
      electron.vite.config.ts
      package.json
      postcss.config.cjs
      tsconfig.json
      vitest.config.ts
      e2e/
        claude-accounts.e2e.ts
        electron-helper.ts
        flows.e2e.ts
        playwright.config.ts
        task-workflow.spec.ts
        terminal-copy-paste.e2e.ts
      prompts/
        coder.md
        coder_recovery.md
        competitor_analysis.md
        complexity_assessor.md
        followup_planner.md
        ideation_code_improvements.md
        ide
```

## Agent Configuration
### CLAUDE.md
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

Auto Claude is an autonomous multi-agent coding framework that plans, builds, and validates software for you. It's a TypeScript-first Electron desktop application with a self-contained AI agent layer (Vercel AI SDK v6). A lightweight Python sidecar provides the optional Graphiti memory system.

> **Deep-dive reference:** [ARCHITECTURE.md](shared_docs/ARCHITECTURE.md) | **Frontend contributing:** [apps/desktop/CONTRIBUTING.md](apps/desktop/CONTRIBUTING.md)

## Product Overview

Auto Claude is a desktop application (+ CLI) where users describe a goal and AI agents autonomously handle planning, implementation, and QA validation. All work happens in isolated git worktrees so the main branch stays safe.

**Core workflow:** User creates a task → Spec creation pipeline assesses complexity and writes a specification → Planner agent breaks it into subtasks → Coder agent implements (can spawn parallel subagents) → QA reviewer validates → QA fixer resolves issues → User reviews and merges.

**Main features:**

- **Autonomous Tasks** — Multi-agent pipeline (planner, coder, QA) that builds features end-to-end
- **Kanban Board** — Visual task management from planning through completion
- **Agent Terminals** — Up to 12 parallel AI-powered terminals with task context injection
- **Insights** — AI chat interface for exploring and understanding your codebase
- **Roadmap** — AI-assisted feature planning 

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
