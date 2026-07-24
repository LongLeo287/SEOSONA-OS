# KI: mishushakov/llm-scraper

## Overview
This project, `llm-scraper`, is designed to extract structured data from webpages using Large Language Models (LLMs). It leverages Playwright for browser automation and the AI SDK for interacting with LLMs. The tool provides functionalities to scrape content, generate code for scraping, and stream responses from LLMs.

## Tech Stack (from code)
- **TypeScript:**  Source code is written in TypeScript (`tsconfig.json`: `"include": ["src/**/*.ts"]`).
- **Playwright:** Used for browser automation (`package.json`: `"dependencies": {"playwright": "^1.58.2"}`).
- **AI SDK:** Provides an abstraction layer for interacting with LLMs (`package.json`: `"dependencies": {"@ai-sdk/provider": "^3.0.8", "ai": "^6.0.77"}`).
- **Turndown:**  Used to convert HTML to Markdown (`src/preprocess.ts`: `import Turndown from 'turndown'`).
- **Vite:** Used as the build tool (`vitest.config.ts`, `package.json`: `"scripts": {"build": "tsc -p tsconfig.json"}`).
- **Zod**:  Used for schema validation (likely in models, but not visible in provided code).

## Public API / Exports
Based on the exported members from `src/index.ts`:

- **`LLMScraper` class:** The main entry point for scraping operations.
    - `constructor(client: LanguageModel)`:  Constructor to initialize with a language model client.
    - `run<OUTPUT extends Output.Output = Output.Output<string, string>>(page: Page, output: OUTPUT, options?: ScraperRunOptions)`: Executes the scraping process and returns data.
    - `stream<OUTPUT extends Output.Output = Output.Output<string, string>>(page: Page, output: OUTPUT, options?: ScraperRunOptions)`:  Streams the scraping results.
    - `generate<OUTPUT extends Output.Output = Output.Output<string, string>>(page: Page, output: OUTPUT, options?: ScraperGenerateOptions)`: Generates code for scraping data from a webpage.

## Dependencies
Based on `package.json`:

- `@ai-sdk/provider`: "^3.0.8"
- `@ai-sdk/openai`: "^3.0.26" (Dev Dependency)
- `ai`: "^6.0.77"
- `playwright`: "^1.58.2"
- `turndown`: "^7.2.2"
- TypeScript: "^5.9.3" (Dev Dependency)
- Vitest: "^4.0.18" (Dev Dependency)
- Zod: "^4.3.6"

## Architecture Patterns
- **Class-based Structure:** The core logic is encapsulated within the `LLMScraper` class, promoting modularity and reusability.
- **Strategy Pattern (Preprocessing):**  The `preprocess` function uses a strategy pattern to handle different content formats (HTML, Markdown, text, image, custom). This allows for flexible data extraction based on user preferences or specific webpage structures.
- **Abstraction:** The AI SDK is used as an abstraction layer over LLM providers, allowing the scraper to potentially work with different models without significant code changes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Automated Data Extraction:**  The core functionality of scraping data from webpages can be integrated into SEOSONA OS for automated data collection and analysis tasks.
- **Customizable Scraping Logic:** The flexible preprocessing options allow SEOSONA OS to adapt the scraping process to various website structures and content formats. This is particularly useful for extracting specific information from diverse sources.
- **Code Generation Capabilities:**  The ability to generate scraping code could be leveraged by SEOSONA OS to create custom scrapers on demand, reducing development time and effort.
- **Integration with AI Models:** The project's use of the AI SDK demonstrates a clear path for integrating LLMs into SEOSONA OS workflows, enabling more sophisticated data processing and analysis capabilities.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `scrap`, `playwright`, `puppeteer`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
