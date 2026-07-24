# KI: erikdarlingdata/PerformanceStudio

## Overview
A cross-platform SQL Server execution plan analyzer with built-in MCP server for AI-assisted analysis. Parses `.sqlplan` XML, identifies performance problems, suggests missing indexes, and provides actionable warnings — from the command line or a desktop GUI.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 124 files across 15 directories
- **File types:** .cs: 61, .axaml: 17, .png: 11, .yml: 10, .md: 6, .json: 3, .gitignore: 2

## Core Capabilities
Feed it a query plan and it tells you what's wrong:

- **Large memory grants** — flags queries hoarding memory they don't use
- **Row estimate mismatches** — finds operators where estimates are 10x+ off from actuals
- **Missing indexes** — extracts SQL Server's index suggestions with ready-to-run CREATE statements
- **Hash, sort, and exchange spills** — identifies operators spilling to TempDB with severity based on volume
- **Parallel skew** — detects threads doing all the work while others sit idle
- **Scan predicates** — warns when scans filter rows with residual predicates
- **Key and RID lookups** — flags lookups back to the base table, distinguishes heaps from clustered indexes
- **Late filters** — finds Filter operators discarding rows deep in the plan
- **Nested loop concerns** — flags high-execution nested loops that might be better as hash joins
- **Parameter sniffing** — compares compiled vs runtime parameter values
- **Scalar UDFs** — warns about T-SQL and CLR scalar functions in execution paths
- **Implicit conversions** — detects type mismatches, upgrades severity when a seek plan is prevented
- **Anti-patterns** — OPTIMIZE FOR UNKNOWN, NOT IN with nullable columns, leading wildcards, function-wrapped predicates, and more

Each warning includes severity (Info, Warning, or Critical), the operator node ID, and enough context to act on immediately.

## Documentation Sections
- Performance Studio
- Screenshots
- Query Editor
- Actual Execution Plan with Plan Insights
- Multi-Statement Navigation
- Operator Tooltip and Properties
- Advice for Humans
- Plan Comparison
- Query Store Integration
- Minimap and colored links by accuracy ratio divergence
- MCP Integration
- What It Does
- Prerequisites
- Download
- Build from Source
- Quick Start
- Analyze an existing .sqlplan file
- JSON output (default) — full operator tree, suitable for automation
- Human-readable text output
- Text output, warnings and missing indexes only (skip operator tree)
- Capture and analyze plans from a live server
- Capture an actual execution plan (the query WILL run)
- Capture an estimated plan (safe for production — query is NOT executed)
- .env
- Store credentials (once per server)

## Core Structure
```
  .gitattributes
  .gitignore
  CITATION.cff
  CONTRIBUTING.md
  LICENSE
  PlanViewer.sln
  README.md
  SECURITY.md
  THIRD-PARTY-NOTICES.md
  THIRD_PARTY_NOTICES.md
  llms.txt
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    workflows/
      check-pr-branch.yml
      check-version-bump.yml
      ci.yml
      deploy-web.yml
      nightly.yml
      release.yml
  docs/
    signpath_logo.svg
  screenshots/
    .gitkeep
    Actual Execution Plan With Warning Tool Tip.png
    Actual Execution Plan.png
    Advice For Humans.png
    MCP Integration.png
    Navigate Stored Procedure Statements and Plans.png
    Operator Properties.png
    Plan Comparison.png
    Query Editor.png
    Query Store Integration.png
    minimap_and_planviewer_colored_actual_plan.png
    performance_studio_querystore_analysis_top_cpu_by_query_hash.png
  server/
    PlanShare/
      .gitignore
      PlanShare.csproj
      Program.cs
      appsettings.Development.json
      appsettings.json
      dashboard.html
      Properties/
        launchSettings.json
  src/
    Directory.Build.props
    PlanViewer.App/
      AboutWindow.axaml
      AboutWindow.axaml.cs
      App.axaml
      App.axaml.cs
      EDD.icns
      EDD.ico
      Info.plist
      MacOSDockIcon.cs
      MainWindow.FileOps.cs
      MainWindow.PlanViewer.cs
      MainWindow.RecentPlans.cs
      MainWindow.Tabs.cs
      MainWindow.axaml
      MainWindow.axaml.cs
      PlanViewer.App.csproj
      Program.cs
      app.manifest
      Controls/
        BarChartCell.axaml
        BarChartCell.axaml.cs
        ColumnFilterPopup.axaml
        ColumnFilterPopup.axaml.cs
        ColumnFilterState.cs
        HistoryPlanLoadEventArgs.cs
        PlanViewerControl.Interaction.cs
        PlanViewerControl.Minimap.cs
        PlanViewerControl.Properties.cs
        PlanViewerControl.Rendering.cs
        PlanViewerControl.Schema.cs
        PlanViewerControl.Statements.cs
        PlanViewerControl.Tooltips.cs
        PlanViewerControl.axaml
        PlanViewerControl.axaml.cs
        QuerySessionControl.Advice.cs
        QuerySessionControl.Connection.cs
        QuerySessionControl.Editor.cs
        QuerySessionControl.Execution.cs
        QuerySessionControl.Format.cs
        QuerySessionControl.Plans.cs
        QuerySessionControl.QueryStore.cs
        QuerySessionControl.Schema.cs
        QuerySessionControl.axaml
        QuerySessionControl.axaml.cs
 
```

## Quick Start
```bash
xattr -cr PerformanceStudio.app
git clone https://github.com/erikdarlingdata/PerformanceStudio.git
cd PerformanceStudio
dotnet build
dotnet test tests/PlanViewer.Core.Tests    # 37 tests should pass
dotnet run --project src/PlanViewer.Cli -- analyze --help
planview analyze my_query.sqlplan
planview analyze my_query.sqlplan --output text
planview analyze my_query.sqlplan --output text --warnings-only
planview analyze --server sql2022 --database AdventureWorks \
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Performance Studio

Thank you for your interest in contributing to Performance Studio! This guide will help you get started.

## Reporting Issues

- Use [GitHub Issues](https://github.com/erikdarlingdata/PerformanceStudio/issues) for bugs and feature requests
- Include the `.sqlplan` file (or a minimal reproduction) when reporting parser or analysis bugs
- Specify your OS and .NET version

## Development Setup

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Git

### Build and Test

```bash
git clone https://github.com/erikdarlingdata/PerformanceStudio.git
cd PerformanceStudio
dotnet build
dotnet test tests/PlanViewer.Core.Tests
```

### Run the GUI

```bash
dotnet run --project src/PlanViewer.App
```

### Run the CLI

```bash
dotnet run --project src/PlanViewer.Cli -- analyze --help
```

## Project Structure

```
PerformanceStudio/
├── src/
│   ├── PlanViewer.Core/       # Analysis engine (parser, rules, layout)
│   ├── PlanViewer.App/        # Avalonia desktop GUI
│   └── PlanViewer.Cli/        # CLI tool (planview command)
└── tests/
    └── PlanViewer.Core.Tests/ # xUnit tests with real .sqlplan fixtures
```

## Architecture

- **PlanViewer.Core** is the shared library. It contains the XML parser (`ShowPlanParser`), analysis rules (`PlanAnalyzer`), plan layout engine, text/JSON formatters, and all models. Both the GUI and CLI depend on it.
- **PlanViewer.App** is an Avalonia 11 desktop app using code-behind (no MVVM framework). It renders plan trees on a Canvas with the same operator icons as SSMS.
- **PlanViewer.Cli** is a System.CommandLine-based CLI tool that wraps Core for command-line use.

## Code Style

- File-scoped namespaces (`namespace Foo;`)
- Nullable enabled across all projects
- Code-behind pattern for UI (no MVVM, no ReactiveUI)
- No unnecessary abstractions — keep it simple and direct
- Tests use real `.sqlplan` XML fixtures, not mocks

## Adding Analysis Rules

Rules live in `PlanAnalyze


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
