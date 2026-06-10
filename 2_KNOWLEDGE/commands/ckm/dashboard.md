# Command: /dashboard

Launch the Marketing Dashboard web application.

## Description

Starts the full-stack Marketing Dashboard with Vue 3 frontend and Hono API backend. Provides visual interface for campaign management, content creation, asset organization, and AI-powered automation recipes.

## Usage

```bash
/dashboard [mode]
```

## Arguments

- `mode` (optional): Start mode
  - `dev` (default): Development mode with HMR
  - `prod`: Production mode (requires build first)
  - `build`: Build for production
  - `stop`: Stop running servers

## Examples

```bash
# Start development mode (default)
/dashboard
/dashboard dev

# Build for production
/dashboard build

# Start production mode
/dashboard prod

# Stop all servers
/dashboard stop
```

## Features

### Dashboard Features
- **Campaign Board**: Kanban view with drag-drop status management
- **Content Library**: Grid view with filters (type, campaign, status)
- **Asset Gallery**: Link assets to campaigns with AI enhancement
- **Automation Panel**: Pre-built recipes for common tasks:
  - Blog Post Generator
  - Social Media Pack
  - Campaign Brief Creator
  - SEO Audit Tool

### Tech Stack
- **Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS
- **Backend**: Hono + Node.js
- **Database**: SQLite (local)
- **AI**: Claude integration via API

## URLs (Development Mode)

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3457
- **Health Check**: http://localhost:3457/health

## URLs (Production Mode)

- **Application**: http://localhost:3457 (serves built Vue app)
- **Health Check**: http://localhost:3457/health

## Requirements

- Node.js 18+
- NPM dependencies installed (auto-installs on first run)

## Notes

- API key required (set via Settings page or sessionStorage)
- Dev mode uses HMR for instant updates
- Production mode serves optimized build (56 KB gzipped)
- All data stored locally in SQLite database

## Related Files

- Skill: `.claude/skills/marketing-dashboard/`
- Scripts: `start.sh`, `build.sh`, `stop.sh`, `start-production.sh`
- Server: `server/index.js`
- Frontend: `app/src/`
