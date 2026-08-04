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
# Data-only persistence. The sparse matrix goes to .npz and everything else to JSON; nothing is
# pickled, so loading the index cannot execute code. `ki_tfidf.joblib` is the retired pickle format
# and is deleted on save so a stale one can never be picked up.
MATRIX_FILE = INDEX_DIR / "ki_tfidf.npz"
META_FILE = INDEX_DIR / "ki_meta.json"
LEGACY_PICKLE = INDEX_DIR / "ki_tfidf.joblib"
INDEX_FORMAT = 2


def _corpus_fingerprint():
    """Cheap signature of the knowledge corpus: file count + newest mtime.

    Staleness was previously undetectable — the only rebuild trigger was the index file being
    missing, so every knowledge item added after the first build was invisible to search, silently
    and indefinitely. Comparing this against the stored value makes a stale index rebuild itself.
    """
    newest, count = 0.0, 0
    if KI_DIR.exists():
        for ext in ("*.md", "*.aaak"):
            for p in KI_DIR.rglob(ext):
                try:
                    newest = max(newest, p.stat().st_mtime)
                    count += 1
                except OSError:
                    continue
    return {"count": count, "newest_mtime": round(newest, 3)}


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
        """Persist the index as DATA, never as pickle.

        The previous format was `joblib.dump` — i.e. pickle — and `load_index` executed whatever it
        found. That file is gitignored (never reviewed, never diffed), regenerates itself silently
        when absent, and lives at a path a vendored skill can write, since the sandbox provides no
        absolute-path filesystem confinement. Loading it happens inside the MCP server, unsandboxed,
        with the user's full environment. One file write anywhere on the machine bought persistent
        code execution.

        Now: the sparse matrix goes to .npz, everything else to JSON, and the vectorizer is REBUILT
        from its saved vocabulary and idf vector rather than deserialised. Nothing in the payload
        can execute.
        """
        if not self.is_built:
            return False
        from scipy import sparse

        INDEX_DIR.mkdir(parents=True, exist_ok=True)
        # Write to temp files then rename: two cold processes racing used to leave a truncated
        # index that the bare `except` silently rebuilt, reporting a multi-minute stall as nothing.
        # save_npz appends ".npz" when the name lacks it, so the temp name must already end in
        # .npz or the written file and the rename source diverge.
        tmp_npz = INDEX_DIR / "ki_tfidf.tmp.npz"
        tmp_meta = INDEX_DIR / "ki_meta.tmp.json"

        sparse.save_npz(tmp_npz, self.vectors)
        meta = {
            "format": INDEX_FORMAT,
            "paths": self.paths,
            "titles": self.titles,
            "vocabulary": {t: int(i) for t, i in self.vectorizer.vocabulary_.items()},
            "idf": self.vectorizer.idf_.tolist(),
            "bm25_corpus": [d.lower().split() for d in self.documents] if self.bm25 is not None else None,
            "fingerprint": _corpus_fingerprint(),
        }
        tmp_meta.write_text(json.dumps(meta), encoding="utf-8")

        os.replace(tmp_npz, MATRIX_FILE)
        os.replace(tmp_meta, META_FILE)
        # Remove any pickle left by an older build so nothing can load it later.
        LEGACY_PICKLE.unlink(missing_ok=True)
        return True

    def load_index(self):
        """Load the persisted index. Returns True on success.

        Rebuilds the vectorizer from saved vocabulary + idf instead of deserialising an object, so
        a tampered index file can corrupt results but can never execute code. Also refuses a stale
        index: the old version's ONLY rebuild trigger was the file being absent, so new knowledge
        items stayed invisible to search forever while `3_MEMORY/README.md` claimed it self-heals.
        """
        if not (MATRIX_FILE.exists() and META_FILE.exists()):
            return False
        try:
            from scipy import sparse

            meta = json.loads(META_FILE.read_text(encoding="utf-8"))
            if meta.get("format") != INDEX_FORMAT:
                return False
            if meta.get("fingerprint") != _corpus_fingerprint():
                return False      # corpus changed since this index was written -> rebuild

            self.vectors = sparse.load_npz(MATRIX_FILE)
            self.paths = list(meta["paths"])
            self.titles = list(meta["titles"])

            self.vectorizer = TfidfVectorizer(stop_words="english")
            self.vectorizer.vocabulary_ = {t: int(i) for t, i in meta["vocabulary"].items()}
            self.vectorizer.idf_ = np.asarray(meta["idf"], dtype=float)

            corpus = meta.get("bm25_corpus")
            if corpus:
                try:
                    from rank_bm25 import BM25Okapi
                    self.bm25 = BM25Okapi(corpus)
                except Exception:
                    self.bm25 = None
            else:
                self.bm25 = None

            self.documents = self.titles  # non-empty marker; query() needs vectors/paths/titles
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
