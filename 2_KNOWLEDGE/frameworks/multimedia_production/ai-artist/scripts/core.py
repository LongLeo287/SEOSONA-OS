#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Artist Core - BM25 search engine for prompt engineering
"""

import csv
import re
from pathlib import Path
from math import log
from collections import defaultdict

# ============ CONFIGURATION ============
DATA_DIR = Path(__file__).parent.parent / "data"
MAX_RESULTS = 3

CSV_CONFIG = {
    "style": {
        "file": "image-styles.csv",
        "search_cols": ["Style", "Category", "Prompt Keywords", "Best For"],
        "output_cols": ["Style", "Category", "Prompt Keywords", "Lighting", "Composition", "Quality Modifiers", "Negative Prompt", "Best For", "Platform Tips"]
    },
    "platform": {
        "file": "platforms.csv",
        "search_cols": ["Platform", "Type", "Prompt Style", "Strengths"],
        "output_cols": ["Platform", "Type", "Prompt Style", "Key Parameters", "Syntax Examples", "Strengths", "Limitations", "Best Practices"]
    },
    "subject": {
        "file": "subjects.csv",
        "search_cols": ["Subject Type", "Category", "Prompt Modifiers", "Common Issues"],
        "output_cols": ["Subject Type", "Category", "Prompt Modifiers", "Detail Keywords", "Common Issues", "Tips"]
    },
    "llm": {
        "file": "llm-patterns.csv",
        "search_cols": ["Pattern Name", "Category", "When to Use", "Template"],
        "output_cols": ["Pattern Name", "Category", "Template", "When to Use", "Example", "Tips"]
    },
    "quality": {
        "file": "quality-modifiers.csv",
        "search_cols": ["Modifier", "Category", "Effect", "When to Use"],
        "output_cols": ["Modifier", "Category", "Effect", "Platform Compatibility", "Example Usage", "When to Use"]
    },
    "domain": {
        "file": "domains.csv",
        "search_cols": ["Domain", "Description", "Key Considerations", "Common Mistakes"],
        "output_cols": ["Domain", "Description", "Key Considerations", "Prompt Structure", "Common Mistakes", "Best Platforms"]
    },
    "examples": {
        "file": "awesome-prompts.csv",
        "search_cols": ["title", "category", "description", "prompt"],
        "output_cols": ["id", "title", "category", "description", "prompt", "author", "source"]
    }
}

AVAILABLE_DOMAINS = list(CSV_CONFIG.keys())


# ============ BM25 IMPLEMENTATION ============
class BM25:
    """BM25 ranking algorithm for text search"""

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
        """Lowercase, split, remove punctuation, filter short words"""
        text = re.sub(r'[^\w\s]', ' ', str(text).lower())
        return [w for w in text.split() if len(w) > 2]

    def fit(self, documents):
        """Build BM25 index from documents"""
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
        """Score all documents against query"""
        query_tokens = self.tokenize(query)
        scores = []

        for idx, doc in enumerate(self.corpus):
            score = 0
            doc_len = self.doc_lengths[idx]
            term_freqs = defaultdict(int)
            for word in doc:
                term_freqs[word] += 1

            for token in query_tokens:
                if token in self.idf:
                    tf = term_freqs[token]
                    idf = self.idf[token]
                    numerator = tf * (self.k1 + 1)
                    denominator = tf + self.k1 * (1 - self.b + self.b * doc_len / self.avgdl)
                    score += idf * numerator / denominator

            scores.append((idx, score))

        return sorted(scores, key=lambda x: x[1], reverse=True)


# ============ SEARCH FUNCTIONS ============
def _load_csv(filepath):
    """Load CSV and return list of dicts"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def _search_csv(filepath, search_cols, output_cols, query, max_results):
    """Core search function using BM25"""
    if not filepath.exists():
        return []

    data = _load_csv(filepath)

    # Build documents from search columns
    documents = [" ".join(str(row.get(col, "")) for col in search_cols) for row in data]

    # BM25 search
    bm25 = BM25()
    bm25.fit(documents)
    ranked = bm25.score(query)

    # Get top results with score > 0
    results = []
    for idx, score in ranked[:max_results]:
        if score > 0:
            row = data[idx]
            results.append({col: row.get(col, "") for col in output_cols if col in row})

    return results


def detect_domain(query):
    """Auto-detect the most relevant domain from query"""
    query_lower = query.lower()

    domain_keywords = {
        "style": ["style", "aesthetic", "look", "mood", "cyberpunk", "minimalist", "cinematic", "anime", "watercolor", "oil painting", "retro", "vintage", "photorealistic", "fantasy", "vaporwave", "pop art"],
        "platform": ["midjourney", "dall-e", "dalle", "stable diffusion", "flux", "imagen", "veo", "runway", "gemini", "claude", "gpt", "platform", "model", "parameters", "syntax"],
        "subject": ["portrait", "person", "people", "human", "animal", "creature", "architecture", "building", "interior", "product", "food", "landscape", "cityscape", "abstract", "hands", "group", "text"],
        "llm": ["llm", "prompt", "system", "chain of thought", "few-shot", "role", "template", "pattern", "reasoning", "json", "format", "instruction", "constraint"],
        "quality": ["quality", "resolution", "8k", "4k", "detailed", "sharp", "lighting", "render", "professional", "masterpiece", "hd", "focus"],
        "domain": ["marketing", "social media", "ecommerce", "e-commerce", "brand", "editorial", "gaming", "film", "video", "publishing", "education", "healthcare", "fashion", "technology", "web", "ui"],
        "examples": ["example", "sample", "template", "inspiration", "reference", "show me", "like", "similar", "idea", "nano banana", "gemini image", "quote card", "infographic", "thumbnail", "comic", "poster", "avatar", "selfie", "bento"]
    }

    scores = {domain: sum(1 for kw in keywords if kw in query_lower) for domain, keywords in domain_keywords.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "style"


def search(query, domain=None, max_results=MAX_RESULTS):
    """Main search function with auto-domain detection"""
    if domain is None:
        domain = detect_domain(query)

    config = CSV_CONFIG.get(domain, CSV_CONFIG["style"])
    filepath = DATA_DIR / config["file"]

    if not filepath.exists():
        return {"error": f"File not found: {filepath}", "domain": domain}

    results = _search_csv(filepath, config["search_cols"], config["output_cols"], query, max_results)

    return {
        "domain": domain,
        "query": query,
        "file": config["file"],
        "count": len(results),
        "results": results
    }


def search_all_domains(query, max_per_domain=2):
    """Search across all domains for comprehensive results"""
    all_results = {}
    for domain in AVAILABLE_DOMAINS:
        result = search(query, domain, max_per_domain)
        if result.get("results"):
            all_results[domain] = result
    return all_results
