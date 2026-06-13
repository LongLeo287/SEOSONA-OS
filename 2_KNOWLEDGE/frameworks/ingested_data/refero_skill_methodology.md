# Refero Skill Methodology

**Source:** https://github.com/referodesign/refero_skill
**Date Ingested:** 2026-06-12

## 1. Core Philosophy
The `refero_skill` introduces a strictly enforced "Research-first methodology" for AI Agents. It completely bans generic AI UI generation.
- **No design from vibe memory:** Every major visual, layout, content, or interaction decision must trace to a concrete reference or a craft rule.
- **Anti-Averaging Quality Gates:** Do not average multiple references into a "safe, generic middle". When references conflict, choose one dominant direction and preserve its sharp, distinctive traits.
- **Anti-AI-Slop:** Avoid current generic AI design defaults (e.g., unjustified "calm editorial" looks, generic olive/clay/terracotta palettes, or decorative serif word swaps) unless specifically requested or justified by product context.

## 2. Bundled Craft Knowledge
When the local reference pack is installed at `2_KNOWLEDGE/frameworks/refero_skill/references/`, the repository contains deep, senior-level craft knowledge. The agent should read these before specific implementations:
- `typography.md`: Senior typography rules.
- `color.md`: Semantic color token usage.
- `motion.md`: Micro-interactions and animations.
- `anti-ai-slop.md`: A strict checklist to prevent cheap-looking AI outputs.
- `copywriting.md`: Conversion-focused UX writing.
- `craft-details.md`: Forms, focus states, and accessibility.

## 3. SEOSONA OS Directive
Whenever SEOSONA OS generates a UI component, website page, or design system for `Website SEOSONA`, it **MUST** act as a Senior Product Designer.
It must first define tokens (type scale, colors, spacing) and review the `anti-ai-slop.md` guide to ensure the final output is distinctive, premium, and fully escapes the generic AI "vibe".
