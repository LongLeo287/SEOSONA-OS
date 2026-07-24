# KI: harehare/mq

## Overview
mq is a command-line tool that processes Markdown using a syntax similar to jq.

## Architecture & Tech Stack
- Rust
- **Total files:** 117 files across 24 directories
- **File types:** .md: 35, .rs: 35, .yml: 14, .toml: 11, .gitignore: 3, .svg: 3, .lock: 2

## Core Capabilities
- **Slice and Filter**: Extract specific parts of your Markdown documents with ease.
- **Map and Transform**: Apply transformations to your Markdown content.
- **Command-line Interface**: Simple and intuitive CLI for quick operations.
- **Extensibility**: Easily extendable with custom functions.
- **Built-in support**: Filter and transform content with many built-in functions and selectors.
- **REPL Support**: Interactive command-line REPL for testing and experimenting.
- **IDE Support**: VSCode Extension and Language Server **Protocol** (LSP) support for custom function development.
- **Debugger**: Includes an experimental debugger (`mq-dbg`) for inspecting and stepping through mq queries interactively.
- **External Subcommands**: Extend mq with custom subcommands by placing executable files starting with `mq-` in `~/.local/bin/`.

## Documentation Sections
- Why mq?
- Features
- Installation
- Quick Install
- Cargo
- Install from crates.io
- Install from Github
- Latest Development Version
- Install the debugger
- Install using binstall
- Binaries
- macOS (Apple Silicon)
- Linux x86_64
- Linux arm64
- Windows (PowerShell)
- Homebrew
- Using Homebrew (macOS and Linux)
- Arch
- Using yay (ArchLinux)
- Docker
- Visual Studio Code Extension
- Neovim
- Zed
- GitHub Actions
- Web

## Core Structure
```
  .dockerignore
  .envrc
  .gitattributes
  .gitignore
  .tool-versions
  .typos.toml
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  Cargo.lock
  Cargo.toml
  Dockerfile
  LICENSE
  README.md
  context7.json
  deny.toml
  flake.lock
  flake.nix
  justfile
  rust-toolchain.toml
  rustfmt.toml
  .claude/
    rules/
      mq-check.md
      mq-crawler.md
      mq-dap.md
      mq-ffi.md
      mq-formatter.md
      mq-hir.md
      mq-lang.md
      mq-lsp.md
      mq-markdown.md
      mq-repl.md
      mq-run.md
      mq-wasm.md
      mq-web-api.md
  .github/
    codecov.yml
    copilot-instructions.md
    dependabot.yml
    instructions/
      cli.instructions.md
      commit.instructions.md
      docs.instructions.md
      general.instructions.md
      lsp.instructions.md
      markdown.instructions.md
      rust-crate.instructions.md
      testing.instructions.md
    prompts/
      code-review.md
      fix-input.md
      fix-issue.md
    workflows/
      audit.yml
      bench.yml
      cargo-publish.yml
      ci.yml
      codeql.yml
      ffi-ci.yml
      npm-publish.yml
      pages.yml
      release.yml
      typos.yml
      unused-deps.yml
      zizmor.yml
  .vscode/
    launch.json
  assets/
    demo.gif
    demo.md
    demo.tape
    logo.png
    logo.svg
    mq.sublime-syntax
    ogp.svg
  crates/
    mq-check/
      .gitignore
      Cargo.toml
      README.md
      src/
        builtin.rs
        constraint.rs
        deferred.rs
        exhaustiveness.rs
        infer.rs
        lib.rs
        main.rs
        narrowing.rs
        types.rs
        unify.rs
        constraint/
          categories.rs
          helpers.rs
          pipe.rs
      tests/
        error_location_test.rs
        integration_test.rs
        type_errors_test.rs
    mq-crawler/
      Cargo.toml
      LICENSE
      README.md
      src/
        crawler.rs
        http_client.rs
        lib.rs
        main.rs
        robots.rs
    mq-dap/
      Cargo.toml
      LICENSE
      README.md
      src/
        adapter.rs
        error.rs
        executor.rs
        handler.rs
        lib.rs
        log.rs
        protocol.rs
        server.rs
    mq-ffi/
      .gitignore
      Cargo.toml
      LICENSE
      Makefile
      README.md
      build.rs
      mq.h
      test_mq.c
      src/
        lib.rs
    mq-formatter/
      Cargo.toml
      LICENSE
      README.md
      benches/
        benchmark.rs
      src/
        formatter.rs
        lib.rs
        main.rs
    mq-hir/
      Cargo.toml
      L
```

## Quick Start
```bash
curl -sSL https://mqlang.org/install.sh | bash
cargo install mq-run
cargo install --git https://github.com/harehare/mq.git mq-run --tag v0.6.2
cargo install --git https://github.com/harehare/mq.git mq-run --bin mq
cargo install --git https://github.com/harehare/mq.git mq-run --bin mq-dbg --features="debugger"
cargo binstall mq-run@0.6.2
curl -L https://github.com/harehare/mq/releases/download/v0.6.2/mq-aarch64-apple-darwin -o /usr/local/bin/mq && chmod +x /usr/local/bin/mq
curl -L https://github.com/harehare/mq/releases/download/v0.6.2/mq-x86_64-unknown-linux-gnu -o /usr/local/bin/mq && chmod +x /usr/local/bin/mq
curl -L https://github.com/harehare/mq/releases/download/v0.6.2/mq-aarch64-unknown-linux-gnu -o /usr/local/bin/mq && chmod +x /usr/local/bin/mq
Invoke-WebRequest -Uri https://github.com/harehare/mq/releases/download/v0.6.2/mq-x86_64-pc-windows-msvc.exe -OutFile "$env:USERPROFILE\bin\mq.exe"
```

## Agent Configuration

--- AGENTS.md ---
# mq Development Guide

## Project Overview

`mq` is a jq-like command-line tool for Markdown processing. Written in Rust, it allows you to easily slice, filter, map, and transform Markdown files.

## Coding Conventions

### Rust Code Conventions

- Always format and validate code using `cargo fmt` and `cargo clippy`
- Add appropriate documentation comments to all public functions, structs, traits, enums, etc.
- Use the `miette` crate for error handling and provide user-friendly error messages
- Avoid panics whenever possible and return appropriate `Result` types
- Write comprehensive tests and update related tests when adding or changing functionality

## Commit Message Conventions

Use the following format for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

- Types include:
  - ✨ feat: New feature
  - 🐛 fix: Bug fix
  - 📝 docs: Documentation changes
  - 💄 style: Code style changes that don't affect behavior
  - ♻️ refactor: Refactoring
  - ⚡ perf: Performance improvements
  - ✅ test: Adding or modifying tests
  - 📦 build: Changes to build system or external dependencies
  - 👷 ci: Changes to CI configuration files and scripts
- Write clear, concise, and descriptive commit messages.
- Reference related issues or pull requests when relevant.

## Documentation Guidelines

When adding new features, update the documentation.

- Keep documentation up-to-date with code changes.
- Use clear, concise language and provide usage examples.
- Document all public APIs, commands, and features.
- Update `/docs` and crate-level `README.md` files for new features or changes.
- Add changelog entries for all user-facing changes.
- Ensure documentation is consistent across all files and crates.
- Use Markdown best practices for formatting and structure.

## Testing Conventions

- Write comprehensive tests for all new features and bug fixes.
- Use descriptive names for test functions and modules.
- Prefer table-driven tests for similar input

--- CLAUDE.md ---
# mq Development Guide

## Project Overview

`mq` is a jq-like command-line tool for Markdown processing. Written in Rust, it allows you to easily slice, filter, map, and transform Markdown files.

## Coding Conventions

### Rust Code Conventions

- Always format and validate code using `cargo fmt` and `cargo clippy`
- Add appropriate documentation comments to all public functions, structs, traits, enums, etc.
- Use the `miette` crate for error handling and

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
