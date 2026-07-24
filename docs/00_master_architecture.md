# SEOSONA OS: Master Architecture

SEOSONA OS is a Universal AI Operating System that injects a unified intelligence layer (`SOUL.md`) into your local environment, effectively giving every AI coding tool (Cursor, Windsurf, Codex, etc.) shared memory, skills, and context.

---

## 🏛️ The OmniClaw Architecture

The system is designed as a decentralized "Omni-Brain" that anchors to your machine and intercepts communications between you and your AI tools.

```mermaid
graph TD
    %% Styling
    classDef user fill:#2d3748,stroke:#4a5568,stroke-width:2px,color:#fff;
    classDef core fill:#4299e1,stroke:#2b6cb0,stroke-width:2px,color:#fff,font-weight:bold;
    classDef memory fill:#48bb78,stroke:#2f855a,stroke-width:2px,color:#fff;
    classDef ingestion fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#fff;
    classDef execution fill:#9f7aea,stroke:#6b46c1,stroke-width:2px,color:#fff;

    %% Nodes
    USER([👨‍💻 User]):::user --> CLI[Terminal / CLI / Custom Script]:::user
    CLI --> ORCH{SEOSONA Orchestrator}:::core
    
    subgraph Core Intelligence [🧠 The Omni-Brain]
        ORCH --> SOUL[📄 SOUL.md - Master Prompt]:::core
        ORCH --> KNOWLEDGE[(🌐 Knowledge Graph)]:::memory
        ORCH --> SKILLS[[🛠️ Dynamic Skills]]:::memory
        ORCH --> MEMORY[(💾 AAAK Long-term Memory)]:::memory
    end
    
    subgraph UAP [🏭 Universal Assimilation Pipeline]
        QUEUE[(uap_queue.db<br/>SQLite work-queue)]:::ingestion --> MANAGER{{uap_manager<br/>daemon loop}}:::ingestion
        MANAGER --> FINDER[01 Finder · clone]:::ingestion
        FINDER --> AUDITOR[02 Auditor · profile]:::ingestion
        AUDITOR --> SEC_GUARD{02b Security Guard}:::ingestion
        SEC_GUARD -->|HARD flag| QUARANTINE[🛑 Drop / Quarantine]
        SEC_GUARD -->|Safe / SOFT| ASSIMILATOR[03 Assimilator]:::ingestion
        ASSIMILATOR --> CLASSIFIER{{classifier<br/>evidence-tiered fit}}:::ingestion
        CLASSIFIER -->|fit ≥ threshold| CREATOR[04 Creator · skill gen]:::ingestion
        CLASSIFIER -->|below threshold| SHELVE[📥 KI only, no skill]
        CREATOR --> CLEANUP[05 Cleanup · reclaim disk]:::ingestion
    end
    
    %% Connections
    ASSIMILATOR -.->|Generates KI / AAAK| MEMORY
    CREATOR -.->|Registers| SKILLS
    
    subgraph Execution Layer [⚡ IDE & AI Tools]
        SOUL --> CURSOR[Cursor IDE]:::execution
        SOUL --> WINDSURF[Windsurf]:::execution
        SOUL --> CLI_TOOLS[Aider / Codex]:::execution
    end
```

> [!NOTE]  
> The OmniClaw Architecture guarantees **Zero Hardcodes**. By using an OS-level symlink (`~/.seosona`), the core intelligence can be securely moved or relocated without breaking the Execution Layer.

---

## 🧩 System Modules & Technologies

SEOSONA OS is compartmentalized into 5 distinct operational zones, each governed by its own technology stack.

| Zone | Purpose | Core Technologies | Data Formats |
| :--- | :--- | :--- | :--- |
| **`1_CORE`** | The brain's processing center. Contains master prompts, the UAP daemon, and intent routing logic. | Python 3.11+, SQLite, AsyncIO | `.md`, `.py` |
| **`2_KNOWLEDGE`** | The active Skill Ecosystem. Contains generated frameworks, templates, and the Semantic Index. | LLM Routing, Regex Scanners | `SKILL.md`, `YAML` |
| **`3_MEMORY`** | Long-term retention. Stores the compressed architectural specs of all ingested repositories. | MemPalace Protocol | `.aaak`, `.db`, `.json` |
| **`4_AGENTS`** | Personnel Roster. Defines the cognitive boundaries of specialized AI Personas. | Prompt Engineering | `.md` |
| **`5_RESEARCH`** | The Sandbox. A temporary, isolated quarantine zone for cloning and auditing untrusted code. | Git, OSINT Scrapers | Raw Source Code |

---

## 🔒 Security Posture

> [!CAUTION]
> **Air-Gapped Analysis:** The `5_RESEARCH` zone is strictly isolated. Every cloned repo is scanned by `02b_security_guard.py` **before** assimilation. It raises a **HARD** flag on leaked secrets (AWS/Google/GitHub keys, private keys) and outright-destructive payloads → the repo is dropped and never processed; a **SOFT** flag on suspicious-but-common patterns (`curl … | sh`, prompt-injection strings) → warn and continue. Only clean/SOFT repos reach the Assimilator.

### The pipeline in reality

Work is driven by `uap_manager.py`, a daemon that pulls repos from a SQLite queue (`3_MEMORY/uap_queue.db`, statuses `PENDING → AUDITED → ASSIMILATED → CREATED → COMPLETED`, with `FAILED`/`BLOCKED` error terminals) — **not** from a spreadsheet. A HARD security block is a fast-path drop: the guard marks the repo `CREATED` so Cleanup reclaims its clone without ever assimilating it or generating a skill. Each surviving repo flows through numbered stages:

| Stage | Script | Does |
| :--- | :--- | :--- |
| 01 Finder | `01_finder.py` | Clones the queued repo into `5_RESEARCH`. |
| 02 Auditor | `02_auditor.py` | Profiles structure, language, and intent. |
| 02b Security Guard | `02b_security_guard.py` | HARD/SOFT threat scan (see above). |
| 03 Assimilator | `03_assimilator.py` | Compresses the repo into a Knowledge Item (KI/AAAK) in `3_MEMORY`. |
| — Classifier | `classifier.py` | Evidence-tiered fit score (strong signals weighted ~22× vs weak ~6×); only repos at/above the fit threshold graduate to a generated skill. |
| 04 Creator | `04_creator.py` | Generates a runnable skill + registers it. |
| 05 Cleanup | `05_cleanup.py` | Reclaims the `5_RESEARCH` clone to free disk. |

A crash mid-flight marks only the oldest in-flight repo `FAILED` (with a retry counter) so the queue never wedges.
