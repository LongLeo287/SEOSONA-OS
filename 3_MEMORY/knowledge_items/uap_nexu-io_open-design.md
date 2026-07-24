# KI: nexu-io/open-design

## Overview
Local-first design product: detects your installed code-agent CLI, runs design skills + design systems, streams artifacts into a sandboxed preview.

## Tech Stack (from code)
- TypeScript (1098 files)
- TypeScript (React) (172 files)
- Python (74 files)
- JavaScript (33 files)
- **Total:** 6918 files, 1632 directories
- **File types:** .md: 1840, .json: 1390, .ts: 1098, .html: 889, .css: 446, .png: 174, .tsx: 172, .astro: 164

## Public API / Exports
- `Button` from `packages\components\src\index.ts`
- `Dialog` from `packages\components\src\index.ts`
- `DialogBody` from `packages\components\src\index.ts`
- `DialogDescription` from `packages\components\src\index.ts`
- `DialogFooter` from `packages\components\src\index.ts`
- `DialogHeader` from `packages\components\src\index.ts`
- `Input` from `packages\components\src\index.ts`
- `Select` from `packages\components\src\index.ts`
- `Textarea` from `packages\components\src\index.ts`
- `VisuallyHidden` from `packages\components\src\index.ts`
- `DIAGNOSTICS_CONTENT_TYPE` from `packages\diagnostics\src\index.ts`
- `DIAGNOSTICS_EXPORT_PATH` from `packages\diagnostics\src\index.ts`
- `DIAGNOSTICS_FILENAME_PREFIX` from `packages\diagnostics\src\index.ts`
- `redactJsonValue` from `packages\diagnostics\src\index.ts`
- `redactJsonText` from `packages\diagnostics\src\index.ts`
- `redactText` from `packages\diagnostics\src\index.ts`
- `type RedactionOptions` from `packages\diagnostics\src\index.ts`
- `collectLogSource` from `packages\diagnostics\src\index.ts`
- `collectLogSources` from `packages\diagnostics\src\index.ts`
- `findMacOSCrashReports` from `packages\diagnostics\src\index.ts`
- `type CollectedFile` from `packages\diagnostics\src\index.ts`
- `type CrashReportLookup` from `packages\diagnostics\src\index.ts`
- `buildManifest` from `packages\diagnostics\src\index.ts`
- `buildMachineInfo` from `packages\diagnostics\src\index.ts`
- `diagnosticsFileName` from `packages\diagnostics\src\index.ts`
- `type DiagnosticsAppInfo` from `packages\diagnostics\src\index.ts`
- `type DiagnosticsContext` from `packages\diagnostics\src\index.ts`
- `buildDiagnosticsZip` from `packages\diagnostics\src\index.ts`
- `type DiagnosticsExportInput` from `packages\diagnostics\src\index.ts`
- `type DiagnosticsExportResult` from `packages\diagnostics\src\index.ts`

## Dependencies

### Dev Dependencies
- `@open-design/components`: workspace:*
- `@open-design/daemon`: workspace:*
- `@open-design/tools-dev`: workspace:*
- `@open-design/tools-pack`: workspace:*
- `@open-design/tools-release`: workspace:*
- `@open-design/tools-serve`: workspace:*
- `@types/node`: 20.19.39
- `tsx`: 4.22.3
- `typescript`: 5.9.3

## Imports Detected in Source
- `@open-design/platform`
- `@open-design/release`
- `@open-design/sidecar-proto`
- `node:child_process`
- `node:crypto`
- `node:fs`
- `node:os`
- `node:path`
- `node:stream`
- `node:timers`
- `zod`

## Available Commands
- `npm run postinstall` -- `node ./scripts/postinstall.mjs`
- `npm run tools-dev` -- `pnpm exec tools-dev`
- `npm run tools-pack` -- `pnpm exec tools-pack`
- `npm run tools-release` -- `pnpm exec tools-release`
- `npm run tools-serve` -- `pnpm exec tools-serve`
- `npm run nix:update-hash` -- `node --experimental-strip-types ./scripts/update-nix-pnpm-deps-hash.ts`
- `npm run guard` -- `tsx ./scripts/guard.ts && node --import tsx --test scripts/style-policy.test.ts `
- `npm run lint:craft` -- `tsx ./scripts/lint-craft-references.ts`
- `npm run i18n:check` -- `tsx ./scripts/i18n-check.ts`
- `npm run i18n:coverage` -- `tsx ./scripts/i18n-coverage-report.ts`
- `npm run sync:community-pets` -- `node --experimental-strip-types scripts/sync-community-pets.ts`
- `npm run bake:community-pets` -- `node --experimental-strip-types scripts/bake-community-pets.ts`

## File Structure
```
  .dockerignore
  .gitignore
  .node-version
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTEXT.md
  CONTRIBUTING.md
  LICENSE
  MAINTAINERS.md
  PRIVACY.md
  QUICKSTART.md
  README.md
  RELEASE-NOTES-0.10.0.md
  TRANSLATIONS.md
  design-browser-task-handoff.md
  flake.lock
  flake.nix
  mise.toml
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  vercel.json
  .claude/
    commands/
      od-contribute.md
    skills/
      od-contribute/
        SKILL.md
        install.sh
        agents/
          openai.yaml
        references/
          design-system-anatomy.md
          newcomer-tone.md
          od-repo-map.md
          skill-anatomy.md
        scripts/
          check-prereqs.sh
          config.sh
          create-issue.sh
          create-pr.sh
          discover-doc-gaps.sh
          discover-i18n-gaps.sh
          setup-workspace.sh
          validate-design-system.sh
          validate-markdown.sh
          validate-skill-submission.sh
        templates/
          ISSUE-BODY-bug.md
          PR-BODY-design-system.md
          PR-BODY-docs.md
          PR-BODY-i18n.md
          PR-BODY-skill.md
  .claude-plugin/
    marketplace.json
  .vaunt/
    config.yaml
    icons/
      beacon.png
      node.png
      nova.png
      signal.png
      spark.png
  apps/
    AGENTS.md
    daemon/
      AGENTS.md
      package.json
      tsconfig.json
      tsconfig.tests.json
      vitest.config.ts
      vitest.parallel.config.ts
      scripts/
        verify-amr-real-vela.mjs
      src/
        acp.ts
        agent-session-resume.ts
        agents.ts
        amr-stderr-filter.ts
        analytics.ts
        api-token-auth.ts
        app-config.ts
        app-version.ts
        artifacts-cli.ts
        automation-ingestions.ts
        automation-proposals.ts
        automation-routine-evolution.ts
        automation-templates.ts
        brand-routes.ts
        brands-cli-help.ts
        browser-open.ts
        browser-use-diagnostics.ts
        byok-tools.ts
        c
```

## Key Source Excerpts
### packages\agui-adapter\src\index.ts
```typescript
// AG-UI ↔ Open Design adapter package.
// Spec §10.3.5 / Phase 4. See `./encode.ts` and `./types.ts`.

export * from './types.js';
export * from './encode.js';

```

### packages\components\src\index.ts
```typescript
export { Button } from './button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './button';
export {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
export type { DialogProps } from './dialog';
export { Input, Select, Textarea } from './form-controls';
export type { InputProps, SelectProps, TextareaProps } from './form-controls';
export { VisuallyHidden } from './visually-hidden';
export type { VisuallyHiddenProps } from './visually-hidden';

```

### packages\contracts\src\index.ts
```typescript
export * from './common.js';
export * from './errors.js';
export * from './tasks.js';
export * from './api/app-config.js';
export * from './api/amrWallet.js';
export * from './api/automations.js';
export * from './api/artifacts.js';
export * from './api/brands.js';
export * from './api/chat.js';
export * from './api/community.js';
export * from './api/context.js';
export * from './api/connectors.js';
export * from './api/comments.js';
export * from './api/connectionTest.js';
export * from './api/files.js';
export * from './api/host-tools.js';
export * from './api/finalize.js';
export * from './api/github.js';
export * from './api/handoff.js';
export * from './api/live-artifacts.js';
export * from './api/media.js';
export * from './api/mcp.js';
export * from './api/memory.js';
export * from './api/orbit.js';
export * from './api/plugin-candidates.js';
export * from './api/providerModels.js';
export * from './api/projects.js';
export * from './api/proxy.js';
export * from './api/routines.js';
export * from './api/registry.js';
export * from './api/research.js';
export * from './api/reasoningExecution.js';
export * from './api/social-share.js';
export * from './api/terminals.js';
export * from './api/version.js';
export * from './api/workspaces.js';
export * from './examples.js';
export * from './execution-profile.js';
export * from './artifacts/od-card.js';
export * from './design-systems/components-manifest.js';
export * from './design-systems/derived-token-outputs.js';
export
```

## Agent Configuration
### AGENTS.md
# Directory guide

This file is the single source of truth for agents entering this repository. Read this file first; after entering `apps/`, `packages/`, `tools/`, or `e2e/`, read that layer's `AGENTS.md` for module-level details. Do not copy module details back into the root file; root stays focused on cross-repository boundaries, workflow, and commands.

## Core documentation index

- Product and onboarding: `README.md`, `docs/i18n/README.zh-CN.md`, `QUICKSTART.md`.
- Contribution and environment: `CONTRIBUTING.md`, `docs/i18n/CONTRIBUTING.zh-CN.md`.
- Architecture and protocols: `docs/spec.md`, `docs/architecture.md`, `docs/skills-protocol.md`, `docs/agent-adapters.md`, `docs/modes.md`.
- Roadmap and references: `docs/roadmap.md`, `docs/references.md`, `docs/code-review-guidelines.md`, `specs/current/maintainability-roadmap.md`.
- Directory-level agent guidance: `.github/AGENTS.md`, `apps/AGENTS.md`, `packages/AGENTS.md`, `tools/AGENTS.md`, `e2e/AGENTS.md`.
- Packaged auto-update architecture and high-confidence local harness: read `tools/pack/AGENTS.md` section "Packaged auto-update architecture and harness" before touching packaged updater code, release-channel identity, installer behavior, or updater UI.

## Workspace directories

- Workspace packages come from `pnpm-workspace.yaml`: `apps/*`, `packages/*`, `tools/*`, and `e2e`.
- Top-level content directories: `skills/` (functional skills the agent invokes mid-task — utilities, briefs, packagers; see `skills/AGENTS.md

### CLAUDE.md
@AGENTS.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
