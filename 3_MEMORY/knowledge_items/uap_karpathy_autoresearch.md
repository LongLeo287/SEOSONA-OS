# KI: karpathy/autoresearch

## Overview
Package: autoresearch

## Tech Stack (from code)
- Python (2 files)
- **Total:** 10 files, 1 directories
- **File types:** .py: 2, .md: 2, .gitignore: 1, .python-version: 1, .ipynb: 1, .png: 1, .toml: 1, .lock: 1

## Public API / Exports
- `download_single_shard` from `prepare.py`
- `GPTConfig` from `train.py`
- `norm` from `train.py`
- `has_ve` from `train.py`
- `apply_rotary_emb` from `train.py`
- `CausalSelfAttention` from `train.py`

## Imports Detected in Source
- `argparse`
- `dataclasses`
- `gc`
- `kernels`
- `math`
- `multiprocessing`
- `os`
- `pickle`
- `prepare`
- `pyarrow`
- `requests`
- `rustbpe`
- `sys`
- `tiktoken`
- `time`
- `torch`

## File Structure
```
  .gitignore
  .python-version
  README.md
  analysis.ipynb
  prepare.py
  program.md
  progress.png
  pyproject.toml
  train.py
  uv.lock
```

## Key Source Excerpts
### prepare.py
```python
"""
One-time data preparation for autoresearch experiments.
Downloads data shards and trains a BPE tokenizer.

Usage:
    python prepare.py                  # full prep (download + tokenizer)
    python prepare.py --num-shards 8   # download only 8 shards (for testing)

Data and tokenizer are stored in ~/.cache/autoresearch/.
"""

import os
import sys
import time
import math
import argparse
import pickle
from multiprocessing import Pool

import requests
import pyarrow.parquet as pq
import rustbpe
import tiktoken
import torch

# ---------------------------------------------------------------------------
# Constants (fixed, do not modify)
# ---------------------------------------------------------------------------

MAX_SEQ_LEN = 2048       # context length
TIME_BUDGET = 300        # training time budget in seconds (5 minutes)
EVAL_TOKENS = 40 * 524288  # number of tokens for val eval

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".cache", "autoresearch")
DATA_DIR = os.path.join(CACHE_DIR, "data")
TOKENIZER_DIR = os.path.join(CACHE_DIR, "tokenizer")
BASE_URL = "https://huggingface.co/datasets/karpathy/climbmix-400b-shuffle/resolve/main"
MAX_SHARD = 6542 # the last datashard is shard_06542.parquet
VAL_SHARD = MAX_SHARD  # pinned validation shard (shard_06542)
VAL_FILENAME = f"shard_{VAL_SHARD:05d}.parque
```

### train.py
```python
"""
Autoresearch pretraining script. Single-GPU, single-file.
Cherry-picked and simplified from nanochat.
Usage: uv run train.py
"""

import os
os.environ["PYTORCH_ALLOC_CONF"] = "expandable_segments:True"
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

import gc
import math
import time
from dataclasses import dataclass, asdict

import torch
import torch.nn as nn
import torch.nn.functional as F

from kernels import get_kernel
cap = torch.cuda.get_device_capability()
# varunneal's FA3 is Hopper only, use kernels-community on non-Hopper GPUs
repo = "varunneal/flash-attention-3" if cap == (9, 0) else "kernels-community/flash-attn3"
fa3 = get_kernel(repo).flash_attn_interface

from prepare import MAX_SEQ_LEN, TIME_BUDGET, Tokenizer, make_dataloader, evaluate_bpb

# ---------------------------------------------------------------------------
# GPT Model
# ---------------------------------------------------------------------------

@dataclass
class GPTConfig:
    sequence_len: int = 2048
    vocab_size: int = 32768
    n_layer: int = 12
    n_head: int = 6
    n_kv_head: int = 6
    n_embd: int = 768
    window_pattern: str = "SSSL"


def norm(x):
    return F.rms_norm(x, (x.size(-1),))


def has_ve(layer_idx, n_layer):
    """Returns True if layer should have Value Embedding (alternating, last always included)."""
    return layer_idx % 2 == (n_layer - 1) % 2


def apply_rotary_emb(x, cos, sin):
    assert x.ndim == 4
    d = x.shape[3] // 2
    x1, x2 = x[..., :d], x[..., d:]
  
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
