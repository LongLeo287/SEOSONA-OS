# KI: OminousIndustries/PhoneDriver

## Overview
Repository with 8 files across 2 directories. Primary language: Python (4 files).

## Tech Stack (from code)
- Python (4 files)
- **Total:** 8 files, 2 directories
- **File types:** .py: 4, .json: 1, .md: 1, .png: 1

## Public API / Exports
- `PhoneAgent` from `phone_agent.py`
- `QwenVLAgent` from `qwen_vl_agent.py`
- `process_vision_info` from `qwen_vl_utils.py`
- `UILogHandler` from `ui.py`
- `load_config` from `ui.py`
- `get_default_config` from `ui.py`
- `save_config` from `ui.py`
- `setup_logging` from `ui.py`
- `detect_device_resolution` from `ui.py`

## Imports Detected in Source
- `PIL`
- `datetime`
- `gradio`
- `json`
- `logging`
- `os`
- `pathlib`
- `phone_agent`
- `qwen_vl_agent`
- `qwen_vl_utils`
- `re`
- `subprocess`
- `threading`
- `time`
- `torch`
- `transformers`
- `typing`
- `warnings`

## File Structure
```
  LICENSE
  README.md
  config.json
  phone_agent.py
  qwen_vl_agent.py
  qwen_vl_utils.py
  ui.py
  Images/
    PhoneDriver.png
```

## Key Source Excerpts
### phone_agent.py
```python
import os
import json
import time
import logging
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

from qwen_vl_agent import QwenVLAgent


class PhoneAgent:
    """
    Phone automation agent using Qwen3-VL for visual understanding and ADB for control.
    
    This agent:
    - Captures screenshots from Android devices via ADB
    - Uses Qwen3-VL to analyze screens and determine actions
    - Executes actions through ADB commands
    - Tracks context and action history
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the phone agent.
        
        Args:
            config: Configuration dictionary
        """
        # Default configuration
        default_config = {
            'device_id': None,  # Auto-detect first device if None
            'screen_width': 1080,  # Must match your device
            'screen_height': 2340,  # Must match your device
            'screenshot_dir': './screenshots',
            'max_retries': 3,
            'model_name': 'Qwen/Qwen3-VL-30B-A3B-Instruct',
            'use_flash_attention': False,
            'temperature': 0.1,
            'max_tokens': 512,
            'step_delay': 1.5,  # Seconds to wait after each action
            'enable_visual_debug': False,  # Save annotated screenshots
        }
        
        self.config = default_config
        if config:
            self.config.update(config)
        
    
```

### qwen_vl_agent.py
```python
# qwen_vl_agent.py
import json
import logging
import re
from typing import Any, Dict, List, Optional

import torch
from PIL import Image
from transformers import Qwen3VLForConditionalGeneration, AutoProcessor  # NOT MoeFor
#from transformers import Qwen3VLMoeForConditionalGeneration, AutoProcessor - This is only for the MoE Variants!!!
from qwen_vl_utils import process_vision_info
import warnings

# To supress these warnings you can uncomment the following two lines
# warnings.filterwarnings('ignore', message='.*Flash Efficient attention.*')
# warnings.filterwarnings('ignore', message='.*Mem Efficient attention.*')


class QwenVLAgent:
    """
    Vision-Language agent using Qwen3-VL-30B-A3B-Instruct for mobile GUI automation.
    Uses the official mobile_use function calling format.
    """

    def __init__(
        self,
        model_name: str = "Qwen/Qwen3-VL-8B-Instruct",
        device_map: str = "auto",
        dtype: Optional[torch.dtype] = None,
        use_flash_attention: bool = False,
        temperature: float = 0.1,
        max_tokens: int = 512,
    ) -> None:
        """Initialize the Qwen3-VL agent."""
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens

        logging.info(f"Loading Qwen3-VL model: {model_name}")

        if dtype is None:
            dtype = torch.bfloat16

        # Build model kwargs once; load once
        model_kwargs: Dict[str, Any] = dict(
            torch_dtype=dtype,
  
```

### qwen_vl_utils.py
```python
# qwen_vl_utils.py
from typing import Any, Dict, List, Tuple
from PIL import Image


def _as_image(x):
    """
    Accepts PIL.Image, local path, or http(s)/data URL.
    Returns a PIL.Image (RGB) or passes URLs through (processor can fetch).
    """
    if isinstance(x, Image.Image):
        return x.convert("RGB")
    if isinstance(x, str):
        if x.lower().startswith(("http://", "https://", "data:")):
            return x
        return Image.open(x).convert("RGB")
    # Let the processor handle anything else it supports
    return x


def process_vision_info(messages: List[Dict[str, Any]]) -> Tuple[List[Any], List[Any]]:
    """
    Minimal shim matching the signature that qwen_vl_agent expects.
    Collects image/video inputs from the chat-format messages.
    """
    images, videos = [], []
    for m in messages:
        for c in m.get("content", []):
            t = c.get("type")
            if t == "image":
                images.append(_as_image(c.get("image")))
            elif t == "video":
                videos.append(c.get("video"))
    return images, videos

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
