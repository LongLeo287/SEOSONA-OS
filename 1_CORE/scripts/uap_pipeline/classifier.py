"""
UAP Classifier — routes a repo to the SEOSONA system/project + function it best upgrades.

Factual + code-based: scores a repo against each project's function registry using evidence the
auditor already extracted (detected languages, dependencies, imports, exports, file/dir names).
No README, no LLM required (an LLM tier can refine later) — every score is backed by matched
evidence tokens, so the routing decision is auditable and never fabricated.

Output per repo: best-fit system, matched function, score 0-100, and the concrete evidence — so
the creator can auto-apply the upgrade to the right project and the decision can be reviewed.
"""

from pathlib import Path

_ROOT = Path(__file__).resolve().parents[3]          # SEOSONA OS root
_AI_ROOT = _ROOT.parent                               # D:/SEOSONA AI

# --- Project / function registry -------------------------------------------------------------
# Each system lists the FUNCTIONS it owns and the evidence tokens that indicate a repo fits that
# function. Tokens are matched (lowercased, substring) against a repo's languages, dependencies,
# imports, exports and file/dir names. `path` is where the project lives; `push` says whether the
# creator may push after committing there.
PROJECTS = {
    "seosona-os": {
        "path": _ROOT,
        "push": True,
        "functions": {
            "seo": ["seo", "sitemap", "schema-org", "serp", "backlink", "keyword", "meta-tag", "robots"],
            "agent": ["agent", "orchestrat", "workflow", "tool-use", "mcp", "planner", "router"],
            "scraping": ["scrap", "crawl", "playwright", "puppeteer", "beautifulsoup", "cheerio", "selenium"],
            "llm": ["llm", "openai", "anthropic", "ollama", "gemini", "embedding", "rag", "vector"],
            "data": ["polars", "pandas", "duckdb", "sqlite", "etl", "dataframe"],
            "skill": ["skill.md", "capability", "plugin"],
        },
    },
    "seosona-video": {
        "path": _AI_ROOT / "SEOSONA Video",
        "push": False,
        "functions": {
            "tts": ["tts", "text-to-speech", "vieneu", "voice-clone", "voice_clone", "coqui", "piper", "omnivoice"],
            "asr": ["asr", "whisper", "phowhisper", "speech-to-text", "faster-whisper", "transcri"],
            "video-render": ["ffmpeg", "moviepy", "remotion", "render", "gsap", "hyperframe", "compositor"],
            "subtitle": ["srt", "subtitle", "caption", "videolingo", "dub"],
        },
    },
    "seosona-content": {
        "path": _AI_ROOT / "SEOSONA Content",
        "push": False,
        "functions": {
            "srt": ["srt", "subtitle", "transcript", "caption"],
            "content-script": ["content-script", "content_script", "manifest.json", "chrome.tabs", "chrome.scripting"],
            "seo-metadata": ["metadata", "hashtag", "title-generat", "thumbnail"],
            "prompt": ["prompt-template", "prompt_template", "prompt-engineering"],
        },
    },
    "seosona-ux-ui": {
        "path": _AI_ROOT / "SEOSONA UX-UI",
        "push": False,
        "functions": {
            "design-system": ["design-system", "design_system", "design-token", "tailwind", "component-library"],
            "motion": ["gsap", "anime.js", "animejs", "framer-motion", "motion", "animation", "scroll-trigger"],
            "component": [".vue", ".svelte", "component", "storybook"],
            "accessibility": ["a11y", "accessibility", "wcag", "aria"],
        },
    },
    "seosona-flow": {
        "path": _AI_ROOT / "SEOSONA Workflow" / "stickman-explainer-v2",
        "push": False,
        "functions": {
            "ai-image": ["image-generat", "text-to-image", "nano-banana", "flux", "stable-diffusion"],
            "ai-video": ["video-generat", "text-to-video", "google-flow", "labs.google", "veo"],
            "workflow-automation": ["workflow", "node-editor", "drawflow", "dag", "pipeline"],
            "browser-extension": ["manifest_version", "content_scripts", "background.js", "service worker"],
        },
    },
}

# A repo must clear this to be auto-applied to a project; below it, it's kept as OS reference KI.
FIT_THRESHOLD = 25


_DEP_FILES = ("package.json", "requirements.txt", "pyproject.toml", "manifest.json",
              "cargo.toml", "go.mod", "pom.xml", "gemfile", "pubspec.yaml", "composer.json")


def _evidence_tokens(audit_data):
    """Return (strong, weak) lowercased evidence blobs.

    strong = dependency/manifest file CONTENT + import/require/from lines — a real capability
             signal (the repo actually depends on / imports the thing).
    weak   = file names, dir tree, extensions — easy to false-match on a single incidental token
             (this is what inflated fit-100 scores on repos that merely had a `component.js` or
             mentioned `pipeline` in prose).
    """
    strong, weak = [], []
    fs = audit_data.get("file_stats", {})
    for ext in (fs.get("extensions") or {}):
        weak.append(ext.lower())
    for line in (audit_data.get("tree") or []):
        weak.append(line.lower())
    for fpath, content in (audit_data.get("source_files", {}) or {}).items():
        weak.append(fpath.lower())
        c = (content or "").lower()
        if Path(fpath).name.lower() in _DEP_FILES:
            strong.append(c[:4000])
        else:
            for ln in c.splitlines():
                s = ln.strip()
                if s.startswith(("import ", "from ", "require(", "using ", "#include")) or "require(" in s:
                    strong.append(s)
    return "\n".join(strong), "\n".join(weak)


def classify(repo_id, audit_data):
    """Return the best-fit routing decision for a repo, with evidence.

    { system, function, score, push, path, matched: [tokens], all_scores: {system: score} }
    A score of 0 / system 'seosona-os' function 'reference' means: keep as OS reference KI.
    """
    strong, weak = _evidence_tokens(audit_data)
    results = {}
    best = {"system": "seosona-os", "function": "reference", "score": 0,
            "matched": [], "strong_matched": []}

    for system, cfg in PROJECTS.items():
        sys_best_fn, sys_best_score, sys_matched, sys_strong = None, 0, [], []
        for fn, tokens in cfg["functions"].items():
            s_hits = [t for t in tokens if t in strong]
            w_hits = [t for t in tokens if t in weak and t not in s_hits]
            matched = s_hits + w_hits
            if not matched:
                continue
            # strong evidence (deps/imports) weighted ~4x weak (filenames/prose) so a single
            # incidental filename token can't reach the auto-apply threshold on its own.
            score = int(min(100, len(s_hits) * 22 + len(w_hits) * 6))
            if score > sys_best_score:
                sys_best_fn, sys_best_score, sys_matched, sys_strong = fn, score, matched, s_hits
        results[system] = sys_best_score
        if sys_best_score > best["score"]:
            best = {"system": system, "function": sys_best_fn, "score": sys_best_score,
                    "matched": sys_matched, "strong_matched": sys_strong}

    best["push"] = PROJECTS[best["system"]]["push"]
    best["path"] = str(PROJECTS[best["system"]]["path"])
    best["all_scores"] = results
    # Auto-apply demands REAL signal: at least one strong (dep/import) match OR >=2 distinct
    # matches, above threshold, and not the OS itself. Kills single-token-in-prose false positives.
    has_real = len(best["strong_matched"]) >= 1 or len(best["matched"]) >= 2
    best["auto_apply"] = (best["score"] >= FIT_THRESHOLD and best["system"] != "seosona-os" and has_real)
    if best["score"] < FIT_THRESHOLD:
        best["function"] = "reference"
    return best


if __name__ == "__main__":
    # tiny self-check with synthetic evidence
    demo = {"file_stats": {"extensions": {".py": 3}},
            "source_files": {"requirements.txt": "faster-whisper\nphowhisper\nffmpeg-python"},
            "tree": ["asr_router.py", "whisper_transcribe.py"]}
    print(classify("demo/asr-tool", demo))
