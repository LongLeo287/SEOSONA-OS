# KI: greensock/gsap-skills

## Overview
This repository appears to be a collection of "skills" designed for AI coding agents, specifically focused on GreenSock Animation Platform (GSAP). The skills are structured as individual directories containing Markdown files (`SKILL.md`) that provide instructions and guidance for using GSAP in various scenarios.  The project provides a standardized format for these skills, including frontmatter requirements and conventions for writing descriptions.

## Tech Stack (from code)
Based on the file extensions present (.md, .json, .svg, .gitignore), this appears to be primarily a documentation-focused project using Markdown as its core language.  The presence of `.json` files suggests some form of data serialization or configuration is involved, likely for plugin metadata. There's no explicit build system or framework evidence from the provided file list.

## Public API / Exports
There are no directly exposed APIs or exports in the code presented. The project defines a structure and conventions *for* skills, rather than providing an API itself.  The `SKILL.md` files within each skill directory represent the "public" interface for AI agents consuming these skills.

## Dependencies
No dependency information is available from the provided file list. A `package.json`, `requirements.txt`, or similar dependency management file would be needed to determine external dependencies.

## Architecture Patterns
The project utilizes a clear directory-based structure for organizing skills, with each skill residing in its own subdirectory.  A key architectural pattern is the use of frontmatter (YAML) within the `SKILL.md` files to define metadata like name and description, which appears crucial for AI agent discovery and understanding. The "skills CLI" mentioned in `AGENTS.md` suggests a command-line tool for discovering and managing these skills.

## Relevance to SEOSONA OS
The structured approach to defining GSAP skills could be beneficial to SEOSONA OS if it incorporates AI-assisted coding or automation features.  The standardized format of the `SKILL.md` files allows for easy integration and consumption by AI agents, enabling them to provide targeted guidance and assistance when working with GSAP within the OS environment. The agent skill specification link in `AGENTS.md` suggests a broader compatibility goal beyond just this repository.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
