# KI: xtool-org/xtool

## Overview
Cross-platform Xcode replacement. Build and deploy iOS apps with SwiftPM on Linux, Windows, and macOS.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 118 files across 30 directories
- **File types:** .swift: 49, .sh: 17, .md: 13, .png: 12, .yml: 6, .h: 4, .gitignore: 3

## Documentation Sections
- xtool
- Overview
- Getting Started
- Examples
- Screenshot
- Command line interface
- Library

## Core Structure
```
  .gitignore
  .swiftlint.yml
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE.md
  Makefile
  Package.resolved
  Package.swift
  README.md
  SECURITY.md
  docker-compose.yml
  netlify.toml
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    actions/
      configure-xcode/
        action.yml
    workflows/
      build.yml
      release.yml
      swiftlint.yml
  .vscode/
    .gitignore
    extensions.json
    settings.json
  Documentation/
    build.sh
    xtool.docc/
      Appex.md
      Control.md
      First-app.tutorial
      Installation-Linux.md
      Installation-macOS.md
      footer.html
      xtool.md
      xtool.tutorial
      First-app-code/
        build-1a.sh
        build-1b.sh
        build-2.sh
        build-3.sh
        edit-2.swift
        edit-4.swift
        rerun-5a.sh
        rerun-5b.sh
        rerun-6.sh
        template-1a.sh
        template-1b.sh
        template-2a.sh
        template-2b.sh
        template-3a.sh
        template-3b.sh
        template-4a.sh
        template-4b.sh
      Resources/
        Autocomplete.png
        Cover.png
        Developer.PNG
        HelloWorld-Purple.png
        HelloWorld.png
        Home.png
        Hover.png
        Hover2.png
        SwiftExtension.png
        Trust.png
        UntrustedDev.png
        Verified.png
  Linux/
    .gitignore
    README.md
    build.sh
    xtool.desktop
    xtool.png
  Sources/
    CXKit/
      mobileprovision.c
      version.c
      include/
        mobileprovision.h
        stdout_shim.h
        version.h
    DeveloperAPI/
      openapi-generator-config.yaml
      patch.js
      Generated/
        Client.swift
        Types.swift
    PackLib/
      BuildSettings.swift
      PackSchema.swift
      Packer.swift
      Planner.swift
      Process+Helpers.swift
      Stdlib+Utils.swift
      ToolRegistry.swift
      XcodePacker.swift
    XADI/
      module.modulemap
      xadi.h
    XKit/
      DeveloperServices/
        DeveloperServicesAPIVersion.swift
        DeveloperServicesClient.swift
        DeveloperServicesLoginManager.swift
        DeveloperServicesOperation.swift
        DeveloperServicesPlatformRequest.swift
        DeveloperServicesProvisioningOperation.swift
        DeveloperServicesRequest.swift
        DeveloperServicesTeamFetcher.swift
        App Groups/
          DeveloperServicesAddAppGroupRequest.swift
          DeveloperServicesAppGroup.swift
          DeveloperServicesAssignAppGroupRequest.swift
  
```

## Quick Start
```bash
$ xtool --help
OVERVIEW: Cross-platform Xcode replacement
USAGE: xtool <subcommand>
OPTIONS:
-h, --help              Show help information.
CONFIGURATION SUBCOMMANDS:
setup                   Set up xtool for iOS development
auth                    Manage Apple Developer Services authentication
sdk                     Manage the Darwin Swift SDK
DEVELOPMENT SUBCOMMANDS:
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to xtool

## Bug reports and feature requests

We welcome all bug reports and feature requests! Please create a [new issue](https://github.com/xtool-org/xtool/issues/new/choose) via GitHub.

## Documentation

The xtool documentation at <https://xtool.sh> is built with [swift-docc](https://github.com/swiftlang/swift-docc) and resides at [Documentation/xtool.docc](/Documentation/xtool.docc). It's hosted on Netlify, the configuration for which is in [netlify.toml](/netlify.toml).

When editing the DocC bundle, you can preview it with `make docs-preview`.

Once you make a pull request with your changes, we'll also generate a [Netlify Deploy Preview](https://docs.netlify.com/site-deploys/deploy-previews/) under your pull request. You can open this preview to see how the changes will look in production.

## Code

When making code changes, please make sure to test them on both macOS and Linux if possible. If you can also test on Windows with WSL, that is ideal.

To build xtool for debugging, run `make` in the project directory. There are a few considerations depending on your host OS:

### macOS

On macOS, you'll firstly need to have Xcode set up.

The first time you run `make`, we'll try to detect your codesigning identity. If you have multiple, you'll see an interactive prompt to select the team you want to use. The team ID is saved to `./macOS/Support/Private-Team.xcconfig`. You can run `make team` to update it (or do so by hand).

After building, a symlink to the product will be created at `./macOS/Build/xtool`. We generate an Xcode project at `./macOS/XToolMac.xcodeproj` that you can open in order to work in Xcode.

### Linux

You need to have a few dependencies on Linux; see [Dockerfile](/Dockerfile) for specifics. It's often easiest to develop within Docker itself: see [Linux/README.md](/Linux/README.md) for details.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
