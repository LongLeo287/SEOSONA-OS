# KI: darkroomengineering/lenis

## Overview
Lenis ("smooth" in latin) is a lightweight, robust, and performant smooth scroll library. It's designed by [@darkroom.engineering](https://twitter.com/darkroomdevs) to be simple to use and easy to integrate into your projects. It's built with performance in mind and is optimized for modern browsers. It's perfect for creating smooth scrolling experiences on your website such as WebGL scroll syncing, parallax effects, and much more, see [Demo](https://lenis.darkroom.engineering/) and [Showcase](https://www.lenis.dev/showcase).

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 102 files across 32 directories
- **File types:** .ts: 37, .json: 15, .md: 9, .astro: 9, .css: 7, .vue: 7, .js: 4
- **Dev dependencies:** @biomejs/biome, tsdown, typescript
- **Keywords:** scroll, smooth, lenis, react, vue

## Core Capabilities
- **Lightweight & dependency-free** — the whole library is a few KB with zero runtime dependencies
- **Runs on native scroll** — wraps the browser's own scroll, so position: sticky, anchor links, and accessibility keep working
- **Any axis** — smooth vertical, horizontal, and nested scrolling from a single instance
- **Built for sync** — drives WebGL scroll scenes, GSAP ScrollTrigger, and parallax off one loop
- **Framework adapters** — first-class packages for React, Vue, and Framer
- **Scroll snapping** — the snap plugin aligns sections without fighting the smooth scroll

## Documentation Sections
- Introduction
- Features
- Sponsors
- Packages
- Installation
- or
- or
- Setup
- Basic:
- Custom raf loop:
- Recommended CSS:
- GSAP ScrollTrigger:
- No-code usage
- Settings

## Available Commands
- `npm run build` -- tsdown
- `npm run dev` -- bun run --parallel dev:build dev:playground
- `npm run dev:build` -- tsdown --watch
- `npm run dev:playground` -- bun --filter playground dev
- `npm run dev:nuxt` -- bun --filter playground-nuxt dev
- `npm run readme` -- node ./scripts/update-readme.js
- `npm run version:dev` -- npm version prerelease --preid dev --force --no-git-tag-version
- `npm run version:patch` -- npm version patch --force --no-git-tag-version
- `npm run version:minor` -- npm version minor --force --no-git-tag-version
- `npm run version:major` -- npm version major --force --no-git-tag-version
- `npm run postversion` -- bun run build && bun run readme
- `npm run publish:dev` -- npm publish --tag dev

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  MANIFESTO.md
  README.md
  V2-ROADMAP.md
  biome.json
  bun.lock
  package.json
  tsconfig.json
  tsdown.config.ts
  .github/
    CODEOWNERS
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
  .vscode/
    extensions.json
    settings.json
  packages/
    core/
      browser.ts
      index.ts
      lenis.css
      package.json
      src/
        animate.ts
        debounce.ts
        dimensions.ts
        emitter.ts
        lenis.ts
        maths.ts
        types.ts
        virtual-scroll.ts
    react/
      README.md
      index.ts
      package.json
      src/
        provider.tsx
        store.ts
        types.ts
        use-lenis.ts
    snap/
      README.md
      browser.ts
      index.ts
      package.json
      src/
        debounce.ts
        element.ts
        snap.ts
        types.ts
        uid.ts
    vue/
      README.md
      index.ts
      package.json
      nuxt/
        module.ts
        tsconfig.json
        runtime/
          lenis.ts
        types/
          app.d.ts
          imports.d.ts
      src/
        provider.ts
        store.ts
        use-lenis.ts
  playground/
    .gitignore
    astro.config.mjs
    package.json
    tsconfig.json
    core/
      browser.js
      static.html
      style.css
      test.ts
    horizontal/
      browser.js
      static.html
      style.css
      test.ts
    infinite/
      browser.js
      static.html
      style.css
      test.ts
    nuxt/
      .gitignore
      README.md
      app.vue
      nuxt.config.ts
      package.json
      tsconfig.json
      components/
        inner.vue
      pages/
        about.vue
        index.vue
      plugins/
        lenis.ts
      public/
        favicon.ico
        robots.txt
      server/
        tsconfig.json
    react/
      app.tsx
      style.css
    snap/
      style.css
      test.ts
    vue/
      App.vue
      Child.vue
      InnerChild.vue
      setup.ts
      style.css
    www/
      layouts/
        Layout.astro
      pages/
        core.astro
        horizontal.astro
        index.astro
        infinite.astro
        react.astro
        scroll-margin.astro
        snap.astro
        vue.astro
  scripts/
    update-readme.js
```

## Quick Start
```bash
npm i lenis
yarn add lenis
pnpm add lenis
<br/>
Using scripts:
<br/>
**Import stylesheet:**
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Lenis Contributing Guide

Yooo! We're really excited that you're interested in contributing to Lenis! Before submitting your contribution, please read through the following guide.

## Repo Setup

To develop locally, fork the Lenis repository and clone it in your local machine. The Lenis repo is a monorepo using bun workspaces. The package manager used to install and link dependencies must be [bun](https://bun.sh/).

To start developing Lenis, run the following commands in the root of the repository:

1. Run `bun i` in Lenis's root folder.

2. Run `bun run dev` in Lenis's root folder.

3. Open http://localhost:4321 in your browser, which has a playground for Lenis.

The dev server will automatically rebuild Lenis whenever you change its code no matter what package you are working on.
At the same time the playground will automatically reload when you change the code of any package.


## Pull Request Guidelines

- Checkout a topic branch from a base branch (e.g. `main`), and merge back against that branch.

- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.

- If fixing a bug:

  - Provide a detailed description of the bug in the PR. Codepen demo preferred.

- Make sure to enable biome in your editor to format the code.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
