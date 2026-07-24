#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YouTube Thumbnail Design Core - BM25 search engine for thumbnail design guidelines
"""

import csv
import re
from pathlib import Path
from math import log
from collections import defaultdict

DATA_DIR = Path(__file__).parent.parent / "data"
MAX_RESULTS = 3

CSV_CONFIG = {
    "style": {
        "file": "styles.csv",
        "search_cols": ["Style Name", "Category", "Keywords", "Best For"],
        "output_cols": ["Style Name", "Category", "Keywords", "Background", "Typography", "Key Elements", "Best For", "Avoid For", "Complexity", "CTR Impact"]
    },
    "niche": {
        "file": "niches.csv",
        "search_cols": ["Niche", "Keywords", "Recommended Styles", "Mood"],
        "output_cols": ["Niche", "Keywords", "Recommended Styles", "Primary Colors", "Typography", "Common Elements", "Mood", "Best Practices", "Avoid"]
    }
}

# Cache: domain -> (rows, config, bm25_index, documents)
_search_cache = {}


class BM25:
    def __init__(self, k1=1.5, b=0.75):
        self.k1 = k1
        self.b = b
        self.corpus = []
        self.doc_lengths = []
        self.avgdl = 0
        self.idf = {}
        self.doc_freqs = defaultdict(int)
        self.N = 0

    def tokenize(self, text):
        text = re.sub(r'[^\w\s]', ' ', str(text).lower())
        return [w for w in text.split() if len(w) > 2]

    def fit(self, documents):
        self.corpus = [self.tokenize(doc) for doc in documents]
        self.N = len(self.corpus)
        if self.N == 0:
            return
        self.doc_lengths = [len(doc) for doc in self.corpus]
        self.avgdl = sum(self.doc_lengths) / self.N

        for doc in self.corpus:
            seen = set()
            for word in doc:
                if word not in seen:
                    self.doc_freqs[word] += 1
                    seen.add(word)

        for word, freq in self.doc_freqs.items():
            self.idf[word] = log((self.N - freq + 0.5) / (freq + 0.5) + 1)

    def score(self, query):
        query_tokens = self.tokenize(query)
        scores = []
        for idx, doc in enumerate(self.corpus):
            score = 0
            dl = self.doc_lengths[idx]
            for term in query_tokens:
                if term not in self.idf:
                    continue
                tf = doc.count(term)
                idf = self.idf[term]
                numerator = tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * dl / self.avgdl)
                score += idf * numerator / denominator
            scores.append((idx, score))
        return sorted(scores, key=lambda x: x[1], reverse=True)


def _get_cached(domain):
    """Load CSV and build BM25 index, cached per domain"""
    if domain in _search_cache:
        return _search_cache[domain]

    config = CSV_CONFIG.get(domain)
    if not config:
        return None

    filepath = DATA_DIR / config["file"]
    if not filepath.exists():
        return None

    with open(filepath, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    if not rows:
        return None

    documents = [
        " ".join(str(row.get(col, "")) for col in config["search_cols"])
        for row in rows
    ]
    bm25 = BM25()
    bm25.fit(documents)

    entry = (rows, config, bm25)
    _search_cache[domain] = entry
    return entry


def search(query, domain, max_results=None):
    if max_results is None:
        max_results = MAX_RESULTS

    cached = _get_cached(domain)
    if not cached:
        return {"error": f"Domain '{domain}' not found or empty"}

    rows, config, bm25 = cached
    ranked = bm25.score(query)

    results = []
    for idx, score in ranked[:max_results]:
        if score > 0:
            results.append({col: rows[idx].get(col, "") for col in config["output_cols"]})

    return {
        "domain": domain,
        "query": query,
        "file": config["file"],
        "count": len(results),
        "results": results
    }


def search_all(query, max_results=None):
    if max_results is None:
        max_results = MAX_RESULTS

    all_results = {}
    for domain in CSV_CONFIG:
        result = search(query, domain, max_results)
        if result.get("results"):
            all_results[domain] = result["results"]

    return all_results
