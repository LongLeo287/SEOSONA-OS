# KI: WW-AI-Lab/openclaw-office

## Overview
This repository contains the frontend codebase for OpenClaw Office, a visual monitoring and management interface for the OpenClaw Multi-Agent system. It allows users to visualize agent collaboration in a digital office environment and provides a console for managing various aspects of the system. The application connects to an OpenClaw Gateway via WebSocket to retrieve real-time data and control agents.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **UI Framework:** React (`package.json`: `"dependencies": {"react": "^19.1.0", ...}`)
- **Build Tool:** Vite (`package.json`: `"devDependencies": {"vite": "^6.3.0", ...}`)
- **State Management:** Zustand (`package.json`: `"dependencies": {"zustand": "^5.0.0", ...}`)
- **Styling:** Tailwind CSS (`package.json`: `"devDependencies": {"tailwindcss": "^4.1.0", ...}`)

## Public API / Exports
Based on the `src/app.tsx` file and other import statements, here are some key exported components and functions:

*   `AppShell` (from "@/components/layout/AppShell") - A layout component for the application.
*   `AuthGate` (from "@/components/auth/AuthGate") - An authentication gateway component.
*   `ConsoleLayout` (from "@/components/layout/ConsoleLayout") - Layout for the console pages.
*   `FloorPlan` (from "@/components/office-2d/FloorPlan") - Component to render the office floor plan.
*   `AgentsPage`, `ChannelsPage`, `CronPage`, `DashboardPage`, `ChatPage`, `SettingsPage`, `SkillsPage` (from various pages) - Components for different console sections.
*   `SkillWorkbenchLayout`, `SkillWorkbenchHomePage`, `SkillWorkbenchCreatePage`, `SkillWorkbenchDetailPage` (from skill workbench layout) - Components related to the Skill Workbench.
*   `ChatWorkspaceBootstrap` (from "@/components/chat/ChatWorkspaceBootstrap") - Component responsible for bootstrapping the chat workspace.
*   `useGatewayConnection` (from "@/hooks/useGatewayConnection") - A custom hook for managing the connection to the Gateway.
*   `useResponsive` (from "@/hooks/useResponsive") - A custom hook for responsive design.
*   `useAuthStore` (from "@/store/auth-store") - A store related to authentication.
*   `useOfficeStore` (from "@/store/office-store") - A store related to office settings and data.

## Dependencies
Based on `package.json`:

*   `react`, `react-dom`, `react-router-dom`, `recharts`, `zustand`, `i18next`, `i18next-browser-languagedetector`, `immer`, `js-yaml`, `lucide-react`, `mermaid`, `remark-gfm` and many more.
*   Development dependencies include: `@testing-library/jest-dom`, `@testing-library/react`, `vitest`.

## Architecture Patterns
*   **Component-Based Architecture:** The application is built using React components, promoting reusability and modularity.
*   **Hook-Based State Management:** Zustand is used for state management, likely with custom hooks to encapsulate logic and provide a clean API.
*   **Modular Routing:**  React Router v7 is employed for navigation between different sections of the application.
*   **Configuration-Driven UI:** The use of A2UI schemas (`src/lib/a2ui-schema.ts`) suggests that parts of the user interface are dynamically generated based on configuration data, enabling flexibility and customization.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Visualization Framework:** The office visualization component (`src/components/office-2d/FloorPlan`) demonstrates a robust approach to rendering complex 2D scenes, which could be adapted for visualizing other system states within SEOSONA.
*   **Agent Management UI Patterns:**  The console pages and agent management components provide valuable patterns for building user interfaces that interact with and control autonomous agents. The use of A2UI schemas can also inform the design of flexible configuration panels.
*   **Real-time Data Integration:** The application's connection to a WebSocket gateway demonstrates how to integrate real-time data streams into a UI, which is crucial for SEOSONA’s monitoring capabilities.
*   **Internationalization (i18n):**  The use of `i18next` provides a solid foundation for building localized user interfaces, essential for SEOSONA's global reach.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 28, 'seosona-flow': 28}
