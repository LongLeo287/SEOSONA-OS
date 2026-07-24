# KI: microclaw/microclaw

## Overview
MicroClaw is a Rust-based multi-platform chat bot designed for agentic tool execution, web search, scheduled tasks, and persistent memory. It supports multiple channels including Telegram, Discord, Slack, Feishu/Lark, and Web, with an emphasis on modularity and extensibility. The project aims to provide a flexible framework for building advanced conversational agents.

## Tech Stack (from code)
- **Language:** Rust (Cargo.toml: `edition = "2021"`)
- **Build System:** Cargo (Cargo.toml)
- **Frameworks/Libraries:** Tokio (Cargo.toml), teloxide (Cargo.toml - Telegram support), serenity (Cargo.toml - Discord support), reqwest (Cargo.toml - HTTP client), rusqlite (Cargo.toml - SQLite database).  Axum is used for web API functionality (Cargo.toml).
- **UI:** React and Vite are used for the built-in Web UI (Dockerfile, `web/package.json`).

## Public API / Exports
Based on `src/lib.rs`, the following modules are publicly exported:
- `a2a`: Likely related to Agent-to-Agent communication.
- `acp`:  Related to Agent Client Protocol.
- `agent_engine`: Core agent execution logic.
- `channels`: Channel adapters (Telegram, Discord).
- `chat_commands`: Chat command handling.
- `config`: Configuration management.
- `doctor`: Diagnostics and health checks.
- `gateway`: Event stream and request lifecycle infrastructure.
- `hooks`:  Hook discovery and runtime functionality.
- `llm`: Large Language Model interaction.
- `memory_backend`: Memory storage backend.
- `runtime`: Application wiring and initialization.
- `skills`: Skill management.
- `tools`: Tool implementations.

## Dependencies
Based on `Cargo.toml`, key dependencies include:
- `tokio`: Asynchronous runtime.
- `teloxide`: Telegram bot framework.
- `serenity`: Discord API wrapper.
- `reqwest`: HTTP client.
- `rusqlite`: SQLite database driver.
- `serde` and `serde_json`: Serialization/deserialization.
- `tracing`: Distributed tracing.
- `chrono`: Date and time management.

## Architecture Patterns
- **Modular Design:** The project is heavily modularized with separate crates for core functionality, channel adapters, tools, storage, and observability (e.g., `microclaw-core`, `microclaw-channels`, `microclaw-tools`). This promotes code reusability and maintainability.
- **Plugin System (Skills):**  The `skills` module suggests a plugin architecture where skills can be loaded and activated dynamically.
- **Agentic Loop:** The `agent_engine.rs` file explicitly mentions an "agent loop" which is central to the bot's functionality, indicating a focus on agent-based AI principles.
- **Configuration Driven:**  The project uses configuration files (`microclaw.config.yaml`) for settings and channel configurations.

## Relevance to SEOSONA OS
MicroClaw’s modular architecture and plugin system could be valuable for SEOSONA OS. The skill system allows for easy integration of new functionalities, potentially enabling SEOSONA to extend its capabilities without significant core modifications.  The multi-channel support is also relevant if SEOSONA needs to interact with various messaging platforms or APIs. The agentic loop design aligns well with the potential need for autonomous task execution within a larger operating system environment. Finally, the observability features (tracing, metrics) could be integrated into SEOSONA's monitoring and debugging infrastructure.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `capability`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 24, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
