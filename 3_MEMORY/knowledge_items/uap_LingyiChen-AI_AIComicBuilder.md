# KI: LingyiChen-AI/AIComicBuilder

## Overview
This project, "AI Comic Builder," appears to be a tool for generating comic books using AI models. The codebase includes components for script generation, character extraction, keyframe prompting, and video processing, suggesting an end-to-end workflow from initial concept to final comic output.  It leverages various AI providers like Google's Gemini and OpenAI.

## Tech Stack (from code)
- **TypeScript:** Used extensively throughout the project (`tsconfig.json`, `.ts` and `.tsx` files).
- **Next.js:** The `next.config.ts` file configures Next.js, indicating a React-based web application framework.
- **pnpm:**  The presence of `package.json` and `pnpm-lock.yaml` indicates pnpm is used as the package manager.
- **Drizzle ORM:** The `drizzle.config.ts` file shows Drizzle ORM is being used for database interactions, likely with SQLite (`dialect: "sqlite"`).
- **Tailwind CSS:**  The presence of `@tailwind` directives in `.tsx` files and the `postcss.config.mjs` file indicates Tailwind CSS is used for styling.

## Public API / Exports
Due to the size of the codebase, a comprehensive list isn't feasible. However, some notable exports include:

- **`src/lib/api-fetch.ts`**:  Exports an `ApiError` class and `apiFetch` function for making API requests with user ID headers.
- **`src/lib/assert-project-ownership.ts`**: Exports the `assertProjectOwnership` function to verify project ownership.
- **`src/lib/fingerprint.ts`**:  Exports `getUserId`, a function to retrieve the user ID from local storage.
- **`src/lib/id.ts`**: Exports an `id` function for generating unique identifiers.
- **`src/lib/shot-asset-utils.ts`**: Exports functions related to managing shot assets, including `getActiveAssets`.

## Dependencies
Based on the `package.json`, key dependencies include:

- `@ai-sdk/google`:  For interacting with Google AI services.
- `@ai-sdk/openai`: For interacting with OpenAI's models.
- `drizzle-orm`: An ORM for database interactions.
- `fluent-ffmpeg`: A library for video processing.
- `next`: The Next.js framework.
- `next-intl`:  For internationalization within the application.
- `openai`: For interacting with OpenAI's models.
- `react`: React library.
- `shadcn/ui`: UI components.

## Architecture Patterns
- **Modular Design:** Code is organized into directories like `agents`, `blog`, `drizzle`, and `docs`, suggesting a modular architecture.
- **Layered Architecture:**  The separation of concerns between API fetching (`src/lib/api-fetch.ts`), user authentication (`src/lib/fingerprint.ts`), and data access (Drizzle ORM) indicates a layered architectural pattern.
- **Configuration-Driven:** The use of `.env.example`, `next.config.ts`, and `drizzle.config.ts` suggests configuration is managed externally, allowing for flexibility in deployment environments.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Integration:** The integration with Google AI and OpenAI demonstrates a robust approach to incorporating large language models and image generation capabilities, which could be adapted for SEOSONA OS features.
- **Workflow Management:**  The structured workflow for comic creation (scripting, prompting, video processing) provides valuable insights into managing complex AI-driven tasks, potentially informing the design of similar workflows within SEOSONA OS.
- **Database Design:** The Drizzle ORM schema and migration scripts in the `drizzle/` directory offer a practical example of database design for applications involving multimedia assets and user data.  The structure could be adapted to manage SEOSONA's own data models.
- **API Abstraction:** The `src/lib/api-fetch.ts` file demonstrates how to abstract API requests, including adding headers for user identification – a pattern applicable to SEOSONA OS’s internal APIs.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `ffmpeg`, `render`, `hyperframe`
- **All scores:** {'seosona-os': 44, 'seosona-video': 66, 'seosona-content': 41, 'seosona-ux-ui': 33, 'seosona-flow': 28}
