# KI: LongLeo287/SEOSONA

## Overview
Rebuild website https://seosona.com bằng Next.js, Tailwind CSS và GitHub.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Next.js, Playwright, React
- **Total files:** 99 files across 51 directories
- **File types:** .tsx: 76, .ts: 5, .json: 5, .md: 3, .mjs: 2, .yml: 2, .clauderules: 1
- **Key dependencies:** @next/mdx, @studio-freight/lenis, @tailwindcss/typography, animejs, axios, class-variance-authority, clsx, framer-motion, gray-matter, gsap, lucide-react, motion
- **Dev dependencies:** @tailwindcss/postcss, @types/animejs, @types/node, @types/react, @types/react-dom, @types/turndown, eslint, eslint-config-next

## Documentation Sections
- SEOSONA Rebuild
- Mục tiêu
- Stack
- Chạy local
- Build
- Deploy
- Lưu ý bảo mật

## Available Commands
- `npm run predev` -- npm run seosona:sync-rules
- `npm run dev` -- next dev
- `npm run build` -- next build
- `npm run start` -- next start
- `npm run lint` -- eslint .
- `npm run typecheck` -- tsc --noEmit
- `npm run seosona:doctor` -- node scripts/seosona-project.mjs doctor
- `npm run seosona:sync-rules` -- node scripts/seosona-project.mjs sync-rules
- `npm run seosona:log` -- node scripts/seosona-project.mjs log

## Core Structure
```
  .clauderules
  .cursorrules
  .gitignore
  .vercelignore
  AGENTS.md
  DESIGN.md
  README.md
  eslint.config.mjs
  next-env.d.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  seosona.project.json
  tsconfig.json
  tsconfig.tsbuildinfo
  vercel.json
  .github/
    workflows/
      fetch-legacy-assets.yml
      pages.yml
  app/
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
    robots.ts
    sitemap.ts
    api/
      contact/
        route.ts
    audit-seo/
      page.tsx
    bao-gia-seo/
      page.tsx
    case-study/
      loading.tsx
      page.tsx
    chi-quyet-academy/
      page.tsx
      in-house/
        page.tsx
      mentor/
        page.tsx
    chinh-sach-bao-mat/
      page.tsx
    dich-vu/
      page.tsx
    dich-vu-ads/
      page.tsx
      facebook/
        page.tsx
      google/
        page.tsx
      youtube/
        page.tsx
    dich-vu-backlink/
      page.tsx
    dich-vu-seo-tong-the/
      page.tsx
    dich-vu-thiet-ke-website/
      page.tsx
    dich-vu-viet-bai-chuan-seo/
      page.tsx
    doi-ngu-nhan-su/
      page.tsx
    giai-phap/
      page.tsx
      ai-content/
        page.tsx
      ai-customer-journey/
        page.tsx
      he-thong-be/
        page.tsx
      power-bi/
        page.tsx
      sonatool/
        page.tsx
      tracking-automation/
        page.tsx
      zalo-2bs/
        page.tsx
    hinh-thuc-thanh-toan-va-hoan-tra/
      page.tsx
    khoa-hoc-content-seo/
      page.tsx
    khoa-hoc-seo/
      page.tsx
    lien-he/
      page.tsx
    p/
      [slug]/
        page.tsx
    quy-trinh-seo/
      page.tsx
    seo/
      loading.tsx
      page.tsx
      [slug]/
        loading.tsx
        page.tsx
        [post]/
          loading.tsx
          page.tsx
    seo-option/
      page.tsx
    tai-nguyen/
      ResourceHubClient.tsx
      page.tsx
    tai-nguyen-hub/
      page.tsx
    tu-van-seo-chuyen-sau/
      page.tsx
    tuyen-dung/
      page.tsx
    ve-seosona/
      page.tsx
      fanpage-social/
        page.tsx
  components/
    layout/
      BlogLayout.tsx
      BrandLogo.tsx
      FloatingActions.tsx
      Footer.tsx
      Header.tsx
      SmoothScroll.tsx
    mockups/
      AiContentGeneratorMockup.tsx
      AiCustomerJourneyMockup.tsx
      BackendSystemMockup.tsx
      DigitalEcosystemMockup.tsx
      FacebookAbTestMockup.tsx
      GoogleAdsDashboard.tsx
      OmnichannelHubMockup.tsx
      PowerBiDashboardMockup.tsx
      ResourceLibraryMockup.tsx
      SeoKn
```

## Quick Start
```bash
npm install
npm run dev
npm run build
npm run start
```

## Agent Configuration

--- AGENTS.md ---
# SEOSONA Project Rules

This project is bound to SEOSONA OS through `seosona.project.json`.

## Startup Contract

1. Resolve SEOSONA OS through `~/.seosona`.
2. Read `~/.seosona/1_CORE/SOUL.md`.
3. Read `~/.seosona/2_KNOWLEDGE/MASTER_INDEX.md`.
4. Query `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` for routing.
5. Check project memory at `~/.seosona/3_MEMORY/projects/website-seosona/`.
6. Run project health with `npm run seosona:doctor` when available.

## Project Connector

- Manifest: `seosona.project.json`
- Memory namespace: `website-seosona`
- Autonomy level: `project_edit`
- Publish/deploy actions require explicit user intent.

TASK COMPLETED

## STRICT DESIGN SYSTEM ENFORCEMENT
Whenever you perform UI/UX tasks, frontend styling, or component creation, you MUST READ AND STRICTLY ADHERE TO the design system defined in `DESIGN.md`.
- **Primary Source of Truth:** `DESIGN.md`
- Do NOT use Dark Navy backgrounds, Neon Green accents, or any tokens outside the B2B Light Theme specified in the design document.
- Failure to comply with `DESIGN.md` is a critical violation of the startup contract.




## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
