# KI: community-scripts/proxmoxVE

## Overview
**Simplify your Proxmox VE setup with community-driven automation scripts.**

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 135 files across 13 directories
- **File types:** .md: 60, .sh: 42, .yml: 22, .json: 4, .yaml: 3, .editorconfig: 1, .gitattributes: 1

## Documentation Sections
- What is this?
- Requirements
- Getting Started
- How Scripts Work
- What's Included
- Contributing
- Where to start
- Before you open a PR
- Core Team
- Project Activity
- Support the Project
- License

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  .shellcheckrc
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  .github/
    CODEOWNERS
    CODE_OF_CONDUCT.md
    FUNDING.yml
    autolabeler-config.json
    changelog-pr-config.json
    pull_request_template.md
    DISCUSSION_TEMPLATE/
      request-script.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
      frontend_report.yml
      task.yml
    changelogs/
      2022/
        01.md
        02.md
        03.md
        04.md
        05.md
        06.md
        07.md
        08.md
        09.md
        10.md
        11.md
        12.md
      2023/
        01.md
        02.md
        03.md
        04.md
        05.md
        06.md
        07.md
        08.md
        09.md
        10.md
        11.md
        12.md
      2024/
        01.md
        02.md
        03.md
        04.md
        05.md
        06.md
        07.md
        08.md
        09.md
        10.md
        11.md
        12.md
      2025/
        01.md
        02.md
        03.md
        04.md
        05.md
        06.md
        07.md
        08.md
        09.md
        10.md
        11.md
        12.md
      2026/
        01.md
        02.md
        03.md
        04.md
        05.md
        06.md
    workflows/
      auto-update-app-headers.yml
      autolabeler.yml
      changelog-archive.yml
      changelog-pr.yml
      check-node-versions.yml
      close-new-script-prs.yml
      close-tteck-issues.yaml
      close_issue_in_dev.yaml
      delete-merged-branches.yml
      delete-pocketbase-entry-on-removal.yml
      github-release.yml
      lock-issue.yaml
      pocketbase-ai-bot.yml
      pocketbase-bot.yml
      push-json-to-pocketbase.yml
      stale_pr_close.yml
      trigger_github_pages_redirect.yml
      update-script-timestamp-on-sh-change.yml
      scripts/
        generate-app-headers.sh
  .vscode/
    extensions.json
    settings.json
  ct/
    2fauth.sh
    actualbudget.sh
    adguard.sh
    adventurelog.sh
    agentdvr.sh
    alpine-adguard.sh
    alpine-bitmagnet.sh
    alpine-borgbackup-server.sh
    alpine-caddy.sh
    alpine-cinny.sh
    alpine-docker.sh
    alpine-forgejo.sh
    alpine-garage.sh
    alpine-gatus.sh
    alpine-gitea.sh
    alpine-grafana.sh
    alpine-ironclaw.sh
    alpine-it-tools.sh
    alpine-komodo.sh
    alpine-loki.sh
    alpine-mariadb.sh
    alpine-nextcloud.sh
    alpine-node-red.sh
    alpine-ntfy.sh
    alpine-postgresql.sh
    alpine-pro
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Proxmox VE Helper-Scripts

Welcome! We're glad you want to contribute. This guide covers everything you need to add new scripts, improve existing ones, or help in other ways.

For detailed coding standards and full documentation, visit **[community-scripts.org/docs](https://community-scripts.org/docs)**.

---

## How Can I Help?

> [!IMPORTANT]
> **New scripts** must always be submitted to [ProxmoxVED](https://github.com/community-scripts/ProxmoxVED) first — not to this repository.
> PRs with new scripts opened directly against ProxmoxVE **will be closed without review**.
> **Bug fixes, improvements, and features for existing scripts** go here (ProxmoxVE).

| I want to…                                  | Where to go                                                                                  |
| :------------------------------------------ | :------------------------------------------------------------------------------------------- |
| **Add a brand-new script**                  | [ProxmoxVED](https://github.com/community-scripts/ProxmoxVED) — testing repo for new scripts |
| **Fix a bug or improve an existing script** | This repo (ProxmoxVE) — open a PR here                                                       |
| **Add a feature to an existing script**     | This repo (ProxmoxVE) — open a PR here                                                       |
| Report a bug or broken script               | [Open an Issue](https://github.com/community-scripts/ProxmoxVE/issues)                       |
| Request a new script or feature             | [Start a Discussion](https://github.com/community-scripts/ProxmoxVE/discussions)             |
| Report a security vulnerability             | [Security Policy](SECURITY.md)                                                               |
| Chat with contributors                      | [Discord](https://discord.gg/3AnUqsXnmK)                                                     |

---

## Prerequisites

Befor


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
