# KI: xmanrui/OpenClaw-bot-review

## Overview
Repository with 184 files across 79 directories. Primary language: TypeScript (87 files).

## Tech Stack (from code)
- TypeScript (87 files)
- TypeScript (React) (25 files)
- JavaScript (1 files)
- **Total:** 184 files, 79 directories
- **File types:** .ts: 87, .tsx: 25, .png: 19, .webp: 14, .md: 10, .json: 6, .svg: 5, .gif: 3

## Public API / Exports
- `AgentStatus` from `lib\agents.ts`
- `getAgents` from `lib\agents.ts`
- `computeHash` from `lib\config-backup.ts`
- `backupCurrentConfig` from `lib\config-backup.ts`
- `getConfigCache` from `lib\config-cache.ts`
- `setConfigCache` from `lib\config-cache.ts`
- `clearConfigCache` from `lib\config-cache.ts`
- `DailyItem` from `lib\daily.ts`
- `getTodayItems` from `lib\daily.ts`
- `buildGatewayUrl` from `lib\gateway-url.ts`
- `Locale` from `lib\i18n.tsx`
- `stripUtf8Bom` from `lib\json.ts`
- `parseJsonText` from `lib\json.ts`
- `readJsonFileSync` from `lib\json.ts`
- `readJsonFile` from `lib\json.ts`
- `KnownModelMeta` from `lib\known-providers.ts`
- `KnownProviderMeta` from `lib\known-providers.ts`
- `getKnownProvider` from `lib\known-providers.ts`
- `enrichModelMeta` from `lib\known-providers.ts`
- `DEFAULT_MODEL_PROBE_TIMEOUT_MS` from `lib\model-probe.ts`
- `ModelProbeOutcome` from `lib\model-probe.ts`
- `execOpenclaw` from `lib\openclaw-cli.ts`
- `parseJsonFromMixedOutput` from `lib\openclaw-cli.ts`
- `parseOpenclawJsonOutput` from `lib\openclaw-cli.ts`
- `resolveConfigSnapshotHash` from `lib\openclaw-cli.ts`
- `OPENCLAW_HOME` from `lib\openclaw-paths.ts`
- `OPENCLAW_CONFIG_PATH` from `lib\openclaw-paths.ts`
- `OPENCLAW_AGENTS_DIR` from `lib\openclaw-paths.ts`
- `OPENCLAW_PIXEL_OFFICE_DIR` from `lib\openclaw-paths.ts`
- `getOpenclawPackageCandidates` from `lib\openclaw-paths.ts`

## Dependencies
### Dependencies (from package.json)
- `@tailwindcss/postcss`: ^4.0.0
- `@types/node`: ^22.0.0
- `@types/react`: ^19.0.0
- `next`: ^16.0.0
- `postcss`: ^8.0.0
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `tailwindcss`: ^4.0.0
- `typescript`: ^5.0.0

### Dev Dependencies
- `vitest`: ^4.1.1

## Imports Detected in Source
- `@/lib`
- `child_process`
- `crypto`
- `fs`
- `os`
- `path`
- `react`
- `util`

## Available Commands
- `npm run dev` -- `next dev`
- `npm run build` -- `next build`
- `npm run start` -- `next start`
- `npm run test` -- `vitest run`

## File Structure
```
  .dockerignore
  .gitignore
  Dockerfile
  LICENSE
  README.md
  idea_ledger.json
  myconfig.txt
  next.config.mjs
  package-lock.json
  package.json
  postcss.config.js
  quick_start.md
  rd-council-items.json
  tsconfig.json
  app/
    alert-monitor.tsx
    gateway-status.tsx
    global-bugs-overlay.tsx
    globals.css
    icon.tsx
    layout.tsx
    page.tsx
    providers.tsx
    sidebar.tsx
    alerts/
      page.tsx
    api/
      self-improvement-command.ts
      activity-heatmap/
        route.ts
      agent-activity/
        route.ts
      agent-status/
        route.ts
      agents/
        route.ts
      alerts/
        route.ts
        check/
          route.ts
      approve-v25/
        route.ts
      config/
        route.ts
        agent-model/
          route.ts
      config-backup/
        route.ts
      daily/
        route.ts
      dry-run/
        route.ts
      gateway-health/
        route.ts
      gateway-logs/
        route.ts
      gateway-restart/
        route.ts
      idea-ledger/
        route.ts
      ingest-usage/
        route.ts
      pixel-office/
        contributions/
          route.ts
        idle-rank/
          route.ts
        layout/
          route.ts
        tracks/
          route.ts
        version/
          route.ts
      proactive-analyze/
        route.ts
      proactive-real/
        route.ts
      projects/
        route.ts
      rd-council-items/
        route.ts
        [itemId]/
          snooze/
            route.ts
      reject-v25/
        route.ts
      sessions/
        [agentId]/
          route.ts
      skills/
        route.ts
        content/
          route.ts
      stats/
        [agentId]/
          route.ts
      stats-all/
        route.ts
      stats-models/
        route.ts
      test-bound-models/
        route.ts
      test-dm-sessions/
        route.ts
      test-model/
        route.ts
      test-platforms/
        route.ts
      test-session/
        route.ts
      test-sessions/
        rou
```

## Key Source Excerpts
### lib\agents.ts
```typescript
// lib/agents.ts
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

export interface AgentStatus {
  id: string;
  name: string;
  emoji: string;
  status: 'working' | 'idle' | 'thinking' | 'waiting';
  mood: 'happy' | 'neutral' | 'busy' | 'tired' | 'thinking';
  currentTask: string;
  uptime: number;
  lastActive: string;
}

export function getAgents(): AgentStatus[] {
  const configPath = join(process.env.HOME || '', '.openclaw/openclaw.json');
  
  if (!existsSync(configPath)) {
    return [];
  }
  
  let config: any = {};
  try {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch {
    return [];
  }
  
  // 从配置中提取 Agent 信息
  const agents = Object.entries(config.agents || {}).map(([id, agent]: [string, any]) => ({
    id,
    name: agent.name || id,
    emoji: agent.emoji || '🤖',
    status: 'idle' as const,
    mood: 'neutral' as const,
    currentTask: '等待指令',
    uptime: 0,
    lastActive: new Date().toISOString(),
  }));
  
  return agents;
}

```

### lib\config-backup.ts
```typescript
/**
 * openclaw.json 備份與還原工具模組
 *
 * 功能：
 * 1. 透過 SHA-256 hash 偵測設定檔變更
 * 2. 變更時自動備份上一個版本
 * 3. 列出可用備份
 * 4. 從備份還原
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { OPENCLAW_HOME, OPENCLAW_CONFIG_PATH } from "./openclaw-paths";

// ── 常數 ────────────────────────────────────────────────
const BACKUP_DIR = path.join(OPENCLAW_HOME, "backups", "config");
const HASH_FILE = path.join(BACKUP_DIR, ".last-hash");
const MAX_ROLLING = 8;   // 一般滾動備份保留數
const MIN_GOOD_SIZE = 1024; // 小於此 bytes 視為損毀，不計入錨點

// ── 持久化 hash（讀寫磁碟，重啟後仍有效）────────────────
function readPersistedHash(): string | null {
  try {
    const h = fs.readFileSync(HASH_FILE, "utf-8").trim();
    return h.length === 64 ? h : null; // SHA-256 = 64 hex chars
  } catch {
    return null;
  }
}

function writePersistedHash(hash: string): void {
  try {
    ensureBackupDir();
    fs.writeFileSync(HASH_FILE, hash, "utf-8");
  } catch { /* ignore */ }
}

// ── Hash ────────────────────────────────────────────────
export function computeHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// ── 備份目錄初始化 ──────────────────────────────────────
function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

// ── 產生備份檔名 ────────────────────────────────────────
function makeBackupFilename(): string {
  // openclaw.2026-03-15T08-30-00.json
  const ts = new Date()
    .toISOString()
   
```

### lib\config-cache.ts
```typescript
type ConfigCacheEntry = {
  data: any;
  ts: number;
};

let configCache: ConfigCacheEntry | null = null;

export function getConfigCache(): ConfigCacheEntry | null {
  return configCache;
}

export function setConfigCache(entry: ConfigCacheEntry): void {
  configCache = entry;
}

export function clearConfigCache(): void {
  configCache = null;
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `component`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
