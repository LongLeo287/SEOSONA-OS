# KI: pickle-com/glass

## Overview
> This project is a fork of [CheatingDaddy](https://github.com/sohzm/cheating-daddy) with modifications and enhancements. Thanks to [Soham](https://x.com/soham_btw) and all the open-source contributors who made this possible!

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Anthropic SDK, Express.js, OpenAI SDK
- **Total files:** 113 files across 36 directories
- **File types:** .js: 37, .svg: 15, .tsx: 14, .json: 10, .md: 8, .png: 6, .ts: 5
- **Key dependencies:** @anthropic-ai/sdk, @deepgram/sdk, @google/genai, @google/generative-ai, axios, better-sqlite3, cors, dotenv, electron-squirrel-startup, electron-store, electron-updater, express
- **Dev dependencies:** @electron/fuses, @electron/notarize, electron, electron-builder, electron-reloader, esbuild, prettier
- **Keywords:** glass, pickle glass, ai assistant, real-time, live summary, contextual ai

## Core Capabilities
### Ask: get answers based on all your previous screen actions & audio

<img width="100%" alt="booking-screen" src="./public/assets/00.gif">

### Meetings: real-time meeting notes, live summaries, session records

<img width="100%" alt="booking-screen" src="./public/assets/01.gif">

### Use your own API key, or sign up to use ours (free)

<img width="100%" alt="booking-screen" src="./public/assets/02.gif">

**Currently Supporting:**
- OpenAI API: Get OpenAI API Key [here](https://platform.openai.com/api-keys)
- Gemini API: Get Gemini API Key [here](https://aistudio.google.com/apikey)
- Local LLM Ollama & Whisper

### Liquid Glass Design (coming soon)

<img width="100%" alt="booking-screen" src="./public/assets/03.gif">

<p>
  for a more detailed guide, please refer to this <a href="https://www.youtube.com/watch?v=qHg3_4bU1Dw">video.</a>
  <i style="color:gray; font-weight:300;">
    we don't waste money on fancy vids; we just code.
  </i>
</p>

## Documentation Sections
- Instant Launch
- Quick Start (Local Build)
- Prerequisites
- Check your Node.js version
- If you need to install Node.js 20.x.x, we recommend using nvm:
- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
- nvm install 20
- nvm use 20
- Installation
- Highlights
- Ask: get answers based on all your previous screen actions & audio
- Meetings: real-time meeting notes, live summaries, session records
- Use your own API key, or sign up to use ours (free)
- Liquid Glass Design (coming soon)
- Keyboard Shortcuts
- Repo Activity
- Contributing
- Contributors
- Help Wanted Issues
- 🛠 Current Issues & Improvements
- Changelog
- About Pickle
- Star History

## Available Commands
- `npm run setup` -- npm install && cd pickleglass_web && npm install && npm run build && cd .. && np
- `npm run start` -- npm run build:renderer && electron .
- `npm run package` -- npm run build:all && electron-builder --dir
- `npm run make` -- npm run build:renderer && electron-forge make
- `npm run build` -- npm run build:all && electron-builder --config electron-builder.yml --publish ne
- `npm run build:win` -- npm run build:all && electron-builder --win --x64 --publish never
- `npm run publish` -- npm run build:all && electron-builder --config electron-builder.yml --publish al
- `npm run lint` -- eslint --ext .ts,.tsx,.js .
- `npm run postinstall` -- electron-builder install-app-deps
- `npm run build:renderer` -- node build.js
- `npm run build:web` -- cd pickleglass_web && npm run build && cd ..
- `npm run build:all` -- npm run build:renderer && npm run build:web

## Core Structure
```
  .firebaserc
  .gitignore
  .gitmodules
  .npmrc
  .prettierignore
  .prettierrc
  CONTRIBUTING.md
  LICENSE
  README.md
  build.js
  electron-builder.yml
  entitlements.plist
  firebase.json
  firestore.indexes.json
  notarize.js
  package-lock.json
  package.json
  preload.js
  .github/
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      assign-on-comment.yml
      build.yml
  .vscode/
    settings.json
  aec/
  docs/
    DESIGN_PATTERNS.md
    refactor-plan.md
  functions/
    .eslintrc.js
    .gitignore
    index.js
    package-lock.json
    package.json
  pickleglass_web/
    next-env.d.ts
    next.config.js
    package-lock.json
    package.json
    postcss.config.js
    requirements.txt
    tailwind.config.js
    tsconfig.json
    app/
      globals.css
      layout.tsx
      page.tsx
      activity/
        page.tsx
        details/
          page.tsx
      download/
        page.tsx
      help/
        page.tsx
      login/
        page.tsx
      personalize/
        page.tsx
      settings/
        page.tsx
        billing/
          page.tsx
        privacy/
          page.tsx
    backend_node/
      index.js
      ipcBridge.js
      middleware/
        auth.js
      routes/
        auth.js
        conversations.js
        presets.js
        user.js
    components/
      ClientLayout.tsx
      SearchPopup.tsx
      Sidebar.tsx
    public/
      README.md
      activity.svg
      book.svg
      credit-card.svg
      download.svg
      linkout.svg
      privacy.svg
      search.svg
      setting.svg
      symbol.svg
      unfold.svg
      user.svg
      word.svg
    utils/
      api.ts
      auth.ts
      firebase.ts
      firestore.ts
  public/
    assets/
      00.gif
      01.gif
      02.gif
      03.gif
      banner.gif
      banner.png
      button_dc.png
      button_we.png
      button_xe.png
      dompurify-3.0.7.min.js
      icon-listen.svg
      product_shot.png
      star-history-202574.png
      streamline_incognito-mode-remix.svg
      tabler_dots.svg
  src/
    index.js
    preload.js
    bridge/
      featureBridge.js
      internalBridge.js
      windowBridge.js
    features/
      ask/
        askService.js
        repositories/
          firebase.repository.js
          index.js
          sqlite.repository.js
      common/
        ai/
          factory.js
          providers/
            anthropic.js
            deepgram.js
            gemini.js
            ollama.j
```

## Quick Start
```bash
node --version
npm run setup
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Glass

Thank you for considering contributing to **Glass by Pickle**! Contributions make the open-source community vibrant, innovative, and collaborative. We appreciate every contribution you make—big or small.

This document guides you through the entire contribution process, from finding an issue to getting your pull request merged.

---

## 🚀 Contribution Workflow

To ensure a smooth and effective workflow, all contributions must go through the following process. Please follow these steps carefully.

### 1. Find or Create an Issue

All work begins with an issue. This is the central place to discuss new ideas and track progress.

-   Browse our existing [**Issues**](https://github.com/pickle-com/glass/issues) to find something you'd like to work on. We recommend looking for issues labeled `good first issue` if you're new!
-   If you have a new idea or find a bug that hasn't been reported, please **create a new issue** using our templates.

### 2. Claim the Issue

To avoid duplicate work, you must claim an issue before you start coding.

-   On the issue you want to work on, leave a comment with the command:
    ```
    /assign
    ```
-   Our GitHub bot will automatically assign the issue to you. Once your profile appears in the **`Assignees`** section on the right, you are ready to start development.

### 3. Fork & Create a Branch

Now it's time to set up your local environment.

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** your forked repository to your local machine.
3.  **Create a new branch** from `main`. A clear branch name is recommended.
    -   For new features: `feat/short-description` (e.g., `feat/user-login-ui`)
    -   For bug fixes: `fix/short-description` (e.g., `fix/header-rendering-bug`)

### 4. Develop

Write your code! As you work, please adhere to our quality standards.

-   **Code Style & Quality**: Our project uses `Prettier` and `ESLint` to maintain a consistent code style.
-   **Architecture & Desi


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
