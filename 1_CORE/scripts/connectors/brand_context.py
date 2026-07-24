#!/usr/bin/env python3
"""
SEOSONA OS — Brand Context Connector
Reads brand_guidelines.md and injects brand context into reports and prompts.
Inspired by Marketing-Kit's inject-brand-context.cjs pattern.

Usage:
    python scripts/connectors/brand_context.py
    python scripts/connectors/brand_context.py --output dict
    python scripts/connectors/brand_context.py --output markdown
"""

import os
import re
import json
import argparse
from pathlib import Path

# ── Constants ────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent.parent.parent.parent
BRAND_FILE = SCRIPT_DIR / "3_MEMORY" / "specs" / "brand_guidelines.md"
TEMPLATE_FILE = SCRIPT_DIR / "3_MEMORY" / "specs" / "brand_guidelines_template.md"


def load_brand_guidelines() -> dict:
    """
    Load and parse brand guidelines from 3_MEMORY/specs/brand_guidelines.md.
    Falls back gracefully if file doesn't exist.
    Returns a structured dict with brand context.
    """
    brand = {
        "name": None,
        "tagline": None,
        "industry": None,
        "website": None,
        "primary_language": None,
        "colors": {},
        "fonts": {},
        "voice_adjectives": [],
        "tone_description": None,
        "primary_persona": {},
        "uvp": None,
        "differentiators": [],
        "content_pillars": [],
        "prohibited_phrases": [],
        "primary_keywords": [],
        "raw": None,
        "loaded": False,
        "file_path": str(BRAND_FILE),
    }

    # Check if brand guidelines exist
    if not BRAND_FILE.exists():
        print(f"⚠️  Brand guidelines not found at: {BRAND_FILE}")
        print(f"   Copy template from: {TEMPLATE_FILE}")
        print(f"   Then fill in your brand details.")
        return brand

    try:
        content = BRAND_FILE.read_text(encoding="utf-8")
        brand["raw"] = content
        brand["loaded"] = True

        # Extract brand name
        name_match = re.search(r"#\s+(.+?)\s+—\s+Brand Guidelines", content)
        if name_match:
            brand["name"] = name_match.group(1).strip()

        # Extract table values (| Field | Value | pattern)
        def extract_table_value(label: str) -> str | None:
            pattern = rf"\|\s*\*\*{re.escape(label)}\*\*\s*\|\s*(.+?)\s*\|"
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                return None if val.startswith("[") else val
            return None

        brand["tagline"] = extract_table_value("Tagline")
        brand["industry"] = extract_table_value("Industry")
        brand["website"] = extract_table_value("Website")
        brand["primary_language"] = extract_table_value("Primary language")

        # Extract UVP
        uvp_match = re.search(r"### Unique Value Proposition\s*\n\*\*(.+?)\*\*", content)
        if not uvp_match:
            uvp_match = re.search(r"Unique Value Proposition\s*\n+(.+?)(?:\n\n|\n#)", content, re.DOTALL)
        if uvp_match:
            uvp = uvp_match.group(1).strip().strip("*").strip()
            if not uvp.startswith("["):
                brand["uvp"] = uvp

        # Extract differentiators
        diff_section = re.search(r"### Key Differentiators\n(.*?)(?:\n###|\n##)", content, re.DOTALL)
        if diff_section:
            diffs = re.findall(r"\d+\.\s+(.+?)(?:\s+—|\n|$)", diff_section.group(1))
            brand["differentiators"] = [d.strip() for d in diffs if not d.startswith("[")]

        # Extract content pillars
        pillar_section = re.search(r"### Value Pillars.*?\n(.*?)(?:\n##)", content, re.DOTALL)
        if pillar_section:
            pillars = re.findall(r"\d+\.\s+\[([^\]]+)\]|^\d+\.\s+(.+)", pillar_section.group(1), re.MULTILINE)
            brand["content_pillars"] = [
                (p[0] or p[1]).strip()
                for p in pillars
                if not (p[0] or p[1]).strip().startswith("e.g.")
            ]

        # Extract prohibited phrases
        prohibited_section = re.search(r"### Prohibited Phrases\n(.*?)(?:\n##|\Z)", content, re.DOTALL)
        if prohibited_section:
            phrases = re.findall(r"-\s+\[?(.+?)\]?\s*(?:—.*)?\n", prohibited_section.group(1))
            brand["prohibited_phrases"] = [p.strip().strip('"') for p in phrases if p and not p.startswith("e.g.")]

        # Extract primary keywords
        kw_match = re.search(r"\*\*Primary keywords:\*\*\s*(.+)", content)
        if kw_match:
            kws = kw_match.group(1).strip()
            if not kws.startswith("["):
                brand["primary_keywords"] = [k.strip() for k in kws.split(",")]

        print(f"✅ Brand context loaded: {brand.get('name', 'Unknown')} ({brand.get('website', 'no website')})")

    except Exception as e:
        print(f"⚠️  Error reading brand guidelines: {e}")

    return brand


def format_as_markdown(brand: dict) -> str:
    """Format brand context as a markdown block for prompt injection."""
    if not brand["loaded"]:
        return """## Brand Context
No brand guidelines found. Using generic professional defaults.
- Voice: Professional, direct, data-backed
- Tone: Clear and helpful
- No prohibited phrases configured
"""

    lines = ["## Brand Context\n"]

    if brand["name"]:
        lines.append(f"**Brand:** {brand['name']}")
    if brand["tagline"]:
        lines.append(f"**Tagline:** {brand['tagline']}")
    if brand["industry"]:
        lines.append(f"**Industry:** {brand['industry']}")
    if brand["uvp"]:
        lines.append(f"\n**UVP:** {brand['uvp']}")
    if brand["differentiators"]:
        lines.append("\n**Differentiators:**")
        for d in brand["differentiators"]:
            lines.append(f"- {d}")
    if brand["content_pillars"]:
        lines.append("\n**Content Pillars:**")
        for p in brand["content_pillars"]:
            lines.append(f"- {p}")
    if brand["prohibited_phrases"]:
        lines.append("\n**Never use these phrases:**")
        for p in brand["prohibited_phrases"]:
            lines.append(f'- "{p}"')
    if brand["primary_keywords"]:
        lines.append(f"\n**Primary keywords:** {', '.join(brand['primary_keywords'])}")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="SEOSONA OS Brand Context Connector")
    parser.add_argument(
        "--output",
        choices=["dict", "markdown", "json"],
        default="markdown",
        help="Output format (default: markdown)",
    )
    args = parser.parse_args()

    brand = load_brand_guidelines()

    if args.output == "json":
        # Exclude raw content for clean JSON output
        output = {k: v for k, v in brand.items() if k != "raw"}
        print(json.dumps(output, indent=2, ensure_ascii=False))
    elif args.output == "dict":
        print(brand)
    else:
        print("\n" + format_as_markdown(brand))

    return brand


if __name__ == "__main__":
    main()
