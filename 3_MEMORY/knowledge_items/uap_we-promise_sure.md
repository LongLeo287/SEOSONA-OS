# KI: we-promise/sure

## Overview
> [!IMPORTANT]
> This repository is a community fork of the now-abandoned Maybe Finance project. <br />
> Learn more in their [final release](https://github.com/maybe-finance/maybe/releases/tag/v0.6.0) doc.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 123 files across 22 directories
- **File types:** .yml: 24, .woff2: 20, .svg: 12, .css: 12, .mdc: 10, .md: 9, .png: 6
- **Dev dependencies:** @biomejs/biome

## Documentation Sections
- Sure: The personal finance app for everyone
- Backstory
- Hosting Sure
- Forking and Attribution
- Performance Issues
- Local Development Setup
- Requirements
- Getting Started
- Optionally, load demo data
- Setup Guides
- One-click Install
- Managed OpenClaw for Sure Finances
- License and Trademarks

## Available Commands
- `npm run style:check` -- biome check
- `npm run style:fix` -- biome check --write
- `npm run lint` -- biome lint
- `npm run lint:fix` -- biome lint --write
- `npm run format:check` -- biome format
- `npm run format` -- biome format --write
- `npm run tokens:build` -- node bin/tokens.mjs
- `npm run tokens:check` -- node bin/tokens.mjs && git diff --quiet -- app/assets/tailwind/sure-design-syste

## Core Structure
```
  .dockerignore
  .editorconfig
  .env.example
  .env.local.example
  .env.test.example
  .erb_lint.yml
  .gitattributes
  .gitignore
  .rspec
  .rubocop.yml
  .ruby-version
  .sure-version
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  Dockerfile
  Dockerfile.preview
  Gemfile
  Gemfile.lock
  LICENSE
  Procfile.dev
  README.md
  Rakefile
  SECURITY.md
  biome.json
  compose.example.ai.yml
  compose.example.yml
  config.ru
  package-lock.json
  package.json
  perf.rake
  pipelock.example.yaml
  .cursor/
    rules/
      api-endpoint-consistency.mdc
      cursor_rules.mdc
      general-rules.mdc
      project-conventions.mdc
      project-design.mdc
      self_improve.mdc
      stimulus_conventions.mdc
      testing.mdc
      ui-ux-design-guidelines.mdc
      view_conventions.mdc
  .devcontainer/
    .bashrc
    Dockerfile
    devcontainer.json
    docker-compose.yml
  .gemini/
    config.yaml
  .github/
    copilot-instructions.md
    dependabot.yml
    DISCUSSION_TEMPLATE/
      feature-requests.yml
    ISSUE_TEMPLATE/
      bug_report.md
      other.md
    workflows/
      chart-ci.yml
      chart-release.yml
      ci.yml
      flutter-build.yml
      google-play-upload.yml
      helm-publish.yml
      ios-testflight.yml
      llm-evals.yml
      mobile-build.yml
      mobile-ci.yml
      mobile-release.yml
      pipelock.yml
      pr.yml
      preview-cleanup.yml
      preview-deploy.yml
      publish.yml
      update-docs.yml
  .junie/
    guidelines.md
  app/
    assets/
      builds/
        .keep
      fonts/
        geist/
          Geist-Black.woff2
          Geist-Bold.woff2
          Geist-ExtraBold.woff2
          Geist-ExtraLight.woff2
          Geist-Light.woff2
          Geist-Medium.woff2
          Geist-Regular.woff2
          Geist-SemiBold.woff2
          Geist-Thin.woff2
          Geist[wght].woff2
        geist_mono/
          GeistMono-Black.woff2
          GeistMono-Bold.woff2
          GeistMono-Light.woff2
          GeistMono-Medium.woff2
          GeistMono-Regular.woff2
          GeistMono-SemiBold.woff2
          GeistMono-Thin.woff2
          GeistMono-UltraBlack.woff2
          GeistMono-UltraLight.woff2
          GeistMono[wght].woff2
      images/
        ai-dark.svg
        ai.svg
        bg-grid.png
        claw-dark.svg
        claw.svg
        dark-mode-preview.png
        discord-icon.svg
        github-icon.svg
        google-icon.svg
        icon-assistant.svg
        icon-csv.svg
        light-mode-preview.png
        
```

## Quick Start
```bash
cd sure
cp .env.local.example .env.local
bin/setup
bin/dev
rake demo_data:default
```

## Agent Configuration

--- AGENTS.md ---
# Repository Guidelines

## Project Structure & Module Organization
- Code: `app/` (Rails MVC, services, jobs, mailers, components), JS in `app/javascript/`, styles/assets in `app/assets/` (Tailwind, images, fonts).
- Config: `config/`, environment examples in `.env.local.example` and `.env.test.example`.
- Data: `db/` (migrations, seeds), fixtures in `test/fixtures/`.
- Tests: `test/` mirroring `app/` (e.g., `test/models/*_test.rb`).
- Tooling: `bin/` (project scripts), `docs/` (guides), `public/` (static), `lib/` (shared libs).

## Build, Test, and Development Commands
- Setup: `cp .env.local.example .env.local && bin/setup` — install deps, set DB, prepare app.
- Run app: `bin/dev` — starts Rails server and asset/watchers via `Procfile.dev`.
- Test suite: `bin/rails test` — run all Minitest tests; add `TEST=test/models/user_test.rb` to target a file.
- Lint Ruby: `bin/rubocop` — style checks; add `-A` to auto-correct safe cops.
- Lint/format JS/CSS: `npm run lint` and `npm run format` — uses Biome.
- Security scan: `bin/brakeman` — static analysis for common Rails issues.

## Coding Style & Naming Conventions
- Ruby: 2-space indent, `snake_case` for methods/vars, `CamelCase` for classes/modules. Follow Rails conventions for folders and file names.
- Views: ERB checked by `erb-lint` (see `.erb_lint.yml`). Avoid heavy logic in views; prefer helpers/components.
- JavaScript: `lowerCamelCase` for vars/functions, `PascalCase` for classes/components. Let Biome format code.
- Commit small, cohesive changes; keep diffs focused.

## Testing Guidelines
- Framework: Minitest (Rails). Name files `*_test.rb` and mirror `app/` structure.
- Run: `bin/rails test` locally and ensure green before pushing.
- Fixtures/VCR: Use `test/fixtures` and existing VCR cassettes for HTTP. Prefer unit tests plus focused integration tests.

## Commit & Pull Request Guidelines
- Commits: Imperative subject ≤ 72 chars (e.g., "Add account balance validation"). Include rationale in body and referenc

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `bin/dev` - Start development server (Rails, Sidekiq, Tailwind CSS watcher)
- `bin/rails server` - Start Rails server only
- `bin/rails console` - Open Rails console

### Testing
- `bin/rails test` - Run all tests
- `bin/rails test:db` - Run tests with database reset
- `DISABLE_PARALLEL

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
