# KI: bsquang/naotab

## Overview
`naotab` is a Chrome extension designed as a personal knowledge base for browser tabs, storing data locally within the extension using `chrome.storage.local`. It allows users to save tab information (title, URL, reason, AI-generated summaries and tags) and export this data in JSON or Obsidian Markdown format. The project utilizes an architecture that separates concerns into modules like AI interaction (`ai.js`), data storage (`storage.js`), and export functionality (`export.js`).

## Tech Stack (from code)
- **JavaScript:**  The primary language for the extension's logic, evident throughout all `.js` files (e.g., `app.js`, `core/ai.js`, `popup.js`).
- **HTML & CSS:** Used for UI elements within the popup and main application pages (`popup.html`, `popup.css`, `settings.html`, `settings.css`).
- **D3.js (v7.9.0):** Bundled locally for data visualization, as indicated in `build.sh` ("D3.js v7.9.0 — bundled locally (CSP compliance)") and referenced in the `vendor/d3.min.js` file.
- **JSZip (v3.10.1):** Used for exporting bookmarks to zip files, also bundled locally (`build.sh`).
- **Build System:** A shell script (`build.sh`) is used to package the extension into a distributable `.zip` file.

## Public API / Exports
The code demonstrates several exported functions and objects:

- `callAI(title, url, pageContent)` (from `core/ai.js`):  Handles calls to AI providers for tag generation and summarization.
- `exportJSON()` (from `core/export.js`): Returns a JSON string representation of the bookmarks.
- `importJSON(jsonString)` (from `core/export.js`): Imports bookmarks from a JSON string.
- `bookmarkToObsidianMd(bookmark)` (from `core/export.js`): Converts a bookmark to an Obsidian Markdown format.
- `getBookmarks()` (from `core/storage.js`): Retrieves all bookmarks.
- `saveBookmark(fields)` (from `core/storage.js`): Saves a new bookmark.
- `updateBookmark(id, changes)` (from `core/storage.js`): Updates an existing bookmark.
- `deleteBookmark(id)` (from `core/storage.js`): Deletes a bookmark.
- `getSettings()` (from `core/storage.js`): Retrieves the extension's settings.
- `saveSettings(settings)` (from `core/storage.js`): Saves the extension’s settings.

## Dependencies
Based on the code, dependencies include:

- **D3.js:** For data visualization.  Bundled locally in `vendor/d3.min.js`.
- **JSZip:** For creating zip archives during export. Bundled locally in `vendor/jszip.min.js`.
- **Chrome Storage API:** The extension heavily relies on the Chrome storage API (`chrome.storage.local`) for persisting data, as seen throughout `core/storage.js`.

## Architecture Patterns
- **Modular Design:**  The codebase is organized into modules (e.g., `core/ai.js`, `core/export.js`, `core/storage.js`), each responsible for a specific set of functionalities. This promotes code reusability and maintainability.
- **Single Source of Truth:** The `schema.js` file defines the canonical bookmark data structure, acting as a single source of truth to ensure consistency across the application.  The comments explicitly state "⚠️ Single source of truth for data structure — never remove fields."
- **Configuration-Driven:** AI provider integration is driven by configuration settings (e.g., `aiBaseUrl`, `aiApiKey`), allowing users to easily switch between different AI services. This is evident in the `settings.js` file and the `callAI()` function in `core/ai.js`.
- **Data Migration:** The `migrateBookmark()` function in `schema.js` handles data migration when the bookmark schema changes, ensuring backward compatibility with older data formats.



## Relevance to SEOSONA OS
The `naotab` project's code could benefit SEOSONA OS in several ways:

- **Local Data Storage:** The extension’s reliance on `chrome.storage.local` demonstrates a pattern for local data persistence that could be adapted for SEOSONA OS applications needing offline functionality.
- **Modular Architecture:**  The modular design principles used in `naotab` can serve as an example for structuring SEOSONA OS components, promoting maintainability and reusability.
- **Configuration Management:** The configuration-driven approach to AI integration could be applied to other features within SEOSONA OS that require flexible customization options.
- **Data Export/Import Utilities:**  The `export.js` module's functionality for exporting data in various formats (JSON, Markdown) could be leveraged to create similar utilities for SEOSONA OS applications needing data exchange capabilities.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `content-script` · **Fit:** 28/100 · **Auto-apply:** True
- **Evidence:** `manifest.json`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 0}
