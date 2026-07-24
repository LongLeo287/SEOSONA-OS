# KI: siddharthvaddem/openscreen

## Overview
If you don't want to pay $29/month for Screen Studio but want a version that does what most people seem to need - quick, polished product demos and walkthroughs you'd post on X, Reddit or Youtube. OpenScreen does not offer every Screen Studio feature, but covers a lot of the core functionality.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 112 files across 35 directories
- **File types:** .ts: 27, .png: 23, .md: 10, .cpp: 9, .yml: 7, .h: 7, .json: 6

## Core Capabilities
- Record a specific window, or your whole screen.
- Record microphone and system audio.
- Webcam overlay with picture-in-picture, drag-to-position, mirroring, and shape options.
- Auto or manual zooms with adjustable depth, duration, easing, and pixel-precise position; auto-zoom follows your cursor as you work.
- Custom cursor size, smoothing, and click effects, with cursor themes and post-recording path smoothing.
- Automatic captions for voiceovers, generated on-device with no upload (works offline).
- Wallpapers, solid colors, gradients, or your own background image.
- Motion blur.
- Crop, trim, and per-segment speed control on the timeline.
- Text, arrow, and image annotations, with text animation presets.
- Timeline snapping guides and an audio waveform to make trimming easier.
- Customizable keyboard shortcuts.
- Export to MP4 or GIF in multiple aspect ratios and resolutions.
- Languages supported: Arabic, English, Spanish, French, Italian, Japanese, Korean, Portuguese (Brazil), Russian, Turkish, Vietnamese, Simplified Chinese, and Traditional Chinese.

## Documentation Sections
- <p align="center">OpenScreen</p>
- Core Features
- Installation
- macOS
- Windows
- Linux
- Platform differences
- License

## Core Structure
```
  .editorconfig
  .env.example
  .envrc
  .gitignore
  .nvmrc
  CONTRIBUTING.md
  LICENSE
  README.md
  biome.json
  components.json
  electron-builder.json5
  flake.lock
  flake.nix
  index.html
  macos.entitlements
  package-lock.json
  package.json
  playwright.config.ts
  postcss.config.cjs
  tailwind.config.cjs
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  vitest.browser.config.ts
  vitest.config.ts
  .github/
    CODEOWNERS
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      feature_request.yml
    workflows/
      build.yml
      bump-nix-package.yml
      ci.yml
      discord.yaml
      publish-winget.yml
      update-homebrew-cask.yml
  .husky/
    pre-commit
  docs/
    architecture/
      native-bridge.md
    engineering/
      macos-native-recorder-roadmap.md
      windows-native-recorder-roadmap.md
    testing/
      macos-native-cursor.md
      windows-native-cursor.md
    tests/
      writing-tests.md
  electron/
    electron-env.d.ts
    globalShortcut.ts
    i18n.ts
    main.ts
    preload.ts
    windows.ts
    ipc/
      handlers.ts
      nativeBridge.ts
      recordingStream.test.ts
      recordingStream.ts
    native/
      README.md
      screencapturekit/
        Package.swift
        Sources/
          OpenScreenMacOSCursorHelper/
            main.swift
          OpenScreenScreenCaptureKitHelper/
            main.swift
      wgc-capture/
        CMakeLists.txt
        src/
          audio_sample_utils.cpp
          audio_sample_utils.h
          cursor-sampler.cpp
          dshow_webcam_capture.cpp
          dshow_webcam_capture.h
          main.cpp
          mf_encoder.cpp
          mf_encoder.h
          monitor_utils.cpp
          monitor_utils.h
          wasapi_loopback_capture.cpp
          wasapi_loopback_capture.h
          webcam_capture.cpp
          webcam_capture.h
          wgc_session.cpp
          wgc_session.h
    native-bridge/
      store.ts
      cursor/
        adapter.ts
        telemetryCursorAdapter.ts
        recording/
          factory.ts
          macNativeCursorRecordingSession.ts
          session.ts
          telemetryRecordingSession.ts
          windowsNativeRecordingSession.ts
          windowsNativeRecordingSession.types.ts
      services/
        cursorService.ts
        projectService.ts
        systemService.ts
    recording/
      webm-duration.ts
  icons/
    icons/
      mac/
        icon.icns
      png/
        1024x1024.png
        128x128.png
        16x16.p
```

## Quick Start
```bash
brew install --cask siddharthvaddem/openscreen/openscreen
xattr -rd com.apple.quarantine /Applications/Openscreen.app
winget install SiddharthVaddem.OpenScreen
sudo apt install ./Openscreen-Linux-latest.deb
sudo pacman -U Openscreen-Linux-latest.pacman
```

## Agent Configuration

--- CONTRIBUTING.md ---
 # Contribution Guidelines

Thank you for considering contributing to this project! By contributing, you help make this project better for everyone. Please take a moment to review these guidelines to ensure a smooth contribution process.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of this repository to create your own copy.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/openscreen.git
     ```

3. **Create a New Branch**
   - Create a branch for your feature or bug fix:
     ```bash
     git checkout -b feature/your-feature-name
     ```

4. **Make Changes**
   - Make your changes.

5. **Test Your Changes**
   - Test your changes thoroughly to ensure they work as expected and do not break existing functionality.

6. **Commit Your Changes**
   - Commit your changes with a clear and concise commit message:
     ```bash
     git add .
     git commit -m "Add a brief description of your changes"
     ```

7. **Push Your Changes**
   - Push your branch to your forked repository:
     ```bash
     git push origin feature/your-feature-name
     ```

8. **Open a Pull Request**
   - Go to the original repository and open a pull request from your branch. Provide a clear description of your changes and the problem they solve.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue in the [Issues](https://github.com/siddharthvaddem/openscreen/issues) section of this repository. Provide as much detail as possible to help us address the issue effectively.

## Style Guide

- Write clear, concise, and descriptive commit messages.
- Include comments where necessary to explain complex code.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

Thank you for your contributions!


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
