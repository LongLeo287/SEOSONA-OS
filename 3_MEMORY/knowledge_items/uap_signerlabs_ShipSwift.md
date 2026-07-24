# KI: signerlabs/ShipSwift

## Overview
**AI-native SwiftUI component library — production-ready code that LLMs can use to build real apps.**

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 107 files across 42 directories
- **File types:** .json: 39, .png: 38, .swift: 14, .jpg: 5, .md: 3, .svg: 2, .gitignore: 1

## Documentation Sections
- ShipSwift
- What is ShipSwift?
- Need a custom app built? We do that too.
- Quick Start
- Option 1: Skills + Recipe Server (Recommended)
- Claude Code
- Gemini CLI
- Option 2: Local Skills (No MCP Required)
- Option 3: File Copy
- Run the Showcase App
- Components
- SWAnimation — Animation Components
- SWChart — Chart Components
- SWComponent — UI Components
- SWModule — Multi-File Frameworks
- SWUtil — Shared Utilities
- Directory Structure
- Naming Convention
- Dependency Rules
- Recipes
- Free vs Pro
- Tech Stack
- Contributing
- Code Style
- License

## Core Structure
```
  .gitignore
  ACKNOWLEDGEMENTS.md
  CLAUDE.md
  LICENSE
  README.md
  SWSecrets.swift.example
  glama.json
  ShipSwift/
    Info.plist
    Localizable.xcstrings
    PrivacyInfo.xcprivacy
    ShipSwift - MCP Codebase.storekit
    ShipSwiftApp.swift
    Assets.xcassets/
      Contents.json
      AccentColor.colorset/
        Contents.json
      AppIcon.appiconset/
        AppIcon-128 1.png
        AppIcon-16 1.png
        AppIcon-256 1.png
        AppIcon-256 2.png
        AppIcon-32 1.png
        AppIcon-32 2.png
        AppIcon-512 1.png
        AppIcon-512 2.png
        AppIcon-64 1.png
        Contents.json
        Logo (2) 1.png
        Logo (2).png
      Demo Image/
        Contents.json
        Chocolate.imageset/
          2.png
          Contents.json
        Latte.imageset/
          1.png
          Contents.json
        Matcha.imageset/
          3.png
          Contents.json
        airpods.imageset/
          Contents.json
          airpods.png
        business-shoes.imageset/
          Contents.json
          bussiness-shoes.png
        face-picture.imageset/
          Contents.json
          照片.png
        golf-gloves.imageset/
          Contents.json
          golf-gloves.png
        keys.imageset/
          Contents.json
          keys.png
        smile-after.imageset/
          Contents.json
          smile-after.png
        smile-before.imageset/
          Contents.json
          smile-before.png
        suit.imageset/
          Contents.json
          suit.png
        sunglasses.imageset/
          Contents.json
          sunglasses.png
        tshirt.imageset/
          Contents.json
          tshirt.png
        wide-brimmed-hat.imageset/
          Contents.json
          wide-brimmed-hat.png
      Logo/
        Contents.json
        Brushmo Logo.imageset/
          Contents.json
          icon.png
        Fullpack Logo.imageset/
          Contents.json
          Logo (7).png
        Journey Logo.imageset/
          Contents.json
          Journey Logo.png
        Lifebang Logo.imageset/
          Contents.json
          logo-lifebang.png
        ShipSwift Logo.imageset/
          Contents.json
          Logo (2).png
        SmileMax Logo.imageset/
          Contents.json
          Logo.png
        UtilityMax Logo.imageset/
          1.png
          Contents.json
      Welcome Image/
        Contents.json
        welcome-0.imageset/
          Contents.json
          welcome-0.png
        welcome-1.imageset/
          Contents.json
     
```

## Quick Start
```bash
npx skills add signerlabs/shipswift-skills
claude mcp add --transport http shipswift https://api.shipswift.app/mcp
gemini mcp add --transport http shipswift https://api.shipswift.app/mcp
npx skills add signerlabs/ShipSwift
git clone https://github.com/signerlabs/ShipSwift.git
cd ShipSwift
open ShipSwift.xcodeproj
ShipSwift/
├── SWPackage/
│   ├── SWAnimation/          # Animation components
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

## Project Overview
- ShipSwift iOS component template library (public repo)

## Directory Structure
- Reusable components live under `ShipSwift/SWPackage/` in five directories:
  - `SWAnimation/` — Self-contained animation components (each works independently, may depend on SWUtil only)
  - `SWChart/` — Self-contained chart components (each works independently, may depend on SWUtil only)
  - `SWComponent/` — Self-contained UI components organized by category:
    - `Display/` — Display components (FloatingLabels, MarkdownText, ScrollingFAQ, RotatingQuote, BulletPointText, GradientDivider, Label, OnboardingView, OrderView, RootTabView)
    - `Feedback/` — Feedback components (Alert, Loading, ThinkingIndicator)
    - `Input/` — Input components (TabButton, Stepper, AddSheet, SearchBar)
  - `SWModule/` — Multi-file frameworks (SWAuth, SWCamera, SWPaywall, SWChat, SWSetting, SWSubjectLifting, SWTikTokTracking)
  - `SWUtil/` — Shared utilities (no dependencies on other SWPackage directories)
- Showcase app views live under `ShipSwift/View/` (HomeView, ChatView, ComponentView, ProPaywallView, RootTabView, SettingView, ShipSwiftAuthView)
- App services live under `ShipSwift/Service/` (ChatService, ComponentRegistry)
- Shared app components live under `ShipSwift/Component/` (ListItem)

## Naming Conventions
- All type names use the `SW` prefix: `SWAlertManager`, `SWStoreManager`, `SWCameraView`
- View modifier methods use `.sw` lowercase prefix: `.swAlert()`, `.swPageLoading()`, `.swPrimary`
- File names match their primary type: `SWAlert.swift` contains `SWAlertManager`
- **Platform suffix rule**: iOS-only files use `+iOS` suffix (e.g. `SWCameraManager+iOS.swift`), macOS-only files use `+macOS` suffix. Cross-platform files have no suffix
- **Xcode Build Phases reminder**: This project supports both iOS and macOS. When adding a `+iOS` or `+macOS` file, remind the user to set the platform filter in Xcode → Build Phases → Compile Sources (change "Always Used" to


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
