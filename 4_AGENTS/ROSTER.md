# SEOSONA OS — Agent Roster (v1.0)

This document is the **authoritative registry** of all AI agents and personas available in SEOSONA OS.

> [!NOTE]
> SEOSONA OS operates a **two-tier agent system**:
> - **Tier 1 (Core):** Orchestration and routing agents defined in `1_CORE/agents/`
> - **Tier 2 (Specialists):** Domain-specific personas defined in `4_AGENTS/personas/`

---

## TIER 1 — Core System Agents

| Agent | File | Role |
|---|---|---|
| **Orchestrator** | `1_CORE/agents/orchestrator_agent.md` | Routes user requests to correct skill/persona |

---

## TIER 2 — Specialist Personas (35 agents)

### 📈 Marketing & Growth
| Agent | Primary Expertise |
|---|---|
| `attraction-specialist` | Lead generation, traffic attraction |
| `campaign-manager` | Multi-channel campaign management |
| `campaign-debugger` | Campaign diagnostics & optimization |
| `community-manager` | Community growth & engagement |
| `seo-specialist` | SEO strategy & execution |
| `seo-content-master` | Advanced SEO content structuring |
| `seo-topical-map-architect` | Semantic SEO & topical authority mapping |
| `social-media-manager` | Social media content & scheduling |
| `copywriter` | Persuasive writing, copy frameworks |
| `email-wizard` | Email sequences & automation |
| `lead-qualifier` | Lead scoring & qualification |
| `upsell-maximizer` | Upsell & cross-sell strategy |
| `funnel-architect` | Funnel design & optimization |
| `sale-enabler` | Sales process & collateral |

### 💻 Engineering & Tech
| Agent | Primary Expertise |
|---|---|
| `fullstack-developer` | Full-stack web development |
| `nextjs-autofix-bot` | NextJS/React bug fixing & refactoring |
| `database-admin` | Database design & management |
| `debugger` | Bug diagnosis & resolution |
| `code-reviewer` | Code quality & best practices |
| `tester` | QA, testing strategies |
| `git-manager` | Git workflows, branching, releases |
| `mcp-manager` | MCP server management |

### 📝 Content & Creation
| Agent | Primary Expertise |
|---|---|
| `content-strategist` | High-level content planning |
| `content-creator` | Content strategy & creation |
| `content-reviewer` | Content quality & fact-checking |
| `journal-writer` | Journaling, reflection, documentation |
| `docs-manager` | Technical documentation |

### 🧠 Research & Strategy  
| Agent | Primary Expertise |
|---|---|
| `researcher` | Deep research & synthesis |
| `analyst` → `analytics-analyst` | Data analytics & interpretation |
| `planner` | Project & strategic planning |
| `project-manager` | Team coordination, timelines |
| `scout` | External landscape mapping |
| `scout-external` | Competitive intelligence |
| `continuity-specialist` | Knowledge continuity & handoffs |
| `ui-ux-designer` | User interface & experience design |

---

## USAGE

To invoke a specialist persona, reference it by name in your request:
```
"As a copywriter, write a landing page for..."
"Use the funnel-architect to design a..."
"Ask the seo-specialist to audit..."
```

The Orchestrator will automatically route to the correct persona based on semantic matching via `SKILLS_ROUTER.md`.
