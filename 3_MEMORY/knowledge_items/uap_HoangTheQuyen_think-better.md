# KI: HoangTheQuyen/think-better

## Overview
**Your AI writes code fast but makes terrible decisions.**<br> Think Better injects structured decision frameworks directly into your AI prompts.

## Architecture & Tech Stack
- Go
- **Total files:** 117 files across 31 directories
- **File types:** .md: 37, .csv: 32, .go: 15, .py: 14, .yml: 4, .png: 4, .ps1: 2

## Documentation Sections
- Think Better
- The Problem
- Quick Start
- macOS / Linux
- Windows (PowerShell)
- How It Works
- Two Skills
- `/decide` — For Choices
- `/solve` — For Problems
- Depth Levels
- Architecture
- Step-by-Step Workspace
- CLI Commands
- Project Structure
- Requirements
- Contributing
- 🇻🇳 Tiếng Việt
- Cài Đặt
- macOS / Linux
- Windows
- Cài skill
- Cách Dùng
- 2 Skill
- Slash Commands
- Lưu Ý

## Core Structure
```
  .gitignore
  .golangci.yml
  CONTRIBUTING.md
  GITHUB-SETUP.md
  LICENSE
  Makefile
  QUICK-REFERENCE.md
  README.md
  SECURITY.md
  USER-GUIDE.md
  build.ps1
  build.sh
  flake.lock
  flake.nix
  go.mod
  install.ps1
  install.sh
  .agents/
    skills/
      make-decision/
        PROMPT.md
        SKILL.md
        data/
          analysis-techniques.csv
          cognitive-biases.csv
          criteria-templates.csv
          decision-frameworks.csv
          decision-types.csv
          facilitation.csv
        scripts/
          advisor.py
          core.py
          populate_data.py
          search.py
      problem-solving-pro/
        PROMPT.md
        SKILL.md
        data/
          analysis-tools.csv
          cognitive-biases.csv
          communication.csv
          decomposition.csv
          heuristics.csv
          prioritization.csv
          problem-types.csv
          reasoning.csv
          steps.csv
          team-dynamics.csv
        scripts/
          advisor.py
          core.py
          search.py
    workflows/
      decide.deep.md
      decide.exec.md
      decide.md
      decide.quick.md
      solve.deep.md
      solve.exec.md
      solve.md
      solve.quick.md
  .github/
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      ci.yml
      nix-build.yml
      release.yml
  cmd/
    make-decision/
      main.go
  doc/
    icon.png
  docs/
    favicon.png
    index.html
    og-image.png
    robots.txt
    sitemap.xml
    images/
      banner.png
  examples/
    01-product-strategy.md
    02-cloud-migration.md
    03-hiring-decision.md
    04-budget-allocation.md
    05-debugging-race-condition.md
    06-template.md
    07-template.md
    08-template.md
    09-template.md
    10-template.md
    README.md
  internal/
    checker/
      checker.go
      checker_test.go
    cli/
      check.go
      init.go
      list.go
      shared.go
      uninstall.go
    installer/
      installer.go
      installer_test.go
      status.go
      uninstaller.go
    skills/
      embed.go
      registry.go
      registry_test.go
      skills/
        make-decision/
          PROMPT.md
          SKILL.md
          data/
            analysis-techniques.csv
            cognitive-biases.csv
            criteria-templates.csv
            decision-frameworks.csv
            decision-types.csv
            facilitation.csv
          scripts/
            advisor.py
            core.py
            
```

## Quick Start
```bash
curl -sSL https://raw.githubusercontent.com/HoangTheQuyen/think-better/main/install.sh | bash
irm https://raw.githubusercontent.com/HoangTheQuyen/think-better/main/install.ps1 | iex
think-better init --ai claude        # Claude Code
think-better init --ai copilot       # GitHub Copilot
think-better init --ai antigravity   # Antigravity
You: "Should we migrate from React to Next.js for our main app?"
AI:  → Detects: Binary Choice
→ Framework: Reversibility Filter
→ Warns: Overconfidence Bias, Status Quo Bias, Sunk Cost
→ Generates: Weighted comparison matrix + action plan
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Think Better

First off, thank you for considering contributing to **Think Better**! It's people like you that make the open-source community such a great place to learn, inspire, and create.

This document provides guidelines and instructions for contributing to this project.

## How Can I Contribute?

### Reporting Bugs & Requesting Features
- Use the [GitHub Issues](https://github.com/HoangTheQuyen/think-better/issues) tab.
- Check if the issue or feature request already exists before creating a new one.
- Describe the issue clearly, including steps to reproduce, what you expected to happen, and what actually happened.

### Contributing Code or New AI Skills

We welcome pull requests! Here is the standard workflow to contribute code:

#### 1. Fork and Clone
1. **Fork** the repository on GitHub by clicking the "Fork" button in the top right corner.
2. **Clone** your forked repository to your local machine:
   ```bash
   git clone https://github.com/<your-username>/think-better.git
   cd think-better
   ```

#### 2. Create a Branch
Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 3. Make Changes & Test
- Make your code changes. If you are adding a new AI skill, follow the structure in `.agents/skills/`.
- Run the tests to ensure everything is working correctly:
  ```bash
  go test ./...
  ```
- Before committing, make sure the embedded skills are prepared:
  ```bash
  make embed-prep
  ```

#### 4. Commit Your Changes
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
```bash
git add .
git commit -m "feat: add new decision framework for product launch"
```

#### 5. Push and Create a Pull Request (PR)
1. **Push** your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Go to the original `HoangTheQuyen/think-better` reposito


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
