# KI: gitpod-io/gitpod

## Overview
**[Gitpod has been renamed to Ona](https://ona.com/stories/gitpod-is-now-ona) - mission control for software projects and software engineering agents**. We no longer recommend this version of Gitpod, users should take advantage of Ona's [free tier](https://app.gitpod.io/) or [contact sales for enterprise](https://ona.com/enterprise). With Ona you gain more powerful development environments than Gitpod Classic with industry-standard specifications based on Dev Container and Ona Agents.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 116 files across 32 directories
- **File types:** .yml: 37, .go: 31, .md: 12, .yaml: 7, .json: 5, .txt: 4, .sh: 4
- **Dev dependencies:** @types/node, @types/shelljs, json, rimraf, ts-node, typescript

## Documentation Sections
- Gitpod Classic 
- Documentation
- Related Projects

## Available Commands
- `npm run build` -- leeway exec --filter-type yarn --cache-key yarn_build -- yarn build
- `npm run rebuild` -- leeway exec --filter-type yarn -- yarn build
- `npm run watch` -- leeway exec --package components:all --transitive-dependencies --filter-type yar
- `npm run clean` -- leeway exec --filter-type yarn -- yarn clean && rm -rf node_modules

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  .gitleaks.toml
  .gitpod.yml
  .leewayignore
  .pre-commit-config.yaml
  .prettierrc.json
  CLAUDE.md
  LICENSE.md
  License.AGPL.txt
  License.third-party.go.txt
  License.third-party.npm.txt
  README.md
  SECURITY.md
  WORKSPACE.yaml
  codecov.yml
  gitpod-ws.code-workspace
  package.json
  resolutions-explanation.md
  yarn.lock
  .claude/
    settings.json
  .clinerules/
    memory-bank.md
  .devcontainer/
    Dockerfile
    devcontainer.json
  .github/
    CODEOWNERS
    pull_request_template.md
    sync.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      epic.yml
      feature_request.md
    actions/
      delete-preview/
        action.yml
      deploy-gitpod/
        action.yml
      deploy-monitoring-satellite/
        action.yml
      integration-tests/
        action.yml
      preview-create/
        action.yml
      sanitize-branch-name/
        action.yml
      setup-environment/
        action.yml
    workflows/
      Monitor Branch Protection Changes.yml
      authorization.yml
      branch-build.yml
      build.yml
      check-gitpodyaml.yml
      code-build.yaml
      code-nightly.yml
      code-updates.yml
      configcat.yml
      dashboard-sync.yml
      ide-integration-tests.yml
      jetbrains-auto-update-template.yml
      jetbrains-auto-update.yml
      jetbrains-integration-test.yml
      jetbrains-update-plugin-platform-template.yml
      jetbrains-update-plugin-platform.yml
      jetbrains-updates.yml
      preview-env-check-regressions.yml
      preview-env-delete.yml
      preview-env-gc.yml
      public-api.yml
      stale-bot.yml
      team-labeler.yml
      update-image-digest.yml
      workspace-integration-tests.yml
  .gitpod/
    automations.yaml
  .idea/
    .gitignore
    gradle.xml
    misc.xml
  .vscode/
    launch.json
  .werft/
    jobs/
  components/
    BUILD.yaml
    leeway.Dockerfile
    blobserve/
      BUILD.yaml
      CLAUDE.md
      README.md
      debug.sh
      go.mod
      go.sum
      leeway.Dockerfile
      main.go
      telepresence.sh
      cmd/
        root.go
        run.go
      pkg/
        blobserve/
          blobserve.go
          blobspace.go
          blobspace_test.go
          refstore.go
          refstore_test.go
        config/
          blobserve.go
          config.go
    common-go/
      BUILD.yaml
      CLAUDE.md
      README.md
      go-get-kubernetes.sh
      go-update-wc-deps.sh
      go.mod
      go.sum
      kubernet
```

## Agent Configuration

--- CLAUDE.md ---
# Claude Context for Gitpod

This file provides essential context for AI assistants working on the Gitpod codebase.

## Project Overview

Gitpod is a cloud development environment platform that provides automated, ready-to-code development environments for any Git repository. The platform consists of multiple interconnected services and components that work together to deliver seamless developer experiences.

## Memory Bank Structure

This repository maintains comprehensive documentation in the `memory-bank/` directory:

### Core Documentation
- **[Project Brief](memory-bank/projectbrief.md)** - Foundation document defining core requirements and goals
- **[Product Context](memory-bank/productContext.md)** - Why this project exists and problems it solves
- **[System Patterns](memory-bank/systemPatterns.md)** - System architecture and key technical decisions
- **[Tech Context](memory-bank/techContext.md)** - Technologies used and development setup
- **[Active Context](memory-bank/activeContext.md)** - Current work focus and recent changes
- **[Progress](memory-bank/progress.md)** - What works, what's left to build, and current status

### Component Documentation
The `memory-bank/components/` directory contains detailed documentation for each service and component in the Gitpod platform. Start with **[components.md](memory-bank/components.md)** for an overview.

## Working with This Codebase

1. **Start by reading the memory bank** - Always begin by reviewing the core documentation files above to understand the current state and context
2. **Component-specific work** - Refer to the relevant component documentation in `memory-bank/components/`
3. **Architecture decisions** - Check `memory-bank/systemPatterns.md` for established patterns and conventions
4. **Current focus** - Review `memory-bank/activeContext.md` for ongoing work and priorities

## Key Characteristics

- **Multi-service architecture** - Gitpod consists of dozens of interconnected services
- **Kubernetes-


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
