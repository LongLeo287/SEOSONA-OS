# KI: simstudioai/sim

## Overview
perl -i -pe "s/your_encryption_key/$(openssl rand -hex 32)/" apps/sim/.env perl -i -pe "s/your_internal_api_secret/$(openssl rand -hex 32)/" apps/sim/.env perl -i -pe "s/your_api_encryption_key/$(openssl rand -hex 32)/" apps/sim/.env

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 106 files across 42 directories
- **File types:** .md: 83, .yaml: 11, .json: 3, .yml: 3, .dockerignore: 1, .gitattributes: 1, .gitignore: 1

## Documentation Sections
- Build everything in Chat
- Create files and documents
- Ground agents in your knowledge
- Structured data with Tables
- Build visually with Workflows
- Quickstart
- Cloud-hosted: [sim.ai](https://sim.ai)
- Self-hosted: NPM Package
- Self-hosted: Docker Compose
- Self-hosted: Manual Setup
- Create your secrets
- DB configs for migration
- Edit both .env files to set DATABASE_URL="postgresql://postgres:your_password@localhost:5432/simstudio"
- Chat API Keys
- Environment Variables
- Tech Stack
- Contributing
- License

## Core Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  .npmrc
  AGENTS.md
  CLAUDE.md
  LICENSE
  NOTICE
  README.md
  biome.json
  bun.lock
  bunfig.toml
  docker-compose.local.yml
  docker-compose.ollama.yml
  docker-compose.prod.yml
  package.json
  turbo.json
  .agents/
    skills/
      add-block/
        SKILL.md
        agents/
          openai.yaml
      add-connector/
        SKILL.md
        agents/
          openai.yaml
      add-enrichment/
        SKILL.md
        agents/
          openai.yaml
      add-hosted-key/
        SKILL.md
        agents/
          openai.yaml
      add-integration/
        SKILL.md
        agents/
          openai.yaml
      add-model/
        SKILL.md
        agents/
          openai.yaml
      add-tools/
        SKILL.md
        agents/
          openai.yaml
      add-trigger/
        SKILL.md
        agents/
          openai.yaml
      cleanup/
        SKILL.md
      council/
        SKILL.md
      db-migrate/
        SKILL.md
      emcn-design-review/
        SKILL.md
      memory-load-check/
        SKILL.md
      react-query-best-practices/
        SKILL.md
      ship/
        SKILL.md
      validate-connector/
        SKILL.md
        agents/
          openai.yaml
      validate-integration/
        SKILL.md
        agents/
          openai.yaml
      validate-model/
        SKILL.md
        agents/
          openai.yaml
      validate-trigger/
        SKILL.md
      you-might-not-need-a-callback/
        SKILL.md
      you-might-not-need-a-memo/
        SKILL.md
      you-might-not-need-an-effect/
        SKILL.md
      you-might-not-need-state/
        SKILL.md
  .claude/
    commands/
      add-block.md
      add-connector.md
      add-enrichment.md
      add-feature-flag.md
      add-hosted-key.md
      add-integration.md
      add-model.md
      add-tools.md
      add-trigger.md
      cleanup.md
      council.md
      emcn-design-review.md
      react-query-best-practices.md
      ship.md
      validate-connector.md
      validate-integration.md
      validate-model.md
      validate-trigger.md
      you-might-not-need-a-callback.md
      you-might-not-need-a-memo.md
      you-might-not-need-an-effect.md
      you-might-not-need-state.md
      you-might-not-need-url-state.md
    rules/
      constitution.md
      emcn-components.md
      global.md
      landing-seo-geo.md
      sim-architecture.md
      sim-components.md
      sim-hooks.md
      sim-imports.md
      sim-integrations.md
      sim-queries.md
     
```

## Quick Start
```bash
npx simstudio
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
git clone https://github.com/simstudioai/sim.git
cd sim
bun install
bun run prepare  # Set up pre-commit hooks
docker run --name simstudio-db -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=simstudio -p 5432:5432 -d pgvector/pgvector:pg17
cp apps/sim/.env.example apps/sim/.env
perl -i -pe "s/your_encryption_key/$(openssl rand -hex 32)/" apps/sim/.env
```

## Agent Configuration

--- AGENTS.md ---
# Sim Development Guidelines

You are a professional software engineer. All code must follow best practices: accurate, readable, clean, and efficient.

## Global Standards

- **Linting / Audit**: `bun run check:api-validation` must pass on PRs. Do not introduce route-local boundary Zod schemas, direct route Zod imports, or ad-hoc client wire types — see "API Contracts" and "API Route Pattern" below
- **Logging**: Import `createLogger` from `@sim/logger`. Use `logger.info`, `logger.warn`, `logger.error` instead of `console.log`. Inside API routes wrapped with `withRouteHandler`, loggers automatically include the request ID — no manual `withMetadata({ requestId })` needed
- **API Route Handlers**: All API route handlers (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) must be wrapped with `withRouteHandler` from `@/lib/core/utils/with-route-handler`. This provides request ID tracking, automatic error logging for 4xx/5xx responses, and unhandled error catching. See "API Route Pattern" section below
- **Comments**: Use TSDoc for documentation. No `====` separators. No non-TSDoc comments
- **Styling**: Never update global styles. Keep all styling local to components
- **ID Generation**: Never use `crypto.randomUUID()`, `nanoid`, or `uuid` package. Use `generateId()` (UUID v4) or `generateShortId()` (compact) from `@sim/utils/id`
- **Common Utilities**: Use shared helpers from `@sim/utils` instead of inline implementations:
  - `sleep(ms)` from `@sim/utils/helpers` — never `new Promise(resolve => setTimeout(resolve, ms))`
  - `toError(e)` from `@sim/utils/errors` — normalize caught values to `Error`
  - `getErrorMessage(e, fallback?)` from `@sim/utils/errors` — extract message string from unknown caught value; never write `e instanceof Error ? e.message : 'fallback'`
  - `structuredClone(value)` — built-in deep clone; never `JSON.parse(JSON.stringify(...))`
  - `omit(obj, keys)` / `filterUndefined(obj)` from `@sim/utils/object` — object trimming; never `Object.fromEntries(Object

--- CLAUDE.md ---
# Sim Development Guidelines

You are a professional software engineer. All code must follow best practices: accurate, readable, clean, and efficient.

## Global Standards

- **Linting / Audit**: `bun run check:api-validation` must pass on PRs. Do not introduce route-local boundary Zod schemas, direct route Zod imports, or ad-hoc client wire types — see "API Contracts" and "API Route Pattern" below
- **Logging**: Import `createLogger` from `@sim/logger`. Us

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
