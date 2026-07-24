# KI: decolua/9router

## Overview
9Router web dashboard

## Tech Stack (from code)
- JavaScript (796 files)
- Shell (1 files)
- **Total:** 1099 files, 332 directories
- **File types:** .js: 796, .md: 121, .png: 108, .json: 38, .svg: 9, .mjs: 8, .gitignore: 3, .npmignore: 3

## Public API / Exports
- `initConsoleLogCapture` from `src\lib\consoleLogBuffer.js`
- `getConsoleLogs` from `src\lib\consoleLogBuffer.js`
- `clearConsoleLogs` from `src\lib\consoleLogBuffer.js`
- `getConsoleEmitter` from `src\lib\consoleLogBuffer.js`
- `getDataDir` from `src\lib\dataDir.js`
- `DATA_DIR` from `src\lib\dataDir.js`
- `getDisabledModels` from `src\lib\disabledModelsDb.js`
- `getDisabledByProvider` from `src\lib\disabledModelsDb.js`
- `disableModels` from `src\lib\disabledModelsDb.js`
- `enableModels` from `src\lib\disabledModelsDb.js`
- `getSettings` from `src\lib\localDb.js`
- `updateSettings` from `src\lib\localDb.js`
- `isCloudEnabled` from `src\lib\localDb.js`
- `getCloudUrl` from `src\lib\localDb.js`
- `getProviderConnections` from `src\lib\localDb.js`
- `syncToJson` from `src\lib\mitmAliasCache.js`
- `writeAliasForTool` from `src\lib\mitmAliasCache.js`
- `isXaiModel` from `src\lib\providerNormalization.js`
- `normalizeProviderId` from `src\lib\providerNormalization.js`
- `normalizeProviderSpecificData` from `src\lib\providerNormalization.js`
- `saveRequestDetail` from `src\lib\requestDetailsDb.js`
- `getRequestDetails` from `src\lib\requestDetailsDb.js`
- `getRequestDetailById` from `src\lib\requestDetailsDb.js`
- `statsEmitter` from `src\lib\usageDb.js`
- `trackPendingRequest` from `src\lib\usageDb.js`
- `getActiveRequests` from `src\lib\usageDb.js`
- `saveRequestUsage` from `src\lib\usageDb.js`
- `getUsageHistory` from `src\lib\usageDb.js`
- `isLocalRequest` from `src\dashboardGuard.js`
- `config` from `src\proxy.js`

## Dependencies
### Dependencies (from package.json)
- `@dnd-kit/core`: ^6.3.1
- `@dnd-kit/modifiers`: ^9.0.0
- `@dnd-kit/sortable`: ^10.0.0
- `@dnd-kit/utilities`: ^3.2.2
- `@monaco-editor/react`: ^4.7.0
- `@next/third-parties`: ^16.2.9
- `@xyflow/react`: ^12.10.1
- `bcryptjs`: ^3.0.3
- `confbox`: ^0.2.4
- `express`: ^5.2.1
- `http-proxy-middleware`: ^3.0.5
- `jose`: ^6.1.3
- `marked`: ^18.0.1
- `material-symbols`: ^0.44.6
- `monaco-editor`: ^0.55.1
- `next`: ^16.1.6
- `node-forge`: ^1.3.3
- `node-machine-id`: ^1.1.12
- `open`: ^11.0.0
- `ora`: ^9.1.0

### Dev Dependencies
- `@tailwindcss/postcss`: ^4.1.18
- `eslint`: ^9
- `eslint-config-next`: 16.1.6
- `postcss`: ^8.5.6
- `tailwindcss`: ^4

## Imports Detected in Source
- `@/lib`
- `@/shared`
- `child_process`
- `events`
- `fs`
- `next`
- `node:fs`
- `os`
- `path`

## Available Commands
- `npm run dev` -- `next dev --webpack --port 20127`
- `npm run build` -- `next build --webpack`
- `npm run start` -- `next start`
- `npm run dev:bun` -- `bun --bun next dev --webpack --port 20127`
- `npm run build:bun` -- `bun --bun next build --webpack`
- `npm run start:bun` -- `bun ./.next/standalone/server.js`
- `npm run cli:pack` -- `npm --prefix cli run pack:cli`
- `npm run cli:publish` -- `npm --prefix cli run publish:cli`

## File Structure
```
  .dockerignore
  .env.example
  .gitignore
  .npmignore
  CHANGELOG.md
  CLAUDE.md
  DOCKER.md
  Dockerfile
  LICENSE
  README.md
  README.zh-CN.md
  captain-definition
  custom-server.js
  docker-compose.yml
  eslint.config.mjs
  jsconfig.json
  next.config.mjs
  package.json
  postcss.config.mjs
  start.sh
  cli/
    .gitignore
    .npmignore
    LICENSE
    README.md
    cli.js
    package.json
    hooks/
      postinstall.js
      sqliteRuntime.js
      trayRuntime.js
    scripts/
      build-cli.js
      buildMitm.js
    src/
      cli/
        terminalUI.js
        api/
          client.js
        menus/
          apiKeys.js
          cliTools.js
          combos.js
          providers.js
          settings.js
        tray/
          autostart.js
          icon.ico
          icon.png
          tray.js
          tray.ps1
          trayWin.js
        utils/
          clipboard.js
          display.js
          endpoint.js
          format.js
          input.js
          menuHelper.js
          modelSelector.js
  docs/
    ARCHITECTURE.md
  gitbook/
    .gitignore
    jsconfig.json
    next.config.mjs
    package.json
    postcss.config.mjs
    app/
      globals.css
      layout.js
      page.js
      [lang]/
        page.js
        [...slug]/
          page.js
    components/
      DocsContent.js
      DocsHeader.js
      DocsLayout.js
      DocsSidebar.js
      DocsToc.js
      LanguageSwitcher.js
    constants/
      docsConfig.js
      languages.js
    content/
      en/
        faq.md
        index.md
        troubleshooting.md
        deployment/
          cloud.md
          localhost.md
        features/
          combos.md
          quota-tracking.md
          smart-routing.md
        getting-started/
          installation.md
          quick-start.md
        integration/
          claude-code.md
          cline.md
          codex.md
          continue.md
          cursor.md
          other-tools.md
          roo.md
        providers/
          cheap.md
```

## Key Source Excerpts
### src\lib\appUpdater.js
```javascript
import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { UPDATER_CONFIG } from "@/shared/constants/config";

const KILL_TIMEOUT_MS = 5000;
const PROCESS_WAIT_MS = 1500;

// Kill MITM server by PID file (MITM may run as admin/sudo)
function killMitmByPidFile() {
  try {
    const mitmPidFile = path.join(
      process.platform === "win32"
        ? path.join(process.env.APPDATA || "", "9router")
        : path.join(os.homedir(), ".9router"),
      "mitm",
      ".mitm.pid"
    );
    if (!fs.existsSync(mitmPidFile)) return;
    const pid = parseInt(fs.readFileSync(mitmPidFile, "utf8").trim(), 10);
    if (!pid) return;

    if (process.platform === "win32") {
      // taskkill first (works if same user); fallback to PowerShell Stop-Process which can kill admin process if our token allows
      try { execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore", windowsHide: true, timeout: 3000 }); } catch {
        try { execSync(`powershell -NonInteractive -WindowStyle Hidden -Command "Stop-Process -Id ${pid} -Force"`, { stdio: "ignore", windowsHide: true, timeout: 3000 }); } catch { /* best effort */ }
      }
    } else {
      try {
        execSync(`sudo -n kill -9 ${pid} 2>/dev/null`, { stdio: "ignore", timeout: 3000 });
      } catch {
        try { process.kill(pid, "SIGKILL"); } catch { /* best effort */ }
      }
    }
    try { fs.unlinkSync(mitmPidFile); } catch { /* best effort */ }
  } catch { /* best
```

### src\lib\consoleLogBuffer.js
```javascript
import { EventEmitter } from "events";
import { CONSOLE_LOG_CONFIG } from "@/shared/constants/config.js";

const consoleLevels = ["log", "info", "warn", "error", "debug"];

if (!global._consoleLogBufferState) {
  global._consoleLogBufferState = {
    logs: [],
    patched: false,
    originals: {},
    emitter: new EventEmitter(),
  };
  global._consoleLogBufferState.emitter.setMaxListeners(50);
}

const state = global._consoleLogBufferState;

// Ensure emitter exists (handles hot reload with stale global)
if (!state.emitter) {
  state.emitter = new EventEmitter();
  state.emitter.setMaxListeners(50);
}

if (!state.pendingLines) state.pendingLines = [];
if (!state.flushTimer) state.flushTimer = null;

const FLUSH_INTERVAL_MS = 100;
const MAX_BATCH_LINES = 50;

function flushPendingLines() {
  state.flushTimer = null;
  if (!state.pendingLines.length) return;

  const lines = state.pendingLines.splice(0, state.pendingLines.length);
  state.emitter.emit("lines", lines);
}

function scheduleFlush() {
  if (state.flushTimer) return;
  state.flushTimer = setTimeout(flushPendingLines, FLUSH_INTERVAL_MS);
  state.flushTimer?.unref?.();
}

function toLogLine(level, args) {
  return args.map(formatArg).join(" ");
}

// Strip ANSI escape codes so terminal colors don't bleed into UI
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function stripAnsi(str) {
  return str.replace(ANSI_RE, "");
}

function formatArg(arg) {
  if (typeof arg === "string") return stripAnsi(arg);
  if (arg instanceof Error)
```

### src\lib\dataDir.js
```javascript
import fs from "node:fs";
import path from "path";
import os from "os";

const APP_NAME = "9router";

function defaultDir() {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), APP_NAME);
  }
  return path.join(os.homedir(), `.${APP_NAME}`);
}

export function getDataDir() {
  const configured = process.env.DATA_DIR;
  if (!configured) return defaultDir();

  // On Windows, ignore Unix-style absolute paths (e.g. /var/lib/...) that come
  // from a Linux-targeted .env or Docker config — they are not valid here.
  if (process.platform === "win32" && /^\//.test(configured)) {
    console.warn(`[DATA_DIR] '${configured}' is a Unix path on Windows → fallback to default`);
    return defaultDir();
  }

  try {
    fs.mkdirSync(configured, { recursive: true });
    return configured;
  } catch (e) {
    if (e?.code === "EACCES" || e?.code === "EPERM") {
      console.warn(`[DATA_DIR] '${configured}' not writable → fallback ~/.${APP_NAME}`);
      return defaultDir();
    }
    throw e;
  }
}

export const DATA_DIR = getDataDir();

```

## Agent Configuration
### CLAUDE.md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

9Router (`9router-app`) — a local AI routing gateway + Next.js dashboard. It exposes one OpenAI-compatible endpoint (`/v1/*`) and routes traffic across 40+ upstream providers with format translation, model-combo fallback, multi-account fallback, OAuth/API-key credential management, token refresh, quota/usage tracking, and optional cloud sync.

Two published artifacts live in this one repo:
- The **dashboard + gateway** (root `package.json`, `9router-app`) — the Next.js server that does the actual routing.
- The **CLI launcher** (`cli/`, published to npm as `9router`) — a separate package that installs/starts the server and manages the tray. It has its own `package.json`, version, and build.

The code lives in `src/` (Next.js app + dashboard/compat APIs), `open-sse/` (the provider-agnostic routing/translation engine), `cli/` (the launcher package), and `tests/`.

## Commands

Dashboard/gateway (run from repo root):
```bash
cp .env.example .env
npm install
PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run dev   # dev (webpack, port 20127 by default via next dev)
npm run build && PORT=20128 HOSTNAME=0.0.0.0 npm run start           # production
```
- Bun variants: `npm run dev:bun` / `build:bun` / `start:bun`.
- Default runtime port is **20128** (dashboard at `/dashboard`, API at `/v1`).
- Lint: `npx eslint .` (config `eslint.config.mj

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `router`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
