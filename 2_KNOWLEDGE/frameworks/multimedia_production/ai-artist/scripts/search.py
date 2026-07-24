#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Artist Search - BM25 search engine for prompt engineering
Usage: python search.py "<query>" [--domain <domain>] [--max-results 3]
       python search.py "<query>" --build-prompt [-p <platform>] [-s <style>]
       python search.py "<query>" --llm-pattern [-o <output_format>]

Domains: style, platform, subject, llm, quality, domain, examples
Platforms: midjourney, dall-e, stable-diffusion, flux, nano-banana
"""

import argparse
from core import CSV_CONFIG, AVAILABLE_DOMAINS, MAX_RESULTS, search, search_all_domains
from prompt_builder import build_image_prompt, build_llm_prompt, format_prompt_report


def format_output(result):
    """Format results for Claude consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    output.append(f"## AI Artist Search Results")
    output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")

    return "\n".join(output)


def format_multi_output(results):
    """Format multi-domain results"""
    output = []
    output.append("## AI Artist Multi-Domain Search\n")

    for domain, result in results.items():
        output.append(f"### {domain.upper()}")
        for i, row in enumerate(result['results'], 1):
            first_key = list(row.keys())[0]
            output.append(f"- {row.get(first_key, 'Unknown')}")
        output.append("")

    return "\n".join(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Artist Search")
    parser.add_argument("query", help="Search query or subject for prompt building")
    parser.add_argument("--domain", "-d", choices=AVAILABLE_DOMAINS, help="Search domain (auto-detected if not specified)")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--all", "-a", action="store_true", help="Search all domains")

    # Prompt building options
    parser.add_argument("--build-prompt", "-bp", action="store_true", help="Build a complete image prompt")
    parser.add_argument("--platform", "-p", type=str, default="midjourney", help="Target platform for prompt building")
    parser.add_argument("--style", "-s", type=str, default=None, help="Visual style for prompt building")
    parser.add_argument("--context", "-c", type=str, default=None, help="Domain context (marketing, gaming, etc.)")

    # LLM pattern options
    parser.add_argument("--llm-pattern", "-lp", action="store_true", help="Build an LLM prompt using patterns")
    parser.add_argument("--pattern", type=str, default=None, help="Prompt pattern to use")
    parser.add_argument("--output-format", "-o", type=str, default=None, help="Output format (json, markdown)")

    # Output format
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format")

    args = parser.parse_args()

    # Prompt building takes priority
    if args.build_prompt:
        result = build_image_prompt(
            subject=args.query,
            style=args.style,
            platform=args.platform,
            context=args.context
        )
        print(format_prompt_report(result, args.format))

    elif args.llm_pattern:
        result = build_llm_prompt(
            task=args.query,
            pattern=args.pattern,
            output_format=args.output_format
        )
        print(format_prompt_report(result, args.format))

    elif args.all:
        results = search_all_domains(args.query, args.max_results)
        if args.json:
            import json
            print(json.dumps(results, indent=2, ensure_ascii=False))
        else:
            print(format_multi_output(results))

    else:
        result = search(args.query, args.domain, args.max_results)
        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))
