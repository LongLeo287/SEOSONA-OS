---
name: skill
description: Open Content Hub + Marketing Dashboard
argument-hint: "[--stop|--scan]"
metadata:
  author: claudekit
  version: "1.0.0"
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
2. **Auto-open**: Content Hub at htt~/.seosona/path/:3457/hub
3. **Access dashboard**: Marketing Dashboard at htt~/.seosona/path/:5173

## Services Started

| Service | URL | Description |
|---------|-----|-------------|
| Content Hub | htt~/.seosona/path/:3457/hub | Asset gallery with AI editor |
| Dashboard UI | htt~/.seosona/path/:5173 | Marketing dashboard (Vue) |
| Dashboard API | htt~/.seosona/path/:3457/api/ | REST API (Hono + SQLite) |

## Execution

```bash
bash .opencode/skills/content-hub/scripts/start-all.sh $ARGUMENTS
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
