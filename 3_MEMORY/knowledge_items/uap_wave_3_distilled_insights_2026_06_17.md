# UAP Ingestion Wave 3 — Knowledge Items

_Distilled knowledge from 16 GitHub repositories analyzed on 2026-06-17._
_Source: `~/.seosona/5_RESEARCH/uap_ingestion_wave_3_2026_06_17.md`_

---

## 1. Agent Skills Architecture (addyosmani/agent-skills)

**Source**: https://github.com/addyosmani/agent-skills
**Category**: Agentic Workflows / Skill Architecture
**Stars**: High (Addy Osmani, Google Chrome team)

### Core Architecture Pattern
- Skills are **production-grade engineering skills** specifically designed for AI coding agents
- Each skill is a self-contained unit with clear input/output contracts
- Skills focus on **code quality, testing, debugging, and refactoring**
- The repository serves as a reference library that any AI agent can consume

### Key Differences from SEOSONA SKILL.md Format
| Aspect | addyosmani/agent-skills | SEOSONA OS SKILL.md |
|---|---|---|
| Format | Markdown with structured sections | YAML frontmatter + Markdown body |
| Routing | Tag-based discovery | Keyword-based via SKILLS_ROUTER.md |
| Scope | Engineering-focused only | Multi-domain (SEO, Marketing, DevOps, etc.) |
| Composition | Skills reference each other | Skills are largely independent |
| Validation | Embedded quality criteria | External via quality_scorer.py |

### Actionable Insights for SEOSONA OS
1. **Add quality criteria directly into SKILL.md**: Each skill should define its own validation rules
2. **Implement skill composition**: Allow skills to explicitly declare dependencies on other skills
3. **Tag-based routing supplement**: Add semantic tags alongside keyword matching in SKILLS_ROUTER

---

## 2. Anthropic Knowledge Work Plugins (anthropics/knowledge-work-plugins)

**Source**: https://github.com/anthropics/knowledge-work-plugins
**Category**: Agentic Workflows / MCP Integration

### Core Architecture Pattern
- Official Anthropic plugins for Claude's knowledge work capabilities
- Plugin = **Tool Definition** + **System Prompt Fragment** + **Example Invocations**
- Designed as MCP-first, meaning they expose tools via Model Context Protocol
- Focus on productivity tasks: document analysis, data extraction, research synthesis

### Actionable Insights for SEOSONA OS
1. **Adopt MCP-native plugin format**: Align our Skills to also expose as MCP tools
2. **System prompt fragments**: Each skill should provide a prompt fragment that can be injected contextually
3. **Example-driven validation**: Include example invocations in every SKILL.md for self-testing

---

## 3. System Prompt Intelligence (x1xhlol/system-prompts-and-models-of-ai-tools)

**Source**: https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools
**Category**: Agentic Workflows / Prompt Engineering

### Key Patterns Extracted from Production System Prompts
1. **Instruction Layering**: Production prompts use a strict hierarchy (Identity → Rules → Tools → Context → Examples)
2. **Persona Switching**: Dynamic role activation based on context (similar to our Personaplex)
3. **Guardrail Patterns**: Explicit safety boundaries with escalation protocols
4. **Memory Integration**: Instructions for when to persist vs discard information
5. **Tool Usage Patterns**: Strict tool selection rules with fallback chains

### Actionable Insights for SEOSONA OS
1. **Validate our SOUL.md structure** against industry patterns — our layering is already strong
2. **Adopt explicit guardrail sections** in SOUL.md for safety boundaries
3. **Study fallback chains** for tool selection to improve our capability bridge routing

---

## 4. Multi-Channel Content Ingestion (chubbyguan/chubbyskills)

**Source**: https://github.com/chubbyguan/chubbyskills
**Category**: Content Marketing / Knowledge Ingestion

### Core Architecture Pattern
- **13 specialized AI Skills** for different content channels:
  - Douyin (TikTok China), Bilibili, Xiaohongshu, WeChat, X (Twitter), Podcasts
- **Content type routing**: Image posts → save images, Video posts → transcribe, Text posts → extract
- **Subtitle-first transcription**: Avoids GPU-heavy speech recognition by preferring subtitle extraction
- **KB MCP Server**: A dedicated MCP server for querying the accumulated knowledge base

### Actionable Insights for SEOSONA OS
1. **Create Vietnamese market equivalents**: Skills for Facebook, TikTok Vietnam, Zalo, YouTube Vietnam
2. **Subtitle-first approach**: Optimize our video_audio_ingestion skill to prioritize subtitles over ASR
3. **KB MCP Server pattern**: Build a dedicated MCP server for querying SEOSONA's knowledge base
4. **Content type router**: Auto-detect content format and route to appropriate ingestion skill

---

## 5. Website Cloning Automation (JCodesMore/ai-website-cloner-template)

**Source**: https://github.com/JCodesMore/ai-website-cloner-template
**Category**: Frontend Engineering / Competitive Intelligence

### Core Architecture Pattern
- AI-powered website cloning that converts any webpage into React/HTML components
- Pipeline: **Scrape → Analyze → Decompose → Generate → Assemble**
- Uses LLM to understand page structure and generate clean, componentized code

### Actionable Insights for SEOSONA OS
1. **Integrate into competitor_intelligence skill**: Auto-clone competitor landing pages for analysis
2. **Template generation**: Use cloning as a starting point for client website projects
3. **Design system extraction**: Auto-extract color palettes, typography, spacing from any website

---

## 6. Claude Memory Persistence (thedotmack/claude-mem)

**Source**: https://github.com/thedotmack/claude-mem
**Category**: Agentic Workflows / Memory Management

### Core Architecture Pattern
- Persistent memory management specifically designed for Claude-based agents
- Key-value store with semantic search capabilities
- Session-aware: knows when to persist vs when memory is ephemeral

### Comparison with SEOSONA DMP (Dreaming Memory Protocol)
| Aspect | claude-mem | SEOSONA DMP |
|---|---|---|
| Storage | Key-value store | File-based (3_MEMORY/) |
| Search | Semantic vector search | Keyword matching via knowledge_graph.py |
| Persistence | Automatic | Background sub-agent (fan-out) |
| Compression | Token-aware compression | Context cleaning optimization SOP |
| Cross-session | Built-in | Via mem0 integration |

### Actionable Insights for SEOSONA OS
1. **Add semantic search to 3_MEMORY/**: Upgrade from keyword to vector-based retrieval
2. **Token-aware compression**: Implement token budgeting in our context cleaning SOP
3. **Automatic persistence triggers**: Define clear rules for when to auto-save vs discard

---

## 7. Open Skills Format (numman-ali/openskills)

**Source**: https://github.com/numman-ali/openskills
**Category**: Agentic Workflows / Interoperability

### Key Pattern
- Open format for defining AI agent skills that can be shared across platforms
- Focus on interoperability: skills should work with any LLM agent framework

### Actionable Insights for SEOSONA OS
1. **Export SEOSONA skills in OpenSkills format**: Enable cross-platform skill sharing
2. **Import external skills**: Consume skills from the OpenSkills ecosystem
3. **Standardize our SKILL.md to be interoperable** with emerging open standards

---

## Summary of Upgrades Recommended

| Priority | Upgrade | Source Repository | Impact |
|---|---|---|---|
| 🔴 P0 | Add quality criteria to SKILL.md | addyosmani/agent-skills | Improves skill reliability |
| 🔴 P0 | Study Anthropic plugin contracts | anthropics/knowledge-work-plugins | MCP-native skill exposure |
| 🟡 P1 | Build Vietnamese content ingestion skills | chubbyguan/chubbyskills | Market expansion |
| 🟡 P1 | Implement semantic search in 3_MEMORY/ | thedotmack/claude-mem | Better memory retrieval |
| 🟡 P1 | Website cloning pipeline | JCodesMore/ai-website-cloner-template | Competitive intelligence |
| 🟢 P2 | OpenSkills format interoperability | numman-ali/openskills | Ecosystem integration |
| 🟢 P2 | Validate SOUL.md against industry prompts | x1xhlol/system-prompts-and-models-of-ai-tools | Prompt quality assurance |
