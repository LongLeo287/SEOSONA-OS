# KI: digitalsamba/claude-code-video-toolkit

## Overview
This repository, `digitalsamba/claude-code-video-toolkit`, provides a workspace for AI-assisted video production using Claude Code. It offers tools and workflows to automate tasks like voiceover generation, music creation, browser demo recording, and asset processing, aiming to streamline the video creation process. The project emphasizes programmatic video creation with Remotion (a React-based framework) and integrates with cloud GPU services.

## Tech Stack (from code)
- **TypeScript:**  The presence of numerous `.ts` and `.tsx` files (`lib/index.ts`, `lib\brand.ts`, `lib\generate-brand-ts.ts`) indicates the primary language is TypeScript.
- **React:** The use of components like `AnimatedBackground` and `Label` in `lib/index.ts` suggests React is used for UI elements within video templates.
- **Node.js:**  The presence of a `package.json` file (not directly listed, but implied by the TypeScript build process) indicates Node.js as the runtime environment. The script `lib/generate-brand-ts.ts` uses `#!/usr/bin/env npx ts-node`, confirming its execution within a Node.js context using `ts-node`.
- **Python:**  The `.env.example` file references Python scripts (`python3 -m modal setup`), and the existence of files like `docker/modal-{tool}/app.py` suggests Python is used for backend services and cloud GPU deployments.

## Public API / Exports
Based on `lib/index.ts`, the following are exported:
- `loadBrand`: Function to load brand configurations (from `lib/brand.ts`).
- `loadProjectBrand`:  Function related to loading project brands (from `lib/brand.ts`).
- `loadBrandAsTheme`: Function for converting a brand object into a theme object (from `lib/brand.ts`).
- `loadProjectTheme`: Function for loading project themes (from `lib/brand.ts`).
- `listBrands`: Function to list available brands (from `lib/brand.ts`).
- `brandToTheme`: Function to convert a brand object into a theme object (from `lib/brand.ts`).
- `getBrandAssetPath`: Function for retrieving asset paths based on the brand (from `lib/brand.ts`).
- `loadProjectConfig`: Function to load project configuration (from `lib/brand.ts`).

## Dependencies
Based on the limited code provided, it's difficult to definitively list all dependencies. However, from the snippets available:
- **fs:** Node.js file system module (used in `lib\brand.ts` and `lib\generate-brand-ts.ts`)
- **path:** Node.js path utility module (used in `lib\brand.ts` and `lib\generate-brand-ts.ts`)

## Architecture Patterns
- **Modular Design:** The project is structured into directories like `.claude/`, `tools/`, `assets/`, and `_internal/`, suggesting a modular architecture with distinct responsibilities for different components.
- **Configuration-Driven Development:**  The heavy reliance on brand configurations (as seen in `lib\brand.ts` and the generated TypeScript files) indicates a configuration-driven approach to video creation, allowing for customization without modifying core code.
- **Plugin/Skill System:** The `.claude/skills/` directory suggests a plugin or skill system where functionality can be extended or customized.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Automated Content Creation:**  The toolkit’s focus on automating video production aligns with SEOSONA OS’s goals of efficient content generation. The ability to programmatically create videos, generate voiceovers, and produce music can significantly reduce manual effort.
- **Brand Consistency:** The brand management system (as demonstrated in `lib\brand.ts`) could be integrated into SEOSONA OS to ensure consistent branding across all generated content.
- **Cloud GPU Integration:**  The toolkit's integration with cloud GPUs (Modal, RunPod) provides a scalable infrastructure for video processing that SEOSONA OS can leverage.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `subtitle` · **Fit:** 100/100 · **Auto-apply:** True
- **Evidence:** `srt`, `subtitle`, `caption`, `dub`
- **All scores:** {'seosona-os': 41, 'seosona-video': 100, 'seosona-content': 99, 'seosona-ux-ui': 44, 'seosona-flow': 28}
