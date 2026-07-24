# KI: openai/codex

## Overview
Tools for repo-wide maintenance.

## Tech Stack (from code)
- Rust (2083 files)
- TypeScript (612 files)
- Python (71 files)
- Shell (15 files)
- **Total:** 4605 files, 556 directories
- **File types:** .rs: 2083, .ts: 612, .snap: 537, .txt: 366, .json: 298, .md: 157, .bazel: 147, .toml: 146

## Dependencies

### Dev Dependencies
- `prettier`: ^3.5.3

## Available Commands
- `npm run format` -- `prettier --check *.json *.md docs/*.md .github/workflows/*.yml **/*.js`
- `npm run format:fix` -- `prettier --write *.json *.md docs/*.md .github/workflows/*.yml **/*.js`
- `npm run write-hooks-schema` -- `cargo run --manifest-path ./codex-rs/Cargo.toml -p codex-hooks --bin write_hooks`

## File Structure
```
  .bazelignore
  .bazelrc
  .bazelversion
  .codespellignore
  .codespellrc
  .gitattributes
  .gitignore
  .markdownlint-cli2.yaml
  .npmrc
  .prettierignore
  .prettierrc.toml
  .worktreeinclude
  AGENTS.md
  BUILD.bazel
  CHANGELOG.md
  LICENSE
  MODULE.bazel
  MODULE.bazel.lock
  NOTICE
  README.md
  SECURITY.md
  announcement_tip.toml
  defs.bzl
  flake.lock
  flake.nix
  justfile
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  rbe.bzl
  workspace_root_test_launcher.bat.tpl
  workspace_root_test_launcher.sh.tpl
  .codex/
    environments/
      environment.toml
    skills/
      babysit-pr/
        SKILL.md
        agents/
          openai.yaml
        references/
          github-api-notes.md
          heuristics.md
        scripts/
          gh_pr_watch.py
          test_gh_pr_watch.py
      code-review/
        SKILL.md
      code-review-breaking-changes/
        SKILL.md
      code-review-change-size/
        SKILL.md
      code-review-context/
        SKILL.md
      code-review-testing/
        SKILL.md
      codex-bug/
        SKILL.md
      codex-issue-digest/
        SKILL.md
        agents/
          openai.yaml
        scripts/
          collect_issue_digest.py
          test_collect_issue_digest.py
      codex-pr-body/
        SKILL.md
      path-types/
        SKILL.md
      pushing-ci-changes/
        SKILL.md
      remote-tests/
        SKILL.md
      test-tui/
        SKILL.md
      update-v8-version/
        SKILL.md
        agents/
          openai.yaml
  .devcontainer/
    Dockerfile
    Dockerfile.secure
    README.md
    devcontainer.json
    devcontainer.secure.json
    init-firewall.sh
    post-start.sh
    post_install.py
    codex-install/
      package.json
      pnpm-lock.yaml
      pnpm-workspace.yaml
  bazel/
    modules/
      BUILD.bazel
      wine.MODULE.bazel
    platforms/
      BUILD.bazel
      release_binaries.bzl
    rules/
      testing/
        BUILD.bazel
        foreign_platform_binary.bzl
        wine/
         
```

## Agent Configuration
### AGENTS.md
# Rust/codex-rs

In the codex-rs folder where the rust code lives:

- Crate names are prefixed with `codex-`. For example, the `core` folder's crate is named `codex-core`
- When using format! and you can inline variables into {}, always do that.
- Install any commands the repo relies on (for example `just`, `rg`, or `cargo-insta`) if they aren't already available before running instructions here.
- Never add or modify any code related to `CODEX_SANDBOX_NETWORK_DISABLED_ENV_VAR` or `CODEX_SANDBOX_ENV_VAR`.
  - You operate in a sandbox where `CODEX_SANDBOX_NETWORK_DISABLED=1` will be set whenever you use the `shell` tool. Any existing code that uses `CODEX_SANDBOX_NETWORK_DISABLED_ENV_VAR` was authored with this fact in mind. It is often used to early exit out of tests that the author knew you would not be able to run given your sandbox limitations.
  - Similarly, when you spawn a process using Seatbelt (`/usr/bin/sandbox-exec`), `CODEX_SANDBOX=seatbelt` will be set on the child process. Integration tests that want to run Seatbelt themselves cannot be run under Seatbelt, so checks for `CODEX_SANDBOX=seatbelt` are also often used to early exit out of tests, as appropriate.
- Always collapse if statements per https://rust-lang.github.io/rust-clippy/master/index.html#collapsible_if
- Always inline format! args when possible per https://rust-lang.github.io/rust-clippy/master/index.html#uninlined_format_args
- Use method references over closures when possible per https://rust-lang.g

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
