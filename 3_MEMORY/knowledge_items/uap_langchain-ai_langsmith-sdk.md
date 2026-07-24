# KI: langchain-ai/langsmith-sdk

## Overview
This repository contains the Python and Javascript SDK's for interacting with the [LangSmith platform](https://smith.langchain.com/). Please see [LangSmith Documentation](https://docs.smith.langchain.com/) for documentation about using the LangSmith platform and the client SDK.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 114 files across 33 directories
- **File types:** .ts: 31, .yml: 21, .json: 17, .yaml: 16, .js: 11, .md: 6, .cjs: 4

## Documentation Sections
- LangSmith Client SDKs
- Quick Start
- Cookbook
- Documentation

## Core Structure
```
  .gitattributes
  .gitignore
  .mlc_config.json
  .pre-commit-config.yaml
  .readthedocs.yml
  CONTRIBUTING.md
  LICENSE
  Makefile
  README.md
  .github/
    THREAT_MODEL.md
    dependabot.yml
    ISSUE_TEMPLATE/
      bug-report.yml
      config.yml
      documentation.yml
      feature-request.yml
      other.yml
    actions/
      js-integration-tests/
        action.yml
      js-vitest-eval-test/
        action.yml
      python-integration-tests/
        action.yml
    workflows/
      auto-label-issues.yml
      ci.yml
      js-perf.yml
      link-check.yml
      protect-openapi-client.yml
      py-baseline.yml
      py-bench.yml
      release.yml
      release_js.yml
      test_langsmith_nodejs.yml
  .vscode/
    settings.json
  _scripts/
    _fetch_schema.py
  examples/
    insights_agent_youtube.ipynb
  js/
    .gitignore
    .npmignore
    .oxfmtrc.json
    .oxlintrc.json
    .prettierignore
    AGENTS.md
    Makefile
    README.md
    babel.config.cjs
    jest.config.cjs
    jest.setup.cjs
    ls.vitest.config.ts
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    tsconfig.cjs.json
    tsconfig.json
    typedoc.json
    vitest.config.ts
    internal/
      environment_tests/
        docker-compose.yml
        test-deepagent-compat/
          package.json
          pnpm-lock.yaml
          pnpm-workspace.yaml
          src/
            index.ts
        test-exports-cf/
          package.json
          pnpm-workspace.yaml
          wrangler.toml
          src/
            index.ts
        test-exports-cjs/
          package.json
          pnpm-workspace.yaml
          src/
            index.js
        test-exports-esbuild/
          package.json
          pnpm-lock.yaml
          pnpm-workspace.yaml
          src/
            index.ts
        test-exports-esm/
          package.json
          pnpm-workspace.yaml
          tsconfig.json
          src/
            index.ts
            typecheck.ts
        test-exports-metro/
          babel.config.js
          package.json
          pnpm-lock.yaml
          pnpm-workspace.yaml
          src/
            index.js
        test-exports-vite/
          package.json
          pnpm-lock.yaml
          pnpm-workspace.yaml
          vite.config.ts
          src/
            index.ts
        test-exports-webpack/
          package.json
          pnpm-lock.yaml
          pnpm-workspace.yaml
          webpack.config.js
          src/
            index.js
    scripts/
      bump-version.js
      ch
```

## Quick Start
```bash
pip install -U langsmith
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=ls_...
export LANGSMITH_WORKSPACE_ID=<your-workspace-id> # Required for org-scoped keys
To get started with the JavaScript / TypeScript SDK, [install the package](https://www.npmjs.com/package/langsmith), then follow the instructions in the [JS README](js/README.md).
Then start tracing your app!
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to langsmith-sdk

This repo contains the Python and JS clients for the LangSmith platform.

See [`python/AGENTS.md`](python/AGENTS.md) for Python-specific lint/test instructions.

## Auto-generated OpenAPI client

The directories `python/langsmith/_openapi_client/` and `js/src/_openapi_client/` are **auto-generated** from the LangSmith OpenAPI spec via [Stainless](https://www.stainlessapi.com/). Do not edit files in these directories manually — your changes will be overwritten on the next sync.

Updates are applied automatically by the [`stlc_sync_python_and_js_sdks`](https://github.com/langchain-ai/langchainplus/actions/workflows/stlc_sync_python_and_js_sdks.yml) workflow in `langchain-ai/langchainplus`, which opens PRs from the `sync/langsmith-api` branch. A CI check ([`protect-openapi-client.yml`](.github/workflows/protect-openapi-client.yml)) blocks any PR that touches these directories from a source other than that workflow.

## Cutting a release

Releases are published by GitHub Actions workflows that fire on `main` when specific files change:

- **Python** (`.github/workflows/release.yml`) — fires on changes to `python/langsmith/__init__.py`. Builds, tags `vX.Y.Z`, and publishes to PyPI.
- **JS** (`.github/workflows/release_js.yml`) — fires on changes to `js/package.json`. Builds and publishes to npm.

To cut a release, open a version-bump PR against `main`. Each workflow runs independently, so Python and JS releases go in **separate PRs**.

### Python

```bash
git checkout main && git pull
git checkout -b release-py-X.Y.Z
cd python
uv run bump2version patch   # or minor/major
```

`bump2version` edits `python/.bumpversion.cfg` and `python/langsmith/__init__.py`, auto-commits, and creates a **local** tag. Do **not** push the tag — the release workflow creates the authoritative tag on `main` after merge.

```bash
git push origin release-py-X.Y.Z   # no --tags / --follow-tags
gh pr create --title "release(py): X.Y.Z"
```

On merge, the workflow c


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
