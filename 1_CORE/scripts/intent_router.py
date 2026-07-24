#!/usr/bin/env python3
"""
SEOSONA OS V5 — Intent Router

Replaces static keyword matching with intent-based routing.
Maps user requests to the most relevant skills using the Knowledge Graph.

Intent Classification Pipeline:
  1. Normalize input (lowercase, remove stop words)
  2. Extract intent signals (action verbs, domain terms)
  3. Query Knowledge Graph for matching skills
  4. Apply fallback routing if primary match fails
  5. Log routing decisions for observability

Usage:
    from intent_router import IntentRouter
    router = IntentRouter()
    skills = router.route("analyze technical SEO for popmart.com")
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

ROOT = Path(__file__).resolve().parents[2]


# ── Intent Signals ───────────────────────────────────────────────────────────

INTENT_PATTERNS = {
    "audit": {
        "verbs": ["audit", "analyze", "scan", "check", "review", "assess", "evaluate", "inspect"],
        "boost_categories": ["seo_marketing", "technical", "content_quality"],
    },
    "research": {
        "verbs": ["research", "find", "discover", "explore", "search", "investigate"],
        "boost_categories": ["content", "competitive", "rankings"],
    },
    "fix": {
        "verbs": ["fix", "repair", "resolve", "troubleshoot", "debug", "solve", "optimize"],
        "boost_categories": ["backend_engineering", "technical"],
    },
    "create": {
        "verbs": ["create", "build", "generate", "write", "produce", "design", "make"],
        "boost_categories": ["frontend_development", "design", "content"],
    },
    "monitor": {
        "verbs": ["monitor", "track", "watch", "alert", "report", "dashboard"],
        "boost_categories": ["analytics", "rankings", "performance"],
    },
    "compare": {
        "verbs": ["compare", "benchmark", "competitor", "versus", "vs", "gap"],
        "boost_categories": ["competitive", "rankings"],
    },
    "swarm": {
        "verbs": ["comprehensive", "build", "orchestrate", "research and write", "complex", "campaign", "swarm", "parallel"],
        "boost_categories": ["agentic_workflows"],
    },
}

STOP_WORDS = frozenset([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "to", "of", "in",
    "for", "on", "with", "at", "by", "from", "as", "into", "through",
    "during", "before", "after", "above", "below", "between", "under",
    "and", "but", "or", "nor", "not", "so", "yet", "both", "either",
    "neither", "each", "every", "all", "any", "few", "more", "most",
    "other", "some", "such", "no", "only", "own", "same", "than",
    "too", "very", "just", "because", "about", "this", "that", "these",
    "those", "i", "me", "my", "we", "our", "you", "your", "it", "its",
    "they", "them", "their", "what", "which", "who", "whom", "how",
    "when", "where", "why", "please", "help", "want", "need",
])

DOMAIN_TERMS = {
    "seo": ["seo", "search engine", "serp", "ranking", "backlink", "keyword"],
    "technical": ["technical", "robots", "sitemap", "crawl", "redirect", "schema", "structured data"],
    "content": ["content", "eeat", "e-e-a-t", "quality", "thin", "duplicate"],
    "analytics": ["analytics", "ga4", "gsc", "search console", "traffic", "conversion"],
    "performance": ["performance", "pagespeed", "cwv", "core web vitals", "lcp", "cls", "fid"],
    "competitive": ["competitor", "competition", "gap", "benchmark", "market"],
    "brand": ["brand", "branding", "identity", "guidelines"],
    "ai_search": ["aeo", "ai search", "answer engine", "featured snippet", "ai overview"],
    "agentic": ["agent", "agents", "skill", "skills", "workflow", "workflows", "capability", "autonomy", "automatic"],
    "system": ["seosona", "os", "router", "bridge", "knowledge", "memory"],
}

DOMAIN_BOOST_CATEGORIES = {
    "seo": ["seo_marketing"],
    "technical": ["technical", "backend_engineering"],
    "content": ["content", "seo_marketing"],
    "analytics": ["analytics", "seo_marketing"],
    "performance": ["performance", "frontend_engineering"],
    "competitive": ["competitive", "seo_marketing"],
    "brand": ["brand", "seo_marketing"],
    "ai_search": ["ai_search", "seo_marketing"],
    "agentic": ["agentic_workflows", "core_system", "productivity"],
    "system": ["agentic_workflows", "core_system", "productivity"],
}


class RoutingDecision:
    """Records a routing decision for observability."""
    def __init__(self, query: str, intent: str, matched_skills: List[Dict],
                 fallback_used: bool, confidence: str, timestamp: str):
        self.query = query
        self.intent = intent
        self.matched_skills = matched_skills
        self.fallback_used = fallback_used
        self.confidence = confidence
        self.timestamp = timestamp

    def to_dict(self) -> dict:
        return {
            "query": self.query,
            "intent": self.intent,
            "matched_skills": self.matched_skills,
            "fallback_used": self.fallback_used,
            "confidence": self.confidence,
            "timestamp": self.timestamp,
        }


class IntentRouter:
    """
    Intent-based routing engine that maps user requests to SEOSONA skills.
    Uses the Knowledge Graph for multi-hop skill discovery.
    """

    def __init__(self):
        self._kg = None
        self._log_path = ROOT / "3_MEMORY" / "logs" / "routing_decisions.json"

    def _ensure_kg(self):
        """Lazy-load the knowledge graph."""
        if self._kg is None:
            from knowledge_graph import KnowledgeGraph
            self._kg = KnowledgeGraph()
            if not self._kg.load():
                self._kg.build_from_skills()

    def classify_intent(self, query: str) -> str:
        """Classify the primary intent of a query."""
        words = set(re.findall(r"\b[\w-]+\b", query.lower()))
        best_intent = "research"  # Default
        best_score = 0

        for intent_name, intent_data in INTENT_PATTERNS.items():
            score = sum(1 for v in intent_data["verbs"] if v in words)
            if score > best_score:
                best_score = score
                best_intent = intent_name

        return best_intent

    def extract_domain_terms(self, query: str) -> List[str]:
        """Extract domain-specific terms from the query."""
        query_lower = query.lower()
        query_words = set(re.findall(r"\b[\w-]+\b", query_lower))

        def has_term(term: str) -> bool:
            if " " in term:
                return re.search(rf"\b{re.escape(term)}\b", query_lower) is not None
            return term in query_words

        found = []
        for domain, terms in DOMAIN_TERMS.items():
            for term in terms:
                if has_term(term):
                    found.append(domain)
                    break
        return found

    def normalize_query(self, query: str) -> str:
        """Remove stop words and normalize the query."""
        words = re.findall(r'\w+', query.lower())
        return " ".join(w for w in words if w not in STOP_WORDS and len(w) > 1)

    def route(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Route a user query to the most relevant skills.

        Returns a list of skill matches with scores and metadata.
        """
        self._ensure_kg()

        # Step 1: Classify intent
        intent = self.classify_intent(query)

        # [SWARM DAG INJECTION] If intent is swarm, forcefully inject the swarm orchestrator
        if intent == "swarm":
            return [{
                "label": "Swarm Orchestrator Engine",
                "path": "1_CORE/scripts/swarm_orchestrator.py",
                "score": 10.0,
                "type": "META_AGENT",
                "keywords": ["swarm", "parallel", "dag", "complex"]
            }]

        # Step 2: Normalize query
        normalized = self.normalize_query(query)

        # Step 3: Extract domain terms
        domains = self.extract_domain_terms(query)

        # Step 4: Query knowledge graph
        kg_results = self._kg.query(normalized, top_k=top_k * 2, max_hops=2)

        # Step 5: Boost results based on intent patterns
        boosted_categories = set()
        if intent in INTENT_PATTERNS:
            boosted_categories = set(INTENT_PATTERNS[intent]["boost_categories"])

        for result in kg_results:
            # Boost if skill path contains a boosted category
            if result.get("path"):
                path_lower = result["path"].lower()
                for cat in boosted_categories:
                    if cat in path_lower:
                        result["score"] = result.get("score", 0) * 1.5
                        break

                for domain in domains:
                    for cat in DOMAIN_BOOST_CATEGORIES.get(domain, []):
                        if cat in path_lower:
                            result["score"] = result.get("score", 0) * 1.6
                            break

            # Boost if domain terms match
            for domain in domains:
                searchable = " ".join(result.get("keywords", [])).lower()
                if domain in searchable:
                    result["score"] = result.get("score", 0) * 1.3

        # Re-sort after boosting
        kg_results.sort(key=lambda x: x.get("score", 0), reverse=True)
        matched = kg_results[:top_k]

        # Step 6: Fallback if no good matches
        fallback_used = False
        if not matched or (matched and matched[0].get("score", 0) < 0.5):
            fallback_used = True
            # Return general skills based on domain terms
            if "seo" in domains or "technical" in domains:
                default_query = "seo audit technical"
            elif "content" in domains:
                default_query = "content quality eeat"
            else:
                default_query = "seo marketing analysis"
            fallback_results = self._kg.query(default_query, top_k=top_k)
            matched = fallback_results

        # Step 7: Determine confidence
        if matched and matched[0].get("score", 0) >= 2.0:
            confidence = "high"
        elif matched and matched[0].get("score", 0) >= 1.0:
            confidence = "medium"
        else:
            confidence = "low"

        # Step 8: Log routing decision
        self._log_decision(query, intent, matched, fallback_used, confidence)

        return matched

    def _log_decision(self, query, intent, matched, fallback_used, confidence):
        """Append routing decision to the log file."""
        self._log_path.parent.mkdir(parents=True, exist_ok=True)

        decision = {
            "query": query,
            "intent": intent,
            "matched_count": len(matched),
            "top_match": matched[0]["label"] if matched else None,
            "confidence": confidence,
            "fallback_used": fallback_used,
            "timestamp": datetime.now().isoformat(),
        }

        log_data = []
        if self._log_path.exists():
            try:
                log_data = json.loads(self._log_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, ValueError):
                log_data = []

        log_data.append(decision)
        if len(log_data) > 200:
            log_data = log_data[-200:]

        self._log_path.write_text(json.dumps(log_data, indent=2, ensure_ascii=False), encoding="utf-8")


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Intent Router")
    parser.add_argument("query", nargs="?", help="Query to route")
    parser.add_argument("--top-k", type=int, default=5)
    args = parser.parse_args()

    router = IntentRouter()

    if args.query:
        print(f"\nIntent: {router.classify_intent(args.query)}")
        print(f"Domain terms: {router.extract_domain_terms(args.query)}")
        print(f"Normalized: {router.normalize_query(args.query)}")
        print("\nRouted Skills:")
        results = router.route(args.query, top_k=args.top_k)
        for r in results:
            print(f"  [{r['score']:.2f}] {r['label']} -> {r.get('path', 'N/A')}")
    else:
        # Interactive mode
        print("SEOSONA Intent Router — Interactive Mode")
        print("Type a query to find matching skills. Ctrl+C to exit.\n")
        while True:
            try:
                q = input("Query> ").strip()
                if not q:
                    continue
                results = router.route(q, top_k=5)
                for r in results:
                    print(f"  [{r['score']:.2f}] {r['label']} -> {r.get('path', 'N/A')}")
                print()
            except (KeyboardInterrupt, EOFError):
                break
