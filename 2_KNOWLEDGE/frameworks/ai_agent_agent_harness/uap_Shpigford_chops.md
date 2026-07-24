# KI: Shpigford/chops

## Overview
Chops is a native macOS application designed for discovering, organizing, and editing AI coding agent skills across various tools like Claude Code, Cursor, and Codex. The application utilizes SwiftUI and SwiftData to provide a user interface for managing these skills, with a focus on open-source principles and direct code paths.  It appears to be in an early stage of development, prioritizing clean code over extensive fallback mechanisms.

## Tech Stack (from code)
- **Language:** Swift (`Chops/App/ChopsApp.swift`)
- **Framework:** SwiftUI (`Chops/App/ContentView.swift`, `Chops/Views/Detail/SkillEditorView.swift`)
- **Build System:** xcodebuild (referenced in `CLAUDE.md` and `project.yml`)
- **Data Storage:** SwiftData (`Chops/App/ChopsApp.swift`) - explicitly uses `~/Library/Application Support/Chops/Chops.store`.
- **Dependency Management:**  Uses a project.yml file for dependency management, leveraging xcodegen to generate Xcode projects and manage dependencies like Sparkle, Highlightr, and cmark-gfm (`project.yml`).

## Public API / Exports
Due to the nature of this being an application with primarily internal functionality, there are no readily apparent public APIs or exported endpoints visible in the provided code snippets. The primary entry point appears to be `Chops/App/ChopsApp.swift`.  The SwiftData models (`Skill`, `SkillCollection`) represent the core data structures managed within the application but aren't exposed as a public API.

## Dependencies
Based on the `project.yml` file:
- **Sparkle:** Version >= 2.6.0 (for auto-updates)
- **Highlightr:** Version >= 2.2.1 (likely for syntax highlighting)
- **cmark-gfm:** Version >= 2.1.0 (CommonMark with GitHub Flavored Markdown, likely used for rendering markdown content).

## Architecture Patterns
- **Singleton State Management:** The `AppState` class is described as an `@Observable` singleton (`Chops/App/ChopsApp.swift`), suggesting a centralized state management pattern.
- **Versioned Schema Migration:**  The application utilizes SwiftData's schema versioning capabilities with `VersionedSchema` and `SchemaMigrationPlan` (see `SchemaVersions.swift`). This indicates an intention to evolve the data model over time while maintaining compatibility.
- **Modular Design:** The codebase is structured into modules like `Models`, `Services`, `Utilities`, and `Views`, suggesting a modular design approach.  The separation of concerns within these modules is evident (e.g., `AgentFactory` in `Agents/`).



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **SwiftUI Integration:** The extensive use of SwiftUI demonstrates modern macOS UI development practices, which could be valuable for developing new SEOSONA OS components.
- **SwiftData Adoption:**  The application’s reliance on SwiftData provides a real-world example of using this relatively new data storage framework, potentially informing best practices for its adoption within the OS.
- **AI Agent Skill Management:** The core functionality of managing AI coding agent skills could be adapted to create a more integrated and user-friendly experience for developers within SEOSONA OS.  The `Skill` model itself provides a useful structure for representing external tools and their configurations.
- **Open Source Principles:** Chops' commitment to open source aligns with potential goals for transparency and community contribution in the development of SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
