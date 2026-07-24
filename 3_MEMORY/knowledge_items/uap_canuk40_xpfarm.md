# KI: canuk40/xpfarm

## Overview
An open-source AI-augmented offensive security platform that wraps well-known security tools behind a unified web UI — with distributed scanning, AI-generated reports, a smart scan planner, an interactive attack graph, and a community Plugin SDK.

## Architecture & Tech Stack
- Go
- **Total files:** 107 files across 40 directories
- **File types:** .go: 70, .png: 24, .md: 3, .sh: 2, .svg: 2, .dockerignore: 1, .gitignore: 1

## Documentation Sections
- XPFarm
- Index
- Why
- Wrapped Tools
- Architecture Map
- Overlord — AI Analysis
- Bug Bounty Reports
- AI Scan Planner

## Core Structure
```
  .dockerignore
  .gitignore
  CLAUDE.md
  Dockerfile
  LICENSE
  README.md
  ROADMAP.md
  docker-compose.yml
  go.mod
  go.sum
  main.go
  xpfarm
  xpfarm-toggle.sh
  xpfarm.ps1
  xpfarm.sh
  .playwright-mcp/
    page-2026-03-25T15-13-05-505Z.png
    page-2026-03-25T15-14-51-119Z.png
    page-2026-03-25T15-15-41-881Z.png
    page-2026-03-25T16-23-27-211Z.png
    page-2026-03-25T16-23-51-221Z.png
    page-2026-03-25T16-24-11-836Z.png
    page-2026-03-25T16-53-19-699Z.png
  cmd/
    worker/
      main.go
  img/
    Disc_Paths.png
    O_agents.png
    O_agents2.png
    O_prompt.png
    O_status.png
    O_tools.png
    Port_Scan.png
    Raw_logs.png
    Set_target.png
    dashboard.png
    discord.png
    docker.png
    graph.png
    modules.png
    planner.png
    reports.png
    workers.png
    xpfarm-off.svg
    xpfarm-on.svg
  internal/
    core/
      audit.go
      checkpoint.go
      discovery.go
      manager.go
      nuclei_tags.go
      scanner.go
      scoring.go
      search.go
      target.go
      template_indexer.go
      enrichment/
        epss.go
        greynoise.go
        internetdb.go
        kev_nuclei.go
        osv.go
        template_gen.go
        triage.go
        vision.go
        vulncheck.go
    crypto/
      secrets.go
    database/
      db.go
      models.go
    distributed/
      controller/
        controller.go
      localworker/
        worker.go
      scheduler/
        scheduler.go
      worker/
        executor.go
        worker.go
    graph/
      builder.go
      model.go
    mcp/
      server.go
    modules/
      cvemap.go
      gowitness.go
      httpx.go
      katana.go
      naabu.go
      nmap.go
      nuclei.go
      registry.go
      subfinder.go
      urlfinder.go
      wappalyzer.go
      wrapper.go
    normalization/
      adapter.go
      enricher.go
      pipeline.go
      registry.go
      adapters/
        gitleaks/
          adapter.go
        nmap/
          adapter.go
        nuclei/
          adapter.go
        semgrep/
          adapter.go
      all/
        all.go
      dedupe/
        dedupe.go
      enrichers/
        cvss/
          enricher.go
        cwe/
          enricher.go
        epss/
          enricher.go
        kev/
          enricher.go
      grouping/
        grouping.go
      model/
        finding.go
    notifications/
      discord/
        client.go
      telegram/
        client.go
    overlord/
      overlord.go
    planner/
      engine.go
      model.go
      scheduler.go

```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**XPFarm** is a Go-based vulnerability scanner that wraps 10+ open-source security tools (Subfinder, Naabu, Httpx, Nuclei, Nmap, CVEMap, Gowitness, Katana, URLFinder, Wappalyzer) behind a unified web UI on port `:8888`. It also ships an AI binary/malware analysis agent called **Overlord**, backed by OpenCode running in a separate Docker container on port `:3000`.

## Build & Run Commands

```bash
# Full stack (recommended for development)
./xpfarm.sh build          # Build Docker containers
./xpfarm.sh up             # Start full stack (xpfarm + overlord + optional mobsf)
./xpfarm.sh down           # Stop containers

# Go only (skips Overlord, faster iteration)
./xpfarm.sh onlyGo         # Compile and run binary natively
./xpfarm.sh onlyGo -debug  # Same with debug logging + Gin debug mode

# Direct Go build
go build -o xpfarm main.go
```

There are no automated tests or linting configurations in this project.

## Architecture

### Entry Point & Startup Sequence (`main.go`)
1. Parse flags (`-debug`)
2. Initialize SQLite database (WAL mode, single connection, 30s timeout, 64MB cache)
3. Register 10 tool modules via the module registry
4. Health-check + auto-install missing tools
5. Index Nuclei templates in background goroutine
6. Start Gin web server on `:8888`

### Internal Package Layout

| Package | Role |
|---|---|
| `internal/core/` | 8-stage scan pipeline (`manager.go`), target resolution, Nuclei template plan engine, global search |
| `internal/database/` | SQLite models via GORM — 11 tables |
| `internal/modules/` | Pluggable tool wrappers + registry |
| `internal/ui/` | Gin server, REST API, embedded HTML templates |
| `internal/overlord/` | Reverse proxy to OpenCode serve API + SSE streaming |
| `internal/notifications/` | Discord & Telegram callbacks on scan lifecycle |
| `pkg/utils/` | Logger, Cloudflare IP detector, binar


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
