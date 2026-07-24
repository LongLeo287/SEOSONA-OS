# KI: brightbeanxyz/brightbean-studio

## Overview
python manage.py process_tasks           # start worker ```

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Python
-   Python deps: Django, django-environ, psycopg[binary], gunicorn, django-allauth[socialaccount], bcrypt, django-background-tasks, django-tailwind[reload], django-htmx, django-storages[s3], Pillow, django-csp, django-ratelimit, cryptography, whitenoise
- **Total files:** 121 files across 23 directories
- **File types:** .py: 92, .yml: 7, .webp: 6, .md: 4, .toml: 3, .json: 3, .yaml: 2

## Core Capabilities
| | |
|---|---|
| **Multi-workspace & teams** | Unlimited orgs → workspaces → members. Granular RBAC with custom roles, invitations, and a separate Client role for external collaborators. |
| **Content composer** | Rich editor with per-platform caption/media overrides, version history, reusable templates, content categories & tags, a Kanban idea board. |
| **Calendar & scheduling** | Visual calendar with recurring weekly posting slots per account and named queues that auto-assign posts to the next available slot. |
| **Publishing engine** | Direct first-party API integrations (no aggregator), automatic retries, per-account rate-limit tracking, and a 90-day publish audit log. |
| **Approval workflows** | Configurable stages (none / optional / internal / internal + client), threaded internal & external comments, reminders, and a full audit trail. |
| **Unified social inbox** | Comments, mentions, DMs, and reviews from every connected platform in one place, with sentiment analysis, assignments, threaded replies, and historical backfill. |
| **Analytics** | Per-post and channel-level performance from every connected platform's native API, with KPI cards, 7/30/90-day trend charts, and a sortable all-posts table for views, engagement, follower growth, reach, and watch time. |
| **Media library** | Org- and workspace-scoped libraries with nested folders, auto-generated platform-optimized variants, alt text, and built-in Unsplash stock-photo search in the composer. |
| **Client portal** | Passwordless 30-day magic-link access so clients can approve or reject posts without creating an account. |
| **Notifications** | In-app, email, and webhook delivery with per-user preferences for every event type. |
| **Security & ops** | Encrypted token & credential storage, Google SSO, Sentry support, and a 14-day reversible org-deletion grace period. 2FA (TOTP) is on the roadmap. |
| **White-label friendly** | Per-workspace branding (logo, colors) and workspace defaults for hashtags, fi

## Documentation Sections
- About BrightBean Studio
- Features
- A quick look
- Supported Platforms
- Hosted Version
- One-Click Deploy
- Quick Start (Docker)
- Fully Local Development (without Docker)
- Prerequisites
- Setup
- Daily workflow (Docker-free)
- (open another tab)
- Running Tests

## Available Commands
- `npm run heroku-postbuild` -- cd theme/static_src && npm ci && npm run build

## Core Structure
```
  .env.example
  .gitignore
  .gitleaks.toml
  .pre-commit-config.yaml
  .python-version
  CONTRIBUTING.md
  Caddyfile
  Dockerfile
  LICENSE
  Makefile
  Procfile
  README.md
  SECURITY.md
  app.json
  conftest.py
  docker-compose.override.yml
  docker-compose.prod.yml
  docker-compose.yml
  manage.py
  package.json
  pyproject.toml
  railway.toml
  render.yaml
  requirements.txt
  .claude/
    launch.json
  .github/
    CODEOWNERS
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    assets/
      BrightBean Social Media Platforms.webp
      BrightBean Studio Analytics.webp
      BrightBean Studio Calendar.webp
      BrightBean Studio Idea Kanban Board.webp
      BrightBean Studio Post Editor.webp
      brightbean-studio-logo.webp
    workflows/
      ci.yml
  apps/
    __init__.py
    background_task_config.py
    accounts/
      __init__.py
      adapters.py
      admin.py
      apps.py
      middleware.py
      models.py
      signals.py
      tasks.py
      urls.py
      urls_root.py
      views.py
      views_signup.py
      migrations/
        0001_initial.py
        0002_replace_avatar_url_with_avatar.py
        0003_add_tos_accepted_at.py
        0004_set_site_brightbean.py
        __init__.py
      tests/
        __init__.py
        test_adapters.py
    analytics/
      __init__.py
      admin.py
      api_builders.py
      apps.py
      constants.py
      derive.py
      freshness.py
      metrics.py
      models.py
      services.py
      signals.py
      tasks.py
      urls.py
      views.py
      management/
        __init__.py
        commands/
          __init__.py
          backfill_analytics.py
      migrations/
        0001_initial.py
        0002_snapshot_raw_errors.py
        __init__.py
      templatetags/
        __init__.py
        analytics_extras.py
      tests/
        __init__.py
        test_tasks.py
    api/
      __init__.py
      api.py
      apps.py
      auth.py
      limits.py
      middleware.py
      models.py
      schemas.py
      tasks.py
      migrations/
        0001_initial.py
        __init__.py
      routers/
        __init__.py
        accounts.py
        analytics.py
        me.py
        media.py
        posts.py
      tests/
        __init__.py
        conftest.py
        test_account_capabilities.py
        test_analytics_router.py
        test_e2e.py
        test_media_router.py
        test_platform_overrides.py
        test_review_fixes.py
 
```

## Quick Start
```bash
git clone https://github.com/brightbeanxyz/brightbean-studio.git
cd brightbean-studio
cp .env.example .env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/brightbean
docker compose up -d --build
docker compose exec app python manage.py migrate
docker compose exec app python manage.py createsuperuser
git clone https://github.com/brightbeanxyz/brightbean-studio.git
cd brightbean-studio
cp .env.example .env
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Brightbean

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository and clone your fork
2. Follow the setup instructions in [README.md](README.md) (Docker or local development)
3. Install the pre-commit hooks (see [Pre-commit hooks](#pre-commit-hooks) below)
4. Create a branch for your work: `git checkout -b your-branch-name`

### Pre-commit hooks

We use [pre-commit](https://pre-commit.com) to run lint, format, type, and secret-scanning checks on every commit. Install it once after cloning:

```bash
pip install pre-commit
pre-commit install
pre-commit install --hook-type pre-push
```

From then on, the hooks run automatically. To run them against every file in the repo (useful after pulling in large changes):

```bash
pre-commit run --all-files
```

The hooks enforce the same rules as CI, so passing them locally means your PR will pass the automated checks.

## Development Workflow

### Running the app

See the [README](README.md) for full setup instructions. The quick version:

```bash
cp .env.example .env
# Edit .env if needed (defaults work for local dev with Docker PostgreSQL)
docker compose up postgres -d
python manage.py migrate
python manage.py runserver
```

### Running tests

```bash
pytest
```

With coverage:

```bash
pytest --cov=apps --cov-report=term-missing
```

### Code style

We use [Ruff](https://docs.astral.sh/ruff/) for linting and formatting, and [mypy](https://mypy-lang.org/) for type checking. Run these before submitting a PR:

```bash
ruff check .              # lint
ruff format --check .     # format check
mypy apps/ config/ providers/ tests/ --ignore-missing-imports
```

To auto-fix lint and formatting issues:

```bash
ruff check --fix .
ruff format .
```

CI runs all of these checks automatically on every PR, plus a [gitleaks](https://github.com/gitleaks/gitleaks) secret scan. Never commit real API keys, tokens, or passwords. Put them in your local `.env`


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
