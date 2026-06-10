#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Creative Brief Generator - Aggregates search results and applies reasoning
to generate comprehensive creative direction recommendations.

Usage:
    from creative_brief import generate_creative_brief
    result = generate_creative_brief("SaaS product launch gen z", "My Campaign")
"""

import csv
import json
from pathlib import Path
from core import search, DATA_DIR


# ============ CONFIGURATION ============
REASONING_FILE = "creative-reasoning.csv"

SEARCH_CONFIG = {
    "reasoning": {"max_results": 1},
    "style": {"max_results": 3},
    "platform": {"max_results": 2},
    "voiceover": {"max_results": 2},
    "music": {"max_results": 2}
}


# ============ CREATIVE BRIEF GENERATOR ============
class CreativeBriefGenerator:
    """Generates creative direction recommendations from aggregated searches."""

    def __init__(self):
        self.reasoning_data = self._load_reasoning()

    def _load_reasoning(self) -> list:
        """Load reasoning rules from CSV."""
        filepath = DATA_DIR / REASONING_FILE
        if not filepath.exists():
            return []
        with open(filepath, 'r', encoding='utf-8') as f:
            return list(csv.DictReader(f))

    def _multi_domain_search(self, query: str, style_priority: list = None) -> dict:
        """Execute searches across multiple domains."""
        results = {}
        for domain, config in SEARCH_CONFIG.items():
            if domain == "style" and style_priority:
                # For style, also search with priority keywords
                priority_query = " ".join(style_priority[:2]) if style_priority else query
                combined_query = f"{query} {priority_query}"
                results[domain] = search(combined_query, domain, config["max_results"])
            else:
                results[domain] = search(query, domain, config["max_results"])
        return results

    def _find_reasoning_rule(self, category: str) -> dict:
        """Find matching reasoning rule for a category."""
        category_lower = category.lower()

        # Try exact match first
        for rule in self.reasoning_data:
            if rule.get("Category", "").lower() == category_lower:
                return rule

        # Try partial match
        for rule in self.reasoning_data:
            cat = rule.get("Category", "").lower()
            if cat in category_lower or category_lower in cat:
                return rule

        # Try keyword match
        for rule in self.reasoning_data:
            cat = rule.get("Category", "").lower()
            keywords = cat.replace("/", " ").replace("-", " ").split()
            if any(kw in category_lower for kw in keywords):
                return rule

        return {}

    def _apply_reasoning(self, category: str, search_results: dict) -> dict:
        """Apply reasoning rules to search results."""
        rule = self._find_reasoning_rule(category)

        if not rule:
            return {
                "style_priority": ["Minimalist Clean", "Gradient Smooth"],
                "color_mood": "Professional",
                "music_mood": "Ambient electronic",
                "vo_style": "Conversational Friendly",
                "key_effects": "Clean transitions",
                "platform_priority": "Instagram, YouTube",
                "anti_patterns": "",
                "decision_rules": {},
                "severity": "MEDIUM"
            }

        # Parse decision rules JSON
        decision_rules = {}
        try:
            decision_rules = json.loads(rule.get("Decision_Rules", "{}"))
        except json.JSONDecodeError:
            pass

        return {
            "style_priority": [s.strip() for s in rule.get("Style_Priority", "").split("+")],
            "color_mood": rule.get("Color_Mood", ""),
            "music_mood": rule.get("Music_Mood", ""),
            "vo_style": rule.get("VO_Style", ""),
            "key_effects": rule.get("Key_Effects", ""),
            "platform_priority": rule.get("Platform_Priority", ""),
            "audience_age": rule.get("Audience_Age", ""),
            "anti_patterns": rule.get("Anti_Patterns", ""),
            "decision_rules": decision_rules,
            "severity": rule.get("Severity", "MEDIUM")
        }

    def _select_best_match(self, results: list, priority_keywords: list) -> dict:
        """Select best matching result based on priority keywords."""
        if not results:
            return {}

        if not priority_keywords:
            return results[0]

        # First: try exact style name match
        for priority in priority_keywords:
            priority_lower = priority.lower().strip()
            for result in results:
                style_name = result.get("Style", "").lower()
                if priority_lower in style_name or style_name in priority_lower:
                    return result

        # Second: score by keyword match in all fields
        scored = []
        for result in results:
            result_str = str(result).lower()
            score = 0
            for kw in priority_keywords:
                kw_lower = kw.lower().strip()
                # Higher score for style name match
                if kw_lower in result.get("Style", "").lower():
                    score += 10
                # Lower score for keyword field match
                elif kw_lower in result.get("Keywords", "").lower():
                    score += 3
                # Even lower for other field matches
                elif kw_lower in result_str:
                    score += 1
            scored.append((score, result))

        scored.sort(key=lambda x: x[0], reverse=True)
        return scored[0][1] if scored and scored[0][0] > 0 else results[0]

    def _extract_results(self, search_result: dict) -> list:
        """Extract results list from search result dict."""
        return search_result.get("results", [])

    def generate(self, query: str, campaign_name: str = None) -> dict:
        """Generate complete creative brief recommendation."""
        # Step 1: First search reasoning to get category
        reasoning_result = search(query, "reasoning", 1)
        reasoning_results = reasoning_result.get("results", [])
        category = "General Campaign"
        if reasoning_results:
            category = reasoning_results[0].get("Category", "General Campaign")

        # Step 2: Get reasoning rules for this category
        reasoning = self._apply_reasoning(category, {})
        style_priority = reasoning.get("style_priority", [])

        # Step 3: Multi-domain search with style priority hints
        search_results = self._multi_domain_search(query, style_priority)
        search_results["reasoning"] = reasoning_result  # Reuse reasoning search

        # Step 4: Select best matches from each domain using priority
        style_results = self._extract_results(search_results.get("style", {}))
        platform_results = self._extract_results(search_results.get("platform", {}))
        voiceover_results = self._extract_results(search_results.get("voiceover", {}))
        music_results = self._extract_results(search_results.get("music", {}))

        best_style = self._select_best_match(style_results, reasoning.get("style_priority", []))
        best_platform = platform_results[0] if platform_results else {}
        best_voiceover = voiceover_results[0] if voiceover_results else {}
        best_music = music_results[0] if music_results else {}

        # Step 5: Build final recommendation
        return {
            "campaign_name": campaign_name or query.upper(),
            "category": category,
            "style": {
                "name": best_style.get("Style", "Minimalist Clean"),
                "keywords": best_style.get("Keywords", ""),
                "color_palette": best_style.get("Color_Palette", ""),
                "signature_effects": best_style.get("Signature_Effects", ""),
                "ideas": best_style.get("Ideas", ""),
                "best_for": best_style.get("Best_For", ""),
                "avoid_for": best_style.get("Avoid_For", "")
            },
            "platform": {
                "name": best_platform.get("Platform", "Instagram"),
                "ratio": best_platform.get("Ratio", "9:16"),
                "length": f"{best_platform.get('Length_Short', '15s')} - {best_platform.get('Length_Long', '60s')}",
                "hook_time": best_platform.get("Hook_Time", "3s"),
                "style_notes": best_platform.get("Style_Notes", ""),
                "content_types": best_platform.get("Content_Types", ""),
                "avoid": best_platform.get("Avoid", "")
            },
            "voiceover": {
                "style": best_voiceover.get("Style", reasoning.get("vo_style", "Conversational Friendly")),
                "tone": best_voiceover.get("Tone", ""),
                "delivery": best_voiceover.get("Delivery", ""),
                "pacing": best_voiceover.get("Pacing", ""),
                "energy": best_voiceover.get("Energy", ""),
                "direction_keywords": best_voiceover.get("Direction_Keywords", "")
            },
            "music": {
                "genre": best_music.get("Genre", "Ambient Electronic"),
                "mood": best_music.get("Mood", reasoning.get("music_mood", "")),
                "bpm_range": best_music.get("BPM_Range", ""),
                "instruments": best_music.get("Instruments", ""),
                "licensing_notes": best_music.get("Licensing_Notes", "")
            },
            "key_effects": reasoning.get("key_effects", best_style.get("Signature_Effects", "")),
            "anti_patterns": reasoning.get("anti_patterns", ""),
            "audience_age": reasoning.get("audience_age", ""),
            "decision_rules": reasoning.get("decision_rules", {}),
            "severity": reasoning.get("severity", "MEDIUM")
        }


# ============ OUTPUT FORMATTERS ============
BOX_WIDTH = 90

def format_ascii_box(brief: dict) -> str:
    """Format creative brief as ASCII box."""
    campaign = brief.get("campaign_name", "CAMPAIGN")
    category = brief.get("category", "")
    style = brief.get("style", {})
    platform = brief.get("platform", {})
    voiceover = brief.get("voiceover", {})
    music = brief.get("music", {})
    effects = brief.get("key_effects", "")
    anti_patterns = brief.get("anti_patterns", "")
    audience_age = brief.get("audience_age", "")

    def wrap_text(text: str, prefix: str, width: int) -> list:
        """Wrap long text into multiple lines."""
        if not text:
            return []
        words = text.split()
        lines = []
        current_line = prefix
        for word in words:
            if len(current_line) + len(word) + 1 <= width - 2:
                current_line += (" " if current_line != prefix else "") + word
            else:
                if current_line != prefix:
                    lines.append(current_line)
                current_line = prefix + word
        if current_line != prefix:
            lines.append(current_line)
        return lines

    # Build output lines
    lines = []
    w = BOX_WIDTH - 1

    lines.append("+" + "-" * w + "+")
    lines.append(f"|  CREATIVE BRIEF: {campaign}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|  Category: {category} | Audience: {audience_age}".ljust(BOX_WIDTH) + "|")
    lines.append("+" + "-" * w + "+")
    lines.append("|" + " " * BOX_WIDTH + "|")

    # Style section
    lines.append(f"|  VISUAL STYLE: {style.get('name', '')}".ljust(BOX_WIDTH) + "|")
    if style.get("keywords"):
        for line in wrap_text(f"Keywords: {style.get('keywords', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    if style.get("color_palette"):
        lines.append(f"|     Colors: {style.get('color_palette', '')}".ljust(BOX_WIDTH) + "|")
    if style.get("signature_effects"):
        for line in wrap_text(f"Effects: {style.get('signature_effects', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    if style.get("ideas"):
        for line in wrap_text(f"Ideas: {style.get('ideas', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    lines.append("|" + " " * BOX_WIDTH + "|")

    # Platform section
    lines.append(f"|  PLATFORM: {platform.get('name', '')}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|     Ratio: {platform.get('ratio', '')} | Length: {platform.get('length', '')} | Hook: {platform.get('hook_time', '')}".ljust(BOX_WIDTH) + "|")
    if platform.get("style_notes"):
        for line in wrap_text(f"Notes: {platform.get('style_notes', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    if platform.get("content_types"):
        for line in wrap_text(f"Content: {platform.get('content_types', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    lines.append("|" + " " * BOX_WIDTH + "|")

    # Voiceover section
    lines.append(f"|  VOICEOVER: {voiceover.get('style', '')}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|     Tone: {voiceover.get('tone', '')}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|     Delivery: {voiceover.get('delivery', '')}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|     Pacing: {voiceover.get('pacing', '')} | Energy: {voiceover.get('energy', '')}".ljust(BOX_WIDTH) + "|")
    if voiceover.get("direction_keywords"):
        for line in wrap_text(f"Direction: {voiceover.get('direction_keywords', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    lines.append("|" + " " * BOX_WIDTH + "|")

    # Music section
    lines.append(f"|  MUSIC: {music.get('genre', '')}".ljust(BOX_WIDTH) + "|")
    lines.append(f"|     Mood: {music.get('mood', '')} | BPM: {music.get('bpm_range', '')}".ljust(BOX_WIDTH) + "|")
    if music.get("instruments"):
        for line in wrap_text(f"Instruments: {music.get('instruments', '')}", "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
    if music.get("licensing_notes"):
        lines.append(f"|     Licensing: {music.get('licensing_notes', '')}".ljust(BOX_WIDTH) + "|")
    lines.append("|" + " " * BOX_WIDTH + "|")

    # Anti-patterns section
    if anti_patterns:
        lines.append("|  AVOID (Anti-patterns):".ljust(BOX_WIDTH) + "|")
        for line in wrap_text(anti_patterns, "|     ", BOX_WIDTH):
            lines.append(line.ljust(BOX_WIDTH) + "|")
        lines.append("|" + " " * BOX_WIDTH + "|")

    # Checklist section
    lines.append("|  PRE-PRODUCTION CHECKLIST:".ljust(BOX_WIDTH) + "|")
    checklist_items = [
        "[ ] Brand guidelines reviewed",
        "[ ] Audience persona confirmed",
        "[ ] Creative style approved",
        "[ ] Platform specs verified",
        "[ ] Success metrics defined",
        "[ ] Hook in first 3 seconds",
        "[ ] Sound-off optimized (captions)",
        "[ ] Mobile-first designed"
    ]
    for item in checklist_items:
        lines.append(f"|     {item}".ljust(BOX_WIDTH) + "|")
    lines.append("|" + " " * BOX_WIDTH + "|")

    lines.append("+" + "-" * w + "+")

    return "\n".join(lines)


def format_markdown(brief: dict) -> str:
    """Format creative brief as markdown."""
    campaign = brief.get("campaign_name", "CAMPAIGN")
    category = brief.get("category", "")
    style = brief.get("style", {})
    platform = brief.get("platform", {})
    voiceover = brief.get("voiceover", {})
    music = brief.get("music", {})
    effects = brief.get("key_effects", "")
    anti_patterns = brief.get("anti_patterns", "")
    audience_age = brief.get("audience_age", "")

    lines = []
    lines.append(f"## Creative Brief: {campaign}")
    lines.append(f"**Category:** {category} | **Audience:** {audience_age}")
    lines.append("")

    # Style section
    lines.append("### Visual Style")
    lines.append(f"- **Name:** {style.get('name', '')}")
    if style.get('keywords'):
        lines.append(f"- **Keywords:** {style.get('keywords', '')}")
    if style.get('color_palette'):
        lines.append(f"- **Colors:** {style.get('color_palette', '')}")
    if style.get('signature_effects'):
        lines.append(f"- **Effects:** {style.get('signature_effects', '')}")
    if style.get('ideas'):
        lines.append(f"- **Ideas:** {style.get('ideas', '')}")
    if style.get('best_for'):
        lines.append(f"- **Best For:** {style.get('best_for', '')}")
    if style.get('avoid_for'):
        lines.append(f"- **Avoid For:** {style.get('avoid_for', '')}")
    lines.append("")

    # Platform section
    lines.append("### Platform")
    lines.append(f"- **Platform:** {platform.get('name', '')}")
    lines.append(f"- **Ratio:** {platform.get('ratio', '')} | **Length:** {platform.get('length', '')} | **Hook:** {platform.get('hook_time', '')}")
    if platform.get('style_notes'):
        lines.append(f"- **Notes:** {platform.get('style_notes', '')}")
    if platform.get('content_types'):
        lines.append(f"- **Content Types:** {platform.get('content_types', '')}")
    if platform.get('avoid'):
        lines.append(f"- **Avoid:** {platform.get('avoid', '')}")
    lines.append("")

    # Voiceover section
    lines.append("### Voiceover")
    lines.append(f"- **Style:** {voiceover.get('style', '')}")
    lines.append(f"- **Tone:** {voiceover.get('tone', '')}")
    lines.append(f"- **Delivery:** {voiceover.get('delivery', '')}")
    lines.append(f"- **Pacing:** {voiceover.get('pacing', '')} | **Energy:** {voiceover.get('energy', '')}")
    if voiceover.get('direction_keywords'):
        lines.append(f"- **Direction:** {voiceover.get('direction_keywords', '')}")
    lines.append("")

    # Music section
    lines.append("### Music/Audio")
    lines.append(f"- **Genre:** {music.get('genre', '')}")
    lines.append(f"- **Mood:** {music.get('mood', '')} | **BPM:** {music.get('bpm_range', '')}")
    if music.get('instruments'):
        lines.append(f"- **Instruments:** {music.get('instruments', '')}")
    if music.get('licensing_notes'):
        lines.append(f"- **Licensing:** {music.get('licensing_notes', '')}")
    lines.append("")

    # Anti-patterns section
    if anti_patterns:
        lines.append("### Avoid (Anti-patterns)")
        lines.append(f"- {anti_patterns.replace(', ', '\n- ')}")
        lines.append("")

    # Checklist
    lines.append("### Pre-Production Checklist")
    lines.append("- [ ] Brand guidelines reviewed")
    lines.append("- [ ] Audience persona confirmed")
    lines.append("- [ ] Creative style approved")
    lines.append("- [ ] Platform specs verified")
    lines.append("- [ ] Success metrics defined")
    lines.append("- [ ] Hook in first 3 seconds")
    lines.append("- [ ] Sound-off optimized (captions)")
    lines.append("- [ ] Mobile-first designed")
    lines.append("")

    return "\n".join(lines)


# ============ MAIN ENTRY POINT ============
def generate_creative_brief(query: str, campaign_name: str = None, output_format: str = "ascii") -> str:
    """
    Main entry point for creative brief generation.

    Args:
        query: Search query (e.g., "SaaS product launch gen z")
        campaign_name: Optional campaign name for output header
        output_format: "ascii" (default) or "markdown"

    Returns:
        Formatted creative brief string
    """
    generator = CreativeBriefGenerator()
    brief = generator.generate(query, campaign_name)

    if output_format == "markdown":
        return format_markdown(brief)
    return format_ascii_box(brief)


# ============ CLI SUPPORT ============
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate Creative Brief")
    parser.add_argument("query", help="Search query (e.g., 'SaaS product launch')")
    parser.add_argument("--campaign-name", "-c", type=str, default=None, help="Campaign name")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format")

    args = parser.parse_args()

    result = generate_creative_brief(args.query, args.campaign_name, args.format)
    print(result)
