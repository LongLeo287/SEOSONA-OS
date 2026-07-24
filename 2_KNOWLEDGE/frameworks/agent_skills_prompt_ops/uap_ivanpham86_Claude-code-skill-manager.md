# KI: ivanpham86/Claude-code-skill-manager

## Overview
This project is a GUI application for managing Claude Code skills, likely allowing users to discover, install, and configure these skills. The application appears to interact with a backend process (likely Electron) to handle skill installation and management tasks.  The code demonstrates a focus on user interface elements and data display rather than core skill functionality itself.

## Tech Stack (from code)
- **TypeScript:** Used extensively throughout the `src` directory, as evidenced by files like `App.tsx`, `main.tsx`, and `DiscoverPage.tsx`. The presence of `tsconfig.json` confirms TypeScript usage.
  ```typescript
  // tsconfig.json
  {
    "compilerOptions": {
      ...
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      ...
    }
  }
  ```
- **React:** The application uses React for building the user interface, as demonstrated by import statements like `import React from 'react'` in `main.tsx` and component structure in `App.tsx`.
  ```typescript
  // src/main.tsx
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.tsx'
  import './index.css'

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  ```
- **Vite:** Used as the build tool, as indicated by `vite.config.ts` and references in `package.json`.
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    ...
  })
  ```
- **Electron:** The application is packaged as an Electron app, confirmed by the `electron` directory and build scripts in `package.json`.
  ```json
  // package.json
  "scripts": {
    "dist": "npm run prebuild && vite build && electron-builder",
    ...
  },
  "build": {
    "appId": "com.ivan.claude-skill-manager",
    "productName": "Claude Skill Manager",
    "asar": false,
    "directories": {
      "output": "release"
    },
    ...
  }
  ```

## Public API / Exports
The code does not explicitly define a public API. The `App` component in `src/App.tsx` appears to be the main entry point for the application's UI, and it manages state related to skill discovery and installation. It uses `window.ipcRenderer` which suggests communication with Electron’s main process.

## Dependencies
Based on `package.json`:
- `@octokit/rest`:  Version 19.0.0 - Likely used for interacting with GitHub API (implied by "skill manager").
- `axios`: Version 1.6.0 - For making HTTP requests.
- `electron`: Latest version - The core Electron runtime.
- `electron-is-dev`: Version 3.0.1 - Checks if the app is running in a development environment.
- `fuse.js`: Version 7.0.0 -  Likely used for searching/filtering skills.
- `lucide-react`: Version 0.383.0 - Icon library.
- `react`: Version 18.2.0 - React core library.
- `react-dom`: Version 18.2.0 - React DOM library.
- `simple-git`: Version 3.20.0 - For interacting with Git repositories (likely for skill installation).
- `concurrently`: Version 8.2.0 - Runs multiple commands concurrently.
- `wait-on`: Version 7.2.0 - Waits for a server to start before proceeding.

## Architecture Patterns
- **Component-Based UI:** The application follows a component-based architecture using React, with components like `App`, `DiscoverPage`, `InstalledPage`, and `SettingsPage`.
- **State Management (Local):**  The `App` component manages its own state for active tab, skill lists, loading status, and custom sources. This suggests a relatively simple application without a global state management library.
- **Electron Inter-Process Communication:** The use of `window.ipcRenderer` in `src/App.tsx` indicates communication between the renderer process (UI) and the main Electron process for tasks like installing skills.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing a foundation for managing external tools or plugins within the operating system. The skill management concept is applicable to any scenario where users need to install, configure, and interact with modular components.  The Electron-based architecture allows for cross-platform deployment, which aligns well with SEOSONA's goals of broad compatibility. The use of `simple-git` could be adapted for managing software repositories or updates within the OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
