#!/usr/bin/env python3
"""
SEOSONA OS — MCP Knowledge Server (real stdio MCP, not a stub).

Exposes the 3_MEMORY/knowledge_items corpus (incl. the ~1,200 UAP KIs) to any MCP client as a
searchable tool, so the knowledge base is queried at runtime instead of sitting inert on disk.

Backend: the persisted TF-IDF index (3_MEMORY/vector_index) via core.vector_memory — semantic
cosine ranking, warm-started from disk. Falls back to a lexical substring scan if the index or
sklearn is unavailable, so the tool always answers.

Run modes:
  python mcp_knowledge_server.py            → MCP stdio server (registered in .mcp.json)
  python mcp_knowledge_server.py --query X  → one-shot CLI search (debug / scripts)
"""
import sys
import json
import argparse
from pathlib import Path

_THIS = Path(__file__).resolve()
SEOSONA_ROOT = _THIS.parent.parent.parent            # …/scripts -> …/1_CORE -> repo root
MEMORY_DIR = SEOSONA_ROOT / "3_MEMORY" / "knowledge_items"
sys.path.insert(0, str(_THIS.parent / "core"))


def _semantic_search(query: str, limit: int):
    """TF-IDF cosine search via the persisted index. Returns [] if the backend is unavailable."""
    try:
        from vector_memory import query_semantic_memory
        return query_semantic_memory(query, limit) or []
    except Exception:
        return []


def _lexical_search(query: str, limit: int):
    """Substring fallback so the tool degrades gracefully with no index."""
    results = []
    if MEMORY_DIR.exists():
        q = query.lower()
        for file in MEMORY_DIR.rglob("*.md"):
            try:
                content = file.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            if q in content.lower():
                results.append({
                    "title": file.stem,
                    "portablePath": "~/.seosona/" + str(file.relative_to(SEOSONA_ROOT)).replace("\\", "/"),
                    "score": None,
                    "snippet": content[:200].replace("\n", " ") + "...",
                })
                if len(results) >= limit:
                    break
    return results


def search_knowledge(query: str, limit: int = 5) -> str:
    """Search the SEOSONA knowledge base (semantic first, lexical fallback)."""
    hits = _semantic_search(query, limit)
    backend = "tfidf"
    if not hits:
        hits = _lexical_search(query, limit)
        backend = "lexical"
    return json.dumps({"query": query, "backend": backend, "results": hits}, ensure_ascii=False)


def _run_mcp():
    from mcp.server.fastmcp import FastMCP
    mcp = FastMCP("seosona-knowledge")

    @mcp.tool()
    def knowledge_search(query: str, limit: int = 5) -> str:
        """Semantic search over the SEOSONA OS knowledge base (3_MEMORY/knowledge_items, incl. all
        UAP-harvested KIs). Use to recall what a repo/tool/technique does before proposing work.
        Returns JSON: {query, backend, results:[{title, portablePath, score, ...}]}."""
        return search_knowledge(query, limit)

    mcp.run()


def main():
    parser = argparse.ArgumentParser(description="SEOSONA MCP Knowledge Server")
    parser.add_argument("--query", type=str, help="One-shot CLI search (debug)")
    args = parser.parse_args()
    if args.query:
        print(search_knowledge(args.query))
    else:
        _run_mcp()


if __name__ == "__main__":
    main()
