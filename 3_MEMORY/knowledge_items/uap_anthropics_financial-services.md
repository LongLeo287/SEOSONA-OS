# KI: anthropics/financial-services

## Overview
Reference agents, skills, and data connectors for the financial-services workflows we see most — investment banking, equity research, private equity, and wealth management.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 100 files across 48 directories
- **File types:** .yaml: 40, .md: 32, .json: 14, .py: 4, .yml: 3, .ps1: 2, .sh: 2

## Documentation Sections
- Claude for Financial Services
- Agents
- Repository Layout
- Getting Started
- Cowork
- Claude Code
- Add the marketplace
- Core skills + connectors (install first)
- Named agents — pick the ones you want
- Vertical skill bundles
- Claude Managed Agents
- How It Fits Together
- Vertical Plugins
- MCP Integrations
- Claude for Microsoft 365 — Install Tooling
- Making It Yours
- Skill & Command Reference

## Core Structure
```
  .gitignore
  CLAUDE.md
  LICENSE
  README.md
  .claude-plugin/
    marketplace.json
  .githooks/
    pre-commit
  .github/
    workflows/
      plugin-validate.yml
      secret-scan.yml
      version-bump.yml
  claude-for-msft-365-install/
    README.md
    .claude-plugin/
      plugin.json
    commands/
      bootstrap.md
      consent.md
      debug.md
      manifest.md
      setup.md
      update-user-attrs.md
    examples/
      python-bootstrap/
        README.md
        app.py
        config.py
        get_tenant_id.py
        mint_dev_token.py
        requirements.txt
    scripts/
      build-manifest.mjs
      clear-addin-cache.ps1
      clear-addin-cache.sh
      sideload-addin.ps1
      sideload-addin.sh
  managed-agent-cookbooks/
    README.md
    earnings-reviewer/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        model-updater.yaml
        note-writer.yaml
        transcript-reader.yaml
    gl-reconciler/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        critic.yaml
        reader.yaml
        resolver.yaml
    kyc-screener/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        doc-reader.yaml
        escalator.yaml
        rules-engine.yaml
    market-researcher/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        comps-spreader.yaml
        note-writer.yaml
        sector-reader.yaml
    meeting-prep-agent/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        news-reader.yaml
        pack-writer.yaml
        profiler.yaml
    model-builder/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        auditor.yaml
        builder.yaml
        data-puller.yaml
    month-end-closer/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        ledger-reader.yaml
        poster.yaml
        rollforward.yaml
    pitch-agent/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        deck-writer.yaml
        modeler.yaml
        researcher.yaml
    statement-auditor/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        flagger.yaml
        reconciler.yaml
        statement-reader.yaml
    valuation-reviewer/
      README.md
      agent.yaml
      steering-examples.json
      subagents/
        package-reader.yaml
        publisher.yaml
        valuation-runner.y
```

## Quick Start
```bash
plugins/
agent-plugins/               # Named agents — one self-contained plugin each
vertical-plugins/            # Skill + command bundles by FSI vertical, plus MCP connectors
partner-built/               # Partner-authored plugins (LSEG, S&P Global)
managed-agent-cookbooks/       # Claude Managed Agent cookbooks — one dir per agent
claude-for-msft-365-install/   # Admin tooling to provision the Claude Microsoft 365 add-in
scripts/                       # deploy-managed-agent.sh · check.py · validate.py · orchestrate.py · sync-agent-skills.py
claude plugin marketplace add anthropics/financial-services
claude plugin install financial-analysis@claude-for-financial-services
claude plugin install pitch-agent@claude-for-financial-services
```

## Agent Configuration

--- CLAUDE.md ---
# Financial Services Plugins

Cowork plugins and Claude Managed Agent templates for financial services. Each named agent ships two ways from one source.

## Repository Structure

```
├── plugins/
│   ├── agent-plugins/               #   named agents — one self-contained plugin each
│   │   └── <slug>/
│   │       ├── .claude-plugin/plugin.json
│   │       ├── agents/<slug>.md     #   ← canonical system prompt (one source, two wrappers)
│   │       └── skills/              #   ← bundled copies, synced from vertical-plugins/
│   ├── vertical-plugins/            #   FSI verticals — skill sources, commands, MCPs
│   │   └── <vertical>/
│   │       ├── .claude-plugin/plugin.json
│   │       ├── commands/
│   │       ├── skills/
│   │       └── .mcp.json
│   └── partner-built/               #   partner plugins (LSEG, S&P Global)
├── managed-agent-cookbooks/         # CMA cookbooks (one dir per named agent)
│   └── <slug>/
│       ├── agent.yaml               #   system + skills → ../../plugins/agent-plugins/<slug>/...
│       ├── subagents/*.yaml         #   depth-1 leaf workers
│       ├── steering-examples.json
│       └── README.md                #   security tier + handoff notes
├── claude-for-msft-365-install/     # admin tooling for the Microsoft 365 add-in (separate from FSI plugins)
└── scripts/                         # deploy-managed-agent.sh, check.py, validate.py, orchestrate.py, sync-agent-skills.py
```

Run `python3 scripts/check.py` before committing — it lints every manifest, verifies all `system.file` / `skills.path` / `callable_agents.manifest` references resolve, and fails if any `agent-plugins/<slug>/skills/` copy has drifted from its `vertical-plugins/` source. **Edit skills in `vertical-plugins/`**, then run `python3 scripts/sync-agent-skills.py` to propagate into the agent bundles.

`check.py` also self-installs a `pre-commit` hook (`git config core.hooksPath .githooks` — no Husky/Node). The hook patch-bumps any plugin's `.claude-plugin/plugin.json`


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
