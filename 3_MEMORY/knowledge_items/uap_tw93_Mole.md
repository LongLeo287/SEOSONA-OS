# KI: tw93/Mole

## Overview
curl -fsSL https://raw.githubusercontent.com/tw93/mole/main/install.sh | bash ```

## Architecture & Tech Stack
- Go
- **Total files:** 120 files across 24 directories
- **File types:** .go: 54, .sh: 30, .md: 15, .yml: 12, .editorconfig: 1, .gitignore: 1, .toml: 1

## Core Capabilities
- **All-in-one toolkit**: Combines CleanMyMac, AppCleaner, DaisyDisk, and iStat Menus in a **single binary**
- **Deep cleaning**: Removes caches, logs, leftovers, and orphaned app data to **reclaim gigabytes of space**
- **Smart uninstaller**: Removes apps plus launch agents, preferences, and **hidden remnants**
- **Disk insights**: Visualizes usage, finds large files, **rebuilds caches**, and refreshes system services
- **Live monitoring**: Shows real-time CPU, GPU, memory, disk, and network stats

## Documentation Sections
- Features
- Quick Start
- Optional args: -s latest for main branch code, -s 1.17.0 for specific version
- Also works with: optimize, installer, remove, completion, touchid enable
- Security & Safety Design
- Tips
- Features in Detail
- Deep System Cleanup
- Smart App Uninstaller
- System Optimization
- Disk Space Analyzer
- Live System Status
- Disk analysis as JSON
- System status as JSON
- Auto-detected JSON when piped
- Project Artifact Purge

## Core Structure
```
  .editorconfig
  .gitignore
  .gitleaks.toml
  .golangci.yml
  .shellcheckrc
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  CONTRIBUTORS.svg
  LICENSE
  Makefile
  README.md
  SECURITY.md
  SECURITY_AUDIT.md
  TRADEMARK.md
  go.mod
  go.sum
  install.sh
  mo
  mole
  .claude/
    settings.json
    agents/
      bash32-portability-reviewer.md
      safety-reviewer.md
    hooks/
      format-on-edit.sh
    skills/
      release-notes/
        SKILL.md
        scripts/
          post-reactions.sh
          sponsors.sh
  .cursor/
    rules/
      mole-test-safety.mdc
  .githooks/
    pre-commit
  .github/
    CODEOWNERS
    FUNDING.yml
    dependabot.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.md
      config.yml
      feature_request.md
      mac_app_bug.yml
      mac_app_feature.yml
    workflows/
      bundle_audit.yml
      check.yml
      codeql.yml
      release.yml
      test.yml
      update-contributors.yml
  bin/
    analyze.sh
    clean.sh
    completion.sh
    history.sh
    installer.sh
    optimize.sh
    purge.sh
    status.sh
    touchid.sh
    uninstall.sh
  cmd/
    analyze/
      analyze_filter_test.go
      analyze_test.go
      cache.go
      cleanable.go
      cleanable_test.go
      constants.go
      delete.go
      delete_fuzz_test.go
      delete_test.go
      format.go
      format_test.go
      heap.go
      heap_test.go
      insights.go
      insights_test.go
      json.go
      json_test.go
      live_config.go
      live_scan.go
      main.go
      main_stub.go
      model.go
      scanner.go
      scanner_test.go
      test_helpers_test.go
      update.go
      view.go
    status/
      diagnosis.go
      main.go
      main_test.go
      metrics.go
      metrics_battery.go
      metrics_battery_test.go
      metrics_bluetooth.go
      metrics_cpu.go
      metrics_disk.go
      metrics_disk_test.go
      metrics_fast_test.go
      metrics_gpu.go
      metrics_hardware.go
      metrics_health.go
      metrics_health_test.go
      metrics_memory.go
      metrics_network.go
      metrics_network_test.go
      metrics_process.go
      metrics_test.go
      process_watch.go
      process_watch_test.go
      view.go
      view_test.go
      watch.go
  docs/
    SECURITY_DESIGN.md
    release-notes/
      V1.42.0.md
  internal/
    units/
      bytes.go
      bytes_test.go
  lib/
    check/
      health_json.sh
    clean/
      app_caches.sh
      apps.sh
      brew.sh
      caches.sh
      dev.sh
      hints.sh
```

## Quick Start
```bash
brew install mole
curl -fsSL https://raw.githubusercontent.com/tw93/mole/main/install.sh | bash
mo                           # Interactive menu
mo clean                     # Deep cleanup + already-uninstalled app leftovers
mo uninstall                 # Remove installed apps + their leftovers
mo optimize                  # Refresh caches & services
mo analyze                   # Visual disk explorer (or 'mo analyse')
mo status                    # Live system health dashboard
mo purge                     # Clean project build artifacts
mo installer                 # Find and remove installer files
```

## Agent Configuration

--- AGENTS.md ---
# Mole Agent Guide

This file is the shared source of truth for any AI agent working on this repo (Claude Code, Codex, etc.). `CLAUDE.md` is a symlink to this file. Put machine-specific or personal overrides in `AGENTS.local.md` / `CLAUDE.local.md`; both are gitignored.

## Project

Mole is a macOS system cleanup and optimization tool with shell and Go components. It performs file cleanup, app protection checks, and maintenance tasks, so safety rules matter more than speed.

## Product Direction

Mole is a terminal-first macOS maintenance toolkit. Its core job is to help power users inspect reclaimable space, remove known-safe leftovers, uninstall apps safely, run bounded maintenance, and check health from a CLI, script, or compact TUI. It is not a general Mac control center, package manager, background monitor, or GUI feature mirror.

### What Mole Should Do

- Make cleanup and uninstall actions boring, reviewable, logged, protected by path/app rules, and dry-run capable.
- Prefer reversible user-facing removals through Trash where the command surface expects recoverability.
- Keep `clean`, `uninstall`, `purge`, and `installer` focused on reclaimable files, app leftovers, rebuildable caches, installer artifacts, and exact known cleanup targets.
- Keep `analyze` as a disk explorer and ad hoc cleanup surface. Optimize first paint, navigation, sorting, filtering, and safe deletion before adding dashboard-style features.
- Keep `status` as a compact read-only health dashboard plus stable JSON/NDJSON automation output. It may surface actionable signals, but should not become an iStat clone, alerting daemon, or configurable metrics workbench.
- Keep `optimize` focused on explicit, bounded maintenance tasks that can be explained before execution and tested without real authorization prompts.
- Keep command UX dense and terminal-native: short labels, stable alignment, predictable shortcuts, one-screen summaries, then optional drill-down.
- Keep Mole Mac references as a cro

--- CLAUDE.md ---
AGENTS.md

--- CONTRIBUTING.md ---
# Contributing to Mole

## Setup

```bash
# Install development tools
brew install shfmt shellcheck bats-core golangci-lint

# Install goimports for better Go formatting
go install golang.org/x/tools/cmd/goimports@latest

# Install pre-commit hook (runs format/lint checks on every commit)
git config core.hooksPath .githooks
```

## Development

Run quality checks before committing (auto-formats code):

```bash
./scripts/ch

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
