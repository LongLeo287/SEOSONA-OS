# KI: unohee/OpenSwarm

## Overview
Autonomous AI agent orchestrator — Claude, GPT, Codex, and local models (Ollama/LMStudio/llama.cpp)

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Anthropic SDK, Playwright
- **Total files:** 133 files across 14 directories
- **File types:** .ts: 55, .json: 39, .md: 12, .txt: 7, .yml: 6, .sh: 5, .png: 2
- **Key dependencies:** @anthropic-ai/sdk, @inquirer/prompts, @intrect/cxt, @intrect/openswarm, @lancedb/lancedb, @linear/sdk, @modelcontextprotocol/sdk, @types/better-sqlite3, @types/blessed, @xenova/transformers, apache-arrow, better-sqlite3
- **Dev dependencies:** @types/node, @vitest/coverage-v8, bun-types, oxlint, playwright, tsx, typescript, vitest

## Documentation Sections
- OpenSwarm
- Quick Start
- What `openswarm init` sets up
- TUI keyboard shortcuts
- CLI Commands
- Code Registry & BS Detector
- `openswarm exec` options
- Full Daemon Setup
- Prerequisites
- Configuration
- Key configuration sections
- CLI Adapter (Provider)
- Agent Roles
- Running the daemon
- Ar

## Available Commands
- `npm run predev` -- pkill -f 'tsx src/index.ts' 2>/dev/null || true
- `npm run dev` -- node --env-file=.env --import=tsx src/index.ts
- `npm run prestart` -- pkill -f 'dist/index.js' 2>/dev/null || true
- `npm run build` -- tsc
- `npm run start` -- node --env-file=.env dist/index.js
- `npm run stop` -- pkill -f 'node --env-file=.env.*openswarm' 2>/dev/null || echo 'No process runni
- `npm run lint` -- oxlint src/
- `npm run typecheck` -- tsc --noEmit
- `npm run test` -- node --experimental-vm-modules node_modules/vitest/vitest.mjs run
- `npm run test:watch` -- node --experimental-vm-modules node_modules/vitest/vitest.mjs
- `npm run chat` -- node --env-file=.env --import=tsx src/support/chat.ts
- `npm run cli:dev` -- node --env-file=.env --import=tsx src/cli.ts

## Core Structure
```
  .dockerignore
  .env.example
  .gitignore
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  SECURITY.md
  config.example.yaml
  docker-compose.yml
  package-lock.json
  package.json
  tsconfig.json
  vitest.config.ts
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    DISCUSSION_TEMPLATE/
      idea.yml
      roadmap-vote.yml
    ISSUE_TEMPLATE/
      bug_report.md
      config.yml
      feature_request.md
    workflows/
      ci.yml
  benchmarks/
    RUBRIC.md
    harnessSeparation.ts
    modelSelect.ts
    sweBench.ts
    throughputProbe.ts
    results/
      kimi_ladder_260611.json
      latest.json
      phase0_gonogo.json
      phase0_gonogo_report.md
      swe_5859_diagnosis.txt
      swe_5859_fix8_RESOLVED_report.json
      swe_5859_fix8_sourceonly_preds.json
      swe_5859_glm51_worker_preds.json
      swe_5859_glm51_worker_report.json
      swe_5859_kimi_worker_RESOLVED_report.json
      swe_5859_kimi_worker_preds.json
      swe_7080_glm51_diagnosis.txt
      swe_7080_glm51_planner_v1_failed_preds.json
      swe_7080_glm51_rediag_RESOLVED_report.json
      swe_7080_glm51_rediag_preds.json
      swe_7080_glm51_rediagnosis.txt
      swe_7080_kimi_k26_diagnosis.txt
      swe_7080_kimi_planner_RESOLVED_report.json
      swe_7080_kimi_planner_preds.json
      swe_7993_diagnosis.txt
      swe_7993_kimi_worker_RESOLVED_report.json
      swe_7993_kimi_worker_preds.json
      swe_7993_rediagnosis.txt
      swe_preds.json
      swe_pylint_3models_preds.json
      swe_pylint_7993_hybrid_RESOLVED_report.json
      swe_pylint_7993_hybrid_retry_preds.json
      swe_pylint_7993_hybrid_v3_preds.json
      swe_pylint_7993_hybrid_v4_preds.json
      swe_pylint_7993_hybrid_v5_preds.json
      swe_pylint_7993_hybrid_v6_preds.json
      swe_pylint_7993_hybrid_v7_preds.json
      swe_pylint_RESOLVED_report.json
      swe_pylint_gemini_preds.json
      swe_pylint_glm_preds.json
      swe_pylint_gpt5_preds.json
      swe_pylint_hybrid_RESOLVED_preds.json
      swe_pylint_hybrid_RESOLVED_report.json
      swe_pylint_hybrid_deepseek_preds.json
      swe_pylint_hybrid_deepseek_report.json
      swe_pylint_hybrid_diagnosis.txt
      swe_pylint_hybrid_glm_preds.json
      swe_pylint_new2_hybrid_preds.json
      swe_pylint_new2_hybrid_report.json
    tasks/
      codingTasks.ts
  docs/
    AUTONOMY_PROTOCOL.md
  screenshots/
    dashboard-main.png
    tui.png
  scripts/
    README-RENDERING-PERFORMANCE.md
    com.intrect.opens
```

## Quick Start
```bash
npm install -g @intrect/openswarm
openswarm init         # interactive setup wizard — provider auth + Linear OAuth + config
openswarm doctor       # verify your environment (runtime, native deps, providers, ports)
openswarm              # launches the TUI chat
openswarm                        # TUI chat (default)
openswarm chat [session]         # Simple readline chat
openswarm start                  # Start full daemon (requires config.yaml)
openswarm run "Fix the bug" -p ~/my-project   # Run a single task
openswarm exec "Run tests" --local --pipeline # Execute via daemon
openswarm init                   # Interactive setup wizard (provider auth, Linear OAuth, config)
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to OpenSwarm

Thank you for your interest in OpenSwarm. OpenSwarm is [MIT-licensed](LICENSE) and welcomes
pull requests, bug reports, and ideas from everyone. This document covers both **how to
contribute code** (setup, checks, PR flow) and the **community guidelines** for issues and
conduct.

### Ways to contribute

- 🐛 **Bug reports** — open a [bug report](https://github.com/unohee/OpenSwarm/issues/new?template=bug_report.md)
- 💡 **Feature ideas** — start a [Discussion](https://github.com/unohee/OpenSwarm/discussions); the roadmap is built in the open
- 🔧 **Code** — see [Development setup](#development-setup) below, then send a PR
- 📖 **Docs** — typo fixes and clarifications are always welcome

## Issues

### Allowed

- **Bug reports**: Clear description of the bug, steps to reproduce, expected vs actual behavior.
- **Feature requests**: Describe the problem you're facing within OpenSwarm and propose a solution.
- **Technical discussions**: Architecture decisions, design trade-offs, or implementation questions directly related to OpenSwarm.

### Not Allowed

- **Product promotion**: Issues that primarily serve to advertise an external product, service, or library are not accepted. This includes framing a feature request around a specific external tool as the only or default solution.
- **Unsolicited integration proposals for commercial or self-hosted services**: If you want to propose integrating an external tool, the issue must clearly define the problem independent of that tool and present at least one alternative approach that does not depend on it.
- **Drive-by self-promotion in comments**: Do not post links to your own projects, repositories, or products in issue threads unless they are directly relevant to solving a problem under active discussion. Dropping links with minimal context to increase visibility for your project will be treated as spam.

### Conflict of Interest Disclosure

If you propose a feature, integration, or architectural cha


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
