# KI: callstack/liquid-glass

## Overview
`@callstack/liquid-glass` brings iOS 26 liquid glass effect to React Native apps on iOS.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 64 files across 21 directories
- **File types:** .json: 8, .ts: 7, .yml: 6, .tsx: 6, .js: 5, .md: 4, .lock: 3

## Core Capabilities
- ✨ iOS 26 liquid glass visual effect
- 🎨 Customizable tint colors
- 🔧 Two effect modes: `clear` and `regular`

## Documentation Sections
- Features
- Documentation
- Installation
- or
- Usage
- API
- LiquidGlassView - Props
- LiquidGlassContainerView - Props
- Known issues
- Made with ❤️ at Callstack

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  .nvmrc
  .yarnrc.yml
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  LiquidGlass.podspec
  README.md
  babel.config.js
  eslint.config.mjs
  lefthook.yml
  package.json
  tsconfig.build.json
  tsconfig.json
  turbo.json
  yarn.lock
  .github/
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
    actions/
      setup/
        action.yml
    workflows/
      ci.yml
  .yarn/
    releases/
      yarn-4.15.0.cjs
  example/
    .watchmanconfig
    Gemfile
    Gemfile.lock
    README.md
    app.json
    assets.d.ts
    babel.config.js
    index.js
    metro.config.js
    package.json
    react-native.config.js
    .bundle/
      config
    ios/
      .xcode.env
      Podfile
      Podfile.lock
      LiquidGlassExample/
        AppDelegate.swift
        Info.plist
        LaunchScreen.storyboard
        PrivacyInfo.xcprivacy
        Images.xcassets/
          Contents.json
          AppIcon.appiconset/
            Contents.json
      LiquidGlassExample.xcodeproj/
        project.pbxproj
        xcshareddata/
          xcschemes/
            LiquidGlassExample.xcscheme
      LiquidGlassExample.xcworkspace/
        contents.xcworkspacedata
    src/
      App.tsx
      assets/
        background.jpg
  ios/
    LiquidGlassContainerView.h
    LiquidGlassContainerView.mm
    LiquidGlassContainerView.swift
    LiquidGlassModule.h
    LiquidGlassModule.mm
    LiquidGlassView.h
    LiquidGlassView.mm
    LiquidGlassView.swift
  src/
    LiquidGlassContainerView.ios.tsx
    LiquidGlassContainerView.tsx
    LiquidGlassView.ios.tsx
    LiquidGlassView.tsx
    LiquidGlassViewContainerNativeComponent.ts
    LiquidGlassViewNativeComponent.ts
    NativeLiquidGlassModule.ts
    index.tsx
    isLiquidGlassSupported.ios.ts
    isLiquidGlassSupported.ts
    types.ts
```

## Quick Start
```bash
npm install @callstack/liquid-glass
yarn add @callstack/liquid-glass
To achieve automatic text color adaptation based on the background behind the glass view, use `PlatformColor` from `react-native`:
> [!NOTE]
> There appears to be a size limit for the glass to automatically adapt the text color. If the glass view height is >= 65 it won't automatically adapt to the material behind it.
https://github.com/user-attachments/assets/199bce70-dab4-43bc-9de1-605f561760e5
> [!NOTE]
> On unsupported iOS version (below iOS 26), it will render a normal `View` without any effects.
A boolean constant that indicates whether the current device supports the liquid glass effect.
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the root directory.
- An example app in the `example/` directory.

To get started with the project, make sure you have the correct version of [Node.js](https://nodejs.org/) installed. See the [`.nvmrc`](./.nvmrc) file for the version used in this project.

Run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development without manually migrating.

The [example app](/example/) demonstrates usage of the library. You need to run it to test any changes you make.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild, but native code changes will require a rebuild of the example app.

If you want to use Android Studio or XCode to edit the native code, you can open the `example/android` or `example/ios` directories respectively in those editors. To edit the Objective-C or Swift files, open `example/ios/LiquidGlassExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > @callstack/liquid-glass`.

To edit the Java or Kotlin files, open `example/android` in Android studio and find the source files at `callstack-liquid-glass` under `Android`.

You can use various commands from the root directory to work with the project.

To start the packag


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
