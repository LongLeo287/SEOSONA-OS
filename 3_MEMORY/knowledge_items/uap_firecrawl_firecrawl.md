# KI: firecrawl/firecrawl

## Overview
Repository with 1083 files across 183 directories. Primary language: TypeScript (514 files).

## Tech Stack (from code)
- TypeScript (514 files)
- Java (64 files)
- Python (51 files)
- C# (37 files)
- Rust (33 files)
- **Total:** 1083 files, 183 directories
- **File types:** .ts: 514, .java: 64, .py: 51, .md: 50, .php: 46, .cs: 37, .rs: 33, .rb: 28

## Imports Detected in Source
- `@sentry/node`
- `body-parser`
- `cors`
- `dotenv`
- `express`
- `express-ws`
- `node:http`
- `node:https`
- `os`
- `response-time`
- `uuid`
- `zod`

## File Structure
```
  .gitattributes
  .gitignore
  .gitmodules
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SELF_HOST.md
  docker-compose.yaml
  .pnpm-store/
    v11/
      .pnpm-needs-build-marker
      index.db
  apps/
    api/
      .dockerignore
      .env.example
      .env.local
      .gitattributes
      .gitignore
      .prettierrc
      Dockerfile
      audit-ci.jsonc
      knip.config.ts
      openapi-v0.json
      openapi.json
      package.json
      pnpm-lock.yaml
      pnpm-workspace.yaml
      requests.http
      requests.kulala.http
      tsconfig.json
      v1-openapi.json
      vitest.config.ts
      native/
        .editorconfig
        .gitattributes
        .gitignore
        .prettierignore
        .taplo.toml
        .yarnrc.yml
        Cargo.toml
        README.md
        build.rs
        package.json
        rustfmt.toml
        tsconfig.json
        wasi-worker-browser.mjs
        .cargo/
          config.toml
        src/
          crawler.rs
          engpicker.rs
          html.rs
          lib.rs
          logging.rs
          pdf.rs
          utils.rs
          document/
            mod.rs
            model/
              mod.rs
            providers/
              doc.rs
              docx.rs
              factory.rs
              mod.rs
              odt.rs
              rtf.rs
              xlsx.rs
            renderers/
              html.rs
              mod.rs
      patches/
        node-fetch@2.7.0.patch
      requests/
        branding.requests.http
        v2/
          browser.requests.http
          crawl.requests.http
          map.requests.http
          scrape.requests.http
          search.requests.http
      samples/
        sample.docx
        sample.odt
        sample.rtf
        sample.xlsx
      scripts/
        knip-with-typescript5.cjs
      sharedLibs/
        go-html-to-md/
          .gitignore
          README.md
          go.mod
          go.sum
          html-to-markdown.go
      src/
        config.ts
    
```

## Key Source Excerpts
### apps\api\src\index.ts
```typescript
import "dotenv/config";
import { config } from "./config";
import "./services/sentry";
import { setSentryServiceTag } from "./services/sentry";
import * as Sentry from "@sentry/node";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  getGenerateLlmsTxtQueue,
  getDeepResearchQueue,
  getBillingQueue,
  getPrecrawlQueue,
} from "./services/queue-service";
import { v0Router } from "./routes/v0";
import os from "os";
import { logger } from "./lib/logger";
import { adminRouter } from "./routes/admin";
import http from "node:http";
import https from "node:https";
import { v1Router } from "./routes/v1";
import expressWs from "express-ws";
import {
  ErrorResponse,
  RequestWithMaybeACUC,
  ResponseWithSentry,
} from "./controllers/v1/types";
import { ZodError } from "zod";
import { QueueFullError } from "./lib/queue-full-error";
import { v7 as uuidv7 } from "uuid";
import { attachWsProxy } from "./services/agentLivecastWS";
import { cacheableLookup } from "./scraper/scrapeURL/lib/cacheableLookup";
import { v2Router } from "./routes/v2";
import { nuqShutdown } from "./services/worker/nuq";
import { getErrorContactMessage } from "./lib/deployment";
import { initializeBlocklist } from "./scraper/WebScraper/utils/blocklist";
import { initializeEngineForcing } from "./scraper/WebScraper/utils/engine-forcing";
import responseTime from "response-time";
import { shutdownWebhookQueue } from "./servic
```

## Agent Configuration
### AGENTS.md
Firecrawl is a web scraper API. The directory you have access to is a monorepo:
 - `apps/api` has the actual API and worker code
 - `apps/*-sdk` are various SDKs

When making changes to the API, here are the general steps you should take:
1. Write some end-to-end tests that assert your win conditions, if they don't already exist
  - 1 happy path (more is encouraged if there are multiple happy paths with significantly different code paths taken)
  - 1+ failure path(s)
  - Generally, E2E (called `snips` in the API) is always preferred over unit testing.
  - In the API, always use `scrapeTimeout` from `./lib` to set the timeout you use for scrapes.
  - These tests will be ran on a variety of configurations. You should gate tests in the following manner:
    - If it requires fire-engine: `!process.env.TEST_SUITE_SELF_HOSTED`
    - If it requires AI: `!process.env.TEST_SUITE_SELF_HOSTED || process.env.OPENAI_API_KEY || process.env.OLLAMA_BASE_URL`
2. Write code to achieve your win conditions
3. Run your tests using `pnpm harness jest ...`
  - `pnpm harness` is a command that gets the API server and workers up for you to run the tests. Don't try to `pnpm start` manually.
  - The full test suite takes a long time to run, so you should try to only execute the relevant tests locally, and let CI run the full test suite.
4. Push to a branch, open a PR, and let CI run to verify your win condition.
Keep these steps in mind while building your TODO list.

### CLAUDE.md
Firecrawl is a web scraper API. The directory you have access to is a monorepo:
 - `apps/api` has the actual API and worker code
 - `apps/*-sdk` are various SDKs

When making changes to the API, here are the general steps you should take:
1. Write some end-to-end tests that assert your win conditions, if they don't already exist
  - 1 happy path (more is encouraged if there are multiple happy paths with significantly different code paths taken)
  - 1+ failure path(s)
  - Generally, E2E (called `snips` in the API) is always preferred over unit testing.
  - In the API, always use `scrapeTimeout` from `./lib` to set the timeout you use for scrapes.
  - These tests will be ran on a variety of configurations. You should gate tests in the following manner:
    - If it requires fire-engine: `!process.env.TEST_SUITE_SELF_HOSTED`
    - If it requires AI: `!process.env.TEST_SUITE_SELF_HOSTED || process.env.OPENAI_API_KEY || process.env.OLLAMA_BASE_URL`
2. Write code to achieve your win conditions
3. Run your tests using `pnpm harness jest ...`
  - `pnpm harness` is a command that gets the API server and workers up for you to run the tests. Don't try to `pnpm start` manually.
  - The full test suite takes a long time to run, so you should try to only execute the relevant tests locally, and let CI run the full test suite.
4. Push to a branch, open a PR, and let CI run to verify your win condition.
Keep these steps in mind while building your TODO list.

Never bypass `knip` failures (e.g.

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
