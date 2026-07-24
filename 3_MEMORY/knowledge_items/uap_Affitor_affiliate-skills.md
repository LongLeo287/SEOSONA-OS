# KI: Affitor/affiliate-skills

## Overview
This repository, "affiliate-skills," contains a collection of AI-powered skills designed for affiliate marketers and intended to be used by AI agents. The project appears to focus on providing structured skill definitions (primarily in Markdown) along with supporting documentation and tools for managing and distributing these skills.  The `CLAUDE.md` file describes the repository's structure, purpose, and key rules governing skill development.

## Tech Stack (from code)
- **JavaScript/TypeScript:** The presence of a `package.json` file indicates JavaScript usage, specifically with TypeScript as evidenced by the `.ts` extension in `tools/src/cli.ts`.  The build script uses "bun" which is a Javascript runtime and package manager.
```json
{
  "name": "affiliate-skills",
  "version": "1.0.0",
  "description": "AI-powered affiliate marketing skills for any AI agent",
  "scripts": {
    "build": "bun build --compile tools/src/cli.ts --outfile tools/dist/affiliate-check",
    "dev": "bun run tools/src/cli.ts",
    "test": "bun test tools/test/",
    "test:registry": "bun run tests/test-registry-invariants.ts",
    "test:docs": "bun run tests/test-doc-contracts.ts"
  },
  "license": "MIT",
  "devDependencies": {}
}
```
- **Bun:** The `package.json` file shows usage of Bun for building, running and testing the project.

## Public API / Exports
The code does not directly expose any public APIs or endpoints. The primary interface appears to be through the command-line tool "affiliate-check" described in `CLAUDE.md`, which interacts with an external API (openaffiliate.dev).  The CLI commands listed in `CLAUDE.md` suggest functionality like searching, retrieving information, and comparing affiliate programs.
```markdown
# Affiliate Skills by Affitor

...

## CLI tool: affiliate-check

Persistent Bun daemon querying the openaffiliate.dev API. Port 9500, 5min cache, 30min idle shutdown.

```bash
affiliate-check search "AI video"          # search programs
affiliate-check top                        # top by stars
affiliate-check info heygen                # detailed info
affiliate-check compare heygen synthesia   # side-by-side
affiliate-check status                     # server status
affiliate-check stop                       # stop daemon
```

## Dependencies
Based on the `package.json` file, there are no listed dev dependencies. This suggests a relatively lightweight project or that dependencies are managed differently (e.g., through Bun's module resolution).

## Architecture Patterns
- **Skill-based architecture:** The core of the project revolves around modular "skills," each defined in a `SKILL.md` file and potentially accompanied by reference documents. This promotes reusability and independent development of individual skills.
- **CLI Tooling:**  A command-line interface (`affiliate-check`) is central to interacting with the system, suggesting an emphasis on automation and programmatic access to affiliate data.
- **Data-Driven Design:** The `registry.json` file indicates a machine-readable index of all skills, implying that skill management and discovery are driven by structured data.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Skill Integration:**  The modular "skill" architecture aligns well with the concept of reusable components within a larger AI system like SEOSONA OS. The skills themselves (e.g., SEO audit, content repurposing) could be directly integrated to enhance SEOSONA's capabilities.
- **Data Source Management:** The project’s interaction with the openaffiliate.dev API demonstrates how to manage and utilize external data sources. This approach can inform how SEOSONA OS integrates with other APIs and services.
- **CLI Tooling Inspiration:**  The `affiliate-check` CLI provides a model for building command-line tools that interact with AI systems, potentially inspiring similar tooling within SEOSONA OS for tasks like skill management or data analysis.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
