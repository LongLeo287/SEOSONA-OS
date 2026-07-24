# KI: QwenLM/Qwen-AgentWorld

## Overview
This project appears to be focused on evaluating and benchmarking agent-based systems, specifically within the context of different task domains (Android, MCP, OS, Search, SWE, Terminal, Web). The code includes evaluation scripts (`eval/eval.py`) and prompt templates (`prompts/*/*.txt`) designed for judging agent performance in these environments.  The presence of image assets suggests a visual component to the project, likely for reporting or demonstration purposes.

## Tech Stack (from code)
- **Python:** The primary language is Python, evidenced by files like `eval/eval.py` and numerous `.py` files within the `lwm_eval_utils` directory.
  ```text
  # File: eval/eval.py
  import argparse
  import json
  import os
  from typing import Dict, List

  ...
  ```
- **No explicit framework or build system is evident from the provided code.** There are no `requirements.txt`, `package.json`, or similar files present in the listed directory structure.

## Public API / Exports
Based solely on the visible file list and a cursory glance at `eval/eval.py`, it's difficult to determine a clear public API.  However, `eval/eval.py` appears to be an executable script with command-line arguments (as indicated by `argparse`).

```text
# File: eval/eval.py
import argparse
import json
import os
from typing import Dict, List

def main(args):
    """Main function for evaluation."""
    ... # Function body not shown but indicates a primary entry point

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    # ... argument definitions (not shown)
    args = parser.parse_args()
    main(args)
```

## Dependencies
No dependency files are present in the provided directory listing. Therefore, it's impossible to determine dependencies from standard configuration files.

## Architecture Patterns
- **Modular Design:** The project exhibits a modular design with separate directories for evaluation (`eval`) and prompts (`prompts`).  The `lwm_eval_utils` subdirectory within `eval` further suggests a breakdown of evaluation functionality into reusable components.
- **Prompt Engineering:** A significant portion of the code revolves around prompt templates, indicating a focus on prompt engineering as part of the agent evaluation process. The repeated structure of `judge_system_prompt.txt` and `system_prompt.txt` within each task domain (`prompts/android`, `prompts/mcp`, etc.) reinforces this.

## Relevance to SEOSONA OS
The code's focus on evaluating agents in various environments could be beneficial for SEOSONA OS, particularly if the OS aims to incorporate agent-based functionalities.  Specifically:

- **Evaluation Framework:** The evaluation scripts (`eval/eval.py`) and associated utilities provide a foundation for benchmarking and comparing different agent implementations within the SEOSONA OS environment.
- **Prompt Templates:** The prompt templates could be adapted or used as inspiration for designing effective prompts to guide agents performing tasks relevant to SEOSONA OS.  The task domains (Android, SWE) might have parallels with potential SEOSONA OS use cases.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `mcp`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
