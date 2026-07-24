# KI: pennydinh/marketing-pineline-share

## Overview
Repository with 143 files across 43 directories. Primary language: TypeScript (21 files).

## Tech Stack (from code)
- TypeScript (21 files)
- JavaScript (14 files)
- TypeScript (React) (8 files)
- **Total:** 143 files, 43 directories
- **File types:** .png: 48, .ts: 21, .js: 14, .jpg: 14, .json: 13, .tsx: 8, .svg: 5, .md: 4

## Public API / Exports
- `sql` from `src\lib\db.ts`
- `initDb` from `src\lib\db.ts`
- `seedDb` from `src\lib\db.ts`

## Dependencies
### Dependencies (from package.json)
- `@anthropic-ai/sdk`: ^0.39.0
- `@google/genai`: ^1.50.1
- `@neondatabase/serverless`: ^1.1.0
- `apify-client`: ^2.23.0
- `next`: 16.2.4
- `node-html-parser`: ^7.1.0
- `openai`: ^6.34.0
- `react`: ^18
- `react-dom`: ^18
- `rss-parser`: ^3.13.0

### Dev Dependencies
- `@types/node`: ^20
- `@types/react`: ^18
- `@types/react-dom`: ^18
- `eslint`: ^9.0.0
- `eslint-config-next`: 16.2.4
- `typescript`: ^5

## Imports Detected in Source
- `@neondatabase/serverless`
- `next`

## Available Commands
- `npm run dev` -- `next dev`
- `npm run build` -- `next build`
- `npm run start` -- `next start`
- `npm run lint` -- `eslint`

## File Structure
```
  .gitignore
  AGENTS.md
  CLAUDE.md
  HUONG_DAN_CAI_DAT.md
  README.md
  build.log
  eslint.config.mjs
  huong-dan-su-dung.html
  next.config.ts
  package-lock.json
  package.json
  props.json
  tsconfig.json
  walkthrough.html
  bot/
    check-db.js
    cookies.json
    cookies.json.save
    fix-db.js
    flush.js
    package-lock.json
    package.json
    post-groups.js
    reset-db.js
    test-api.js
    test-db.js
    test-env.js
    test.js
    assets/
      logo-placeholder.jpg
    screenshots/
      1776855574978-comailo.png
      1776856193967-comailo.png
      1776856622464-comailo.png
      1776857198591-comailo.png
      1776858969001-comailo.png
      1776879443482-comailo.png
      1776927704138-comailo.png
      1776931450297-comailo.png
      1776939886268-comailo.png
      1777018123944-comailo.png
      1777018718599-comailo.png
      1778574240502-comailo.png
      error-1776778612233.png
      error-1776778878708.png
      error-1776852096918.png
      error-1776852409766.png
      error-1776854405656.png
      error-1776854599980.png
      error-1776933414060.png
      error-1776933746053.png
      error-1776934002358.png
      error-1776934313904.png
      error-1776934632508.png
      error-1776935107297.png
      error-1776935235400.png
      error-1776935469646.png
      error-1776935721133.png
      error-1776935966929.png
      error-1777019244910.png
      error-1777019585497.png
      img_group_p_1r4sx9.jpg
      img_group_p_3dhafi.jpg
      img_group_p_5tp5a8.jpg
      img_group_p_9x3jg.jpg
      img_group_p_a64afn.jpg
      img_group_p_d04td.jpg
      img_group_p_lrqco.jpg
      img_group_p_mv2wd.jpg
      img_group_p_n2997fh.jpg
      img_group_p_rh174b.jpg
      img_group_p_tw9rfq.jpg
      1776928048803-groupaivietnam/
        .png
      1776928448973-openclawxvn/
        .png
      1776928697949-861108920047086/
        .png
      1776931684816-groupaivietnam/
        .png
      1776931978326-openclawxvn/
        .png
      1776932
```

## Key Source Excerpts
### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

```

### src\lib\db.ts
```typescript
import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_URL) {
  console.warn("POSTGRES_URL is not defined in environment variables. Database operations will fail.");
}

export const sql = neon(process.env.POSTGRES_URL || 'postgresql://dummy:dummy@dummy/dummy');

export async function initDb() {
  await sql`CREATE TABLE IF NOT EXISTS sources (id TEXT PRIMARY KEY, name TEXT, url TEXT, type TEXT DEFAULT 'rss', rss_url TEXT, active INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
  await sql`CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, source_id TEXT, title TEXT, url TEXT UNIQUE, summary TEXT, original_image_url TEXT, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT 'new', format TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
  await sql`CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, article_id TEXT, format TEXT, content TEXT, hashtags TEXT, generated_image_url TEXT, original_image_url TEXT, facebook_post_id TEXT, scheduled_time TEXT, status TEXT DEFAULT 'draft', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
}

export async function seedDb() {
  await sql`
  INSERT INTO sources (id, name, url, type, rss_url) VALUES
    ('s1', 'TechCrunch', 'https://techcrunch.com/', 'rss', 'https://techcrunch.com/feed/'),
    ('s2', 'NFX', 'https://www.nfx.com/', 'rss', 'https://www.nfx.com/feed/'),
    ('s3', 'Indie Hackers', 'https://www.indiehackers.com/', 'rss', 'https://www.indiehackers.com/feed')
```

## Agent Configuration
### CLAUDE.md
@AGENTS.md


### AGENTS.md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
