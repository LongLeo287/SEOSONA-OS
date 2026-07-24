# KI: phuryn/pm-skills

## Overview
This repository, `phuryn/pm-skills`, contains a marketplace of nine independent plugins designed for AI coding assistants like Claude Code and Claude Cowork. These plugins provide structured product management workflows and are built around the concept of "skills" and "commands". The project's documentation emphasizes its role in bringing organized PM practices to AI agents.

## Tech Stack (from code)
- **Python:**  The `validate_plugins.py` file indicates the use of Python 3, as evidenced by the shebang line: `#!/usr/bin/env python3`.
```
# File: validate_plugins.py
#!/usr/bin/env python3
"""Plugin Collection Validator..."""
```

## Public API / Exports
Due to the nature of this project (a collection of plugins), there isn't a single, unified public API.  Each plugin exposes its own skills and commands through `.claude-plugin/plugin.json` manifests and associated Markdown files. The `marketplace.json` file at the root level acts as an index for these plugins.
```
# File: .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "pm-product-discovery",
      ...
    },
    ... (8 more plugins)
  ]
}
```

## Dependencies
The project does not contain a `package.json` or `requirements.txt`. The presence of the `validate_plugins.py` file suggests Python dependencies are managed through the environment where it is executed, but these are not explicitly listed in any manifest file within the repository.

## Architecture Patterns
- **Plugin-Based Architecture:**  The project utilizes a plugin architecture, with each plugin encapsulating specific product management skills and commands. This modularity allows for independent development and distribution of functionalities. The directory structure reflects this: `pm-{name}/` contains individual plugins.
```
# Directory Structure (from initial prompt)
└── pm-{name}/                       <- 9 plugin directories
    ├── .claude-plugin/plugin.json   <- per-plugin manifest
    ├── skills/{skill}/SKILL.md      <- one folder per skill
    ├── commands/{command}.md        <- one file per command
    └── README.md                    <- per-plugin documentation
```

- **Markdown-Driven Documentation:**  Skills and commands are primarily documented using Markdown files (`.md`). This suggests a focus on human-readable instructions and examples for AI agents.



## Relevance to SEOSONA OS
The plugin architecture and structured workflows within `phuryn/pm-skills` could be beneficial to SEOSONA OS in several ways:

*   **Modular Skill Integration:** The plugin design allows for easy integration of specific product management skills into SEOSONA OS, enabling a phased rollout of new features.
*   **AI Agent Workflow Enhancement:**  The project's focus on AI agent interaction provides valuable insights into designing workflows that leverage AI capabilities within SEOSONA OS. The `CLAUDE.md` file offers guidance on how to structure skills and commands for optimal AI performance, which could be adapted for other agents used by SEOSONA OS.
*   **Structured Knowledge Base:**  The consistent use of Markdown files for documentation creates a structured knowledge base that can be leveraged to train AI models or provide context-aware assistance within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
