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

class SemanticMemoryEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.documents = []
        self.paths = []
        self.titles = []
        self.vectors = None
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
             "paths": self.paths, "titles": self.titles},
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
            
        # Convert task to vector
        query_vec = self.vectorizer.transform([task])
        
        # Compute cosine similarity between query and all documents
        similarities = cosine_similarity(query_vec, self.vectors).flatten()
        
        # Get top_k indices
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score > 0.05: # Threshold for relevance
                results.append({
                    "title": self.titles[idx],
                    "portablePath": self.paths[idx].replace(str(ROOT), "~/.seosona").replace("\\", "/"),
                    "score": round(score, 4),
                    "matchedTerms": ["<semantic_match>"]
                })
                
        return results

# Singleton instance
_engine = SemanticMemoryEngine()

def query_semantic_memory(task: str, limit: int = 8) -> List[Dict[str, Any]]:
    return _engine.query(task, limit)
