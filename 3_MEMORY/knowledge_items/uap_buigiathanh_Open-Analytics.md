# KI: buigiathanh/Open-Analytics

## Overview
**Privacy-friendly, self-hosted web analytics** — your events live in **your** Supabase. This repository ships **two separate pieces** you can use together or independently.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Next.js, React
- **Total files:** 144 files across 5 directories
- **File types:** .png: 107, .jpg: 15, .svg: 5, .md: 4, .mjs: 4, .json: 3, .js: 2
- **Key dependencies:** @supabase/ssr, @supabase/supabase-js, cobe, leaflet, lucide-react, next, next-themes, pg, react, react-dom, react-leaflet, recharts
- **Dev dependencies:** @tailwindcss/postcss, @types/leaflet, @types/node, @types/pg, @types/react, @types/react-dom, @types/ws, eslint

## Documentation Sections
- Open Analytics
- What is in this repository?
- Part 1 — Analytics dashboard (management app)
- What it includes
- Prerequisites
- Initialize the dashboard
- Set NEXT_PUBLIC_APP_URL to your HTTPS origin first
- Part 2 — Tracking script (`public/tracker.js`)
- What you need before embedding
- How to load the script
- Script attributes (`data-*`)
- JavaScript API (`window.OpenAnalytics`)
- Behaviour (built-in)
- Manual setup (no dashboard UI)
- How Part 1 and Part 2 work together
- Metrics (dashboard)

## Available Commands
- `npm run dev` -- node server.mjs
- `npm run build` -- next build
- `npm run start` -- NODE_ENV=production node server.mjs
- `npm run lint` -- eslint

## Core Structure
```
  .env.example
  .gitignore
  AGENTS.md
  CLAUDE.md
  LICENSE
  README.md
  eslint.config.mjs
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  server.mjs
  tsconfig.json
  docs/
    realtime-socket.md
  public/
    bot-middleware.mjs
    file.svg
    globe.svg
    logo.png
    next.svg
    tracker.js
    vercel.svg
    window.svg
    worker.js
    avatars/
      0.png
      1.png
      10.png
      11.png
      12.png
      13.png
      14.png
      15.png
      16.png
      17.png
      18.png
      19.png
      2.png
      20.png
      21.png
      22.png
      23.png
      24.png
      25.png
      26.png
      27.png
      28.png
      29.png
      3.png
      30.png
      31.png
      32.png
      33.png
      34.png
      35.png
      36.png
      37.png
      38.png
      39.png
      4.png
      40.png
      41.png
      42.png
      43.png
      44.png
      45.png
      46.png
      47.png
      48.png
      49.png
      5.png
      50.png
      51.png
      52.png
      53.png
      54.png
      55.png
      56.png
      57.png
      58.png
      59.png
      6.png
      60.png
      61.png
      62.png
      63.png
      64.png
      65.png
      66.png
      67.png
      68.png
      69.png
      7.png
      70.png
      71.png
      72.png
      73.png
      74.png
      75.png
      76.png
      77.png
      78.png
      79.png
      8.png
      80.png
      81.png
      82.png
      83.png
      84.png
      85.png
      86.png
      87.png
      88.png
      89.png
      9.png
      90.png
      91.png
      92.png
      93.png
      94.png
      95.png
      96.png
      97.png
      98.png
      99.png
    bots/
      ceos/
        ahrefs.jpg
        amazon.jpg
        apple.webp
        baidu.jpg
        bing.jpg
        bytespider.jpg
        chatgpt.jpg
        claude.jpg
        cohere.jpg
        commoncrawl.png
        deepseek.png
        diffbot.jpg
        duckduckgo.jpg
        firecrawl.jpg
        google.png
        linkedin.jpg
        meta.png
        mistral.jpg
        perplexity.jpg
        pinterest.png
        semrush.jpg
        twitter.png
```

## Quick Start
```bash
- **Your analytics data stays in your Supabase** — run [`schema-analytics.sql`](supabase/schema-analytics.sql) (publishable key = read-only), deploy [`worker.js`](public/worker.js) to Cloudflare for writes, put Project ID + publishable key in **Add website**.
- **App Supabase (`.env`)** — only for hosting this dashboard: sign-in and a list of sites (name, domain, link to your project URL + key). No pageviews are stored there.
- **You can use `tracker.js` without the dashboard** — if you have `sites` + `events` and a `site_key`, events still land in your project.
---
The dashboard is a **Next.js** application: landing page, authenticated `/app` UI, `/docs`, and it **serves** `public/tracker.js` at `/tracker.js`.
| Route / area | Description |
|--------------|-------------|
| `/` | Marketing landing |
| `/app` | Site list, add website, open per-site analytics |
| `/app/[siteId]` | Metrics, breakdowns, date range |
```

## Agent Configuration

--- AGENTS.md ---
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


--- CLAUDE.md ---
@AGENTS.md



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
