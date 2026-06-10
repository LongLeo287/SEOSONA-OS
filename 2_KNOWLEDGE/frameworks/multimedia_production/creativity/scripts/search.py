#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Creativity Pro Max Search - BM25 search engine for creative direction guides
Usage: python search.py "<query>" [--domain <domain>] [--max-results 3]
       python search.py "<query>" --creative-brief [-c "Campaign Name"]

Domains: style, platform, voiceover, music, reasoning
"""

import argparse
from core import CSV_CONFIG, AVAILABLE_DOMAINS, MAX_RESULTS, search
from creative_brief import generate_creative_brief


def format_output(result):
    """Format results for Claude consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    output.append(f"## Creativity Pro Max Search Results")
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Creativity Pro Max Search")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=AVAILABLE_DOMAINS, help="Search domain")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    # Creative brief generation
    parser.add_argument("--creative-brief", "-cb", action="store_true", help="Generate complete creative brief recommendation")
    parser.add_argument("--campaign-name", "-c", type=str, default=None, help="Campaign name for creative brief output")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format for creative brief")

    args = parser.parse_args()

    # Creative brief takes priority
    if args.creative_brief:
        result = generate_creative_brief(args.query, args.campaign_name, args.format)
        print(result)
    # Domain search
    else:
        result = search(args.query, args.domain, args.max_results)
        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))
