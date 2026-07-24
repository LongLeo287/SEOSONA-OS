# KI: eat-pray-ai/yutu

## Overview
)](https://winstall.app/apps/eat-pray-ai.yutu) [![npm Version](https://img.shields.io/npm/v/%40eat-pray-ai/yutu?style=flat-square&logo=npm)](https://www.npmjs.com/package/@eat-pray-ai/yutu)

## Architecture & Tech Stack
- Go
- **Total files:** 123 files across 25 directories
- **File types:** .go: 65, .bazel: 21, .md: 10, .yml: 8, .png: 4, .svg: 3, .bazelignore: 1

## Documentation Sections
- `yutu`
- Table of Contents
- Prerequisites
- Global Environment Variables
- Installation
- make sure client_secret.json is in the current directory
- or
- Docker
- Linux and macOS(if installed using shell script)
- Windows
- Agent
- Agent Environment Variables

## Core Structure
```
  .bazelignore
  .bazelrc
  .bazelversion
  .gitignore
  .goreleaser.yaml
  AGENTS.md
  BUILD.bazel
  Dockerfile
  LICENSE
  MODULE.bazel
  MODULE.bazel.lock
  README.md
  README_zh.md
  go.mod
  go.sum
  main.go
  server.json
  .github/
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    actions/
      github-registry/
        action.yml
    workflows/
      codeql.yml
      greetings.yml
      publish.yml
      stale.yml
      test.yml
  assets/
    chimoji.png
    eat-pray-ai-3d.png
    eat-pray-ai.png
    linuxdo_flat-square.svg
    mcp-demo.cast
    mcp-demo.gif
    yutu-ico.png
    yutu-ico.svg
    yutu.drawio
    yutu.svg
  cmd/
    AGENTS.md
    BUILD.bazel
    auth.go
    flags.go
    flags_test.go
    mcp.go
    root.go
    version.go
    activity/
      BUILD.bazel
      activity.go
      list.go
    agent/
      BUILD.bazel
      INSTRUCTION_DESTROYER.md
      INSTRUCTION_MODIFIER.md
      INSTRUCTION_ORCHESTRATOR.md
      INSTRUCTION_RETRIEVAL.md
      agent.go
      agents.go
    caption/
      BUILD.bazel
      caption.go
      delete.go
      download.go
      insert.go
      list.go
      update.go
    channel/
      BUILD.bazel
      channel.go
      list.go
      update.go
    channelBanner/
      BUILD.bazel
      channelBanner.go
      insert.go
    channelSection/
      BUILD.bazel
      channelSection.go
      delete.go
      list.go
    comment/
      BUILD.bazel
      comment.go
      delete.go
      insert.go
      list.go
      markAsSpam.go
      setModerationStatus.go
      update.go
    commentThread/
      BUILD.bazel
      commentThread.go
      insert.go
      list.go
    i18nLanguage/
      BUILD.bazel
      i18nLanguage.go
      list.go
    i18nRegion/
      BUILD.bazel
      i18nRegion.go
      list.go
    member/
      BUILD.bazel
      list.go
      member.go
    membershipsLevel/
      BUILD.bazel
      list.go
      membershipsLevel.go
    playlist/
      BUILD.bazel
      delete.go
      insert.go
      list.go
      playlist.go
      update.go
    playlistImage/
      BUILD.bazel
      delete.go
      insert.go
      list.go
      playlistImage.go
      update.go
    playlistItem/
      BUILD.bazel
      delete.go
      insert.go
      list.go
      playlistItem.go
      update.go
    search/
      BUILD.bazel
      list.go
      search.go
    subscription/
      BUILD.bazel
      delete.go
      insert.go
      list.go
      subscription.go
    superChatEvent/
  
```

## Quick Start
```bash
3. **Authenticate**:
A browser window will open for you to grant YouTube access. After granting permission, a token is saved to `youtube.token.json`.
By default, `yutu` will read `client_secret.json` and `youtube.token.json` from the current directory, `--credential/-c` and `--cacheToken/-t` flags are available only in `auth` subcommand. To modify the default path in all subcommands, set these environment variables.
| Variable           | Description                                  | Default                   |
|--------------------|----------------------------------------------|---------------------------|
| `YUTU_CREDENTIAL`  | Path, Base64, or JSON of OAuth client secret | `client_secret.json`      |
| `YUTU_CACHE_TOKEN` | Path, Base64, or JSON of cached OAuth token  | `youtube.token.json`      |
| `YUTU_ROOT`        | Root directory for file resolution           | Current working directory |
| `YUTU_LOG_LEVEL`   | Log level: `DEBUG`, `INFO`, `WARN`, `ERROR`  | `INFO`                    |
You can download `yutu` from [releases page](https://github.com/eat-pray-ai/yutu/releases/latest) directly, or use the following methods as you prefer.
```

## Agent Configuration

--- AGENTS.md ---
# Yutu

Go CLI + MCP server + Agent for YouTube.

## Quick Reference

- **Build**: `go build -o yutu .` or `bazel build //...`
- **Test**: `go test ./...` or `bazel test //...`
- **Smoke Tests**: `./scripts/command-test.sh`
- **Entry Point**: `main.go`

## Directory Index

| Directory | Description |
|-----------|-------------|
| [cmd/](cmd/AGENTS.md) | CLI command definitions and MCP tool bindings |
| [pkg/](pkg/AGENTS.md) | Core domain logic and shared infrastructure |
| [internal/](internal/AGENTS.md) | Internal tools (docgen, skillgen) |
| [scripts/](scripts/AGENTS.md) | Utility scripts and smoke tests |
| [docs/](docs/) | Project documentation |

## Documentation

- [docs/FEATURES.md](docs/FEATURES.md) — Feature overview
- [docs/HOW_TO_TEST.md](docs/HOW_TO_TEST.md) — Testing guide
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — Contribution guidelines
- [docs/CODE_OF_CONDUCT.md](docs/CODE_OF_CONDUCT.md) — Code of conduct

## Conventions

- **Secrets**: `client_secret.json` and `youtube.token.json` in root (standard for this project).
- **Build System**: Bazel is primary, standard Go tools also work.
- **BUILD.bazel files are auto-generated** — do NOT create or edit them manually. Run `bazel run //:gazelle` to regenerate.
- After changing dependencies: `bazel run @rules_go//go -- mod tidy -v && bazel mod tidy`.
- See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for the full list of useful build/test/release commands.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
