# KI: theexperiencecompany/gaia-ui

## Overview
This repository, `@heygaia/ui`, provides a collection of React UI components specifically designed for building AI assistants and conversational interfaces. The components emphasize accessibility, modern design principles (inspired by Apple's Human Interface Guidelines), and ease of use within the GAIA ecosystem.  The project aims to offer a free and open-source alternative for developers creating chatbot or AI assistant UIs.

## Tech Stack (from code)
- **JavaScript/TypeScript:** The codebase is primarily written in TypeScript (`tsconfig.json` includes `**/*.ts`, `**/*.tsx`).
- **React:**  The project uses React extensively, as evidenced by the numerous `.tsx` files and imports like `<ComponentPreview>` within `mdx-components.tsx`.
- **Next.js:** The presence of `next.config.ts`, `page.tsx`, `app/globals.css`, and configuration in `tsconfig.json` confirms its usage as a Next.js project.
- **Tailwind CSS:**  The use of functions like `cn` (from `lib/utils.ts`) and the presence of Tailwind classes within component code indicate that Tailwind CSS is used for styling.
- **Radix UI:** Numerous imports from `@radix-ui/react-*` packages (`@radix-ui/react-avatar`, `@radix-ui/react-dialog`, etc.) demonstrate Radix UI's central role in the project.
- **MDX:**  The presence of `mdx-components.tsx` and configuration within `next.config.ts` indicates that MDX is used for documentation pages.

## Public API / Exports
Due to the size of the repository, a comprehensive list is impractical. However, based on file structure and imports:
- **Components:** The `components/core/` directory contains numerous components like `code-block.tsx`, `command-menu.tsx`, `component-preview.tsx`, etc., which are likely intended for public use or consumption by other parts of the GAIA ecosystem.
- **Navigation:**  The `lib/navigation.ts` file suggests a publicly accessible navigation system, although its exact API is not immediately clear from the code snippet.
- **Source Code Retrieval:** The `lib/source.ts` file provides a function `getSourceCode` that appears to be used for retrieving source code snippets of components programmatically.

## Dependencies
Based on `package.json`:
- `@fontsource/inter`: Version 5.2.8
- `@heroui/react`: Version 2.8.5
- `@hugeicons/core-free-icons`: Version 2.0.0
- `@hugeicons/react`: Version 1.1.1
- `@mdx-js/loader`: Version 3.1.1
- `@mdx-js/react`: Version 3.1.1
- `@next/mdx`: Version 16.0.1
- ... (many more dependencies, including Radix UI components, @tanstack/react-query, axios, class-variance-authority, framer-motion, etc.)

## Architecture Patterns
- **Component Library:** The project follows a component library architecture, with reusable UI elements organized within the `components/core/` directory.
- **Design System Principles:**  The `DESIGN.md` file and comments in code suggest adherence to design system principles like flat design, accessibility, and consistent styling.
- **MDX Documentation:** The use of MDX for documentation allows for embedding interactive components directly within the documentation pages (`content/docs`).
- **Agent Skills System:** The `.agents/skills/impeccable` directory suggests a system for managing "skills" or plugins related to AI agents, potentially influencing component behavior or functionality.



## Relevance to SEOSONA OS
The GAIA UI library could benefit SEOSONA OS in several ways:

- **Pre-built UI Components:**  SEOSONA OS could leverage the existing React components (especially those focused on conversational interfaces) to accelerate development and reduce custom UI implementation effort.
- **Accessibility Focus:** The project's emphasis on accessibility aligns with SEOSONA OS’s goals of creating inclusive user experiences.
- **Design System Guidance:** The design principles outlined in `DESIGN.md` could inform the visual style and interaction patterns within SEOSONA OS, ensuring a consistent brand identity.
- **MDX Documentation Integration:**  The MDX documentation approach provides a template for documenting SEOSONA OS components effectively, allowing developers to embed interactive examples directly into the documentation.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `seo`, `sitemap`, `robots`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 44, 'seosona-flow': 0}
