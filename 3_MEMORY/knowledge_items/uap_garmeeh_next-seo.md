# KI: garmeeh/next-seo

## Overview
Next SEO is a plugin that makes managing your SEO easier in Next.js projects. It provides components for structured data (JSON-LD) that helps search engines understand your content better.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 92 files across 56 directories
- **File types:** .tsx: 48, .md: 15, .json: 7, .yml: 5, .ts: 4, .gitignore: 2, .mjs: 2

## Documentation Sections
- Next SEO
- 📋 Table of Contents
- 🚀 Quick Start
- Installation
- or
- or
- or
- Basic Usage
- Support This Project
- Components
- ArticleJsonLd
- ClaimReviewJsonLd
- CreativeWorkJsonLd

## Core Structure
```
  .editorconfig
  .gitignore
  .npmignore
  .prettierignore
  ADDING_NEW_COMPONENTS.md
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  CUSTOM_COMPONENTS.md
  LICENSE
  LICENSE.md
  LIST.md
  README.md
  eslint.config.mjs
  next-js-weekly.png
  package.json
  playwright.config.ts
  pnpm-lock.yaml
  pnpm-workspace.yaml
  repomix.config.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  .changeset/
    README.md
    config.json
  .github/
    dependabot.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      changeset-check.yml
      changesets.yml
      ci.yml
      release.yml
  .husky/
    pre-commit
  .vscode/
    settings.json
  examples/
    app-router-showcase/
      .gitignore
      CLAUDE.md
      README.md
      eslint.config.mjs
      next.config.ts
      package.json
      tsconfig.json
      app/
        favicon.ico
        globals.css
        layout.tsx
        page.module.css
        page.tsx
        aggregate-rating/
          page.tsx
        aggregate-rating-restaurant/
          page.tsx
        article/
          page.tsx
        blog-posting/
          page.tsx
        breadcrumb/
          page.tsx
          advanced/
            page.tsx
          multiple/
            page.tsx
        carousel-course/
          page.tsx
        carousel-movie/
          page.tsx
        carousel-recipe/
          page.tsx
        carousel-restaurant/
          page.tsx
        carousel-summary/
          page.tsx
        claim-review/
          page.tsx
        claim-review-advanced/
          page.tsx
        claim-review-organization/
          page.tsx
        course/
          page.tsx
        course-list/
          page.tsx
        course-list-summary/
          page.tsx
        creative-work/
          page.tsx
        creative-work-blog/
          page.tsx
        creative-work-multiple/
          page.tsx
        creative-work-news/
          page.tsx
        custom-podcast/
          page.tsx
        custom-service/
          page.tsx
        dataset/
          page.tsx
        dataset-advanced/
          page.tsx
        dataset-catalog/
          page.tsx
        dataset-nested/
          page.tsx
        discussion-forum/
          page.tsx
        discussion-forum-advanced/
          page.tsx
        discussion-forum-deleted/
          page.tsx
        employer-aggregate-rating/
          page.tsx
        employer-aggregate-rating-advanced/
          page.tsx
```

## Quick Start
```bash
npm install next-seo
yarn add next-seo
pnpm add next-seo
bun add next-seo
> **Note**: For standard meta tags (`<meta>`, `<title>`), use Next.js's built-in [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) function.
> **Pages Router Support**: If you're using Next.js Pages Router, import components from `next-seo/pages`. See the [Pages Router documentation](./src/pages/README.md) for details.
**Feel like supporting this free plugin?**
It takes a lot of time to maintain an open source project so any small contribution is greatly appreciated.
Coffee fuels coding ☕️
<a href="https://www.buymeacoffee.com/garmeeh" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
```

## Agent Configuration

--- AGENTS.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next SEO is a plugin that makes managing SEO easier in Next.js projects. It's built with TypeScript and provides components for structured data (JSON-LD) and SEO management.

## Critical Rules

You must check these after coming up with a plan
[ ] Your plan adheres to the guide found in @ADDING_NEW_COMPONENTS.md
[ ] Your plan adheres to the guidelines found below

## Development Commands

### Installation

```bash
pnpm install
```

### Build & Development

```bash
pnpm dev          # Watch mode with tsup
pnpm build        # Build library code
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format with Prettier
pnpm typecheck    # Type checking with TypeScript
```

### Testing

```bash
pnpm test         # Run typecheck + lint only
pnpm test:unit    # Run unit tests with Vitest
pnpm test:unit:watch  # Watch mode for unit tests
pnpm coverage     # Generate coverage report
# Requires pnpm build to run first
pnpm test:e2e     # Run E2E tests with Playwright
pnpm test:e2e:ui  # Run E2E tests with UI
```

### Example App

```bash
pnpm example:dev    # Run example app at localhost:3001
pnpm example:build  # Build example app
pnpm example:start  # Start example app
```

### Utilities

```bash
pnpm clean        # Clean build artifacts
```

## Project Architecture

### Core Structure

- **`/src`** - Library source code
  - **`/core`** - Core components like `JsonLdScript`
  - **`/types`** - TypeScript type definitions
  - **`/utils`** - Utility functions like `stringify`
- **`/examples/app-router-showcase`** - Example Next.js app for testing
- **`/tests`** - Test files
  - **`/unit`** - Unit tests (Vitest)
  - **`/e2e`** - E2E tests (Playwright)

### Build Configuration

- **tsup** - For building the library (see `tsup.config.ts`)
- Outputs both CommonJS and ESM formats
-

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next SEO is a plugin that makes managing SEO easier in Next.js projects. It's built with TypeScript and provides components for structured data (JSON-LD) and SEO management.

## Critical Rules

You must check these after coming up with a plan
[ ] Your plan adheres to the guide found in @ADDING_NEW_COMPONENTS.md
[ ] Your p

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
