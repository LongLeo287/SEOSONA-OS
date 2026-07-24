# KI: stellarlinkco/myclaude

## Overview
This project, `myclaude`, appears to be a system for managing and deploying Claude AI agent workflows. It provides tools for installing, configuring, and running these agents, likely as extensions or integrations within the Claude environment. The codebase includes scripts for installation, uninstallation, deployment, and testing of various modules related to code generation, debugging, and requirements management.

## Tech Stack (from code)
- **Languages:** Primarily Go (`go.work`, 114 `.go` files), Python (`install.py`, `uninstall.py`), and JavaScript (`package.json`).
- **Build System:**  Makefile is used for build tasks, with `go mod` managing Go dependencies (see `go.mod`, `go.sum`).  Node Package Manager (npm) is implied by the presence of `package.json`.
- **Configuration:** JSON files are extensively used for configuration (`config.json`, `config.schema.json`, `.claude-plugin/plugin.json` within various directories).
- **Version Control:** Git is used, evidenced by `.gitattributes`, `.gitignore`, and the use of git commands in the Makefile (e.g., `changelog`).

## Public API / Exports
Due to the nature of this project as a deployment tool, there isn't a traditional public API exposed directly through code files. However, based on the scripts, the following functionalities are "exported" or accessible:

- **`codeagent-wrapper/cmd/codeagent-wrapper/main.go`**: This file contains the `main` function for the `codeagent-wrapper` executable, which appears to be a core component of the system.  It likely exposes command-line arguments and handles agent execution.
```go
// codeagent-wrapper/cmd/codeagent-wrapper/main.go
package main

import (
	"os"

	"github.com/stellarlinkco/myclaude/internal/adapter/cli"
)

func main() {
	if err := cli.Execute(); err != nil {
		os.Exit(1)
	}
}
```
- **Slash Commands:** The Makefile and deployment scripts indicate the existence of slash commands like `/bmad-pilot`. These are likely exposed to the Claude environment for user interaction.

## Dependencies
Based on `package.json` and `go.mod`:

- **JavaScript/Node.js:**  Dependencies listed in `package.json` include:
    - `"name": "myclaude"`
    - `"version": "6.7.0"`
    - `"license": "AGPL-3.0"`
    - `"bin": { "myclaude": "bin/cli.js" }`
- **Go:** Dependencies listed in `go.mod`:
    -  (A large number of dependencies are present, including but not limited to: `github.com/stellarlinkco/myclaude/internal/adapter/cli`, etc.)

## Architecture Patterns
- **Modular Design:** The project is highly modular, with agents and commands organized into separate directories (e.g., `agents/bmad`, `commands/bmad-pilot`).  This suggests a plugin-based architecture where functionality can be added or removed easily.
- **Configuration-Driven:** Agent behavior and deployment are heavily driven by configuration files (`config.json`, `.claude-plugin/plugin.json`), allowing for customization without modifying code.
- **Command-Line Interface (CLI):** The `codeagent-wrapper` component provides a CLI, likely used for interacting with the system programmatically or from scripts.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Agent Framework:**  The modular agent framework and configuration-driven design could be adapted to create a plugin architecture for extending SEOSONA OS functionality. This would allow developers to easily add new capabilities without modifying the core system.
- **CLI Tools:** The CLI tools developed for managing Claude agents could serve as inspiration or even be directly integrated into SEOSONA OS for automating tasks and interacting with external services.
- **Workflow Automation:**  The workflow management aspects of `myclaude` (e.g., deploying sequences of agents) could inform the development of similar automation capabilities within SEOSONA OS, enabling complex tasks to be executed automatically. The use of JSON configuration files is a particularly valuable pattern for defining and managing these workflows.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
