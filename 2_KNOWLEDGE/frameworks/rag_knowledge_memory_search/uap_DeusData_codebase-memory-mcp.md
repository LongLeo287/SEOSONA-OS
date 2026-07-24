# KI: DeusData/codebase-memory-mcp

## Overview
This project, codebase-memory-mcp, appears to be a command-line tool and optional HTTP server for analyzing memory usage in software projects. The core functionality involves extracting information from source code (likely C/C++ based on the file extensions) and potentially visualizing it through a web UI.  The `main.c` file indicates that it can run as an MCP server, a CLI tool, or with an optional HTTP UI.

## Tech Stack (from code)
- **C:** The project is heavily reliant on C source files (`.c`, `.h`). File `src/main.c` serves as the entry point.
- **JSON:**  The project uses `yyjson` library, included in `src/main.c`. This suggests JSON data handling and potentially for configuration or communication.
- **TypeScript/React:** The `graph-ui` directory contains `.tsx`, `.ts`, `.js`, and `package.json` files, indicating a React-based web UI built with TypeScript.  The presence of `vite.config.ts` confirms the use of Vite as a build tool.
- **Bash:** The `install.sh` script is used for installation purposes.
- **Build System:** A `Makefile.cbm` exists, suggesting a custom build system named "cbm".

## Public API / Exports
Due to the limited scope of analysis (only source code), it's difficult to definitively list all public APIs. However, based on `src/main.c`, we can identify some key functions and concepts:

- **`cbm_alloc_init()`:**  Called in `src/main.c` to initialize memory allocators.
- **MCP Server Interface:** The project implements a JSON-RPC 2.0 interface as an MCP server, indicated by the inclusion of `mcp/mcp.h` and `mcp/index_supervisor.h`.  This suggests exposed endpoints for interacting with the analysis engine.
- **CLI Arguments:** The `main.c` file defines command-line arguments like `--ui`, `--port`, and `--help`, implying a CLI interface.

## Dependencies
Based on the available code, direct dependencies are difficult to ascertain without examining build files or package manifests beyond what's provided. However, we can infer some:

- **yyjson:** Included directly in `src/main.c`.
- **React & related libraries:** Used within the `graph-ui` directory (evident from `package.json`).  The contents of `graph-ui/package.json` would provide a more complete list, but are not available for this analysis.

## Architecture Patterns
- **Modular Design:** The project is structured into distinct directories like `internal`, `cli`, `watcher`, and `ui`, suggesting a modular architecture.
- **Background Threads:**  The `main.c` file mentions background threads for the watcher and HTTP UI server, indicating asynchronous operations.
- **Plugin/Extension Points (Potential):** The presence of "extract" scripts in the `internal/cbm` directory (`extract_calls.c`, `extract_channels.c`, etc.) suggests a plugin or extension mechanism where different analysis modules can be added to extract specific information from code.

## Relevance to SEOSONA OS
- **Memory Analysis Tooling:** The core functionality of analyzing memory usage could be integrated into SEOSONA OS's development workflow for identifying and resolving memory leaks or inefficiencies in system components.
- **Customizable Extraction Rules:**  The "extract" scripts within the `internal/cbm` directory offer a potential avenue for customizing the analysis to focus on specific aspects relevant to SEOSONA OS, such as kernel data structures or driver behavior.
- **Web UI Integration:** The React-based web UI could be adapted to provide a visual representation of memory usage metrics within the SEOSONA OS development environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `sitemap`, `robots`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
