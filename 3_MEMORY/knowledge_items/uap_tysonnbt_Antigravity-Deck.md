# KI: tysonnbt/Antigravity-Deck

## Overview
Antigravity Deck — full-featured workspace dashboard for Antigravity with conversation history, multi-workspace, and remote access

## Tech Stack (from code)
- TypeScript (React) (64 files)
- JavaScript (61 files)
- TypeScript (18 files)
- Shell (2 files)
- **Total:** 167 files, 22 directories
- **File types:** .tsx: 64, .js: 61, .ts: 18, .json: 6, .md: 4, .png: 4, .gitignore: 2, .mjs: 2

## Dependencies
### Dependencies (from package.json)
- `discord.js`: ^14.25.1
- `express`: ^4.18.2
- `express-rate-limit`: ^8.3.1
- `helmet`: ^8.1.0
- `morgan`: ^1.10.1
- `protobufjs`: ^8.0.0
- `qrcode-terminal`: ^0.12.0
- `rotating-file-stream`: ^3.2.9
- `web-push`: ^3.6.7
- `ws`: ^8.16.0
- `zod`: ^4.3.6

### Dev Dependencies
- `concurrently`: ^9.2.1

## Available Commands
- `npm run setup` -- `npm install && npm install --prefix frontend && node -e "const fs=require('fs');`
- `npm run start` -- `node server.js`
- `npm run dev` -- `npx concurrently -n BE,FE -c cyan,magenta "node --watch server.js --port 3500 --`
- `npm run prod` -- `node start-tunnel.js --local`
- `npm run server` -- `node --watch server.js --port 3500`
- `npm run tunnel:be` -- `cloudflared tunnel --url http://localhost:3500`
- `npm run tunnel:fe` -- `cloudflared tunnel --url http://localhost:3000`
- `npm run tunnel` -- `npx concurrently -n TUN-BE,TUN-FE -c green,yellow "npm run tunnel:be" "npm run t`
- `npm run online` -- `node start-tunnel.js`

## File Structure
```
  .gitignore
  README.md
  package.json
  server.js
  settings.sample.json
  start-tunnel.js
  docs/
    images/
      conversation-desktop.png
      conversation-mobile.png
      history-desktop.png
      resource-monitor.png
  frontend/
    .gitignore
    README.md
    components.json
    eslint.config.mjs
    next.config.ts
    package.json
    postcss.config.mjs
    tsconfig.json
    app/
      globals.css
      icon.svg
      layout.tsx
      page.tsx
    components/
      agent-bridge-view.tsx
      agent-logs-view.tsx
      analytics-panel.tsx
      app-sidebar.tsx
      auth-gate.tsx
      cascade-panel.tsx
      chat-area.tsx
      chat-view.tsx
      conversation-history-view.tsx
      markdown-renderer.tsx
      mcp-view.tsx
      memories-view.tsx
      profile-switcher.tsx
      repo-info-view.tsx
      resource-monitor-view.tsx
      settings-view.tsx
      source-control-view.tsx
      step-detail.tsx
      timeline.tsx
      token-usage.tsx
      toolbar.tsx
      user-profile.tsx
      workflow-autocomplete.tsx
      workflows-view.tsx
      workspace-onboard-modal.tsx
      chat/
        agent-response.tsx
        chat-helpers.ts
        code-change-viewer.tsx
        generated-image-step.tsx
        processing-group.tsx
        raw-json-viewer.tsx
        streaming-indicator.tsx
        user-message.tsx
        waiting-step.tsx
      profile/
        collapsible-section.tsx
        credit-card.tsx
        feature-badge.tsx
      sidebar/
        project-group.tsx
        resource-bar.tsx
        system-resource-summary.tsx
      ui/
        alert-dialog.tsx
        avatar.tsx
        badge.tsx
        button.tsx
        card.tsx
        checkbox.tsx
        collapsible.tsx
        dialog.tsx
        dropdown-menu.tsx
        input.tsx
        label.tsx
        scroll-area.tsx
        select.tsx
        separator.tsx
        sheet.tsx
        sidebar.tsx
        skeleton.tsx
        slider.tsx
        step-icon.tsx
        switch.tsx
        tabs.t
```

## Key Source Excerpts
### server.js
```javascript
// === AntigravityAuto Server — Entry Point ===
const logger = require('./src/logger'); // MUST be first — intercepts console.* globally
const express = require('express');
const http = require('http');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const { PORT } = require('./src/config');
const { init, startAutoRescan } = require('./src/detector');
const { setupRoutes } = require('./src/routes');
const { setupWebSocket, startPolling } = require('./src/cache');
const helmet = require('helmet');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Three WebSocket servers: UI (/ws), Agent API (/ws/agent), Orchestrator (/ws/orchestrator)
const wss = new WebSocketServer({ noServer: true });
const agentWss = new WebSocketServer({ noServer: true });
const orchestratorWss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/ws/orchestrator') {
    orchestratorWss.handleUpgrade(req, socket, head, ws => orchestratorWss.emit('connection', ws, req));
  } else if (pathname === '/ws/agent') {
    agentWss.handleUpgrade(req, socket, head, ws => agentWss.emit('connection', ws, req));
  } else {
    wss.handleUpgrade(req, socket, 
```

### src\agent-bridge.js
```javascript
// === Agent Bridge (Discord Transport) ===
// Discord-specific transport layer for agent ↔ cascade interaction.
// Uses AgentSession for orchestration — transport-agnostic cascade lifecycle.
//
// Discord Commands (no @mention needed):
//   /help           — show available commands
//   /listws         — list workspaces under defaultWorkspaceRoot
//   /setws <name>   — set active workspace; creates new cascade if bridge active
//
// Regular messages (@mention required in guild):
//   Relayed to Antigravity cascade. Antigravity NOTIFY_USER → forwarded to Discord.

const fs = require('fs');
const path = require('path');
const discord = require('./discord-relay');
const { getSettings, saveSettings, getBridgeSettings, saveBridgeSettings } = require('./config');
const sessionManager = require('./agent-session-manager');

// ── State ────────────────────────────────────────────────────────────────────

const STATES = { IDLE: 'IDLE', ACTIVE: 'ACTIVE', TRANSITIONING: 'TRANSITIONING' };

let state = STATES.IDLE;
let softLimit = 500;
let workspaceName = 'AntigravityAuto';
let log = [];
let bridgeLsInst = null;
let session = null; // AgentSession instance — owns cascade lifecycle

// ── Persist bridge state to settings.json ────────────────────────────────────

function saveBridgeState() {
    if (!session) return;
    saveBridgeSettings({
        currentWorkspace: workspaceName,
        lastCascadeId: session.cascadeId,
        lastStepCount: session.stepCount,
    });
}

// ── Public
```

### src\agent-session-manager.js
```javascript
// === Agent Session Manager ===
// Registry for concurrent AgentSession instances.
// Handles creation, lookup, destruction, idle timeout, and max session limits.

const crypto = require('crypto');
const { AgentSession } = require('./agent-session');
const { resolveLsInst } = require('./ls-utils');

const sessions = new Map(); // sessionId → AgentSession
let _config = {
    maxConcurrentSessions: 5,
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
    defaultStepSoftLimit: 500,
};
let _cleanupTimer = null;

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Create a new agent session.
 * @param {object} opts
 * @param {string} [opts.workspace]     - Workspace name
 * @param {string} [opts.cascadeId]     - Existing cascade to resume
 * @param {number} [opts.stepSoftLimit] - Step limit override
 * @param {object} [opts.lsInst]        - LS instance { port, csrfToken, useTls }
 * @param {string} [opts.transport]     - Transport label ('discord', 'ws', 'http')
 * @returns {AgentSession}
 */
function createSession(opts = {}) {
    if (sessions.size >= _config.maxConcurrentSessions) {
        // Try to evict oldest idle session
        const evicted = _evictIdlest();
        if (!evicted) {
            throw new Error(`Max concurrent sessions reached (${_config.maxConcurrentSessions})`);
        }
    }

    const id = crypto.randomUUID();
    const session = new AgentSession(id, {
        workspace: opts.workspace,
        cascadeId: opts.c
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 89, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 28}
