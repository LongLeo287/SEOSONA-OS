# KI: event-catalog/eventcatalog

## Overview
EventCatalog is an open-source documentation tool for Event-Driven Architectures, designed to help teams document events, commands, queries, services, domains, and flows in a discoverable catalog. It's built as a monorepo using Turborepo and pnpm workspaces, containing packages for core application logic, SDK development, CLI tools, and visualization components. The project aims to provide a structured way to manage and understand complex event-driven systems.

## Tech Stack (from code)
- **TypeScript:**  Widely used throughout the codebase (`packages/breaking-changes/src/index.ts`, `packages/core/package.json` lists TypeScript as a dependency).
- **Astro:** The core application utilizes Astro for building the documentation site (`packages/core/package.json` includes `@astrojs/*` dependencies and scripts like `astro dev`).
- **React:** React components are used within the Astro framework (`packages/core/package.json` lists `@astrojs/react`, and code in packages like `visualiser` uses React).
- **Turborepo:**  Used for monorepo management, as evidenced by the presence of `turbo.json` and scripts utilizing `turbo` in `package.json`.
- **pnpm:** Package manager used to manage dependencies (`package.json`, `pnpm-lock.yaml`).
- **Langium:** Used for language server functionality (`packages/language-server/package.json`).

## Public API / Exports
Based on the code, here's a sampling of exported items:

*   **`@eventcatalog/core`**:  Exports components and pages related to the EventCatalog application (found in `packages/core/src/components`, `packages/core/src/pages`).
*   **`@eventcatalog/cli`**: Exports the `eventcatalog` CLI command (`packages/cli/package.json`'s `bin` section).
*   **`@eventcatalog/sdk`**:  Exports functions for interacting with EventCatalog programmatically, including methods for managing events, commands, and services (`packages/sdk/src/index.ts`).
*   **`@eventcatalog/language-server`**: Exports the `EcServices`, `EcCompletionProvider`, and other language server related types and functions (`packages/language-server/src/index.ts`).
*   **`@eventcatalog/visualiser`**:  Exports React components for visualizing event flows and architectures (`packages/visualiser/src/index.ts`).

## Dependencies
Key dependencies (from `package.json` and package-specific lockfiles):

*   `astro`: For building the documentation site.
*   `react`: Core UI library.
*   `typescript`:  For type safety and development.
*   `langium`: Language server framework.
*   `commander`: Command-line argument parsing (`packages/cli`).
*   `js-yaml`: YAML parsing (`packages/language-server`).
*   `@xyflow/react`: Used in the visualiser package for graph rendering.

## Architecture Patterns
*   **Monorepo:** The project is structured as a monorepo, with multiple packages sharing code and dependencies. This promotes code reuse and simplifies dependency management (evident from `pnpm-workspace.yaml`).
*   **Component-Based UI:**  The user interface heavily relies on React components (`packages/core`, `@eventcatalog/visualiser`).
*   **Plugin Architecture**: The language server appears to use a plugin architecture, allowing for extensibility and customization of the parsing and analysis capabilities (evident in `packages/language-server`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Event-Driven Architecture Documentation:**  SEOSONA OS is likely to involve event-driven components. EventCatalog provides a framework for documenting these systems, improving understanding and maintainability.
*   **CLI Tooling:** The CLI tool (`@eventcatalog/cli`) could be adapted or integrated into SEOSONA OS workflows for automating documentation tasks.
*   **Visualization Components:**  The visualization components in `@eventcatalog/visualiser` can be used to create interactive diagrams of SEOSONA OS's event flows and system architecture, aiding in debugging and design reviews.
*   **Language Server Integration**: The language server functionality could be leveraged to provide real-time feedback and code completion for developers working with SEOSONA OS’s domain-specific languages or configurations.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 56}
