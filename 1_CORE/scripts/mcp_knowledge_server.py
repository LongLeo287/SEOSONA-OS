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
import re
from pathlib import Path

_THIS = Path(__file__).resolve()
SEOSONA_ROOT = _THIS.parent.parent.parent            # …/scripts -> …/1_CORE -> repo root
MEMORY_DIR = SEOSONA_ROOT / "3_MEMORY" / "knowledge_items"
sys.path.insert(0, str(_THIS.parent / "core"))


def _semantic_search(query: str, limit: int):
    """Hybrid BM25+TF-IDF search via the persisted index.

    Returns ``(results, error)``. The error is surfaced to the caller rather than swallowed: the
    old version caught every failure — a missing scikit-learn, a corrupt index, an OOM — and
    returned ``[]``, which is indistinguishable from "nothing matched". On a machine without the
    dependencies installed that made the brain answer empty forever, silently, with exit 0.
    """
    try:
        from vector_memory import query_semantic_memory
        return (query_semantic_memory(query, limit) or []), None
    except ImportError as e:
        return [], (
            f"semantic backend unavailable ({e}). Install dependencies: "
            "pip install -r requirements.txt — retrieval is running in DEGRADED lexical mode."
        )
    except Exception as e:  # noqa: BLE001 - corrupt index, OOM, anything else
        return [], f"semantic backend failed: {type(e).__name__}: {e}"


def _lexical_search(query: str, limit: int):
    """Token-overlap fallback for when the semantic backend is unavailable.

    The previous version tested ``if query.lower() in content.lower()`` — the WHOLE query as one
    substring. A three-word question essentially never appears verbatim in a document, so the
    "graceful degradation" this docstring promised actually returned nothing, every time. Now each
    term is scored independently and the best documents are returned, which is what a fallback is for.
    """
    terms = [t for t in re.split(r"\W+", query.lower()) if len(t) > 2]
    if not terms or not MEMORY_DIR.exists():
        return []

    scored = []
    for file in MEMORY_DIR.rglob("*.md"):
        try:
            content = file.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        low = content.lower()
        hits = sum(1 for t in terms if t in low)
        if hits:
            scored.append((hits, file, content))

    scored.sort(key=lambda x: -x[0])
    return [{
        "title": f.stem,
        "portablePath": "~/.seosona/" + str(f.relative_to(SEOSONA_ROOT)).replace("\\", "/"),
        "score": round(hits / len(terms), 4),
        "snippet": c[:200].replace("\n", " ") + "...",
    } for hits, f, c in scored[:limit]]


def search_knowledge(query: str, limit: int = 5) -> str:
    """Search the SEOSONA knowledge base (semantic first, lexical fallback).

    A degraded backend is reported in the payload AND on stderr, so "the brain is broken" can never
    again look identical to "nothing matched".
    """
    hits, error = _semantic_search(query, limit)
    backend = "hybrid_bm25_tfidf"
    if error:
        print(f"[knowledge] DEGRADED: {error}", file=sys.stderr)
        hits = _lexical_search(query, limit)
        backend = "lexical_degraded"

    payload = {"query": query, "backend": backend, "results": hits}
    if error:
        payload["warning"] = error
    return json.dumps(payload, ensure_ascii=False)


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
