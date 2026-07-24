# KI: Lichas/maxclaw

## Overview
`maxclaw` is a lightweight personal AI assistant framework written primarily in Go, designed for tool use and multi-channel chat integrations. The project includes components for a CLI (`cmd/maxclaw`), a standalone gateway backend (`cmd/maxclaw-gateway`), and a web UI built with TypeScript and Electron.  The core functionality revolves around an "Agent Loop" that processes messages and interacts with LLMs and tools.

## Tech Stack (from code)
- **Language:** Go (evident from the `.go` file extensions, `go.mod`, and build commands in `Makefile`)
- **Framework/Libraries:**  DiscordGo (`github.com/bwmarrin/discordgo`), Slack SDK (`github.com/slack-go/slack`), OpenAI SDK (`github.com/openai/openai-go/v3`), Cobra for CLI (`github.com/spf13/cobra`)
- **Build System:** Go modules (defined in `go.mod` and `go.sum`), Makefile for build automation.
- **Web UI:** TypeScript, React (implied by the presence of `.ts`, `.tsx`, and `tsconfig.json` files in the `bridge/src` directory), Electron (evident from the `electron/` directory and associated configuration files).

## Public API / Exports
Due to the large number of Go files, a comprehensive list is impractical. However, based on file structure and naming conventions:
- **CLI:**  The `cmd/maxclaw/main.go` likely exposes command-line arguments and functions for interacting with the AI assistant.
- **Gateway Backend:** The `cmd/maxclaw-gateway/main.go` probably provides an API endpoint (likely HTTP) for communication between the CLI and other components.
- **Bridge UI:**  The TypeScript code in `bridge/src/` likely exposes React components and functions for user interface interactions.

## Dependencies
Based on `go.mod`:
- `github.com/bwmarrin/discordgo v0.29.0`
- `github.com/emersion/go-imap v1.2.1`
- `github.com/google/uuid v1.6.0`
- `github.com/gorilla/websocket v1.5.3`
- `github.com/mdp/qrterminal/v3 v3.2.1`
- `github.com/mozillazg/go-pinyin v0.21.0`
- `github.com/peterh/liner v1.2.2`
- `github.com/robfig/cron/v3 v3.0.1`
- `github.com/slack-go/slack v0.17.3`
- `github.com/spf13/cobra v1.8.0`
- `github.com/stretchr/testify v1.10.0`
- `github.com/tencent-connect/botgo v0.2.1`
- `golang.org/x/oauth2 v0.30.0`

Based on `package.json` (in the `bridge/` directory):
- React, TypeScript and related build tools are present.  A full list would require parsing the file.

## Architecture Patterns
- **Modular Design:** The project is divided into distinct modules (`cmd`, `bridge`, `electron`) with clear separation of concerns.
- **CLI Application:** Uses Cobra for command-line argument parsing and subcommand management.
- **Agent-Based System:**  The core logic revolves around an "Agent Loop" suggesting a reactive or event-driven architecture.
- **Electron App:** The web UI is packaged as an Electron application, enabling cross-platform desktop deployment.

## Relevance to SEOSONA OS
- **AI Assistant Framework:** `maxclaw`'s core functionality as a lightweight AI assistant framework could be integrated into SEOSONA OS for providing personalized assistance and automation.
- **Cross-Platform Compatibility:** The use of Electron allows the UI component to run on multiple operating systems, aligning with SEOSONA OS’s cross-platform goals.
- **Modular Design:**  The modular architecture facilitates integration with existing SEOSONA OS components and services.
- **Tool Integration:** The framework's ability to integrate with tools can be leveraged to extend SEOSONA OS functionality by connecting it to external APIs and services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
