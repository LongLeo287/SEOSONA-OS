# KI: iamvishnusankar/next-sitemap

## Overview
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Create config file](#create-config-file)
  - [Building sitemaps](#building-sitemaps)
    - [Custom config file](#custom-config-file)
    - [Building sitemaps with pnpm](#building-sitemaps-with-pnpm)
- [Index sitemaps](#index-sitemaps-optional)
- [Splitting large sitemap into multiple files](#splitting-large-sitemap-into-multiple-files)
- [Configuration Options](#configuration-options)
- [Custom transformation function](#custom-transformation-function)
- [Full configuration example](#full-configuration-example)
- [Generating dynamic/server-side sitemaps](#generating-dynamicserver-side-sitemaps)
- [Typescript JSDoc](#typescript-jsdoc)

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 115 files across 34 directories
- **File types:** .tsx: 34, .png: 10, .svg: 9, .ttf: 8, .md: 6, .yml: 6, .json: 6
- **Dev dependencies:** @corex/workspace, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint, eslint-config-next, fast-xml-parser, prettier, turbo

## Documentation Sections
- Table of contents
- Getting started
- Installation
- Create config file
- Building sitemaps
- Index sitemaps (Optional)
- Splitting large sitemap into multiple files
- Configuration Options

## Available Commands
- `npm run clean` -- tsc --build --clean
- `npm run dev:test` -- bun test --watch
- `npm run dev:tsc` -- tsc --build --watch
- `npm run build` -- turbo run deploy --force
- `npm run test` -- bun test --ci --coverage --verbose
- `npm run lint` -- eslint .
- `npm run prettier:check` -- prettier --check "**/*.{js,mjs,cjs,jsx,json,ts,tsx,md,mdx,css,html,yml,yaml,scss
- `npm run format` -- prettier --write "**/*.{js,mjs,cjs,jsx,json,ts,tsx,md,mdx,css,html,yml,yaml,scss

## Core Structure
```
  .eslintignore
  .eslintrc
  .gitattributes
  .gitignore
  .npmrc
  .prettierignore
  .prettierrc
  CODE_OF_CONDUCT.md
  LICENSE
  README.md
  SECURITY.md
  azure-pipeline.yml
  bun.lockb
  changelog.md
  package.json
  tsconfig.json
  turbo.json
  .github/
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      codeql-analysis.yml
      stale.yml
      test.yml
  .vscode/
    settings.json
  assets/
    banner.png
    banner.svg
    ts-jsdoc.png
    NextJS/
      icon/
        dark/
          nextjs-icon-dark.png
          nextjs-icon-dark.svg
        light/
          nextjs-icon-light.png
          nextjs-icon-light.svg
      logotype/
        dark/
          nextjs-logotype-dark.png
          nextjs-logotype-dark.svg
        light/
          nextjs-logotype-light.png
          nextjs-logotype-light.svg
    Vercel/
      icon/
        dark/
          vercel-icon-dark.png
          vercel-icon-dark.svg
        light/
          vercel-icon-light.png
          vercel-icon-light.svg
      logotype/
        dark/
          vercel-logotype-dark.png
          vercel-logotype-dark.svg
        light/
          vercel-logotype-light.png
          vercel-logotype-light.svg
  docs/
    .eslintrc
    .gitignore
    contentlayer.config.js
    env.mjs
    next-sitemap.config.js
    next.config.js
    package.json
    postcss.config.js
    tailwind.config.js
    tsconfig.json
    app/
      favicon.ico
      layout.tsx
      page.tsx
      api/
        og/
          route.tsx
      components/
        CodeCopyButton.tsx
        Footer.tsx
        GithubStars.tsx
        Hero.tsx
        Icons.tsx
        Navbar.tsx
        Providers.tsx
        ThemeToggle.tsx
        callout.tsx
        mdx-card.tsx
        mdx-components.tsx
        page-header.tsx
        pager.tsx
        sidebar-nav.tsx
        toc.tsx
        Navbar/
          MobileMenu.tsx
          Navbar.tsx
          NavbarItem.tsx
        blocks/
          Button.tsx
          DropdownMenu.tsx
          SocialIcons.tsx
        cards/
          card.tsx
          cardItem.tsx
          data.tsx
        docsMenu/
          But.tsx
          MenuButton.tsx
        ui/
          Toaster.tsx
          toast.tsx
          use-toast.ts
      docs/
        [[...slug]]/
          layout.tsx
          page.tsx
      examples/
        page.tsx
    assets/
      fonts/
        CalSans-SemiBold.ttf
        CalSans-SemiBold.woff
        CalSans-SemiBold.wof
```

## Quick Start
```bash
yarn add next-sitemap
Add next-sitemap as your postbuild script
You can also use a custom config file instead of `next-sitemap.config.js`. Just pass `--config <your-config-file>.js` to build command (Example: [custom-config-file](https://github.com/iamvishnusankar/next-sitemap/tree/master/examples/custom-config-file))
When using pnpm you need to create a `.npmrc` file in the root of your project if you want to use a postbuild step:
📣 From `next-sitemap` v2.x onwards, `sitemap.xml` will be [Index Sitemap](https://developers.google.com/search/docs/advanced/sitemaps/large-sitemaps). It will contain urls of all other generated sitemap endpoints.
Index sitemap generation can be turned off by setting `generateIndexSitemap: false` in next-sitemap config file. (This is useful for small/hobby sites which does not require an index sitemap) (Example: [no-index-sitemaps](https://github.com/iamvishnusankar/next-sitemap/tree/master/examples/no-index-sitemaps))
Define the `sitemapSize` property in `next-sitemap.config.js` to split large sitemap into multiple files.
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
