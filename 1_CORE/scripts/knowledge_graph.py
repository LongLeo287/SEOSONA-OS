#!/usr/bin/env python3
"""
SEOSONA OS V5 — Knowledge Graph Engine (LightRAG-inspired)

Replaces flat SKILLS_ROUTER.md keyword matching with a graph-based
retrieval system. Each SKILL.md becomes a node, with edges representing
semantic relationships (dependency, similarity, category).

Key features (inspired by LightRAG):
  - Dual-level retrieval: entity-level (specific skill) + topic-level (category)
  - Entity extraction from SKILL metadata
  - Relationship edges: depends_on, related_to, category_of
  - Multi-hop traversal for complex queries

Usage:
    from knowledge_graph import KnowledgeGraph
    kg = KnowledgeGraph()
    kg.build_from_skills()
    results = kg.query("technical SEO audit with schema validation")
"""

from __future__ import annotations

import json
import re
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Set, Tuple


ROOT = Path(__file__).resolve().parents[2]
KG_DIR = ROOT / "3_MEMORY" / "knowledge_graph"
SKILLS_DIR = ROOT / "2_KNOWLEDGE" / "frameworks"
ROUTER_PATH = ROOT / "2_KNOWLEDGE" / "SKILLS_ROUTER.md"


@dataclass
class GraphNode:
    """A node in the knowledge graph (represents a SKILL or category)."""
    id: str
    label: str
    node_type: str  # "skill", "category", "entity"
    path: Optional[str] = None
    keywords: List[str] = field(default_factory=list)
    description: str = ""
    metadata: Dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class GraphEdge:
    """An edge connecting two nodes."""
    source: str
    target: str
    relation: str  # "depends_on", "related_to", "category_of", "similar_to"
    weight: float = 1.0

    def to_dict(self) -> dict:
        return asdict(self)


class KnowledgeGraph:
    """
    Graph-based knowledge retrieval engine.

    Nodes = SKILLs + Categories + Entities
    Edges = Dependencies + Semantic similarity + Category membership
    """

    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.edges: List[GraphEdge] = []
        self._adjacency: Dict[str, List[Tuple[str, str, float]]] = {}  # node_id -> [(target, relation, weight)]
        self._keyword_index: Dict[str, Set[str]] = {}  # keyword -> set of node_ids
        self.built_at: Optional[str] = None

    def add_node(self, node: GraphNode):
        self.nodes[node.id] = node
        for kw in node.keywords:
            kw_lower = kw.lower().strip()
            if kw_lower not in self._keyword_index:
                self._keyword_index[kw_lower] = set()
            self._keyword_index[kw_lower].add(node.id)

    def add_edge(self, edge: GraphEdge):
        self.edges.append(edge)
        if edge.source not in self._adjacency:
            self._adjacency[edge.source] = []
        self._adjacency[edge.source].append((edge.target, edge.relation, edge.weight))

    def build_from_skills(self):
        """
        Build the knowledge graph by scanning all SKILL.md files
        and the SKILLS_ROUTER.md index.
        """
        # Step 1: Parse SKILLS_ROUTER.md for category structure
        self._parse_router()

        # Step 2: Scan all SKILL.md files for metadata
        self._scan_skill_files()

        # Step 3: Infer edges from shared keywords
        self._infer_similarity_edges()

        self.built_at = datetime.now().isoformat()
        self.save()

        stats = self.get_stats()
        print(f"   [KG] Knowledge Graph built: {stats['nodes']} nodes, {stats['edges']} edges, {stats['keywords']} keywords")

    def _parse_router(self):
        """Parse SKILLS_ROUTER.md to extract category -> skill mappings."""
        if not ROUTER_PATH.exists():
            return

        content = ROUTER_PATH.read_text(encoding="utf-8")
        current_category = None

        for line in content.splitlines():
            line = line.strip()

            # Detect category headers: ## Category Name
            if line.startswith("## "):
                cat_name = line[3:].strip()
                cat_id = f"cat:{_slugify(cat_name)}"
                current_category = cat_id
                self.add_node(GraphNode(
                    id=cat_id,
                    label=cat_name,
                    node_type="category",
                    keywords=[cat_name.lower()],
                ))

            # Detect skill entries: - `keyword` -> `path/`
            elif line.startswith("- ") and "->" in line and current_category:
                match = re.match(r"- (.+?)\s*->\s*`?(.+?)`?\s*$", line)
                if match:
                    raw_keywords = match.group(1)
                    skill_path = match.group(2).strip().rstrip("/")
                    skill_id = f"skill:{_slugify(skill_path.split('/')[-1])}"

                    # Extract keywords from backtick-delimited entries
                    keywords = [k.strip().strip("`").strip("'\"") for k in raw_keywords.split(",")]
                    keywords = [k for k in keywords if k]

                    if skill_id not in self.nodes:
                        self.add_node(GraphNode(
                            id=skill_id,
                            label=keywords[0] if keywords else skill_path.split("/")[-1],
                            node_type="skill",
                            path=skill_path,
                            keywords=keywords,
                        ))

                    # Edge: category -> skill
                    self.add_edge(GraphEdge(
                        source=current_category,
                        target=skill_id,
                        relation="category_of",
                        weight=1.0,
                    ))

    def _scan_skill_files(self):
        """Scan SKILL.md files for additional metadata (description, dependencies)."""
        if not SKILLS_DIR.exists():
            return

        for skill_md in SKILLS_DIR.rglob("SKILL.md"):
            rel_path = str(skill_md.relative_to(ROOT / "2_KNOWLEDGE")).replace("\\", "/")
            skill_dir = skill_md.parent.name
            skill_id = f"skill:{_slugify(skill_dir)}"

            content = ""
            try:
                content = skill_md.read_text(encoding="utf-8", errors="ignore")[:2000]
            except Exception:
                continue

            # Extract description from first paragraph
            desc_lines = []
            for line in content.splitlines()[1:]:
                if line.strip() == "" and desc_lines:
                    break
                if line.strip() and not line.startswith("#"):
                    desc_lines.append(line.strip())
            description = " ".join(desc_lines)[:200]

            if skill_id in self.nodes:
                self.nodes[skill_id].description = description
                self.nodes[skill_id].path = rel_path.replace("/SKILL.md", "")
            else:
                self.add_node(GraphNode(
                    id=skill_id,
                    label=skill_dir.replace("-", " ").replace("_", " ").title(),
                    node_type="skill",
                    path=rel_path.replace("/SKILL.md", ""),
                    keywords=[skill_dir.replace("-", " "), skill_dir.replace("_", " ")],
                    description=description,
                ))

            # Detect dependency references in content
            dep_pattern = re.findall(r"(?:depends?|requires?|uses?)\s*:?\s*[`\"]([^`\"]+)[`\"]", content, re.IGNORECASE)
            for dep in dep_pattern:
                dep_id = f"skill:{_slugify(dep)}"
                if dep_id in self.nodes and dep_id != skill_id:
                    self.add_edge(GraphEdge(source=skill_id, target=dep_id, relation="depends_on", weight=0.8))

    def _infer_similarity_edges(self):
        """Infer 'related_to' edges between skills that share keywords."""
        keyword_to_skills = {}
        for node_id, node in self.nodes.items():
            if node.node_type != "skill":
                continue
            for kw in node.keywords:
                words = set(kw.lower().split())
                for word in words:
                    if len(word) > 3:  # Skip short words
                        if word not in keyword_to_skills:
                            keyword_to_skills[word] = set()
                        keyword_to_skills[word].add(node_id)

        # Create edges between skills sharing significant keywords
        seen_pairs = set()
        for word, skill_ids in keyword_to_skills.items():
            if 2 <= len(skill_ids) <= 8:  # Skip words that are too common or too unique
                for s1 in skill_ids:
                    for s2 in skill_ids:
                        if s1 < s2 and (s1, s2) not in seen_pairs:
                            seen_pairs.add((s1, s2))
                            self.add_edge(GraphEdge(
                                source=s1, target=s2,
                                relation="related_to",
                                weight=0.5,
                            ))

    def query(self, query_text: str, top_k: int = 10, max_hops: int = 2) -> List[Dict]:
        """
        Query the knowledge graph with natural language.

        Uses dual-level retrieval:
        1. Entity-level: Direct keyword matching to specific skills
        2. Topic-level: Category traversal for broader context

        Then applies multi-hop traversal to find related skills.
        """
        query_words = set(query_text.lower().split())
        scored_nodes: Dict[str, float] = {}

        # Level 1: Direct keyword matching
        for word in query_words:
            # Exact match
            if word in self._keyword_index:
                for node_id in self._keyword_index[word]:
                    scored_nodes[node_id] = scored_nodes.get(node_id, 0) + 2.0

            # Partial match (substring)
            for kw, node_ids in self._keyword_index.items():
                if word in kw or kw in word:
                    for node_id in node_ids:
                        scored_nodes[node_id] = scored_nodes.get(node_id, 0) + 0.5

        # Level 2: Multi-hop traversal from matched nodes
        if max_hops > 0:
            hop_nodes = dict(scored_nodes)  # Copy
            for _ in range(max_hops):
                next_hop = {}
                for node_id, score in hop_nodes.items():
                    neighbors = self._adjacency.get(node_id, [])
                    for target, relation, weight in neighbors:
                        hop_score = score * weight * 0.5  # Decay per hop
                        if target not in scored_nodes or hop_score > scored_nodes.get(target, 0):
                            next_hop[target] = max(next_hop.get(target, 0), hop_score)
                hop_nodes = next_hop
                for nid, nscore in next_hop.items():
                    scored_nodes[nid] = max(scored_nodes.get(nid, 0), nscore)

        # Sort and return top-k
        ranked = sorted(scored_nodes.items(), key=lambda x: x[1], reverse=True)[:top_k]
        results = []
        for node_id, score in ranked:
            node = self.nodes.get(node_id)
            if node:
                results.append({
                    "id": node.id,
                    "label": node.label,
                    "type": node.node_type,
                    "path": node.path,
                    "score": round(score, 3),
                    "keywords": node.keywords[:5],
                    "description": node.description[:100] if node.description else "",
                })
        return results

    def get_neighbors(self, node_id: str) -> List[Dict]:
        """Get all neighbors of a node with relationship info."""
        neighbors = []
        for target, relation, weight in self._adjacency.get(node_id, []):
            node = self.nodes.get(target)
            if node:
                neighbors.append({
                    "id": target,
                    "label": node.label,
                    "relation": relation,
                    "weight": weight,
                })
        return neighbors

    def get_stats(self) -> Dict:
        return {
            "nodes": len(self.nodes),
            "edges": len(self.edges),
            "categories": sum(1 for n in self.nodes.values() if n.node_type == "category"),
            "skills": sum(1 for n in self.nodes.values() if n.node_type == "skill"),
            "keywords": sum(len(ids) for ids in self._keyword_index.values()),
            "built_at": self.built_at,
        }

    def save(self):
        """Persist the knowledge graph to disk."""
        KG_DIR.mkdir(parents=True, exist_ok=True)
        data = {
            "version": "5.0",
            "built_at": self.built_at,
            "stats": self.get_stats(),
            "nodes": {nid: n.to_dict() for nid, n in self.nodes.items()},
            "edges": [e.to_dict() for e in self.edges],
        }
        path = KG_DIR / "knowledge_graph.json"
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        return path

    def load(self) -> bool:
        """Load the knowledge graph from disk."""
        path = KG_DIR / "knowledge_graph.json"
        if not path.exists():
            return False

        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            self.built_at = data.get("built_at")
            for nid, ndata in data.get("nodes", {}).items():
                self.add_node(GraphNode(**ndata))
            for edata in data.get("edges", []):
                self.add_edge(GraphEdge(**edata))
            return True
        except Exception:
            return False


def _slugify(text: str) -> str:
    """Convert text to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Knowledge Graph")
    parser.add_argument("--build", action="store_true", help="Build graph from SKILL.md files")
    parser.add_argument("--query", type=str, help="Query the graph")
    parser.add_argument("--stats", action="store_true", help="Show graph stats")
    args = parser.parse_args()

    kg = KnowledgeGraph()

    if args.build:
        kg.build_from_skills()
        print(json.dumps(kg.get_stats(), indent=2))
    elif args.query:
        if not kg.load():
            print("Graph not built yet. Run --build first.")
        else:
            results = kg.query(args.query)
            for r in results:
                print(f"  [{r['score']:.2f}] {r['label']} ({r['type']}) -> {r['path']}")
    elif args.stats:
        if kg.load():
            print(json.dumps(kg.get_stats(), indent=2))
        else:
            print("Graph not built yet.")
