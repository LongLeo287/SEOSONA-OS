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
        EXCEL[(Inventory.xlsx)]:::ingestion --> FINDER[1. Finder]:::ingestion
        FINDER --> AUDITOR[2. Auditor]:::ingestion
        AUDITOR --> SEC_GUARD{3. Security Guard}:::ingestion
        SEC_GUARD -->|Safe| ASSIMILATOR[4. Assimilator]:::ingestion
        SEC_GUARD -->|Malicious| QUARANTINE[🛑 Quarantine]
        ASSIMILATOR --> CREATOR[5. Creator]:::ingestion
        CREATOR --> CLEANUP[6. Cleanup]:::ingestion
    end
    
    %% Connections
    ASSIMILATOR -.->|Generates AAAK| MEMORY
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
> **Air-Gapped Analysis:** The `5_RESEARCH` zone is strictly isolated. All downloaded code is scanned by `02b_security_guard.py` for destructive commands (e.g., `rm -rf /`) and reverse shells **before** any AI is allowed to process the context. Malicious repos are instantly dropped.
