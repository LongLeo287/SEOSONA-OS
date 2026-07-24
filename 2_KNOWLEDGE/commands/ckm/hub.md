---
description: Open Content Hub + Marketing Dashboard
argument-hint: [--stop|--scan]
---

💡
Activate `content-hub` skill and start Marketing Dashboard.

## Usage

```bash
/write:hub           # Start all services
/write:hub --scan    # Rescan assets folder
/write:hub --stop    # Stop all servers
```

## Workflow

1. **Start servers**: Content Hub + Marketing Dashboard (API + Frontend)
2. **Auto-open**: Content Hub at http://localhost:3457/hub
3. **Access dashboard**: Marketing Dashboard at http://localhost:5173

## Services Started

| Service | URL | Description |
|---------|-----|-------------|
| Content Hub | http://localhost:3457/hub | Asset gallery with AI editor |
| Dashboard UI | http://localhost:5173 | Marketing dashboard (Vue) |
| Dashboard API | http://localhost:3457/api/ | REST API (Hono + SQLite) |

## Execution

```bash
bash .claude/skills/content-hub/scripts/start-all.sh $ARGUMENTS
```

Report all URLs when servers start.

## Features

**Content Hub:**
- Visual asset gallery with thumbnails
- AI-powered content editor
- Brand context sidebar
- Filter/search by type

**Marketing Dashboard:**
- Campaign management
- Content library
- Asset linking
- Automation panel
