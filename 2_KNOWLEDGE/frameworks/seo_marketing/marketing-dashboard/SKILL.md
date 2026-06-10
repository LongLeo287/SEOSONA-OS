---
name: ckm:marketing-dashboard
description: Local-first marketing command center for solopreneurs. Manage campaigns, content, and assets with Claude Code AI automation.
metadata:
  author: claudekit
  version: "1.0.0"
---

# Marketing Dashboard

**Status:** Foundation Phase (Phase 1 Complete)

Local-first marketing command center for solopreneurs. Manage campaigns, content, and assets with Claude Code AI automation.

## Quick Start

### Development Mode

```bash
# Terminal 1: Start API server
cd .opencode/skills/marketing-dashboard/server
npm run dev

# Terminal 2: Start Vue frontend
cd .opencode/skills/marketing-dashboard/app
npm run dev
```

Access:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3457

### Production Mode

```bash
# Build frontend
cd .opencode/skills/marketing-dashboard/app
npm run build

# Start server (serves API + built frontend)
cd ../server
npm start
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3 + Vite + Tailwind CSS |
| Backend | Hono (Node.js) |
| Database | SQLite (better-sqlite3) |
| AI | Claude Code CLI |

## Phase 1 Complete ✓

- [x] Vue 3 + Vite app initialized
- [x] Tailwind CSS configured with design tokens
- [x] Hono API server created
- [x] SQLite database schema defined
- [x] Basic API endpoints (GET)

## Next Phases

- **Phase 2:** Full CRUD API routes
- **Phase 3:** Vue components & stores
- **Phase 4:** Dashboard features
- **Phase 5:** Integration & deployment

## Database Tables

- `campaigns` - Marketing campaigns
- `content` - Blog posts, social media, emails
- `assets` - Images, videos, documents
- `automations` - AI automation recipes

## Commands

```bash
# Start dashboard
/marketing:dashboard

# Or manually:
node .opencode/skills/marketing-dashboard/server/index.js
```
