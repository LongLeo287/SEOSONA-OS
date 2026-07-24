# KI: teng-lin/notebooklm-py

## Overview
Package: notebooklm-py

## Tech Stack (from code)
- Python (297 files)
- **Total:** 357 files, 25 directories
- **File types:** .py: 297, .md: 50, .json: 2, .example: 1, .gitignore: 1, .yaml: 1, .png: 1, .toml: 1

## File Structure
```
  .env.example
  .gitignore
  .pre-commit-config.yaml
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  SKILL.md
  notebooklm-py.png
  pyproject.toml
  uv.lock
  desktop-extension/
    README.md
    manifest.json
    run_server.py
  docs/
    architecture.md
    auth-cookie-lifecycle.md
    cli-exit-codes.md
    cli-reference.md
    configuration.md
    conventions.md
    deprecations.md
    development.md
    installation.md
    mcp-guide.md
    python-api.md
    refactor-history.md
    releasing.md
    rpc-development.md
    rpc-reference.md
    stability.md
    troubleshooting.md
    upgrading-to-0.8.0.md
    adr/
      0000-template.md
      0001-layered-core-seams-and-property-bridge-policy.md
      0002-capability-protocol-pattern.md
      0003-auth-facade-write-through.md
      0004-loop-affinity-contract.md
      0005-idempotency-taxonomy.md
      0006-vcr-scrubber-strategy.md
      0007-test-monkeypatch-policy.md
      0008-cli-services-extraction-pattern.md
      0009-middleware-chain.md
      0010-session-kernel-split.md
      0011-schema-validation-policy.md
      0012-implementation-surface-convention.md
      0013-composable-session-capabilities.md
      0014-feature-local-runtime-adapters.md
      0015-json-envelope-contract-for-post-parse-click-exceptions.md
      0016-auth-identity-and-core-logger-compatibility.md
      0017-public-facade-private-implementation.md
      0018-deprecation-strategy.md
      0019-error-and-return-contract.md
      0020-sealed-async-result-types.md
      0021-transport-neutral-app-layer.md
      0022-regenerable-baselines.md
      README.md
  scripts/
    _onetime_rescrub_cookies.py
    _strip_audit_refs.py
    api-compat-allowlist.json
    audit_public_api_compat.py
    audit_test_suite.py
    capture_rpc_registry.py
    check_action_pinning.py
    check_ci_install_parity.py
    check_claude_md_freshness.py
    check_coverage_thresholds.py
    check_deprecation_targets.py
   
```

## Agent Configuration
### AGENTS.md
# Repository Guidelines

**Status:** Active
**Last Updated:** 2026-06-11

## Project Structure & Module Organization

`src/notebooklm/` contains the async client and typed APIs. Internal feature modules use `_` prefixes such as `_sources.py`, `_artifacts.py`, `_app/`, and `_runtime/`; `src/notebooklm/cli/` holds Click adapters, `src/notebooklm/mcp/` and `src/notebooklm/server/` hold the opt-in MCP and REST adapters, and `src/notebooklm/rpc/` handles protocol encoding and decoding. Tests are split by scope: `tests/unit/`, `tests/integration/`, `tests/server/`, and `tests/e2e/`. Recorded HTTP fixtures live in `tests/cassettes/`. Examples are in `examples/`, and diagnostics live in `scripts/`.

## Build, Test, and Development Commands

Canonical contributor install (full guide: [docs/installation.md](docs/installation.md)):

```bash
uv sync --frozen --extra browser --extra dev --extra markdown
source .venv/bin/activate
uv run playwright install chromium
uv run pytest
uv run pytest -n auto --dist=worksteal  # optional faster local run
uv run ruff check .
uv run ruff format .
uv run mypy src/notebooklm
uv run pre-commit run --all-files
```

Run `uv run pytest tests/e2e -m readonly` only after `notebooklm login` and setting test notebook env vars.

## Coding Style & Naming Conventions

Target Python 3.10+, 4-space indentation, and double quotes. Ruff enforces formatting and import order with a 100-character line length. Keep module and test file names in `snake_case`; prefer descri

### CLAUDE.md
# CLAUDE.md

Guidance for Claude Code working in this repo. Also follow the file/naming conventions in [CONTRIBUTING.md](CONTRIBUTING.md).

## Project Overview

`notebooklm-py` is an unofficial **async** Python client for Google NotebookLM. It drives Google's internal `batchexecute` RPC protocol to automate notebooks, sources, AI querying, and studio artifacts (podcasts, videos, quizzes, …).

**Critical constraint:** the obfuscated RPC method IDs in `src/notebooklm/rpc/types.py` are undocumented and can break whenever Google changes them — the #1 breakage class.

## Development Commands

```bash
# Canonical contributor install (respects uv.lock; full guide: docs/installation.md)
uv sync --frozen --extra browser --extra dev --extra markdown
source .venv/bin/activate
uv run playwright install chromium

uv run pytest                     # all tests (e2e excluded by default)
uv run pytest --cov               # with coverage
uv run pytest tests/e2e -m e2e    # e2e (requires auth)
uv run notebooklm --help          # CLI
```

## Before Pushing

The pre-commit hook runs ruff (format + lint) on staged files. Also run these manually — CI fails otherwise:

```bash
uv run mypy src/notebooklm --ignore-missing-imports
uv run pytest
```

## Architecture

`cli/` (Click) → `_app/` (transport-neutral business logic, reusable by MCP/HTTP adapters) → `client.py` + `_*.py` (client runtime) → `rpc/` (batchexecute encode/decode).

See **[docs/architecture.md](docs/architecture.md)** for the layered

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
