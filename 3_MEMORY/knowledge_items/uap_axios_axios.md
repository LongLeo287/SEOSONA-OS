# KI: axios/axios

## Overview
No description extracted.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 125 files across 22 directories
- **File types:** .md: 90, .yml: 10, .json: 8, .js: 6, .ts: 2, .gitignore: 1, .npmrc: 1

## Core Structure
```
  .gitignore
  .npmrc
  .prettierignore
  .prettierrc
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  COLLABORATOR_GUIDE.md
  CONTRIBUTING.md
  CONTRIBUTORS.md
  ECOSYSTEM.md
  LICENSE
  MIGRATION_GUIDE.md
  PRE_RELEASE_CHANGELOG.md
  PRE_RELEASE_DOCS.md
  README.md
  SECURITY.md
  THREATMODEL.md
  eslint.config.js
  gulpfile.js
  index.d.cts
  index.d.ts
  index.js
  package-lock.json
  package.json
  rollup.config.js
  tsconfig.json
  tslint.json
  vitest.config.js
  webpack.config.js
  .devcontainer/
    devcontainer.json
  .github/
    CODEOWNERS
    FUNDING.yml
    ISSUE_TEMPLATE.md
    PULL_REQUEST_TEMPLATE.md
    copilot-instructions.md
    dependabot.yml
    workflows/
      bundle-size.yml
      lockfile-lint.yml
      moderator.yml
      publish.yml
      release-branch.yml
      run-ci.yml
      verify-build-reproducibility.yml
      zizmor.yml
  .husky/
    commit-msg
  docs/
    favicon.ico
    index.md
    package-lock.json
    package.json
    site.webmanifest
    .vitepress/
      config.mts
      theme/
        index.ts
        style.css
    data/
      sponsors.json
    es/
      index.md
      pages/
        advanced/
          adapters.md
          api-reference.md
          authentication.md
          cancellation.md
          config-defaults.md
          create-an-instance.md
          error-handling.md
          fetch-adapter.md
          file-posting.md
          header-methods.md
          headers.md
          html-form-processing.md
          http2.md
          interceptors.md
          multipart-form-data-format.md
          progress-capturing.md
          promises.md
          rate-limiting.md
          request-config.md
          request-method-aliases.md
          response-schema.md
          retry.md
          testing.md
          type-script.md
          x-www-form-urlencoded-format.md
        getting-started/
          features.md
          first-steps.md
          upgrade-guide.md
          examples/
            commonjs.md
            typescript.md
        misc/
          security.md
          semver.md
          sponsors.md
    fr/
      index.md
      pages/
        advanced/
          adapters.md
          api-reference.md
          authentication.md
          cancellation.md
          config-defaults.md
          create-an-instance.md
          error-handling.md
          fetch-adapter.md
          file-posting.md
          header-methods.md
          headers.md
          html-form-processing.md
        
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md

axios is a promise-based HTTP client for the browser and Node.js. The default instance is exported from `lib/axios.js` via `index.js`. Browser builds use the XHR or Fetch adapter; Node uses the HTTP/HTTPS adapter. Platform selection lives in `lib/platform/`.

This file is the canonical contributor guide for both human and AI agents working in this repo. `.github/copilot-instructions.md` is a thin stub that points back here — keep it in sync with the load-bearing safety rules below if you change them.

## AI Agent Marker

- If you are an LLM or AI agent creating a GitHub issue, pull request, or comment for this repo, include the `:surfer:` emoji in the body so maintainers can identify AI-authored contributions.

## Setup And Safety

- Use `npm ci`; repo `.npmrc` sets `ignore-scripts=true`, and CI also uses `npm ci --ignore-scripts`.
- Do not remove `ignore-scripts=true`; if git hooks are needed after a fresh install, run `npm rebuild husky && npx husky` once.
- Adding or updating dependencies is security-sensitive; `package-lock.json` is checked by `lockfile-lint` for npm HTTPS hosts and integrity hashes.
- Package, lockfile, and GitHub Actions update PRs are maintainer/bot-only; close these PRs from outside collaborators. Keep the 7-day Dependabot delay unless a critical vulnerability requires a maintainer-led manual update.
- Build/test/lint tools still execute dependency code despite `ignore-scripts`; avoid unnecessary full builds when a focused check proves the change.
- Do not add new runtime dependencies without discussion; the dependency surface is intentionally tiny.

## Commands

- Build published artifacts: `npm run build` (`gulp clear` deletes `dist/`, then Rollup writes browser ESM/UMD/CJS and Node CJS bundles).
- Lint source only: `npm run lint`; focused lint: `npx eslint lib/path/to/file.js`.
- Unit tests: `npm run test:vitest:unit`; focused unit test: `npm run test:vitest:unit -- tests/unit/path.test.js`.
- Browser tests need Playwright in

--- CLAUDE.md ---
@AGENTS.md


--- CONTRIBUTING.md ---
# Contributing

We accept community contributions. By contributing to axios, you agree to follow the [code of conduct](https://github.com/axios/axios/blob/master/CODE_OF_CONDUCT.md).

## Code style

Follow the [node style guide](https://github.com/felixge/node-style-guide).

## Commit messages

Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Testing

Update tests for your changes. Pull 

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
