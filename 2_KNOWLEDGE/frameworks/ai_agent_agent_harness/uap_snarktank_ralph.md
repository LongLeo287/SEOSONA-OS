# KI: snarktank/ralph

## Overview
The `ralph` repository implements an autonomous AI agent loop designed for software development tasks. It leverages either Amp or Claude Code to iteratively work through a prioritized list of user stories defined in a PRD (Product Requirements Document) file, tracking progress and learning along the way. The system includes a flowchart visualization to explain its operation.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  `package.json` contains dependencies for TypeScript compilation and bundling (`typescript`, `@types/react`, `vite`). File extensions `.tsx`, `.ts`, and `tsconfig.json` files confirm usage of TypeScript.
- **React:** The `flowchart/src/App.tsx` file indicates the use of React for building the interactive flowchart visualization.  The presence of `index.css` and `main.tsx` further supports this.
- **Vite:** `vite.config.ts` in the `flowchart/` directory shows that Vite is used as a build tool.
- **Bash:** The primary execution logic resides within `ralph.sh`, a bash script.

## Public API / Exports
Due to the nature of this project (a scripting environment and UI visualization), there are no explicit public APIs or exports in the traditional sense.  The "public" interface is:

- **`./ralph.sh`:** The main entry point, accepting command-line arguments for tool selection (`amp` or `claude`) and maximum iterations.
- **Flowchart UI:** The interactive React Flow diagram accessible via `flowchart/index.html`.  This isn't an API but provides a visual representation of the Ralph agent’s workflow.

## Dependencies
Based on `flowchart/package.json`:

- `"react": "^18.2.0"`
- `"react-dom": "^18.2.0"`
- `"vite": "^4.3.9"`
- `"typescript": "~5.1.3"`
- Other dependencies related to React Flow and linting (eslint, prettier).

## Architecture Patterns
- **Agent-Based Automation:** The core architecture revolves around an agent loop (`ralph.sh`) that repeatedly executes a task with fresh context.  This is evident in the `ralph.sh` script's looping structure and the instructions given to the AI agents (in `CLAUDE.md` and `prompt.md`).
- **Progress Tracking via Git History & Files:** Memory and learning are preserved through git history, a dedicated progress log file (`progress.txt`), and the PRD file (`prd.json`).  The agent updates these files to record its actions and learnings.
- **Modular Design (Flowchart):** The `flowchart/` directory encapsulates the interactive visualization as a separate module with its own build process and dependencies, promoting code organization.
- **Configuration via Command Line Arguments:** The behavior of the Ralph agent is configured through command line arguments passed to the `ralph.sh` script.



## Relevance to SEOSONA OS
The `ralph` project's architecture demonstrates a valuable approach for automating repetitive tasks within SEOSONA OS, particularly those involving code generation or modification.  Specifically:

- **Automated Code Review/Refactoring:** The agent loop could be adapted to automatically review and refactor existing codebase based on predefined rules or quality metrics.
- **PRD Driven Development:** The PRD file concept can be integrated into SEOSONA OS for managing development tasks and ensuring alignment with product requirements.  The progress tracking mechanism provides a clear audit trail of completed work.
- **Learning & Pattern Consolidation:** The `progress.txt` file's "Codebase Patterns" section offers a structured way to capture and share knowledge about the codebase, which could be integrated into SEOSONA OS’s internal documentation or training materials.  This promotes consistency and reduces onboarding time for new developers.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
