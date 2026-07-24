# KI: LongNgn204/local-coding-agent

## Overview
This repository provides a local MCP (Machine Coding Proxy) server that allows large language models like ChatGPT to interact with the user's file system, essentially acting as a coding agent. It includes a Node.js based server and optional components such as a Windows tray application and a local dashboard for monitoring and control. The project aims to enable AI-powered code assistance within a secure and controlled environment.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The primary language is JavaScript, with TypeScript used in several files like `vite.config.ts` (`core/agent-tool-policy.mjs`, `desktop/main.mjs`) indicating transpilation or type checking.
- **Node.js:** The server component utilizes Node.js as evidenced by the presence of `.mjs` files and `package.json` in the `server/` directory.  The `install.sh` script also explicitly checks for Node.js (`if ! command -v node >/dev/null 2>&1`).
- **npm:** The project uses npm as its package manager, confirmed by the presence of `package.json` and `package-lock.json` files in multiple directories (e.g., `server/`, `experiments/standalone-client-roadmap/v4.5.0-pro-local-client-mvp/`).
- **Vite:**  The file `vite.config.ts` within the `v5.0.0-local-agent-studio` directory indicates that Vite is used as a build tool, likely for bundling frontend assets.
- **PowerShell / Bash:** Installation scripts (`install.ps1`, `install.sh`) are provided for Windows and macOS/Linux respectively, indicating usage of these shell environments.

## Public API / Exports
Based on the limited code available, it's difficult to definitively list public APIs. However, the following suggests exposed functionality:
- **`/healthz` endpoint:**  The `AGENTS.md` file mentions `curl http://127.0.0.1:8787/healthz`, indicating a health check endpoint is available on the MCP server.
- **MCP Connector API:** The `AGENTS.md` document describes how to connect ChatGPT using an MCP connector, implying a defined API for communication between the agent and external applications.  The specific endpoints are not visible in the provided code snippets.

## Dependencies
Based on the `package.json` file (not directly available but inferred from other files), likely dependencies include:
- **Node.js modules:** Numerous Node.js modules would be listed within the `dependencies` and `devDependencies` sections of the package.json file, which is not provided in this analysis.
- **ripgrep:** The `AGENTS.md` document mentions that ripgrep (`rg`) makes search faster and that the server auto-detects it, implying a dependency on ripgrep.

## Architecture Patterns
- **Modular Design:**  The project appears to be structured with a modular design, as evidenced by the directory structure (e.g., `core/`, `desktop/`, `ui/` within `v5.0.0-local-agent-studio`) and the separation of concerns between server components.
- **Configuration via Environment Variables:** The `.env.example` file demonstrates that configuration is primarily handled through environment variables, promoting flexibility and ease of deployment.
- **Scripted Installation & Startup:**  The use of `install.ps1` and `install.sh` scripts suggests a scripted approach to installation and startup, simplifying the setup process for users.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Local AI Agent Integration:** The core functionality of providing a local coding agent aligns with potential use cases within SEOSONA OS, such as assisting developers or automating tasks.
- **Secure File System Access:**  The emphasis on secure file system access and controlled permissions (through `AGENT_MODE` and `AGENT_POLICY`) is crucial for maintaining the integrity and security of SEOSONA OS. The project's approach to workspace management could be adapted for use within a broader operating system environment.
- **Modular Architecture:** The modular design principles employed in this project can serve as a model for developing other components within SEOSONA OS, promoting maintainability and extensibility.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `router`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 0}
