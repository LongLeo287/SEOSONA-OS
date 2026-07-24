# KI: kepano/obsidian-skills

## Overview
This repository appears to be a collection of Obsidian skills, which are likely custom scripts or guides for enhancing the functionality and usage of the Obsidian note-taking application. The content is structured around specific topics like "defuddle," "json-canvas," "obsidian-bases," "obsidian-cli," and "obsidian-markdown," suggesting targeted skill development within the Obsidian ecosystem.  The files primarily consist of Markdown documents (`.md`) containing instructional material.

## Tech Stack (from code)
There is no apparent build system or configuration file to determine a specific tech stack beyond Markdown. The `.claude-plugin/plugin.json` file indicates this is intended as an Obsidian plugin, but doesn't reveal any programming language used for the underlying logic of the skills themselves.

```json
// .claude-plugin/plugin.json
{
  "type": "plugin",
  "name": "obsidian-skills",
  "version": "1.0.0",
  "author": "kepano",
  "description": "",
  "isDesktopOnly": false
}
```

## Public API / Exports
There are no exported functions, classes, or endpoints in the provided code snippet because it consists primarily of Markdown documents. The `.claude-plugin/plugin.json` file describes a plugin but doesn't contain any executable code to analyze for exports.

## Dependencies
The repository does not include `package.json`, `requirements.txt`, or `Cargo.toml` files, so dependencies cannot be determined from the provided source code. The presence of `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` suggests a dependency on Obsidian's plugin system but doesn’t list specific libraries.

## Architecture Patterns
The primary architectural pattern is content organization via Markdown files grouped into directories based on subject matter (e.g., `skills/defuddle`, `skills/obsidian-markdown`). This indicates a knowledge base or tutorial structure rather than a software application with complex architecture.  Within the markdown documents, there's evidence of reference sections using subdirectories like `references/` which suggests a pattern of separating core skill explanations from supplementary material.

```
// skills/obsidian-markdown/references/CALLOUTS.md
# Callouts

Callouts are a way to highlight important information in your notes. They can be used to add context, provide examples, or simply draw attention to key points.

## Syntax

The syntax for creating a callout is as follows:

```obsidian
> [!callout]
> This is the content of the callout.
```
```

## Relevance to SEOSONA OS
Without knowing what SEOSONA OS *is*, it's impossible to determine how this project’s code could benefit it. The Markdown-based knowledge base structure might be useful for documenting SEOSONA OS features or providing user guides, but further context about SEOSONA OS is required for a more specific assessment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
