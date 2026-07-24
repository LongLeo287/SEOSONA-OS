# WORKFLOW: Dreaming Memory Protocol (DMP)

**Purpose:** To continuously and dynamically curate, synthesize, and encode project decisions, timelines, and bugs into the system's Spatial Memory (Mempalace) without interrupting the primary operational thread. This prevents context loss and simulates background "dreaming."

**Trigger:** Automatically triggered as a continuous background sub-agent process during any active session, OR manually requested for immediate deep-synthesis.

## AUTOMATED 3-STEP BACKGROUND SEQUENCE

### Step 1: BACKGROUND SYNTHESIS (DREAMING)
- A background `Memory Synthesis Agent` (or `ARIS Research Loop`) continuously monitors the chat history and diff logs.
- It identifies evolving contexts (e.g., changing project scope, resolved bugs, new architecture patterns) and extracts the essence without waiting for explicit milestones.

### Step 2: CATEGORIZE & ROUTE
The sub-agent classifies the synthesized essence:
- **Permanent Standards & Evolution:** (e.g., UI/UX tokens, API schemas that have been finalized or updated). -> Route to **Wings**.
- **Session Continuity & Flow:** (e.g., "Currently implementing Hero.tsx, blocked by API issue"). -> Route to **Rooms**.
- **Error Signatures & Debugging:** (e.g., "Webpack out of memory fix"). -> Route to **Drawers**.

### Step 3: COMPRESS & ENCODE (The Dream Merge)
- Seamlessly merge the new insights into `3_MEMORY/{category}/` using fluid context updates.
- **Token-Aware Compression**: The agent MUST calculate a token budget. If a memory file exceeds optimal token capacity, automatically invoke the `context_compression` engine to produce highly dense `.aaak` artifacts, stripping out verbatim dialogue while preserving semantic intent and technical debt markers.
- **Semantic Vector Indexing**: After compression, trigger the knowledge graph builder (`knowledge_graph.py --build --embed`) to create dense semantic vectors for the new memory. This enables cross-session vector search (similar to `claude-mem`) rather than relying solely on keyword matching.
