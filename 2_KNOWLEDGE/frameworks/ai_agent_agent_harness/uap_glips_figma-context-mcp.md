# KI: glips/figma-context-mcp

## Overview
This project, `figma-developer-mcp`, provides a Model Context Protocol (MCP) server that allows AI coding tools to access and utilize Figma design data. It fetches Figma files via the Figma API, simplifies the response, and serves it to AI clients in various formats like YAML or JSON. The goal is to enable one-shot implementation of designs within different frameworks.

## Tech Stack (from code)
- **TypeScript:**  The primary language, evidenced by numerous `.ts` files (`tsconfig.json`, `src/index.ts`).
- **Node.js:** Used as the runtime environment, indicated by `package.json`: `"type": "module"` and `engines: { "node": ">=20.20.0" }`.
- **Express.js:**  Used for building the HTTP server (`src/services/figma.ts` imports from express).
- **Tsup:** Used as a build tool, specified in `package.json`: `"build": "tsup --dts"` and `tsup.config.ts`.
- **Vitest:**  Used for testing, indicated by `package.json`: `"test": "vitest run"` and `vitest.config.ts`.
- **ESM**: The project uses ES modules as evidenced by the `type: "module"` in package.json

## Public API / Exports
Based on `src/index.ts`, the following are exported:

- `SimplifiedDesign`: A type definition (likely for simplified Figma design data).
- `ExtractorFn`, `TraversalContext`, `TraversalOptions`, `GlobalVars`, `StyleTypes`: Types related to the design extraction process.
- Functions from `extractors/index.ts`:  `extractFromDesign`, `simplifyRawFigmaObject`, `layoutExtractor`, `textExtractor`, `visualsExtractor`, `componentExtractor`, `allExtractors`.
- Functions for specific extraction combinations: `layoutAndText`, `contentOnly`, `visualsOnly`, `layoutOnly`.
- Utility functions: `collapseSvgContainers`.

## Dependencies
Based on `package.json`:

- `@figma/rest-api-spec`:  For interacting with the Figma API.
- `@modelcontextprotocol/sdk`: For implementing the Model Context Protocol.
- `express`: For building the HTTP server.
- `js-yaml`: For YAML serialization.
- `undici`: An HTTP client.
- `zod`: A schema declaration and validation library.

## Architecture Patterns
- **Modular Design:** The project is structured into modules like `extractors`, `services`, `telemetry`, and `utils`, suggesting a modular design approach.
- **Extractor Pattern:**  A key pattern involves extracting specific information from Figma designs using dedicated extractors (e.g., `layoutExtractor`, `textExtractor`).
- **Configuration Driven:** The server's behavior is configurable through environment variables (`FIGMA_API_KEY`, `PORT`) and command-line flags, promoting flexibility.
- **MCP Server Implementation**:  The project implements a Model Context Protocol (MCP) server using the `@modelcontextprotocol/sdk`.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Design Integration:** The Figma API interaction and data simplification logic can be leveraged to integrate design assets directly into SEOSONA OS workflows. This would allow for automated generation of UI elements or visual components based on Figma designs.
- **AI Agent Enhancement:**  The MCP server functionality provides a standardized way for AI agents within SEOSONA OS to access and understand Figma design data, improving their ability to assist with development tasks.
- **Code Generation:** The extraction and simplification process could be adapted to generate code snippets or entire UI components from Figma designs, accelerating the software development lifecycle.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
