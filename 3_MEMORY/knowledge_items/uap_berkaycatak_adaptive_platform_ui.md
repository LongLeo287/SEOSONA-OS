# KI: berkaycatak/adaptive_platform_ui

## Overview
A Flutter package that provides adaptive platform-specific widgets with native iOS 26+ designs, traditional Cupertino widgets for older iOS versions, and Material Design for Android.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 93 files across 55 directories
- **File types:** .png: 24, .md: 10, .xml: 8, .yml: 7, .gitignore: 4, .yaml: 4, .plist: 4

## Core Capabilities
**AdaptiveApp** - Unified app configuration for all platforms:
- Separate themes for Material (Android) and Cupertino (iOS)
- Full theme mode support (light, dark, system)
- Router support via `AdaptiveApp.router()`
- Zero configuration required

**iOS 26+ Native Designs** - Modern iOS 26 components with:
- **Native UIToolbar** - Liquid Glass blur effects with native iOS 26 design
- **Native UITabBar** - Tab bar with minimize behavior and smooth animations
- **Native UIButton** - Button styles with spring animations and haptic feedback
- **Native UISegmentedControl** - Segmented controls with SF Symbol support
- **Native UISwitch & UISlider** - Switches and sliders with native animations
- Native corner radius and shadows
- Smooth spring animations
- Dynamic color system (light/dark mode)
- Multiple component styles

**iOS Legacy Support** - Traditional Cupertino widgets for iOS 18 and below

**Material Design** - Full Material 3 support for Android

**Automatic Platform Detection** - Zero configuration required

**Version-Aware Rendering** - Automatically selects appropriate widget based on iOS version

## Documentation Sections
- Adaptive Platform UI
- iOS 26+ Native Toolbar & Tab Bar
- Features
- Widget Showcase
- Important: Localization Setup
- AdaptiveScaffold with AdaptiveAppBar
- AdaptiveButton
- AdaptiveAlertDialog
- AdaptiveContextMenu
- AdaptivePopupMenuButton
- AdaptiveSegmentedControl
- AdaptiveSwitch
- AdaptiveSlider
- AdaptiveCheckbox
- AdaptiveRadio
- AdaptiveCard

## Core Structure
```
  .gitattributes
  .gitignore
  .metadata
  CHANGELOG.md
  CLAUDE.md
  LICENSE
  README.md
  analysis_options.yaml
  codecov.yml
  pubspec.yaml
  .github/
    CONTRIBUTING.md
    PULL_REQUEST_TEMPLATE.md
    RELEASING.md
    DISCUSSION_TEMPLATE/
      ideas.yml
      questions.yml
      show-and-tell.yml
    ISSUE_TEMPLATE/
      bug_report.md
      config.yml
      feature_request.md
    workflows/
      ci.yml
      release.yml
  android/
    build.gradle
    src/
      main/
        AndroidManifest.xml
        kotlin/
          com/
            berkaycatak/
              adaptive_platform_ui/
                AdaptivePlatformUiPlugin.kt
  example/
    .gitignore
    .metadata
    README.md
    analysis_options.yaml
    pubspec.lock
    pubspec.yaml
    .vscode/
      launch.json
    android/
      .gitignore
      build.gradle.kts
      gradle.properties
      settings.gradle.kts
      app/
        build.gradle.kts
        src/
          debug/
            AndroidManifest.xml
          main/
            AndroidManifest.xml
            kotlin/
              com/
                example/
                  adaptive_platform_ui_example/
                    MainActivity.kt
            res/
              drawable/
                launch_background.xml
              drawable-v21/
                launch_background.xml
              mipmap-hdpi/
                ic_launcher.png
              mipmap-mdpi/
                ic_launcher.png
              mipmap-xhdpi/
                ic_launcher.png
              mipmap-xxhdpi/
                ic_launcher.png
              mipmap-xxxhdpi/
                ic_launcher.png
              values/
                styles.xml
              values-night/
                styles.xml
          profile/
            AndroidManifest.xml
      gradle/
        wrapper/
          gradle-wrapper.properties
    assets/
      icons/
        user.png
    ios/
      .gitignore
      Podfile
      Podfile.lock
      Flutter/
        AppFrameworkInfo.plist
        Debug.xcconfig
        Release.xcconfig
      Runner/
        AppDelegate.swift
        Info.plist
        Runner-Bridging-Header.h
        Assets.xcassets/
          AppIcon.appiconset/
            Contents.json
            Icon-App-1024x1024@1x.png
            Icon-App-20x20@1x.png
            Icon-App-20x20@2x.png
            Icon-App-20x20@3x.png
            Icon-App-29x29@1x.png
            Icon-App-29x29@2x.png
            Icon-App-29x29@3x.png
            Icon-App-40x40@1x.png
```

## Quick Start
```bash
Without these delegates, date/time pickers and other widgets will show English text regardless of system language.
<img src="https://github.com/berkaycatak/adaptive_platform_ui/blob/main/img/toolbar_p.png?raw=true" alt="iOS 26 Native Toolbar">
**Basic Usage:**
**iOS 26 Native Toolbar:**
**iOS 26 Native Bottom Bar:**
**No AppBar or Bottom Navigation:**
**Key Features:**
- 🎨 **AdaptiveAppBar**: Centralized app bar configuration
- 📱 **AdaptiveBottomNavigationBar**: Centralized bottom navigation configuration
- 🔧 **Custom Navigation Bars**: Provide your own navigation components
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Flutter plugin (`adaptive_platform_ui`) that renders platform-adaptive widgets:
- **iOS 26+**: Native UIKit components with Liquid Glass design via platform views
- **iOS 18 and below**: Flutter Cupertino widgets
- **Android**: Flutter Material Design 3 widgets

The iOS native code lives under `ios/Classes/` (Swift). The Dart plugin code lives under `lib/`.

## Build & Development Commands

```bash
# Install dependencies
flutter pub get

# Static analysis (CI uses --fatal-infos)
flutter analyze --fatal-infos

# Run all tests
flutter test

# Run a single test file
flutter test test/adaptive_button_test.dart

# Run tests with coverage
flutter test --coverage

# Format code
dart format .

# Run example app (from repo root)
cd example && flutter pub get && flutter run

# Publish dry run
flutter pub publish --dry-run
```

CI uses Flutter 3.35.6 stable. CI pipeline: analyze -> test -> build example APK.

## Architecture

### Platform Rendering Decision

Every `Adaptive*` widget in `lib/src/widgets/` follows this pattern in `build()`:

```
PlatformInfo.isIOS26OrHigher() → iOS 26+ native widget (lib/src/widgets/ios26/)
PlatformInfo.isIOS             → CupertinoWidget
else (Android)                 → MaterialWidget
```

`PlatformInfo` (`lib/src/platform/platform_info.dart`) parses `Platform.operatingSystemVersion` to detect the iOS major version.

### Flutter-to-Native Bridge (iOS 26+)

Each native component has three parts:

1. **Dart side** (`lib/src/widgets/ios26/ios26_*.dart`): Creates a `UiKitView` with `viewType: 'adaptive_platform_ui/ios26_{component}'`, passes configuration as `creationParams`, and sets up a `MethodChannel` with pattern `adaptive_platform_ui/{component}_{instanceId}` for callbacks.

2. **Swift factory** (`ios/Classes/iOS26*View.swift`): Implements `FlutterPlatformViewFactory`, registered in `AdaptivePlatformUiPlugin.


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
