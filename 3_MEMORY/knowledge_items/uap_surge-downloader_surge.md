# KI: surge-downloader/surge

## Overview
**Blazing fast TUI download manager built in Go for power users**

## Architecture & Tech Stack
- Go
- **Total files:** 127 files across 21 directories
- **File types:** .go: 56, .ts: 17, .yml: 12, .md: 10, .tsx: 8, .png: 7, .json: 3

## Documentation Sections
- Surge
- What is Surge?
- Why use Surge?
- Support the Project
- Installation
- Usage
- 1. Interactive TUI Mode
- Start the TUI
- Start the TUI without the local HTTP API server
- Start TUI with downloads queued
- Combine URLs and batch file
- 2. Server Mode (Headless)
- Start the server
- Start the server with a download
- Start with explicit API token
- 3. Auto-Start Service
- Install Surge as a system service
- Manage the service
- Uninstall the service
- 4. Remote TUI
- 3. Remote TUI
- Connect to local server (auto-detected)
- Connect to a remote daemon
- Equivalent global-flag form
- 4. Global Connection Flags (CLI + TUI)

## Core Structure
```
  .gitignore
  .golangci.yml
  .goreleaser.yaml
  CONTRIBUTING.md
  LICENSE
  README.md
  flake.lock
  flake.nix
  go.mod
  go.sum
  main.go
  package.nix
  .github/
    dependabot.yml
    funding.yml
    ISSUE_TEMPLATE/
      bug_report.md
      extension_bug_report.md
      feature_request.md
    workflows/
      build-push-images.yml
      core-binary-size-comment.yml
      core-binary-size-compare.yml
      core-build.yml
      core-lint.yml
      extension-checks.yml
      extension.yml
      integration.yml
  assets/
    dashboard.png
    demo.gif
    demo.mp4
    demo.tape
    embed.go
    logo.png
    logo_nobg.png
    settings.png
  cmd/
    add.go
    autoresume_test.go
    bugreport.go
    bugreport_test.go
    cli_test.go
    cmd_test.go
    connect.go
    connect_test.go
    get_test.go
    headless_approval_test.go
    http_api.go
    http_api_test.go
    http_handler_test.go
    limit.go
    lock.go
    lock_test.go
    ls.go
    main_test.go
    mirrors_integration_test.go
    pause.go
    refresh.go
    remote_client.go
    resume.go
    rm.go
    root.go
    root_downloads.go
    root_headless.go
    root_http_server.go
    root_lifecycle_test.go
    root_startup.go
    runservice_std.go
    runservice_termux.go
    server.go
    service_android_test.go
    service_kardianos.go
    service_kardianos_test.go
    service_termux.go
    service_termux_test.go
    service_test.go
    service_ui_std.go
    service_ui_termux.go
    shutdown.go
    shutdown_test.go
    startup_test.go
    test_env_test.go
    test_helpers_test.go
    token.go
    utils.go
    utils_test.go
  docker/
    Dockerfile
    compose.yml
  docs/
    FONTS.md
    OPTIMIZATIONS.md
    SETTINGS.md
    THEMES.md
    USAGE.md
  extension/
    .gitignore
    eslint.config.js
    global.d.ts
    package-lock.json
    package.json
    tsconfig.json
    vitest.config.ts
    wxt.config.ts
    entrypoints/
      background.ts
      popup/
        App.tsx
        index.html
        main.tsx
        popup.css
        components/
          DownloadItem.tsx
          DownloadList.tsx
          DuplicateModal.tsx
          SettingsView.tsx
          StatusBadge.tsx
          ViewSwitch.tsx
        lib/
          settings-handlers.ts
          utils.ts
        store/
          index.ts
          types.ts
    lib/
      background-logic.ts
      storage.ts
    public/
      icons/
        icon128.png
        icon16.png
        icon48.png
    test/
      background-logic.test.ts
      back
```

## Quick Start
```bash
surge
surge --no-server
surge https://example.com/file1.zip https://example.com/file2.zip
surge https://example.com/file.zip --batch urls.txt
surge server
surge server https://url.com/file.zip
surge server --token <token>
surge service install
surge service start
surge service stop
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing

Thanks for checking out Surge. We are very open to contributions and happy to review PRs.

This is intentionally short. If you see something that can be better, open a PR.

## Quick Codebase Map

- `cmd/`: CLI commands and startup wiring (`surge get`, `surge server`, etc.).
- `internal/core/`: service layer (`LocalDownloadService`) that orchestrates add/pause/resume/delete/list.
- `internal/download/`: high-level download flow (`TUIDownload`) and worker-pool lifecycle.
- `internal/engine/`: low-level engine code.
- `internal/engine/probe.go`: probe logic (range support, metadata, mirror probing).
- `internal/engine/concurrent/`: concurrent HTTP downloader and worker/retry/failover logic.
- `internal/engine/single/`: single-connection HTTP downloader fallback.
- `internal/engine/state/`: Gob-backed file persistence for paused/history downloads.
- `internal/tui/`: terminal UI models, update loop, views.
- `internal/testutil/`: mock HTTP servers and test helpers.

If you are looking for networking behavior, start here:

1. `internal/engine/probe.go`
2. `internal/engine/concurrent/`
3. `internal/engine/single/`

## Run Tests

From repo root:

```bash
go test ./...
```

Useful focused runs:

```bash
go test ./internal/engine/concurrent -run TestConcurrentDownloader_SwitchOn429 -count=1
go test ./internal/download -run TestIntegration_PauseResume -count=1
go test ./internal/tui -count=1
```

## PR Expectations

- Keep PRs focused and readable.
- Add or update tests for behavior changes.
- Run `go test ./...` before opening/updating the PR.
- If behavior or CLI usage changes, update docs (`README.md` or `docs/`).

That is it. If you are unsure about approach, open a draft PR early and we can iterate on it together.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
