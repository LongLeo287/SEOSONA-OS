#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Artist Prompt Builder - Generate comprehensive prompts from keywords
"""

from core import search, search_all_domains, AVAILABLE_DOMAINS


def build_image_prompt(subject, style=None, platform="midjourney", context=None):
    """
    Build a comprehensive image generation prompt.

    Args:
        subject: Main subject description
        style: Visual style (optional, auto-detected)
        platform: Target platform (midjourney, dall-e, stable-diffusion, flux)
        context: Domain context (marketing, gaming, editorial, etc.)

    Returns:
        dict with prompt components and final prompt
    """
    components = {
        "subject": subject,
        "style": None,
        "lighting": None,
        "composition": None,
        "quality": None,
        "negative": None,
        "platform_tips": None
    }

    # Search for style if provided
    if style:
        style_result = search(style, "style", 1)
        if style_result.get("results"):
            s = style_result["results"][0]
            components["style"] = s.get("Prompt Keywords", "")
            components["lighting"] = s.get("Lighting", "")
            components["composition"] = s.get("Composition", "")
            components["negative"] = s.get("Negative Prompt", "")
            components["platform_tips"] = s.get("Platform Tips", "")

    # Search for subject-specific tips
    subject_result = search(subject, "subject", 1)
    if subject_result.get("results"):
        sub = subject_result["results"][0]
        components["subject_tips"] = sub.get("Tips", "")
        components["detail_keywords"] = sub.get("Detail Keywords", "")

    # Search for quality modifiers
    quality_result = search(f"{platform} quality professional", "quality", 3)
    if quality_result.get("results"):
        components["quality"] = ", ".join([q.get("Modifier", "") for q in quality_result["results"]])

    # Search for platform-specific guidance
    platform_result = search(platform, "platform", 1)
    if platform_result.get("results"):
        p = platform_result["results"][0]
        components["syntax"] = p.get("Syntax Examples", "")
        components["best_practices"] = p.get("Best Practices", "")

    # Search for domain context
    if context:
        domain_result = search(context, "domain", 1)
        if domain_result.get("results"):
            d = domain_result["results"][0]
            components["prompt_structure"] = d.get("Prompt Structure", "")
            components["domain_mistakes"] = d.get("Common Mistakes", "")

    # Build the final prompt based on platform
    final_prompt = _assemble_prompt(components, platform)

    return {
        "components": components,
        "final_prompt": final_prompt,
        "platform": platform
    }


def _assemble_prompt(components, platform):
    """Assemble prompt components into platform-optimized format"""
    platform_lower = platform.lower()

    parts = [components["subject"]]

    if components.get("style"):
        parts.append(components["style"])

    if components.get("lighting"):
        parts.append(components["lighting"])

    if components.get("composition"):
        parts.append(components["composition"])

    if components.get("quality"):
        parts.append(components["quality"])

    if components.get("detail_keywords"):
        parts.append(components["detail_keywords"])

    # Platform-specific formatting
    if "midjourney" in platform_lower:
        prompt = ", ".join(filter(None, parts))
        prompt += " --ar 16:9 --style raw --v 6.1"
        if components.get("negative"):
            prompt += f" --no {components['negative'].split(',')[0].strip()}"

    elif "dall" in platform_lower:
        # DALL-E prefers natural language
        prompt = f"Create an image of {components['subject']}. "
        if components.get("style"):
            prompt += f"Style: {components['style']}. "
        if components.get("lighting"):
            prompt += f"Lighting: {components['lighting']}. "
        prompt += "HD quality, professional."

    elif "stable" in platform_lower or "sd" in platform_lower:
        # SD uses weighted keywords
        prompt = f"(masterpiece:1.4), (best quality:1.3), {', '.join(filter(None, parts))}"
        if components.get("negative"):
            prompt += f"\nNegative prompt: {components['negative']}"

    elif "flux" in platform_lower:
        prompt = ", ".join(filter(None, parts))
        prompt += ", high quality, detailed"

    else:
        prompt = ", ".join(filter(None, parts))

    return prompt


def build_llm_prompt(task, pattern=None, output_format=None):
    """
    Build a structured LLM prompt using patterns.

    Args:
        task: The task description
        pattern: Prompt pattern to use (optional)
        output_format: Desired output format (json, markdown, etc.)

    Returns:
        dict with prompt template and components
    """
    components = {
        "pattern": None,
        "template": None,
        "format_guidance": None
    }

    # Search for pattern
    if pattern:
        pattern_result = search(pattern, "llm", 1)
        if pattern_result.get("results"):
            p = pattern_result["results"][0]
            components["pattern"] = p.get("Pattern Name", "")
            components["template"] = p.get("Template", "")
            components["example"] = p.get("Example", "")
            components["tips"] = p.get("Tips", "")

    # Search for format guidance
    if output_format:
        format_result = search(f"format {output_format}", "llm", 1)
        if format_result.get("results"):
            f = format_result["results"][0]
            components["format_guidance"] = f.get("Template", "")

    # Build final prompt
    final_prompt = components.get("template", "")
    if final_prompt and "[" in final_prompt:
        # Template has placeholders, show them
        final_prompt = f"Template:\n{final_prompt}\n\nApply to task: {task}"
    else:
        final_prompt = task

    return {
        "components": components,
        "final_prompt": final_prompt,
        "task": task
    }


def format_prompt_report(result, output_format="ascii"):
    """Format prompt building result as a report"""
    if output_format == "markdown":
        return _format_markdown(result)
    return _format_ascii(result)


def _format_ascii(result):
    """Format as ASCII box"""
    lines = []
    lines.append("=" * 60)
    lines.append(f" AI ARTIST PROMPT BUILDER")
    lines.append("=" * 60)

    if "platform" in result:
        lines.append(f" Platform: {result['platform']}")

    lines.append("-" * 60)
    lines.append(" COMPONENTS:")
    for key, value in result.get("components", {}).items():
        if value:
            lines.append(f"   {key}: {str(value)[:50]}...")

    lines.append("-" * 60)
    lines.append(" FINAL PROMPT:")
    lines.append("-" * 60)
    lines.append(result.get("final_prompt", ""))
    lines.append("=" * 60)

    return "\n".join(lines)


def _format_markdown(result):
    """Format as markdown"""
    lines = []
    lines.append("# AI Artist Prompt Builder\n")

    if "platform" in result:
        lines.append(f"**Platform:** {result['platform']}\n")

    lines.append("## Components\n")
    for key, value in result.get("components", {}).items():
        if value:
            lines.append(f"- **{key}:** {value}")

    lines.append("\n## Final Prompt\n")
    lines.append("```")
    lines.append(result.get("final_prompt", ""))
    lines.append("```")

    return "\n".join(lines)
