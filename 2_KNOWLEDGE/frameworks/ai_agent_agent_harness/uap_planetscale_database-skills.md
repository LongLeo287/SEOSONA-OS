# KI: planetscale/database-skills

## Overview
This repository appears to be a collection of documentation and learning materials focused on database skills, specifically for MySQL, Neki (likely an internal PlanetScale system), and PostgreSQL. The content is structured around "SKILL.md" files within each database directory, with accompanying reference documents providing more detailed explanations.  The `website/` directory suggests these materials are intended to be presented via a web interface.

## Tech Stack (from code)
- **HTML:** The presence of `index.html` and numerous `.md` files indicates the content is likely rendered as HTML.
- **SVG & PNG:** Images in the `website/` directory use SVG and PNG formats, suggesting these are used for visual elements on a website.
- **No build system or language configuration file found**: There's no evidence of a specific programming language or build system (e.g., `package.json`, `requirements.txt`, `Cargo.toml`) within the provided directory listing. The project appears to be primarily focused on Markdown content and image assets, likely intended for static website generation.

## Public API / Exports
There are no exported functions, classes, or endpoints visible in this code listing. This is because the repository consists of documentation files (Markdown) and images; it doesn't contain executable code with public APIs. The `index.html` file within the `website/` directory likely serves as an entry point for a static website displaying the content.

## Dependencies
There are no dependency management files present in this listing (`package.json`, `requirements.txt`, etc.). Therefore, it's impossible to determine any dependencies from the code provided.

## Architecture Patterns
- **Content Organization by Database Type:** The directory structure clearly separates content based on database systems (MySQL, Neki, PostgreSQL), indicating a modular approach to organizing learning materials.
- **SKILL.md and references/ pattern**:  Each database area uses `SKILL.md` as a central document with related details in the `references/` subdirectory. This suggests a structured way of presenting core concepts alongside supporting information.

## Relevance to SEOSONA OS
The content within this repository could be valuable for training and documentation purposes within SEOSONA OS, particularly if the operating system utilizes or supports any of the covered database systems (MySQL, PostgreSQL). The materials provide insights into database internals, query optimization, and architectural considerations that are relevant to database administrators and developers.  Specifically, the sections on indexing, query optimization pitfalls, and replication lag could be directly applicable to improving SEOSONA OS's data management capabilities.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
