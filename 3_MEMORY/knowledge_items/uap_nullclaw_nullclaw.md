# KI: nullclaw/nullclaw

## Overview
Repository with 361 files across 25 directories. Primary language: Unable to detect from file extensions.

## Tech Stack (from code)
- Unable to detect from file extensions
- **Total:** 361 files, 25 directories
- **File types:** .zig: 293, .md: 49, .json: 2, .yml: 2, .dockerignore: 1, .example: 1, .envrc: 1, .gitignore: 1

## File Structure
```
  .dockerignore
  .env.example
  .envrc
  .gitignore
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  Makefile
  README.md
  RELEASING.md
  SECURITY-PATCH-PLAN-2026-05-10.md
  SECURITY.md
  SIGNAL.md
  build.zig
  build.zig.zon
  build.zig.zon2json-lock
  config.example.json
  docker-compose.signal.yml
  docker-compose.yml
  flake.lock
  flake.nix
  nullclaw.png
  run
  .githooks/
    pre-commit
    pre-push
  docs/
    README.md
    integration-analysis.md
    integration-roadmap.md
    en/
      README.md
      architecture.md
      beginners-guide.md
      commands.md
      configuration.md
      development.md
      external-channels.md
      gateway-api.md
      installation.md
      security.md
      termux.md
      usage.md
      zig-installation.md
      ops/
        dingtalk-ops-readiness.md
        lark-ops-readiness.md
    zh/
      README.md
      architecture.md
      beginners-guide.md
      commands.md
      configuration.md
      development.md
      external-channels.md
      gateway-api.md
      installation.md
      security.md
      termux.md
      usage.md
      zig-installation.md
      ops/
        dingtalk-ops-readiness.md
        lark-ops-readiness.md
  spec/
    webchannel_v1.json
  src/
    a2a.zig
    acp.zig
    admin_output.zig
    agent.zig
    agent_bindings_config.zig
    agent_routing.zig
    agent_runner.zig
    auth.zig
    bus.zig
    capabilities.zig
    channel_adapters.zig
    channel_admin.zig
    channel_catalog.zig
    channel_loop.zig
    channel_manager.zig
    channel_probe.zig
    codex_support.zig
    command_summary.zig
    compat.zig
    config.zig
    config_mutator.zig
    config_parse.zig
    config_paths.zig
    config_types.zig
    control_plane.zig
    cost.zig
    cron.zig
    daemon.zig
    doctor.zig
    export_manifest.zig
    from_json.zig
    fs_compat.zig
    gateway.zig
    governance.zig
    hardware.zig
    health.zig
    heartbeat.zig
    http_util.zig
    identity.zig
    inbound_d
```

## Agent Configuration
### CLAUDE.md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Reference

Read `AGENTS.md` before any code change. It is the authoritative engineering protocol covering architecture, naming conventions, anti-patterns, change playbooks, and validation requirements.

## Build & Test Commands

```bash
# Requires exactly Zig 0.16.0 (verify: zig version)
zig build                           # dev build
zig build -Doptimize=ReleaseSmall   # release build (target: <1 MB binary)
zig build test --summary all        # run all 5,300+ tests (must pass with 0 leaks)
zig fmt src/                        # format all source files
zig fmt --check src/                # check formatting (used by pre-commit hook)
```

Primary validation command is `zig build test --summary all` (project-wide). Individual files can still be run with `zig test <file>.zig` when needed.

### Build Flags

```bash
zig build -Dchannels=telegram,cli   # compile only specific channels (default: all)
zig build -Dengines=base,sqlite     # compile only specific memory engines (default: base,sqlite)
zig build -Dtarget=x86_64-linux-musl  # cross-compile for target triple
zig build -Dversion=2026.3.1        # override CalVer version string
```

Channel tokens: `all`, `none`, or comma-separated names (`cli`, `telegram`, `discord`, `slack`, `signal`, `matrix`, `web`, `nostr`, `irc`, `email`, `imessage`, `whatsapp`, `mattermost`, `lark`, `dingtalk`, `line`, `onebot

### AGENTS.md
# AGENTS.md — nullclaw Agent Engineering Protocol

This file defines the default working protocol for coding agents in this repository.
Scope: entire repository.

## 1) Project Snapshot (Read First)

nullclaw is a Zig-first autonomous AI assistant runtime optimized for:

- minimal binary size (target: < 1 MB ReleaseSmall)
- minimal memory footprint (target: < 5 MB peak RSS)
- zero dependencies beyond libc and optional SQLite
- full feature parity with ZeroClaw (Rust reference implementation)

Core architecture is **vtable-driven** and modular. All extension work is done by implementing
vtable structs and registering them in factory functions.

Key extension points:

- `src/providers/root.zig` (`Provider`) — AI model providers
- `src/channels/root.zig` (`Channel`) — messaging channels
- `src/tools/root.zig` (`Tool`) — tool execution surface
- `src/memory/root.zig` (`Memory`) — memory backends
- `src/observability.zig` (`Observer`) — observability hooks
- `src/runtime.zig` (`RuntimeAdapter`) — execution environments
- `src/peripherals.zig` (`Peripheral`) — hardware boards (Arduino, STM32, RPi)

Current scale: **245 source files, ~204K lines of code, 5,640+ tests**.

Build and test:

```bash
zig build                           # dev build
zig build -Doptimize=ReleaseSmall  # release build
zig build test --summary all        # run all tests
```

## 2) Deep Architecture Observations (Why This Protocol Exists)

These codebase realities should drive every design decision:

1. **Vtab

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
