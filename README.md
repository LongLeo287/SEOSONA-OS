<div align="center">

<img src="https://raw.githubusercontent.com/LongLeo287/SEOSONA-OS/main/.github/assets/Seosona_Logo.png" alt="SEOSONA OS" width="600">

<br/>

**The Universal AI Operating System for Senior Developers**

[![NPM Version](https://img.shields.io/npm/v/seosona-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/seosona-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg?style=flat-square)](https://github.com/LongLeo287/SEOSONA-OS)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/LongLeo287/SEOSONA-OS/pulls)

*One setup. Every AI tool. Everywhere.*

*Read this in other languages: [Tiếng Việt](README-vi.md).*

</div>

---

## 📑 Table of Contents
- [What is SEOSONA OS?](#-what-is-seosona-os)
- [Key Features](#-key-features)
- [Tool Coverage](#️-tool-coverage)
- [Installation](#-installation)
- [Usage](#-usage)
- [Repository Structure](#️-repository-structure)
- [Dynamic Plugin Architecture](#-dynamic-plugin-architecture)
- [How It Works — Under the Hood](#️-how-it-works--under-the-hood)
- [Community & Standards](#-community--standards)
- [Changelog](#-changelog)
- [License](#-license)

---

## 🧠 What is SEOSONA OS?

SEOSONA OS is a **Universal AI Operating System** — a self-installing, self-scanning environment that automatically detects every AI coding tool installed on your machine and injects a unified **Master Intelligence Layer** (your `SOUL.md`) into each one.

No more copy-pasting system prompts. No more configuring each tool separately. No more AI that doesn't know who you are, how you work, or what rules you follow.

**Run one command. Every AI on your machine connects to the SEOSONA Omni-Brain.**

> *"You are not a simple chatbot; you are an end-to-end operational agent."* — SOUL.md, Prime Directive

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Omni-Scanner** | Auto-detects and anchors every IDE and CLI tool (Cursor, Codex, Windsurf, Aider, etc.) |
| 🧬 **Context Engine (V5)** | Assembles modular, token-budgeted intelligence specifically for the current task |
| 🌍 **Cross-Platform** | Works on Windows (PowerShell), macOS and Linux (Node.js CLI) |
| 🧠 **Knowledge Graph** | Semantic routing across 259 dynamic skills via `intent_router.py` |
| ⚡ **Task Planner** | DAG-based parallel execution waves for massive speedups |
| 🛡️ **Fix Loops** | Automatic failure diagnosis and retry-with-backoff for all operations |
| 📊 **Quality Scorer** | Composite A-F grading and validation of all extracted data |
| 🚨 **SEOSONA Omni-Brain Protocol** | Zero-tolerance ruleset preventing AI from bypassing workflows |

---

## 📈 V5 Intelligence Architecture (NEW)

SEOSONA OS includes a fully automated, standalone Python orchestrator for deeply analyzing websites, workflows, and domains. It replaces expensive SEO software by chaining free APIs, web scrapers, Playwright E2E testing, and Deep Web OSINT into a premium dashboard.

**V5 Core Upgrades:**
- **Task Planner:** Kahn's topological sort groups 14+ modules into parallel execution waves (3.7x speedup).
- **Validation & Fix Loops:** Validates output completeness and marker contamination. Automatically retries network/auth failures using exponential backoff.
- **Session Memory:** Cross-session audit metrics with time-decay learning and regression tracking.
- **Quality Scorer:** Outputs a composite A-F grade with actionable recommendations.
- **Intent Router:** Normalizes user queries, extracts domain terms, and dynamically routes to the 259-node Knowledge Graph.

**14 Integrated Modules (Wrapped in Fix Loops):**
  1. `PageSpeed Insights (CWV)`: Lab & Real user web vitals.
  2. `Keywords`: Google autocomplete intent mapping.
  3. `SERP Competitor`: Content gap & H1/Title scraping.
  4. `Backlinks`: Domain authority via Open PageRank & Common Crawl.
  5. `GSC Rankings`: Direct pull from Google Search Console.
  6. `Rank Tracker`: Quick win tracking (Pos 4-20).
  7. `GA4 Analytics`: Sessions & user behavior.
  8. `Technical SEO`: Crawls robots, sitemaps, redirects.
  9. `Schema Validator`: Checks JSON-LD/Microdata for rich snippets.
  10. `E-E-A-T Analyzer`: Identifies thin content and orphan pages.
  11. `Log Analyzer`: Parses Nginx/Apache logs for Googlebot patterns.
  12. `OSINT Entity Scan`: Deep web investigation for Author/Brand validation.
  13. `Playwright E2E QA`: Automated UX/CRO friction and JS rendering tests.
  14. `Premium Dashboard v4`: Renders an interactive HTML report with Falsifiability checks.

**Run an audit:**
```powershell
python 1_CORE/scripts/run_full_audit.py --domain your_domain.com
```

---
---

## 🛠️ Tool Coverage

SEOSONA OS automatically detects and configures the following tools:

### 🖥️ IDEs
| Tool | Injection Method | Config Target |
|---|---|---|
| **Cursor** | `settings.json` | `cursor.general.rules` |
| **Windsurf** | `settings.json` | `windsurf.general.rules` |
| **PearAI** | `settings.json` | `pearai.general.rules` |
| **Trae** | `settings.json` | `trae.general.rules` |
| **VSCode** | `settings.json` | `github.copilot.chat.*`, `cline.customInstructions`, `roo-cline.customInstructions` |
| **VSCodium** | `settings.json` | Same as VSCode |

### ⌨️ CLI Tools
| Tool | Injection Method | Config Target |
|---|---|---|
| **Claude CLI** | PowerShell wrapper function | `--system-prompt` flag |
| **Aider** | `~/.aider.conf.yml` | `system-prompt` field |
| **OpenInterpreter** | `config.yaml` | `system_message` field |
| **Codex** | `~/.codex/AGENTS.md` | Prepended content |
| **SecureCoder** | `~/.securecoder/AGENTS.md` | Prepended content |
| **Continue.dev** | `~/.continue/config.json` | `systemMessage` field |

### 🤖 Environment Variables (Antigravity & Custom CLIs)
| Variable | Purpose |
|---|---|
| `ANTIGRAVITY_SYSTEM_PROMPT` | Injects SOUL into Antigravity IDE |
| `SEOSONA_MASTER_PROMPT` | Universal variable for any custom tool |
| `AIDER_SYSTEM_PROMPT` | Backup injection for Aider |

### 📁 Project-Local Files (`seosona-init`)
When you run `seosona init` in a project folder, it generates only the files relevant to your installed tools:

```
.cursorrules              # Cursor IDE
.windsurfrules            # Windsurf IDE
.clauderules              # Claude CLI
.clinerules               # Cline extension
.roomodes                 # Roo Code extension
.aider.conf.yml           # Aider CLI
.antigravityrules         # Antigravity IDE
.codexrules               # OpenAI Codex
.securecoderrules         # SecureCoder
.openinterpreter          # OpenInterpreter
.github/copilot-instructions.md   # GitHub Copilot Enterprise
.cody/prompt              # Sourcegraph Cody
.bolt/prompt              # Bolt.new
.lovable/prompt           # Lovable.dev
```

> **Smart Detection:** Files are only created for tools that are actually installed on your machine. No phantom files for tools you don't have.

---

## 🚀 Installation

### Method 1: NPM (Recommended — Cross-Platform)

```bash
# Install the CLI globally via npm
npm install -g seosona-cli

# Run the global setup wizard
seosona setup
```

### Method 2: Manual Clone & Run (Developers)

```bash
# Clone the repository
git clone https://github.com/LongLeo287/SEOSONA-OS.git
cd SEOSONA-OS/cli

# Install globally from local source
npm install -g .

# Run setup
seosona setup
```

---

## 📖 Usage

### For Non-Technical Users (Zero-Touch)

Just run setup once. SEOSONA OS handles everything automatically. Every IDE you open from that point on will operate under SEOSONA rules.

```bash
seosona setup
```

### For Developers (Expert Mode)

```bash
# Global machine setup (run once per machine)
seosona setup

# Bind a project (run once per project folder)
cd /path/to/your/project
seosona init

# Check what was injected
seosona setup    # Re-run anytime to verify state
```



---

## 🏗️ Repository Structure

```
SEOSONA OS/
│
├── 📂 1_CONFIG/                      # Configuration — Settings, keys, and environments
│
├── 📂 1_CORE/                        # The Brain — Master Prompts & Governance
│   ├── 🧠 SOUL.md                    # Master system prompt (9,400+ chars)
│   ├── 📂 agents/                    # System orchestrators and core agents
│   ├── 📂 scripts/                   # Core python orchestrators (e.g., run_full_audit.py)
│   ├── 📂 workflows/                 # Autonomous loop definitions (System level)
│   └── 📂 rules/                     # Security, API, and interface rules
│
├── 📂 2_KNOWLEDGE/                   # The Skills — Dynamic Plugin Ecosystem
│   ├── 📋 MASTER_INDEX.md            # Global index of knowledge base
│   ├── 📋 SKILLS_ROUTER.md           # Auto-generated semantic index of all skills
│   ├── 🔒 skills-lock.json           # Semantic routing cache
│   ├── 📂 frameworks/                # Domain-specific plugin directories (The Skills)
│   ├── 📂 sops/                      # Standard Operating Procedures
│   ├── 📂 workflows/                 # Operational agent workflows and playbooks
│   ├── 📂 schemas/                   # Data structures and validation schemas
│   └── 📂 output_styles/             # Formatting rules for AI generation
│
├── 📂 3_MEMORY/                      # The Memory — Persistent session storage
│   ├── 📂 specs/                     # Architecture docs & technical specs
│   ├── 📂 logs/                      # Chronological session logs
│   ├── 📂 seo_exports/               # Output directory for SEO Audit reports
│   └── 📂 errors/                    # Error reports & debug records
│
├── 📂 4_AGENTS/                      # The Personas — Agent Roster and role definitions
│   └── 📋 ROSTER.md                  # Defines current agent capacity and roles
│
├── 📂 5_RESEARCH/                    # The Scout — Raw input, tracking links, repo lists
│
├── 📂 cli/                           # Node.js CLI package
│   ├── bin/seosona.js               # CLI entry point
│   ├── src/                         # Cross-platform Local & Global Scanners
│   └── package.json                 # npm package definition
│
├── 📂 .github/                       # Community & Standards (PR/Issue templates, Assets)
│
└── 📖 README.md                      # You are here
```

---

## 🧩 Dynamic Plugin Architecture

SEOSONA OS has evolved into a fully decentralized Plugin Ecosystem boasting **115+ dynamically loaded skills**. 

Instead of hardcoded prompts, the OS uses an autonomous plugin scanner (`scripts/core/plugin_manager.py`). 

### How the Plugin System Works:
1. **Creation**: When the AI assimilates new knowledge or completes a successful workflow, it autonomously packages it into a standard `SKILL.md` file complete with YAML Frontmatter (name, description, keywords).
2. **Discovery**: The `plugin_manager.py` script recursively scans `2_KNOWLEDGE/frameworks/` for these `SKILL.md` manifests.
3. **Routing**: It compiles an active registry inside `SKILLS_ROUTER.md`, which the `SOUL.md` orchestrator reads to decide which sub-agents to load at runtime.

### Current Core Domains:
- **SEO & Marketing**: 5-Pillar Audit framework, E-E-A-T analysis, Content Formulas.
- **Frontend Engineering**: UI/UX standards, Tailwind Motion, Hoversource.
- **Core System**: Harness Engineering, Memory Synthesis, SEOSONA Omni-Brain Protocol.
- **Testing & Automation**: Playwright E2E suites.
- **Ingested Intelligence**: Auto-generated skills harvested from URLs, PDFs, and codebase repositories via the *Universal Assimilation Protocol*.

---

## ⚙️ How It Works — Under the Hood

### The Universal Anchor
SEOSONA OS creates a filesystem junction at `~/.seosona` pointing to wherever the actual `SEOSONA OS` directory lives. This means:
- All tools read from `~/.seosona` regardless of where you stored the files
- Move the folder anywhere, re-run `seosona setup`, the anchor updates automatically
- **Zero hardcoded paths anywhere in the system**

### The Injection Chain

```
seosona setup (run once)
    │
    ├── Reads SOUL.md (9,400+ chars of pure intelligence)
    │
    ├── [Global Level] Writes to IDE settings.json files
    │       Cursor → settings.json → cursor.general.rules
    │       VSCode → settings.json → copilot/cline/roo keys
    │       Aider  → ~/.aider.conf.yml → system-prompt
    │       ...
    │
    ├── [OS Level] Sets Windows Environment Variables
    │       ANTIGRAVITY_SYSTEM_PROMPT = <full SOUL.md content>
    │       SEOSONA_MASTER_PROMPT     = <full SOUL.md content>
    │
    └── [Shell Level] Injects PowerShell profile wrappers
            seosona-init → available globally in any terminal
            seosona-claude → wraps Claude CLI with --system-prompt
            git init → auto-calls seosona-init on new projects

seosona-init (run per project)
    │
    ├── Detects installed tools on THIS machine
    └── Drops ONLY relevant rule files into the project root
            No phantom files for tools you don't have
```

### The SOUL.md — Master Intelligence
The `SOUL.md` file contains the full cognitive blueprint of SEOSONA OS:
- **Prime Directive** — The Evolution Mandate
- **SEOSONA Omni-Brain Protocol** — Zero-tolerance bypass rules
- **Enforced SOPs** — Engineering standards, security rules, memory patterns
- **Master Flow** — The 5-phase execution model for every task
- **Sub-persona Activation** — Context-aware behavior switching

---

## 🤝 Community & Standards

We welcome contributions from the community! To maintain a safe and productive environment, please review our community standards before participating:

- **[Contributing Guidelines](.github/CONTRIBUTING.md)**: Instructions on how to submit bug reports, feature requests, and Pull Requests (including adding new skills).
- **[Code of Conduct](.github/CODE_OF_CONDUCT.md)**: Our pledge to maintain a welcoming, inclusive, and harassment-free community.
- **[Security Policy](.github/SECURITY.md)**: Instructions for reporting security vulnerabilities safely.

---

## 📋 Changelog

Please see our dedicated [CHANGELOG.md](CHANGELOG.md) file for a detailed history of all updates and releases.

---

## 📜 License

MIT License — See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by SEOSONA. Powered by the Prime Directive.**

*"Always learning, upgrading, optimizing, automating, developing, improving... from new data, new information, new knowledge. Learn from mistakes to be better."*

</div>
