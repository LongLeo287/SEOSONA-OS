# KI: SawyerHood/gitclaw

## Overview
This project appears to be a collection of scripts and configurations related to downloading GitHub image attachments, particularly within CI environments like GitHub Actions. The `AGENTS.md` file describes an agent named "Crunch" whose purpose is to handle these downloads, differentiating between public and private repositories.  The presence of TypeScript (`main.ts`, `preinstall.ts`) suggests some level of automation or tooling built around the core scripts.

## Tech Stack (from code)
- **JavaScript/TypeScript:** The existence of `package.json`, `main.ts` and `preinstall.ts` files indicates JavaScript and TypeScript are used.  The `package.json` file confirms this.
```
### package.json
```json
{
  "dependencies": {
    "@mariozechner/pi-coding-agent": "^0.52.5"
  }
```

- **Bash:** The scripts within the `skill-creator/scripts` directory (`init_skill.py`, `package_skill.py`, `quick_validate.py`) are likely Bash scripts, given their `.py` extension and usage in the instructions for downloading attachments.
- **GitHub CLI (gh):**  The `AGENTS.md` file explicitly references and uses the `gh` command-line interface for interacting with GitHub repositories.

## Public API / Exports
Due to the limited code provided, it's impossible to determine a public API or exported functions. The `.py` files in `skill-creator/scripts` are likely internal scripts rather than exposed APIs.  The TypeScript files (`main.ts`, `preinstall.ts`) also lack sufficient context for identifying exports.

## Dependencies
Based on the `package.json` file:
- `@mariozechner/pi-coding-agent`: Version ^0.52.5

## Architecture Patterns
- **Agent-based architecture:** The `AGENTS.md` file describes a concept of "agents" (like Crunch) with specific roles and responsibilities, suggesting an agent-based approach to automating tasks. This is evident in the detailed instructions for the agent's behavior and capabilities.
- **Scripting/Automation:**  The project heavily relies on scripting (Bash and potentially TypeScript) to automate repetitive tasks like downloading image attachments from GitHub repositories.

## Relevance to SEOSONA OS
Without more context about SEOSONA OS, it is difficult to determine specific relevance. However, the automation aspects of this project could be beneficial for:

- **Automated asset management:** The ability to download images and other assets from private repositories could be integrated into a build or deployment pipeline within SEOSONA OS.
- **CI/CD integration:**  The GitHub Actions workflow permissions mentioned in `AGENTS.md` suggest the scripts are designed for CI/CD environments, which could be leveraged to automate tasks related to SEOSONA OS development and testing.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
