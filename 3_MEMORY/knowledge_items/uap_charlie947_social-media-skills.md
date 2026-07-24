# KI: charlie947/social-media-skills

## Overview
This repository appears to be a collection of "skills" or guides related to social media marketing and content creation. The skills cover topics ranging from analytics dashboards to reels scripting, with each skill documented in a `SKILL.md` file within its own directory under the `skills/` folder. A validation script (`validate-skills.sh`) is provided to check the structure and contents of these skill files against defined criteria.

## Tech Stack (from code)
- **Bash:** The primary scripting language used for automation, specifically in the `validate-skills.sh` file.  (File: `validate-skills.sh`)
```bash
#!/usr/bin/env bash
```
- **Markdown (.md):** Used extensively for documentation within the `SKILL.md` files and reference documents (e.g., `archetypes.md`, `sample-content.md`).  (Multiple files with `.md` extension)

## Public API / Exports
The repository doesn't appear to expose a public API or endpoints in the traditional sense. The primary "export" is the collection of skill documentation contained within the `skills/` directory and the validation script, which can be used to check the consistency of new skills added.  There are no explicit function definitions or class declarations visible in the provided code snippets.

## Dependencies
No dependency files (e.g., `package.json`, `requirements.txt`) were included in the source code listing. Therefore, dependencies cannot be determined from this data alone.

## Architecture Patterns
- **Directory-Based Skill Organization:** The project uses a directory structure to organize skills, with each skill residing in its own folder containing a `SKILL.md` file. This promotes modularity and easy navigation. (e.g., `skills/gemini-carousel/SKILL.md`)
- **YAML Frontmatter Validation:**  The `validate-skills.sh` script enforces a specific structure for the `SKILL.md` files, requiring YAML frontmatter with certain fields (`name`, `description`). This suggests an attempt to standardize skill documentation. (File: `validate-skills.sh`)
```bash
# SKILL.md exists
if [[ ! -f "$skill_md" ]]; then
  err "SKILL.md missing"
  continue
fi

# Frontmatter present
first_line="$(head -n1 "$skill_md")"
if [[ "$first_line" != "---" ]]; then
  err "SKILL.md must start with YAML frontmatter (---)"
  continue
fi
```



## Relevance to SEOSONA OS
The structured skill documentation and the validation script could be beneficial for SEOSONA OS in several ways:

- **Knowledge Base Integration:** The `SKILL.md` files, if parsed correctly, could contribute to a searchable knowledge base within SEOSONA OS, providing users with readily available guides on various social media skills.
- **Content Creation Assistance:**  The "archetypes" and "sample content" reference documents (e.g., `archetypes.md`, `sample-content.md`) provide templates that could be integrated into SEOSONA OS to assist users in generating content.
- **Skill Validation Framework:** The validation script (`validate-skills.sh`) demonstrates a robust approach to ensuring consistency and quality within a collection of skills, which could be adapted for use in SEOSONA OS to validate user-generated content or training materials.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
