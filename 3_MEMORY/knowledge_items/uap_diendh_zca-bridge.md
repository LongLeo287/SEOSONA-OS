# KI: diendh/zca-bridge

## Overview
`zca-bridge` là sidecar tự host để đồng bộ hội thoại [Zalo](https://zalo.me) hai chiều với [Chatwoot](https://www.chatwoot.com). Bridge biến Zalo thành một inbox trong Chatwoot để nhân viên có thể nhận, gửi, ghi chú và theo dõi lịch sử hội thoại ngay trong helpdesk.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Fastify
- **Total files:** 123 files across 25 directories
- **File types:** .ts: 76, .sql: 15, .md: 13, .png: 7, .yml: 4, .json: 3, .dockerignore: 1
- **Key dependencies:** @fastify/static, fastify, https-proxy-agent, node-fetch, pg, pino, sharp, socks-proxy-agent, undici, zca-js
- **Dev dependencies:** @types/node, @types/pg, tsx, typescript, vitest

## Documentation Sections
- Zalo-Chatwoot Bridge
- Tóm tắt
- Cảnh báo quan trọng
- Tính năng
- Ảnh giao diện
- Kiến trúc
- Module chính
- Yêu cầu
- Cấu hình nhanh
- Chạy bằng Docker
- Dùng image dựng sẵn
- Build từ source
- Container đơn
- Chạy trực tiếp
- Thiết lập sau khi chạy
- Proxy và tự động kết nối lại
- Cảnh báo vận hành
- Kiểm thử
- Cách Codex được sử dụng

## Available Commands
- `npm run build` -- tsc -p tsconfig.json
- `npm run start` -- node dist/main.js
- `npm run dev` -- tsx watch src/main.ts
- `npm run migrate` -- tsx src/store/migrate.ts
- `npm run check:no-pro` -- tsx scripts/checkNoPro.ts
- `npm run test` -- vitest run
- `npm run test:watch` -- vitest

## Core Structure
```
  .dockerignore
  .env.example
  .gitignore
  CHANGELOG.md
  CONTRIBUTING.md
  CONTRIBUTING.vi.md
  Dockerfile
  LICENSE
  README.en.md
  README.md
  README.vi.md
  ROADMAP.md
  ROADMAP.vi.md
  SECURITY.md
  SECURITY.vi.md
  docker-compose.example.yml
  docker-compose.full.yml
  package-lock.json
  package.json
  tsconfig.json
  vitest.config.ts
  zalo-chatwoot.png
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      custom.md
      feature_request.md
    workflows/
      ci.yml
      release.yml
  assets/
    images/
      admin-preview/
        dashboard-desktop.png
        dashboard-mobile.png
        first-run-setup.png
        logs-desktop.png
        proxy-desktop.png
        settings-desktop.png
  src/
    main.ts
    admin/
      auth.ts
      authRoutes.ts
      infoCardRoutes.ts
      logsRoutes.ts
      proxyRoutes.ts
      routes.ts
      settingsRoutes.ts
      webhookInfoRoutes.ts
      public/
        admin.js
        index.html
    alerting/
      alertStream.ts
      config.ts
      dispatcher.ts
      telegramNotifier.ts
      types.ts
      webhookNotifier.ts
    chatwoot/
      adminClient.ts
      appClient.ts
      appClientFactory.ts
      client.ts
      multipart.ts
      webhookServer.ts
    config/
      env.ts
      resolve.ts
    crypto/
      credentials.ts
    extension/
      loadPro.ts
      publishGuard.ts
      registry.ts
    handlers/
      contactInfoSink.ts
      enrichment.ts
      events.ts
      inbound.ts
      outbound.ts
      outboundNotes.ts
      outboundNotify.ts
    logging/
      dbLogStream.ts
      eventLog.ts
    media/
      archive.ts
      mediaRoute.ts
      token.ts
    pro/
      index.ts
      rbac/
        adminAuth.ts
        permRoutes.ts
        permissions.ts
        rbacRepo.ts
        ui.ts
        userRoutes.ts
    routing/
      sourceId.ts
    store/
      accountRepo.ts
      adminUserRepo.ts
      conversationRepo.ts
      db.ts
      infoCardRepo.ts
      jobQueueRepo.ts
      logsRepo.ts
      mappingRepo.ts
      migrate.ts
      oaTokenRepo.ts
      proxyRepo.ts
      settingsRepo.ts
      migrations/
        001_init.sql
        002_durable_queue.sql
        003_message_map_chatwoot_index.sql
        004_event_job_kinds.sql
        005_message_map_quote_src.sql
        006_oa_accounts.sql
        007_admin_and_settings.sql
        008_event_logs.sql
        009_consultation_window.sql
        010_oa_contact_info.sql
        011_oa_backfill_watermark.sql
        012_account_st
```

## Quick Start
```bash
cp .env.example .env
cp .env.example .env
docker compose -f docker-compose.full.yml up -d
cp .env.example .env
docker compose -f docker-compose.example.yml up -d --build
docker run --env-file .env -p 4000:4000 ghcr.io/diendh/zca-bridge:latest
npm ci
npm run build
mkdir -p dist/store/migrations dist/admin/public
cp src/store/migrations/*.sql dist/store/migrations/
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to zca-bridge

🇻🇳 Tiếng Việt: [CONTRIBUTING.vi.md](CONTRIBUTING.vi.md)

Thanks for your interest in improving zca-bridge. The project prefers small, focused, verified
changes.

## Requirements

- Node.js 24+
- npm with the committed `package-lock.json`
- A dedicated PostgreSQL instance if running the app or repository tests
- Docker if using the compose/container workflow

## Local Setup

```bash
npm ci
cp .env.example .env
npm run build
npm test
```

After copying `.env`, fill at least `DATABASE_URL`, `CHATWOOT_BASE_URL`, `CREDENTIALS_KEY`, and
`PUBLIC_BASE_URL`. Generate `CREDENTIALS_KEY` with:

```bash
openssl rand -hex 32
```

Do not commit `.env` or real secret values.

## Development Run

```bash
npm run dev
```

The bridge runs migrations on startup. You can also run migrations manually:

```bash
npm run migrate
```

## Tests

- Run the full suite with `npm test`.
- Some repository tests require `TEST_DATABASE_URL`; without it, they are intentionally skipped.
- If tests involving `sharp` fail to load the module, run `npm ci` again so native/optional
  dependencies are installed for the current platform, then rerun tests.
- Add tests for new behavior. Prefer pure unit tests and mock external dependencies where reasonable.

## Pull Requests

1. Branch from `main`.
2. Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`, `perf:`.
3. Run `npm run build` and `npm test` before opening the PR, or document why they are not passing.
4. Keep PRs focused; describe the problem, fix, and impact.
5. Do not include tokens, secrets, customer-data logs, or sensitive screenshots in PRs.

## Code Style

- TypeScript ESM, Node 24.
- Match the surrounding code style.
- Validate input at system boundaries and handle errors explicitly.
- Do not silently swallow errors; if an error is intentionally ignored, log it or leave a short comment.
- For docs, keep the default README in Vietnamese and update the English version when content


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
