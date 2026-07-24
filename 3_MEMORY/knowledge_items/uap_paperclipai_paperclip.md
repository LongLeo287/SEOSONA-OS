# KI: paperclipai/paperclip

## Overview
Repository with 2602 files across 358 directories. Primary language: TypeScript (1282 files).

## Tech Stack (from code)
- TypeScript (1282 files)
- TypeScript (React) (490 files)
- Shell (25 files)
- Go (3 files)
- **Total:** 2602 files, 358 directories
- **File types:** .ts: 1282, .tsx: 490, .md: 298, .json: 182, .sql: 114, .png: 81, .mjs: 39, .sh: 25

## Public API / Exports
- `ADAPTER_SESSION_MANAGEMENT` from `packages\adapter-utils\src\index.ts`
- `LEGACY_SESSIONED_ADAPTER_TYPES` from `packages\adapter-utils\src\index.ts`
- `getAdapterSessionManagement` from `packages\adapter-utils\src\index.ts`
- `readSessionCompactionOverride` from `packages\adapter-utils\src\index.ts`
- `resolveSessionCompactionPolicy` from `packages\adapter-utils\src\index.ts`
- `REDACTED_HOME_PATH_USER` from `packages\adapter-utils\src\index.ts`
- `redactHomePathUserSegments` from `packages\adapter-utils\src\index.ts`
- `redactHomePathUserSegmentsInValue` from `packages\adapter-utils\src\index.ts`
- `redactTranscriptEntryPaths` from `packages\adapter-utils\src\index.ts`
- `REDACTED_COMMAND_TEXT_VALUE` from `packages\adapter-utils\src\index.ts`
- `redactCommandText` from `packages\adapter-utils\src\index.ts`
- `buildSandboxNpmInstallCommand` from `packages\adapter-utils\src\index.ts`
- `createRuntimeProgressReporter` from `packages\adapter-utils\src\index.ts`
- `inferOpenAiCompatibleBiller` from `packages\adapter-utils\src\index.ts`
- `createDb` from `packages\db\src\index.ts`
- `getPostgresDataDirectory` from `packages\db\src\index.ts`
- `ensurePostgresDatabase` from `packages\db\src\index.ts`
- `inspectMigrations` from `packages\db\src\index.ts`
- `applyPendingMigrations` from `packages\db\src\index.ts`
- `getEmbeddedPostgresTestSupport` from `packages\db\src\index.ts`
- `startEmbeddedPostgresTestDatabase` from `packages\db\src\index.ts`
- `type EmbeddedPostgresTestDatabase` from `packages\db\src\index.ts`
- `type EmbeddedPostgresTestSupport` from `packages\db\src\index.ts`
- `runDatabaseBackup` from `packages\db\src\index.ts`
- `runDatabaseRestore` from `packages\db\src\index.ts`
- `formatDatabaseBackupResult` from `packages\db\src\index.ts`
- `type BackupRetentionPolicy` from `packages\db\src\index.ts`
- `type RunDatabaseBackupOptions` from `packages\db\src\index.ts`
- `createEmbeddedPostgresLogBuffer` from `packages\db\src\index.ts`
- `formatEmbeddedPostgresError` from `packages\db\src\index.ts`

## Imports Detected in Source
- `@modelcontextprotocol/sdk`
- `vitest`

## File Structure
```
  .dockerignore
  .env.example
  .gitignore
  .mailmap
  .npmrc
  AGENTS.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  ROADMAP.md
  SECURITY.md
  adapter-plugin.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.base.json
  tsconfig.json
  vitest.config.ts
  .agents/
    skills/
      company-creator/
        SKILL.md
        references/
          companies-spec.md
          example-company.md
          from-repo-guide.md
      create-agent-adapter/
        SKILL.md
      create-issue-interaction-ui/
        SKILL.md
      deal-with-security-advisory/
        SKILL.md
      diagnose-why-work-stopped/
        SKILL.md
      doc-maintenance/
        SKILL.md
        references/
          audit-checklist.md
          section-map.md
      paperclip-create-plugin/
        SKILL.md
      paperclip-dev-workspace-run-verify-fix/
        SKILL.md
      pr-report/
        SKILL.md
        assets/
          html-report-starter.html
        references/
          style-guide.md
      prcheckloop/
        SKILL.md
      release/
        SKILL.md
      release-changelog/
        SKILL.md
      release-changelog-discord-message/
        SKILL.md
      terminal-bench-loop/
        SKILL.md
  .claude/
    skills/
      company-creator
      paperclip
      design-guide/
        SKILL.md
        references/
          component-index.md
  cli/
    CHANGELOG.md
    README.md
    esbuild.config.mjs
    package.json
    tsconfig.json
    vitest.config.ts
    src/
      index.ts
      telemetry.ts
      version.ts
      adapters/
        index.ts
        registry.ts
        http/
          format-event.ts
          index.ts
        process/
          format-event.ts
          index.ts
      checks/
        agent-jwt-secret-check.ts
        config-check.ts
        database-check.ts
        deployment-auth-check.ts
        index.ts
        llm-check.ts
        log-check.ts
        path-resolver.ts
        port-check.ts
        secrets-check.ts
        storage-che
```

## Key Source Excerpts
### packages\adapter-utils\src\index.ts
```typescript
export type {
  AdapterAgent,
  AdapterRuntime,
  UsageSummary,
  AdapterBillingType,
  AdapterRuntimeServiceReport,
  AdapterExecutionResult,
  AdapterInvocationMeta,
  AdapterExecutionContext,
  AdapterEnvironmentCheckLevel,
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestStatus,
  AdapterEnvironmentTestResult,
  AdapterEnvironmentTestContext,
  AdapterSkillSyncMode,
  AdapterSkillState,
  AdapterSkillOrigin,
  AdapterSkillEntry,
  AdapterSkillSnapshot,
  AdapterSkillContext,
  AdapterSessionCodec,
  AdapterModel,
  AdapterModelProfileKey,
  AdapterModelProfileDefinition,
  HireApprovedPayload,
  HireApprovedHookResult,
  ConfigFieldOption,
  ConfigFieldSchema,
  AdapterConfigSchema,
  AdapterRuntimeCommandSpec,
  ServerAdapterModule,
  QuotaWindow,
  ProviderQuotaResult,
  TranscriptEntry,
  StdoutLineParser,
  CLIAdapterModule,
  CreateConfigValues,
} from "./types.js";
export type {
  SessionCompactionPolicy,
  NativeContextManagement,
  AdapterSessionManagement,
  ResolvedSessionCompactionPolicy,
} from "./session-compaction.js";
export {
  ADAPTER_SESSION_MANAGEMENT,
  LEGACY_SESSIONED_ADAPTER_TYPES,
  getAdapterSessionManagement,
  readSessionCompactionOverride,
  resolveSessionCompactionPolicy,
  hasSessionCompactionThresholds,
} from "./session-compaction.js";
export {
  REDACTED_HOME_PATH_USER,
  redactHomePathUserSegments,
  redactHomePathUserSegmentsInValue,
  redactTranscriptEntryPaths,
} from "./log-redaction.js";
export {
  REDACTED_COMMAND_TEXT_VALUE,
  re
```

### packages\db\src\index.ts
```typescript
export {
  createDb,
  getPostgresDataDirectory,
  ensurePostgresDatabase,
  inspectMigrations,
  applyPendingMigrations,
  reconcilePendingMigrationHistory,
  type MigrationState,
  type MigrationHistoryReconcileResult,
  migratePostgresIfEmpty,
  type MigrationBootstrapResult,
  type Db,
} from "./client.js";
export {
  getEmbeddedPostgresTestSupport,
  startEmbeddedPostgresTestDatabase,
  type EmbeddedPostgresTestDatabase,
  type EmbeddedPostgresTestSupport,
} from "./test-embedded-postgres.js";
export {
  runDatabaseBackup,
  runDatabaseRestore,
  formatDatabaseBackupResult,
  type BackupRetentionPolicy,
  type RunDatabaseBackupOptions,
  type RunDatabaseBackupResult,
  type RunDatabaseRestoreOptions,
} from "./backup-lib.js";
export {
  createEmbeddedPostgresLogBuffer,
  formatEmbeddedPostgresError,
} from "./embedded-postgres-error.js";
export {
  ensureLinuxSharedLibraryAliases,
  prepareEmbeddedPostgresNativeRuntime,
} from "./embedded-postgres-native.js";
export { issueRelations } from "./schema/issue_relations.js";
export { issueReferenceMentions } from "./schema/issue_reference_mentions.js";
export * from "./schema/index.js";

```

### packages\mcp-server\src\index.ts
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PaperclipApiClient } from "./client.js";
import { readConfigFromEnv, type PaperclipMcpConfig } from "./config.js";
import { createToolDefinitions } from "./tools.js";

export function createPaperclipMcpServer(config: PaperclipMcpConfig = readConfigFromEnv()) {
  const server = new McpServer({
    name: "paperclip",
    version: "0.1.0",
  });

  const client = new PaperclipApiClient(config);
  const tools = createToolDefinitions(client);
  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.schema.shape, tool.execute);
  }

  return {
    server,
    tools,
    client,
  };
}

export async function runServer(config: PaperclipMcpConfig = readConfigFromEnv()) {
  const { server } = createPaperclipMcpServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

```

## Agent Configuration
### AGENTS.md
# AGENTS.md

Guidance for human and AI contributors working in this repository.

## 1. Purpose

Paperclip is a control plane for AI-agent companies.
The current implementation target is V1 and is defined in `doc/SPEC-implementation.md`.

## 2. Read This First

Before making changes, read in this order:

1. `doc/GOAL.md`
2. `doc/PRODUCT.md`
3. `doc/SPEC-implementation.md`
4. `doc/DEVELOPING.md`
5. `doc/DATABASE.md`

`doc/SPEC.md` is long-horizon product context.
`doc/SPEC-implementation.md` is the concrete V1 build contract.

## 3. Repo Map

- `server/`: Express REST API and orchestration services
- `ui/`: React + Vite board UI
- `packages/db/`: Drizzle schema, migrations, DB clients
- `packages/shared/`: shared types, constants, validators, API path constants
- `packages/adapters/`: agent adapter implementations (Claude, Codex, Cursor, etc.)
- `packages/adapter-utils/`: shared adapter utilities
- `packages/plugins/`: plugin system packages
- `doc/`: operational and product docs

## 4. Dev Setup (Auto DB)

Use embedded PGlite in dev by leaving `DATABASE_URL` unset.

```sh
pnpm install
pnpm dev
```

This starts:

- API: `http://localhost:3100`
- UI: `http://localhost:3100` (served by API server in dev middleware mode)

Quick checks:

```sh
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

Reset local dev DB:

```sh
rm -rf data/pglite
pnpm dev
```

## 5. Core Engineering Rules

1. Keep changes company-scoped.
Every domain entity should be scoped

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
