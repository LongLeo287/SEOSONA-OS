# KI: trypost-it/trypost

## Overview
A massive release that turns TryPost into a complete open-source social media platform.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 112 files across 36 directories
- **File types:** .md: 50, .php: 25, .mdc: 9, .json: 8, .yml: 4, .example: 2, .yaml: 2
- **Key dependencies:** @codemirror/commands, @codemirror/lang-json, @codemirror/state, @codemirror/view, @inertiajs/vue3, @tabler/icons-vue, @tailwindcss/typography, @vue-flow/background, @vue-flow/controls, @vue-flow/core, @vue-flow/minimap, @vueuse/core
- **Dev dependencies:** @eslint/js, @laravel/echo-vue, @laravel/vite-plugin-wayfinder, @tailwindcss/vite, @types/node, @unovis/ts, @unovis/vue, @vitejs/plugin-vue

## Core Capabilities
|                                |                                                                        |
| ------------------------------ | ---------------------------------------------------------------------- |
| **Visual Calendar**            | See every scheduled post at a glance, switch between month/week/day    |
| **Multi-Platform Composer**    | One draft &rarr; preview &amp; tweak for every network in parallel    |
| **AI Generate / Review**       | Draft from a prompt, get inline feedback before you publish            |
| **AI Carousel Builder**        | Prompt &rarr; multi-slide carousel with images, on-brand               |
| **Brand Profile**              | Tone, voice, language, colors — applied to every AI call               |
| **Asset Library**              | Reusable workspace media + Unsplash &amp; Giphy search built in        |
| **Signatures &amp; Labels**    | Reusable text blocks (hashtags, CTAs) and color-coded post tags        |
| **Team Collaboration**         | Owner / Admin / Member roles, comments with @mentions on drafts        |
| **Workspaces**                 | Isolate brands, clients, or projects in their own spaces               |
| **REST API + MCP**             | Full programmatic control; AI assistants integrate natively            |
| **Analytics**                  | Per-account engagement metrics across every supported platform         |
| **Multi-language**             | English, Spanish, Portuguese                                           |

## Documentation Sections
- TryPost 1.0 is here
- Why TryPost
- Features
- Supported Platforms
- Get Started
- Contributing
- License
- Star History

## Available Commands
- `npm run build` -- vite build
- `npm run build:ssr` -- vite build && vite build --ssr
- `npm run dev` -- vite
- `npm run format` -- prettier --write resources/
- `npm run format:check` -- prettier --check resources/
- `npm run lint` -- eslint . --fix

## Core Structure
```
  .dockerignore
  .editorconfig
  .env.ci
  .env.example
  .env.testing
  .gitattributes
  .gitignore
  .mcp.json
  .prettierignore
  .prettierrc
  CLAUDE.md
  Caddyfile
  GEMINI.md
  LICENSE.md
  README.md
  artisan
  boost.json
  components.json
  compose.override.yaml.example
  compose.prod.yaml
  compose.yaml
  composer.json
  composer.lock
  eslint.config.js
  package-lock.json
  package.json
  phpunit.xml
  pint.json
  tsconfig.json
  vite.config.ts
  .claude/
    commands/
      release.md
    skills/
      ai-sdk-development/
        SKILL.md
      cashier-stripe-development/
        SKILL.md
        references/
          subscriptions.md
          testing.md
          webhooks.md
      configure-nightwatch/
        SKILL.md
        reference.md
      configuring-horizon/
        SKILL.md
        references/
          metrics.md
          notifications.md
          supervisors.md
          tags.md
      humanizer/
        SKILL.md
      inertia-vue-development/
        SKILL.md
      laravel-best-practices/
        SKILL.md
        rules/
          advanced-queries.md
          architecture.md
          blade-views.md
          caching.md
          collections.md
          config.md
          db-performance.md
          eloquent.md
          error-handling.md
          events-notifications.md
          http-client.md
          mail.md
          migrations.md
          queue-jobs.md
          routing.md
          scheduling.md
          security.md
          style.md
          testing.md
          validation.md
      mcp-development/
        SKILL.md
      medialibrary-development/
        SKILL.md
        references/
          medialibrary-guide.md
      passport-development/
        SKILL.md
      pest-testing/
        SKILL.md
      socialite-development/
        SKILL.md
      tailwindcss-development/
        SKILL.md
      upgrade-laravel-v13/
        SKILL.md
      wayfinder-development/
        SKILL.md
  .cursor/
    rules/
      inertia-pagination.mdc
      inertia-v3.mdc
      laravel-boost-tools.mdc
      laravel-patterns.mdc
      php-style.mdc
      project-context.mdc
      tests-dusk.mdc
      tests-pest.mdc
      vue-typescript.mdc
  .github/
    FUNDING.yml
    copilot-instructions.md
    workflows/
      lint.yml
      release-docker.yml
      tests.yml
  app/
    Actions/
      Ai/
        AutofillBrand.php
      Automation/
        Automation/
          ActivateAutomation.php
          CreateAutomation.php
          DeleteAutomat
```

## Agent Configuration

--- CLAUDE.md ---
<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/ai (AI) - v0
- laravel/boost (BOOST) - v2
- laravel/cashier (CASHIER) - v16
- laravel/framework (LARAVEL) - v13
- laravel/horizon (HORIZON) - v5
- laravel/mcp (MCP) - v0
- laravel/nightwatch (NIGHTWATCH) - v1
- laravel/passport (PASSPORT) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/reverb (REVERB) - v1
- laravel/socialite (SOCIALITE) - v5
- laravel/wayfinder (WAYFINDER) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- laravel/telescope (TELESCOPE) - v5
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/vue3 (INERTIA_VUE) - v3
- tailwindcss (TAILWINDCSS) - v4
- vue (VUE) - v3
- @laravel/echo-vue (ECHO_VUE) - v2
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- laravel-echo (ECHO) - v2
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not cr


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
