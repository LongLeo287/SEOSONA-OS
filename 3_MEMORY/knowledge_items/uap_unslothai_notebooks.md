# KI: unslothai/notebooks

## Overview
Package: notebooks

## Tech Stack (from code)
- Python (582 files)
- **Total:** 1139 files, 8 directories
- **File types:** .py: 582, .ipynb: 544, .png: 2, .gitattributes: 1, .gitignore: 1, .python-version: 1, .toml: 1, .md: 1

## Public API / Exports
- `is_probably_binary` from `replace_text.py`
- `try_read_text` from `replace_text.py`
- `write_text` from `replace_text.py`
- `should_process` from `replace_text.py`
- `replace_in_file` from `replace_text.py`
- `walk_files` from `replace_text.py`
- `main` from `replace_text.py`
- `find_trainer_in_cell` from `update_max_seq_length.py`
- `update_max_seq_length_in_source` from `update_max_seq_length.py`
- `process_notebook` from `update_max_seq_length.py`

## Imports Detected in Source
- `argparse`
- `ast`
- `concurrent`
- `copy`
- `csv`
- `datetime`
- `glob`
- `hashlib`
- `json`
- `multiprocessing`
- `nbconvert`
- `nbformat`
- `os`
- `pathlib`
- `pickle`
- `platform`
- `re`
- `shlex`
- `shutil`
- `spellchecker`
- `stat`
- `subprocess`
- `sys`
- `typing`

## File Structure
```
  .gitattributes
  .gitignore
  .python-version
  Dockerfile_DGX_Spark
  LICENSE
  README.md
  Template_Notebook.ipynb
  pyproject.toml
  replace_text.py
  unsloth_windows.ps1
  update_all_notebooks.py
  update_max_seq_length.py
  uv.lock
  assets/
    hf course.png
    meta round logo.png
  kaggle/
    Gemma4_(31B)-Text.ipynb
    Gemma4_(E4B)-Text.ipynb
  molab/
    All_MiniLM_L6_v2.py
    BGE_M3.py
    CodeForces-cot-Finetune_for_Reasoning_on_CodeForces.py
    CodeGemma_(7B)-Conversational.py
    Deepseek_OCR_(3B)-Eval.py
    Deepseek_OCR_(3B)-Evaluation.py
    Deepseek_OCR_(3B).py
    Deepseek_OCR_2_(3B).py
    ERNIE_4_5_21B_A3B_PT-Conversational.py
    ERNIE_4_5_VL_28B_A3B_PT_Vision.py
    EmbeddingGemma_(300M).py
    Falcon_H1-Alpaca.py
    Falcon_H1_(0.5B)-Alpaca.py
    FunctionGemma_(270M)-LMStudio.py
    FunctionGemma_(270M)-Mobile-Actions.py
    FunctionGemma_(270M)-Multi-Turn-Tool-Calling.py
    FunctionGemma_(270M).py
    GLM_Flash_A100(80GB).py
    GPT_OSS_BNB_(20B)-Inference.py
    GPT_OSS_MXFP4_(20B)-Inference.py
    Gemma2_(2B)-Alpaca.py
    Gemma2_(9B)-Alpaca.py
    Gemma3N_(2B)-Inference.py
    Gemma3N_(4B)-Audio.py
    Gemma3N_(4B)-Conversational.py
    Gemma3N_(4B)-Vision.py
    Gemma3_(270M).py
    Gemma3_(270M)_Phone_Deployment.py
    Gemma3_(27B)_A100-Conversational.py
    Gemma3_(4B)-Vision.py
    Gemma3_(4B).py
    Gemma4_(12B)_Audio.py
    Gemma4_(12B)_Text.py
    Gemma4_(12B)_Vision.py
    Gemma4_(26B_A4B)-Text.py
    Gemma4_(26B_A4B)-Vision.py
    Gemma4_(31B)-Text.py
    Gemma4_(31B)-Vision.py
    Gemma4_(E2B)-Audio.py
    Gemma4_(E2B)-Text.py
    Gemma4_(E2B)-Vision.py
    Gemma4_(E2B)_Reinforcement_Learning_2048_Game.py
    Gemma4_(E2B)_Reinforcement_Learning_Sudoku_Game.py
    Gemma4_(E4B)-Audio.py
    Gemma4_(E4B)-Text.py
    Gemma4_(E4B)-Vision.py
    Granite4.0.py
    Granite4.0_350M.py
    LFM2.5_(1.2B)-Conversational.py
    LFM2.5_(1.2B)-Text_Completion.py
    LFM2.5_(1.2B)-Translation.py
    LFM2.5_VL_(1.6B)-Vision.py
    Liquid_
```

## Key Source Excerpts
### replace_text.py
```python
#!/usr/bin/env python3

import argparse
import os
import shutil
import sys
from pathlib import Path
from typing import Iterable, Optional, Tuple

DEFAULT_PATTERN = "weight_decay = 0.01"
DEFAULT_REPLACEMENT = "weight_decay = 0.001"
DEFAULT_EXTS = [".py", ".txt", ".md", ".cfg", ".ini", ".toml", ".yaml", ".yml", ".json", ".ipynb"]

def is_probably_binary(p: Path) -> bool:
    try:
        with p.open("rb") as f:
            chunk = f.read(2048)
        if b"\x00" in chunk:
            return True
    except Exception:
        return True
    return False

def try_read_text(p: Path, encodings=("utf-8", "utf-8-sig", "cp1252")) -> Tuple[Optional[str], Optional[str]]:
    for enc in encodings:
        try:
            # newline="" preserves existing CRLF/LF as-is
            with p.open("r", encoding=enc, newline="") as f:
                return f.read(), enc
        except Exception:
            continue
    return None, None

def write_text(p: Path, content: str, encoding: str) -> None:
    # newline="" avoids altering line endings
    with p.open("w", encoding=encoding, newline="") as f:
        f.write(content)

def should_process(p: Path, all_files: bool, exts: Iterable[str]) -> bool:
    if not p.is_file():
        return False
    if all_files:
        return True
    return p.suffix.lower() in exts

def replace_in_file(
    p: Path,
    pattern: str,
    replacement: str,
    dry_run: bool,
    backup_ext: str,
) -> Tuple[int, bool]:
    """
    Returns (num_replacements, ch
```

### update_all_notebooks.py
```python
# Unsloth Notebooks - Notebooks for Unsloth
# Copyright 2023-present Daniel Han-Chen, Michael Han-Chen & the Unsloth team. All rights reserved.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import argparse
import ast
import concurrent.futures
import concurrent.futures.process
import copy
import json
import multiprocessing
import os
import pickle
import platform
import re
import shlex
import shutil
import stat
import subprocess
import sys
import csv
import hashlib
from datetime import datetime, timezone
from glob import glob
from nbconvert import PythonExporter
import nbformat
from spellchecker import SpellChecker

try:
    from huggingface_hub import HfApi
    from huggingface_hub.errors import RepositoryNotFoundError
except Exception:
    HfApi = None
    RepositoryNotFoundError = Exception

try:
    from tqdm.auto import tqdm as _tqdm
except Exception:
    _tqdm = None

ne
```

### update_max_seq_length.py
```python
#!/usr/bin/env python3
"""
Script to update max_seq_length to max_length in notebook cells that contain Trainer classes.
Only updates cells that contain SFTTrainer, GRPOTrainer, DPOTrainer, ORPOTrainer, or other Trainer classes
AND also contain dataset_kwargs = {"skip_prepare_dataset": True}.
"""

import json
import os
import re
import glob
from pathlib import Path


def find_trainer_in_cell(cell_source):
    """
    Check if a cell contains any Trainer class instantiation AND 
    dataset_kwargs = {"skip_prepare_dataset": True}.
    Returns True if both conditions are met.
    """
    if isinstance(cell_source, list):
        source_text = ''.join(cell_source)
    else:
        source_text = str(cell_source)
    
    # Look for trainer patterns
    trainer_patterns = [
        r'SFTTrainer\s*\(',
        r'GRPOTrainer\s*\(',
        r'DPOTrainer\s*\(',
        r'ORPOTrainer\s*\(',
        r'trainer\s*=\s*\w*Trainer\s*\(',
        # Also check for trainer configuration patterns
        r'trainer\s*=.*Trainer\s*\(',
    ]
    
    has_trainer = False
    for pattern in trainer_patterns:
        if re.search(pattern, source_text, re.IGNORECASE):
            has_trainer = True
            break
    
    if not has_trainer:
        return False
    
    # Check for dataset_kwargs = {"skip_prepare_dataset": True}
    dataset_kwargs_patterns = [
        r'dataset_kwargs\s*=\s*\{\s*["\']skip_prepare_dataset["\']\s*:\s*True\s*\}',
        r'dataset_kwargs\s*=\s*\{\s*["\']+skip_prepar
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
