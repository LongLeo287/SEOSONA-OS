#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Creativity Pro Max Core - BM25 search engine for creative direction guides
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
        "file": "styles.csv",
        "search_cols": ["Style", "Keywords", "Purpose", "Best_For", "Color_Palette", "BG_Music"],
        "output_cols": ["No", "Style", "Keywords", "Color_Palette", "Ideas", "Signature_Effects", "BG_Music", "VO_Style", "Purpose", "Best_For", "Avoid_For"]
    },
    "platform": {
        "file": "platforms.csv",
        "search_cols": ["Platform", "Style_Notes", "Best_Styles", "Content_Types", "Audience"],
        "output_cols": ["Platform", "Ratio", "Length_Short", "Length_Long", "Hook_Time", "Style_Notes", "Audio", "Best_Styles", "Content_Types", "Audience", "Avoid"]
    },
    "voiceover": {
        "file": "voiceover.csv",
        "search_cols": ["Style", "Tone", "Best_For", "Direction_Keywords", "Example_Brands"],
        "output_cols": ["Style", "Tone", "Delivery", "Pacing", "Pitch", "Energy", "Best_For", "Example_Brands", "Direction_Keywords", "Platform_Adaptation"]
    },
    "music": {
        "file": "music.csv",
        "search_cols": ["Genre", "Mood", "Best_For", "Styles_Match", "Instruments"],
        "output_cols": ["Genre", "Mood", "BPM_Range", "Instruments", "Best_For", "Styles_Match", "Avoid_For", "Licensing_Notes"]
    },
    "reasoning": {
        "file": "creative-reasoning.csv",
        "search_cols": ["Category", "Style_Priority", "Audience_Age", "Platform_Priority"],
        "output_cols": ["No", "Category", "Style_Priority", "Color_Mood", "Music_Mood", "VO_Style", "Key_Effects", "Platform_Priority", "Audience_Age", "Decision_Rules", "Anti_Patterns", "Severity"]
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
        "style": ["style", "visual", "aesthetic", "look", "feel", "minimalist", "bold", "cinematic", "retro", "futuristic", "ugc", "authentic", "luxury", "moody"],
        "platform": ["tiktok", "instagram", "youtube", "linkedin", "facebook", "twitter", "pinterest", "snapchat", "reels", "shorts", "stories", "platform", "channel"],
        "voiceover": ["voiceover", "voice", "narration", "narrator", "tone", "delivery", "vo", "speaker", "announcer", "conversational", "authoritative"],
        "music": ["music", "audio", "soundtrack", "beat", "bpm", "genre", "song", "track", "ambient", "upbeat", "orchestral", "electronic"],
        "reasoning": ["campaign", "launch", "product", "brand", "audience", "gen z", "millennial", "b2b", "b2c", "awareness", "conversion", "lead"]
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
