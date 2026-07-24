# KI: OpenBMB/ChatDev

## Overview
Package: DevAll

## Tech Stack (from code)
- Python (187 files)
- Vue.js (18 files)
- JavaScript (12 files)
- **Total:** 607 files, 76 directories
- **File types:** .py: 187, .png: 186, .ttf: 56, .md: 53, .yaml: 47, .gif: 18, .vue: 18, .js: 12

## Public API / Exports
- `build_task_input_payload` from `run.py`
- `parse_arguments` from `run.py`
- `main` from `run.py`
- `build_reload_kwargs` from `server_main.py`
- `build_parser` from `server_main.py`

## Dependencies

### Dev Dependencies
- `kill-port`: ^2.0.1

### Python Dependencies (from requirements.txt)
- `pyyaml`
- `openai`
- `tenacity`
- `mcp`
- `fastmcp`
- `faiss-cpu`
- `fastapi==0.124.0`
- `click>=8.1.8,<8.3`
- `uvicorn`
- `watchfiles`
- `websockets`
- `wsproto`
- `pydantic==2.12.5`
- `requests`
- `pytest`
- `ddgs`
- `beautifulsoup4`
- `matplotlib`
- `networkx`
- `cartopy`

## Imports Detected in Source
- `argparse`
- `check`
- `entity`
- `json`
- `logging`
- `pathlib`
- `runtime`
- `server`
- `typing`
- `utils`
- `workflow`

## File Structure
```
  .dockerignore
  .env.docker
  .env.example
  .gitattributes
  .gitignore
  Dockerfile
  LICENSE
  Makefile
  README-zh.md
  README.md
  compose.yml
  package-lock.json
  package.json
  pyproject.toml
  requirements.txt
  run.py
  server_main.py
  uv.lock
  .agents/
    skills/
      greeting-demo/
        SKILL.md
      python-scratchpad/
        SKILL.md
        references/
          examples.md
      rest-api-caller/
        SKILL.md
        references/
          examples.md
  assets/
    CommandDash.png
    Human_intro.png
    agentverse.png
    appcopilot.png
    docker.png
    ebook.png
    ecl.png
    github.png
    ier.png
    increment.png
    intro.png
    launch.gif
    macnet.png
    modelbest.png
    puppeteer.png
    repoagent.png
    saas.png
    teachmaster.png
    thunlp.png
    tutorial-en.png
    workflow.gif
    cases/
      3d_generation/
        3d.gif
      data_analysis/
        data_analysis.gif
      deep_research/
        deep_research.gif
      game_development/
        game.gif
      video_generation/
        video.gif
  check/
    __init__.py
    check.py
    check_workflow.py
    check_yaml.py
  docs/
    user_guide/
      en/
        attachments.md
        config_schema_contract.md
        dynamic_execution.md
        execution_logic.md
        field_specs.md
        index.md
        web_ui_guide.md
        workflow_authoring.md
        ws_frontend_logic.md
        modules/
          memory.md
          thinking.md
          tooling/
            README.md
            function.md
            function_catalog.md
            mcp.md
        nodes/
          agent.md
          human.md
          literal.md
          loop_counter.md
          loop_timer.md
          passthrough.md
          python.md
          subgraph.md
      zh/
        attachments.md
        config_schema_contract.md
        dynamic_execution.md
        execution_logic.md
        field_specs.md
        index.md
        web_ui_guide.md
        workflow_authoring.md
    
```

## Key Source Excerpts
### run.py
```python
"""CLI entry point for executing ChatDev_new workflows."""
import argparse
import json
from pathlib import Path
from typing import List, Union

from runtime.bootstrap.schema import ensure_schema_registry_populated
from check.check import load_config
from entity.graph_config import GraphConfig
from entity.messages import Message
from utils.attachments import AttachmentStore
from utils.schema_exporter import build_schema_response, SchemaResolutionError
from utils.task_input import TaskInputBuilder
from workflow.graph_context import GraphContext
from workflow.graph import GraphExecutor

OUTPUT_ROOT = Path("WareHouse")


ensure_schema_registry_populated()

def build_task_input_payload(
    graph_context: GraphContext,
    prompt: str,
    attachment_paths: List[str]
) -> Union[str, List[Message]]:
    """Construct the initial task input, embedding attachments when available."""
    if not attachment_paths:
        return prompt

    code_workspace = graph_context.directory / "code_workspace"
    attachments_dir = code_workspace / "attachments"
    attachments_dir.mkdir(parents=True, exist_ok=True)
    store = AttachmentStore(attachments_dir)
    builder = TaskInputBuilder(store)
    return builder.build_from_file_paths(prompt, attachment_paths)

def parse_arguments():
    parser = argparse.ArgumentParser(description="Run ChatDev_new workflow")
    parser.add_argument(
        "--path",
        type=Path,
        default=Path("yaml_instance/net_loop_test_included.yaml"),
        h
```

### server_main.py
```python
import argparse
import logging
from pathlib import Path

from runtime.bootstrap.schema import ensure_schema_registry_populated
from server.app import app


ensure_schema_registry_populated()


# Directories containing the server's Python sources. When --reload is
# enabled, only these are watched so that agent-generated files under
# WareHouse/, logs/, etc. never trigger a StatReload restart mid-workflow
# (issue #569).
RELOAD_SOURCE_DIRS = [
    "check",
    "entity",
    "functions",
    "mcp_example",
    "runtime",
    "schema_registry",
    "server",
    "tools",
    "utils",
    "workflow",
]

# Directory names whose contents must never trigger a reload. These are
# expanded into multi-depth glob patterns below so nested files (e.g.
# ``WareHouse/demo/foo.py``) are also excluded: uvicorn applies these via
# ``Path.match``, which on Python < 3.13 does not understand ``**`` and
# matches a pattern of N components only against the last N path parts.
_RELOAD_EXCLUDE_DIRS = ("WareHouse", "logs", "data", "temp", "node_modules")
_RELOAD_EXCLUDE_MAX_DEPTH = 10

# Glob patterns excluded from reload watching. Only honoured when
# ``watchfiles`` is installed; StatReload (the pure-Python fallback that
# ships with uvicorn core) ignores exclude patterns entirely, so the
# primary defence is the reload_dirs restriction to RELOAD_SOURCE_DIRS.
RELOAD_EXCLUDES = [
    f"{d}{'/*' * (depth + 1)}"
    for d in _RELOAD_EXCLUDE_DIRS
    for depth in range(_RELOAD_EXCLUDE_MAX_DEPTH)
]


def _
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
