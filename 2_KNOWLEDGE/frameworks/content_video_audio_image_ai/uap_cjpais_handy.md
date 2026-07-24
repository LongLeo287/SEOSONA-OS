# KI: cjpais/handy

## Overview
Handy is a cross-platform desktop speech-to-text application built using Tauri, Rust, and React/TypeScript. The codebase includes components for settings management, accessibility permissions handling, and model selection, suggesting a focus on user customization and integration with system features.  The project aims to provide a customizable transcription experience with support for various audio devices and models.

## Tech Stack (from code)
- **Languages:** TypeScript (`src/App.tsx`, `tsconfig.json`), Rust (implied by Tauri usage, `.cargo/config.toml`)
- **Frameworks/Libraries:** React (`src/App.tsx`), Tauri (`package.json` dependencies), i18next (`src/App.tsx`), Zustand (`src/stores/settingsStore.ts`), Tailwind CSS (`package.json`, `src/App.css`)
- **Build System:** Vite (`vite.config.ts`, `package.json` scripts), Bun (`package.json` scripts, `bun.lock`)

## Public API / Exports
Due to the nature of this project (a desktop application with a frontend and backend interacting via Tauri commands), directly exposed public APIs are limited in the analyzed code snippets. However, the `src/bindings.ts` file defines functions that appear to be intended for communication between the Rust backend and the TypeScript frontend:

```typescript
// src/bindings.ts
export const commands = {
async changeBinding(id: string, binding: string) : Promise<Result<BindingResponse, string>> { ... },
async resetBinding(id: string) : Promise<Result<BindingResponse, string>> { ... },
// ... other functions
}
```

## Dependencies
Based on `package.json`:

- `@tailwindcss/vite`: "^4.1.16"
- `@tauri-apps/api`: "^2.10.0"
- `@tauri-apps/plugin-*`: Various versions (autostart, clipboard-manager, dialog, fs, global-shortcut, opener, os, process, sql, store, updater)
- `i18next`: "^25.7.2"
- `immer`: "^11.1.3"
- `lucide-react`: "^0.542.0"
- `react`: "^18.3.1"
- `react-dom`: "^18.3.1"
- `react-i18next`: "^16.4.1"
- `react-markdown`: "^10.1.0"
- `react-select`: "^5.8.0"
- `remark-gfm`: "^4.0.1"
- `sonner`: "^2.0.7"
- `tauri-plugin-macos-permissions-api`: "2.3.0"
- `zod`: "^3.25.76"
- `zustand`: "^5.0.8"

## Architecture Patterns
- **Component-Based Frontend:** The React frontend heavily utilizes components, as evidenced by the directory structure (`src/components`) and code within files like `App.tsx` and various component files (e.g., `Sidebar.tsx`, `ModelSelector.tsx`).
- **Tauri Integration:**  The application is tightly integrated with Tauri for cross-platform desktop development, utilizing Tauri plugins for functionalities such as autostart, clipboard management, and OS interaction. This is evident from the numerous `@tauri-apps/plugin-*` dependencies and calls to `TAURI_INVOKE` in `src/bindings.ts`.
- **Settings Management:** A significant portion of the codebase focuses on settings configuration (e.g., `settings/`, `useSettings` hook), suggesting a customizable user experience.
- **Modular Design:** The backend appears to follow a modular design with managers for audio, models, and transcription (`src-tauri/managers`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Cross-Platform Desktop Application Framework:**  The Tauri integration demonstrates a robust approach to building cross-platform desktop applications. SEOSONA OS could leverage similar techniques for its own desktop components.
- **Accessibility Features:** The explicit handling of accessibility permissions and the `AccessibilityPermissions` component suggest a focus on inclusivity, which aligns with potential goals for SEOSONA OS.
- **Customizable Settings:**  The extensive settings management system provides a blueprint for creating a user-configurable environment within SEOSONA OS.
- **Audio Processing Techniques:** The audio processing components (e.g., voice activity detection) could be adapted or integrated into SEOSONA OS's audio handling capabilities.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
