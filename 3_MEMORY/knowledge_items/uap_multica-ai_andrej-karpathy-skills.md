# KI: multica-ai/andrej-karpathy-skills

## Overview
This repository appears to be a collection of guidelines and resources related to software development practices, specifically inspired by Andrej Karpathy’s principles. The content is structured for use with tools like Cursor and Claude Code, aiming to promote disciplined coding habits and reduce common LLM coding mistakes.  The project provides instructions on how to integrate these guidelines into different workflows.

## Tech Stack (from code)
- **Markdown:** Used extensively for documentation (`.md` files). This is evident from the numerous `.md` files present in the repository, such as `CLAUDE.md`, `CURSOR.md`, and `EXAMPLES.md`.
- **JSON:**  Used for configuration of Cursor plugins and skills (`.json` files). For example, `plugin.json` within the `.claude-plugin/` directory defines plugin metadata.
- **Markdown Code Components (MDC):** Used by Cursor to define rules (`.mdc` file: `.cursor/rules/karpathy-guidelines.mdc`).

## Public API / Exports
This repository doesn't appear to contain executable code with a traditional public API or exports. Instead, it primarily provides documentation and configuration files intended for use within other tools (Cursor, Claude Code). The "exports" are the content of the Markdown documents themselves, which serve as instructions and guidelines.

## Dependencies
There are no dependency files like `package.json`, `requirements.txt` or `Cargo.toml` present in the repository. Therefore, it's impossible to determine dependencies from code alone.

## Architecture Patterns
- **Rule-Based System:** The project leverages a rule-based system through Cursor and Claude Code plugins.  The `.cursor/rules/karpathy-guidelines.mdc` file defines rules that are automatically applied within the Cursor environment. This is described in `CURSOR.md`: "The rule [`.cursor/rules/karpathy-guidelines.mdc`](.cursor/rules/karpathy-guidelines.mdc) is committed with `alwaysApply: true`, so you do not need extra installation steps."
- **Modular Content:** The guidelines are structured into distinct sections (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution), promoting a modular and organized approach to software development principles. This can be seen in `CLAUDE.md`.



## Relevance to SEOSONA OS
The project's focus on disciplined coding practices and reducing common LLM mistakes could benefit SEOSONA OS by:

*   **Improving Code Quality:** The guidelines promote simplicity, surgical changes, and goal-driven execution, which can lead to more maintainable and reliable code within SEOSONA OS.
*   **Reducing Development Time:** By encouraging clear assumptions and upfront planning (as described in `CLAUDE.md`), the project could help reduce rework and accelerate development cycles.
*   **Integrating with AI Tools:** The repository's integration with tools like Cursor and Claude Code suggests a potential for incorporating these guidelines into SEOSONA OS’s own AI-assisted development workflows.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
