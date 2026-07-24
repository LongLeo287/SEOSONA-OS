# KI: ItzCrazyKns/Vane

## Overview
Vane is a **privacy-focused AI answering engine** that runs entirely on your own hardware. It combines knowledge from the vast internet with support for **local LLMs** (Ollama) and cloud providers (OpenAI, Claude, Groq), delivering accurate answers with **cited sources** while keeping your searches completely private.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 106 files across 42 directories
- **File types:** .svg: 26, .ts: 21, .png: 10, .tsx: 10, .md: 9, .json: 8, .sql: 3
- **Key dependencies:** @google/genai, @headlessui/react, @headlessui/tailwindcss, @huggingface/transformers, @icons-pack/react-simple-icons, @mozilla/readability, @phosphor-icons/react, @radix-ui/react-tooltip, @tailwindcss/typography, @toolsycc/json-repair, async-mutex, axios
- **Dev dependencies:** @types/better-sqlite3, @types/jsdom, @types/jspdf, @types/node, @types/pdf-parse, @types/react, @types/react-dom, @types/react-syntax-highlighter

## Core Capabilities
🤖 **Support for all major AI providers** - Use local LLMs through Ollama or connect to OpenAI, Anthropic Claude, Google Gemini, Groq, and more. Mix and match models based on your needs.

⚡ **Smart search modes** - Choose Speed Mode when you need quick answers, Balanced Mode for everyday searches, or Quality Mode for deep research.

🧭 **Pick your sources** - Search the web, discussions, or academic papers. More sources and integrations are in progress.

🧩 **Widgets** - Helpful UI cards that show up when relevant, like weather, calculations, stock prices, and other quick lookups.

🔍 **Web search powered by SearxNG** - Access multiple search engines while keeping your identity private. Support for Tavily and Exa coming soon for even better results.

📷 **Image and video search** - Find visual content alongside text results. Search isn't limited to just articles anymore.

📄 **File uploads** - Upload documents and ask questions about them. PDFs, text files, images - Vane understands them all.

🌐 **Search specific domains** - Limit your search to specific websites when you know where to look. Perfect for technical documentation or research papers.

💡 **Smart suggestions** - Get intelligent search suggestions as you type, helping you formulate better queries.

📚 **Discover** - Browse interesting articles and trending content throughout the day. Stay informed without even searching.

🕒 **Search history** - Every search is saved locally so you can revisit your discoveries anytime. Your research is never lost.

✨ **More coming soon** - We're actively developing new features based on community feedback. Join our Discord to help shape Vane's future!

## Documentation Sections
- Vane 🔍
- ✨ Features
- Sponsors
- **✨ [Try Warp - The AI-Powered Terminal →](https://www.warp.dev/vane)**
- Installation
- Getting Started with Docker (Recommended)
- Non-Docker Installation
- Troubleshooting
- Using as a Search Engine
- Using Vane's API
- Expose Vane to network
- One-Click Deployment
- Upcoming Features
- Support Us
- Donations

## Available Commands
- `npm run dev` -- next dev
- `npm run build` -- next build --webpack
- `npm run start` -- next start
- `npm run lint` -- next lint
- `npm run format:write` -- prettier . --write

## Core Structure
```
  .dockerignore
  .eslintrc.json
  .gitignore
  .prettierignore
  .prettierrc.js
  CONTRIBUTING.md
  Dockerfile
  Dockerfile.slim
  LICENSE
  README.md
  docker-compose.yaml
  drizzle.config.ts
  entrypoint.sh
  next-env.d.ts
  next.config.mjs
  package.json
  postcss.config.js
  tailwind.config.ts
  tsconfig.json
  yarn.lock
  .assets/
    demo.gif
    manifest.json
    vane-screenshot.png
    sponsers/
      exa.png
      warp.png
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      custom.md
      feature_request.md
    workflows/
      docker-build.yaml
  data/
    .gitignore
  docs/
    API/
      SEARCH.md
    architecture/
      README.md
      WORKING.md
    installation/
      UPDATING.md
  drizzle/
    0000_fuzzy_randall.sql
    0001_wise_rockslide.sql
    0002_daffy_wrecker.sql
    meta/
      0000_snapshot.json
      0001_snapshot.json
      0002_snapshot.json
      _journal.json
  public/
    icon-100.png
    icon-50.png
    icon.png
    next.svg
    vercel.svg
    fonts/
      pp-ed-ul.otf
    screenshots/
      p1.png
      p1_small.png
      p2.png
      p2_small.png
    weather-ico/
      clear-day.svg
      clear-night.svg
      cloudy-1-day.svg
      cloudy-1-night.svg
      fog-day.svg
      fog-night.svg
      frost-day.svg
      frost-night.svg
      rain-and-sleet-mix.svg
      rainy-1-day.svg
      rainy-1-night.svg
      rainy-2-day.svg
      rainy-2-night.svg
      rainy-3-day.svg
      rainy-3-night.svg
      scattered-thunderstorms-day.svg
      scattered-thunderstorms-night.svg
      severe-thunderstorm.svg
      snowy-1-day.svg
      snowy-1-night.svg
      snowy-2-day.svg
      snowy-2-night.svg
      snowy-3-day.svg
      snowy-3-night.svg
  searxng/
    limiter.toml
    settings.yml
    uwsgi.ini
  src/
    instrumentation.ts
    app/
      favicon.ico
      globals.css
      layout.tsx
      manifest.ts
      page.tsx
      api/
        chat/
          route.ts
        chats/
          route.ts
          [id]/
            route.ts
        config/
          route.ts
          setup-complete/
            route.ts
        discover/
          route.ts
        images/
          route.ts
        providers/
          route.ts
          [id]/
            route.ts
            models/
              route.ts
        reconnect/
          [id]/
            route.ts
        search/
          route.ts
        suggestions/
          route.ts
        uploads/
          route.ts
        videos/
          route.ts
        weather/
      
```

## Quick Start
```bash
docker run -d -p 3000:3000 -v vane-data:/home/vane/data --name vane itzcrazykns1337/vane:latest
docker run -d -p 3000:3000 -e SEARXNG_API_URL=http://your-searxng-url:8080 -v vane-data:/home/vane/data --name vane itzcrazykns1337/vane:slim-latest
git clone https://github.com/ItzCrazyKns/Vane.git
docker build -t vane .
docker run -d -p 3000:3000 -v vane-data:/home/vane/data --name vane vane
git clone https://github.com/ItzCrazyKns/Vane.git
cd Vane
```

## Agent Configuration

--- CONTRIBUTING.md ---
# How to Contribute to Vane

Thanks for your interest in contributing to Vane! Your help makes this project better. This guide explains how to contribute effectively.

Vane is a modern AI chat application with advanced search capabilities.

## Project Structure

Vane's codebase is organized as follows:

- **UI Components and Pages**:
  - **Components (`src/components`)**: Reusable UI components.
  - **Pages and Routes (`src/app`)**: Next.js app directory structure with page components.
    - Main app routes include: home (`/`), chat (`/c`), discover (`/discover`), and library (`/library`).
  - **API Routes (`src/app/api`)**: Server endpoints implemented with Next.js route handlers.
- **Backend Logic (`src/lib`)**: Contains all the backend functionality including search, database, and API logic.
  - The search system lives in `src/lib/agents/search`.
  - The search pipeline is split into classification, research, widgets, and writing.
  - Database functionality is in `src/lib/db`.
  - Chat model and embedding model providers are in `src/lib/models/providers`, and models are loaded via `src/lib/models/registry.ts`.
  - Prompt templates are in `src/lib/prompts`.
  - SearXNG integration is in `src/lib/searxng.ts`.
  - Upload search lives in `src/lib/uploads`.

### Where to make changes

If you are not sure where to start, use this section as a map.

- **Search behavior and reasoning**

  - `src/lib/agents/search` contains the core chat and search pipeline.
  - `classifier.ts` decides whether research is needed and what should run.
  - `researcher/` gathers information in the background.

- **Add or change a search capability**

  - Research tools (web, academic, discussions, uploads, scraping) live in `src/lib/agents/search/researcher/actions`.
  - Tools are registered in `src/lib/agents/search/researcher/actions/index.ts`.

- **Add or change widgets**

  - Widgets live in `src/lib/agents/search/widgets`.
  - Widgets run in parallel with research and show structured res


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
