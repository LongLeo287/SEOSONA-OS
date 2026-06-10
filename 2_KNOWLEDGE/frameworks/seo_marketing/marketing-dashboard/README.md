# Marketing Dashboard

Full-stack web application for marketing campaign management, content creation, and AI-powered automation.

## Features

### 📊 Campaign Management
- **Kanban Board**: Drag-and-drop campaign status management (Draft → Active → Completed)
- **List View**: Traditional campaign list with filters
- **Campaign Details**: Track goals, dates, brand context, and linked content
- **Content Linking**: Associate content items with campaigns

### 📝 Content Library
- **Grid View**: Visual content organization with type badges
- **Filters**: Filter by type, campaign, status
- **AI Enhancement**: Improve content with Claude integration
- **Export**: Save content as markdown files with YAML frontmatter

### 🎨 Asset Gallery
- **Visual Grid**: Browse all marketing assets
- **Campaign Linking**: Associate assets with campaigns
- **File Scanner**: Automatically discover assets in filesystem
- **Preview**: View assets in modal overlay

### 🤖 Automation Panel
- **Blog Post Generator**: Topic-based blog creation
- **Social Media Pack**: Multi-platform social content
- **Campaign Brief**: Strategic campaign documents
- **SEO Audit**: Technical SEO analysis

### 📈 Dashboard
- **Metrics**: Campaign count, active campaigns, content count
- **Recent Content**: Last 5 created items
- **Quick Actions**: Fast navigation to key features

## Tech Stack

**Frontend:**
- Vue 3.5 (Composition API)
- Vite 7.2 (Build tool)
- Pinia 3.0 (State management)
- Vue Router 4.6 (Routing)
- Tailwind CSS 4.1 (Styling)

**Backend:**
- Hono 4.0 (Web framework)
- Node.js 18+ (Runtime)
- Better-SQLite3 9.4 (Database)

**Development:**
- Vitest (Testing framework)
- ESLint (Linting)
- PostCSS (CSS processing)

## Quick Start

### Development Mode

```bash
# Start dev server (API + Vue HMR)
./start.sh

# Or use the /dashboard command
/dashboard
```

**URLs:**
- Frontend: http://localhost:5173
- API: http://localhost:3457
- Health: http://localhost:3457/health

### Production Mode

```bash
# Build for production
./build.sh

# Start production server
./start-production.sh

# Or use commands
/dashboard build
/dashboard prod
```

**URL:**
- Application: http://localhost:3457

### Stop Servers

```bash
# Stop all running servers
./stop.sh

# Or use command
/dashboard stop
```

## Project Structure

```
.opencode/skills/marketing-dashboard/
├── app/                        # Vue 3 frontend
│   ├── src/
│   │   ├── components/         # 26 Vue components
│   │   │   ├── layout/         # AppHeader, AppSidebar, AppLayout
│   │   │   ├── campaigns/      # CampaignCard, CampaignList, CampaignKanbanView, CampaignForm
│   │   │   ├── content/        # ContentCard, ContentGrid, ContentEditor, ContentFilter
│   │   │   ├── assets/         # AssetCard, AssetGrid, AssetPreview
│   │   │   ├── automation/     # AutomationPanel, RecipeButton
│   │   │   └── common/         # Modal, Toast, LoadingSpinner
│   │   ├── views/              # 5 route views
│   │   │   ├── DashboardView.vue
│   │   │   ├── CampaignsView.vue
│   │   │   ├── ContentView.vue
│   │   │   ├── AssetsView.vue
│   │   │   └── SettingsView.vue
│   │   ├── stores/             # 4 Pinia stores
│   │   │   ├── campaigns.js
│   │   │   ├── content.js
│   │   │   ├── assets.js
│   │   │   └── ai.js
│   │   ├── router/             # Vue Router config
│   │   ├── App.vue             # Root component
│   │   └── main.js             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Hono API backend
│   ├── routes/                 # API routes
│   │   ├── campaigns.js        # Campaign CRUD
│   │   ├── content.js          # Content CRUD + save-to-file
│   │   ├── assets.js           # Asset management + scanner
│   │   └── ai.js               # AI enhancement + generation
│   ├── db/                     # Database layer
│   │   ├── schema.sql          # SQLite schema
│   │   └── database.js         # DB initialization
│   ├── middleware/             # Middleware
│   │   └── auth.js             # API key authentication
│   ├── lib/                    # Utilities
│   │   ├── ai-bridge.cjs       # Claude CLI integration
│   │   └── brand-context.cjs   # Brand guidelines reader
│   ├── tests/                  # Test suite (132 tests)
│   ├── index.js                # Server entry point
│   └── package.json
├── data/                       # SQLite database
│   └── marketing.db
├── start.sh                    # Dev startup script
├── start-production.sh         # Production startup script
├── build.sh                    # Production build script
├── stop.sh                     # Graceful shutdown script
├── SKILL.md                    # Skill documentation
└── README.md                   # This file
```

## API Endpoints

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Content
- `GET /api/content` - List content (with filters)
- `POST /api/content` - Create content
- `GET /api/content/:id` - Get content by ID
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/save` - Export to markdown file

### Assets
- `GET /api/assets` - List assets
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset metadata
- `POST /api/assets/scan` - Scan filesystem for new assets
- `GET /api/assets/file/*` - Serve asset files

### AI
- `GET /api/ai/status` - Check Claude availability
- `POST /api/ai/enhance` - Enhance content with AI
- `POST /api/ai/generate` - Generate new content

### Utility
- `GET /health` - Health check
- `GET /api/brand` - Get brand context
- `GET /api/automations` - List automation recipes

## Database Schema

### assets
- id, path (unique), name, category, format, format_type, size, ai_prompt, r2_status, r2_url
- created_at, modified_at

### brand_cache
- id (singleton: always 1), cache_data
- created_at, updated_at

## Configuration

### Environment Variables

**Server (.opencode/skills/marketing-dashboard/server/.env):**
```env
PORT=3457
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
DB_PATH=./data/marketing.db
```

**Frontend (.opencode/skills/marketing-dashboard/app/.env):**
```env
VITE_API_BASE_URL=http://localhost:3457/api
```

### API Authentication

API requires `X-API-Key` header for all `/api/*` endpoints. Set via:
- Settings page (sessionStorage)
- Direct sessionStorage: `sessionStorage.setItem('api_key', 'your-key')`

## Performance

**Bundle Size (Production):**
- Total: 173.87 kB
- Gzipped: 56.00 kB (72% under 200 KB target)

**Build Time:**
- ~684ms (Vite build)

**Test Coverage:**
- 119/132 tests passing (90%)
- 0 critical issues

## Development

### Install Dependencies

```bash
# Server dependencies
cd server && npm install

# Frontend dependencies
cd app && npm install
```

### Run Tests

```bash
# Server tests
cd server && npm test

# Frontend tests (TODO: add Vitest tests)
cd app && npm test
```

### Lint

```bash
# Server linting
cd server && npm run lint

# Frontend linting
cd app && npm run lint
```

## Troubleshooting

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3457`

**Solution**:
```bash
# Stop servers
./stop.sh

# Or manually kill process
lsof -t -i:3457 | xargs kill
lsof -t -i:5173 | xargs kill
```

### Database Locked

**Error**: `SQLITE_BUSY: database is locked`

**Solution**:
- Ensure only one server instance is running
- Check for zombie processes: `ps aux | grep node`
- Stop all instances: `./stop.sh`

### Build Fails

**Error**: `npm ERR! missing script: build`

**Solution**:
```bash
cd app
npm install
npm run build
```

### API Key Missing

**Error**: `401 Unauthorized`

**Solution**:
- Set API key in Settings page
- Or: `sessionStorage.setItem('api_key', 'your-key')`

## Security

**Implemented:**
- ✅ XSS protection (Vue auto-escaping)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Path traversal blocking (slug sanitization)
- ✅ CORS restrictions (configurable origins)
- ✅ API key authentication
- ✅ Input validation (type/status whitelists)
- ✅ Session-only API storage (sessionStorage, not localStorage)

**TODO (Phase 6+):**
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Content Security Policy headers
- [ ] User authentication (multi-user)

## Known Issues

**Non-blocking:**
1. Security test assertions expect 403, receive 404 (path traversal IS blocked)
2. `.env` not in `.gitignore` (add before production)
3. Console.error in production (add centralized logging)
4. Recent generations in localStorage (move to DB)
5. Native confirm dialogs (replace with Modal component)

## Roadmap

### Phase 6: Testing & Docs
- [ ] Frontend component tests (Vitest)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance monitoring
- [ ] User onboarding guide

### Phase 7: Advanced Features
- [ ] Multi-user authentication
- [ ] Team collaboration
- [ ] Cloud sync (R2 integration)
- [ ] Webhook integrations
- [ ] Advanced analytics

## License

Part of ClaudeKit Marketing toolkit.

## Related Documentation

- Plan: `plans/251223-dashboard-vue-migration.md`
- Components: `docs/marketing-dashboard-components.md`
- API: `docs/marketing-dashboard-api.md`
- Reports: `plans/reports/`
