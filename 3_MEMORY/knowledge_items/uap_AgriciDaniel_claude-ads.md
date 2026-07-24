# KI: AgriciDaniel/claude-ads

## Overview
This repository contains a Claude Code skill named "Claude Ads" designed for comprehensive paid advertising analysis across multiple platforms. It leverages an agent-based architecture and includes sub-skills focused on auditing, creative strategy, and optimization for various ad networks like Google, Meta, TikTok, and LinkedIn. The project aims to provide structured data and insights related to paid advertising campaigns.

## Tech Stack (from code)
- **Python:**  The `requirements.txt` file lists Python dependencies, indicating the primary language used. (`requirements.txt`)
- **Playwright:** Used for browser automation, likely for tasks like screenshotting and landing page analysis. (`requirements.txt`: `playwright>=1.56.0,<2.0.0`)
- **Reportlab & Matplotlib:**  Used for generating PDF reports with visualizations. (`requirements.txt`: `reportlab>=4.0,<5.0.0`, `matplotlib>=3.8.0,<4.0.0`)

## Public API / Exports
Due to the nature of this project as a Claude Code skill, identifying explicit "public APIs" in the traditional sense is difficult. However, based on file structure and naming conventions:

- **`ads/SKILL.md`:** This appears to be the entry point and routing table for the main skill, effectively defining its primary functions. (`CLAUDE.md`)
- **Sub-skill `SKILL.md` files:** Each sub-skill (e.g., `ads-google/SKILL.md`, `ads-meta/SKILL.md`) likely defines a set of actions and data structures specific to that platform or task. (`CLAUDE.md`)

## Dependencies
Based on the `requirements.txt` file:

- **Core dependencies:** `requests`, `playwright`, `urllib3`
- **Image validation:** `Pillow`
- **PDF report generation:** `reportlab`, `matplotlib`
- **Potential image generation fallbacks (not actively used):**  `google-genai`, `openai`, `stability-sdk`, `replicate`

## Architecture Patterns
- **Agent-Based Architecture:** The project heavily utilizes an agent-based architecture, with distinct agents for auditing, copywriting, creative strategy, and more. (`CLAUDE.md`)
- **Modular Skill Structure:**  The code is organized into modular sub-skills (e.g., `ads-google`, `ads-meta`), promoting reusability and maintainability. (`CLAUDE.md`)
- **Layered Architecture (Directive, Orchestration, Execution):** The project explicitly mentions a 3-layer architecture as part of the Claude Code skill standard. (`CLAUDE.md`)

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Automated Ad Audit Capabilities:**  The auditing agents and platform-specific knowledge base (found within `ads/references/`) can be integrated into SEOSONA OS to automate ad campaign audits, identifying areas for improvement.
- **Creative Optimization Insights:** The creative strategist and visual designer agents could provide valuable insights for optimizing ad creatives within the SEOSONA OS workflow.
- **Platform Integration:**  The platform-specific modules (e.g., `ads-google`, `ads-meta`) demonstrate expertise in interacting with various advertising platforms, which can be leveraged to enhance SEOSONA OS's integration capabilities. The code provides a foundation for automating tasks and extracting data from these platforms.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
