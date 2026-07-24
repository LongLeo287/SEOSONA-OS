# KI: Chleba/ollamaMQ

## Overview
`ollamaMQ` is a proxy for Ollama and other language models, designed to provide fair-share queuing, round-robin scheduling, and a real-time TUI dashboard. It acts as an intermediary between clients and backend LLM servers like Ollama or LM Studio. The project aims to manage load and prioritize users effectively.

## Tech Stack (from code)
- **Language:** Rust (`src/main.rs`, `src/dispatcher.rs`, `src/tui.rs`) - evident from file extensions and source code content.
- **Framework:** Axum (`src/main.rs`: `use axum::{Router, routing::...};`) - used for building the web server.
- **Build System:** Cargo (evident from `Cargo.toml` and `Dockerfile`).
- **UI Library**: Ratatui (`src/tui.rs`: `use ratatui::prelude::*;`) - Used to create a terminal UI dashboard

## Public API / Exports
Based on the code, the primary public endpoint appears to be accessible via HTTP at port 11435 (defined in `docker-compose.yml` and used in `test_dispatcher.sh`).  The `docker-entrypoint.sh` script exposes this port. The `Args::parse()` struct defines command line arguments, including `--port`, suggesting a configurable API endpoint. Specific endpoints like `/api/generate`, `/api/chat`, `/v1/chat/completions`, and `/v1/completions` are used in the test suite (`test_dispatcher.sh`).

## Dependencies
The `Cargo.toml` file lists the following dependencies:
- axum (version 0.8.8)
- bytes (version 1.11.1)
- reqwest (version 0.13.2)
- tokio (version 1.49.0)
- tracing (version 0.1)
- tracing-subscriber (version 0.3)
- tracing-appender (version 0.2)
- ratatui (version 0.29)
- crossterm (version 0.28)
- tokio-stream (version 0.1.18)
- futures-util (version 0.3.32)
- clap (version 4.5)
- serde (version 1.0)
- serde_json (version 1.0)

## Architecture Patterns
- **Command-Line Argument Parsing:** The `clap` crate is used to define and parse command-line arguments (`Args` struct in `src/main.rs`).
- **Asynchronous Programming:**  The use of `tokio` indicates an asynchronous architecture for handling concurrent requests.
- **TUI (Text User Interface):** A TUI dashboard is implemented using `ratatui`, providing a real-time view of the proxy's status and queues. The `tui.rs` file contains the logic for this UI.
- **Modular Design:**  The code is divided into modules (`dispatcher.rs`, `tui.rs`) to separate concerns, promoting maintainability.

## Relevance to SEOSONA OS
This project could benefit SEOSONA OS in several ways:
- **Resource Management:** The fair-share queuing and round-robin scheduling mechanisms can be adapted for managing resources within the OS, ensuring equitable access to system services.
- **Real-time Monitoring:**  The TUI dashboard's functionality could be integrated into SEOSONA OS to provide real-time monitoring of various system processes or network connections.
- **API Gateway/Proxy:** The core proxying capabilities can be leveraged as a component within the OS for managing access to external services, enhancing security and control.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 20/100 · **Auto-apply:** False
- **Evidence:** `ollama`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
