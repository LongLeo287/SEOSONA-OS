# KI: thedotmack/claude-mem

## Overview
Repository with 618 files across 143 directories. Primary language: TypeScript (311 files).

## Tech Stack (from code)
- TypeScript (311 files)
- JavaScript (16 files)
- TypeScript (React) (15 files)
- Shell (9 files)
- **Total:** 618 files, 143 directories
- **File types:** .ts: 311, .md: 111, .json: 59, .mdx: 39, .js: 16, .tsx: 15, .cjs: 11, .svg: 10

## Public API / Exports
- `generateContext` from `src\services\context-generator.ts`
- `generateContextWithStats` from `src\services\context-generator.ts`
- `RestartVerifyOptions` from `src\services\restart-verify.ts`
- `RestartVerifyResult` from `src\services\restart-verify.ts`
- `getCurrentWorkerPid` from `src\services\restart-verify.ts`
- `isPluginDisabledInClaudeSettings` from `src\services\worker-service.ts`
- `WorkerShutdownReason` from `src\services\worker-shutdown.ts`
- `RestartHandoffDeps` from `src\services\worker-shutdown.ts`
- `ShutdownSequenceOptions` from `src\services\worker-shutdown.ts`
- `runShutdownSequence` from `src\services\worker-shutdown.ts`
- `WorkerStartResult` from `src\services\worker-spawner.ts`
- `ensureWorkerStarted` from `src\services\worker-spawner.ts`
- `ConversationMessage` from `src\services\worker-types.ts`
- `ActiveSession` from `src\services\worker-types.ts`
- `PendingMessage` from `src\services\worker-types.ts`
- `PendingMessageWithId` from `src\services\worker-types.ts`

## Imports Detected in Source
- `@modelcontextprotocol/sdk`
- `bun:sqlite`
- `child_process`
- `express`
- `fs`
- `path`

## File Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  .markdownlint.json
  .npmignore
  .npmrc
  .translation-cache.json
  CHANGELOG.md
  CLAUDE.md
  Dockerfile.test-installer
  LICENSE
  NOTICE
  README.md
  SECURITY.md
  WARP.md
  bunfig.toml
  docker-compose.e2e.yml
  docker-compose.yml
  package.json
  transcript-watch.example.json
  tsconfig.json
  .agent/
    rules/
      claude-mem-context.md
  .agents/
    plugins/
      marketplace.json
  .claude/
    settings.json
    commands/
      anti-pattern-czar.md
    plans/
      animated-installer.md
    reports/
      test-audit-2026-01-05.md
  .claude-plugin/
    marketplace.json
    plugin.json
  .codex-plugin/
    plugin.json
  .plan/
    issue-2341-reliability-slice.md
    npx-distribution.md
    subagent-summary-disable-and-labeling.md
    worktree-adoption.md
  .windsurf/
    rules/
      claude-mem-context.md
  cursor-hooks/
    .gitignore
    CONTEXT-INJECTION.md
    INTEGRATION.md
    PARITY.md
    QUICKSTART.md
    README.md
    REVIEW.md
    STANDALONE-SETUP.md
    cursorrules-template.md
    hooks.json
  docker/
    claude-mem/
      Dockerfile
      README.md
      build.sh
      entrypoint.sh
      run.sh
    e2e/
      server-e2e.mjs
  docs/
    SESSION_ID_ARCHITECTURE.md
    adapters.md
    anti-pattern-cleanup-plan.md
    api.md
    architecture-overview.md
    docker.md
    ip-boundary.md
    license.md
    migration-worker-to-server.md
    production-guide.md
    security.md
    server-architecture-and-team-vision.md
    server-parity-map.md
    server-release-readiness.md
    server-storage-boundary.md
    server.md
    bug-fixes/
      windows-spaces-issue.md
    context/
      agent-sdk-v2-examples.ts
      agent-sdk-v2-preview.md
      cursor-hooks-reference.md
    i18n/
      .translation-cache.json
      README.ar.md
      README.bn.md
      README.cs.md
      README.da.md
      README.de.md
      README.el.md
      README.es.md
      README.fi.md
      README.fr.md
      README.he.md
      REA
```

## Key Source Excerpts
### src\services\context-generator.ts
```typescript
import { logger } from '../utils/logger.js';

export { generateContext, generateContextWithStats } from './context/ContextBuilder.js';
export type { ContextInjectStats } from './context/ContextBuilder.js';
export type { ContextInput, ContextConfig } from './context/types.js';

```

### src\services\restart-verify.ts
```typescript
/**
 * Restart verification helpers for the CLI `restart` command (worker-service.ts).
 *
 * This lives in its own module rather than inside worker-service.ts so tests
 * can import it directly: worker-service.ts drags in a very large dependency
 * graph (bun:sqlite, MCP SDK, telemetry, supervisor) and ends with an
 * isMainModule bootstrap, which makes it unsafe to import from `bun test`.
 *
 * `restart` must prove the NEW worker is up (different pid than the old
 * worker, and self-reporting the same baked version as the CLI process that
 * initiated the restart) or exit non-zero — a restart that silently leaves
 * the old worker serving is worse than a failed one
 * (plans/2026-06-10-worker-restart-single-source-of-truth.md).
 * Verification reads only the `pid` and `version` fields of GET /api/health
 * (src/services/server/Server.ts), which the worker reports from its own
 * baked __DEFAULT_PACKAGE_VERSION__ constant.
 */

import { getWorkerHost, fetchWithTimeout } from '../shared/worker-utils.js';
import { logger } from '../utils/logger.js';

interface HealthSnapshot {
  pid?: unknown;
  version?: unknown;
}

export interface RestartVerifyOptions {
  /** Delay between health polls (ms). Default 500. */
  pollIntervalMs?: number;
  /** Per-request timeout for each health poll (ms). Default 2000. */
  requestTimeoutMs?: number;
}

export type RestartVerifyResult =
  | { ok: true; pid: number; version: string }
  | {
      ok: false;
      lastObserved: string;
      /**
 
```

### src\services\worker-service.ts
```typescript

import path from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import type { Database } from 'bun:sqlite';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { getWorkerPort, getWorkerHost, fetchWithTimeout, resolveWorkerScriptPath } from '../shared/worker-utils.js';
import { getCurrentWorkerPid, verifyRestartedWorker } from './restart-verify.js';
import { runShutdownSequence, type WorkerShutdownReason } from './worker-shutdown.js';
import { DATA_DIR, DB_PATH, ensureDir } from '../shared/paths.js';
import { HOOK_TIMEOUTS } from '../shared/hook-constants.js';
import { getUptimeSeconds } from '../shared/uptime.js';
import { SettingsDefaultsManager } from '../shared/SettingsDefaultsManager.js';
import { getAuthMethodDescription } from '../shared/EnvManager.js';
import { logger } from '../utils/logger.js';
import { ChromaMcpManager } from './sync/ChromaMcpManager.js';
import { ChromaSync } from './sync/ChromaSync.js';
import { openConfiguredSqliteDatabase } from './sqlite/connection.js';
import { configureSupervisorSignalHandlers, getSupervisor, startSupervisor } from '../supervisor/index.js';
import { sanitizeEnv } from '../supervisor/env-sanitizer.js';

import { ensureWorkerStarted as ensureWorkerStartedShared, type WorkerStartResult } from './worker-spawner.js';
import { acquireSpawnLock, releaseSp
```

## Agent Configuration
### CLAUDE.md
# Claude-Mem: AI Development Instructions

Claude-mem is a Claude Code plugin providing persistent memory across sessions. It captures tool usage, compresses observations using the Claude Agent SDK, and injects relevant context into future sessions.

## Build

```bash
npm run build-and-sync        # Build, sync to marketplace, restart worker
```

## File Locations

- **Source**: `<project-root>/src/`
- **Built Plugin**: `<project-root>/plugin/`
- **Installed Plugin**: `~/.claude/plugins/marketplaces/thedotmack/`
- **Database**: `~/.claude-mem/claude-mem.db`
- **Chroma**: `~/.claude-mem/chroma/`

## Requirements

- **Bun** (all platforms - auto-installed if missing)
- **uv** (all platforms - auto-installed if missing, provides Python for Chroma)
- Node.js

## Documentation

**Public Docs**: https://docs.claude-mem.ai (Mintlify)
**Source**: `docs/public/` - MDX files, edit `docs.json` for navigation
**Deploy**: Auto-deploys from GitHub on push to main

## Important

No need to edit the changelog ever, it's generated automatically.

## Daily Maintenance

Run a daily version check across all package manifests and upgrade every dependency to its latest version — including major version bumps. Staying on the latest is the goal; do not skip majors.

- Check `package.json` (root) and all nested `package.json` files (e.g. `plugin/`, `openclaw/`) for outdated dependencies via `npm outdated`.
- Upgrade every package to `latest` (use `npm install <pkg>@latest` for each, or `npx npm-check

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `anthropic`, `gemini`, `rag`
- **All scores:** {'seosona-os': 82, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
