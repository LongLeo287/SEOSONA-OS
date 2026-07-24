# KI: Segergren/Segra

## Overview
**Segra** is a powerful recording software built on Open Broadcaster Software (OBS), designed for gamers and content creators. Record, clip, and upload gameplay highlights effortlessly, with smart automation and deep game integration.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 111 files across 37 directories
- **File types:** .cs: 69, .json: 10, .md: 3, .js: 3, .css: 3, .tsx: 3, .gitignore: 2
- **Dev dependencies:** husky, lint-staged

## Core Capabilities
- **Auto-Start Recording**: Begin recording automatically when your game launches.  
- **Instant Clipping**: Save key moments with a hotkey.
- **Direct Upload**: Share clips to **[Segra.tv](https://segra.tv)** instantly.  
- **Game Integration**: Tracks in-game stats (kills, deaths, assists) to auto-generate highlights, powered by AI.  
- **Lightweight & Fast**: Built on OBS for 4K with 144 FPS capture with minimal performance impact.  
- **Customizable Settings**: Adjust recording quality (NVENC/AMD VCE), hotkeys, storage paths, etc.

---

## Documentation Sections
- ✂️ Clip Editor
- 🔥 Highlights
- ⚙️ Settings
- ✨ Features  
- Why "Segra"?  
- 🛠 Installation
- 🔄 Uninstallation
- 🤝 Contributing  
- 📜 License  
- 🔐 Code Signing Policy
- Star History
- Acknowledgments

## Available Commands
- `npm run prepare` -- husky
- `npm run precommit:lint-staged` -- lint-staged

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  CONTRIBUTING.md
  LICENSE.GPL2
  README.md
  Segra.csproj
  Segra.sln
  app.manifest
  build-local.sh
  icon.ico
  icon.png
  lint-staged.config.js
  package-lock.json
  package.json
  packages.lock.json
  .github/
    workflows/
      create-prerelease.yml
      create-release.yml
  .husky/
    pre-commit
    pre-push
  .signpath/
    output.xml
    publish.xml
  .vscode/
    launch.json
    tasks.json
  Backend/
    Api/
      ContentServer.cs
    App/
      DiagnosticsService.cs
      MessageService.cs
      MigrationService.cs
      NotifyIconService.cs
      Program.cs
      StartupService.cs
      TrimmingFileSink.cs
      UpdateService.cs
    Auth/
      AuthService.cs
    Core/
      PresetsService.cs
      SettingsService.cs
      Models/
        AppState.cs
        Bookmark.cs
        Codec.cs
        Display.cs
        KeybindSettings.cs
        OBSVersion.cs
        Segment.cs
        Settings.cs
    Games/
      GameDetectionService.cs
      GameIntegrationService.cs
      GameSettingsService.cs
      GameUtils.cs
      Integration.cs
      LogTailIntegration.cs
      OcrIntegration.cs
      CounterStrike2/
        CounterStrike2Integration.cs
      Dota2/
        Dota2Integration.cs
      GrandTheftAuto/
        GtaIntegration.cs
      LeagueOfLegends/
        LeagueOfLegendsIntegration.cs
      Minecraft/
        MinecraftIntegration.cs
      Pubg/
        PubgIntegration.cs
      RocketLeague/
        RocketLeagueIntegration.cs
      RunescapeDragonwilds/
        RunescapeDragonwildsIntegration.cs
      Rust/
        RustIntegration.cs
      WarThunder/
        ClogDecoder.cs
        WarThunderIntegration.cs
    Media/
      AiService.cs
      ClipService.cs
      CompressionService.cs
      ContentMigrationService.cs
      ContentService.cs
      FFmpegService.cs
      HighlightService.cs
      ImportService.cs
      Mp4BoxReader.cs
      UploadService.cs
    Recorder/
      NvencCapsService.cs
      OBSService.cs
      OBSWindow.cs
      RecordingPreviewService.cs
      RecoveryService.cs
    Shared/
      FolderNames.cs
      GeneralUtils.cs
      IconUtils.cs
      PathUtils.cs
    Windows/
      Audio/
        AudioDeviceService.cs
      Display/
        DisplayService.cs
        HdrDetectionService.cs
        WindowUtils.cs
      GameMode/
        GameModeService.cs
      Input/
        KeybindCaptureService.cs
      Power/
        PowerModeMonitor.cs
      Storage/
        StorageServic
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Segra

A quick, practical guide to get you developing on both the backend (C#/.NET) and the frontend (React/Vite).

## Proposing New Features
- Before building a new feature, open a GitHub issue describing it and wait for it to be accepted by a maintainer.
- This avoids wasted effort: PRs that add features without an approved issue may be closed if the feature isn't a fit for the project's direction.
- Bug fixes and small improvements don't require a prior issue, though one is still welcome for anything non-trivial.

## Requirements
- Windows 10 (build 19041 / version 2004) or newer
- .NET SDK 10.0.x (Windows targeting)
- Git
- Node.js 20+ and npm (for frontend tooling, git hooks, and the frontend dev server)
- IDEs (pick what you like):
  - Visual Studio Code + C# Dev Kit OR Visual Studio

## Repo Layout
- `Segra.sln` — solution root
- `Backend/` — app services, models, utils
- `Frontend/` — React + Vite app (TypeScript, Tailwind, DaisyUI)

## First-Time Setup
1. Clone the repo
   - `git clone <your-fork-or-upstream> && cd Segra`
2. Install root dev tools (husky/lint-staged for hooks)
   - `npm install` (also runs `prepare` to set up husky)
3. Install frontend deps
   - `cd Frontend && npm install && cd ..`
4. Ensure .NET SDK 10 is on PATH
   - `dotnet --info` should show `Version: 10.x` and `OS: Windows`

## Developing
There are two parts running during development: the backend (Photino.NET desktop app) and the frontend (Vite dev server on port 2882).

### Start the Frontend (Vite)
- `cd Frontend && npm run dev` (serves on http://localhost:2882)

### Start the Backend (.NET)
- From the repo root:
  - `dotnet run --project Segra.csproj`
- Notes:
  - In Debug mode the app expects the frontend on `http://localhost:2882`.
  - If Node/npm is installed, the backend attempts to auto-run `npm run dev` in `Frontend/` if nothing is listening on 2882.

## Building
- Backend (Release): `dotnet build -c Release`
- Backend publish (self-contained optional): `d


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
