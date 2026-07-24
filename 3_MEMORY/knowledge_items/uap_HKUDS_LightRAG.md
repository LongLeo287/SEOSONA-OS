# KI: HKUDS/LightRAG

## Overview
Package: lightrag-hku

## Tech Stack (from code)
- Python (155 files)
- TypeScript (React) (74 files)
- TypeScript (26 files)
- Shell (21 files)
- JavaScript (3 files)
- **Total:** 426 files, 71 directories
- **File types:** .py: 155, .tsx: 74, .md: 48, .ts: 26, .sh: 21, .yml: 18, .json: 18, .yaml: 13

## Imports Detected in Source
- `setuptools`

## File Structure
```
  .dockerignore
  .git-blame-ignore-revs
  .gitattributes
  .gitignore
  .pre-commit-config.yaml
  AGENTS.md
  CLAUDE.md
  Dockerfile
  Dockerfile.lite
  Dockerfile.postgres
  LICENSE
  MANIFEST.in
  Makefile
  README-ja.md
  README-zh.md
  README.md
  SECURITY.md
  config.ini.example
  docker-build-push.sh
  docker-compose-full.yml
  docker-compose.podman.yml
  docker-compose.yml
  env.docker-compose-full
  env.example
  lightrag.service.example
  pyproject.toml
  requirements-offline-llm.txt
  requirements-offline-storage.txt
  requirements-offline.txt
  setup.py
  uv.lock
  .claude/
    settings.json
    hooks/
      session-start.sh
  .clinerules/
    01-basic.md
  README.assets/
    b2aaf634151b4706892693ffb43d9093.png
    iShot_2025-03-23_12.40.08.png
  assets/
    LiteWrite.png
    logo.png
  docs/
    AsymmetricEmbedding.md
    DockerDeployment.md
    FileProcessingPipeline-zh.md
    FileProcessingPipeline.md
    FrontendBuildGuide.md
    InteractiveSetup.md
    LightRAG-API-Server-zh.md
    LightRAG-API-Server.md
    LightRAGSidecarFormat-zh.md
    LightRAGSidecarFormat.md
    MilvusConfigurationGuide.md
    MultiSiteDeployment.md
    OfflineDeployment.md
    ParagraphSemanticChunking-zh.md
    ParagraphSemanticChunking.md
    ParserDebugCLI-zh.md
    ParserDebugCLI.md
    ProgramingWithCore.md
    Reproduce.md
    RoleSpecificLLMConfiguration-zh.md
    RoleSpecificLLMConfiguration.md
    ThirdPartyParser-zh.md
    ThirdPartyParser.md
    UV_LOCK_GUIDE.md
    LightRAG-API-Server.assets/
      image-20250323122538997.png
      image-20250323122754387.png
      image-20250323123011220.png
      image-20250323194750379.png
  k8s-deploy/
    README-zh.md
    README.md
    install_lightrag.sh
    install_lightrag_dev.sh
    uninstall_lightrag.sh
    uninstall_lightrag_dev.sh
    databases/
      00-config.sh
      01-prepare.sh
      02-install-database.sh
      03-uninstall-database.sh
      04-cleanup.sh
      README.md
      install-kubeblocks.sh
      uninst
```

## Key Source Excerpts
### setup.py
```python
# Minimal setup.py for backward compatibility
# Primary configuration is now in pyproject.toml

from setuptools import setup

setup()

```

## Agent Configuration
### AGENTS.md
# Repository Guidelines

## Project Overview

LightRAG is a Retrieval-Augmented Generation (RAG) framework that uses graph-based knowledge representation for enhanced information retrieval. The system extracts entities and relationships from documents, builds a knowledge graph, and uses multiple retrieval modes (`local`, `global`, `hybrid`, `mix`, `naive`) for queries.

## Project Structure

Top-level directories:

- **lightrag/**: Core Python package — see *Module Layout* below.
- **lightrag_webui/**: React 19 + TypeScript client (Bun + Vite + Tailwind). UI components in `src/`.
- **scripts/**: `test.sh` (preferred test runner), `setup/` interactive environment wizard (use `make env-*` rather than calling `setup.sh` directly — see *Configuration > Setup Wizard Outputs*), and release tooling.
- **tests/**: Pytest coverage, organized into subdirectories that mirror `lightrag/` (see *Testing* below for layout). Working datasets stay in `inputs/`, `rag_storage/`, and `temp/`; deployment collateral lives in `docs/`, `k8s-deploy/`, and compose files.

### Module Layout (`lightrag/`)

- **lightrag.py**: Main orchestrator class (`LightRAG`) — assembled from mixins (see *LightRAG class composition*). Hosts `ainsert_custom_kg`, `_insert_done`, `_process_extract_entities`, `_refresh_addon_params_cache`, and `addon_params` accessors. Critical: always call `await rag.initialize_storages()` after instantiation.
- **pipeline.py**: `_PipelineMixin` — owns the document ingestion pipeline (`a

### CLAUDE.md
Strictly follow the rules in ./AGENTS.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
