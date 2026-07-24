# KI: khanhbkqt/spawn-agent

## Overview
This project appears to be a tool for generating task templates, specifically designed for bug fixes, implementations, and research tasks. The primary script `scripts/spawn-agent.sh` utilizes markdown files within the `templates/` directory as blueprints for these tasks.  The project's purpose is to automate or streamline the creation of structured task descriptions.

## Tech Stack (from code)
- **Shell Scripting:** The core logic resides in a shell script (`scripts/spawn-agent.sh`). This is evident from the file extension and the use of shell commands within the script:
  ```
  templates/spawn-agent.sh
  # !/bin/bash
  # ... various bash commands like 'sed', 'cat', etc.
  ```

## Public API / Exports
The project doesn't appear to expose a traditional public API in the sense of functions or classes. The primary "export" is the `scripts/spawn-agent.sh` script, which can be executed directly. This script takes arguments and uses them to populate templates.  There are no explicit exports defined within any code files.

## Dependencies
The project does not contain a standard dependency management file like `package.json`, `requirements.txt`, or `Cargo.toml`. Therefore, it's impossible to determine external dependencies from the provided source code. The script relies on common Unix utilities (sed, cat, etc.) which are generally assumed to be available in most environments.

## Architecture Patterns
- **Template Engine:** The project utilizes a template engine pattern where markdown files (`templates/bugfix-task.md`, `templates/implementation-task.md`, `templates/research-task.md`) serve as templates, and the script dynamically populates them with data based on command-line arguments or other inputs.
  ```
  templates/spawn-agent.sh
  # ...
  sed -e "s/__TASK_TITLE__/${1}/g" "$template" > "${output}"
  sed -e "s/__TASK_DESCRIPTION__/${2}/g" "${output}" > "${output}"
  # ...
  ```
- **Scripting:** The entire logic is encapsulated within a shell script, demonstrating a scripting architecture.

## Relevance to SEOSONA OS
The template engine pattern used in this project could be beneficial for SEOSONA OS if the OS requires standardized task creation or documentation generation. Specifically:

*   **Task Automation:**  SEOSONA OS could integrate `spawn-agent.sh` (or a modified version) to automate the creation of tasks related to system maintenance, feature development, or bug reporting.
*   **Standardized Documentation:** The template files (`templates/*.md`) provide a starting point for creating standardized documentation formats within SEOSONA OS. These templates could be adapted to generate various types of documents consistently.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
