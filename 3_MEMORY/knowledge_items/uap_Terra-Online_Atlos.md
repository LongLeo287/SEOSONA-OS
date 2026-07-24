# KI: Terra-Online/Atlos

## Overview
Atlos (= Atlas) <rt>from Talos, an anagram trick</rt> </ruby>is an open-source online map for the 3D RTSRPG game Arknights: Endfield (by Hypergryph). This repository contains the web client (codename “talos”) built with React + Vite, featuring an Endfield-esque UI, multilingual support, and a CDN‑friendly build pipeline.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 125 files across 24 directories
- **File types:** .svg: 40, .webp: 15, .png: 13, .json: 9, .md: 8, .js: 7, .mjs: 6

## Core Capabilities
- Modern stack: React, TypeScript, Vite, SCSS Modules;
- Map rendering with Leaflet and custom hooks/components (verb.1, we consider to migrate current structure to Canvaskit in next version);
- The project is well organized in our JIRA Kanban, consider joining us and take some todos!
- Clean UI with Figma workflow;
- Full internationalization (UI/Game), clear fallback rules;
- CDN/OSS friendly build and publish scripts;

## Documentation Sections
- Atlos
- Community
- Highlights
- Contributing
- Repository layout
- Getting started
- 1) Install deps
- 2) Start dev server
- 3) Type check (optional)
- 4) Build for production
- Internationalization (i18n)
- Fonts
- License

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  README.md
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    agents/
      i18nAgent.agent.md
    workflows/
      build.yml
  talos/
    .env.dev
    .env.production
    .prettierignore
    .prettierrc
    README.md
    RELEASE.md
    eslint.config.js
    index.html
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    stylelint.config.js
    tsconfig.json
    vite.config.js
    config/
      config.r2.template.json
      config.template.json
    oem-relink/
      package.json
      pnpm-lock.yaml
      tsconfig.json
      wrangler.toml
      src/
        index.ts
    oem-search/
      README.md
      package.json
      pnpm-lock.yaml
      tsconfig.json
      wrangler.toml
      src/
        index.ts
    public/
      apple-touch-icon.png
      apple-touch-icon_dark.png
      favicon-96x96.png
      favicon-96x96_dark.png
      favicon.ico
      favicon.png
      favicon.svg
      favicon_dark.ico
      favicon_dark.png
      favicon_dark.svg
      manifest.json
      og_preview.jpg
      web-app-manifest-192x192.png
      web-app-manifest-192x192_dark.png
      web-app-manifest-512x512.png
      web-app-manifest-512x512_dark.png
    scripts/
      build-marker-stats.mjs
      build-oss.mjs
      build-prepare.mjs
      build-r2.mjs
      build-search-index.mjs
      package-dist.mjs
      publish-R2.js
      publish-oss.js
      release-channel.js
      subset-fonts.py
      tile-index.js
    src/
      App.tsx
      LazyApp.tsx
      global.d.ts
      main.tsx
      vite-env.d.ts
      assets/
        fonts/
          LICENSE/
            Harmony OS Sans/
              Harmony OS Sans - License.txt
            Novecento Sans/
              Synthview Type Design - Desktop License 1.0.0.txt
              Synthview Type Design - Webfont License 1.0.0.txt
        images/
          UI/
            bg.webp
            brakt_L.svg
            brakt_R.svg
            check.svg
            close.svg
            config.svg
            confirm.svg
            detail.webp
            domain.webp
            flag.svg
            icon_char.png
            layer.svg
            locate.png
            locateclose.svg
            locatecurrent.svg
            locateopen.svg
            map-pattern.svg
            marker-hover.webp
            marker-select.webp
            next.svg
            observator_6.webp
            posit.svg
            prev.svg
            recall.svg
            
```

## Quick Start
```bash
pnpm install
pnpm dev
pnpm run type-check
pnpm build
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Atlos

Thank you for your interest in contributing! This guide explains how to set up your environment, follow coding standards, add features, and submit high‑quality pull requests.

## 1. Project Scope & Philosophy
Atlos aims to provide a performant, multilingual, map‑centric web client for Arknights: Endfield community knowledge and exploration. We value:
- **Performance**: lean renders, efficient data access, CDN‑friendly assets.
- **Clarity**: typed interfaces (TypeScript), explicit fallbacks for i18n.
- **Maintainability**: modular components, minimal global state, readable SCSS.
- **Openness**: transparent build/deploy flow without leaking secrets.

## 2. Tech Stack Summary
- React 18 + TypeScript (strict mode)
- Vite build system
- SCSS Modules for component styling
- Leaflet for interactive mapping
- Zustand for lightweight global state
- Progressive blur & transitions for UI polish

## 3. Repository Structure (key paths)
```
Atlos/
  talos/
    src/
      component/        # UI + map components
      component/map/    # Leaflet integration & hooks
      locale/           # i18n loader, language data
      store/            # Zustand stores
      styles/           # global SCSS (palette, fonts, curves)
      utils/            # helpers (device, fonts, logging, resources)
      data/             # static data (types, markers)
    config/             # build-time config (ignored from VCS)
    scripts/            # publish / utility scripts
    public/             # static public assets
    vite.config.js      # build config
```

## 4. Environment Setup
```bash
# Move into web client
cd talos

# Install dependencies
pnpm install --frozen-lockfile

# Start dev server
pnpm dev

# Type check
pnpm run type-check

# Build production bundle
pnpm build
```
Node 20+ and pnpm 8+ recommended.

## 5. Coding Standards
- **TypeScript**: prefer explicit types; avoid implicit `any`. Use discriminated unions for complex variants.
- **Components**: keep pure/p


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
