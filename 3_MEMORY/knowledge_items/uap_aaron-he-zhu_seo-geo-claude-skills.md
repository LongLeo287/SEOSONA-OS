# KI: aaron-he-zhu/seo-geo-claude-skills

## Overview
This project appears to be a collection of "SKILL" modules related to SEO, geographic data processing, and potentially leveraging Claude (a language model). The structure suggests a modular design with components for content quality auditing, domain authority analysis, rank tracking, keyword research, and technical SEO checks. Each module is defined by a `SKILL.md` file, implying documentation or configuration associated with each skill.

## Tech Stack (from code)
Due to the lack of standard configuration files like `package.json`, `requirements.txt`, or `Cargo.toml`, it's impossible to definitively determine the tech stack used. The presence of `.md` files suggests Markdown is a primary format, likely for documentation and potentially configuration.  Without further evidence, language/framework cannot be determined.

## Public API / Exports
There are no code files provided that demonstrate any public APIs or exports. All visible files are `SKILL.md` markdown documents which do not contain executable code.

## Dependencies
No dependency information is available due to the absence of standard configuration files (e.g., `package.json`, `requirements.txt`).

## Architecture Patterns
The project exhibits a modular architecture, with each SEO-related task or analysis encapsulated within its own directory and associated `SKILL.md` file. This suggests a potential plugin-based design where these "skills" could be integrated into a larger system. The consistent naming convention (`[module-name]/SKILL.md`) reinforces this pattern.

## Relevance to SEOSONA OS
Without knowing the implementation details within each `SKILL.md` file, it's difficult to assess direct relevance to SEOSONA OS. However, the modular structure and focus on SEO tasks (keyword research, rank tracking, technical SEO checks) suggest that individual modules *could* be adapted or integrated into SEOSONA OS as specialized components if their functionality aligns with existing needs. The geographic data processing aspect could also be valuable for location-based SEO features within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `seo`, `serp`, `backlink`, `keyword`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
