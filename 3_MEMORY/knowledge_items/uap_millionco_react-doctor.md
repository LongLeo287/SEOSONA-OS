# KI: millionco/react-doctor

## Overview
Repository with 1633 files across 131 directories. Primary language: TypeScript (1517 files).

## Tech Stack (from code)
- TypeScript (1517 files)
- TypeScript (React) (8 files)
- **Total:** 1633 files, 131 directories
- **File types:** .ts: 1517, .md: 37, .json: 26, .mjs: 12, .tsx: 8, .svg: 7, .gitignore: 3, .yaml: 2

## Public API / Exports
- `diagnose` from `packages\api\src\index.ts`
- `defineConfig` from `packages\api\src\index.ts`
- `ReactDoctorError` from `packages\api\src\index.ts`
- `ProjectNotFoundError` from `packages\api\src\index.ts`
- `NoReactDependencyError` from `packages\api\src\index.ts`
- `PackageJsonNotFoundError` from `packages\api\src\index.ts`
- `NotADirectoryError` from `packages\api\src\index.ts`
- `Severity` from `packages\core\src\index.ts`
- `JsonReportV1` from `packages\core\src\index.ts`
- `buildDiagnosticIdentity` from `packages\core\src\index.ts`
- `createServer` from `packages\language-server\src\index.ts`
- `startLanguageServer` from `packages\language-server\src\index.ts`
- `ALL_COMMANDS` from `packages\language-server\src\index.ts`
- `COMMAND_EXPLAIN` from `packages\language-server\src\index.ts`
- `COMMAND_FIX_ALL` from `packages\language-server\src\index.ts`
- `COMMAND_OPEN_DOCS` from `packages\language-server\src\index.ts`
- `COMMAND_REPORT_FALSE_POSITIVE` from `packages\language-server\src\index.ts`
- `NOOP_TELEMETRY` from `packages\language-server\src\index.ts`
- `ALL_REACT_DOCTOR_RULE_KEYS` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `ALL_REACT_DOCTOR_RULES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `EXTERNAL_RULES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `FRAMEWORK_SPECIFIC_RULE_KEYS` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `NEXTJS_RULES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `MOTION_LIBRARY_PACKAGES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `CROSS_FILE_RULE_IDS` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `classifySecurityScanFile` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `shouldReadSecurityScanContent` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `REACT_NATIVE_DEPENDENCY_NAMES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `REACT_NATIVE_DEPENDENCY_PREFIXES` from `packages\oxlint-plugin-react-doctor\src\index.ts`
- `isReactNativeDependencyName` from `packages\oxlint-plugin-react-doctor\src\index.ts`

## Dependencies

### Dev Dependencies
- `@changesets/changelog-github`: ^0.7.0
- `@changesets/cli`: ^2.31.0
- `@rayhanadev/truffler`: ^0.4.2
- `@sentry/cli`: ^3.4.3
- `@types/node`: ^25.6.0
- `@voidzero-dev/vite-plus-core`: ^0.1.15
- `cross-env`: ^10.1.0
- `ts-json-schema-generator`: ^2.9.0
- `turbo`: ^2.9.7
- `typescript`: ^6.0.3
- `vite-plus`: ^0.1.15

## Imports Detected in Source
- `@react-doctor/core`
- `fast-glob`
- `node:fs`
- `node:path`
- `oxlint-plugin-react-doctor`
- `vite-plus`

## Available Commands
- `npm run prepare` -- `vp config`
- `npm run dev` -- `turbo run dev --filter=react-doctor`
- `npm run build` -- `turbo run build`
- `npm run test` -- `turbo run test --filter=react-doctor --filter=@react-doctor/core --filter=@react`
- `npm run test:deslop` -- `turbo run test --filter=deslop-js --filter=deslop-cli`
- `npm run test:public-react-repos` -- `REACT_DOCTOR_PUBLIC_REPOS=1 vp test run packages/react-doctor/tests/public-react`
- `npm run typecheck` -- `turbo run typecheck`
- `npm run lint` -- `vp lint`
- `npm run lint:fix` -- `vp lint --fix`
- `npm run format` -- `vp fmt`
- `npm run format:check` -- `vp fmt --check`
- `npm run check` -- `vp check`

## File Structure
```
  .claude
  .gitignore
  .npmrc
  .prettierignore
  AGENTS.md
  CLAUDE.md
  LICENSE
  README.md
  action.yml
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.json
  turbo.json
  vite.config.ts
  .agents/
    skills/
      deslop/
        SKILL.md
      find-similar-functions/
        SKILL.md
      product-thinking/
        SKILL.md
      rde-eval/
        SKILL.md
      react-doctor/
        SKILL.md
        references/
          explain.md
      rule-research/
        SKILL.md
      rule-validate/
        SKILL.md
      rule-writing/
        SKILL.md
      ship/
        SKILL.md
      writing-guidelines/
        SKILL.md
  .vite-hooks/
    pre-commit
  assets/
    react-doctor-readme-logo-dark.svg
    react-doctor-readme-logo-light.svg
  docs/
    HOW_TO_WRITE_A_RULE.md
    rule-candidates-backlog.md
  packages/
    api/
      CHANGELOG.md
      package.json
      tsconfig.json
      vite.config.ts
      src/
        diagnose.ts
        index.ts
    core/
      CHANGELOG.md
      package.json
      tsconfig.json
      vite.config.ts
      src/
        apply-ignore-overrides.ts
        apply-severity-controls.ts
        batch-include-paths.ts
        build-diagnostic-pipeline.ts
        build-json-report-error.ts
        build-json-report.ts
        build-rule-severity-controls.ts
        build-skipped-checks.ts
        calculate-score.ts
        can-oxlint-extend-config.ts
        check-dead-code.ts
        check-expo-project.ts
        check-pnpm-hardening.ts
        check-react-native-project.ts
        check-react-server-components-advisory.ts
        check-reduced-motion.ts
        check-security-scan.ts
        check-supply-chain.ts
        classify-file-context.ts
        collect-ignore-patterns.ts
        compute-diagnostic-delta.ts
        constants.ts
        detect-foreign-disable-near-miss.ts
        detect-user-lint-config.ts
        diagnostic-surface.ts
        editor-scan.ts
        errors.ts
        evaluate-suppression.ts
        e
```

## Key Source Excerpts
### vite.config.ts
```typescript
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*.{js,ts,tsx}": "vp check --fix",
    "*.{json,jsonc,json5,yaml,yml,toml,html,css,scss,less,md,mdx,graphql,gql}": "vp fmt",
  },
  lint: {
    ignorePatterns: [
      ".turbo",
      "dist",
      "build",
      "node_modules",
      "packages/zed-react-doctor/**",
      "packages/react-doctor/tests/fixtures/**",
      "packages/language-server/tests/fixtures/**",
      "packages/deslop-js/tests/fixtures/**",
    ],
    plugins: ["typescript", "react", "import"],
    rules: {},
  },
  fmt: {
    semi: true,
    singleQuote: false,
    ignorePatterns: [
      ".turbo",
      "node_modules",
      "dist",
      "build",
      "pnpm-lock.yaml",
      "packages/zed-react-doctor/**",
      "packages/language-server/tests/fixtures/**",
      "packages/deslop-js/tests/fixtures/**",
    ],
  },
});

```

### packages\api\src\index.ts
```typescript
export { diagnose } from "./diagnose.js";
export { defineConfig } from "@react-doctor/core";

export type {
  DiagnoseOptions,
  DiagnoseProjectsInput,
  DiagnoseProjectsResult,
  DiagnoseResult,
  Diagnostic,
  ProjectDefinition,
  ProjectInfo,
  ProjectResult,
  ProjectResultError,
  ProjectResultOk,
  ReactDoctorConfig,
  ScoreResult,
} from "@react-doctor/core";
export {
  ReactDoctorError,
  ProjectNotFoundError,
  NoReactDependencyError,
  PackageJsonNotFoundError,
  NotADirectoryError,
  AmbiguousProjectError,
  isReactDoctorError,
} from "@react-doctor/core";

```

### packages\core\src\index.ts
```typescript
export * from "./types/index.js";
export * from "./project-info/index.js";
export * from "./build-diagnostic-pipeline.js";
export * from "./errors.js";
export * from "./observability.js";
export * from "./refs.js";
export * from "./resolve-scan-target.js";
export * from "./run-inspect.js";
// Selective re-exports from `./schemas.js` only — most class names
// (Diagnostic, JsonReport, JsonReportSummary, …) collide with the
// TypeScript-type definitions in `./types/index.js`. Consumers that
// need the Schema classes import directly via
// `@react-doctor/core/schemas` or the in-tree relative path.
export { Severity, JsonReportV1, buildDiagnosticIdentity } from "./schemas.js";
export * from "./services/config.js";
export * from "./services/dead-code.js";
export * from "./services/files.js";
export * from "./services/git.js";
export * from "./services/linter.js";
export * from "./services/node-resolver.js";
export * from "./services/progress.js";
export * from "./services/project.js";
export * from "./services/reporter.js";
export * from "./services/score.js";
export * from "./services/staged-files.js";
export * from "./services/supply-chain.js";
export * from "./apply-ignore-overrides.js";
export * from "./apply-severity-controls.js";
export * from "./build-rule-severity-controls.js";
export * from "./batch-include-paths.js";
export * from "./build-json-report-error.js";
export * from "./build-json-report.js";
export * from "./build-skipped-checks.js";
export * from "./calculat
```

## Agent Configuration
### AGENTS.md
## General Rules

- MUST: Use @antfu/ni. Use `ni` to install, `nr SCRIPT_NAME` to run. `nun` to uninstall.
- MUST: Use TypeScript interfaces over types.
- MUST: Keep all types in the global scope.
- MUST: Use arrow functions over function declarations
- MUST: Never comment unless absolutely necessary.
  - If the code is a hack (like a setTimeout or potentially confusing code), it must be prefixed with // HACK: reason for hack
- MUST: Use kebab-case for files
- MUST: Use descriptive names for variables (avoid shorthands, or 1-2 character names).
  - Example: for .map(), you can use `innerX` instead of `x`
  - Example: instead of `moved` use `didPositionChange`
- MUST: Frequently re-evaluate and refactor variable names to be more accurate and descriptive.
- MUST: Do not type cast ("as") unless absolutely necessary
- MUST: Remove unused code and don't repeat yourself.
- MUST: Use `truffler` to find existing symbols before adding a utility, helper, type, or rule, and again after finishing a task to catch duplicates and dead code (see "Symbol Search & Deduplication").
- MUST: Always search the codebase, think of many solutions, then implement the most _elegant_ solution.
- MUST: Before adding or changing the **public surface** (CLI flags/commands, the score, config, the JSON report, package APIs, the GitHub Action, website, or terminal output), run the `product-thinking` pass (`.agents/skills/product-thinking/`): name the user's job, reuse before adding, wire one telemetry metric,

### CLAUDE.md
See [`AGENTS.md`](./AGENTS.md) for the contributor guide — conventions, package
layout, the rule pipeline, and release steps.

@AGENTS.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
