# KI: Affitor/open-affiliate

## Overview
This repository, `Affitor/open-affiliate`, hosts a registry of affiliate programs and associated tooling for discovery and management. It provides an open API and CLI for accessing program data, along with tools for AI agents to interact with the registry. The project appears to be built around facilitating affiliate program discovery and integration into various applications.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the codebase (`tsconfig.json` contains compiler options).
- **Next.js:** Used as a framework for building the web application (`next.config.ts`, `package.json` includes `"next": "16.2.4"`).
- **React:** A core component of the Next.js frontend (`packages/sdk/src/index.ts` imports React components).
- **Node.js:** The runtime environment for both the backend and CLI tools (implied by `package.json`'s scripts and dependencies).
- **Supabase:** Used for data persistence, particularly in social media analysis (`src\lib\social.ts`, `src\lib\track.ts`).
- **PostHog:** Integrated for analytics tracking (`packages/cli/src/index.ts`, `packages/sdk/src/index.ts`).

## Public API / Exports
Based on the code, here's a summary of publicly accessible functionality:

*   **REST API:**  The project exposes a REST API at `https://openaffiliate.dev/api/` for searching and retrieving affiliate program data (e.g., `/api/programs`, `/api/categories`).
*   **MCP Server:** Provides an MCP server accessible via HTTP or stdio, allowing AI agents to interact with the registry (`packages/mcp/src/index.ts`).  Tools include `search_programs` and `get_program`.
*   **CLI:** A command-line interface for searching programs and managing data (e.g., `npx openaffiliate search`, `npx openaffiliate info`) (`packages\cli\package.json`).
*   **SDK:**  A TypeScript SDK provides programmatic access to the affiliate program registry (`packages/sdk/src/index.ts`). It includes functions like `search` and `get`.

## Dependencies
Based on `package.json`:

*   `@base-ui/react`: UI components.
*   `@modelcontextprotocol/sdk`: For MCP functionality.
*   `@supabase/supabase-js`:  For database interactions.
*   `class-variance-authority`: Utility for Tailwind CSS styling.
*   `clsx`: Utility for conditionally applying CSS classes.
*   `commander`: Used in the CLI tool (`packages\cli\package.json`).
*   `eslint`: For linting.
*   `lucide-react`: Icons.
*   `mcp-handler`: MCP handler library.
*   `next`: Next.js framework.
*   `openai`: OpenAI API client.
*   `postcss`: PostCSS processor.
*   `posthog-js`:  PostHog analytics integration.
*   `react`: React library.
*   `recharts`: Data visualization library.
*   `shadcn`: UI components and utilities.
*   `tailwind-merge`: Utility for merging Tailwind CSS classes.
*   `tw-animate-css`: CSS animation utility.
*   `yaml`: YAML parsing library.
*   `zod`: Schema validation library.

## Architecture Patterns
*   **Monorepo:** The project utilizes a monorepo structure with multiple packages (`packages/cli`, `packages/mcp`, `packages/scoring`, `packages/sdk`) managed by workspaces in `package.json`.
*   **API-First Design:**  The registry is primarily accessed through an API, suggesting a focus on programmatic access and integration.
*   **Agent-Centric Development:** The inclusion of MCP support and specific instructions for AI agents indicates a design consideration for automated interaction.
*   **Modular CLI:** The CLI tool is built with `commander`, promoting modularity and extensibility.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Affiliate Program Integration:**  The open API allows SEOSONA OS to directly integrate affiliate program data into its content generation, SEO optimization, or monetization features.
*   **AI Agent Enhancement:** The MCP server provides a structured way for SEOSONA's AI agents to access and utilize affiliate program information, improving the quality of recommendations and content creation.
*   **Data Enrichment:**  The detailed program data (commission rates, restrictions, agent prompts) can enrich SEOSONA’s understanding of various niches and improve targeting accuracy.
*   **Content Generation Inspiration:** The `agentPrompt` field in each affiliate program provides valuable insights for generating targeted content related to those programs.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 28}
