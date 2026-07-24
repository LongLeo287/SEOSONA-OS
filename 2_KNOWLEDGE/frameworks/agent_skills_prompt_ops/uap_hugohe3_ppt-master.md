# KI: hugohe3/ppt-master

## Overview
This repository, "PPT Master," is an AI-driven system designed for generating presentations from various source documents (PDF, DOCX, URLs, Markdown). It leverages a multi-role collaboration pipeline involving Strategist, Image Generator, and Executor agents to produce natively editable PPTX files with PowerPoint shapes. The project emphasizes a structured workflow defined in `SKILL.md` for managing the entire presentation creation process.

## Tech Stack (from code)
- **Python:**  The presence of `requirements.txt` indicates Python is the primary language. File path: `requirements.txt`. Content: `-r skills/ppt-master/requirements.txt`
- **Pip:** The `requirements.txt` file suggests the use of pip for dependency management, a standard practice in Python projects. File path: `requirements.txt`. Content: `# Install / 安装方式：pip install -r requirements.txt`
- **Markdown:**  The extensive use of `.md` files (175 total) indicates Markdown is used for documentation and potentially configuration.

## Public API / Exports
Due to the nature of this project, identifying a clear public API from code alone is difficult. However, based on file names and descriptions, some key workflows appear to be exposed:
- **Topic Research:**  Mentioned in `AGENTS.md` as a workflow for topic-only requests. File path: `AGENTS.md`. Content: `- Topic-only requests run [`topic-research`](skills/ppt-master/workflows/topic-research.md) before SKILL.md Step 1.`
- **Template Fill PPTX:**  Used when raw PPTX is requested with new material. File path: `AGENTS.md`. Content: `- Raw PPTX template plus new material/topic routes to [`template-fill-pptx`](skills/ppt-master/workflows/template-fill-pptx.md), not the SVG pipeline.`
- **Create Template:**  Used for standalone template creation. File path: `AGENTS.md`. Content: `- Raw PPTX cannot be consumed as a Step 3 SVG template; run [`create-template`](skills/ppt-master/workflows/create-template.md) first and return with the generated template directory path.`
- **Beautify PPTX:**  Used for verbatim wording and page order in PPTX files. File path: `AGENTS.md`. Content: `- PPTX beautify is strictly 1:1 page count/order and verbatim wording via [`beautify-pptx`](skills/ppt-master/workflows/beautify-pptx.md); any split/merge/drop/reorder routes to the main pipeline.`
- **Native Enhance PPTX:** Used for enhancing finished PPTX files without SVG regeneration. File path: `AGENTS.md`. Content: `- Finished PPTX native enhancement uses [`native-enhance-pptx`](skills/ppt-master/workflows/native-enhance-pptx.md) and must not enter SVG regeneration.`
- **Visual Review, Customize Animations, Generate Audio:** Explicit request workflows. File path: `AGENTS.md`. Content: `- [`visual-review`](skills/ppt-master/workflows/visual-review.md), [`customize-animations`](skills/ppt-master/workflows/customize-animations.md), and [`generate-audio`](skills/ppt-master/workflows/generate-audio.md) are explicit-request workflows.`

## Dependencies
Based on `requirements.txt`, the project has dependencies including:
-  `skills/ppt-master/requirements.txt`: This file is included in `requirements.txt`. File path: `requirements.txt`. Content: `-r skills/ppt-master/requirements.txt` (The contents of this file are not provided, so a full list cannot be generated).

## Architecture Patterns
- **Plugin System:** The use of `.claude-plugin/` directories and associated JSON files (`marketplace.json`, `plugin.json`) suggests a plugin architecture for extending functionality. File paths: `.claude-plugin/marketplace.json`, `skills/.claude-plugin/plugin.json`.
- **Workflow Orchestration:** The project heavily relies on defined workflows, as evidenced by the numerous references to workflow files (e.g., `workflows/routing.md`, `workflows/topic-research.md`). This indicates a structured approach to task execution and dependency management.
- **Configuration Management:**  The `.env.example` file demonstrates an environment variable configuration system for managing settings, with precedence rules defined for fallback locations. File path: `.env.example`.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Presentation Generation:** The core functionality of PPT Master—generating presentations from various sources—could be integrated into SEOSONA OS to automate content creation for reports, documentation, or training materials.
- **Plugin Architecture:**  The plugin system used by PPT Master could serve as a model for extending the capabilities of SEOSONA OS with custom modules and integrations.
- **Workflow Management:** The structured workflow approach employed in PPT Master (defined in `SKILL.md` and implemented through various workflow files) could be adapted to manage complex tasks within SEOSONA OS, ensuring consistency and efficiency.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `capability`, `plugin`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 22, 'seosona-flow': 28}
