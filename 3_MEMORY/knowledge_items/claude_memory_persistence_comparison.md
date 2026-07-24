# KI: Claude Memory Persistence Comparison

_Source: UAP Wave 3 analysis of `thedotmack/claude-mem` vs SEOSONA Dreaming Memory Protocol_

## SEOSONA DMP (Dreaming Memory Protocol)
- **Storage**: File-based in `3_MEMORY/` (logs, specs, errors, knowledge_items, sessions)
- **Encoding**: `memory_encoding_workflow.md` runs continuously during sessions
- **Retrieval**: Manual file reading + `session_memory.py` for cross-session metrics
- **Hooks**: `memory-logger.cjs` auto-logs to `3_MEMORY/logs/` on every file write
- **Graph**: `knowledge_graph.py` (259+ nodes) for semantic retrieval
- **Decay**: Time-decay learning in `session_memory.py`

## claude-mem Approach
- **Storage**: SQLite database with vector embeddings
- **Encoding**: Automatic extraction of key facts, decisions, and preferences
- **Retrieval**: Semantic similarity search via embeddings
- **Persistence**: Survives across Claude sessions via local database
- **Categorization**: Facts, preferences, project context, decisions

## Comparison

| Dimension | SEOSONA DMP | claude-mem |
|---|---|---|
| **Storage** | Markdown files (human-readable) | SQLite + vectors (machine-optimized) |
| **Retrieval** | Knowledge graph + file scan | Vector similarity search |
| **Human Readability** | ✅ Excellent | ❌ Requires tooling |
| **Search Speed** | ⚠️ Slower (file scan) | ✅ Fast (indexed) |
| **Cross-tool** | ✅ Any tool can read .md files | ❌ Claude-specific |
| **Semantic Search** | ⚠️ Via knowledge_graph.py | ✅ Native embeddings |
| **Git-friendly** | ✅ Plain text diffs | ❌ Binary database |

## Recommendations for SEOSONA OS
1. **Keep DMP's file-based approach** — it's superior for git versioning and cross-tool compatibility.
2. **Add vector index layer**: Run embeddings on KIs and store in a lightweight vector store (e.g., FAISS or chromadb) alongside the markdown files.
3. **Auto-categorization**: Adopt claude-mem's categorization (facts, preferences, decisions) as metadata tags in KI files.
4. **Hybrid search**: Use knowledge_graph.py for structured queries + vector search for fuzzy/semantic queries.
