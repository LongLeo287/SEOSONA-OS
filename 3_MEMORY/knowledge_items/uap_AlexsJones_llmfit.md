# KI: AlexsJones/llmfit

## Overview
Repository with 123 files across 27 directories. Primary language: Rust (26 files).

## Tech Stack (from code)
- Rust (26 files)
- JavaScript (12 files)
- JavaScript (React) (12 files)
- Python (9 files)
- Shell (3 files)
- **Total:** 123 files, 27 directories
- **File types:** .rs: 26, .json: 12, .md: 12, .js: 12, .jsx: 12, .py: 9, .png: 7, .toml: 5

## File Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  .release-please-manifest.json
  AGENTS.md
  API.md
  AUDIO_SUPPORT.md
  CHANGELOG.md
  CNAME
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Cargo.lock
  Cargo.toml
  Dockerfile
  LICENSE
  MODELS.md
  Makefile
  README.ja.md
  README.md
  README.zh.md
  flake.lock
  flake.nix
  index.html
  install.sh
  release-please-config.json
  version.txt
  .githooks/
    pre-push
  assets/
    benchmark.jpeg
    demo.gif
    icon.svg
    simulation.png
  data/
    benchmark_cache.json
    hf_models.json
  llmfit-core/
    Cargo.toml
    data/
      baselines.json
      benchmark_cache.json
      benchmarks.yaml
      docker_models.json
      hf_models.json
    src/
      analysis.rs
      bench.rs
      benchmarks.rs
      fit.rs
      hardware.rs
      lib.rs
      models.rs
      plan.rs
      providers.rs
      quality.rs
      update.rs
  llmfit-desktop/
    Cargo.toml
    build.rs
    tauri.conf.json
    capabilities/
      default.json
    icons/
      1024x1024.png
      128x128.png
      256x256.png
      32x32.png
      512x512.png
      icon.png
    src/
      main.rs
    ui/
      app.js
      i18n.js
      index.html
      styles.css
  llmfit-python/
    LICENSE
    Makefile
    hatch_build.py
    pyproject.toml
    uv.lock
    src/
      llmfit/
        __init__.py
        __main__.py
  llmfit-tui/
    Cargo.toml
    build.rs
    src/
      display.rs
      download_history.rs
      events.rs
      filter_config.rs
      main.rs
      mcp_server.rs
      serve_api.rs
      serve_shared.rs
      theme.rs
      tui_app.rs
      tui_events.rs
      tui_ui.rs
  llmfit-web/
    README.md
    index.html
    package-lock.json
    package.json
    vite.config.js
    src/
      App.jsx
      App.test.jsx
      api.js
      api.test.js
      i18n.test.js
      main.jsx
      styles.css
      test-setup.js
      themes.css
      utils.js
      components/
        ComparePanel.jsx
        DetailPanel.jsx
        FilterBar.jsx
        
```

## Agent Configuration
### AGENTS.md
# AGENTS.md

Instructions for AI agents contributing to this codebase.

---

## Project overview

`llmfit` is a Rust CLI/TUI tool that matches LLM models against local system hardware (RAM, CPU, GPU). It detects system specs, loads a model database from embedded JSON, scores each model's fit, and presents results in an interactive terminal UI or classic table output.

## Language and toolchain

- Rust, edition 2024.
- Build with `cargo build`. Run with `cargo run`.
- No nightly features required. Stable toolchain only.
- Minimum supported Rust version: whatever edition 2024 requires (1.85+).

## Architecture

```
main.rs          Entrypoint. Parses CLI args via clap. Launches TUI by default,
                 falls back to CLI subcommands (system, list, fit, search, info)
                 or --cli flag for classic table output.

hardware.rs      SystemSpecs::detect() reads RAM/CPU via sysinfo crate.
                 detect_gpu() shells out to nvidia-smi / rocm-smi, and
                 detects Apple Silicon via system_profiler.
                 On unified memory (Apple Silicon), VRAM = system RAM.
                 No async. No unsafe.

models.rs        LlmModel struct. ModelDatabase loads from data/hf_models.json
                 embedded via include_str!() at compile time. No runtime file I/O.

fit.rs           FitLevel enum (Perfect, Good, Marginal, TooTight).
                 RunMode enum (Gpu, CpuOffload, CpuOnly).
                 ModelFit::analyze() compares a model agai

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
