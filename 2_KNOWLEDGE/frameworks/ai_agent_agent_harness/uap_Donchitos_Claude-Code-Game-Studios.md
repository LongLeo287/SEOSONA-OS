# KI: Donchitos/Claude-Code-Game-Studios

## Overview
This project appears to be a framework or architecture for managing game development using a system of coordinated "agents." The agents specialize in different domains within game development, aiming for separation of concerns and quality control.  The core philosophy emphasizes user-driven collaboration rather than autonomous agent execution.

## Tech Stack (from code)
- **Engine**: The `CLAUDE.md` file indicates the engine is a choice between Godot 4, Unity, or Unreal Engine 5.  (File: `.claude/CLAUDE.md`)
```markdown
- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5]
```
- **Language**: Similarly, the language is a choice between GDScript, C#, C++, or Blueprint. (File: `.claude/CLAUDE.md`)
```markdown
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint]
```
- **Version Control**: Git with trunk-based development is explicitly mentioned. (File: `.claude/CLAUDE.md`)
```markdown
- **Version Control**: Git with trunk-based development
```
The project does not contain a `package.json`, `requirements.txt` or similar dependency manifest file, so dependencies cannot be listed.

## Public API / Exports
There are no readily identifiable public APIs or exported functions/classes within the provided source code listing. The files primarily consist of documentation and configuration related to the agent architecture rather than executable code with defined interfaces.

## Dependencies
Due to the absence of dependency management files (e.g., `package.json`, `requirements.txt`), a definitive list of dependencies cannot be extracted from the available code.

## Architecture Patterns
- **Agent-Based Architecture:** The project's core design revolves around an agent-based architecture, with specialized agents responsible for distinct game development tasks. This is evident in the directory structure and documentation files (e.g., `agents/ai-programmer.md`, `.claude/docs/agent-roster.md`).
- **Trunk-Based Development:** The use of Git with trunk-based development suggests a continuous integration and delivery approach. (File: `.claude/CLAUDE.md`)
- **Layered Architecture (Implicit):** While not explicitly defined in code, the separation of agents into categories (e.g., "specialist," "director") implies a layered or hierarchical structure within the development process.



## Relevance to SEOSONA OS
The agent-based architecture and emphasis on structured collaboration could be beneficial for SEOSONA OS. The framework's focus on modularity, specialization, and controlled workflows aligns with principles of robust system design.  Specifically:

*   **Task Decomposition:** The agent concept provides a model for breaking down complex tasks into smaller, manageable units suitable for parallel execution or distribution across different components within SEOSONA OS.
*   **Workflow Management:** The defined collaboration protocol (Question -> Options -> Decision -> Draft -> Approval) could be adapted to manage workflows in SEOSONA OS, ensuring quality and consistency.
*   **Modularity & Extensibility:**  The agent-based design promotes modularity, allowing for easy addition or modification of components without disrupting the core system.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
