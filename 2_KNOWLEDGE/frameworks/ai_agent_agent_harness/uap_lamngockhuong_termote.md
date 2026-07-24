# KI: lamngockhuong/termote

## Overview
Termote is a Progressive Web App (PWA) designed for remotely controlling command-line interfaces, including tools like Claude Code and GitHub Copilot, from mobile or desktop devices. It leverages `ttyd` for terminal access, `tmux` for persistent sessions, and a Go server (`tmux-api`) to provide proxying and API functionality. The project includes Dockerfiles and scripts for containerized deployment and native installation.

## Tech Stack (from code)
- **Frontend:** React 19 + TypeScript (evident from `pwa/src/App.tsx`, `pwa/package.json` which lists `@types/react@18.*` and `pwa/biome.json`)
- **PWA Build System:** Vite (`pwa/vite.config.ts`), Workbox (likely via a vite plugin, but not directly visible in code)
- **Backend (tmux-api):** Go (evident from `tmux-api/main.go`, `Dockerfile` which builds a go binary)
- **Package Manager:** pnpm (`pwa/package.json`, `Makefile` uses `pnpm install`)
- **Terminal Emulation:** ttyd (used in the Dockerfile and entrypoint script)
- **Session Management:** tmux (configured within `/etc/tmux.conf` inside the Docker image, used by the entrypoint script).

## Public API / Exports
Due to the nature of this project being a PWA with backend components, identifying a clear "public API" is difficult without further investigation. However, based on the `Makefile`, CLI scripts and Dockerfile:
- **`./scripts/termote.sh`**: Provides commands for installation (`install container`, `install native`), health checks (`health`), and online installer (`get`).
- **/usr/local/bin/tmux-api**: The Go server exposes an API, but the endpoints are not directly visible in the provided code snippets.  The Dockerfile indicates it serves static files from `/var/www/termote`.

## Dependencies
Based on `pwa/package.json`:
- react: ^19.0.0
- react-dom: ^19.0.0
- typescript: ~5.3.2
- vite: ^5.0.0
- ... (many more dependencies listed in pwa/package.json)

Based on `tmux-api/go.mod`:
- github.com/gorilla/mux: v1.8.1
- ... (other Go modules are present).

## Architecture Patterns
- **Microservices:** The project separates functionality into distinct components like the PWA frontend, the tmux-api server, and CLI scripts, suggesting a microservice architecture.
- **Containerization:** Dockerfiles and docker-compose.yml indicate a strong emphasis on containerized deployment for portability and isolation.
- **CLI Tooling:**  The `termote.sh` script demonstrates a Unix-style command-line interface for managing the application.

## Relevance to SEOSONA OS
Termote's architecture could benefit SEOSONA OS in several ways:
- **Remote CLI Access:** The core functionality of remotely controlling terminals aligns with potential use cases within SEOSONA, such as remote debugging or system administration.
- **Containerization Best Practices:**  The project’s Dockerfiles and `docker-compose.yml` provide examples of containerized application deployment that could be adapted for SEOSONA services.
- **PWA Integration:** The PWA frontend demonstrates how to build cross-platform applications using web technologies, which is valuable for SEOSONA's goal of providing accessible tools across various devices.  The Vite configuration and component structure could provide a template for other SEOSONA UI components.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
