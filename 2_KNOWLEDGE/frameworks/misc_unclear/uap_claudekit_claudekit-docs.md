# KI: claudekit/claudekit-docs

## Overview
This repository hosts documentation for ClaudeKit, a suite of tools and services related to AI agent development and deployment. The codebase is structured as a static website built using Astro, providing content in both English and Vietnamese.  The project emphasizes code quality checks and automated processes for maintaining the documentation's accuracy and consistency.

## Tech Stack (from code)
- **JavaScript/TypeScript:** Used extensively throughout the codebase (`src\lib\openrouter.ts`, `tsconfig.json`). The `tsconfig.json` file explicitly extends "astro/tsconfigs/strict" and includes TypeScript files in its include list, confirming TypeScript usage.
- **Astro:**  The primary framework for building the website. This is evident from the presence of `astro.config.mjs`, Astro component files (`.astro`), and scripts within `package.json` like "astro dev", "astro build", and "astro preview".
- **React:** Used as a component framework within Astro, indicated by `@astrojs/react` dependency in `package.json` and the presence of `.tsx` files (e.g., `src\components`).
- **Tailwind CSS:**  Used for styling, confirmed by the `@astrojs/tailwind` dependency and `tailwind.config.mjs`.
- **Bun:** Used as a package manager and runtime environment. This is evident from the presence of `bun.lock` and usage in scripts like "bun install" and "bun run".

## Public API / Exports
Due to the nature of this being documentation, there are no traditional public APIs or endpoints exposed. However, the following files define reusable components and utilities that would be considered part of the project's internal API:

- **`src\lib\openrouter.ts`:** Defines `OpenRouterClient` class for interacting with OpenRouter API.  It exports functions like `chat` and `streamChat`.
```typescript
// src\lib\openrouter.ts
export interface ChatMessage { ... }
export interface ChatOptions { ... }
export class OpenRouterClient { ... }
```
- **`src\lib\sidebar-nav-section-config.ts`:** Defines configuration for the sidebar navigation, exporting interfaces like `NavSectionConfig` and functions to process and group documentation sections.
```typescript
// src\lib\sidebar-nav-section-config.ts
export interface NavSectionConfig { ... }
export function capitalizeCategoryLabel(label: string) { ... }
```

## Dependencies
Based on the contents of `package.json`:

- **Core Astro Packages:** `@astrojs/check`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/tailwind`
- **UI Library:**  `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-scroll-area`
- **AI Integration:** `openai`
- **Markdown Rendering:** `react-markdown`, `rehype-autolink-headings`, `rehype-katex`, `rehype-slug`, `remark-gfm`, `remark-math`
- **Utilities:**  `astro-pagefind`, `unist-util-visit`

## Architecture Patterns
- **Component-Based Architecture:** The use of React components within Astro suggests a component-based architecture for building UI elements.
- **Content Management through Markdown:** Documentation is primarily authored in Markdown files, which are then processed and rendered by Astro.
- **Internationalization (i18n):**  The presence of `src/content/docs` and `src/content/docs-vi` directories indicates support for multiple languages (English and Vietnamese). The project likely uses a translation management system or process to handle localization.
- **Static Site Generation:** Astro's role as a static site generator is confirmed by the build process described in the Dockerfile, which creates a `dist` directory containing static assets.

## Relevance to SEOSONA OS
This documentation repository could benefit SEOSONA OS in several ways:

- **AI Agent Integration Examples:** The ClaudeKit project focuses on AI agent development and deployment.  The code examples and documentation within this repository could provide valuable insights and patterns for integrating similar functionality into SEOSONA OS.
- **Content Management Best Practices:** The structured approach to content management, including the use of Markdown files, frontmatter, and category organization, can be adopted by SEOSONA OS to improve its own documentation processes.
- **Internationalization Strategies:**  The Vietnamese language support demonstrates a practical implementation of internationalization. This could inform SEOSONA OS's efforts to expand its reach to new markets and user bases.
- **Build System & Deployment Pipeline:** The Dockerfile provides a clear example of how to build and deploy a static website, which can be adapted for SEOSONA OS projects.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
