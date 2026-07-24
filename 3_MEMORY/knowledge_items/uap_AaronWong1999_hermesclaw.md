# KI: AaronWong1999/hermesclaw

## Overview
This project, "HermesClaw," acts as a triple-gateway proxy router for WeChat messages. It takes over an iLink token and distributes messages to two independent proxy servers – one for OpenClaw's clawbot and another for Hermes Agent's WeChat gateway, while also supporting OpenCode. The script `fix_hermes_splitting.sh` indicates it addresses a specific issue with message splitting within the Hermes Agent.

## Tech Stack (from code)
- **Language:** Python 3 (`fix_hermes_splitting.sh` uses `python3`, `hermesclaw.py` is python code).
- **Dependencies:** The project utilizes the `requests` and `python-dotenv` libraries, as specified in `requirements.txt`.

## Public API / Exports
The `hermesclaw.py` file defines a Route enum:
```python
# File: hermesclaw.py
class Route(str, Enum):
    HERMES = "hermes"
    OPENCLAW = "openclaw"
    OPENCODE = "opencode"
    BOTH = "both"
    THREE = "three"
```

It also defines a State class:
```python
# File: hermesclaw.py
class State:
    """Per-user routing state, persisted to JSON."""
    def __init__(self, fp):
        ...
    def get(self, uid):
        ...
    def should_show_status(self):
        ...
```

## Dependencies
Based on `requirements.txt`:
- `requests>=2.28`
- `python-dotenv>=1.0`

## Architecture Patterns
- **Configuration via Environment Variables:** The `install.sh` script uses environment variables like `HERMESCLAW_REPO_URL`, `HERMESCLAW_DIR`, `HERMES_PROXY_PORT`, and `OPENCLAW_PROXY_PORT`. This suggests a configuration approach driven by environment variables.
- **Scripted Patching:** The `fix_hermes_splitting.sh` script demonstrates patching of the `weixin.py` file, indicating a strategy for modifying dependencies or core components.
- **State Management:**  The `State` class in `hermesclaw.py` manages per-user routing state and persists it to JSON files, suggesting a persistent data storage mechanism.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing a robust and configurable WeChat message routing solution. The triple-gateway proxy architecture allows for flexible integration with different services (like OpenClaw or Hermes Agent), which aligns with the potential need for modularity in SEOSONA OS.  The patching script demonstrates an ability to adapt to specific dependency issues, a valuable skill when dealing with external libraries. Finally, the state management system could be adapted for managing user preferences and configurations within the operating system.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
