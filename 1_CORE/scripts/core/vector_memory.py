import os
import json
from pathlib import Path
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

ROOT = Path(__file__).resolve().parent.parent.parent.parent
KI_DIR = ROOT / "3_MEMORY" / "knowledge_items"
INDEX_DIR = ROOT / "3_MEMORY" / "vector_index"
INDEX_FILE = INDEX_DIR / "ki_tfidf.joblib"


def _rrf(rankings, k=60):
    """Reciprocal-rank fusion: combine several best-first rankings (lists of doc indices) into one
    score per index. A doc ranked high in ANY signal surfaces — this is what lets BM25 catch exact
    terms TF-IDF's cosine misses, and vice-versa."""
    scores = {}
    for ranking in rankings:
        for rank, idx in enumerate(ranking):
            scores[int(idx)] = scores.get(int(idx), 0.0) + 1.0 / (k + rank + 1)
    return scores


class SemanticMemoryEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.documents = []
        self.paths = []
        self.titles = []
        self.vectors = None
        self.bm25 = None          # lexical BM25 model, fused with TF-IDF at query time
        self.is_built = False

    def build_index(self):
        if not KI_DIR.exists():
            return
            
        docs = []
        paths = []
        titles = []
        
        # Load all KI files
        for ext in ["*.md", "*.aaak"]:
            for path in KI_DIR.rglob(ext):
                try:
                    content = path.read_text(encoding="utf-8", errors="ignore")
                    docs.append(content)
                    paths.append(str(path))
                    titles.append(path.stem)
                except Exception:
                    pass

        # [Global MotherBrain] Load satellite workspaces
        workspaces_cfg = ROOT / "1_CONFIG" / "workspaces.json"
        if workspaces_cfg.exists():
            try:
                with open(workspaces_cfg, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
                    for sat in cfg.get("satellites", []):
                        base_path = Path(sat["path"])
                        for sub in sat.get("index_paths", []):
                            target = base_path / sub
                            if target.exists():
                                for ext in ["*.md", "*.py"]:
                                    for path in target.rglob(ext):
                                        try:
                                            content = path.read_text(encoding="utf-8", errors="ignore")
                                            docs.append(content)
                                            paths.append(str(path))
                                            titles.append(path.stem)
                                        except Exception:
                                            pass
            except Exception as e:
                print(f"[VectorMemory] Failed to load satellites: {e}")
                    
        if docs:
            self.documents = docs
            self.paths = paths
            self.titles = titles
            # Fit and transform documents to vector space
            self.vectors = self.vectorizer.fit_transform(self.documents)
            # Also build a lexical BM25 model over the same corpus (best-effort — a missing
            # rank_bm25 just means TF-IDF-only retrieval, never a failure).
            try:
                from rank_bm25 import BM25Okapi
                self.bm25 = BM25Okapi([d.lower().split() for d in self.documents])
            except Exception:
                self.bm25 = None
            self.is_built = True

    def save_index(self):
        """Persist the fitted TF-IDF index so the MCP server / gate start warm instead of
        re-fitting over thousands of KIs on every cold process."""
        if not self.is_built:
            return False
        import joblib
        INDEX_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {"vectorizer": self.vectorizer, "vectors": self.vectors,
             "paths": self.paths, "titles": self.titles, "bm25": self.bm25},
            INDEX_FILE,
        )
        return True

    def load_index(self):
        """Load a persisted index if present. Returns True on success."""
        if not INDEX_FILE.exists():
            return False
        try:
            import joblib
            d = joblib.load(INDEX_FILE)
            self.vectorizer = d["vectorizer"]
            self.vectors = d["vectors"]
            self.paths = d["paths"]
            self.titles = d["titles"]
            self.bm25 = d.get("bm25")  # may be absent in an older index -> TF-IDF-only until rebuild
            self.documents = self.titles  # non-empty marker; query() only needs vectors/paths/titles
            self.is_built = True
            return True
        except Exception:
            return False

    def query(self, task: str, top_k: int = 8) -> List[Dict[str, Any]]:
        if not self.is_built:
            # Prefer the persisted index; fall back to an in-process rebuild — and persist that
            # rebuild so the NEXT cold process (e.g. the knowledge MCP on a fresh clone, where the
            # index is gitignored) loads in ~50ms instead of re-walking every KI. Saving must never
            # break a query, so a write failure is swallowed.
            if not self.load_index():
                self.build_index()
                try:
                    self.save_index()
                except Exception:
                    pass
            
        if not self.is_built or not self.documents:
            return []
            
        # TF-IDF cosine ranking (semantic-ish over the whole doc).
        tfidf_sims = cosine_similarity(self.vectorizer.transform([task]), self.vectors).flatten()
        pool = min(50, len(self.titles))
        rankings = [list(tfidf_sims.argsort()[::-1][:pool])]

        # Fuse in BM25 lexical ranking when available — it catches exact terms cosine dilutes.
        bm25_scores = None
        if self.bm25 is not None:
            try:
                bm25_scores = self.bm25.get_scores(task.lower().split())
                rankings.append(list(np.argsort(bm25_scores)[::-1][:pool]))
            except Exception:
                bm25_scores = None

        fused = _rrf(rankings)
        # argsort always returns `pool` indices, even when every cosine is 0.0 — so a query of pure
        # gibberish came back with 8 confidently-ranked, entirely unrelated documents, and the
        # caller's `if not hits: lexical_fallback` could never fire. An engine that cannot say
        # "I don't know" is a hallucination feeder. Keep only documents some signal actually matched.
        fused = {i: s for i, s in fused.items()
                 if float(tfidf_sims[i]) > 0.0 or (bm25_scores is not None and bm25_scores[i] > 0.0)}
        if not fused:
            return []
        ordered = sorted(fused.items(), key=lambda kv: kv[1], reverse=True)[:top_k]

        results = []
        for idx, _score in ordered:
            cos = float(tfidf_sims[idx])
            results.append({
                "title": self.titles[idx],
                "portablePath": self.paths[idx].replace(str(ROOT), "~/.seosona").replace("\\", "/"),
                "score": round(cos, 4),
                "matchedTerms": ["<hybrid_bm25+tfidf>"] if self.bm25 is not None else ["<semantic_match>"],
            })
        return results

# Singleton instance
_engine = SemanticMemoryEngine()

def query_semantic_memory(task: str, limit: int = 8) -> List[Dict[str, Any]]:
    return _engine.query(task, limit)
