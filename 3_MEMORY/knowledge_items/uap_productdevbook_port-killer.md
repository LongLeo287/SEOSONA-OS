# KI: productdevbook/port-killer

## Overview
A powerful cross-platform port management tool for developers.<br> Monitor ports, manage Kubernetes port forwards, integrate Cloudflare Tunnels, and kill processes with one click. </p>

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 114 files across 22 directories
- **File types:** .swift: 92, .yml: 4, .svg: 4, .md: 3, .png: 3, .json: 2, .gitignore: 1
- **Key dependencies:** bumpp

## Core Capabilities
### Port Management
- 🔍 Auto-discovers all listening TCP ports
- ⚡ One-click process termination (graceful + force kill)
- 🔄 Auto-refresh with configurable interval
- 🔎 Search and filter by port number or process name
- ⭐ Favorites for quick access to important ports
- 👁️ Watched ports with notifications
- 📂 Smart categorization (Web Server, Database, Development, System)

### Kubernetes Port Forwarding
- 🔗 Create and manage kubectl port-forward sessions
- 🔌 Auto-reconnect on connection loss
- 📝 Connection logs and status monitoring
- 🔔 Notifications on connect/disconnect

### Cloudflare Tunnels
- ☁️ View and manage active Cloudflare Tunnel connections
- 🌐 Quick access to tunnel status

### Cross-Platform
- 📍 Menu bar integration (macOS)
- 🖥️ System tray app (Windows)
- 🎨 Native UI for each platform

## Documentation Sections
- PortKiller
- macOS
- Windows
- Installation
- macOS
- Windows
- Features
- Port Management
- Kubernetes Port Forwarding
- Cloudflare Tunnels
- Cross-Platform
- Contributing
- Sponsors
- License

## Available Commands
- `npm run release` -- bumpp

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  README.md
  STYLE_GUIDE.md
  appcast.xml
  bun.lock
  package.json
  .github/
    assets/
      macos.png
      windows.jpeg
    workflows/
      ci-windows.yml
      ci.yml
      pr-build.yml
      release.yml
  platforms/
    macos/
      Package.swift
      Resources/
        AppIcon.icns
        AppIcon.svg
        Info.plist
        ToolbarIcon.svg
        AppIcon.icon/
          icon.json
          Assets/
            cross.svg
            plug.svg
      Sources/
        AppState+AutoRefresh.swift
        AppState+Favorites.swift
        AppState+KeyboardShortcuts.swift
        AppState+PortLabels.swift
        AppState+PortNotes.swift
        AppState+PortOperations.swift
        AppState+ProcessTypeNotifications.swift
        AppState+ProcessTypeOverrides.swift
        AppState+WatchedPorts.swift
        AppState.swift
        Constants.swift
        PortKillerApp.swift
        PortScanner.swift
        DesignSystem/
          Brand.swift
          Colors.swift
          Layout.swift
          Typography.swift
        Extensions/
          ProcessType+Color.swift
          TunnelStatus+UI.swift
        Managers/
          AutoKillManager.swift
          KubernetesDiscoveryManager.swift
          NamedTunnelManager.swift
          PortForwardManager+Execution.swift
          PortForwardManager+Monitoring.swift
          PortForwardManager.swift
          PortForwardProcessManager+ConflictResolution.swift
          PortForwardProcessManager+Execution.swift
          PortForwardProcessManager+Kubernetes.swift
          PortForwardProcessManager.swift
          SponsorManager.swift
          TunnelManager.swift
          TunnelState.swift
          UpdateManager.swift
        Models/
          AutoKillRule.swift
          CloudflareTunnel.swift
          CloudflaredProtocol.swift
          Errors.swift
          KubernetesModels.swift
          NamedCloudflareTunnel.swift
          PortFilter.swift
          PortForwardConnection.swift
          PortForwardErrors.swift
          PortInfo.swift
          ProcessGroup.swift
          ProcessType.swift
          Sponsor.swift
          TunnelLogEntry.swift
          WatchedPort.swift
        Protocols/
          ClipboardServiceProtocol.swift
          NotificationServiceProtocol.swift
          PortScannerProtocol.swift
          StorageProtocols.swift
        Resources/
          ToolbarIcon.png
          ToolbarIcon@2x.png
        Services/
          Clipboard
```

## Quick Start
```bash
brew install --cask productdevbook/tap/portkiller
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing

## Requirements

- **macOS 15.0+** / **Windows 10+**
- **Xcode 16+** with Swift 6.0 (for macOS)
- **.NET 9 SDK** (for Windows)

## Setup

```bash
git clone https://github.com/productdevbook/port-killer.git
cd port-killer
```

## Running the App

### macOS

```bash
cd platforms/macos

# Option 1: Xcode (recommended)
open Package.swift
# Press ▶️ to run

# Option 2: Build script
./scripts/build-app.sh && open .build/apple/Products/Release/PortKiller.app
```

> ⚠️ `swift run` doesn't work for menu bar apps - use Xcode or the build script.

### Windows

```bash
cd platforms/windows/PortKiller
dotnet run
```

## Building

### macOS

```bash
cd platforms/macos
swift build              # Debug
swift build -c release   # Release
./scripts/build-app.sh   # App bundle
```

### Windows

```bash
cd platforms/windows/PortKiller
dotnet build             # Debug
dotnet publish -c Release -r win-x64  # Release
```

## Pull Requests

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Make changes and test locally
4. Commit (`git commit -m "feat: add feature"`)
5. Push and create PR

## Code Style

### macOS
- Swift 6.0 with strict concurrency
- SwiftUI for UI
- `@Observable` for state management
- Keep files under 300 lines

### Windows
- C# with WPF
- MVVM pattern

## Project Structure

```
platforms/
├── macos/
│   ├── Sources/
│   │   ├── PortKillerApp.swift    # Entry point
│   │   ├── Managers/              # State & scanning
│   │   ├── Models/                # Data models
│   │   └── Views/                 # SwiftUI views
│   ├── Resources/                 # Assets, Info.plist
│   └── scripts/                   # Build scripts
└── windows/
    └── PortKiller/                # .NET WPF project
```



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
