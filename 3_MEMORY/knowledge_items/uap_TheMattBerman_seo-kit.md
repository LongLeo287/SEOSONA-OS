# KI: TheMattBerman/seo-kit

## Overview
This project, "SEO Kit," appears to be a collection of shell scripts and markdown documents designed for automated SEO tasks including keyword discovery, content generation, backlink acquisition, technical health monitoring, and competitor analysis.  The system aims to automate various aspects of SEO workflows, integrating with APIs like Google Search Console and DataForSEO. The project emphasizes brand voice integration within the content creation process.

## Tech Stack (from code)
- **Shell Scripting:** The primary programming language is Bash, evidenced by the numerous `.sh` files (e.g., `skills/seo-agent/scripts/seo-discover.sh`, `skills/seo-links/scripts/link-broken.sh`).
- **Markdown:**  The project heavily utilizes Markdown for documentation and content generation (`AGENTS.md`, `SKILL.md` files throughout the directory structure).
- **JSON:** Configuration data appears to be stored in JSON format (e.g., `skills/seo-images/styles/*.json`, `workspace/seo/health/*.json`).

## Public API / Exports
The project doesn't appear to expose a traditional public API or have any exported functions in the conventional sense. Instead, it consists of executable shell scripts that are intended to be run directly from the command line. The "public" interface is the execution of these `.sh` files. For example: `skills/seo-agent/scripts/seo-discover.sh`.

## Dependencies
There's no apparent dependency file (e.g., `package.json`, `requirements.txt`, `Cargo.toml`).  The scripts themselves may rely on external command-line tools, but these are not explicitly declared in a manifest file within the provided code snippets. The AGENTS.md document mentions "Google Search Console API" and "DataForSEO API", implying dependencies on those services, but no explicit library or package management is shown.

## Architecture Patterns
- **Modular Skill-Based Design:**  The project is structured around distinct "skills" (e.g., `seo-agent`, `seo-forge`, `seo-links`, `seo-health`, `seo-checklist`), each encapsulating a specific SEO function and associated scripts. This promotes reusability and organization.
- **Pipeline Architecture:** The "Complete Loop" section in `AGENTS.md` describes a sequential pipeline of tasks, suggesting a workflow-driven architecture where the output of one script feeds into another.  For example, `seo-check.sh` precedes `seo-interview.sh`.
- **Configuration via JSON:** Configuration data for image generation and health checks is stored in JSON files (`skills/seo-images/styles/*.json`, `workspace/seo/health/*.json`), indicating a configuration-driven approach to these tasks.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing:
- **Pre-built SEO Skills:** The modular "skill" structure (e.g., keyword discovery, backlink analysis) can be directly integrated as reusable components within the SEOSONA OS framework.
- **Automated Workflow Templates:**  The defined pipeline in `AGENTS.md` offers a starting point for creating automated SEO workflows within SEOSONA OS. These could be customized and extended to fit specific needs.
- **Data Integration Examples:** The use of APIs like Google Search Console and DataForSEO demonstrates how external data sources can be incorporated into the SEO process, which is valuable for SEOSONA OS's data integration capabilities.  The JSON configuration files provide examples of structuring data for these integrations.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
