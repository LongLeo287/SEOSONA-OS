# KI: piercelamb/deep-project

## Overview
Package: deep-project

## Tech Stack (from code)
- Python (10 files)
- **Total:** 28 files, 11 directories
- **File types:** .py: 10, .md: 7, .json: 3, .gitkeep: 3, .gitignore: 1, .toml: 1, .lock: 1, .jpeg: 1

## File Structure
```
  .gitignore
  CHANGELOG.md
  LICENSE
  README.md
  pyproject.toml
  uv.lock
  .claude-plugin/
    marketplace.json
    plugin.json
  assets/
    hero.jpeg
  hooks/
    hooks.json
  scripts/
    checks/
      .gitkeep
      create-split-dirs.py
      setup-session.py
    hooks/
      capture-session-id.py
    lib/
      .gitkeep
      __init__.py
      config.py
      manifest.py
      state.py
      task_reconciliation.py
      task_storage.py
      tasks.py
  skills/
    deep-project/
      SKILL.md
      references/
        .gitkeep
        interview-protocol.md
        project-manifest.md
        spec-generation.md
        split-heuristics.md
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
