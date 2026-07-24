# KI: chatwoot/chatwoot

## Overview
The modern customer support platform, an open-source alternative to Intercom, Zendesk, Salesforce Service Cloud etc.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 111 files across 27 directories
- **File types:** .yml: 30, .scss: 19, .js: 8, .md: 8, .yaml: 6, .json: 5, .ts: 5

## Documentation Sections
- Chatwoot
- ✨ Captain – AI Agent for Support
- 💬 Omnichannel Support Desk
- 📚 Help center portal
- 🗂️ Other features
- Documentation
- Translation process
- Branching model
- Deployment
- Heroku one-click deploy
- DigitalOcean 1-Click Kubernetes deployment
- Other deployment options
- Security
- Community
- Contributors

## Core Structure
```
  .all-contributorsrc
  .annotaterb.yml
  .browserslistrc
  .bundler-audit.yml
  .dockerignore
  .editorconfig
  .env.example
  .eslintrc.js
  .gitignore
  .nvmrc
  .prettierrc
  .rspec
  .rubocop.yml
  .ruby-version
  .scss-lint.yml
  .slugignore
  AGENTS.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Capfile
  Gemfile
  Gemfile.lock
  LICENSE
  Makefile
  Procfile
  Procfile.dev
  Procfile.test
  Procfile.tunnel
  README.md
  Rakefile
  SECURITY.md
  VERSION_CW
  VERSION_CWCTL
  app.json
  config.ru
  crowdin.yml
  docker-compose.production.yaml
  docker-compose.test.yaml
  docker-compose.yaml
  histoire.config.ts
  package.json
  pnpm-lock.yaml
  postcss.config.js
  semantic.yml
  tailwind.config.js
  vite.config.ts
  vite.lib.config.ts
  vite.shared.ts
  vitest.config.ts
  vitest.setup.js
  workbox-config.js
  .circleci/
    config.yml
    setup_chatwoot.sql
  .dependabot/
    config.yml
  .devcontainer/
    Dockerfile
    Dockerfile.base
    devcontainer.json
    docker-compose.base.yml
    docker-compose.yml
    scripts/
      setup.sh
  .github/
    CODEOWNERS
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    screenshots/
      dashboard-dark.png
      dashboard.png
      header-dark.png
      header.png
    scripts/
      ghsa_linear_sync.py
    workflows/
      auto-assign-pr.yml
      deploy_check.yml
      frontend-fe.yml
      ghsa-linear-sync.yml
      lint_pr.yml
      lock.yml
      logging_percentage_check.yml
      nightly_installer.yml
      publish_codespace_image.yml
      publish_ee_docker.yml
      publish_foss_docker.yml
      run_foss_spec.yml
      run_mfa_spec.yml
      size-limit.yml
      stale.yml
      test_docker_build.yml
  .husky/
    pre-commit
    pre-push
  .qlty/
    .gitignore
    qlty.toml
    configs/
      .hadolint.yaml
      .shellcheckrc
      .yamllint.yaml
  .vscode/
    extensions.json
    settings.json
  .windsurf/
    rules/
      chatwoot.md
  __mocks__/
    fileMock.js
  app/
    actions/
      contact_identify_action.rb
      contact_merge_action.rb
    assets/
      config/
        manifest.js
      images/
        .keep
      javascripts/
        secretField.js
      stylesheets/
        administrate/
          application.scss
          custom_styles.scss
          base/
            _forms.scss
            _layout.scss
            _lists.scss
            _tables.scss
            _typography.scss
          compon
```

## Agent Configuration

--- AGENTS.md ---
# Chatwoot Development Guidelines

## Build / Test / Lint

- **Setup**: `bundle install && pnpm install`
- **Run Dev**: `pnpm dev` or `overmind start -f ./Procfile.dev`
- **Seed Local Test Data**: `bundle exec rails db:seed` (quickly populates minimal data for standard feature verification)
- **Seed Search Test Data**: `bundle exec rails search:setup_test_data` (bulk fixture generation for search/performance/manual load scenarios)
- **Seed Account Sample Data (richer test data)**: `Seeders::AccountSeeder` is available as an internal utility and is exposed through Super Admin `Accounts#seed`, but can be used directly in dev workflows too:
  - UI path: Super Admin → Accounts → Seed (enqueues `Internal::SeedAccountJob`).
  - CLI path: `bundle exec rails runner "Internal::SeedAccountJob.perform_now(Account.find(<id>))"` (or call `Seeders::AccountSeeder.new(account: Account.find(<id>)).perform!` directly).
- **Lint JS/Vue**: `pnpm eslint` / `pnpm eslint:fix`
- **Lint Ruby**: `bundle exec rubocop -a`
- **Test JS**: `pnpm test` or `pnpm test:watch`
- **Test Ruby**: `bundle exec rspec spec/path/to/file_spec.rb`
- **Single Test**: `bundle exec rspec spec/path/to/file_spec.rb:LINE_NUMBER`
- **Run Project**: `overmind start -f Procfile.dev`
- **Ruby Version**: Manage Ruby via `rbenv` and install the version listed in `.ruby-version` (e.g., `rbenv install $(cat .ruby-version)`)
- **rbenv setup**: Before running any `bundle` or `rspec` commands, init rbenv in your shell (`eval "$(rbenv init -)"`) so the correct Ruby/Bundler versions are used
- Always prefer `bundle exec` for Ruby CLI tasks (rspec, rake, rubocop, etc.)

## Code Style

- **Ruby**: Follow RuboCop rules (150 character max line length)
- **Vue/JS**: Use ESLint (Airbnb base + Vue 3 recommended)
- **Vue Components**: Use PascalCase
- **Events**: Use camelCase
- **I18n**: No bare strings in templates; use i18n
- **Error Handling**: Use custom exceptions (`lib/custom_exceptions/`)
- **Models**: Validate presence/uniquene

--- CLAUDE.md ---
AGENTS.md

--- CONTRIBUTING.md ---
# Contributing to Chatwoot

Thanks for taking the time to contribute! :tada::+1:

Please refer to our [Contributing Guide](https://www.chatwoot.com/docs/contributing-guide) for detailed instructions on how to contribute.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
