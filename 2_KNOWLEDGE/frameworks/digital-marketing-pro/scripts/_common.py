#!/usr/bin/env python3
"""
_common.py
==========
Shared helpers for every Digital Marketing Pro Python script. Stdlib only.

Why this exists: the tracker/checkpoint/state scripts each carried private
copies of workspace resolution, slugification, JSON persistence, the
brand-not-found message, and stdout encoding guards - and the copies drifted.
Four different workspace resolvers and four different slugifiers produced
different directories for the same brand (the "split-brain" storage bug), and
39 scripts printed their result with a trailer that swallowed the error exit
code. This module is now the single source of truth. Scripts hard-require it:
`import _common` works because sys.path[0] is scripts/ when a script is invoked
as `python scripts/x.py`; each script also inserts its own directory into
sys.path defensively.

Path policy (DMP canon):
  * workspace_root() - $CLAUDE_MARKETING_HOME if set (used by tests); else
    $CLAUDE_PLUGIN_DATA/digital-marketing-pro if $CLAUDE_PLUGIN_DATA is set AND
    that directory exists; else ~/.claude-marketing.
  * brands_root()    - workspace_root()/brands   (the `brands/` segment is
    canonical for DMP).
  * brand_dir(brand) - backward compatible: if a legacy directory named with
    the RAW brand string already exists under brands_root(), keep using it;
    otherwise use the canonical slug directory (slugify_brand()).
  * get_brand_dir(slug) - (dir, error) tuple with the standard not-found
    message, mirroring the ~24 private copies it replaces.
"""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# ── Constants ───────────────────────────────────────────────────────

BRAND_NOT_FOUND = (
    "Brand '{slug}' not found. Run /digital-marketing-pro:brand-setup first."
)

# Canonical AI-visibility surfaces (single source of truth for the SEO/AEO/GEO
# cluster). geo-tracker.py, aeo-audit, geo-monitor, share-of-voice and
# serp-tracker all reference this list so they never drift out of sync.
AI_VISIBILITY_SURFACES = [
    "Google AI Mode",
    "Google AI Overviews",
    "ChatGPT",
    "Perplexity",
    "Gemini",
    "Copilot",
]


# ── Encoding ────────────────────────────────────────────────────────

def ensure_utf8_stdout() -> None:
    """Force UTF-8 (errors=replace) on stdout/stderr.

    Windows consoles default to cp1252; printing JSON containing em dashes or
    non-Latin content would otherwise raise UnicodeEncodeError mid-pipeline.
    """
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass


# ── Time ────────────────────────────────────────────────────────────

def now_iso() -> str:
    """Current UTC timestamp in ISO 8601 with a 'Z' suffix."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ── Paths ───────────────────────────────────────────────────────────

def workspace_root() -> Path:
    """Root of Digital Marketing Pro persistent data.

    Resolution order:
      1. $CLAUDE_MARKETING_HOME (explicit override; used by tests)
      2. $CLAUDE_PLUGIN_DATA/digital-marketing-pro if $CLAUDE_PLUGIN_DATA is
         set (non-empty) AND that directory exists
      3. ~/.claude-marketing
    """
    override = os.environ.get("CLAUDE_MARKETING_HOME")
    if override:
        return Path(override).expanduser()
    plugin_data = os.environ.get("CLAUDE_PLUGIN_DATA")
    if plugin_data:  # empty string must NOT resolve to Path(".")
        base = Path(plugin_data).expanduser()
        if base.exists():
            return base / "digital-marketing-pro"
    return Path.home() / ".claude-marketing"


def brands_root() -> Path:
    """Directory holding all per-brand data: workspace_root()/brands."""
    return workspace_root() / "brands"


def slugify_brand(name: str) -> str:
    """Canonical brand slug: lowercase, non-alphanumeric runs → single hyphen,
    trimmed, max 60 chars. Empty input yields 'brand'. This is the ONE
    slugifier - all local variants (four of them across the tree) were killed."""
    s = re.sub(r"[^a-z0-9]+", "-", (name or "").lower())
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:60].rstrip("-") or "brand"


# Backwards-friendly alias: several scripts had a local `slugify()`.
slugify = slugify_brand


def brand_dir(brand: str) -> Path:
    """Per-brand data directory under brands_root().

    Backward compatibility: if a directory named with the raw brand string
    already exists (created by pre-v3.15 scripts), keep using it so existing
    tracking/checkpoint data stays reachable. Also honours an even older
    location without the `brands/` segment (used by checkpoint-manager /
    output-publisher / drive-sync-state before this release). Otherwise use
    the canonical slug directory.
    """
    root = brands_root()
    raw = (brand or "").strip()
    slug = slugify_brand(brand)
    if raw:
        # 1. Legacy raw-name directory under brands/
        try:
            legacy_raw = root / raw
            if legacy_raw.is_dir():
                return legacy_raw
        except (OSError, ValueError):
            pass
    # 2. Legacy no-`brands/` directory (old checkpoint/output/drive layout)
    try:
        legacy_flat = workspace_root() / slug
        if legacy_flat.is_dir():
            return legacy_flat
    except (OSError, ValueError):
        pass
    return root / slug


def get_brand_dir(slug: str):
    """Return (brand_dir, error). Mirrors the ~24 private copies: validates the
    brand directory exists, else returns the standard not-found message. The
    slug is normalised through slugify_brand() so callers that pass a raw brand
    name still resolve. Backward-compatible with legacy raw-name dirs."""
    d = brand_dir(slug)
    if not d.exists():
        return None, BRAND_NOT_FOUND.format(slug=slugify_brand(slug))
    return d, None


# ── JSON persistence ────────────────────────────────────────────────

def atomic_write_json(path, data) -> None:
    """Write JSON atomically: tmp file in the same directory + Path.replace."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False),
                   encoding="utf-8")
    tmp.replace(path)


# Alias used by scripts that called their local helper write_json_atomic().
write_json_atomic = atomic_write_json


def atomic_write_text(path, text: str) -> None:
    """Write text atomically (tmp file in the same directory + Path.replace).
    Used for Markdown artefacts like the Living Instruction File."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def load_json_safe(path):
    """Load JSON, never raise. On failure returns a dict with 'error' and
    'recovery' keys instead of the payload; callers check `"error" in result`
    (payloads produced by DMP never carry a top-level 'error' key)."""
    path = Path(path)
    if not path.exists():
        return {
            "error": f"file not found: {path}",
            "missing": True,
            "recovery": "Initialise it first (e.g. --action init) or check the brand name.",
        }
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        return {
            "error": f"corrupt or unreadable JSON at {path}: {type(exc).__name__}: {exc}",
            "corrupt": True,
            "recovery": (
                f"The file may have been truncated by an interrupted write. "
                f"Inspect {path} manually; a sibling '{path.name}.tmp' file (if present) "
                f"may hold the last attempted write. Re-run init to start fresh."
            ),
        }


# ── CLI result handling ─────────────────────────────────────────────

def finish(result) -> None:
    """Print the result JSON and exit: 1 when the result carries an error,
    0 otherwise. Every DMP CLI script funnels its final result through this so
    shell callers can trust $? (this fixes the 39 scripts whose trailer
    `json.dump(result, sys.stdout)` always exited 0, even on error)."""
    ensure_utf8_stdout()
    print(json.dumps(result, indent=2, ensure_ascii=False))
    is_error = isinstance(result, dict) and "error" in result
    sys.exit(1 if is_error else 0)
