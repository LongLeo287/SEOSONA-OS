# KI: Sayrix/Ticket-Bot

## Overview
Ticket Bot is a open-source Discord bot that allows you to easily manage support tickets on your server. It is built with `@discordjs/core` for a lower memory footprint than `discord.js`.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 103 files across 30 directories
- **File types:** .ts: 83, .md: 6, .json: 5, .yml: 4, .dockerignore: 1, .gitignore: 1, .lock: 1
- **Key dependencies:** @discordjs/core, @discordjs/rest, @discordjs/ws, @libsql/client, @ticketpm/core, @ticketpm/discord-api, discord-api-types, dotenv, drizzle-kit, drizzle-orm, jsonc-parser, typesafe-i18n
- **Dev dependencies:** @biomejs/biome, @types/node, resolve-tspaths, typescript

## Documentation Sections
- Ticket-Bot
- 📄 Documentation
- 💬 Discord
- ✨ Contributing
- 👨‍💻 Maintainers
- 💎 Sponsors
- 🎥 Videos  
- Please leave a ⭐ to help the project!
- License

## Available Commands
- `npm run typecheck` -- tsc --noEmit -p tsconfig.json
- `npm run check` -- tsc --noEmit -p tsconfig.json && biome check .
- `npm run prepare:config` -- test -f ./config/config.ts || cp ./config/config.example.ts ./config/config.ts
- `npm run i18n` -- typesafe-i18n --no-watch && biome check --write i18n
- `npm run lint` -- biome lint .
- `npm run format` -- biome format .
- `npm run format:fix` -- biome format --write
- `npm run check:fix` -- biome check --write .
- `npm run check:unsafe:fix` -- biome check --unsafe --write .
- `npm run lint:fix` -- biome lint --write .
- `npm run biome:debug` -- biome rage --linter
- `npm run drizzle:push` -- drizzle-kit push

## Core Structure
```
  .dockerignore
  .gitignore
  .typesafe-i18n.json
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE.md
  NOTICE
  README.md
  biome.json
  bun.lock
  docker-compose.yml
  drizzle.config.ts
  package.json
  tsconfig.build.json
  tsconfig.json
  .github/
    CODEOWNERS
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      builder.yml
  config/
    config.example.ts
    example.env
  i18n/
    formatters.ts
    i18n-types.ts
    i18n-util.async.ts
    i18n-util.sync.ts
    i18n-util.ts
    en/
      index.ts
    fr/
      index.ts
  messages/
    logs/
      ticket-claimed.ts
      ticket-closed.ts
      ticket-created.ts
      ticket-deleted.ts
      ticket-renamed.ts
      ticket-unclaimed.ts
      user-added.ts
      user-removed.ts
    tickets/
      open-panel.ts
      ticket-closed-billing.ts
      ticket-closed-dm-billing.ts
      ticket-closed-dm-general.ts
      ticket-closed-dm-report.ts
      ticket-closed-dm.ts
      ticket-closed-general.ts
      ticket-closed-report.ts
      ticket-closed.ts
      ticket-opened-billing.ts
      ticket-opened-general.ts
      ticket-opened-report.ts
      ticket-opened.ts
  scripts/
    verify-migrate-v3.mjs
  src/
    app.ts
    deploy-commands.ts
    index.ts
    migrate-v3-config.ts
    migrate-v3-db.ts
    telemetry.ts
    version.ts
    config/
      index.ts
    core/
      custom-id.ts
      defineCommand.ts
      defineEvent.ts
      defineFeature.ts
      discovery.ts
      i18n.ts
      logger.ts
      registry.ts
      respond.ts
      router.ts
      types.ts
    db/
      schema.ts
    events/
      interactionCreate.ts
      ready.ts
    features/
      commands/
        add/
          command.ts
        claim/
          command.ts
        cleardm/
          command.ts
        close/
          command.ts
        mass_add/
          command.ts
        remove/
          command.ts
        rename/
          command.ts
        shared/
          options.ts
        unclaim/
          command.ts
      logs/
        service.ts
        types.ts
        utils.ts
      tickets/
        claim-workflow.ts
        close-workflow.ts
        config-access.ts
        constants.ts
        feature.ts
        messages.ts
        panel-sync.ts
        participants.ts
        records.ts
        service.ts
        text.ts
        ticket-workflow.ts
        transcripts.ts
        types.ts
        utils.ts
    types/
      config.d.ts
      disc
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Ticket Bot
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the Apache License 2.0
In short, when you submit code changes, your submissions are understood to be under the same [Apache License 2.0](http://choosealicense.com/licenses/apache-2.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/Sayrix/Ticket-Bot/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## License
By contributing, you agree that your contributions will be licensed unde


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
