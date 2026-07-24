# KI: kaitranntt/ccs

## Overview
Repository with 1399 files across 170 directories. Primary language: TypeScript (869 files).

## Tech Stack (from code)
- TypeScript (869 files)
- TypeScript (React) (274 files)
- JavaScript (15 files)
- Shell (14 files)
- **Total:** 1399 files, 170 directories
- **File types:** .ts: 869, .tsx: 274, .md: 39, .png: 34, .json: 31, .swift: 31, .svg: 23, .js: 15

## Public API / Exports
- `ExtractedOption` from `src\commands\arg-extractor.ts`
- `ExtractOptionOptions` from `src\commands\arg-extractor.ts`
- `ScanCommandArgsOptions` from `src\commands\arg-extractor.ts`
- `ScannedCommandArgs` from `src\commands\arg-extractor.ts`
- `extractOption` from `src\commands\arg-extractor.ts`
- `handleCliproxyCommand` from `src\commands\cliproxy-command.ts`
- `parseSyncArgs` from `src\commands\cliproxy-sync-handler.ts`
- `handleSync` from `src\commands\cliproxy-sync-handler.ts`
- `HelpTopicName` from `src\commands\command-catalog.ts`
- `HelpTopicEntry` from `src\commands\command-catalog.ts`
- `RootCommandEntry` from `src\commands\command-catalog.ts`
- `ShortcutEntry` from `src\commands\command-catalog.ts`
- `ROOT_HELP_TOPICS` from `src\commands\command-catalog.ts`
- `ROOT_COMMAND_CATALOG` from `src\commands\command-catalog.ts`
- `CommandExecutionContract` from `src\commands\command-execution-contract.ts`
- `runCommandWithContract` from `src\commands\command-execution-contract.ts`
- `CompletionSuggestion` from `src\commands\completion-backend.ts`
- `parseChannelsCommandArgs` from `src\commands\config-channels-command.ts`
- `ConfigCommandOptions` from `src\commands\config-command-options.ts`
- `ConfigCommandParseResult` from `src\commands\config-command-options.ts`
- `parseConfigCommandArgs` from `src\commands\config-command-options.ts`
- `showConfigCommandHelp` from `src\commands\config-command-options.ts`
- `DEFAULT_DASHBOARD_HOST` from `src\commands\config-dashboard-host.ts`
- `DashboardUrls` from `src\commands\config-dashboard-host.ts`
- `isLoopbackHost` from `src\commands\config-dashboard-host.ts`
- `isWildcardHost` from `src\commands\config-dashboard-host.ts`
- `normalizeDashboardHost` from `src\commands\config-dashboard-host.ts`
- `resolveDashboardUrls` from `src\commands\config-dashboard-host.ts`
- `parseThinkingCommandArgs` from `src\commands\config-thinking-command.ts`
- `parseThinkingOverrideInput` from `src\commands\config-thinking-command.ts`

## Imports Detected in Source
- `fs`
- `get-port`
- `open`
- `os`
- `path`

## File Structure
```
  .dockerignore
  .gitignore
  .gitmodules
  .npmignore
  .pr_agent.toml
  .prettierignore
  .prettierrc
  .releaserc.cjs
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  bun.lock
  bunfig.toml
  commitlint.config.cjs
  eslint.config.mjs
  package.json
  tsconfig.json
  .claude/
    commands/
      ccs.md
      ccs/
        continue.md
    skills/
      ccs-delegation/
        CLAUDE.md.template
        SKILL.md
        references/
          troubleshooting.md
  assets/
    ccs-logo-medium.png
    ccs-logo-zoomed-web.png
    screenshots/
      analytics.webp
      api-profiles-openrouter.webp
      ccs-bar-panel.webp
      cliproxyapi.webp
      copilot-api.webp
      live-auth-monitor.webp
      websearch.webp
  config/
    base-agy.settings.json
    base-claude.settings.json
    base-codebuddy.settings.json
    base-codex.settings.json
    base-cursor.settings.json
    base-gemini.settings.json
    base-ghcp.settings.json
    base-gitlab.settings.json
    base-glm.settings.json
    base-glmt.settings.json
    base-iflow.settings.json
    base-kilo.settings.json
    base-kimi.settings.json
    base-kiro.settings.json
    base-km.settings.json
    base-llamacpp.settings.json
    base-mm.settings.json
    base-ollama-cloud.settings.json
    base-ollama.settings.json
    base-qoder.settings.json
    base-qwen.settings.json
    config.example.json
  docker/
    Dockerfile
    Dockerfile.integrated
    README.md
    compose.yaml
    docker-compose.integrated.yml
    docker-compose.yml
    entrypoint-integrated.sh
    entrypoint.sh
    supervisord.conf
  docs/
    browser-automation.md
    ccs-bar.md
    code-standards.md
    codebase-summary.md
    codex-auth.md
    cursor-integration.md
    dashboard-auth-cli.md
    hardening-debt-burndown.md
    i18n-dashboard.md
    image-analysis.md
    logging-contract.md
    openai-compatible-providers.md
    project-overview-pdr.md
    project-roadmap.md
    quickstart-snippet.md
    
```

## Key Source Excerpts
### src\api\index.ts
```typescript
/**
 * API Module Barrel Export
 *
 * Barrel export for API-related functionality including profile services.
 */

// Services
export * from './services';

```

### src\commands\arg-extractor.ts
```typescript
/**
 * Small helpers for consistent CLI option extraction.
 */

export interface ExtractedOption {
  found: boolean;
  value?: string;
  missingValue: boolean;
  remainingArgs: string[];
}

export interface ExtractOptionOptions {
  /**
   * Allow values that start with "-" when they are not recognized flags.
   * Useful for model IDs or other arbitrary strings.
   */
  allowDashValue?: boolean;
  /**
   * Allow values that start with "--" when allowDashValue is enabled.
   * Keep this opt-in narrow so unknown long flags are still rejected by default.
   */
  allowLongDashValue?: boolean;
  /**
   * Known flags for the current command. Used with allowDashValue to avoid
   * treating a real flag token as a value.
   */
  knownFlags?: readonly string[];
}

export interface ScanCommandArgsOptions {
  knownFlags: readonly string[];
  valueFlags?: readonly string[];
  allowDashValue?: boolean;
}

export interface ScannedCommandArgs {
  positionals: string[];
  unknownFlags: string[];
}

function findInlineOption(arg: string, flag: string): string | undefined {
  const prefix = `${flag}=`;
  return arg.startsWith(prefix) ? arg.slice(prefix.length) : undefined;
}

function isKnownFlagToken(token: string, knownFlags: readonly string[] | undefined): boolean {
  if (!knownFlags || knownFlags.length === 0) {
    return false;
  }

  return knownFlags.some((flag) => token === flag || token.startsWith(`${flag}=`));
}

function findMatchingFlagToken(
  token: string,
  knownFlags: readonly 
```

### src\commands\browser-command.ts
```typescript
import * as browserUtils from '../utils/browser';

import type { BrowserToolPolicy } from '../config/unified-config-types';
import { getCcsPathDisplay } from '../utils/config-manager';
import { getNodePlatformKey } from '../utils/browser/platform';
import { color, dim, header, initUI, subheader } from '../utils/ui';
import { getBrowserConfig, mutateConfig } from '../config/config-loader-facade';

type HelpWriter = (line: string) => void;
type BrowserLane = 'claude' | 'codex' | 'all';

function summarizeBrowserHealth(status: browserUtils.BrowserStatusPayload): {
  label: 'ready' | 'partial' | 'action required';
  exitCode: 0 | 1;
} {
  const claudeNeedsAttention = status.claude.enabled && status.claude.state !== 'ready';
  if (claudeNeedsAttention) {
    return { label: 'action required', exitCode: 1 };
  }

  if (status.codex.enabled && status.codex.state !== 'enabled') {
    return { label: 'partial', exitCode: 0 };
  }

  return { label: 'ready', exitCode: 0 };
}

function isBrowserPolicy(value: string): value is BrowserToolPolicy {
  return value === 'auto' || value === 'manual';
}

function parseBrowserLane(value: string | undefined): BrowserLane | undefined {
  if (value === 'claude' || value === 'codex' || value === 'all') {
    return value;
  }

  return undefined;
}

function writeCommandTable(writeLine: HelpWriter): void {
  writeLine(subheader('Commands'));
  writeLine(
    `  ${color('ccs browser setup', 'command')}                      Configure Claude Browser At
```

## Agent Configuration
### CLAUDE.md
# CCS CLI Agent Guide

Canonical agent instructions for `/Users/kaitran/CloudPersonal/ccs/cli`.
`AGENTS.md` must stay a symlink to this file.

## Scope

CCS is a TypeScript/Bun CLI and dashboard for managing Claude Code, Codex,
Factory Droid, CLIProxy, and compatible provider profiles.

## Non-Negotiables

- Default branch is `dev`. Feature/fix branches start from `dev`; production
  hotfixes start from `main` only when explicitly needed.
- Never touch the user's real `~/.ccs/` or `~/.claude/` in tests. Use
  `getCcsDir()` from `src/utils/config-manager.ts`; it respects `CCS_HOME`.
- Do not commit directly to `dev` or `main`.
- Do not manually bump versions or create release tags. Semantic-release owns
  versions, changelog, tags, npm publish, and GitHub releases.
- CLI terminal output must be ASCII only: `[OK]`, `[!]`, `[X]`, `[i]`.
- Respect `NO_COLOR` and TTY-aware output.

## Architecture

- `src/` - TypeScript CLI/server source.
- `lib/ccs`, `lib/ccs.ps1` - bootstrap wrappers; no help text here.
- `ui/src/` - React dashboard.
- `dist/` and `dist/ui/` - build outputs.
- `docs/` - local development and architecture docs.
- Docker support lives under `docker/` and related commands.

Profile resolution priority:

1. Built-in CLIProxy providers: Gemini, Codex, Antigravity.
2. User-defined `config.cliproxy` providers.
3. Settings-based `config.profiles`.
4. Account-based `profiles.json` with isolated `CLAUDE_CONFIG_DIR`.

All env values written into settings must be strings.



### AGENTS.md
CLAUDE.md

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
