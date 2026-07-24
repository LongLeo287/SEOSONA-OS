# KI: huggingface/OpenEnv

## Overview
An e2e framework for creating, deploying and using isolated execution environments for agentic RL training, built using Gymnasium style simple APIs.

## Architecture & Tech Stack
- Python
- **Total files:** 109 files across 38 directories
- **File types:** .md: 58, .sh: 19, .yml: 14, .py: 6, .toml: 2, .yaml: 2, .example: 1

## Documentation Sections
- <img width="35" height="35" alt="image" src="https://github.com/user-attachments/assets/2700a971-e5d6-4036-b03f-2f89c9791609" /> OpenEnv: Agentic Execution Environments
- Quick Start
- Use .sync() for synchronous context manager
- Overview
- RFCs
- Architecture
- Component Overview
- Core Components
- Project Structure
- For Environment Creators
- Install environment in editable mode
- Or using uv (faster)
- Run server locally without Docker
- For Environment Users
- CLI Commands
- Quick Start
- Create a new environment
- Deploy to Hugging Face (will prompt for login if needed)
- Development
- Installation
- Clone the repository
- Install core 

## Core Structure
```
  .env.example
  .gitattributes
  .gitignore
  .gitkeep
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  MANIFEST.in
  README.md
  pyproject.toml
  .agents/
    skills/
      hf-cli/
        SKILL.md
      openenv-cli/
        SKILL.md
  .claude/
    settings.json
    agents/
      alignment-reviewer.md
      build-validator.md
      docs-updater.md
      env-validator.md
      implementer.md
      issue-worker.md
      openenv-architect.md
      pr-planner.md
      tester.md
    docs/
      CONTRIBUTING.md
      INVARIANTS.md
      PATTERNS.md
      PRINCIPLES.md
      REPO_WALKTHROUGH.md
      TESTING_STRATEGY.md
    hooks/
      after-docs-updater.sh
      after-implementer.sh
      after-tester.sh
      check-debug.sh
      check-line-endings.sh
      ci-wait.sh
      delegate-todos.sh
      install.sh
      lint.sh
      no-direct-code.sh
      post-push-pr.sh
      pre-commit-check.sh
      pre-pr-check.sh
      session-start.sh
      tdd-deactivate.sh
      tdd-state.sh
      test.sh
    scripts/
      worktree-cleanup.sh
      worktree-create.sh
    skills/
      alignment-review/
        SKILL.md
      deploy-hf/
        SKILL.md
      generate-openenv-env/
        SKILL.md
        agents/
          openai.yaml
        assets/
          openenv_env_template/
            .dockerignore
            README.md
            __init__.py
            client.py
            models.py
            openenv.yaml
            pyproject.toml
            server/
              Dockerfile
              __ENV_NAME___environment.py
              __init__.py
              app.py
              requirements.txt
        references/
          env-generation-checklist.md
          openenv-docs-environment-builder.md
          openenv-tutorial-01-environments.md
      hf-space-recovery/
        SKILL.md
        references/
          troubleshooting.md
      implement/
        SKILL.md
      pre-submit-pr/
        SKILL.md
      release/
        SKILL.md
      rfc-check/
        SKILL.md
      simplify/
        SKILL.md
      sprint/
        SKILL.md
      update-docs/
        SKILL.md
      watch-pr/
        SKILL.md
      work-on-issue/
        SKILL.md
      write-tests/
        SKILL.md
  .codex/
    skills
  .github/
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    ISSUE_TEMPLATE/
      rfc-proposal.md
    PULL_REQUEST_TEMPLATE/
      release.md
    workflows/
      auto-bump-version.yml
      build_documentation.yml
      build_pr_documentation.yml
      d
```

## Quick Start
```bash
pip install openenv
pip install git+https://huggingface.co/spaces/openenv/echo_env
**Synchronous usage** is also supported via the `.sync()` wrapper:
For a detailed quick start, check out the [docs page](https://huggingface.co/docs/openenv/getting-started).
OpenEnv provides a standard for interacting with agentic execution environments via simple Gymnasium style APIs - `step()`, `reset()`, `state()`. Users of agentic execution environments can interact with the environment during RL training loops using these simple APIs.
In addition to making it easier for researchers and RL framework writers, we also provide tools for environment creators making it easier for them to create richer environments and make them available over familiar protocols like HTTP and packaged using canonical technologies like docker. Environment creators can use the OpenEnv framework to create environments that are isolated, secure, and easy to deploy and use.
The OpenEnv CLI (`openenv`) provides commands to initialize new environments and deploy them to Hugging Face Spaces.
> ⚠️ **Early Development Warning** OpenEnv is currently in an experimental
> stage. You should expect bugs, incomplete features, and APIs that may change
> in future versions. The project welcomes bugfixes, but significant changes
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

Guidance for Claude Code when working with this repository.

## New Here? Start With These

1. **[README.md](README.md)** - Project overview, architecture, quick start
2. **[REPO_WALKTHROUGH.md](.claude/docs/REPO_WALKTHROUGH.md)** - Directory structure with annotations
3. **[PRINCIPLES.md](.claude/docs/PRINCIPLES.md)** - Design principles and trade-offs
4. **[INVARIANTS.md](.claude/docs/INVARIANTS.md)** - Rules that must never be violated
5. **[envs/echo_env/](envs/echo_env/)** - Reference implementation to study

## Agentic-First Workflow

OpenEnv uses Claude Code as the primary development tool. We follow a two-phase model:

1. **Design/Alignment** (human-owned): RFCs, principles, trade-off decisions
2. **Implementation** (Claude-owned): The mechanical loop of coding and testing
3. **Review** (collaborative): Claude catches bugs, flags alignment questions for humans

### Getting Started

Skills and agents are auto-discovered when you run Claude Code in this repo:

```bash
git clone https://github.com/huggingface/OpenEnv
cd OpenEnv
# Install git hooks for the team
bash .claude/hooks/install.sh
# Run Claude Code - skills and agents are automatically available
```

Verify with `/agents` or ask "what skills are available?"

## Two Development Modes

OpenEnv supports two development modes:

### Explore Mode (Main Repo)

When working in the main repository clone, direct edits are allowed:
- Quick exploration and prototyping
- Small fixes that don't need TDD workflow
- Documentation updates

### TDD Mode (Opt-In)

TDD is activated by `/work-on-issue`, which writes a `.tdd-session.json` marker.
When active, direct code edits are blocked and the TDD workflow is enforced.
Manually created worktrees do NOT activate TDD — only `/work-on-issue` does.

- Say "skip TDD" to bypass blocking
- Run `bash .claude/hooks/tdd-deactivate.sh` to turn off TDD enforcement

### Creating a Worktree

```bash
# Worktree without TDD enforcement (free editing)
.claude/scripts/worktre

--- CONTRIBUTING.md ---
# Contributing to OpenEnv

OpenEnv is an **agentic-first project** designed for Claude Code contributions.

## Quick Links

- **Contribution workflow**: See [.claude/docs/CONTRIBUTING.md](.claude/docs/CONTRIBUTING.md) for the agentic workflow, RFC process, and review expectations
- **Design principles**: See [.claude/docs/PRINCIPLES.md](.claude/docs/PRINCIPLES.md)
- **System invariants**: See [.claude/docs/INVARIANTS.md](.claude/docs/INVARIANTS.md)
- 

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
