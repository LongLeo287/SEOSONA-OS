# KI: pingcap/ossinsight

## Overview
Repository with 2427 files across 932 directories. Primary language: TypeScript (593 files).

## Tech Stack (from code)
- TypeScript (593 files)
- TypeScript (React) (261 files)
- Ruby (105 files)
- JavaScript (21 files)
- **Total:** 2427 files, 932 directories
- **File types:** .ts: 593, .json: 444, .sql: 430, .tsx: 261, .png: 211, .yml: 155, .rb: 105, .mdx: 46

## Public API / Exports
- `ExplorerService` from `packages\api-server\src\index.ts`
- `BotService` from `packages\api-server\src\index.ts`
- `CollectionService` from `packages\api-server\src\index.ts`
- `QueryRunner` from `packages\api-server\src\index.ts`
- `QueryLoader` from `packages\api-server\src\index.ts`
- `QueryLegacyParser` from `packages\api-server\src\index.ts`
- `Params` from `packages\api-server\src\index.ts`
- `ConditionalRefreshCrons` from `packages\api-server\src\index.ts`
- `QuerySchema` from `packages\api-server\src\index.ts`
- `getPlaygroundSessionLimits` from `packages\api-server\src\index.ts`
- `TiDBQueryExecutor` from `packages\api-server\src\index.ts`
- `TiDBPlaygroundQueryExecutor` from `packages\api-server\src\index.ts`
- `CacheProviderTypes` from `packages\api-server\src\index.ts`
- `default` from `packages\api-server\src\index.ts`
- `PromptManager` from `packages\api-server\src\index.ts`
- `tidbWaitConnectionHistogram` from `packages\api-server\src\index.ts`
- `tidbQueryHistogram` from `packages\api-server\src\index.ts`
- `tidbQueryCounter` from `packages\api-server\src\index.ts`
- `shadowTidbWaitConnectionHistogram` from `packages\api-server\src\index.ts`
- `shadowTidbQueryHistogram` from `packages\api-server\src\index.ts`
- `Options` from `packages\prefetch\src\index.ts`
- `default` from `packages\site-shell\src\index.ts`
- `RealtimeSummary` from `packages\site-shell\src\index.ts`
- `HeaderAnalyzeSelector` from `packages\site-shell\src\index.ts`
- `logger` from `packages\sync-github-data\src\index.ts`
- `QuerySchema` from `packages\types\src\index.ts`
- `Params` from `packages\types\src\index.ts`
- `ConditionalRefreshCrons` from `packages\types\src\index.ts`
- `PersistConfig` from `packages\types\src\index.ts`

## Dependencies

### Dev Dependencies
- `turbo`: ^2.7.1
- `typescript`: ^5.2.2

## Imports Detected in Source
- `@commands/repos`
- `@commands/users`
- `@env`
- `@ossinsight/api-server`
- `@ossinsight/types`
- `commander`
- `cron`
- `env-schema`
- `http`
- `mysql2`
- `prom-client`
- `reflect-metadata`

## Available Commands
- `npm run build` -- `turbo run build`
- `npm run dev` -- `pnpm --filter web dev`
- `npm run dev:web` -- `pnpm --filter web dev`
- `npm run dev:all` -- `turbo run dev --filter=web --filter=docs`
- `npm run dev:docs` -- `turbo run dev --filter=docs`
- `npm run start` -- `pnpm --filter web start`
- `npm run start:web` -- `pnpm --filter web start`
- `npm run start:all` -- `turbo run start --filter=web --filter=docs`
- `npm run start:docs` -- `turbo run start --filter=docs`
- `npm run lint` -- `turbo run lint`
- `npm run check-types` -- `turbo run check-types`

## File Structure
```
  .gitignore
  .npmrc
  CONTRIBUTING.md
  LICENSE
  NOTE.md
  README.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  .claude/
    settings.json
  apps/
    docs/
      mdx-components.tsx
      next.config.mjs
      package.json
      postcss.config.js
      source.config.ts
      tsconfig.json
      .source/
        browser.ts
        dynamic.ts
        server.ts
        source.config.mjs
      app/
        globals.css
        layout.tsx
        page.tsx
        robots.ts
        sitemap.ts
        api/
          search/
            route.ts
        blog/
          layout.tsx
          page.tsx
          [slug]/
            page.tsx
          feed.xml/
            route.ts
        docs/
          layout.tsx
          [[...slug]]/
            page.tsx
          api/
            page.tsx
            [slug]/
              page.tsx
        llms-full.txt/
          route.ts
        llms.mdx/
          api/
            route.ts
            [slug]/
              route.ts
          docs/
            [[...slug]]/
              route.ts
      components/
        breadcrumb.tsx
        header-extras.tsx
        json-ld.tsx
        query-provider.tsx
        share-buttons.tsx
        shared-site-header.tsx
      content/
        blog/
          agent-memory-race-2026/
            index.mdx
          agent-native-cli-wave-2026/
            index.mdx
          agent-skills-explosion-2026/
            index.mdx
          ai-powered-seo-and-ux-improvements-2026/
            index.md
          autoresearch-overnight-ai-scientist/
            index.mdx
          chat2query-tutorials/
            index.mdx
          coding-agent-wars-2026/
            index.mdx
          deep-insight-into-js-framework-2021/
            index.mdx
          deep-insight-into-lowcode-development-tools-2021/
            index.mdx
          deep-insight-into-open-source-databases/
            index.mdx
          deep-insight-into-programming-languages-2021/
            index.mdx
   
```

## Key Source Excerpts
### packages\api-server\src\index.ts
```typescript
export { ExplorerService } from './plugins/services/explorer-service';
export { BotService } from './plugins/services/bot-service';
export { CollectionService } from './plugins/services/collection-service';

export { QueryRunner } from './core/runner/query/QueryRunner';
export { QueryLoader } from './core/runner/query/QueryLoader';
export { QueryLegacyParser } from './core/runner/query/QueryLegacyParser';

export { Params, ConditionalRefreshCrons, QuerySchema } from '@ossinsight/types';

export * from './plugins/services/explorer-service/types';
export { getPlaygroundSessionLimits } from './core/playground/limitation';
export { TiDBQueryExecutor } from './core/executor/query-executor/TiDBQueryExecutor';
export { TiDBPlaygroundQueryExecutor } from './core/executor/query-executor/TiDBPlaygroundQueryExecutor';
export { CacheProviderTypes, default as CacheBuilder } from './core/cache/CacheBuilder';
export { PromptManager } from './plugins/services/bot-service/prompt/prompt-manager';

export {
  tidbWaitConnectionHistogram,
  tidbQueryHistogram,
  tidbQueryCounter,
  shadowTidbWaitConnectionHistogram,
  shadowTidbQueryHistogram,
  shadowTidbQueryCounter,
  cacheHitCounter,
  cacheQueryHistogram,
  metricsPrefix,
  presetQueryCounter,
  presetQueryTimer,
  readConfigTimer,
  githubAPITimer,
  githubAPICounter,
  openaiAPITimer,
  openaiAPICounter
} from './metrics';
```

### packages\prefetch\src\index.ts
```typescript
import {
  CacheBuilder, cacheHitCounter, cacheQueryHistogram,
  CollectionService,
  QueryLoader,
  QueryRunner, shadowTidbQueryCounter, shadowTidbQueryHistogram, shadowTidbWaitConnectionHistogram, tidbQueryCounter,
  TiDBQueryExecutor, tidbQueryHistogram, tidbWaitConnectionHistogram
} from "@ossinsight/api-server";
import {Command} from "commander";
import {CronJob} from 'cron';
import envSchema from "env-schema";
import * as http from "http";
import {Pool} from "mysql2/promise";
import {collectDefaultMetrics, Registry} from "prom-client";
import {AppConfig, PrefetchEnvSchema} from "./env";
import {JobExecutor} from "./job/executor";
import {JobGenerator} from "./job/generator";
import {JobScheduler} from "./job/scheduler";
import {prefetchQueryCounter, prefetchQueryHistogram, queueWaitsGauge} from "./metrics";
import {createTiDBPool} from "./utils/db";

const logger = require('./logger');

// Load environments.
const config: AppConfig = envSchema({
  schema: PrefetchEnvSchema,
  dotenv: true,
});

export interface Options {
  onlyPrefetch?: string;
  onlyParams?: Record<string, any>;
  once: boolean;
}

async function main() {
  const program = new Command();
  program.name('prefetch')
    .description('Prefetch will responsible for generating and scheduling pre-querying jobs.')
    .option<string>(
      '--only-prefetch <string>',
      'Only prefetch the specified query.',
      (value) => String(value)
    )
    .option<Record<string, any>>(
      '--only-params <param
```

### packages\site-shell\src\index.ts
```typescript
export * from './site-header';
export * from './site-links';
export * from './nav-link';
export * from './types';
export { default as ExploreIcon } from './explore-icon';
export { RealtimeSummary } from './realtime-summary';
export { HeaderAnalyzeSelector } from './header-search';

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
