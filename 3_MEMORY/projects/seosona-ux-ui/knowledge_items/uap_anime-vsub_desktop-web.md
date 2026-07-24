# KI: anime-vsub/desktop-web

## Overview
This project appears to be a desktop web application for watching anime, offering features like subtitle support and potentially offline viewing capabilities.  The codebase includes components for managing user accounts, displaying episode lists, and playing video content. It leverages Firebase for authentication and data storage, along with Supabase as an alternative database solution.

## Tech Stack (from code)
- **TypeScript:** The primary language used throughout the project, evidenced by numerous `.ts` files (169).  The `tsconfig.json` file confirms TypeScript configuration: `"compilerOptions": { "types": ["typescript"] }`.
- **Vue.js:** Used for building the user interface, as demonstrated by the presence of `.vue` components (73) and Vue Router usage in `src/vue-router.d.ts`.
- **Quasar Framework:**  Used to accelerate development with prebuilt components and tooling, confirmed by the `quasar.config.ts` file and imports like `import MainLayout from "layouts/MainLayout.vue"`.
- **Vite:** The build system used for bundling assets, as indicated by the `vite.config.ts` file.
- **Firebase:** Used for authentication and potentially data storage, evidenced by Firebase configuration in `firebase.json` and imports like `@firebase/app`, `@firebase/firestore`.
- **Supabase:**  An alternative database solution, referenced in `database.d.ts` and imported as `@supabase/supabase-js`.

## Public API / Exports
Due to the nature of this project (likely a full application), it's difficult to definitively list "public" APIs without more context. However, based on imports and file structure, some potential exports include:

- **Components:**  Vue components within `src/components` (not listed in directory structure but likely exists).
- **Constants:** Values defined in `src/constants.ts`, such as quality labels (`labelToQuality`) and server configurations (`servers`).
- **Functions:** Functions within modules like `vn-remove-accents.d.ts`.

## Dependencies
Based on the `package.json` file, key dependencies include:

- `@ffmpeg/core`: For video processing.
- `@firebase/analytics`, `@firebase/app`, `@firebase/firestore`: Firebase SDKs.
- `@quasar/extras`: Quasar framework extensions.
- `@supabase/supabase-js`: Supabase client library.
- `dayjs`: Date and time manipulation.
- `hls-parser`, `hls-to-mp4-browser`: For handling HLS streams.
- `pinia`: State management library.
- `vue-router`: Routing for the application.

## Architecture Patterns
- **Component-Based Architecture:** The use of Vue components suggests a component-based architecture, breaking down the UI into reusable pieces.
- **Modular Design:**  The project is structured with multiple directories (`src/`, `scripts/`, `firebase/`), indicating a modular design approach.
- **Configuration-Driven:**  Settings and configurations are managed through files like `quasar.config.ts`, `tsconfig.json`, and Firebase configuration files, promoting maintainability.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Video Streaming Capabilities:** The HLS parsing and conversion logic (`hls-parser`, `hls-to-mp4-browser`) could be integrated into SEOSONA OS for improved video playback support.
- **Firebase/Supabase Integration:**  The experience with Firebase and Supabase integration can inform how SEOSONA OS handles authentication, data storage, and real-time updates.
- **Internationalization (i18n):** The presence of i18n related files (`virtual:i18n-langs`) demonstrates a focus on localization, which is valuable for SEOSONA OS's global user base.  The `iso-639-1` dependency suggests robust language support.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `.vue`, `component`
- **All scores:** {'seosona-os': 41, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 66, 'seosona-flow': 0}
