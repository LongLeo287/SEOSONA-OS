# KI: upstash/context7

## Overview
Context7 monorepo - Documentation tools and SDKs

## Tech Stack (from code)
- TypeScript (80 files)
- JavaScript (6 files)
- **Total:** 342 files, 115 directories
- **File types:** .ts: 80, .png: 75, .mdx: 72, .md: 52, .json: 31, .js: 6, .svg: 5, .prettierignore: 3

## Public API / Exports
- `Context7Agent` from `packages\tools-ai-sdk\src\index.ts`
- `type Context7AgentConfig` from `packages\tools-ai-sdk\src\index.ts`
- `resolveLibraryId` from `packages\tools-ai-sdk\src\index.ts`
- `queryDocs` from `packages\tools-ai-sdk\src\index.ts`
- `type Context7ToolsConfig` from `packages\tools-ai-sdk\src\index.ts`
- `SYSTEM_PROMPT` from `packages\tools-ai-sdk\src\index.ts`
- `AGENT_PROMPT` from `packages\tools-ai-sdk\src\index.ts`
- `RESOLVE_LIBRARY_ID_DESCRIPTION` from `packages\tools-ai-sdk\src\index.ts`
- `QUERY_DOCS_DESCRIPTION` from `packages\tools-ai-sdk\src\index.ts`

## Dependencies
### Dependencies (from package.json)
- `@inquirer/core`: ^11.1.1
- `@inquirer/type`: ^4.0.3

### Dev Dependencies
- `@changesets/cli`: ^2.29.8
- `@types/node`: ^25.0.3
- `@typescript-eslint/eslint-plugin`: ^8.28.0
- `@typescript-eslint/parser`: ^8.28.0
- `eslint`: ^9.34.0
- `eslint-config-prettier`: ^10.1.1
- `eslint-plugin-prettier`: ^5.2.5
- `prettier`: ^3.6.2
- `typescript`: ^5.8.2
- `typescript-eslint`: ^8.28.0

## Imports Detected in Source
- `@agents`
- `@modelcontextprotocol/sdk`
- `@prompts`
- `@tools`
- `@upstash/context7-sdk`
- `async_hooks`
- `commander`
- `eslint-plugin-prettier`
- `express`
- `figlet`
- `node:crypto`
- `picocolors`
- `typescript-eslint`
- `zod`

## Available Commands
- `npm run build` -- `pnpm -r run build`
- `npm run build:sdk` -- `pnpm --filter @upstash/context7-sdk build`
- `npm run build:mcp` -- `pnpm --filter @upstash/context7-mcp build`
- `npm run build:ai-sdk` -- `pnpm --filter @upstash/context7-tools-ai-sdk build`
- `npm run typecheck` -- `pnpm -r run typecheck`
- `npm run test` -- `pnpm -r run test`
- `npm run test:sdk` -- `pnpm --filter @upstash/context7-sdk test`
- `npm run test:tools-ai-sdk` -- `pnpm --filter @upstash/context7-tools-ai-sdk test`
- `npm run clean` -- `pnpm -r run clean && rm -rf node_modules`
- `npm run lint` -- `pnpm -r run lint`
- `npm run lint:check` -- `pnpm -r run lint:check`
- `npm run format` -- `pnpm -r run format`

## File Structure
```
  .env.example
  .gitignore
  .prettierignore
  LICENSE
  README.md
  SECURITY.md
  eslint.config.js
  gemini-extension.json
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  prettier.config.mjs
  server.json
  tsconfig.json
  .agents/
    plugins/
      marketplace.json
  .claude-plugin/
    marketplace.json
  docs/
    adding-libraries.mdx
    api-guide.mdx
    contact.mdx
    docs.json
    enterprise.mdx
    installation.mdx
    library-owners.mdx
    library-updates.mdx
    openapi-enterprise.json
    openapi.json
    overview.mdx
    plans-pricing.mdx
    tips.mdx
    agentic-tools/
      overview.mdx
      ai-sdk/
        getting-started.mdx
        agents/
          context7-agent.mdx
        tools/
          query-docs.mdx
          resolve-library-id.mdx
    clients/
      claude-code.mdx
      cli.mdx
      codex.mdx
      copilot-cli.mdx
      cursor.mdx
      opencode.mdx
      pi.mdx
      vscode.mdx
    enterprise/
      backup-restore.mdx
      gitops.mdx
      library-import.mdx
      on-premise.mdx
      api/
        authentication.mdx
        context/
          get-documentation-context.mdx
        parse/
          get-parse-status.mdx
          parse-a-git-repository.mdx
          parse-a-website.mdx
          parse-an-openapi-spec-by-url.mdx
          refresh-a-library.mdx
          upload-an-openapi-spec-file.mdx
        search/
          search-for-libraries.mdx
      deployment/
        docker.mdx
        kubernetes.mdx
      enterprise-managed-auth/
        entra.mdx
        okta.mdx
      integrations/
        confluence.mdx
        github.mdx
      security/
        entra-sso.mdx
        oidc-sso.mdx
    howto/
      api-keys.mdx
      chat-widget.mdx
      claiming-libraries.mdx
      oauth.mdx
      policies.mdx
      private-sources.mdx
      rules.mdx
      teamspace.mdx
      usage.mdx
      verification.mdx
    images/
      on-premise-architecture.png
      clients/
        claude-code/
          mcp-details.png
          mcp-l
```

## Key Source Excerpts
### packages\cli\src\index.ts
```typescript
import { Command } from "commander";
import pc from "picocolors";
import figlet from "figlet";
import { registerSkillCommands, registerSkillAliases } from "./commands/skill.js";
import { registerAuthCommands, setAuthBaseUrl } from "./commands/auth.js";
import { registerSetupCommand } from "./commands/setup.js";
import { registerRemoveCommand } from "./commands/remove.js";
import { registerDocsCommands } from "./commands/docs.js";
import { maybeShowUpgradeNotice, registerUpgradeCommand } from "./commands/upgrade.js";
import { setBaseUrl } from "./utils/api.js";
import { VERSION } from "./constants.js";

const brand = {
  primary: pc.green,
  dim: pc.dim,
};

const program = new Command();

program
  .name("ctx7")
  .description("Context7 CLI - Fetch documentation context and configure Context7")
  .version(VERSION, "-v, --version")
  .option("--base-url <url>")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.baseUrl) {
      setBaseUrl(opts.baseUrl);
      setAuthBaseUrl(opts.baseUrl);
    }
  })
  .hook("preAction", async (_thisCommand, actionCommand) => {
    await maybeShowUpgradeNotice({
      actionName: actionCommand.name(),
      argv: process.argv,
    });
  })
  .addHelpText(
    "after",
    `
Examples:
  ${brand.dim("# Configure Context7 for your coding agent")}
  ${brand.primary("npx ctx7 setup")}
  ${brand.primary("npx ctx7 setup --mcp")}
  ${brand.primary("npx ctx7 setup --cli")}

  ${brand.dim("# Remove Context7 setup")}
```

### packages\mcp\src\index.ts
```typescript
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";
import { searchLibraries, fetchLibraryContext } from "./lib/api.js";
import type { ClientContext } from "./lib/types.js";
import { formatSearchResults, extractClientInfoFromUserAgent } from "./lib/utils.js";
import { isJWT, validateJWT } from "./lib/jwt.js";
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { Command } from "commander";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "node:crypto";
import { createSessionStore } from "./lib/sessionStore.js";
import {
  SERVER_VERSION,
  RESOURCE_URL,
  AUTH_SERVER_URL,
  OPENAI_APPS_CHALLENGE_TOKEN,
} from "./lib/constants.js";
import { maybeElicitAuthSignIn } from "./lib/auth/auth-prompt.js";
import { getClientIp } from "./lib/client-ip.js";

/** Default HTTP server port */
const DEFAULT_PORT = 3000;

// Parse CLI arguments using commander
const program = new Command()
  .version(SERVER_VERSION, "-v, --version", "output 
```

### packages\tools-ai-sdk\src\index.ts
```typescript
// Agents
export { Context7Agent, type Context7AgentConfig } from "@agents";

// Tools
export { resolveLibraryId, queryDocs, type Context7ToolsConfig } from "@tools";

// Prompts
export {
  SYSTEM_PROMPT,
  AGENT_PROMPT,
  RESOLVE_LIBRARY_ID_DESCRIPTION,
  QUERY_DOCS_DESCRIPTION,
} from "@prompts";

// Re-export useful types from SDK
export type {
  Context7Config,
  Library,
  Documentation,
  GetContextOptions,
} from "@upstash/context7-sdk";

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 28}
