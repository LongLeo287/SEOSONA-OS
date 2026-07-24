# KI: dembrandt/dembrandt

## Overview
Dembrandt is a command-line tool designed to extract design tokens and publicly visible CSS information from websites. It leverages Playwright for browser automation and provides various output formats including JSON, HTML reports, PDF documents, and Markdown files. The project aims to facilitate the creation of design systems and documentation by automating the process of gathering design assets from live web pages.

## Tech Stack (from code)
- **Language:** TypeScript (`index.ts`, `tsconfig.json`)
- **Framework/Libraries:** Playwright (`lib/browser.ts`), Commander.js (`index.ts`), Chalk (`index.ts`), Ora (`index.ts`), Zod, `@modelcontextprotocol/sdk` (mcp-server.ts)
- **Build System:**  TypeScript compiler (`tsconfig.json`, `package.json` script "build")
- **Module Bundler:**  Likely Rollup or similar, as the `tsconfig.json` targets ES2022 and uses NodeNext module resolution.

## Public API / Exports
Based on `package.json`'s `exports` section:

- `.`: `./dist/index.js` - The main entry point for the CLI tool.
- `./dtcg`: `./dist/lib/dtcg/validate.js` -  Exports functionality related to DTCG (Design Token Common Format).
- `./drift`: Exports drift detection utilities (`./dist/lib/drift.d.ts`, `./dist/lib/drift.js`).
- `./report`: Exports HTML report generation functions (`./dist/lib/formatters/html.d.ts`, `./dist/lib/formatters/html.js`).
- `./findings`: Exports design findings and consistency score calculations (`./dist/lib/findings.d.ts`, `./dist/lib/findings.js`).
- `./normalize`: Exports normalization utilities for design tokens (`./dist/lib/normalize.js`).
- `./types`: Exports type definitions related to design tokens (`./dist/lib/types.d.ts`, `./dist/lib/types.js`).

## Dependencies
Based on `package.json`:

- Playwright (implicitly, through `playwright-core`)
- Commander.js
- Chalk
- Ora
- TypeScript
- Zod
- `@modelcontextprotocol/sdk`
- Many other dependencies related to testing, linting, and formatting.  A full list would be extensive.

## Architecture Patterns
- **Modular Design:** The codebase is organized into `lib/` directories for distinct functionalities (browser management, extraction, formatting, etc.).
- **Plugin-like Structure:** The use of `exports` in `package.json` suggests a potential plugin architecture or the ability to extend functionality through separate modules.
- **Configuration-Driven:**  The CLI uses Commander.js to handle command-line arguments and options, making it highly configurable.
- **Asynchronous Operations:** Heavy reliance on Promises (`async/await`) for browser automation and parallel processing (e.g., in `extractBranding`).
- **Error Handling with Custom Error Types**: The code defines custom error types like `PlaywrightMissingError` and `McpDepsMissingError` to provide more specific error messages.



## Relevance to SEOSONA OS
Dembrandt's capabilities could be valuable for SEOSONA OS in several ways:

- **Automated Design System Auditing:**  The drift detection functionality (`lib/drift.ts`) can be integrated into a CI/CD pipeline to automatically monitor design system changes and ensure consistency across different platforms or deployments within the SEOSONA ecosystem.
- **Design Token Extraction for New Platforms:** When integrating SEOSONA with new websites or applications, Dembrandt could automate the extraction of existing design tokens, reducing manual effort and ensuring adherence to brand guidelines.
- **Content Generation:** The HTML report generation (`lib/formatters/html.js`) can be used to automatically create documentation for design systems, making it easier for developers and designers to understand and use them.
- **MCP Integration**:  The `mcp-server.ts` file suggests an integration with Claude's Model Context Protocol (MCP), which could allow SEOSONA to leverage Dembrandt’s capabilities within a larger AI-powered workflow.

## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `design-system` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `design-system`, `design-token`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 56, 'seosona-flow': 0}
