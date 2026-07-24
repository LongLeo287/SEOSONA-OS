# KI: bergside/design-md-chrome

## Overview
This project appears to be a Chrome extension designed to extract design information (typography, colors, spacing, shadows, etc.) from web pages and generate Markdown documents summarizing this information. The generated markdown can be used for documentation or design handoff purposes. The code suggests it supports both "design" and "skill" modes for generating different types of output.

## Tech Stack (from code)
- **JavaScript/mjs:**  The project is primarily written in JavaScript, utilizing `.js` and `.mjs` file extensions. `lib/generate-design-md.mjs` demonstrates the use of ES modules.
- **Chrome Extension API:** The code heavily utilizes the Chrome extension APIs for message passing (`chrome.runtime.onMessage`), storage (`chrome.storage.local`), and downloads (`chrome.downloads`).  This is evident in `service-worker.js`.
- **CSS:** Styling for the popup UI is defined using CSS, as seen in `popup/popup.css`.
- **HTML:** The popup UI is structured with HTML, located at `popup/popup.html`.

## Public API / Exports
Based on the code, it's difficult to definitively determine a public API without access to build configurations or external usage examples. However, we can identify functions and objects used internally that would be part of the extension’s functionality:

- **`extractStylesFromPage()` (content-script.js):**  This function is central to extracting style information from a webpage.
- **`normalizeExtractedStyles(payload)` (lib/normalize.mjs):** Normalizes extracted styles, presumably for consistency and usability.
- **`generateDesignMarkdown(context)` (lib/generate-design-md.mjs):** Generates design markdown output.
- **`generateSkillMarkdown(context)` (lib/generate-skill-md.mjs):** Generates skill markdown output.
- **`validateMarkdownOutput(mode, markdown)` (lib/validate.mjs):** Validates the generated Markdown output.

## Dependencies
The dependencies are not directly visible in the provided code snippets.  However, we can infer some based on imports within `service-worker.js`:

- `normalizeExtractedStyles` from `./lib/normalize.mjs`
- `generateDesignMarkdown` from `./lib/generate-design-md.mjs`
- `generateSkillMarkdown` from `./lib/generate-skill-md.mjs`
- `validateMarkdownOutput` from `./lib/validate.mjs`

A full list of dependencies would require inspecting a package.json file (which is not provided).

## Architecture Patterns
- **Message Passing:** The extension uses Chrome's message passing API for communication between the content script, service worker, and popup. `content-script.js` and `service-worker.js` demonstrate this pattern.
- **Modular Design:**  The code is structured into modules (e.g., `lib/generate-design-md.mjs`, `lib/normalize.mjs`) suggesting a modular design approach.
- **Asynchronous Operations:** The `service-worker.js` file utilizes asynchronous functions (`async`/`await`) for operations like tab querying, injection, and downloads, which is common in Chrome extensions to avoid blocking the main thread.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Design System Extraction:** The core functionality of extracting design information from web pages aligns with a potential need for automated design system documentation or analysis within SEOSONA OS.  The `extractStylesFromPage()` function and related modules would be valuable components.
- **Markdown Generation Pipeline:** The Markdown generation pipeline (extraction -> normalization -> markdown generation -> validation) could serve as a template for creating similar pipelines for other types of content extraction and transformation tasks in SEOSONA OS.
- **Chrome Extension Integration:**  The project demonstrates how to build Chrome extensions, which could be leveraged to integrate with SEOSONA OS's browser-based tools or workflows.

## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `content-script` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `content-script`, `manifest.json`
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 56, 'seosona-ux-ui': 0, 'seosona-flow': 0}
