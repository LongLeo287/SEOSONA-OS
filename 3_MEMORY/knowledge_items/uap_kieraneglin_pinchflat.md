# KI: kieraneglin/pinchflat

## Overview
Based on the source code, `pinchflat` appears to be a self-hosted application for managing and organizing media files, particularly podcasts and YouTube videos. It includes features like downloading, metadata extraction, indexing, and potentially serving content via RSS feeds. The project utilizes Elixir and Phoenix for its backend development.

## Tech Stack (from code)
- **Elixir:**  The primary language is Elixir, evidenced by the numerous `.ex` and `.exs` files throughout the `lib/` directory (e.g., `lib/pinchflat.ex`, `lib/pinchflat_web.ex`).
- **Phoenix Framework:** The project uses the Phoenix framework for web development, as indicated by the presence of `mix.exs` which includes dependencies on phoenix and related packages.  The file `lib/pinchflat_web.ex` further confirms this.
- **Mix Build System:** Elixir's Mix build tool is used for dependency management and compilation (e.g., `mix.exs`).
- **JavaScript:** JavaScript is utilized for frontend functionality, as evidenced by the `assets/js/` directory containing files like `alpine_helpers.js` and `app.js`, along with a `package.json` file in the assets directory.
- **Tailwind CSS:** The project uses Tailwind CSS for styling, confirmed by the presence of `tailwind.config.js` and related CSS files (`assets/css/app.css`, `assets/css/satoshi.css`).

## Public API / Exports
Due to the large number of source code files, a comprehensive list is impractical. However, based on file names and directory structure, some likely exported modules include:

- `lib/pinchflat.ex`:  Likely contains core application logic.
- `lib/pinchflat_web.ex`: Contains web framework related functionality.
- Modules within the `lib/pinchflat/` namespace (e.g., `application.ex`, `repo.ex`).
- Modules within `lib/pinchflat/downloading/` for media downloading tasks.

## Dependencies
Based on `package.json` and `mix.exs`:

- **JavaScript:**
    - `prettier`: Version 3.2.4 (for code formatting)
    - `sqleton`: Version ^2.2.0 (likely used for generating Entity Relationship Diagrams - ERDs).
- **Elixir/Mix:**  (Partial list, as `mix.exs` is not fully displayed here)
    - Phoenix Framework
    - ecto_sqlx

## Architecture Patterns
- **Modular Design:** The codebase exhibits a modular design with numerous directories and modules dedicated to specific functionalities (e.g., downloading, indexing, metadata handling).
- **Worker Processes:**  The use of `*_worker.ex` files suggests the application utilizes Elixir's actor model for asynchronous task processing (e.g., `media_download_worker.ex`, `source_metadata_storage_worker.ex`).
- **Behavior-Driven Development (BDD):** The presence of `Behaviour.ex` files (e.g., `youtube_behaviour.ex`, `http_behaviour.ex`) indicates the use of Elixir's behavior abstraction for defining common interfaces and functionalities across different modules.

## Relevance to SEOSONA OS
- **Media Management:** Pinchflat’s media downloading, indexing, and metadata extraction capabilities could be integrated into SEOSONA OS to enhance its media management features.  The modular design allows for selective integration of specific components.
- **Asynchronous Task Processing:** The worker process architecture used in Pinchflat aligns well with the asynchronous nature of many SEOSONA OS tasks, potentially providing a robust foundation for implementing background jobs.
- **RSS Feed Generation:** The podcast and RSS feed generation capabilities could be leveraged to provide content aggregation or distribution features within SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `seo-metadata` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `metadata`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
