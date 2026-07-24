# KI: Light-Heart-Labs/DreamServer

## Overview
This repository, named "DreamServer," appears to be a system for deploying and managing a local AI stack (LLM inference, chat, voice, agents). The project aims to provide a fully offline AI environment deployable on various hardware configurations including Linux, Windows (WSL2), and macOS (Apple Silicon).  The installer scripts and configuration files suggest a focus on ease of use and automation for setting up this complex AI infrastructure.

## Tech Stack (from code)
- **Bash:** Used extensively in the `install.sh`, `ods/installers/*.sh` scripts, and other operational scripts (e.g., `ods/scripts/*`).  (File: `install.sh`)
- **Python:** Employed for the dashboard API backend (`ods/extensions/services/dashboard-api/`) and potentially other services. (File: `ods/CLAUDE.md`)
- **React/Vite/Tailwind CSS:** Used for the dashboard UI (`ods/extensions/services/dashboard/src/`).  (File: `installer/index.html`, `installer/vite.config.ts`)
- **Rust:** Utilized in the `src-tauri` directory, likely for core functionality and platform-specific adaptations. (File: `src-tauri/Cargo.toml`)
- **TypeScript:** Used within the React frontend (`installer/src/*.tsx`). (File: `installer/tsconfig.json`)
- **JSON & YAML:**  Used extensively for configuration files across various directories, including service definitions and manifests. (e.g., `ods/docker-compose.base.yml`, `ods/extensions/services/*/manifest.yaml`)

## Public API / Exports
Due to the nature of this project as an installer and deployment system, there are no readily apparent public APIs or exported functions in a traditional sense.  The primary "API" is through the command-line interface (CLI) provided by `ods-cli` within the `ods/ods-cli` directory. The CLI scripts likely expose functionality for managing the deployed AI stack. Specific commands and their arguments would need to be examined within those shell scripts to fully understand the available actions.

## Dependencies
Based on the limited code snippets, dependencies can be inferred from several files:
- **installer/package.json:**  Includes dependencies like `tailwindcss`, `vite`, `react`, and related libraries for the frontend build process.
- **src-tauri/Cargo.toml:** Lists Rust dependencies such as `serde`, `tokio`, and Tauri-specific crates.
- **ods/docker-compose.base.yml:**  Implies dependencies on Docker services, which in turn have their own dependencies (not explicitly listed here).

## Architecture Patterns
- **Layered Architecture:** The project separates concerns into distinct layers: a root level for initial setup and an `ods/` directory containing the core product. This is described in `ods/CLAUDE.md`.
- **Configuration-Driven Deployment:**  The system relies heavily on configuration files (YAML, JSON) to define services, GPU overlays, and deployment parameters. This allows for flexibility and customization.
- **Modular Design:** The use of extensions (`ods/extensions/services/`) suggests a modular architecture where functionality can be added or removed without modifying the core codebase.
- **Platform Abstraction:**  The `src-tauri/platform` directory indicates an attempt to abstract platform-specific details (Linux, macOS, Windows) for cross-platform compatibility.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Local AI Deployment Expertise:** The installer scripts and deployment automation techniques could be adapted to simplify the installation and management of AI models within SEOSONA OS.
- **Cross-Platform Compatibility:**  The platform abstraction layer (Rust `src-tauri/platform`) provides a valuable pattern for building cross-platform applications, which is essential for SEOSONA OS's diverse hardware support.
- **Modular Architecture:** The extension system could be leveraged to create a plugin architecture for SEOSONA OS, allowing users to easily add new AI capabilities or integrations.
- **Configuration Management:**  The configuration file approach provides a robust and flexible way to manage the settings of various components within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `workflow-automation` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `workflow`, `pipeline`
- **All scores:** {'seosona-os': 44, 'seosona-video': 49, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 56}
