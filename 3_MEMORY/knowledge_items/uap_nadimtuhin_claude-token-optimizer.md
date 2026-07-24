# KI: nadimtuhin/claude-token-optimizer

## Overview
This repository provides a command-line tool (`cto`) designed to optimize token usage for Claude AI models, specifically Claude Code. It aims to reduce the number of tokens used by analyzing and compressing project documentation and code snippets, ultimately lowering costs associated with using Claude's services. The tool achieves this through various commands like `init`, `measure`, `compress`, and `audit`.

## Tech Stack (from code)
- **JavaScript/Node.js:**  The primary language is JavaScript, as evidenced by the `.js` file extensions in the `src/` directory and the `package.json` file which specifies `"type": "module"`.
- **Commander.js:** Used for command-line argument parsing (see `src/cli.js`: `import { Command } from 'commander';`).
- **Chalk:** Utilized for colored terminal output (see `src/commands/audit.js`: `import chalk from 'chalk';`).
- **Glob:**  Used for file searching and matching patterns (see `src/lib/scanner.js`: `import { glob } from 'glob';`).
- **@anthropic-ai/tokenizer:** This dependency is crucial as it provides the tokenization logic used to count tokens in code and text (see `src/lib/tokenizer.js`: `import { countTokens as _countTokens } from '@anthropic-ai/tokenizer';`).

## Public API / Exports
Based on the `src/cli.js` file, which acts as the entry point for the CLI application, the primary exported command is `cto`.  Subcommands accessible through this main command include:
- `init`: Initializes a project with optimized documentation structure.
- `measure`: Measures token usage and provides optimization suggestions.
- `audit`: Checks CLAUDE.md content and identifies potential issues.
- `compress`: Compresses the contents of CLAUDE.md to reduce token count.
- `watch`: Monitors files for changes and updates token counts in real time.
- `diff`:  Compares a file with its backup to show token differences.
- `update`: Updates project content based on latest versions

## Dependencies
From the `package.json` file:
- `@anthropic-ai/tokenizer`: "0.0.4" - Tokenization library for Claude models.
- `chalk`: "^5.3.0" - For terminal colors.
- `commander`: "^15.0.0" - Command-line argument parsing.
- `glob`: "^13.0.6" - File searching and matching.

## Architecture Patterns
- **Modular Design:** The project is structured into distinct modules (`src/cli.js`, `src/lib/*`, `src/commands/*`) with clear responsibilities, promoting maintainability.
- **Configuration-Driven:**  The `.claudeignore` file provides a configuration mechanism for excluding files from token counting and analysis. Framework-specific ignore patterns are dynamically generated in `src/lib/frameworks.js`.
- **Command-Line Interface (CLI):** The application is primarily accessed through a CLI, providing a user-friendly interface for interacting with the optimization tools.

## Relevance to SEOSONA OS
The code from this project could be integrated into SEOSONA OS in several ways:
- **Token Usage Monitoring:**  The token counting and analysis logic (`src/lib/tokenizer.js`, `src/commands/measure.js`) can be adapted to monitor token usage across various AI services used within the OS, providing insights for cost optimization.
- **Documentation Optimization:** The compression techniques employed in `src/commands/compress.js` could be applied to optimize documentation and training materials for SEOSONA OS components, reducing storage costs and improving performance.
- **Automated Code Review:**  The audit functionality (`src/commands/audit.js`) can be extended to automatically review code changes for potential token usage inefficiencies before deployment.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 20/100 · **Auto-apply:** False
- **Evidence:** `keyword`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
