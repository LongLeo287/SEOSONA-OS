# KI: harlan-zw/nuxt-seo

## Overview
[Nuxt SEO](https://nuxtseo.com) is an ecosystem of SEO modules, tools, and tutorials built with and for the Nuxt community. Search has changed: Google still matters, but [ChatGPT](https://chatgpt.com), Claude, [Perplexity](https://perplexity.ai), and AI Overviews now answer questions your site could answer, and they only cite sources they can parse. Nuxt SEO ships the full stack, robots.txt, sitemaps, Schema.org, OG images, meta tags, link checks, to make your Nuxt app discoverable by both search engines and answer engines.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Zod
- **Total files:** 117 files across 32 directories
- **File types:** .md: 34, .vue: 32, .yml: 13, .ts: 13, .json: 10, .yaml: 6, .gitignore: 2
- **Dev dependencies:** @antfu/eslint-config, @arethetypeswrong/cli, bumpp, eslint, eslint-plugin-harlanzw, lint-staged, simple-git-hooks, typescript

## Core Capabilities
- 🤖 **Crawl Control**: Automatic `robots.txt` generation, `<meta name="robots">` tags, and `X-Robots-Tag` headers to manage how search engines and AI crawlers access your site.
- 📄 **Sitemaps**: Auto-generated `sitemap.xml` from your app's data sources, with multi-sitemap support for i18n sites.
- 🔎 **Structured Data**: Schema.org JSON-LD generated automatically, the single biggest lever for rich results, AI Overviews, and entity recognition.
- 🖼️ **OG Images**: Dynamic Open Graph image generation for every page, no manual design work needed.
- △ **SEO Utils**: Clean titles, default meta, canonical URLs, breadcrumbs, favicons, and social share links, AEO fundamentals AI parsers rely on.
- ✅ **Link Checking**: Broken link detection at build time with [ESLint](https://eslint.org) integration and DevTools support.

### Made for the age of AI answers

Traditional SEO signals (clean HTML, structured data, crawlable sitemaps, valid meta) are the same signals AI crawlers use to decide what to cite. Nuxt SEO gives you all of them by default. Pair it with [`nuxt-ai-ready`](https://github.com/harlan-zw/nuxt-ai-ready) for `llms.txt`, on-demand markdown endpoints, and an MCP server, and you get a **100/100 score on `@vercel/agent-readability`** by default.

```sh
npx nuxt module add seo nuxt-ai-ready
# then verify:
npx @vercel/agent-readability audit https://your-site.com
```

## Documentation Sections
- Features
- Made for the age of AI answers
- then verify:
- The `@nuxtjs/seo` Module
- Modules
- Companion modules
- Installation
- Going Further
- Documentation
- Sponsors
- License

## Available Commands
- `npm run build` -- pnpm --filter './packages/**' build
- `npm run dev` -- pnpm --filter @nuxtjs/seo dev
- `npm run dev:prepare` -- pnpm --filter './packages/**' stub && pnpm --filter @nuxtjs/seo dev:prepare
- `npm run lint` -- eslint .
- `npm run lint:fix` -- eslint . --fix
- `npm run typecheck` -- pnpm -r --parallel --filter './packages/**' run typecheck
- `npm run test` -- pnpm --filter nuxtseo-shared --filter nuxtseo-layer-devtools --filter @nuxtjs/se
- `npm run test:run` -- pnpm --filter nuxtseo-shared --filter nuxtseo-layer-devtools --filter @nuxtjs/se
- `npm run test:attw` -- pnpm --filter './packages/**' test:attw
- `npm run release` -- pnpm build && bumpp -r --output=CHANGELOG.md
- `npm run sync:workflows` -- node scripts/sync-workflows.mjs
- `npm run prepare` -- skilld prepare || true

## Core Structure
```
  .attw.json
  .editorconfig
  .gitignore
  .nuxtrc
  CHANGELOG.md
  CLAUDE.md
  LICENSE.md
  README.md
  eslint.config.mjs
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  renovate.json
  .claude/
    skills/
      devtools-layer-skilld
      skilld-lock.yaml
      nuxt-devtools-kit-skilld/
        SKILL.md
      nuxt-fonts-skilld/
        SKILL.md
      nuxt-skilld/
        SKILL.md
  .github/
    FUNDING.yml
    pull_request_template.md
    renovate.json5
    ISSUE_TEMPLATE/
      01-feature-suggestion.yml
      02-bug-report.yml
      03-documentation.yml
      04-help-wanted.yml
      config.yml
    workflows/
      deploy-docs.yml
      nightly.yml
      release.yml
      reusable-ci.yml
      reusable-nightly.yml
      reusable-release.yml
      test.yml
  docs/
    content/
      1.getting-started/
        0.introduction.md
        1.installation.md
        3.troubleshooting.md
        4.community-videos.md
      2.guides/
        0.using-the-modules.md
        1.disabling-modules.md
        2.nuxt-content.md
        3.i18n.md
        3.mcp.md
        4.llms-txt.md
        5.site-config.md
        6.debugging-modules.md
        7.updating-modules.md
      6.migration-guide/
        0.rc-to-stable.md
        1.beta-to-rc.md
        3.nuxt-seo-kit.md
        4.v3-to-v4.md
        5.v4-to-v5.md
      7.releases/
        1.v5.md
  examples/
    README.md
    basic/
      README.md
      app.vue
      nuxt.config.ts
      package.json
      pnpm-lock.yaml
      tsconfig.json
      pages/
        about.vue
        index.vue
    content/
      README.md
      app.vue
      content.config.ts
      nuxt.config.ts
      package.json
      pnpm-lock.yaml
      tsconfig.json
      content/
        index.md
        posts/
          hello-world.md
          seo-tips.md
      pages/
        [...slug].vue
    i18n/
      README.md
      app.vue
      nuxt.config.ts
      package.json
      pnpm-lock.yaml
      tsconfig.json
      i18n/
        locales/
          en.ts
          es.ts
          fr.ts
      pages/
        about.vue
        index.vue
  packages/
    devtools-layer/
      .gitignore
      app.config.ts
      error.vue
      nuxt.config.ts
      package.json
      assets/
        css/
          global.css
        fonts/
          fira-code.woff2
          hubot-sans.woff2
      components/
        DevtoolsAlert.vue
        DevtoolsChecklistBadge.vue
        DevtoolsChecklistItem.vue
        DevtoolsCopyButton.vue
        DevtoolsDocs.vue
       
```

## Quick Start
```bash
npx nuxt module add seo nuxt-ai-ready
npx @vercel/agent-readability audit https://your-site.com
Every module works standalone. Install `@nuxtjs/seo` to get everything at once, or pick only what you need (e.g. Sitemap and Robots). Configuration, composables, and features are identical either way.
| Module | Package | What it solves |
|--------|---------|----------------|
| Robots | [@nuxtjs/robots](https://github.com/nuxt-modules/robots) | Control which crawlers (Googlebot, GPTBot, ClaudeBot, PerplexityBot…) can access which pages |
| Sitemap | [@nuxtjs/sitemap](https://github.com/nuxt-modules/sitemap) | Give every crawler, search and answer engine, a full index of your content |
| Schema.org | [nuxt-schema-org](https://github.com/harlan-zw/nuxt-schema-org) | The structured data AI engines rely on to understand entities, authors, products, FAQs |
| OG Image | [nuxt-og-image](https://github.com/nuxt-modules/og-image) | Preview images for social shares and chat-bot rich cards |
| SEO Utils | [nuxt-seo-utils](https://github.com/harlan-zw/nuxt-seo-utils) | Favicons, canonicals, breadcrumbs, default meta, the AEO fundamentals |
```

## Agent Configuration

--- CLAUDE.md ---
# Nuxt SEO

Monorepo for `@nuxtjs/seo`, a meta module that installs and configures all Nuxt SEO modules.

## Nuxt SEO Modules

All module repos live in `~/pkg`. The `@nuxtjs/seo` module bundles these:

| Module               | Package | Path |
|----------------------|---|---|
| Robots               | `@nuxtjs/robots` | `~/pkg/nuxt-robots` |
| Sitemap              | `@nuxtjs/sitemap` | `~/pkg/sitemap` |
| OG Image             | `nuxt-og-image` | `~/pkg/og-image` |
| Schema.org           | `nuxt-schema-org` | `~/pkg/nuxt-schema-org` |
| SEO Utils            | `nuxt-seo-utils` | `~/pkg/nuxt-seo-utils` |
| Link Checker         | `nuxt-link-checker` | `~/pkg/nuxt-link-checker` |
| Site Config          | `nuxt-site-config` | `~/pkg/nuxt-site-config` |

### Standalone Modules

These modules are not bundled in `@nuxtjs/seo` but are available for installation separately.

| Module               | Package | Path |
|----------------------|---|---|
| Skew Protection | `nuxt-skew-protection` | `~/pkg/nuxt-skew-protection` |
| AI Ready        | `nuxt-ai-ready` | `~/pkg/nuxt-ai-ready` |

## Website

The nuxtseo.com website source lives at `~/sites/nuxtseo.com`. It is a Nuxt app deployed to Cloudflare Workers with D1 databases. The `nuxt-seo-pro` layer (`layers/nuxt-seo-pro/`) contains the Pro dashboard, telemetry API, and license verification endpoints.


<!-- skilld -->
Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
