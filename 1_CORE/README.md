<!-- seosona-ignore-lang -->
# 🧠 1_CORE: The Brain & Governance

**[English]**  
`1_CORE` is the central nervous system of SEOSONA OS. It contains the master intelligence (`SOUL.md`), core Python/Node orchestrators, system-level task planners, and security protocols. Modifications here dictate how the entire operating system and its connected AI agents behave globally.

**[Tiếng Việt]**  
`1_CORE` là hệ thần kinh trung ương của SEOSONA OS. Thư mục này chứa trí tuệ chủ (`SOUL.md`), các kịch bản điều phối cốt lõi (orchestrators), bộ lập kế hoạch nhiệm vụ cấp hệ thống, và các quy tắc bảo mật. Mọi thay đổi ở đây sẽ định hình cách toàn bộ hệ điều hành và các AI Agent hoạt động.

---

## 📂 Structure / Cấu trúc

- 🧠 **`SOUL.md`**: The Master Prompt (Chỉ thị Tối cao). This is injected into every IDE and CLI tool. Do not alter without understanding the SEOSONA Omni-Brain Protocol.
- ⚙️ **`scripts/`**: Core operational scripts. Includes the Context Engine (`context_engine.py`), Knowledge Graph builder (`knowledge_graph.py`), and major workflows like `run_full_audit.py`.
- 🤖 **`agents/`**: System orchestrator agents responsible for delegating tasks to sub-personas.
- 🔄 **`workflows/`**: System-level autonomous loop definitions (e.g., automated SEO analysis chains).
- 🛡️ **`rules/`**: Global boundary conditions, security firewalls, and interface rules.

## 🚨 Core Rules / Quy tắc Cốt lõi

1. **Restricted Access:** Normal operational agents (e.g., Frontend coder, SEO writer) are strictly **FORBIDDEN** from modifying `1_CORE`. Only the System Architect or explicit user commands can alter these files.
2. **Backward Compatibility:** Any update to `scripts/` (such as the plugin manager or context engine) must ensure that existing skills in `2_KNOWLEDGE` do not break.
3. **No Bloat:** Do not store data, logs, or raw outputs here. They belong in `3_MEMORY`.

## Contents

| Folder | What's inside |
|---|---|
| `scripts/` | The engine room — context engine, dispatcher, UAP pipeline, connectors, capability bridge, MCP servers, daemons, `core/`. |
| `bin/` | Vendored binaries (the `codebase-memory-mcp` code-nav server — fetched via its `install.ps1`). |
| `hooks/` | Git hook logic (integrity guard, English-only lint) installed by `postinstall`. |
| `workflows/` | Reusable OS workflow definitions (agent creation, ingestion, maintenance). |
| `agents/` | Core agent definitions used by the runtime. |

| File | Purpose |
|---|---|
| `SOUL.md` | The master doctrine injected into every AI tool — the OS's operating philosophy + always-on rules. |
| `PORTABLE_CAPABILITY_CONTRACT.md` | The contract every portable capability must satisfy to be routable. |
