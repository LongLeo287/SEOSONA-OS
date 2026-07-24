# KI: conorbronsdon/avoid-ai-writing

## Overview
This repository contains a skill designed to detect and rewrite AI-generated text, specifically targeting patterns indicative of automated writing. The core functionality resides within a single `SKILL.md` file which is consumed by AI coding assistants like Claude.  The project includes tools for testing the detection logic and maintaining consistency across documentation.

## Tech Stack (from code)
- **JavaScript:** The primary language used, evidenced by files such as `package.json`, `detector/patterns.js`, and `detector/categories.test.js`.
- **Node.js:**  The project uses Node.js for testing and potentially other scripting tasks, confirmed by the `engines` section in `package.json`: `"engines": { "node": ">=18" }`.
- **Bash Scripting:** Scripts like `scripts/check-pattern-count.sh` and `scripts/sync-plugin-skill.sh` indicate the use of Bash for automation tasks.

## Public API / Exports
Based on the available code, it's difficult to definitively identify a public API in the traditional sense. The primary "export" is the content of `SKILL.md`, which appears to be structured data consumed by an external agent (Claude).  The `detector/patterns.js` file likely contains functions related to pattern matching, but its internal usage isn't directly exposed outside of testing via `package.json`.

## Dependencies
According to `package.json`:
- No explicit dependencies are listed beyond Node.js runtime environment. This suggests a lightweight project with minimal external libraries.

## Architecture Patterns
- **Single File Skill:** The core logic is encapsulated within a single markdown file (`SKILL.md`), which dictates the skill's behavior and rules.  This simplifies deployment and maintenance but also imposes constraints on complexity.
- **Configuration Driven:** The detection rules and severity levels are defined within `SKILL.md`, suggesting a configuration-driven architecture where the logic is data-defined rather than code-defined.
- **Test-Driven Development (TDD):**  The presence of test files (`categories.test.js`, `patterns.test.js`) in the `detector/` directory indicates a focus on testing and verifying the detection patterns.
- **Automated Consistency Checks:** The script `scripts/check-pattern-count.sh` enforces consistency between the number of detected patterns listed in the README file and those defined within the `SKILL.md` file, demonstrating an automated approach to maintaining documentation accuracy.



## Relevance to SEOSONA OS
The project's focus on detecting AI-generated content could be valuable for SEOSONA OS. Specifically:

*   **Content Authenticity Verification:** The detection patterns and severity classification system (P0, P1, P2) could be integrated into SEOSONA OS to assess the authenticity of ingested content.
*   **Automated Content Refinement:**  The "rewrite" mode within the skill could potentially be adapted for automated content refinement tasks within SEOSONA OS, improving the quality and originality of generated text.
*   **Rule-Based System Integration:** The configuration-driven architecture allows for easy customization and integration of new detection rules, making it adaptable to evolving AI writing techniques.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
