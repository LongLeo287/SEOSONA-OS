# WORKFLOW: Universal Assimilation Protocol (UAP)

**Purpose:** To ensure the system actively evolves whenever it receives *any* form of external data. It prevents the system from passively storing files as "junk" and instead enforces an active learning and upgrade cycle.
**Trigger:** Whenever the user provides a Repository, Image, PDF, Text, Link, or explicitly asks to "analyze/learn this".

## AUTOMATED 4-STEP SEQUENCE
*Whenever triggered, the Agent MUST execute all 4 steps sequentially.*

### Step 1: ANALYZE
- All raw data, **including cloned repositories**, single files, or scraped links, must be temporarily stored in the buffer zone `3_MEMORY/ingestion_zone/`.
- Read and extract the content of the file/repo/link.
- Identify the nature: Is this code logic, a design pattern, a workflow, or theoretical knowledge?
- Filter out noise and boilerplate. Identify the **Unique Value**.

### Step 2: REVIEW
- Compare the extracted core value with the current system structure (`1_CORE`, `2_KNOWLEDGE`, `3_MEMORY`).
- Ask: Does the system already possess this knowledge/skill? Can this input be used to optimize existing frameworks?

### Step 3: LEARN
- Extract methodologies, best practices, or reference documentation.
- If it's theoretical/reference knowledge, write a `.md` file into `2_KNOWLEDGE/raw_data/` (or update an existing file).
- Report to the user exactly what the system has learned.

### Step 4: UPGRADE
Transform static knowledge into active system execution capabilities:
- **Skillization**: If the input is a marketing/SEO capability -> Generate a complete `SKILL.md` inside `2_KNOWLEDGE/frameworks/seo_marketing/`. Include frontmatter metadata with `keywords` in multiple languages (e.g., English + Vietnamese) to support natural language routing.
- **Agentization**: If the input represents an entire business domain -> Create an Agent Persona in `4_AGENTS/personas/` and register it in `4_AGENTS/ROSTER.md`.
- **Integration**: MUST update `2_KNOWLEDGE/SKILLS_ROUTER.md` and `2_KNOWLEDGE/MASTER_INDEX.md` to wire this new Skill/Agent into the system's collective awareness.
- **Cleanup**: Delete the cloned repository and any temporary files in `3_MEMORY/ingestion_zone/`. **Strictly enforce this deletion** to ensure the system remains lean and clean.

---
**Commitment:** Every input provided to the SEOSONA System must be assimilated into system power. No raw data or cloned repositories are permanently kept inside the system architecture.
