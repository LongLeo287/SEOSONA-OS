"""
UAP Phase 3: ASSIMILATOR -- Source Code Analysis
=================================================
Analyzes repos from ACTUAL SOURCE CODE (not README).
3-Tier Architecture:
  Tier 1: Cloud API (Gemini / OpenAI) -- if key exists
  Tier 2: Ollama Local LLM (qwen2.5-coder:7b)
  Tier 3: Code-Based Structural Analysis (factual only, no guessing)

RULES:
  - NO README reading
  - NO assumptions or mockups
  - Every statement backed by code evidence
"""

import os
import json
import sqlite3
import urllib.request
import urllib.error
import re
import time
from pathlib import Path

# -- Portable Paths --
SEOSONA_ROOT = Path(__file__).resolve().parents[3]
QUEUE_DB_PATH = SEOSONA_ROOT / "3_MEMORY" / "uap_queue.db"
KI_DIR = SEOSONA_ROOT / "3_MEMORY" / "knowledge_items"
AUDIT_REPORTS_DIR = SEOSONA_ROOT / "3_MEMORY" / "audit_reports"
RESEARCH_DIR = SEOSONA_ROOT / "5_RESEARCH"
ENV_PATH = SEOSONA_ROOT / "1_CONFIG" / ".env"

# -- MemPalace Integration --
import sys
sys.path.append(str(SEOSONA_ROOT / ".agents" / "skills" / "_TIER_1_CORE" / "mempalace" / "payload"))
try:
    from dialect import Dialect
except ImportError:
    Dialect = None

sys.path.append(str(Path(__file__).parent))
from classifier import classify
from uap_intelligence import is_uap_relevant


# ================================================================
# ENV LOADER
# ================================================================
def _load_env():
    env = {}
    if ENV_PATH.exists():
        with open(ENV_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, _, value = line.partition('=')
                    env[key.strip()] = value.strip().strip('"').strip("'")
    return env

_ENV = _load_env()

# Ollama config
OLLAMA_URL = _ENV.get('OLLAMA_URL', 'http://127.0.0.1:11434')
OLLAMA_MODEL = _ENV.get('OLLAMA_MODEL', 'qwen2.5-coder:7b')


# ================================================================
# LLM PROMPT -- Source Code Only, No README
# ================================================================
_SYSTEM_PROMPT = (
    "You are a senior software architect analyzing repositories by reading "
    "ACTUAL SOURCE CODE. You produce factual, evidence-based analysis.\n\n"
    "RULES:\n"
    "- Every claim must be backed by code evidence (file path + content)\n"
    "- Do NOT speculate or assume. If data is insufficient, say so.\n"
    "- Do NOT read or reference README content\n"
    "- Write in English\n"
    "- Output structured Markdown"
)


def _build_prompt(repo_id, audit_data):
    """Build LLM prompt from ACTUAL SOURCE CODE, not README."""
    source_files = audit_data.get('source_files', {})
    file_stats = audit_data.get('file_stats', {})
    tree = "\n".join(audit_data.get('tree', []))

    sections = [
        f"Analyze repository `{repo_id}` based ONLY on the source code below.",
        f"Do NOT speculate. Every statement must reference actual code.\n",
    ]

    # File statistics
    if file_stats:
        sections.append(
            f"## File Statistics\n"
            f"- Total files: {file_stats.get('total_files', '?')}\n"
            f"- Total dirs: {file_stats.get('total_dirs', '?')}\n"
            f"- Extensions: {json.dumps(file_stats.get('extensions', {}))}\n"
        )

    # Directory tree
    if tree:
        sections.append(f"## Directory Structure\n```\n{tree[:2500]}\n```\n")

    # ACTUAL SOURCE CODE
    if source_files:
        sections.append("## Source Code Files\n")
        for fpath, content in source_files.items():
            ext = Path(fpath).suffix
            lang = {'py': 'python', 'ts': 'typescript', 'js': 'javascript',
                     'go': 'go', 'rs': 'rust', 'java': 'java', 'rb': 'ruby',
                     'json': 'json', 'yaml': 'yaml', 'yml': 'yaml',
                     'toml': 'toml'}.get(ext.lstrip('.'), '')
            sections.append(f"### {fpath}\n```{lang}\n{content[:2500]}\n```\n")

    # Output format
    sections.append(f"""---

Produce analysis with these EXACT sections:

# KI: {repo_id}

## Overview
2-3 sentences about what this project does, based on code evidence only.

## Tech Stack (from code)
- Language, framework, build system -- cite the config file or import that proves it.

## Public API / Exports
List actual exported functions, classes, or endpoints found in the source.

## Dependencies
List dependencies from package.json / requirements.txt / Cargo.toml etc.

## Architecture Patterns
Notable patterns observed in the actual code (not speculated).

## Relevance to SEOSONA OS
How this project's code can benefit SEOSONA OS.""")

    return "\n\n".join(sections)


# ================================================================
# TIER 1: GOOGLE GEMINI API (FREE)
# ================================================================
def _call_gemini(repo_id, audit_data):
    api_key = _ENV.get('GEMINI_API_KEY', '') or _ENV.get('GOOGLE_GEMINI_API_KEY', '')
    if not api_key or len(api_key) < 10:
        raise ValueError("GEMINI_API_KEY not configured or too short")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    payload = {
        "contents": [{"parts": [{"text": _build_prompt(repo_id, audit_data)}]}],
        "systemInstruction": {"parts": [{"text": _SYSTEM_PROMPT}]},
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 4096},
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read().decode('utf-8'))

    candidates = result.get('candidates', [])
    if candidates:
        parts = candidates[0].get('content', {}).get('parts', [])
        if parts:
            text = parts[0].get('text', '')
            if text:
                return text
    raise ValueError("Empty response from Gemini API")


# ================================================================
# TIER 1b: OPENAI API (gpt-4o-mini)
# ================================================================
def _call_openai(repo_id, audit_data):
    api_key = _ENV.get('OPENAI_API_KEY', '')
    if not api_key or len(api_key) < 10:
        raise ValueError("OPENAI_API_KEY not configured or too short")

    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": _build_prompt(repo_id, audit_data)},
        ],
        "temperature": 0.2,
        "max_tokens": 4096,
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    })
    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read().decode('utf-8'))

    choices = result.get('choices', [])
    if choices:
        text = choices[0].get('message', {}).get('content', '')
        if text:
            return text
    raise ValueError("Empty response from OpenAI API")


# ================================================================
# TIER 2: OLLAMA LOCAL LLM
# ================================================================
def _call_ollama(repo_id, audit_data):
    """Call local Ollama server (OpenAI-compatible endpoint)."""
    url = f"{OLLAMA_URL}/v1/chat/completions"
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": _build_prompt(repo_id, audit_data)},
        ],
        "temperature": 0.2,
        "max_tokens": 4096,
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    resp = urllib.request.urlopen(req, timeout=300)  # local LLM can be slow
    result = json.loads(resp.read().decode('utf-8'))

    choices = result.get('choices', [])
    if choices:
        text = choices[0].get('message', {}).get('content', '')
        if text:
            return text
    raise ValueError("Empty response from Ollama")


# ================================================================
# TIER 3: CODE-BASED STRUCTURAL ANALYSIS (Factual Only)
# ================================================================
def _code_analysis(repo_id, audit_data):
    """Extract FACTUAL data from source code. No guessing. No README.
    Every line in the output is backed by actual file content."""

    source_files = audit_data.get('source_files', {})
    file_stats = audit_data.get('file_stats', {})
    tree = "\n".join(audit_data.get('tree', []))
    extensions = file_stats.get('extensions', {})
    total_files = file_stats.get('total_files', 0)
    total_dirs = file_stats.get('total_dirs', 0)

    # -- 1. Detect language from file extensions --
    lang_map = {
        '.py': 'Python', '.ts': 'TypeScript', '.tsx': 'TypeScript (React)',
        '.js': 'JavaScript', '.jsx': 'JavaScript (React)',
        '.go': 'Go', '.rs': 'Rust', '.java': 'Java', '.rb': 'Ruby',
        '.cs': 'C#', '.cpp': 'C++', '.c': 'C', '.vue': 'Vue.js',
        '.svelte': 'Svelte', '.sh': 'Shell',
    }
    detected_langs = []
    for ext, count in sorted(extensions.items(), key=lambda x: -x[1]):
        if ext in lang_map:
            detected_langs.append(f"{lang_map[ext]} ({count} files)")
    if not detected_langs:
        detected_langs = ["Unable to detect from file extensions"]

    # -- 2. Parse package.json for FACTUAL dependencies --
    deps_section = ""
    pkg_description = ""
    pkg_scripts = {}
    if 'package.json' in source_files:
        try:
            pj = json.loads(source_files['package.json'])
            pkg_description = pj.get('description', '')
            deps = pj.get('dependencies', {})
            dev_deps = pj.get('devDependencies', {})
            pkg_scripts = pj.get('scripts', {})
            if deps:
                deps_section += "### Dependencies (from package.json)\n"
                for name, ver in list(deps.items())[:20]:
                    deps_section += f"- `{name}`: {ver}\n"
            if dev_deps:
                deps_section += "\n### Dev Dependencies\n"
                for name, ver in list(dev_deps.items())[:15]:
                    deps_section += f"- `{name}`: {ver}\n"
        except json.JSONDecodeError:
            pass

    # -- 3. Parse requirements.txt --
    if 'requirements.txt' in source_files:
        lines = source_files['requirements.txt'].strip().splitlines()
        py_deps = [l.strip() for l in lines if l.strip() and not l.startswith('#')]
        if py_deps:
            deps_section += "\n### Python Dependencies (from requirements.txt)\n"
            for d in py_deps[:20]:
                deps_section += f"- `{d}`\n"

    # -- 4. Parse pyproject.toml --
    if 'pyproject.toml' in source_files:
        content = source_files['pyproject.toml']
        # Extract project name and description
        name_match = re.search(r'name\s*=\s*"([^"]+)"', content)
        desc_match = re.search(r'description\s*=\s*"([^"]+)"', content)
        if name_match and not pkg_description:
            pkg_description = f"Package: {name_match.group(1)}"
        if desc_match and not pkg_description:
            pkg_description = desc_match.group(1)
        # Extract dependencies
        dep_section_match = re.search(
            r'\[project\.dependencies\]\s*\n((?:.*\n)*?)(?:\[|\Z)', content
        )
        if dep_section_match:
            deps_section += "\n### Python Dependencies (from pyproject.toml)\n"
            for line in dep_section_match.group(1).strip().splitlines()[:15]:
                line = line.strip().strip('"').strip("'")
                if line:
                    deps_section += f"- `{line}`\n"

    # -- 5. Extract imports from source code --
    imports_found = set()
    for fpath, content in source_files.items():
        if fpath.endswith(('.ts', '.tsx', '.js', '.jsx')):
            # JS/TS imports
            for m in re.finditer(r"(?:import|from)\s+['\"]([^'\"./][^'\"]*)['\"]", content):
                pkg = m.group(1).split('/')[0]
                if not pkg.startswith('@'):
                    imports_found.add(pkg)
                else:
                    imports_found.add(m.group(1).split('/')[0] + '/' + m.group(1).split('/')[1] if '/' in m.group(1) else pkg)
        elif fpath.endswith('.py'):
            # Python imports
            for m in re.finditer(r"^(?:from|import)\s+(\w+)", content, re.MULTILINE):
                imports_found.add(m.group(1))
        elif fpath.endswith('.go'):
            # Go imports
            for m in re.finditer(r'"([^"]+)"', content):
                if '/' in m.group(1):
                    imports_found.add(m.group(1))

    # -- 6. Extract exports / public API --
    exports_found = []
    for fpath, content in source_files.items():
        if fpath.endswith(('.ts', '.tsx', '.js', '.jsx')):
            for m in re.finditer(r'export\s+(?:async\s+)?(?:function|class|const|type|interface|enum)\s+(\w+)', content):
                exports_found.append(f"`{m.group(1)}` from `{fpath}`")
            for m in re.finditer(r"export\s+\{\s*([^}]+)\}", content):
                names = [n.strip().split(' as ')[0].strip() for n in m.group(1).split(',')]
                for n in names[:5]:
                    if n:
                        exports_found.append(f"`{n}` from `{fpath}`")
        elif fpath.endswith('.py'):
            for m in re.finditer(r'^(?:def|class)\s+(\w+)', content, re.MULTILINE):
                name = m.group(1)
                if not name.startswith('_'):
                    exports_found.append(f"`{name}` from `{fpath}`")

    # -- 7. Build KI from FACTS ONLY --
    ki = f"# KI: {repo_id}\n\n"

    # Overview from package description (if exists) or state facts
    if pkg_description:
        ki += f"## Overview\n{pkg_description}\n\n"
    else:
        ki += (f"## Overview\n"
               f"Repository with {total_files} files across {total_dirs} directories. "
               f"Primary language: {detected_langs[0] if detected_langs else 'unknown'}.\n\n")

    # Tech Stack
    ki += "## Tech Stack (from code)\n"
    for lang in detected_langs[:5]:
        ki += f"- {lang}\n"
    ki += f"- **Total:** {total_files} files, {total_dirs} directories\n"
    top_exts = sorted(extensions.items(), key=lambda x: -x[1])[:8]
    ki += f"- **File types:** {', '.join(f'{e}: {c}' for e, c in top_exts)}\n\n"

    # Public API / Exports
    if exports_found:
        ki += "## Public API / Exports\n"
        for exp in exports_found[:30]:
            ki += f"- {exp}\n"
        ki += "\n"

    # Dependencies
    if deps_section:
        ki += f"## Dependencies\n{deps_section}\n"

    # Imports detected in code
    if imports_found:
        ki += "## Imports Detected in Source\n"
        for imp in sorted(imports_found)[:25]:
            ki += f"- `{imp}`\n"
        ki += "\n"

    # Scripts
    if pkg_scripts:
        ki += "## Available Commands\n"
        for cmd, script in list(pkg_scripts.items())[:12]:
            ki += f"- `npm run {cmd}` -- `{script[:80]}`\n"
        ki += "\n"

    # Directory structure
    ki += f"## File Structure\n```\n{tree[:2000]}\n```\n\n"

    # Source code snippets (first 3 most important)
    important_files = [(k, v) for k, v in source_files.items()
                       if k.endswith(('.ts', '.py', '.js', '.go', '.rs'))][:3]
    if important_files:
        ki += "## Key Source Excerpts\n"
        for fpath, content in important_files:
            ext = Path(fpath).suffix.lstrip('.')
            lang = {'py': 'python', 'ts': 'typescript', 'js': 'javascript',
                     'go': 'go', 'rs': 'rust'}.get(ext, '')
            ki += f"### {fpath}\n```{lang}\n{content[:1500]}\n```\n\n"

    # Agent docs
    agent_docs = {k: v for k, v in source_files.items() if k in ('AGENTS.md', 'CLAUDE.md', 'GEMINI.md')}
    if agent_docs:
        ki += "## Agent Configuration\n"
        for fpath, content in agent_docs.items():
            ki += f"### {fpath}\n{content[:1500]}\n\n"

    ki += ("## Analysis Method\n"
           "> Factual code-based structural analysis. "
           "All data extracted directly from source files. No README. No assumptions.\n")

    return ki


# ================================================================
# MAIN ORCHESTRATOR -- 3-Tier Fallback
# ================================================================
def _assimilate(repo_id, audit_data):
    """Tier 1: Cloud API -> Tier 2: Ollama Local -> Tier 3: Code Analysis."""

    # Tier 1: Cloud APIs
    try:
        print("  [Tier 1] Calling Google Gemini API...")
        result = _call_gemini(repo_id, audit_data)
        if result and len(result) > 200:
            print(f"  [Tier 1] [OK] Gemini ({len(result)} chars)")
            return result
    except Exception as e:
        print(f"  [Tier 1] [FAIL] Gemini: {e}")

    try:
        print("  [Tier 1b] Calling OpenAI API...")
        result = _call_openai(repo_id, audit_data)
        if result and len(result) > 200:
            print(f"  [Tier 1b] [OK] OpenAI ({len(result)} chars)")
            return result
    except Exception as e:
        print(f"  [Tier 1b] [FAIL] OpenAI: {e}")

    # Tier 2: Ollama Local LLM
    try:
        print(f"  [Tier 2] Calling Ollama ({OLLAMA_MODEL})...")
        result = _call_ollama(repo_id, audit_data)
        if result and len(result) > 200:
            print(f"  [Tier 2] [OK] Ollama ({len(result)} chars)")
            return result
    except Exception as e:
        print(f"  [Tier 2] [FAIL] Ollama: {e}")

    # Tier 3: Code-based structural analysis (factual only)
    print("  [Tier 3] Code-based structural analysis (no LLM)...")
    result = _code_analysis(repo_id, audit_data)
    print(f"  [Tier 3] [OK] Code analysis ({len(result)} chars)")
    return result


# ================================================================
# ENTRY POINT
# ================================================================
def run_assimilator():
    """Main entry point called by uap_manager.py."""
    if not QUEUE_DB_PATH.exists():
        return

    KI_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM queue WHERE status = 'AUDITED'")
    audited_items = cursor.fetchall()
    print(f"Found {len(audited_items)} audited items ready for assimilation.")

    for row in audited_items:
        target = dict(row)
        repo_id = target['id']
        safe_name = repo_id.replace('/', '_')
        report_path = AUDIT_REPORTS_DIR / f"audit_{safe_name}.json"

        if not report_path.exists():
            continue

        with open(report_path, 'r', encoding='utf-8') as f:
            audit_data = json.load(f)

        print(f"Assimilating {repo_id}...")

        # Analyze from source code
        ki_content = _assimilate(repo_id, audit_data)

        # Classify: which SEOSONA system/function this repo best upgrades (factual, evidence-based).
        routing = classify(repo_id, audit_data)
        # Self-improvement flag: does this repo itself improve the UAP pipeline?
        routing["uap_relevant"] = is_uap_relevant(audit_data)
        ki_content += (
            f"\n\n## UAP Routing (auto-classified)\n"
            f"- **System:** `{routing['system']}` · **Function:** `{routing['function']}` · "
            f"**Fit:** {routing['score']}/100 · **Auto-apply:** {routing['auto_apply']}\n"
            f"- **Evidence:** {', '.join(f'`{t}`' for t in routing['matched'][:8]) or 'none (kept as reference)'}\n"
            f"- **All scores:** {routing['all_scores']}\n"
        )

        # Save KI
        ki_path = KI_DIR / f"uap_{safe_name}.md"
        with open(ki_path, 'w', encoding='utf-8') as f:
            f.write(ki_content)

        # Routing sidecar for the creator (auto-apply decision + evidence, auditable).
        with open(KI_DIR / f"uap_{safe_name}.classification.json", 'w', encoding='utf-8') as f:
            json.dump(routing, f, indent=2)

        # MemPalace AAAK compression
        if Dialect:
            try:
                dialect_engine = Dialect()
                aaak_content = dialect_engine.compress(
                    ki_content,
                    metadata={"source_file": str(ki_path)},
                )
                aaak_path = KI_DIR / f"uap_{safe_name}.aaak"
                with open(aaak_path, 'w', encoding='utf-8') as f:
                    f.write(aaak_content)
                print(f"-> AAAK: {aaak_path}")
            except Exception as e:
                print(f"AAAK failed: {e}")

        cursor.execute(
            "UPDATE queue SET status = 'ASSIMILATED' WHERE id = ?",
            (repo_id,),
        )
        conn.commit()
        print(f"-> KI: {ki_path}")

        time.sleep(2)

    conn.close()


if __name__ == "__main__":
    run_assimilator()
