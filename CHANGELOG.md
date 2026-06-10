# Changelog

All notable changes to SEOSONA OS will be documented in this file.

## [v3.0.0] — Full SEO Intelligence Engine

- ✅ V3 SEO Audit Engine: 12-module fully automated website intelligence pipeline.
- ✅ Connectors: `psi`, `keywords`, `serp_competitor`, `backlinks`, `gsc`, `rank_tracker`, `ga4`, `technical`, `schema`, `eeat`, `log_analyzer`.
- ✅ Premium 12-tab standalone HTML dashboard (`dashboard_generator.py`).
- ✅ `secrets_manager.py`: AES-128 Fernet encrypted vault for API keys (`.vault` + `.masterkey`).
- ✅ `setup_check.py`: Full health-check CLI for all APIs and Python dependencies.
- ✅ `start_dashboard.py`: Interactive HTTP server with live connector re-run via POST API.
- ✅ `run_full_audit.py`: Orchestrator with `--skip-*` flags and auto-cleanup (`--clean`).
- ✅ `scripts/core/plugin_manager.py`: Auto-generates `SKILLS_ROUTER.md` from SKILL.md manifests.
- ✅ Root `package.json` version bumped to `3.0.0`.

## [v2.1.0] — Cross-Platform CLI Hardening

- ✅ Bumped `seosona-cli` to `2.1.0`.
- ✅ Added self-injection guard in `localInit.js` (blocks running `seosona init` inside the SEOSONA OS repo).
- ✅ Added support for Antigravity IDE via `.antigravityrules` (always injected).
- ✅ Added project-subfolder detection for `.github/copilot-instructions.md`, `.cody/prompt`, `.bolt/prompt`, `.lovable/prompt`.
- ✅ Added `Continue.dev` injection via `~/.continue/config.json`.

## [v2.0.1] - 2025-03-15

- ✅ Published `seosona-cli` to NPM.
- ✅ Extracted intelligence from slidej, slide-flow-control, human-analyzer, claudemarketplaces, and donniechu workflows.
- ✅ Built GitHub Actions automated publish workflow.
- ✅ Fulfilled GitHub Community Standards (Code of Conduct, Security, Contributing Guidelines).

## [v2.0.0] — Omni-Scanner Release

- ✅ Added smart detection for 14 IDE/CLI tools
- ✅ Replaced path-pointer injection with full SOUL.md content injection
- ✅ Built cross-platform Node.js CLI (`seosona setup`, `seosona init`)
- ✅ Introduced `Inject-JsonSettings` generic function — eliminating 200+ lines of duplicated logic
- ✅ Fixed `~/.git-templates` stale artifact from v1.x
- ✅ Zero hardcoded paths — all paths computed at runtime
- ✅ Added Antigravity IDE support via Environment Variables

## [v1.0.0] — Initial Release

- ✅ PowerShell setup engine for Windows
- ✅ Cursor, Codex, SecureCoder support
- ✅ MemPalace spatial memory architecture
- ✅ SOUL.md master system prompt
