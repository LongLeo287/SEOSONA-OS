# KI: screenpipe/screenpipe

## Overview
Screenpipe is a system designed for capturing and indexing accessibility trees, OCR output, and conversations for AI consumption. It aims to provide a context layer for AI agents, focusing on stability and activation over new features. The project appears to be built around a core engine with various components like an app (Tauri), CLI tools, and integrations with services such as OpenAI, Anthropic, and Deepgram.

## Tech Stack (from code)
- **Languages:** Rust (`.rs` files), TypeScript (`.ts`, `.tsx`), JavaScript (`.js`)
- **Frameworks/Libraries:** Next.js (evident from `apps/screenpipe-app-tauri/next.config.mjs` and related files), Tauri (directory structure `apps/screenpipe-app-tauri`), Bun (package.json in various directories), Serde, Tokio, Reqwest
- **Build System:** Cargo (Cargo.toml file) for Rust components, Bun for JavaScript/TypeScript components (`package.json` files).

## Public API / Exports
Based on the limited code provided, it's difficult to definitively list all public APIs. However, some notable exports include:

- `screenpipe-core::pipes::connections::is_mcp_connection_id`: Function for checking if a connection ID is an MCP connection (crates/screenpipe-core/src/lib.rs)
- `screenpipe-audio::TranscriptionEngine`:  A class within the audio processing module, likely used for transcription tasks (crates/screenpipe-audio/src/lib.rs).
- `paired_capture::paired_capture`: Function responsible for paired screenshot and accessibility tree capture (crates/screenpipe-capture/src/lib.rs)

## Dependencies
Based on Cargo.toml, package.json files, and other configuration files:

- **Rust:** Serde, Tokio, Reqwest, Chrono, tracing, sqlx, clap, image, hound, mp3lame-encoder, vad-rs, symphonia, russh, libsqlite3-sys
- **JavaScript/TypeScript:**  @cloudflare/workers-types, @anthropic-ai/sdk, @deepgram/sdk, @clerk/backend, @google/generative-ai, openai, bun, react, next.js

## Architecture Patterns
- **Modular Design:** The project is heavily modularized with numerous crates and packages (e.g., `screenpipe-audio`, `screenpipe-capture`, `screenpipe-core`).
- **Configuration-Driven:**  The system relies on configuration files (`Cargo.toml`, `package.json`, `.config.ts`) to manage dependencies, build processes, and settings.
- **API Gateway Pattern:** The `packages/ai-gateway` directory suggests an API gateway architecture for handling AI requests (package.json).
- **Feature Flags:**  The use of Cargo features (e.g., `security`, `cloud-sync`) indicates a strategy for enabling or disabling functionality based on configuration.



## Relevance to SEOSONA OS
Screenpipe's code could benefit SEOSONA OS in several ways:

- **Accessibility Enhancement:** The accessibility tree capture capabilities (`screenpipe-a11y` crate) can be integrated into SEOSONA OS to improve screen reader compatibility and provide richer context for assistive technologies.
- **AI Integration:**  The AI gateway architecture and integrations with various LLMs (OpenAI, Anthropic) could be leveraged to enhance SEOSONA OS's AI capabilities, such as providing contextual information or automating tasks.
- **Screen Recording & Transcription:** The screen recording and audio transcription features (`screenpipe-audio`) can be used for creating tutorials, documentation, or accessibility services within the operating system.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `accessibility` · **Fit:** 99/100 · **Auto-apply:** True
- **Evidence:** `a11y`, `accessibility`, `aria`
- **All scores:** {'seosona-os': 82, 'seosona-video': 74, 'seosona-content': 33, 'seosona-ux-ui': 99, 'seosona-flow': 28}
