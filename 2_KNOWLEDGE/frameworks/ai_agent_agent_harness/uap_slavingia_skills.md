# KI: slavingia/skills

## Overview
This project appears to be a collection of markdown files describing various skills or topics, organized into directories representing different areas like "company-values," "marketing-plan," and "validate-idea." The structure suggests it's intended as documentation or a learning resource.  The presence of `plugin.json` and `marketplace.json` in the `.claude-plugin/` directory indicates an attempt to package this content for use with Claude AI, likely as a plugin.

## Tech Stack (from code)
Based on the file extensions present (`.md`, `.json`), the primary technology appears to be Markdown for documentation and JSON for data serialization (likely related to the Claude plugin).  No explicit build system or framework configuration files are visible from the provided directory structure.

## Public API / Exports
There is no code available that defines a public API or exports anything. The project consists solely of markdown and json files.

## Dependencies
The only dependencies indicated are those implied by the JSON format, which would typically involve a JSON parsing library if this data were being processed programmatically (which isn't evident from the provided file listing).  No `package.json`, `requirements.txt`, or similar dependency management files are present in the listed directory structure.

## Architecture Patterns
The project exhibits a hierarchical directory structure for organizing content, which is a common pattern for documentation and knowledge bases. The use of Markdown suggests a focus on readability and ease of authoring.  The presence of JSON files alongside markdown indicates an attempt to integrate with Claude AI, likely using the JSON data to define plugin metadata or provide structured information.

## Relevance to SEOSONA OS
Without more context about SEOSONA OS, it's difficult to assess direct relevance. However, the project’s structure and content could potentially be adapted for use within SEOSONA OS as a knowledge base or training resource. The Claude AI plugin integration approach might also offer insights into how SEOSONA OS can integrate with external AI services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
