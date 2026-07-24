# KI: mrexodia/ida-pro-mcp

## Overview
This repository contains a server for IDA Pro, exposing its functionality via the MCP (Machine Code Protocol). It allows remote access and control of IDA Pro, enabling features like decompilation, disassembly, and analysis through an external interface. The project includes components for both the IDA plugin side and the server-side logic.

## Tech Stack (from code)
- **Python:**  The primary language used throughout the codebase. This is evident from files such as `pyproject.toml` which specifies `requires-python = ">=3.11"` and numerous `.py` files in the `src/ida_pro_mcp` directory.
- **uv**: Used for running the server and related tasks, indicated by the presence of `pyproject.toml` with `[project.scripts]` defining commands like `ida-pro-mcp = "ida_pro_mcp.server:main"` and a file named `uv.lock`.
- **idapro**: A Python library for interacting with IDA Pro, listed as a dependency in `pyproject.toml`: `dependencies = ["idapro>=0.0.9"]`.
- **Setuptools:** Used as the build backend, specified in `pyproject.toml` under `[build-system]`.

## Public API / Exports
Based on the `pyproject.toml` file's `[project.scripts]` section, the following scripts are exposed:
- `ida-pro-mcp`:  Maps to `ida_pro_mcp.server:main`, likely the primary entry point for the MCP server.
- `idalib-mcp`: Maps to `ida_pro_mcp.idalib_supervisor:main`, suggesting a separate component for managing an idalib (IDA library) instance.
- `ida-mcp-test`:  Maps to `ida_pro_mcp.test:main`, used for running tests related to the MCP server.
- `ida-mcp-trace-dump`: Maps to `ida_pro_mcp.trace_dump:main`, likely responsible for dumping trace data.

## Dependencies
From `pyproject.toml`:
- `idapro>=0.0.9`
- `tomli-w>=1.0.0`
- For development (`dev` dependency group):
    - `coverage>=7.13.4`
    - `jsonschema>=4.0`
    - `mcp>=1.0`
    - `pytest>=9.0.3`

## Architecture Patterns
- **RPC (Remote Procedure Call):** The project heavily utilizes RPC for communication between the client and server, as indicated by the use of `@tool` and `@idasync` decorators in code snippets within `CLAUDE.md`.  This suggests a structured approach to exposing IDA Pro functionality remotely.
- **Modular Design:** The codebase is organized into modules like `api_core`, `api_analysis`, `api_memory`, etc., suggesting a modular design for different aspects of IDA Pro interaction. This is mentioned in `CLAUDE.md`: "Important API modules: ...".
- **Asynchronous Programming:**  The use of `@idasync` suggests the adoption of asynchronous programming to handle multiple client requests concurrently, improving performance and responsiveness.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing a framework for remote IDA Pro analysis capabilities. The ability to expose IDA Pro functionality via MCP allows for integration with automated reverse engineering workflows within the operating system.  Specifically:

- **Automated Malware Analysis:** SEOSONA OS could leverage the `ida-pro-mcp` server to automatically analyze suspicious files by sending them to IDA Pro and retrieving analysis results programmatically.
- **Dynamic Code Instrumentation:** The exposed APIs (e.g., memory patching, debugging control) can be used for dynamic code instrumentation within a controlled environment managed by SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
