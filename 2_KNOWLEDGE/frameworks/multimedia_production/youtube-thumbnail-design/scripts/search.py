#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YouTube Thumbnail Design Search - CLI for searching thumbnail design guidelines
Usage: python search.py "<query>" [--domain <domain>] [--max-results 3]
       python search.py "<query>" --design-brief [-t "Video Title"]

Domains: style, niche
"""

import argparse
from core import CSV_CONFIG, MAX_RESULTS, search, search_all


def format_output(result):
    """Format results for Claude consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    output.append(f"## YouTube Thumbnail Search Results")
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


def generate_design_brief(query, video_title=None):
    """Generate a comprehensive thumbnail design brief based on query"""
    results = search_all(query, max_results=2)

    output = []
    output.append("=" * 60)
    if video_title:
        output.append(f"  THUMBNAIL DESIGN BRIEF: {video_title.upper()}")
    else:
        output.append("  THUMBNAIL DESIGN BRIEF")
    output.append("=" * 60)
    output.append(f"  Query: {query}")
    output.append("=" * 60)
    output.append("")

    # Niche recommendations
    if "niche" in results:
        output.append("## NICHE ANALYSIS")
        for r in results["niche"]:
            output.append(f"**Niche:** {r.get('Niche', 'N/A')}")
            output.append(f"- Recommended Styles: {r.get('Recommended Styles', 'N/A')}")
            output.append(f"- Colors: {r.get('Primary Colors', 'N/A')}")
            output.append(f"- Typography: {r.get('Typography', 'N/A')}")
            output.append(f"- Common Elements: {r.get('Common Elements', 'N/A')}")
            output.append(f"- Mood: {r.get('Mood', 'N/A')}")
            output.append(f"- Best Practices: {r.get('Best Practices', 'N/A')}")
            output.append(f"- Avoid: {r.get('Avoid', 'N/A')}")
            output.append("")

    # Style recommendations
    if "style" in results:
        output.append("## STYLE RECOMMENDATIONS")
        for r in results["style"]:
            output.append(f"**{r.get('Style Name', 'N/A')}** ({r.get('Category', 'N/A')})")
            output.append(f"- Background: {r.get('Background', 'N/A')}")
            output.append(f"- Typography: {r.get('Typography', 'N/A')}")
            output.append(f"- Key Elements: {r.get('Key Elements', 'N/A')}")
            output.append(f"- Best For: {r.get('Best For', 'N/A')}")
            output.append(f"- CTR Impact: {r.get('CTR Impact', 'N/A')}")
            output.append("")

    # Thumbnail specs reminder
    output.append("## SPECS")
    output.append("- Size: 1280 x 720px (16:9)")
    output.append("- Max file size: 2MB")
    output.append("- Text: 3 words max, 80px+ font")
    output.append("- Must be readable at 168x94px (sidebar)")
    output.append("- Bottom-right: keep clear (duration badge)")
    output.append("")

    return "\n".join(output)


def main():
    parser = argparse.ArgumentParser(description="Search YouTube thumbnail design guidelines")
    parser.add_argument("query", type=str, help="Search query")
    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Domain to search")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results")
    parser.add_argument("--design-brief", action="store_true", help="Generate full design brief")
    parser.add_argument("--video-title", "-t", type=str, help="Video title for design brief")

    args = parser.parse_args()

    if args.design_brief:
        print(generate_design_brief(args.query, args.video_title))
    elif args.domain:
        result = search(args.query, args.domain, args.max_results)
        print(format_output(result))
    else:
        # Search all domains
        for domain in CSV_CONFIG:
            result = search(args.query, domain, args.max_results)
            if result.get("results"):
                print(format_output(result))
                print()


if __name__ == "__main__":
    main()
