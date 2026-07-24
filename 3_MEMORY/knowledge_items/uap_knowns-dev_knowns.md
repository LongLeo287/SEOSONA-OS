# KI: knowns-dev/knowns

## Overview
Knowns appears to be a system for managing knowledge and tasks, likely designed for both human users and AI agents. The codebase includes tools for document management, task tracking, code editing, and semantic search, suggesting it aims to provide a unified platform for information retrieval and workflow automation.  The project emphasizes agent interaction through specific guidelines and compatibility entrypoints like `CLAUDE.md` and `GEMINI.md`.

## Tech Stack (from code)
- **Go:** The primary language, evidenced by the numerous `.go` files and the `go.mod` file: `module github.com/howznguyen/knowns\ngo 1.24.2` ([https://github.com/knowns-dev/knowns/blob/main/go.mod](https://github.com/knowns-dev/knowns/blob/main/go.mod)).
- **Vite:** Used for the frontend UI, as indicated by `bun install && bun dev` in the Makefile ([https://github.com/knowns-dev/knowns/blob/main/Makefile](https://github.com/knowns-dev/knowns/blob/main/Makefile)).
- **TypeScript/React:** The presence of `.tsx` and `.ts` files within the `ui` directory suggests a React-based frontend ([https://github.com/knowns-dev/knowns/tree/main/ui](https://github.com/knowns-dev/knowns/tree/main/ui)).
- **Cobra:** Used for building command-line interfaces, as seen in the `go.mod` file: `github.com/spf13/cobra v1.10.2`. ([https://github.com/knowns-dev/knowns/blob/main/go.mod](https://github.com/knowns-dev/knowns/blob/main/go.mod))
- **SQLite:** Used for database interactions, as evidenced by the `modernc.org/sqlite v1.46.1` dependency in `go.mod`. ([https://github.com/knowns-dev/knowns/blob/main/go.mod](https://github.com/knowns-dev/knowns/blob/main/go.mod))

## Public API / Exports
Due to the size of the repository, a comprehensive list is impractical. However, based on file names and directory structure, potential public APIs include:

- **CLI commands:**  Defined within `cmd/knowns/main.go` and exposed through Cobra ([https://github.com/knowns-dev/knowns/tree/main/cmd/knowns](https://github.com/knowns-dev/knowns/tree/main/cmd/knowns)).
- **MCP (Metadata Control Plane) endpoints:**  Likely defined within the `internal/` packages, although specific endpoint details are not readily available without deeper code inspection. The presence of `mark3labs/mcp-go v0.44.1` in `go.mod` confirms its usage ([https://github.com/knowns-dev/knowns/blob/main/go.mod](https://github.com/knowns-dev/knowns/blob/main/go.mod)).
- **UI components:**  Defined within the `ui/` directory, likely exposed via React component structure ([https://github.com/knowns-dev/knowns/tree/main/ui](https://github.com/knowns-dev/knowns/tree/main/ui)).

## Dependencies
Based on `go.mod`:
- `charm.land/bubbles/v2`
- `charm.land/bubbletea/v2`
- `charm.land/lipgloss/v2`
- `github.com/fsnotify/fsnotify`
- `github.com/go-chi/chi/v5`
- `github.com/gorilla/websocket`
- `github.com/mark3labs/mcp-go`
- `github.com/mattn/go-isatty`
- `github.com/rs/cors`
- `github.com/spf13/cobra`
- `github.com/yalue/onnxruntime_go`
- `gopkg.in/yaml.v3`
- `modernc.org/sqlite`

## Architecture Patterns
- **MCP Integration:** The project heavily integrates with the Metadata Control Plane (MCP), as evidenced by the dependency on `mark3labs/mcp-go` and references to MCP tools in documentation (`AGENTS.md`, `GEMINI.md`).
- **Agent-Centric Design:**  The presence of dedicated files for agent guidance (`CLAUDE.md`, `GEMINI.md`) suggests a design focused on facilitating AI agent interaction.
- **Layered Architecture**: The separation between the CLI, UI and MCP components indicates a layered architecture.

## Relevance to SEOSONA OS
Knowns' focus on knowledge management, task automation, and agent integration could be highly beneficial for SEOSONA OS. Specifically:
- **Knowledge Graph Integration:**  The system’s ability to manage documents and tasks aligns well with the potential need for a structured knowledge graph within SEOSONA OS.
- **AI Agent Workflow Automation:** The emphasis on AI agents and MCP integration can streamline complex workflows, potentially automating repetitive or time-consuming tasks within the operating system.
- **CLI Tooling**:  The CLI tools could be integrated into SEOSONA OS to provide users with a powerful command-line interface for managing their digital environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `openai`, `gemini`, `embedding`, `rag`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
