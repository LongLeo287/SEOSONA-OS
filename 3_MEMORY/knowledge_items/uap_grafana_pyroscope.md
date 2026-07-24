# KI: grafana/pyroscope

## Overview
Pyroscope 2.0 makes the new **v2 architecture** the default. Profiles are written directly to object storage, removing the need for in-memory ingesters and local disks - simplifying operations and lowering resource usage at scale. Existing v1 deployments can opt in via a flag and migrate without data loss.

## Architecture & Tech Stack
- Go
- **Total files:** 84 files across 61 directories
- **File types:** .yaml: 30, .yml: 15, .md: 11, .sum: 4, .mdc: 4, .xml: 4, .json: 3

## Documentation Sections
- 🎉 **Announcement: Pyroscope 2.0 is here!**
- What is Grafana Pyroscope?
- How Does Pyroscope Work?
- [Pyroscope Live Demo](https://play.grafana.org/a/grafana-pyroscope-app/explore)
- **Quick Start: Run the Pyroscope server locally**
- Docker
- Homebrew (macOS / Linux)
- Binary
- **Quick Start: Visualize profiles with Grafana Profiles Drilldown**
- Grafana Cloud / OSS
- Documentation
- Send data to the server
- [Supported Languages][supported languages]

## Core Structure
```
  .git-blame-ignore-revs
  .gitignore
  .gitmodules
  .golangci.yml
  .goreleaser.yaml
  .mockery.yaml
  .pre-commit-config.yaml
  .pyroscope.yaml
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CODEOWNERS
  CODE_OF_CONDUCT.md
  GOVERNANCE.md
  LICENSE
  LICENSING.md
  MAINTAINERS.md
  Makefile
  Makefile.examples
  README.md
  go.mod
  go.mod.sum
  go.sum
  go.work
  go.work.sum
  renovate.json
  .agents/
    skills
  .claude/
    skills/
      update-go-version/
        SKILL.md
  .cursor/
    rules/
      development-workflow.mdc
      go-backend.mdc
      go-testing.mdc
      pyroscope-general.mdc
  .devcontainer/
    devcontainer.json
  .github/
    zizmor.yml
    ISSUE_TEMPLATE/
      feature_request.md
      issue--bug-report.md
    workflows/
      backport.yml
      ci.yml
      frontend.yml
      fuzzer.yml
      helm-ci.yml
      helm-integration-httproute.yml
      helm-release.yml
      release.yml
      renovate-config-validator.yml
      test-examples.yml
      update-contributors.yml
      update-examples-cron.yml
      weekly-release.yml
  .idea/
    modules.xml
    pyroscope.iml
    runConfigurations/
      help.xml
      v1.xml
      v2.xml
  .vscode/
    launch.json
  api/
    LICENSE
    buf.gen.yaml
    buf.lock
    buf.yaml
    go.mod
    go.sum
    adhocprofiles/
      v1/
        adhocprofiles.proto
    capabilities/
      v1/
        feature_flags.proto
    connect-openapi/
      base.yaml
      gen/
        adhocprofiles/
          v1/
            adhocprofiles.openapi.yaml
        capabilities/
          v1/
            feature_flags.openapi.yaml
        debuginfo/
          v1/
            debuginfo.openapi.yaml
          v1alpha1/
            debuginfo.openapi.yaml
        google/
          v1/
            profile.openapi.yaml
        ingester/
          v1/
            ingester.openapi.yaml
        metastore/
          v1/
            compactor.openapi.yaml
            index.openapi.yaml
            query.openapi.yaml
            tenant.openapi.yaml
            types.openapi.yaml
            raft_log/
              raft_log.openapi.yaml
        push/
          v1/
            push.openapi.yaml
        querier/
          v1/
            querier.openapi.yaml
        query/
          v1/
            query.openapi.yaml
        segmentwriter/
          v1/
            push.openapi.yaml
        settings/
          v1/
            recording_rules.openapi.yaml
            setting.openapi.yaml
        status/
          v1/
            status
```

## Quick Start
```bash
docker run -it -p 4040:4040 grafana/pyroscope
brew install pyroscope-io/brew/pyroscope
brew services start pyroscope
tar xvf pyroscope_*.tar.gz
./pyroscope
```

## Agent Configuration

--- AGENTS.md ---
# Pyroscope - AI Agent Development Guide

This document provides context and guidance for AI coding assistants (Claude, Cursor, GitHub Copilot, etc.) working on the Pyroscope codebase.

## What is Pyroscope?

Pyroscope is a horizontally scalable, highly available, multi-tenant continuous profiling aggregation system. 
It's designed to store and query profiling data at scale, similar to how Prometheus works for metrics and Loki for logs.

**Key Characteristics:**
- Written in **Go**
- Microservices-based architecture inspired by Cortex/Mimir/Loki
- Stores profiling data in object storage (S3, GCS, Azure, etc.)
- Multi-tenant by design

## Architecture Overview

Pyroscope uses a **microservices architecture** where a single binary can run different components based on the `-target` parameter.

### V1 Components

**Write Path:**
- **Distributor**: Receives profile ingestion requests, validates, and forwards to ingesters
- **Ingester**: Stores profiles in memory, periodically flushes to disk as blocks, periodically uploads blocks to long-term object storage
- **Compactor**: Merges blocks and removes duplicates

**Read Path:**
- **Query Frontend**: Entry point for queries, handles query splitting and caching
- **Query Scheduler**: Manages query queue and ensures fair execution across tenants
- **Querier**: Executes queries by fetching data from ingesters and store-gateways
- **Store Gateway**: Indexes and serves blocks from long-term object storage

### V2 Components

**Write Path:**
- **Distributor**: Receives profile ingestion requests, validates, and forwards to segment writers
- **Segment Writer**: Writes block segments to long-term object storage and the block metadata to metastore
- **Metastore**: Maintains an index for the block metadata and coordinates the block compaction process
- **Compaction Worker**: Merges small segments into larger blocks

**Read Path:**
- **Query Frontend**: Entry point for queries, creates the query plan and executes it against query bac

--- CLAUDE.md ---
AGENTS.md


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
