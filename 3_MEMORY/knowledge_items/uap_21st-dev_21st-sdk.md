# KI: 21st-dev/21st-sdk

## Overview
The open-source SDK for building, deploying, and embedding AI coding agents.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 99 files across 44 directories
- **File types:** .tsx: 69, .ts: 9, .json: 6, .md: 3, .js: 3, .gitignore: 2, .png: 2
- **Dev dependencies:** turbo

## Documentation Sections
- 21st Agents SDK
- Architecture
- Packages
- Apps
- Local Setup
- Optional local Redis, if you are not using a hosted REDIS_URL
- Terminal 1: model proxy
- Terminal 2: relay
- Terminal 3: web app

## Available Commands
- `npm run build` -- turbo run build --filter=./packages/*
- `npm run dev` -- turbo run dev
- `npm run ts:check` -- turbo run ts:check --filter=./packages/*

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  README.md
  package.json
  pnpm-workspace.yaml
  turbo.json
  .github/
    workflows/
      ci.yml
  apps/
    agents-web/
      .env.example
      .eslintrc.js
      .gitignore
      Dockerfile
      README.md
      components.json
      global.d.ts
      instrumentation.ts
      middleware.ts
      next.config.mjs
      package.json
      postcss.config.js
      tailwind.config.js
      tsconfig.json
      vercel.json
      app/
        globals.css
        layout.tsx
        manifest.ts
        opengraph-image.png
        providers.tsx
        sitemap.ts
        twitter-image.png
        (alpha)/
          atoms.ts
          agents/
            layout.tsx
            loading.tsx
            _components/
              dashboard-layout-client.tsx
              overview-content.tsx
              standalone-runs-page-client.tsx
              wizard-empty-state.tsx
              wizard-send-context.ts
            api/
              api-keys.tsx
              page.tsx
            api-keys/
              page.tsx
              _components/
                api-keys-page-client.tsx
                api-keys-skeleton.tsx
            billing/
              page.tsx
              _components/
                billing-page-client.tsx
            deployments/
              page.tsx
              [id]/
                page.tsx
                _components/
                  deployment-detail-client.tsx
              _components/
                agent-details-panel.tsx
                deployment-detail-header.tsx
                deployment-status-badge.tsx
                deployment-status-card.tsx
                deployments-page-client.tsx
                env-vars-section.tsx
            environment-variables/
              page.tsx
              _components/
                env-vars-page-client.tsx
                env-vars-skeleton.tsx
            environments/
              layout.tsx
              page.tsx
            get-started/
              page.tsx
              _components/
                get-started-page-client.tsx
            observability/
              layout.tsx
              page.tsx
              _components/
                metric-chart-card.tsx
                observability-page-client.tsx
                observability-skeleton.tsx
                recent-errors.tsx
                use-observability-metrics.ts
            overview/
              page.tsx
              [agentId]/
                page.tsx
       
```

## Quick Start
```bash
The runtime sandbox must be able to call both `RELAY_URL` and `CLAUDE_PROXY_URL`.
If the sandbox runs remotely, `localhost` will not work for those values; expose
local relay/proxy with ngrok, an AWS tunnel, or another public/internal tunnel.
| Path | Package | Purpose |
| --- | --- | --- |
| `packages/agent` | `@21st-sdk/agent` | Agent and tool definition helpers |
| `packages/react` | `@21st-sdk/react` | React chat UI components and tool renderers |
| `packages/node` | `@21st-sdk/node` | Server-side API client |
| `packages/nextjs` | `@21st-sdk/nextjs` | Next.js integration and token handler |
| `packages/cli` | `@21st-sdk/cli` | Agent deploy and management CLI |
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to AN SDK

Thanks for your interest in contributing to AN SDK!

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/21st-dev/an-sdk/issues/new) with:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Which package is affected (`@an-sdk/agent`, `@an-sdk/react`, etc.)

## Pull Requests

We welcome PRs for bug fixes, documentation improvements, and new features.

1. Fork the repo and create your branch from `main`
2. Install dependencies: `pnpm install`
3. Make your changes
4. Run the build to verify: `pnpm build`
5. Open a PR with a clear description

### Development Setup

```bash
git clone https://github.com/21st-dev/an-sdk.git
cd an-sdk
pnpm install
pnpm build
```

### Code Style

- TypeScript throughout
- Follow existing patterns in the codebase
- Keep changes focused — one feature or fix per PR

## How This Repo Works

This repo contains the open-source SDK packages for the AN platform. The source of truth is maintained internally, and this repo is synced periodically. We review and merge community PRs, then sync them back.

## Questions?

Join the discussion in [GitHub Issues](https://github.com/21st-dev/an-sdk/issues) or reach out at [an.dev](https://an.dev).



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
