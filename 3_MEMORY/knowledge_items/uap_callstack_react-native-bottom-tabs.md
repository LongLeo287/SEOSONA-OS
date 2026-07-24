# KI: callstack/react-native-bottom-tabs

## Overview
https://github.com/user-attachments/assets/09e96ac3-827d-4ac0-add0-e7b88ee9197c

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 122 files across 25 directories
- **File types:** .tsx: 32, .jpg: 25, .json: 10, .yml: 9, .md: 8, .png: 8, .js: 5
- **Key dependencies:** @changesets/changelog-github, @changesets/cli
- **Dev dependencies:** @commitlint/config-conventional, commitlint, devmoji, eslint, eslint-config-prettier, eslint-plugin-ft-flow, eslint-plugin-prettier, jest

## Documentation Sections
- Supported Platforms
- Package Versions
- Documentation
- Contributing
- License

## Available Commands
- `npm run lint` -- turbo run lint
- `npm run test` -- turbo run test
- `npm run typecheck` -- turbo run typecheck
- `npm run build` -- turbo run build
- `npm run build:android` -- turbo run build:android
- `npm run build:ios` -- turbo run build:ios
- `npm run build:macos` -- turbo run build:macos
- `npm run version-packages` -- changeset version && yarn install --no-immutable
- `npm run publish-packages` -- turbo run build lint && changeset version && changeset publish

## Core Structure
```
  .editorconfig
  .eslintrc.js
  .gitattributes
  .gitignore
  .nvmrc
  .swiftlint.yml
  .watchmanconfig
  .yarnrc.yml
  AGENTS.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  lefthook.yml
  package.json
  skills-lock.json
  tsconfig.json
  turbo.json
  yarn.lock
  .agents/
    skills/
      agent-device/
        SKILL.md
  .changeset/
    README.md
    calm-icons-preserve.md
    config.json
  .github/
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
    actions/
      setup/
        action.yml
    workflows/
      ci.yml
      deploy-docs.yml
      release.yml
  .yarn/
    releases/
      yarn-4.6.0.cjs
  apps/
    example/
      .gitignore
      .watchmanconfig
      app.json
      babel.config.js
      index.js
      metro.config.js
      package.json
      react-native.config.js
      tsconfig.json
      android/
        build.gradle
        gradle.properties
        gradlew
        gradlew.bat
        settings.gradle
        gradle/
          wrapper/
            gradle-wrapper.jar
            gradle-wrapper.properties
      assets/
        album-art-01.jpg
        album-art-02.jpg
        album-art-03.jpg
        album-art-04.jpg
        album-art-05.jpg
        album-art-06.jpg
        album-art-07.jpg
        album-art-08.jpg
        album-art-09.jpg
        album-art-10.jpg
        album-art-11.jpg
        album-art-12.jpg
        album-art-13.jpg
        album-art-14.jpg
        album-art-15.jpg
        album-art-16.jpg
        album-art-17.jpg
        album-art-18.jpg
        album-art-19.jpg
        album-art-20.jpg
        album-art-21.jpg
        album-art-22.jpg
        album-art-23.jpg
        album-art-24.jpg
        avatar-1.png
        avatar-2.png
        avatar-3.png
        avatar-4.png
        book.jpg
        icons/
          article_dark.png
          book-image.svg
          chat_dark.png
          grid_dark.png
          message-circle-code.svg
          newspaper.svg
          person_dark.png
          user-round-search.svg
          user-round.svg
      ios/
        File.swift
        Podfile
        Podfile.lock
        ReactNativeBottomTabsExample-Bridging-Header.h
      src/
        App.tsx
        Components/
          MusicControl.tsx
        Examples/
          BottomAccessoryView.tsx
          CustomTabBar.tsx
          FiveTabs.tsx
          FourTabs.tsx
          FourTabsRTL.tsx
          JSBottomTabs.tsx
          Labeled.tsx
          LazyTabs.tsx
          Mate
```

## Agent Configuration

--- AGENTS.md ---
# React Native Bottom Tabs

This is a React Native library for Bottom Tabs using native platform primitives (SwiftUI's TabView on iOS and BottomNavigationView on Android).

It can be used as a standalone library or as a drop-in replacement for the bottom tabs in React Navigation / Expo Router.

It is designed to be a drop-in replacement for JavaScript-based bottom tabs.

## agent-device usage

Use agent-device only for app/device automation tasks. Before planning commands, run `agent-device --version` and read `agent-device help workflow`. For exploratory QA, read `agent-device help dogfood`. For logs, network, traces, or runtime failures, read `agent-device help debugging`. For React Native component trees, props/state/hooks, slow renders, or rerenders, read `agent-device help react-devtools`. For React Native apps, overlays, Metro/Fast Refresh blockers, and routing to React DevTools or debugging evidence, read `agent-device help react-native`.

Use the CLI in the integrated terminal. If `agent-device` is not on PATH but the user installed it globally in another shell, resolve the command the same way the user would from a normal terminal session and run that absolute path instead. This may require inspecting shell startup behavior or package-manager/global bin locations; do not assume the agent process `PATH` is the user's `PATH`. Do not silently fall back to `npx -y agent-device@latest`; ask or use an exact version. MCP is only a discovery/help router and does not expose device automation tools. Prefer `open -> snapshot -i -> act -> re-snapshot -> verify -> close`. Use current refs such as `@e3` for exploration and selectors for durable replay. Keep mutating commands against one session serial. Capture screenshots, logs, network, perf, traces, recordings, and `.ad` replay scripts only when they add evidence.


--- CONTRIBUTING.md ---
# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The core library package in the `packages` directory
- React Native example app in `apps/example`

To get started with the project, run `yarn` in the root dire

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
