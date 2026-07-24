# KI: apify/crawlee

## Overview
`apify/crawlee` is a scalable web crawling and scraping library for JavaScript/Node.js, designed to enable the development of data extraction and web automation jobs. It provides various crawlers (basic, browser-based, HTTP) and utilities for tasks like proxy management, request storage, and result handling. The project's code demonstrates a modular architecture with distinct packages for different crawler types and functionalities.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json` shows compilation to JavaScript).
- **Framework/Libraries:**  The project utilizes several libraries including `cheerio`, `playwright`, `puppeteer`, `got-scraping`, `jsdom`, and `impit`. These are declared as dependencies in the various package.json files (e.g., `packages\basic-crawler\package.json`).
- **Build System:** Yarn (`package.json` contains scripts using `yarn`), TypeScript (`tsconfig.json`).  The presence of `turbo.json` indicates usage of Turborepo for monorepo build management.

## Public API / Exports
Based on the `packages/core/src/index.ts` file, some key exports include:
- `enqueueLinks`: Function to enqueue links for crawling.
- `log`: Logging utility.
- `Browser`: An enum defining browser types (Chrome, Firefox).
- Classes and interfaces related to crawlers (`crawlers`), HTTP clients (`http_clients`), storage (`storages`), and request handling (`request`).
The `packages\crawlee\src\index.ts` file re-exports many of these from the core packages.

## Dependencies
Based on various `package.json` files within the repository, key dependencies include:
- `@apify/*`:  Multiple Apify related libraries (e.g., `@apify/datastructures`, `@apify/log`).
- `@crawlee/*`: Crawlee's own internal packages (e.g., `@crawlee/basic`, `@crawlee/browser`).
- `cheerio`: For parsing HTML.
- `playwright`:  A browser automation library.
- `puppeteer`: Another browser automation library.
- `got-scraping`: An HTTP client with scraping capabilities.
- `jsdom`: A JavaScript implementation of the DOM standard.
- `impit`: A library for impersonating browsers.

## Architecture Patterns
- **Monorepo:** The project is structured as a monorepo, utilizing workspaces (`packages/*` in `package.json`) to manage multiple related packages.
- **Modular Design:**  The codebase is divided into distinct packages (e.g., `basic-crawler`, `browser-crawler`, `http-crawler`), each responsible for a specific functionality. This promotes code reusability and maintainability.
- **Plugin Architecture:** The `packages/browser-pool` package demonstrates a plugin architecture, allowing different browser automation libraries (Playwright, Puppeteer) to be integrated.

## Relevance to SEOSONA OS
The Crawlee library's capabilities could benefit SEOSONA OS in several ways:
- **Automated Data Extraction:**  SEOSONA OS could use Crawlee to automatically extract data from websites for analysis and reporting.
- **Web Monitoring:** Crawlers can be used to monitor website changes, identify broken links, or track competitor activity.
- **Scalable Scraping:** The library's scalability features would allow SEOSONA OS to handle large-scale scraping tasks efficiently.  The proxy management and browser pool features are particularly relevant for avoiding bot detection and ensuring reliable data collection.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `scrap`, `crawl`, `playwright`, `puppeteer`, `cheerio`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
