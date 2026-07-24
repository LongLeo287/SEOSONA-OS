# KI: huggingface/Repo2RLEnv

## Overview
uv add repo2rlenv                                 # add to a uv-managed project uvx repo2rlenv --help                             # one-shot, no install pip install repo2rlenv                            # classic

## Architecture & Tech Stack
- Python
- **Total files:** 129 files across 20 directories
- **File types:** .py: 90, .md: 28, .yml: 3, .example: 1, .gitignore: 1, .python-version: 1, .toml: 1

## Documentation Sections
- Quickstart
- Install (pick one)
- Auth: nothing to set up if you've done `gh auth login` and `huggingface-cli login`.
- Otherwise:  export GITHUB_TOKEN=... ; export HF_TOKEN=...
- Generate a dataset locally
- Validate (fast structural check) and publish
- Anyone can pull + run a published dataset on a fresh machine
- How it works
- every pipeline shares one contract: read a repo, emit verifiable tasks
- 1. synthesize an environment from a repo
- 2. run an agent inside the sandbox (swap -a / -m for any of 25+ harnesses)
- Pipelines
- Stable
- Experimental
- At a glance
- Bootstrap
- What you get out
- Under the hood
- Contributing a pipeline

## Core Structure
```
  .env.example
  .gitignore
  .python-version
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  audit.md
  blog-harbor-101.md
  pyproject.toml
  uv.lock
  .github/
    dependabot.yml
    workflows/
      ci.yml
      release.yml
  assets/
    banner.html
    banner.png
  docs/
    README.md
    quickstart.md
    contributing/
      ADDING_A_PIPELINE.md
    pipelines/
      README.md
      code_instruct.md
      commit_runtime.md
      cve_patches.md
      equivalence_tests.md
      pr_diff.md
      pr_runtime.md
    reference/
      AGENTS.md
      API.md
      AUTH.md
      BOOTSTRAP.md
      ENV.md
      REGISTRY_AUTH.md
      RELATED_WORK.md
      REWARD_SCHEMA.md
      SPEC.md
    release_notes/
      v0.8.2.post3.md
      v0.8.3/
        findings-commit_runtime.md
        findings-pr_diff.md
        findings-pr_runtime.md
  src/
    repo2rlenv/
      __init__.py
      auth.py
      cli.py
      config.py
      git_local.py
      github.py
      gitlab.py
      hub.py
      llm.py
      osv.py
      provider.py
      py.typed
      reward.py
      sources.py
      bootstrap/
        __init__.py
        agent.py
        cache.py
        docker.py
        language.py
        presets.py
        prompts.py
        runner.py
        spec.py
      emitter/
        __init__.py
        harbor.py
      log_parsers/
        __init__.py
        cargo_parser.py
        go_parser.py
        jest_parser.py
        pytest_parser.py
      pipelines/
        __init__.py
        _env_guard.py
        _eval_script.py
        _function_extractor.py
        _oss_instruct.py
        _poc_agent.py
        _pr_diff_verifier.py
        _pr_runtime_verifier.py
        base.py
        code_instruct.py
        commit_runtime.py
        cve_patches.py
        equivalence_tests.py
        pr_diff.py
        pr_runtime.py
        pr_runtime_validate.py
      registry/
        __init__.py
        auth.py
        ecr.py
        gar.py
        integration.py
        naming.py
        probe.py
        push.py
        visibility.py
      spec/
        __init__.py
        input.py
        options.py
      ui/
        __init__.py
        console.py
        live.py
        primitives.py
        theme.py
        views/
          __init__.py
          bootstrap.py
          generation.py
  tests/
    __init__.py
    test_auth.py
    test_bootstrap_agent.py
    test_bootstrap_cache.py
    test_bootstrap_language.py
    test_bootstrap_presets.py
    test_bootstrap_robustness.py
    test_boo
```

## Quick Start
```bash
uv add repo2rlenv                                 # add to a uv-managed project
uvx repo2rlenv --help                             # one-shot, no install
pip install repo2rlenv                            # classic
repo2rlenv generate \
--repo <owner>/<repo> \
--pipeline pr_runtime \
--pipeline-opt limit=5 \
--llm anthropic/claude-sonnet-4-6 \
--out ./datasets/<dataset-name>
repo2rlenv validate ./datasets/<dataset-name>
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md — project memory for Repo2RLEnv

This file is auto-loaded by Claude Code in this repo. Keep it tight; longer prose belongs in `docs/`.

## What this is

**Repo2RLEnv** (`repo2rlenv` on PyPI) turns any GitHub repository into a verifiable RL training/eval dataset. End-to-end: **synthesis → standardize → train + eval**, focus on training. We emit datasets in the [Harbor](https://github.com/harbor-framework/harbor) task format so they drop straight into Harbor's runtime ecosystem (Local Docker / Modal / Daytona / E2B / Runloop + 22 agent harnesses).

GitHub: https://github.com/huggingface/Repo2RLEnv · PyPI: `repo2rlenv` · License: Apache-2.0.

## Architecture

Three layers, only the first is ours:

| Layer | We ship | We delegate |
|---|---|---|
| **Generation** (pipelines that produce tasks) | `src/repo2rlenv/pipelines/` — the moat | — |
| **Spec** (uniform output format) | `[metadata.repo2env]` extension to Harbor's `task.toml` | Harbor's task spec |
| **Consumption** (sandboxes / agents / runtime) | HF Hub publish bridge; planned TRL trainer bridge | Harbor's full stack |

## Where things live

```
src/repo2rlenv/
├── spec/                       # Pydantic input + output models (the contract)
├── pipelines/
│   ├── base.py                 # Pipeline Protocol + PipelineResult
│   ├── pr_diff.py              # SHIPPED — PR-diff mining; text-only gen, Docker-runnable env (6-component verifier)
│   ├── _pr_diff_verifier.py    # in-container 6-component diff-similarity reward (pure stdlib, base64-baked)
│   ├── _eval_script.py         # shared verifier-script + diff helpers (code_instruct, equivalence_tests)
│   ├── _env_guard.py           # anti-contamination: git-history scrub + egress-guard compose (all runtime pipelines)
│   └── _poc_agent.py           # agentic PoC-test synthesis for cve_patches (LLM + shell in the vuln sandbox)
├── bootstrap/                  # v0.2 — LLM-driven Docker env generation
│   ├── runner.py               # ensure_bootstrap() o

--- CONTRIBUTING.md ---
# Contributing to Repo2RLEnv

Thanks for your interest in contributing. This is a small research project; the bar for changes is "does it improve the synthesis path or make tasks more verifiable?" — not "does it match an exact roadmap." Small PRs are welcome; large refactors should start with an issue first.

## Quick start (dev environment)

```bash
# Clone + enter
git clone https://github.com/huggingface/Repo2RLEnv.git
cd Repo2RLEnv

# uv handles Py

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
