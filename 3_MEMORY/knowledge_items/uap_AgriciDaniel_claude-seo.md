# KI: AgriciDaniel/claude-seo

## Overview
Package: claude-seo

## Tech Stack (from code)
- Python (58 files)
- Shell (18 files)
- JavaScript (1 files)
- **Total:** 327 files, 99 directories
- **File types:** .md: 195, .py: 58, .txt: 24, .sh: 18, .ps1: 11, .json: 7, .svg: 4, .gif: 2

## Dependencies

### Python Dependencies (from requirements.txt)
- `beautifulsoup4>=4.12.0,<5.0.0     # No known CVEs`
- `requests>=2.32.4,<3.0.0           # CVE-2024-47081, CVE-2024-35195 fixes`
- `lxml>=6.1.1,<7.0.0                # CVE-2025-24928 + additional libxml2 security patches`
- `playwright>=1.59.0,<2.0.0         # CVE-2025-59288 fix (macOS)`
- `Pillow>=12.2.0,<13.0.0            # CVE-2025-48379 fix`
- `urllib3>=2.7.0,<3.0.0             # High-severity urllib3 advisories GHSA-mf9v-mfxr-j63j, GHSA-qccp-gfcp-xxvc`
- `validators>=0.22.0,<1.0.0         # No known CVEs`
- `trafilatura>=2.0.0,<3.0.0         # Boilerplate-free content extraction (SPA-safe)`
- `htmldate>=1.9.0,<2.0.0            # Publication-date extraction for freshness signals`
- `courlan>=1.3.0,<2.0.0             # trafilatura URL helper; explicit pin avoids transitive drift`
- `matplotlib>=3.8.0,<4.0.0              # No known CVEs`
- `weasyprint>=68.1,<70.0                # No known CVEs`
- `openpyxl>=3.1.5,<4.0.0                # No known CVEs (Excel export)`
- `google-api-python-client>=2.196.0,<3.0.0   # No known CVEs`
- `google-auth>=2.20.0,<3.0.0                  # No known CVEs`
- `google-auth-oauthlib>=1.4.0,<2.0.0          # No known CVEs`
- `google-auth-httplib2>=0.4.0,<1.0.0           # Compatibility floor for current google-auth stack`
- `google-analytics-data>=0.18.0,<1.0.0         # No known CVEs`

## File Structure
```
  .gitignore
  AGENTS.md
  CHANGELOG.md
  CITATION.cff
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  CONTRIBUTORS.md
  LICENSE
  PRIVACY.md
  README.md
  SECURITY.md
  install.ps1
  install.sh
  pyproject.toml
  requirements.txt
  uninstall.ps1
  uninstall.sh
  .claude-plugin/
    marketplace.json
    plugin.json
  .devcontainer/
    devcontainer.json
  agents/
    seo-backlinks.md
    seo-cluster.md
    seo-content.md
    seo-dataforseo.md
    seo-drift.md
    seo-ecommerce.md
    seo-flow.md
    seo-geo.md
    seo-google.md
    seo-image-gen.md
    seo-local.md
    seo-maps.md
    seo-performance.md
    seo-schema.md
    seo-sitemap.md
    seo-sxo.md
    seo-technical.md
    seo-visual.md
  assets/
    cover.svg
    framework.svg
    growth-3-months.png
    signal-flow.svg
    sub-skills.svg
  data/
    google-updates.json
  docs/
    ARCHITECTURE.md
    COMMANDS.md
    INSTALLATION.md
    MCP-INTEGRATION.md
    MIGRATION-v1-to-v2.md
    TROUBLESHOOTING.md
    WORKFLOW-public-private.md
  extensions/
    ahrefs/
      install.ps1
      install.sh
      uninstall.sh
      docs/
        AHREFS-SETUP.md
      skills/
        seo-ahrefs/
          SKILL.md
    banana/
      README.md
      install.sh
      uninstall.sh
      agents/
        seo-image-gen.md
      docs/
        BANANA-SETUP.md
      references/
        cost-tracking.md
        gemini-models.md
        mcp-tools.md
        post-processing.md
        presets.md
        prompt-engineering.md
        seo-image-presets.md
      scripts/
        batch.py
        cost_tracker.py
        edit.py
        generate.py
        presets.py
        setup_mcp.py
        validate_setup.py
      skills/
        seo-image-gen/
          LICENSE.txt
          SKILL.md
    bing-webmaster/
      install.ps1
      install.sh
      uninstall.sh
      docs/
        BING-WEBMASTER-SETUP.md
      skills/
        seo-bing/
          SKILL.md
    dataforseo/
      README.md
      field-config.json
      install.ps1
      in
```

## Agent Configuration
### AGENTS.md
# Claude SEO: Multi-Platform Agent Instructions

> For **Cursor**, **Cursor Cloud Agents**, **Google Antigravity**, **Gemini CLI**,
> **OpenAI Codex CLI**, **Cline**, **Aider**, and any other agent harness that
> reads project-root agent instructions.
>
> Claude Code users: see `CLAUDE.md` instead.

## Cross-platform portability (v2.0.0)

Every skill in `skills/*/SKILL.md` is authored to a portable subset of the
Claude Code skill spec. Validate compatibility with your harness via:

```bash
python3 scripts/portability_check.py
```

The check confirms each `SKILL.md` has the minimum frontmatter every harness
expects (`name`, `description`, optional `model`, optional `tools`) and warns
on Claude-Code-specific features (`maxTurns`, multi-line tool list with
descriptive comments) that other harnesses may ignore but do not reject.

### Per-harness notes

| Harness | How to load claude-seo |
|---|---|
| **Cursor** | Symlink or copy `skills/` and `agents/` into `.cursor/rules/`. Commands are invoked as text prompts; the harness reads `SKILL.md` body as system context. |
| **Cursor Cloud Agents** | Push the repo; Cloud Agents read `AGENTS.md` automatically at session start. |
| **Google Antigravity** | Point the workspace at this repo root; Antigravity reads `AGENTS.md` first, falls back to `skills/`. |
| **Gemini CLI** | `gemini init` in this repo loads `AGENTS.md`. Skills are activated via `activate_skill <name>` in conversation. |
| **OpenAI Codex CLI** | Reads `AGENTS.md` from pro

### CLAUDE.md
# Claude SEO: Universal SEO Analysis Skill

## Project Overview

This repository contains **Claude SEO**, a Tier 4 Claude Code skill for comprehensive
SEO analysis across all industries. It follows the Agent Skills open standard and the
3-layer architecture (directive, orchestration, execution). 25 sub-skills (21 core +
1 orchestrator + 1 framework integration + 2 extension mirrors), 18 sub-agents (15 core +
1 framework integration + 2 extension mirrors), and an extensible reference
system cover technical SEO, content quality,
schema markup, image optimization, sitemap architecture, AI search optimization,
local SEO (GBP, citations, reviews, map pack), maps intelligence, semantic topic
clustering, search experience optimization (SXO), SEO drift monitoring, e-commerce
SEO, and international SEO with cultural adaptation profiles.

## Architecture

```
claude-seo/
  CLAUDE.md                          # Project instructions (this file)
  CONTRIBUTORS.md                    # Community credits (Pro Hub Challenge)
  AGENTS.md                          # Multi-platform agent instructions (Cursor, Antigravity)
  .claude-plugin/
    plugin.json                    # Plugin manifest (v2.2.0)
    marketplace.json               # Marketplace catalog for distribution
  skills/                            # 25 sub-skills (auto-discovered)
    seo/                           # Main orchestrator skill
      SKILL.md                     # Entry point, routing table, core rules
      references/   

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
