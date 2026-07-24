# KI: vakra-dev/reader

## Overview
Open source, production grade web scraping engine for LLMs. Clean markdown output, ready for your agents.

## Tech Stack (from code)
- TypeScript (40 files)
- Shell (1 files)
- **Total:** 74 files, 16 directories
- **File types:** .ts: 40, .md: 17, .json: 4, .dockerignore: 1, .example: 1, .gitignore: 1, .leasotrc: 1, .nvmrc: 1

## Public API / Exports
- `ReaderClient` from `src/index.ts`
- `scrape` from `src/index.ts`
- `Scraper` from `src/index.ts`
- `crawl` from `src/index.ts`
- `Crawler` from `src/index.ts`
- `createBrowserSession` from `src/index.ts`
- `DaemonServer` from `src/index.ts`
- `DaemonClient` from `src/index.ts`
- `isDaemonRunning` from `src/index.ts`
- `getDaemonInfo` from `src/index.ts`
- `getPidFilePath` from `src/index.ts`
- `formatToMarkdown` from `src/index.ts`
- `htmlToMarkdown` from `src/index.ts`
- `formatToHTML` from `src/index.ts`
- `extractMetadata` from `src/index.ts`
- `cleanContent` from `src/index.ts`
- `isSameDomain` from `src/index.ts`
- `resolveUrl` from `src/index.ts`
- `isValidUrl` from `src/index.ts`
- `validateUrls` from `src/index.ts`
- `getUrlKey` from `src/index.ts`
- `rateLimit` from `src/index.ts`
- `createProxyUrl` from `src/index.ts`
- `parseProxyUrl` from `src/index.ts`
- `redactProxyUrl` from `src/index.ts`
- `DEFAULT_OPTIONS` from `src/index.ts`
- `isValidFormat` from `src/index.ts`
- `shouldCrawlUrl` from `src/index.ts`
- `createBrowserSession` from `src\browser-session.ts`
- `BrowserOptions` from `src\browser-types.ts`

## Dependencies
### Dependencies (from package.json)
- `@vakra-dev/supermarkdown`: ^0.0.6
- `commander`: ^12.0.0
- `dotenv`: ^17.4.1
- `fingerprint-generator`: ^2.1.82
- `fingerprint-injector`: ^2.1.82
- `linkedom`: ^0.18.12
- `p-limit`: ^4.0.0
- `pino`: ^9.0.0
- `pino-pretty`: ^13.1.3
- `playwright-core`: ^1.61.1
- `proxy-chain`: ^3.0.0
- `undici`: ^7.24.7

### Dev Dependencies
- `@types/node`: ^20.10.6
- `@typescript-eslint/eslint-plugin`: ^7.0.0
- `@typescript-eslint/parser`: ^7.0.0
- `eslint`: ^8.57.0
- `leasot`: ^13.3.0
- `prettier`: ^3.2.0
- `tsup`: ^8.5.1
- `typescript`: ^5.3.3
- `vitest`: ^4.1.0

## Imports Detected in Source
- `child_process`
- `crypto`
- `fingerprint-generator`
- `fingerprint-injector`
- `fs`
- `linkedom`
- `os`
- `p-limit`
- `path`
- `playwright`
- `proxy-chain`
- `readline`
- `tsup`
- `vitest`

## Available Commands
- `npm run start` -- `node dist/cli/index.js`
- `npm run daemon` -- `node dist/cli/index.js start --port 6003`
- `npm run lint` -- `eslint src/`
- `npm run lint:fix` -- `eslint src/ --fix`
- `npm run format` -- `prettier --write 'src/**/*.ts'`
- `npm run format:check` -- `prettier --check 'src/**/*.ts'`
- `npm run todo` -- `leasot 'src/**/*.ts'`
- `npm run test` -- `vitest run`
- `npm run test:watch` -- `vitest`
- `npm run typecheck` -- `tsc --noEmit`
- `npm run build` -- `tsup`
- `npm run build:tsc` -- `tsc`

## File Structure
```
  .dockerignore
  .env.example
  .eslintrc.json
  .gitignore
  .leasotrc
  .nvmrc
  .prettierrc
  CITATION.cff
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  package-lock.json
  package.json
  result.md
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  docs/
    api-reference.md
    architecture.md
    getting-started.md
    troubleshooting.md
    assets/
      .gitkeep
      demo.gif
      demo.tape
      logo.png
    deployment/
      docker.md
      job-queues.md
      production-server.md
    guides/
      browser-pool.md
      browser-sessions.md
      cloudflare-bypass.md
      output-formats.md
      proxy-configuration.md
  scripts/
    release.sh
  src/
    browser-session.ts
    browser-types.ts
    client.ts
    crawl-types.ts
    crawler.ts
    errors.ts
    index.ts
    scraper.ts
    types.ts
    browser/
      playwright-pool.ts
      shared.ts
    cli/
      index.ts
    config/
      domain-profiles.ts
    daemon/
      client.ts
      index.ts
      server.ts
    engines/
      errors.ts
      index.ts
      orchestrator.ts
      types.ts
      playwright/
        index.ts
    formatters/
      html.ts
      index.ts
      markdown.ts
      postprocess.ts
    proxy/
      config.ts
      env.ts
      health-tracker.ts
      proxy-gate.ts
      verify.ts
    utils/
      block-detector.ts
      content-cleaner.ts
      logger.ts
      metadata-extractor.ts
      rate-limiter.ts
      robots-parser.ts
      url-helpers.ts
      url-rewriter.ts
```

## Key Source Excerpts
### src/index.ts
```typescript
/**
 * @vakra-dev/reader
 *
 * Production-grade web scraping engine for LLMs.
 * Clean markdown output, ready for your agents.
 */

// =============================================================================
// Main API exports
// =============================================================================
export { ReaderClient } from "./client";
export type { ReaderClientOptions, ProxyRotation } from "./client";
export { scrape, Scraper } from "./scraper";
export { crawl, Crawler } from "./crawler";
export { createBrowserSession } from "./browser-session";
export type { BrowserOptions, BrowserSession } from "./browser-types";

// =============================================================================
// Daemon exports
// =============================================================================
export {
  DaemonServer,
  DaemonClient,
  isDaemonRunning,
  getDaemonInfo,
  getPidFilePath,
  DEFAULT_DAEMON_PORT,
} from "./daemon";
export type { DaemonServerOptions, DaemonClientOptions, DaemonStatus } from "./daemon";

// =============================================================================
// Type exports
// =============================================================================
export type {
  ScrapeOptions,
  ScrapeResult,
  WebsiteScrapeResult,
  BatchMetadata,
  Page,
  WebsiteMetadata,
  ProxyConfig,
  ProxyMetadata,
  ProxyPoolConfig,
  ProxyTier,
  BrowserPoolConfig,
} from "./types";

export type { CrawlOptions, CrawlResult, CrawlUrl, Crawl
```

### src\browser-session.ts
```typescript
/**
 * Browser Session
 *
 * Launches a Chrome instance directly and returns a CDP WebSocket URL.
 * For authenticated proxies, proxy-chain handles auth transparently
 * without breaking the TLS chain.
 *
 * Architecture:
 * - 1 Chrome process per session
 * - proxy-chain for authenticated proxy tunneling (no TLS breakage)
 * - Clean lifecycle: close = kill processes, done
 *
 * @example
 * ```typescript
 * const session = await createBrowserSession({ verbose: true });
 * const browser = await chromium.connectOverCDP(session.wsEndpoint);
 * const page = (await browser.newContext()).newPage();
 * await page.goto('https://example.com');
 * await session.close();
 * ```
 */

import { spawn } from "child_process";
import { createInterface } from "readline";
import { randomUUID } from "crypto";
import { mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { Server as ProxyChainServer } from "proxy-chain";
import { FingerprintGenerator } from "fingerprint-generator";
import { FingerprintInjector } from "fingerprint-injector";
import { createProxyUrl } from "./proxy/config";
import { createLogger } from "./utils/logger";
import {
  findChromePath,
  buildChromeArgs,
  createProxyTunnel,
  CHROME_LAUNCH_TIMEOUT_MS,
} from "./browser/shared";
import type { BrowserSession, BrowserSessionInternalOptions } from "./browser-types";

const logger = createLogger("browser-session");

const DEFAULT_SESSION_TIMEOUT_MS = 300_000; // 5 minutes

//
```

### src\browser-types.ts
```typescript
import type { ProxyConfig, ProxyTier } from "./types";

/**
 * Options for creating a browser session.
 *
 * A browser session launches a Chrome instance and returns a CDP WebSocket
 * URL. Users connect Playwright/Puppeteer via `chromium.connectOverCDP(wsEndpoint)`
 * and get anti-bot protections (WebRTC masking, proxy routing, stealth scripts).
 */
export interface BrowserOptions {
  /** Proxy configuration (single proxy — use proxyTier for pool-based) */
  proxy?: ProxyConfig;

  /** Proxy tier selection: "standard" (default) or "premium" */
  proxyTier?: ProxyTier;

  /** Show Chrome browser window (default: false) */
  showChrome?: boolean;

  /**
   * Maximum session lifetime in milliseconds (default: 300000 = 5 min).
   * Session auto-closes after this duration.
   */
  timeoutMs?: number;

  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/**
 * An active browser session with a CDP WebSocket endpoint.
 *
 * Connect to `wsEndpoint` using Playwright or Puppeteer:
 *
 * @example
 * ```typescript
 * import { chromium } from 'playwright';
 *
 * const session = await reader.browser({ proxyTier: 'premium' });
 * const browser = await chromium.connectOverCDP(session.wsEndpoint);
 * const page = browser.contexts()[0].pages()[0];
 *
 * await page.goto('https://example.com');
 * console.log(await page.title());
 *
 * await session.close();
 * ```
 */
export interface BrowserSession {
  /** Unique session identifier */
  sessionId: string;

  /** CDP WebSoc
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `scrap`, `crawl`, `playwright`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
