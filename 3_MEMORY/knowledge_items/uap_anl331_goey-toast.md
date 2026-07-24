# KI: anl331/goey-toast

## Overview
This repository contains a React component library called "goey-toast" that provides animated toast notifications built on top of the Sonner library and Framer Motion animations. The project aims to offer visually appealing and customizable toast messages with morphing effects, while also incorporating accessibility features like ARIA live announcements. It includes a CLI tool for generating toast configurations.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework:** React (`package.json`: `dependencies: {"react": "^19.2.4", "react-dom": "^19.2.4"}`)
- **Build System:** tsup (`tsup.config.ts`, `package.json`: `"scripts": { "build": "tsup" }`)
- **Animation Library**: Framer Motion (`package.json`: `peerDependencies: {"framer-motion": ">=10.0.0"}`)
- **Notification Library:** Sonner (`package.json`: `dependencies: {"sonner": "^2.0.7"}`)
- **Testing Framework:** Vitest (`vitest.config.ts`, `package.json`: `"scripts": { "test": "vitest run" }`)

## Public API / Exports
Based on the contents of `src/index.ts`, the following are exported:

- `GooeyToaster` (React component)
- `gooeyToast` (function, likely for creating toast instances)
- `animationPresets` (object containing animation configurations)
- Types related to toast options and styling (`GooeyToastOptions`, `GooeyToasterProps`, etc.)

## Dependencies
Based on the contents of `package.json`:

- **Peer Dependencies:**  `framer-motion`, `react`, `react-dom`
- **Dependencies:** `sonner`
- **Dev Dependencies:** `@testing-library/jest-dom`, `@testing-library/react`, `@types/node`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `framer-motion`, `jsdom`, `react`, `react-dom`, `tsup`, `typescript`, `vitest`

## Architecture Patterns
- **Context API for Global State:** The project uses a context (`src/context.ts`) to manage global settings like theme, position, and visibility options for the toast notifications. This allows components to access and modify these settings without prop drilling.
- **Component Composition:**  The `GooeyToast` component is composed of smaller components like `AriaLiveAnnouncer`, `GooeyToaster`, `ToastErrorBoundary`, and icons (`src/components`).
- **CSS Modules:** CSS modules are used for styling, as indicated by the `.module.css` file extensions and the `css-modules.d.ts` declaration file.

## Relevance to SEOSONA OS
The "goey-toast" library could be integrated into SEOSONA OS to provide a consistent and visually appealing notification system.  Specifically:

- **Customizable Notifications:** The extensive customization options (themes, animations, styling) allow for seamless integration with the OS's design language.
- **Accessibility Features:** The ARIA live announcements (`src/components/AriaLiveAnnouncer.tsx`) ensure that notifications are accessible to users with assistive technologies.
- **Animation Library Integration**:  The use of Framer Motion could be leveraged to create engaging and dynamic UI elements within SEOSONA OS beyond just toast notifications.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 66, 'seosona-flow': 0}
