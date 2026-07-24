# KI: netease-youdao/LobsterAI

## Overview
LobsterAI is a desktop application, primarily built for agent interaction and workflow management. It appears to be an Electron application with a React frontend, designed to integrate with various external services like DingTalk, Lark, QQBot, Discord, WeCom, and others through OpenClaw. The project emphasizes local file processing, browser previews, and integration with IM channels.

## Tech Stack (from code)
- **TypeScript:**  Widely used throughout the codebase (`tsconfig.json`, `vite.config.ts`).
- **React:** Used for building the user interface (`vite.config.ts` includes `@vitejs/plugin-react`).
- **Electron:** The application framework (`package.json` lists "dist-electron/main.js" as main entry point, and `vite-plugin-electron` is used in `vite.config.ts`).
- **Vite:** Used as the build tool (`vite.config.ts`).
- **Tailwind CSS:**  Used for styling (`tailwind.config.js`, `postcss.config.js`).
- **OpenClaw:** A framework/runtime for agents, heavily integrated into the project (`package.json` lists numerous OpenClaw plugins).

## Public API / Exports
Due to the size of the codebase and lack of clear public API documentation, identifying definitive exported functions or classes is difficult without deeper analysis. However, `vite.config.ts` shows aliases for modules:
```typescript
paths: {
  "@shared/*": ["src/shared/*"],
  "@/*": ["src/renderer/*"]
}
```
This suggests that components and utilities within the `@shared` and `@` directories are intended to be used across different parts of the application.

## Dependencies
Based on `package.json`:
- `"@vitejs/plugin-react"`: React plugin for Vite.
- `"electron"`: Electron framework.
- `"vite-plugin-electron"`:  Vite plugin for Electron development.
- `"vite-plugin-electron-renderer"`: Vite plugin for electron renderer process.
- Numerous OpenClaw plugins (e.g., `@dingtalk-real-ai/dingtalk-connector`, `@larksuite/openclaw-lark`).
- `"katex"`:  A math typesetting library.
- `"better-sqlite3"`: SQLite database driver.

## Architecture Patterns
- **Modular Design:** The use of aliases in `tsconfig.json` (`@shared/*`, `@/*`) suggests a modular architecture, separating shared components from renderer-specific code.
- **Plugin-Based Architecture (OpenClaw):**  The extensive use of OpenClaw plugins indicates a plugin-based architecture for extending agent functionality and integrating with external services. This allows for flexible addition or removal of features without modifying core application logic.
- **Electron + React:** A common pattern for building cross-platform desktop applications with modern UI frameworks.

## Relevance to SEOSONA OS
LobsterAI's codebase demonstrates several aspects potentially beneficial to SEOSONA OS:
- **Agent Framework (OpenClaw):** The OpenClaw framework provides a foundation for building and managing agents, which could be adapted or integrated into SEOSONA OS to provide similar functionality.  The plugin architecture allows for easy extension of agent capabilities.
- **Cross-Platform Desktop Application Development:** The use of Electron and React offers a proven approach for developing cross-platform desktop applications, aligning with potential SEOSONA OS goals.
- **Modular Architecture:** The modular design principles employed in LobsterAI can serve as a model for structuring SEOSONA OS components to promote maintainability and reusability.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
