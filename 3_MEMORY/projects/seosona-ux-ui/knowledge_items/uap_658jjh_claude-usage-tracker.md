# KI: 658jjh/claude-usage-tracker

## Overview
This project, "AI Usage Tracker," is a tool designed to collect and track usage data from various local AI coding tools like Claude, Codex, Cursor, and others. It parses log files from these tools, attributes costs based on timestamps, and provides a dashboard for visualization. The application appears to be built primarily for macOS.

## Tech Stack (from code)
- **Swift:**  The primary language for the native macOS application is Swift, as evidenced by `src/App.swift` and the build script (`build-app.sh`) which compiles this file using `swiftc`.
- **JavaScript:** JavaScript is used for the dashboard's frontend logic and data processing, seen in files like `src/js/main.js`, `src/collect-usage.js`, and within the `src/js/components` directory.
- **CSS:**  Cascading Style Sheets (CSS) are utilized for styling the user interface, with multiple CSS files located in `src/css/` and `src/css/components/`.
- **Node.js:** The `collect-usage.js` file starts with a shebang (`#!/usr/bin/env node`), indicating it's intended to be executed using Node.js.
- **Build System:**  The project uses a shell script (`build-app.sh`) for building the macOS application, utilizing Swift and lipo (for creating universal binaries).

## Public API / Exports
Due to the limited scope of analysis (only source code), it's difficult to definitively determine a public API. However, `src/collect-usage.js` is designed to be run as a Node.js script (`#!/usr/bin/env node`), suggesting it can be executed from the command line.  The functions within this file are not explicitly exported; they appear to be internal utilities for data collection.

## Dependencies
Based on `src/collect-usage.js`, the following dependencies are used:
- **fs:** Node.js built-in module for interacting with the file system. (Line 3)
- **path:** Node.js built-in module for working with file paths. (Line 4)
- **os:** Node.js built-in module to get operating system information, specifically `os.homedir()` (Line 16).

The build script (`build-app.sh`) implies dependencies on:
- **swiftc**: Swift compiler
- **lipo**:  A tool for creating universal binaries.

There is no apparent package.json or other dependency manifest file in the provided code snippets, so a full list of dependencies cannot be determined.

## Architecture Patterns
- **Modular Design:** The project utilizes a modular structure with directories like `src/js/components`, `src/js/config`, and `src/utils` to organize JavaScript code into logical units.
- **Configuration Driven:**  The `collect-usage.js` script uses environment variables (`CLAUDE_USAGE_DATA_DIR`) for configuration, allowing flexibility in deployment locations.
- **Data Processing Pipeline:** The core functionality involves a pipeline: identifying relevant files, parsing their contents, transforming the data, and storing it.

## Relevance to SEOSONA OS
The project's focus on tracking resource usage could be valuable for SEOSONA OS.  Specifically:
- **Resource Monitoring:** Integrating the AI Usage Tracker’s data collection capabilities into SEOSONA OS could provide detailed insights into the consumption of AI resources by applications running within the operating system.
- **Cost Optimization:** The cost attribution features in the tracker could help users understand and optimize their spending on AI services, which is relevant for a resource-constrained environment like an embedded OS.
- **Swift Integration:**  The use of Swift aligns with potential SEOSONA OS development goals, allowing for code sharing or adaptation.

## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `component`
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
