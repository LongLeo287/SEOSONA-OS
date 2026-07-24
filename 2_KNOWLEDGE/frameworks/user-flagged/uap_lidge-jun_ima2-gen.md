# KI: lidge-jun/ima2-gen

## Overview
Repository with 1078 files across 180 directories. Primary language: TypeScript (301 files).

## Tech Stack (from code)
- TypeScript (301 files)
- TypeScript (React) (158 files)
- JavaScript (14 files)
- Shell (6 files)
- Python (2 files)
- **Total:** 1078 files, 180 directories
- **File types:** .md: 353, .ts: 301, .tsx: 158, .png: 94, .css: 44, .astro: 37, .json: 22, .mjs: 16

## Public API / Exports
- `parseAgentSlashCommand` from `lib\agentCommandParser.ts`
- `formatAgentSlashHelp` from `lib\agentCommandParser.ts`
- `formatAgentQuestionReply` from `lib\agentCommandParser.ts`
- `deriveAgentGenerationPlan` from `lib\agentGenerationPlanner.ts`
- `generateAgentImageWithRetry` from `lib\agentImageVideoGen.ts`
- `requestAgentQuestionAnswer` from `lib\agentQuestionResponder.ts`
- `AgentQueueProjection` from `lib\agentQueueStore.ts`
- `AgentQueueLimits` from `lib\agentQueueStore.ts`
- `createAgentQueueItem` from `lib\agentQueueStore.ts`
- `getAgentQueueItem` from `lib\agentQueueStore.ts`
- `listAgentQueueItems` from `lib\agentQueueStore.ts`
- `ensureAgentQueueWorker` from `lib\agentQueueWorker.ts`
- `stopAgentQueueWorker` from `lib\agentQueueWorker.ts`
- `cancelRunningAgentQueueItem` from `lib\agentQueueWorker.ts`
- `tickAgentQueueWorker` from `lib\agentQueueWorker.ts`
- `AgentRunOptions` from `lib\agentRuntime.ts`
- `assertAgentAllowedTools` from `lib\agentRuntime.ts`
- `agentAllowedToolPayload` from `lib\agentRuntime.ts`
- `runAgentTurn` from `lib\agentRuntime.ts`
- `runAgentGenerationPlan` from `lib\agentRuntime.ts`
- `DEFAULT_AGENT_GENERATION_SETTINGS` from `lib\agentSettings.ts`
- `normalizeAgentGenerationSettings` from `lib\agentSettings.ts`
- `mergeAgentGenerationSettings` from `lib\agentSettings.ts`
- `listAgentSessions` from `lib\agentStore.ts`
- `getAgentSession` from `lib\agentStore.ts`
- `createAgentSession` from `lib\agentStore.ts`
- `renameAgentSession` from `lib\agentStore.ts`
- `setAgentWebSearch` from `lib\agentStore.ts`
- `AgentSessionRow` from `lib\agentStoreRows.ts`
- `AgentTurnRow` from `lib\agentStoreRows.ts`

## Imports Detected in Source
- `dotenv`
- `express`
- `fs`
- `node:crypto`
- `node:fs`
- `node:path`
- `path`
- `ulid`
- `url`

## File Structure
```
  .env.example
  .gitattributes
  .gitignore
  .node-version
  .npmignore
  AGENTS.md
  CHANGELOG.md
  LICENSE
  README.md
  config.js
  config.ts
  flake.lock
  flake.nix
  package-lock.json
  package.json
  server.ts
  tsconfig.bin.json
  tsconfig.build.json
  tsconfig.json
  tsconfig.tests.json
  assets/
    logo.png
    phase-a-bg-cleanup-test.png
    screenshot.png
    card-news/
      templates/
        academy-lesson-square/
          base.png
          preview.png
          template.json
        clean-report-square/
          base.png
          preview.png
          template.json
    screenshots/
      canvas-mode-cleanup.png
      classic-generate-light.png
      multimode-sequence.png
      node-graph-branching.png
      prompt-import-dialog.png
      settings-grok-connected.png
      settings-oauth-generation.png
      settings-workspace.png
      setup-wizard-4way.png
      style-sheet-editor.png
      video-result-gallery.png
  devlog/
    _artifacts/
      260503_issue37_mobile_settings/
        mobile-settings-390-generation.png
        mobile-settings-390.png
        mobile-settings-600-generation.png
        mobile-settings-600.png
      260503_issue38_mobile_cta/
        bottom-primary.png
        mobile-sheet-controls-390-vite.png
        mobile-sheet-library-390-vite.png
        mobile-sheet-prompt-390-vite.png
        mobile-viewport-390-vite.png
        mobile-viewport-390.png
        split-action-dock.png
        top-command-bar.png
      settings-ui-fix-260507/
        settings-dark-1416.png
        settings-desktop-1416.png
    _fin/
      260428_issue33-mobile-overhaul-logs/
        PHASE-45-ui-overhaul.md
        PHASE-46-classic-layout.md
        PHASE-47-overlays.md
        PHASE-48-node-cardnews.md
      260429_app-weight-reduction/
        ORACLE-AUDIT.md
        PHASE-A-release-package-diet.md
        PHASE-B-frontend-code-splitting.md
        PHASE-B3-canvas-mode-controller-split.md
        PHASE-C-canvas-runtime-performance.md
     
```

## Key Source Excerpts
### server.ts
```typescript
import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import {
  existsSync,
  writeFileSync,
  unlinkSync,
  mkdirSync,
  readFileSync as fsReadFileSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { onShutdown } from "./bin/lib/platform.js";
import { ensureDefaultSession } from "./lib/sessionStore.js";
import { startGrokProxy } from "./lib/grokProxyLauncher.js";
import { startOAuthProxy } from "./lib/oauthLauncher.js";
import { migrateGeneratedStorage } from "./lib/storageMigration.js";
import { purgeStaleJobs } from "./lib/inflight.js";
import { configureLogger, logError } from "./lib/logger.js";
import { createRequestLogger } from "./lib/requestLogger.js";
import { configureApiCachePolicy } from "./lib/apiCachePolicy.js";
import { configureRoutes } from "./routes/index.js";
import { config } from "./config.js";
import { getServerPort, listenWithPortFallback } from "./lib/runtimePorts.js";
import type { RuntimeContext, RuntimeContextOverrides, ApiKeySource } from "./lib/runtimeContext.js";

import { closeDb } from "./lib/db.js";
import { stopAgentQueueWorker } from "./lib/agentQueueWorker.js";
import { reapCardNewsJobs } from "./lib/cardNewsJobStore.js";
import { reapTerminalJobs } from "./lib/inflight.js";
import { errInfo } from "./lib/errInfo.js";
import { timingSafeEqual } from "node:crypto";

type Bo
```

### lib\agentCommandParser.ts
```typescript
import type { AgentSlashCommand, AgentSlashCommandName } from "./agentTypes.js";
import { config } from "../config.js";

const MAX_AGENT_VARIANT_COUNT = Math.max(1, Math.trunc(Number(config.limits.maxGeneratedImages) || 24));
const MAX_AGENT_PARALLELISM = Math.max(1, Math.trunc(Number(config.limits.maxParallel) || 24));

const COMMAND_ALIASES: Record<string, AgentSlashCommandName> = {
  ask: "question",
  q: "question",
  question: "question",
  help: "help",
  h: "help",
  variants: "variants",
  variant: "variants",
  v: "variants",
  n: "variants",
  generate: "generate",
  gen: "generate",
  g: "generate",
  parallel: "parallelism",
  parallelism: "parallelism",
  p: "parallelism",
};

export function parseAgentSlashCommand(input: string): AgentSlashCommand | null {
  const raw = input.trim();
  if (!raw.startsWith("/")) return null;

  const match = /^\/([a-z][\w-]*)(?:\s+([\s\S]*))?$/i.exec(raw);
  if (!match) return null;

  const rawName = match[1].toLowerCase();
  const name = COMMAND_ALIASES[rawName];
  if (!name) return null;

  const rest = (match[2] ?? "").trim();
  const countCommands: AgentSlashCommandName[] = ["variants", "generate", "parallelism"];
  const parsed = countCommands.includes(name) ? parseLeadingCount(rest, name) : { prompt: rest };
  return {
    name,
    rawName,
    raw,
    prompt: parsed.prompt,
    ...(parsed.value ? { value: parsed.value } : {}),
  };
}

export function formatAgentSlashHelp(): string {
  return [
    "Available Agent comma
```

### lib\agentGenerationPlanner.ts
```typescript
import type {
  AgentGenerationPlan,
  AgentGenerationPlanSource,
  AgentGenerationSettings,
  AgentSourceImagePolicy,
  AgentSlashCommand,
  AgentVideoParams,
} from "./agentTypes.js";
import { config } from "../config.js";

const HARD_MAX_VARIANTS = Math.max(1, Math.trunc(Number(config.limits.maxGeneratedImages) || 24));
const AMBIGUOUS_MULTI_VARIANTS = 3;
const KOREAN_COUNT_WORDS: Array<[RegExp, number]> = [
  [/(?:스물네|스물\s*네|이십사)\s*(?:장|개|가지|컷|시안|버전)/u, 24],
  [/(?:열두|열\s*두|십이)\s*(?:장|개|가지|컷|시안|버전)/u, 12],
  [/(?:열|열\s*개)\s*(?:장|개|가지|컷|시안|버전)?/u, 10],
  [/(?:한|하나)\s*(?:장|개|가지|컷|시안|버전)/u, 1],
  [/(?:두|둘)\s*(?:장|개|가지|컷|시안|버전)/u, 2],
  [/(?:세|셋)\s*(?:장|개|가지|컷|시안|버전)/u, 3],
  [/(?:네|넷)\s*(?:장|개|가지|컷|시안|버전)/u, 4],
  [/(?:다섯)\s*(?:장|개|가지|컷|시안|버전)/u, 5],
  [/(?:여섯)\s*(?:장|개|가지|컷|시안|버전)/u, 6],
  [/(?:일곱)\s*(?:장|개|가지|컷|시안|버전)/u, 7],
  [/(?:여덟)\s*(?:장|개|가지|컷|시안|버전)/u, 8],
  [/(?:아홉)\s*(?:장|개|가지|컷|시안|버전)/u, 9],
];
const ENGLISH_COUNT_WORDS: Array<[RegExp, number]> = [
  [/\btwenty[-\s]?four\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 24],
  [/\btwelve\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 12],
  [/\bten\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 10],
  [/\bone\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 1],
  [/\btwo\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 2],
  [/\bthree\s*(?:image|variant|version|option|candidate|shot|render)?s?\b/iu, 3],
  [/\bfour\s*(?:image|v
```

## Agent Configuration
### AGENTS.md
# ima2-gen — AI Context

## What This Project Does
Local image generation studio (v2.x) — CLI + 웹 UI
- GPT OAuth, API Key, Grok, Gemini API, Antigravity CLI 다중 provider 지원
- 텍스트→이미지, 이미지→이미지(편집), 비디오 생성
- SSE 멀티플렉싱: 단일 `GET /api/events` SSE 채널 + async POST (202) 아키텍처
- 병렬 생성 (최대 12건, 브라우저 연결 포화 없음)

## Tech Stack
- Runtime: Node.js >=20 (ES Module)
- Server: Express 5
- API Client: OpenAI SDK v5
- OAuth: openai-oauth (ChatGPT 세션 프록시)
- Grok: bundled progrok (xAI Images API)
- Gemini: Google Generative Language API / Vertex AI
- Frontend: React + Vite (`ui/src`, built to `ui/dist`)
- SSE: lib/eventBus.ts (ring buffer pub/sub) + routes/events.ts

## Project Structure
```
ima2-gen/
├── bin/                  # CLI entry + subcommands
├── server.ts             # Express bootstrap / static UI serving
├── config.ts             # Runtime config
├── routes/               # API route modules (*.ts source)
│   ├── events.ts         # GET /api/events SSE multiplexing
│   ├── multimode.ts      # Multimode batch (async POST + dual-emit)
│   ├── nodes.ts          # Node mode (async POST + dual-emit)
│   ├── video.ts          # Video generation (async POST + dual-emit)
│   └── ...               # generate, edit, sessions, history, etc.
├── lib/                  # Server helpers (*.ts source)
│   ├── eventBus.ts       # Global pub/sub ring buffer (2000 events)
│   ├── ssePublish.ts     # Cancel-done race guard
│   ├── inflight.ts       # Job lifecycle tracking
│   └── ...               # OAut

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 88/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `planner`, `router`
- **All scores:** {'seosona-os': 88, 'seosona-video': 0, 'seosona-content': 44, 'seosona-ux-ui': 6, 'seosona-flow': 44}
