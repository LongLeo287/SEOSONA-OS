# KI: nowork-studio/NotFair

## Overview
This repository, `nowork-studio/NotFair`, provides AI agent plugins for SEO, Google Ads, and Meta Ads functionalities. The project aims to be host-agnostic, supporting various agents like Claude Code, Codex, and Hermes.  The code emphasizes surgical engineering practices with a focus on minimal changes and verifiable results.

## Tech Stack (from code)
- **TypeScript/JavaScript:** Numerous `.ts` and `.tsx` files (179 and 119 respectively) indicate the primary language is TypeScript, likely transpiled to JavaScript for execution.  File `next.config.ts` confirms usage of Next.js framework.
- **Next.js:** The presence of `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, and files within the `public/` directory strongly suggests a Next.js application.
- **Python:**  The `conftest.py` file indicates Python is used for testing, likely with pytest.
- **Vite:** The presence of `vitest.config.ts` and `vitest.evals.config.ts` files shows that Vite is being used as a build tool.

## Public API / Exports
Due to the lack of compiled code or readily available entry points, identifying concrete public APIs directly from source code is difficult. However, based on file structure and naming conventions:

- **Skill Resolver (`AGENTS.md`):** This file acts as a central configuration for routing user intents to specific skills. It defines the "public API" for AI agents interacting with the system.
- **SKILL.md files:** Each skill directory (e.g., `seo/seo-analysis`, `google-ads/manage`) contains a `SKILL.md` file, which likely outlines the skill's functionality and usage instructions. These act as internal APIs for agents to understand how to interact with each skill.

## Dependencies
- **JavaScript Packages:**  The presence of `package.json` indicates reliance on Node.js packages. The contents are not available in this analysis.
- **Python Packages:** The `requirements.txt` file lists the following Python dependencies:
    - `google-auth>=2.0.0`
    - `google-auth-httplib2>=0.2.0`
    - `requests>=2.28.0`

## Architecture Patterns
- **Plugin-Based:** The project is structured around a plugin architecture, with skills organized into directories and accessed through the `AGENTS.md` file. This promotes modularity and reusability.
- **Configuration-Driven:**  The system heavily relies on configuration files (e.g., `AGENTS.md`, `SKILL.md` files) to define behavior and routing, rather than hardcoded logic.
- **Layered Architecture:** The directory structure (`google-ads/audit`, `google-ads/manage`, `google-ads/copy`) suggests a layered architecture for different aspects of Google Ads functionality.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Plugin Architecture:** The plugin-based design can be adopted by SEOSONA OS to allow for easy integration of new features and functionalities without modifying core components.
- **Configuration-Driven Approach:**  SEOSONA OS could leverage configuration files similar to `AGENTS.md` to define routing rules and skill execution, enhancing flexibility and maintainability.
- **SEO Skills Integration:** The SEO skills (e.g., keyword research, content writing) present in the repository can be directly integrated into SEOSONA OS to enhance its SEO capabilities.  The modular design allows for selective integration of specific skills.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
