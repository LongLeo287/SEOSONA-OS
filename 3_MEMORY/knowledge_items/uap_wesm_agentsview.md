# KI: wesm/agentsview

## Overview
Repository with 1234 files across 129 directories. Primary language: Go (592 files).

## Tech Stack (from code)
- Go (592 files)
- TypeScript (369 files)
- Svelte (90 files)
- Shell (24 files)
- Python (6 files)
- **Total:** 1234 files, 129 directories
- **File types:** .go: 592, .ts: 369, .svelte: 90, .md: 34, .json: 30, .sh: 24, .jsonl: 20, .png: 14

## Imports Detected in Source
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `astral-sh/setup-uv`
- `cargo fetch --locked --manifest-path desktop/src-tauri/Cargo.toml`
- `cargo test --locked --manifest-path desktop/src-tauri/Cargo.toml --lib install_downloaded_update`
- `desktop/scripts/prepare-sidecar.sh`
- `github.com/BurntSushi/toml`
- `github.com/stretchr/testify/assert`
- `github.com/stretchr/testify/require`
- `go run ./internal/pricing/cmd/litellm-snapshot -restore`
- `gopkg.in/yaml.v3`
- `os/exec`
- `path/filepath`
- `scripts/dev-backend-build.sh`
- `scripts/e2e-server.sh`

## File Structure
```
  .air.toml
  .custom-gcl.yml
  .dockerignore
  .gitattributes
  .gitignore
  .golangci.nilaway.yml
  .golangci.yml
  .kata.toml
  .roborev.toml
  AGENTS.md
  CLAUDE.md
  DESIGN.md
  Dockerfile
  LICENSE
  Makefile
  PRODUCT.md
  README.md
  SECURITY.md
  build_script_test.go
  ci_workflow_test.go
  desktop_sidecar_test.go
  docker-compose.prod.yaml
  docker-compose.test.yml
  docker-entrypoint.sh
  dockerfile_test.go
  go.mod
  go.sum
  hook_config_test.go
  makefile_test.go
  prek.toml
  renovate.json
  .impeccable/
    live/
      config.json
  cmd/
    agentsview/
      activity.go
      activity_test.go
      classifier.go
      classifier_test.go
      classifier_wiring.go
      classifier_wiring_test.go
      cli.go
      cli_test.go
      daemon_runtime.go
      daemon_runtime_test.go
      doctor.go
      doctor_test.go
      duckdb.go
      duckdb_quack_duckdbtest_test.go
      duckdb_test.go
      health.go
      health_test.go
      import.go
      legacy_flags.go
      main.go
      main_test.go
      managed_caddy.go
      managed_caddy_other.go
      managed_caddy_test.go
      managed_caddy_windows.go
      parse_diff.go
      parse_diff_test.go
      pg.go
      pg_service.go
      pg_service_launchd.go
      pg_service_manager.go
      pg_service_systemd.go
      pg_service_test.go
      pg_test.go
      pg_watch.go
      pg_watch_loop.go
      pg_watch_loop_test.go
      pg_watch_test.go
      projects.go
      prune.go
      prune_test.go
      secrets.go
      secrets_test.go
      serve_background.go
      serve_background_test.go
      serve_background_unix.go
      serve_background_windows.go
      serve_background_windows_test.go
      serve_lifecycle.go
      serve_lifecycle_test.go
      serve_runtime.go
      session.go
      session_export.go
      session_get.go
      session_get_test.go
      session_list.go
      session_list_render.go
      session_list_render_test.go
      session_list_resume_test.go
      session_messages.go
      
```

## Key Source Excerpts
### build_script_test.go
```go
package agentsview_test

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDevBackendBuildRestoresPricingSnapshotBeforeBuild(t *testing.T) {
	requireUnixShell(t)

	root := t.TempDir()
	installRepoFile(t, root, "scripts/dev-backend-build.sh", 0o755)
	stubs := installUnixBuildStubs(t, root)

	out, err := runInWorkspace(t, root, stubs.env(), "bash", "scripts/dev-backend-build.sh")
	require.NoError(t, err, "%s", out)

	events := stubs.events(t)
	assertEventOrder(t, events,
		"go run ./internal/pricing/cmd/litellm-snapshot -restore",
		"go build -tags fts5",
	)
	require.FileExists(t, filepath.Join(root, "tmp", "agentsview"))
}

func TestDevBackendBuildStopsWhenPricingSnapshotRestoreFails(t *testing.T) {
	requireUnixShell(t)

	root := t.TempDir()
	installRepoFile(t, root, "scripts/dev-backend-build.sh", 0o755)
	stubs := installUnixBuildStubs(t, root)

	out, err := runInWorkspace(
		t,
		root,
		stubs.env("RESTORE_FAIL=1"),
		"bash",
		"scripts/dev-backend-build.sh",
	)
	require.Error(t, err, "script should fail when snapshot restore fails: %s", out)

	events := stubs.events(t)
	assertEventContains(t, events,
		"go run ./internal/pricing/cmd/litellm-snapshot -restore")
	assertNoEventContains(t, events, "go build")
}

func TestE2EServerRestoresPricingSnapshotBeforeServerBuild(t *testing.T) {
	requireUnixShell(t)

	root := t.TempDir()
	installRepoFile(t, root, "sc
```

### ci_workflow_test.go
```go
package agentsview_test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v3"
)

type githubWorkflow struct {
	Jobs map[string]githubWorkflowJob `yaml:"jobs"`
}

type githubWorkflowJob struct {
	Steps []githubWorkflowStep `yaml:"steps"`
}

type githubWorkflowStep struct {
	Name string `yaml:"name"`
	Run  string `yaml:"run"`
	Uses string `yaml:"uses"`
}

func TestWindowsDesktopUpdateTestsRetryCargoNetworkFailures(t *testing.T) {
	contents, err := os.ReadFile(".github/workflows/ci.yml")
	require.NoError(t, err)

	var workflow githubWorkflow
	require.NoError(t, yaml.Unmarshal(contents, &workflow))

	job, ok := workflow.Jobs["desktop-windows-unit"]
	require.True(t, ok, "desktop-windows-unit job must exist")

	fetchIndex, fetchStep := findWorkflowStep(t, job, "Fetch Windows desktop Rust dependencies")
	testIndex, testStep := findWorkflowStep(t, job, "Run Windows desktop update tests")
	require.Less(t, fetchIndex, testIndex, "dependencies must be fetched before cargo test")

	assert.Contains(t, fetchStep.Run, "cargo fetch --locked --manifest-path desktop/src-tauri/Cargo.toml")
	assert.Contains(t, fetchStep.Run, "$attempt")
	assert.Contains(t, fetchStep.Run, "$LASTEXITCODE")
	assert.Contains(t, fetchStep.Run, "Start-Sleep")
	assert.Contains(t, testStep.Run, "cargo test --locked --manifest-path desktop/src-tauri/Cargo.toml --lib install_downloaded_update")
}

func TestCIDocsJobRunsFullDocsCheck(t *testing.T) {
	co
```

### desktop_sidecar_test.go
```go
package agentsview_test

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestPrepareSidecarRestoresPricingSnapshotBeforeBuild(t *testing.T) {
	requireUnixShell(t)

	root := t.TempDir()
	installRepoFile(t, root, "desktop/scripts/prepare-sidecar.sh", 0o755)
	writeDesktopDevWorkspace(t, root)
	stubs := installUnixBuildStubs(t, root)

	out, err := runInWorkspace(
		t,
		root,
		stubs.env("AGENTSVIEW_VERSION=v1.2.3"),
		"bash",
		"desktop/scripts/prepare-sidecar.sh",
	)
	require.NoError(t, err, "%s", out)

	assertEventOrder(t, stubs.events(t),
		"npm run build",
		"go run ./internal/pricing/cmd/litellm-snapshot -restore",
		"go build -tags fts5",
	)
	require.FileExists(t, filepath.Join(
		root,
		"desktop",
		"src-tauri",
		"binaries",
		"agentsview-x86_64-unknown-linux-gnu",
	))
}

func TestPrepareSidecarStopsWhenPricingSnapshotRestoreFails(t *testing.T) {
	requireUnixShell(t)

	root := t.TempDir()
	installRepoFile(t, root, "desktop/scripts/prepare-sidecar.sh", 0o755)
	writeDesktopDevWorkspace(t, root)
	stubs := installUnixBuildStubs(t, root)

	out, err := runInWorkspace(
		t,
		root,
		stubs.env("AGENTSVIEW_VERSION=v1.2.3", "RESTORE_FAIL=1"),
		"bash",
		"desktop/scripts/prepare-sidecar.sh",
	)
	require.Error(t, err, "script should fail when snapshot restore fails: %s", out)

	events := stubs.events(t)
	assertEventContains(t, events,
		"go run ./internal/pricing/cmd/litellm-snapshot -restore")
	assertNoEventContains(t, events, "go build")
}

```

## Agent Configuration
### AGENTS.md
# AGENTS.md

Instructions for autonomous coding agents working in this repository.

## Scope

- Applies to all agent-driven work in this repo.
- If multiple instruction files exist, follow the most specific one for the
  files you are editing.

## Required Git Rules

1. Commit every turn that changes tracked files.
1. Do not make empty commits. If a turn is read-only or only changes ignored
   files, state that no commit was made.
1. Do not amend commits.
1. Do not change branches without explicit user permission.

## Commit Expectations

- Keep commits focused and related to the requested task.
- Use clear conventional commit messages.
- Do not push, pull, or rebase unless explicitly requested.
- Do not include generated-with lines, attribution blocks, validation footers,
  or command transcripts in commit messages.

## Validation

- Run relevant tests before committing when practical.
- If tests cannot be run, state that clearly in the handoff.
- After Go code changes, run `go fmt ./...` and `go vet ./...` before
  committing.

## Backend Parity

- Preserve behavior and query-shape parity between supported storage backends
  whenever practical. SQLite and PostgreSQL/Cockroach queries, indexes,
  aggregations, filtering, and ordering should match until there is a
  concrete, documented reason for them to differ.
- Do not implement a performance or correctness fix for only one backend and
  call the problem solved unless the user explicitly scopes the work to that
  backend, 

### CLAUDE.md
AGENTS.md

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
