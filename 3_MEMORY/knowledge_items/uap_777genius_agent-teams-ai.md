# KI: 777genius/agent-teams-ai

## Overview
Repository with 2602 files across 498 directories. Primary language: TypeScript (1306 files).

## Tech Stack (from code)
- TypeScript (1306 files)
- TypeScript (React) (458 files)
- Vue.js (38 files)
- JavaScript (32 files)
- **Total:** 2602 files, 498 directories
- **File types:** .ts: 1306, .tsx: 458, .md: 310, .json: 280, .png: 62, .vue: 38, .js: 32, .mjs: 25

## Public API / Exports
- `TASK_COLUMN_MAX_VISIBLE_ROWS` from `packages\agent-graph\src\index.ts`
- `ACTIVITY_ANCHOR_LAYOUT` from `packages\agent-graph\src\index.ts`
- `ACTIVITY_LANE` from `packages\agent-graph\src\index.ts`
- `GraphView` from `packages\agent-graph\src\index.ts`
- `getTransientHandoffCardAlpha` from `packages\agent-graph\src\index.ts`

## Imports Detected in Source
- `@eslint-community/eslint-plugin-eslint-comments`
- `@eslint/js`
- `@sentry/vite-plugin`
- `@vitejs/plugin-react`
- `electron-vite`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-boundaries`
- `eslint-plugin-import`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-security`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-sonarjs`
- `eslint-plugin-tailwindcss`
- `fs`
- `globals`
- `i18next-cli`
- `node:fs`
- `node:path`
- `path`
- `typescript-eslint`
- `vite`

## File Structure
```
  .coderabbit.yaml
  .dockerignore
  .gitignore
  .mcp.json
  .node-version
  .npmrc
  .nvmrc
  .prettierignore
  .prettierrc.json
  AGENTS.md
  AGENT_CRITICAL_GUARDRAILS.md
  CLAUDE.md
  LICENSE
  README.md
  bun.lock
  electron.vite.config.ts
  eslint.config.js
  eslint.fast.config.js
  hero-robots-restored.png
  i18next.config.ts
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  postcss.config.cjs
  runtime.lock.json
  tailwind.config.js
  terminal-platform.lock.json
  tsconfig.json
  tsconfig.node.json
  vite.web.config.ts
  vitest.config.ts
  vitest.critical.config.ts
  agent-teams-controller/
    .gitignore
    package.json
    vitest.config.js
    scripts/
      build.mjs
    src/
      controller.js
      index.js
      mcpToolCatalog.js
      internal/
        agenda.js
        agentBlocks.js
        atomicFile.js
        boardLock.js
        capture.js
        cascadeGuard.js
        context.js
        crossTeam.js
        crossTeamProtocol.js
        fileLock.js
        kanban.js
        kanbanStore.js
        maintenance.js
        memberMessagingProtocol.js
        messageStore.js
        messages.js
        processStore.js
        processes.js
        review.js
        reviewState.js
        runtime.js
        runtimeHelpers.js
        taskStore.js
        tasks.js
        workSync.js
  docker/
    .dockerignore
    Dockerfile
    docker-compose.yml
    vite.standalone.config.ts
  docs/
    CHANGELOG.md
    FEATURE_ARCHITECTURE_STANDARD.md
    RELEASE.md
    claude-multimodel-integration-plan.md
    opencode-ledger-bridge-plan.md
    articles/
      agent-teams-opus-4-8.en.md
      agent-teams-opus-4-8.ru.md
    assets/
      github-header-agent-teams-ai.png
    extensions/
      adr-001-contract-spike.md
      adr-002-skills-in-extensions.md
      plugin-kit-ai-integration-plan.md
    ideas/
      codeboarding-integration.md
    iterations/
      README.md
      iteration-01-core-team-list.md
      iteration-02-team-detail-members.md
      itera
```

## Key Source Excerpts
### packages\agent-graph\src\index.ts
```typescript
/**
 * @claude-teams/agent-graph
 *
 * Force-directed graph visualization for agent teams.
 * Isolated package — depends only on React (peer) and d3-force.
 * Uses Port/Adapter pattern: host project provides data through port interfaces.
 */

// ─── Components ──────────────────────────────────────────────────────────────
export { TASK_COLUMN_MAX_VISIBLE_ROWS } from './constants/canvas-constants';
export { ACTIVITY_ANCHOR_LAYOUT, ACTIVITY_LANE } from './layout/activityLane';

// ─── Port Interfaces (for adapters in host project) ─────────────────────────
export type { GraphConfigPort } from './ports/GraphConfigPort';
export type { GraphDataPort } from './ports/GraphDataPort';
export type { GraphEventPort } from './ports/GraphEventPort';

// ─── Port Types ──────────────────────────────────────────────────────────────
export type {
  GraphActivityItem,
  GraphDomainRef,
  GraphEdge,
  GraphEdgeType,
  GraphLaunchVisualState,
  GraphLayoutMode,
  GraphLayoutPort,
  GraphLayoutVersion,
  GraphNode,
  GraphNodeKind,
  GraphNodeState,
  GraphOwnerSlotAssignment,
  GraphParticle,
  GraphParticleKind,
} from './ports/types';
export type { GraphViewProps } from './ui/GraphView';
export { GraphView } from './ui/GraphView';
export type { TransientHandoffCard } from './ui/transientHandoffs';
export { getTransientHandoffCardAlpha } from './ui/transientHandoffs';

```

### electron.vite.config.ts
```typescript
import { defineConfig } from 'electron-vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// Read all production dependencies from package.json
// so they get bundled into the main process output.
// This avoids pnpm symlink issues with electron-builder's asar packaging.
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const prodDeps = Object.keys(pkg.dependencies || {})
const terminalPlatformLocalRoot = resolveTerminalPlatformLocalRoot()
const terminalPlatformSdkAliases = createTerminalPlatformSdkAliases()
const rendererDependencyEsbuildTarget = 'esnext'

// Fastify and its plugins rely on runtime module resolution that breaks when bundled.
const runtimeExternalDeps = new Set([
  'node-pty',
  'agent-teams-controller',
  'terminal-platform-node',
  'ws',
  'fastify',
  '@fastify/cors',
  '@fastify/static',
])

// node-pty is a native addon that cannot be bundled by Rollup.
// It must remain external and be loaded at runtime via require().
const bundledDeps = prodDeps.filter(d => !runtimeExternalDeps.has(d))

// Rollup plugin: stub out native .node addon imports with empty modules.
// ssh2 and cpu-features use optional native bindings that can't be bundled,
// but they have pure JS fallbacks when the native module isn't available.
function nativeModuleStub(): Plugin {
  const STUB_ID = '\0nativ
```

### eslint.config.js
```javascript
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tailwindcss from 'eslint-plugin-tailwindcss';
import sonarjs from 'eslint-plugin-sonarjs';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import boundaries from 'eslint-plugin-boundaries';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig([
  // Global ignores
  globalIgnores([
    'dist/**',
    'dist-electron/**',
    'build/**',
    'node_modules/**',
    '*.config.js',
    '*.config.cjs',
    '*.config.ts',
    'out/**',
  ]),

  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript-ESLint recommended with type checking + stylistic
  // Using recommended (not strict) for a balanced approach
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // SonarJS - Code quality and bug detection rules
  sonarjs.configs.recommended,

  // Security - Catch common security mistakes in AI-generated code
  security.configs.recommen
```

## Agent Configuration
### AGENTS.md
# Agent Navigation

This file is a navigation layer for architecture and implementation guidance.

Start here:

- Repo overview and commands: [README.md](README.md)
- Working instructions and project conventions: [CLAUDE.md](CLAUDE.md)
- Hard guardrails: [AGENT_CRITICAL_GUARDRAILS.md](AGENT_CRITICAL_GUARDRAILS.md)
- Release process and runtime packaging: [docs/RELEASE.md](docs/RELEASE.md)
- Canonical feature architecture standard: [docs/FEATURE_ARCHITECTURE_STANDARD.md](docs/FEATURE_ARCHITECTURE_STANDARD.md)
- Agent team launch/runtime debugging runbook: [docs/team-management/debugging-agent-teams.md](docs/team-management/debugging-agent-teams.md)

GitHub repository disambiguation:

- For this workspace, the canonical GitHub repository is `777genius/agent-teams-ai`.
- When reviewing or discussing PR `#126`, inspect `777genius/agent-teams-ai#126` unless the user explicitly names another repository.
- Do not confuse this workspace with upstream or similarly named forks such as `matt1398/claude-devtools`.

Default local run target:

- Use the desktop Electron app: `pnpm dev`
- Do not start the browser/web dev mode for normal development or smoke checks. The browser path is limited and lacks the full desktop runtime, IPC, terminal, provider auth, and team lifecycle behavior.
- When documenting or recommending startup commands, point contributors to the desktop app unless a task explicitly asks for browser-mode internals.

Critical real-project safety:

- Do not test agent teams, 

### CLAUDE.md
# Agent Teams

A new approach to task management with AI agent teams. Assemble agent teams with different roles that work autonomously in parallel, communicate with each other, create and manage their own tasks, review code, and collaborate across teams. You manage everything through a kanban board — like a CTO with an AI engineering team.

Key capabilities:
- **Agent Teams** — create teams with roles, agents work autonomously in parallel
- **Cross-team communication** — agents message each other within and across teams
- **Kanban board** — tasks change status in real-time as agents work
- **Code review** — diff view per task (accept/reject/comment), similar to Cursor
- **Solo mode** — single agent with self-managed tasks, expandable to full team
- **Live process section** — see running agents, open URLs in browser
- **Direct messaging** — send messages to any agent, comment on tasks, add quick actions on kanban cards
- **Deep session analysis** — bash commands, reasoning, subprocesses breakdown
- **Context monitoring** — token usage by category (CLAUDE.md, tool outputs, thinking, team coordination)
- **Built-in code editor** — edit files with Git support without leaving the app
- **MCP integration** — built-in mcp-server for external tools and agent plugins
- **Post-compact context recovery** — restores team-management instructions after context compaction
- **Notification system** — alerts on task completion, agent attention needed, errors
- **Zero-setup onboarding** — buil

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
