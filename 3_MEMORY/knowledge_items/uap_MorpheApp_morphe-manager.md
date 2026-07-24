# KI: MorpheApp/morphe-manager

## Overview
&nbsp;
<p align="center">
  <a href="https://morphe.software" title="Download Morphe">
    <img src="https://raw.githubusercontent.com/MorpheApp/.github/refs/heads/main/profile/assets/download-morphe.svg" alt="Download Morphe" width="240"/>
  </a>
</p>
&nbsp;

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 99 files across 45 directories
- **File types:** .kt: 48, .json: 13, .yml: 10, .md: 4, .aidl: 4, .kts: 3, .xml: 3
- **Dev dependencies:** @cleyrop-org/semantic-release-backmerge, @MorpheApp/changelog, @semantic-release/exec, @semantic-release/git, semantic-release

## Core Capabilities
**Patching**
- Simple mode for one-tap patching with curated defaults
- Expert mode for full patch selection, per-patch configuration, and experimental version support
- Expert mode also shows an expanded patching screen with real-time logs and live RAM usage monitoring during patching
- 100+ patches for YouTube, YouTube Music, and Reddit
- Support for split APKs
- Skips split APK modules for unsupported CPU architectures, locales, and screen densities during merge
- Strips native libraries for unsupported architectures from plain APKs after patching

**Patch options** *(Simple mode: available in the Advanced tab; Expert mode: available on the patch selection screen)*
- Custom app display name and header logo per app
- App theme colors (background color presets)
- Hide Shorts app shortcut and widget (YouTube)
- And more, depending on installed patch bundles

**Patch sources**
- Add any compatible patch bundle via GitHub URL or deep link
- Per-source pre-release toggle to get early patch access
- Automatic background update notifications (even when the app is closed)

**Installer**
- Standard Android installer
- Root installer with Magisk module support (mount-based, no data loss on update)
- Any third-party installer apps detected on the system are also available as an option
- Prompt-on-install option to choose per session

**Appearance**
- System / Light / Dark / Material You themes
- Pure Black mode for OLED screens
- Accent color selection
- Animated background selection
- App icon selection

**Advanced**
- Import/export your Morphe settings as JSON
- Import/export your signing keystore
- Manage saved original APKs and patched APKs
- Manage saved patch selections per app
- GitHub Personal Access Token support for higher API rate limits
- Process runtime - run patching in a separate process for better stability, with configurable memory limit
- Bytecode processing mode - controls how bytecode is processed during patching, affecting patching speed, memory usage, a

## Documentation Sections
- 💊 Morphe
- ✨ Why Morphe?
- 📲 Download
- 🚀 How it works
- 🔧 Features
- ❓ New to GitHub?
- 📙 Contributing
- ❗ About
- 📜 License

## Core Structure
```
  .gitattributes
  .gitignore
  .releaserc
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  NOTICE
  README.md
  app-release.json
  build.gradle.kts
  crowdin.yml
  gradle.properties
  gradlew
  gradlew.bat
  package-lock.json
  package.json
  settings.gradle.kts
  .github/
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    scripts/
      prepare-release.sh
      send_fcm.py
    workflows/
      build_pull_request.yml
      crowdin_pull.yml
      crowdin_push.yml
      open_pull_request.yml
      release.yml
      test_fcm.yml
  app/
    .gitignore
    CHANGELOG.md
    app-release.json
    build.gradle.kts
    google-services.json
    gradle.properties
    gradlew
    lint-baseline.xml
    package.json
    proguard-rules.pro
    release-trigger
    aboutlibraries/
      libraries/
        app.morphe.manager.json
    schemas/
      app.morphe.manager.data.room.AppDatabase/
        10.json
        11.json
        12.json
        7.json
        8.json
        9.json
    src/
      debug/
        res/
          values/
            strings.xml
      main/
        AndroidManifest.xml
        aidl/
          app/
            morphe/
              manager/
                IRootSystemService.aidl
                patcher/
                  runtime/
                    process/
                      IPatcherEvents.aidl
                      IPatcherProcess.aidl
                      Parameters.aidl
        assets/
          root/
            module.prop
            service.sh
        cpp/
          CMakeLists.txt
          prop_override.cpp
        java/
          app/
            morphe/
              manager/
                MainActivity.kt
                ManagerApplication.kt
                data/
                  platform/
                    Filesystem.kt
                    NetworkInfo.kt
                  redux/
                    Redux.kt
                  room/
                    AppDatabase.kt
                    Converters.kt
                    Migrations.kt
                    apps/
                      installed/
                        AppliedPatch.kt
                        InstalledApp.kt
                        InstalledAppDao.kt
                      original/
                        OriginalApk.kt
                        OriginalApkDao.kt
                    bundles/
                      PatchBundleDao.kt
                      PatchBundleEntity.kt
                    options/
                      Option.kt
 
```

## Agent Configuration

--- CONTRIBUTING.md ---
# 👋 Contribution guidelines

This document describes how to contribute to the Morphe Manager.

## 📝 How to contribute

1. Before contributing, it is recommended to [open an issue](https://github.com/MorpheApp/morphe-manager/issues/new?labels=Feature+request&projects=&template=feature_request.yml&title=feat%3A+)
   to discuss your change. This will help you determine whether your change is worth your time to implement it.
2. Development happens on the `dev` branch. Fork the repository and create your branch from `dev`.
3. Commit your changes.
4. Submit a pull request to the `dev` branch of the repository and reference issues
   that your pull request closes in the description of your pull request.
5. Our team will review your pull request and provide feedback. Once your pull request is approved,
   it will be merged into the `dev` branch and will be included in the next pre-release of Morphe.

❤️ Thank you for considering contributing to the Morphe Manager.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
