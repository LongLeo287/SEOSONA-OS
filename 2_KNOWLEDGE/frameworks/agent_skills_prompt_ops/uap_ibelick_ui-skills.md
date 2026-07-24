# KI: ibelick/ui-skills

## Overview
This repository appears to be a collection of UI skills, likely intended for use in agent-based systems or development workflows. The codebase includes components, data files defining skills and agents, and scripts for managing the project's assets and installation process.  The site provides information about UI skills with links to external resources.

## Tech Stack (from code)
- **TypeScript:** The `tsconfig.json` file specifies TypeScript compilation options (`"extends": "astro/tsconfigs/strict"`).
```
// File: tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  ...
}
```
- **Astro:** The project utilizes Astro for building the website, as evidenced by the `astro.config.mjs` file and the `"@astrojs/*"` dependencies in `package.json`.
```
// File: package.json
{
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.13",
    "@astrojs/react": "^4.4.2",
    "astro": "^5.16.7"
  },
  ...
}
```
- **React:** The project uses React components, as indicated by the presence of `.tsx` files and the `@types/react`, `react`, and `react-dom` dependencies in `package.json`.
```
// File: package.json
{
  "dependencies": {
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  ...
}
```
- **Tailwind CSS:** The project uses Tailwind CSS for styling, as shown by the `@tailwindcss/vite` and `tailwindcss` dependencies in `package.json`.
```
// File: package.json
{
  "dependencies": {
    "@astrojs/react": "^4.4.2",
    "@tailwindcss/vite": "^4.1.18",
    "tailwindcss": "^4.1.18"
  },
  ...
}
```

## Public API / Exports
- **`formatStarCount(count: number)`:** This function, exported from `src/lib/format-stars.ts`, formats a star count for display (e.g., 1234 becomes "1.2k+").
```typescript
// File: src/lib\format-stars.ts
export const formatStarCount = (count: number) => { ... };
```
- **`getGithubStars()`:** This asynchronous function, exported from `src/lib/github-stars.ts`, fetches GitHub star count data for the repository and caches it.
```typescript
// File: src/lib\github-stars.ts
export const getGithubStars = async (): Promise<GithubStars | null> => { ... };
```

## Dependencies
Based on `package.json`:
- `@astrojs/cloudflare`
- `@astrojs/react`
- `@base-ui/react`
- `@fontsource/fira-mono`
- `@fontsource/jetbrains-mono`
- `@tailwindcss/vite`
- `@tailwindcss/typography`
- `@types/marked`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `astro`
- `marked`
- `motion`
- `react`
- `react-dom`
- `tailwindcss`
- `tsx`
- Prettier and related plugins for code formatting.

## Architecture Patterns
- **Component-Based UI:** The use of React components (`.tsx` files in the `ui/` directory) indicates a component-based architecture for building the user interface.
- **Data-Driven Design:**  The presence of data files (e.g., `skills.ts`, `agents.ts`) suggests that the application's content and behavior are driven by data.
- **Caching Strategy:** The `getGithubStars` function demonstrates a caching strategy to reduce API calls and improve performance.

## Relevance to SEOSONA OS
- **UI Skill Integration:**  The project’s focus on UI skills could be directly integrated into SEOSONA OS to provide agents with pre-built, reusable UI components or templates for various tasks. This would accelerate the development of agent interfaces.
- **Data Management Patterns:** The data management patterns used (e.g., `skills.ts`, `agents.ts`) can inform how SEOSONA OS structures and manages its own skill definitions and related metadata.
- **Caching Optimization:**  The caching strategy implemented in `getGithubStars` provides a model for optimizing API calls within SEOSONA OS, especially when dealing with external data sources.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
