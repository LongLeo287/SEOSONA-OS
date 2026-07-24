# KI: minhnv0807/fullstack-mkt-skills

## Overview
This repository appears to be a collection of marketing skills and workflows designed for AI agents, particularly Claude. The content is structured around skill definitions in Markdown format, organized into clusters (Vietnamese and English) and modules like dropshipping and personal branding.  The project includes scripts for installation and validation of these skills, suggesting an intention for automated deployment and quality assurance.

## Tech Stack (from code)
- **Bash:** The `install.sh` script demonstrates the use of Bash scripting for installation purposes. (File: `modules/dropshipping/README.md`)
- **PowerShell:**  The `validate-skills.ps1` file indicates usage of PowerShell, likely for skill validation and quality checks. (File: `validate-skills.ps1`)
- **Markdown (.md):** The vast majority of files are Markdown documents defining skills, workflows, and documentation. (Total files: 267)

## Public API / Exports
The project doesn't expose a traditional public API in the conventional sense. Instead, it defines "skills" which are intended to be invoked by an AI agent.  These skills are accessed via commands like `/skill` as described in `CLAUDE.md`. The skill chain examples within `CLAUDE.md` illustrate how these skills interact:

```
### Skill chain (chuoi skill)
- `22-personal-brand-context` → goi `23-personal-brand-strategy` + `24-ai-avatar-production` (Phase 1 typical)
```

## Dependencies
There is no apparent dependency file like `package.json`, `requirements.txt`, or `Cargo.toml`. The project relies on external tools like Claude Code and potentially other command-line utilities invoked by the scripts (`install.sh`, `validate-skills.sh`).  The `.claude-plugin/marketplace.json` suggests a dependency on the Claude Code plugin ecosystem.

## Architecture Patterns
- **Skill-Based Architecture:** The core architecture revolves around modular "skills," each encapsulating a specific marketing task or workflow. This promotes reusability and composability.
- **Workflow Orchestration:**  The project defines workflows (e.g., `client-onboard`, `campaign-launch`) that chain together multiple skills to achieve complex goals. The `CLAUDE.md` file explicitly outlines these chains.
- **Localization/Internationalization:** The presence of both Vietnamese (`vi`) and English (`en`) versions of many skills indicates a design for international applicability, with localized content and variants (e.g., `01-us.md`, `02-eu.md`).



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Agent Skill Integration:** The skill definitions and workflow patterns provide a blueprint for integrating specialized marketing skills into SEOSONA OS’s AI agent capabilities.  The `SKILL.md` format offers a standardized structure for defining new skills.
- **Workflow Automation:** The defined workflows (e.g., client onboarding, campaign launch) could be adapted to automate similar processes within SEOSONA OS, improving efficiency and consistency.
- **Content Localization:** The localization strategy employed in this project can inform how SEOSONA OS handles multilingual content and adapts its services to different regions.  The variant files (`01-us.md`, `02-eu.md`) provide a model for regional customization.
- **Skill Validation Framework:** The `validate-skills.sh` script demonstrates a basic framework for validating skill definitions, which could be incorporated into SEOSONA OS to ensure the quality and correctness of integrated skills.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 20, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
