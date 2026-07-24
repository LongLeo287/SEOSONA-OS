# KI: rtk-ai/rtk

## Overview
The `rtk` repository contains a command-line proxy designed to minimize LLM token consumption by filtering and compressing command outputs. It acts as an intermediary between the user and various commands (git, npm, cargo, etc.), intelligently reducing the number of tokens sent to language models. The project's documentation highlights its ability to save 60-90% of tokens on common development operations.

## Tech Stack (from code)
- **Rust:**  The `Cargo.toml` file indicates that this is a Rust project (`name = "rtk"` and `rust-version = "1.91"`).
- **Clap:** Used for command-line argument parsing, as evidenced by `use clap::{Parser, Subcommand}` in `src/main.rs`.
- **Serde:**  Used for serialization and deserialization, indicated by the dependency on `serde` in `Cargo.toml`, with features enabled (`features = ["derive"]`).
- **Regex:** Used for pattern matching and filtering, as seen in `src\core\stream.rs` and other files.

## Public API / Exports
Based on `src/main.rs`, the primary public entry point is the `rtk` command with several subcommands:
- `rtk ls`: Proxy to native `ls` command.
- `rtk cargo build`: Executes a cargo build, filtered and optimized.
- `rtk git diff`: Proxy to git diff command.
- `rtk gain`:  Displays token savings statistics.
- `rtk discover`: Discovers available filters.

## Dependencies
Based on the `Cargo.toml` file:
- `clap`: Version 4, for CLI argument parsing.
- `anyhow`: For error handling.
- `ignore`: For ignoring files.
- `walkdir`:  For traversing directories.
- `regex`: For regular expression matching.
- `serde`, `serde_json`: For serialization and JSON processing.
- `colored`: For adding color to terminal output.
- `dirs`: For finding user data directories.
- `rusqlite`: For SQLite database interaction (used for tracking).
- `toml`: For TOML file parsing.

## Architecture Patterns
- **Command Proxy:** The core architecture involves routing CLI commands through a proxy (`src/main.rs`), allowing for filtering and optimization before passing them to the underlying command.
- **Modular Design:**  The codebase is organized into modules (e.g., `cmds`, `core`, `hooks`) with specialized filters for different commands.
- **Configuration-Driven Filtering:** The project uses TOML files (`filters.toml`) to define filtering rules, enabling customization without modifying the core code (`src\core\toml_filter.rs`).

## Relevance to SEOSONA OS
The `rtk` project's token optimization capabilities could be beneficial for SEOSONA OS in several ways:
- **Reduced LLM Costs:**  SEOSONA OS likely utilizes LLMs for various tasks; `rtk` can significantly reduce the associated costs by minimizing token usage.
- **Improved Performance:** Filtering and compressing command outputs before sending them to an LLM can improve overall system performance, especially in resource-constrained environments.
- **Customizable Filters:** The TOML-based filtering system allows for tailoring the optimization process to SEOSONA OS's specific needs and workflows.  This could be used to filter out irrelevant information or prioritize certain data points before sending them to an LLM.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
