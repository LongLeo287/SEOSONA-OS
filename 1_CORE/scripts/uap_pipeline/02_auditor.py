"""
UAP Phase 2: AUDITOR -- Clone & Extract Source Code
====================================================
Clones repos and extracts ACTUAL SOURCE CODE for analysis.
Does NOT read README. Only reads real code files, configs, and manifests.
"""

import os
import json
import sqlite3
import subprocess
import shutil
from pathlib import Path

QUEUE_DB_PATH = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")
RESEARCH_DIR = (Path(__file__).resolve().parents[3] / "5_RESEARCH")
AUDIT_REPORTS_DIR = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "audit_reports")

_TREE_SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv",
                   "dist", "build", ".next", ".nuxt", "coverage", ".cache",
                   "vendor", "target", "bin", "obj", ".tox", "egg-info",
                   ".changeset", ".github", ".husky", ".vscode", "test",
                   "tests", "__tests__", "fixtures", "examples"}

_CODE_EXTENSIONS = {
    '.py', '.ts', '.tsx', '.js', '.jsx', '.rs', '.go', '.java', '.rb',
    '.cs', '.cpp', '.c', '.h', '.vue', '.svelte', '.sh', '.yaml', '.yml',
    '.toml', '.cfg', '.ini',
}

_CONFIG_FILES = {
    'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'go.sum',
    'pom.xml', 'build.gradle', 'Gemfile', 'requirements.txt',
    'setup.py', 'setup.cfg', 'composer.json', 'deno.json',
    'tsconfig.json', 'vite.config.ts', 'vite.config.js',
    'next.config.js', 'next.config.ts', 'nuxt.config.ts',
    'webpack.config.js', 'rollup.config.js',
    '.env.example', 'Makefile', 'Dockerfile', 'docker-compose.yml',
}

_AGENT_DOCS = {'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'CURSOR.md'}

# Entry points are highest priority for reading
_ENTRY_POINT_PATTERNS = [
    'src/index.ts', 'src/index.js', 'src/main.ts', 'src/main.py',
    'src/app.ts', 'src/app.py', 'src/app.tsx', 'src/app.jsx',
    'main.py', 'app.py', 'index.js', 'index.ts', 'cli.py', 'cli.ts',
    'lib/index.ts', 'lib/index.js', 'src/lib/index.ts',
    'src/core/index.ts', 'src/core/index.js',
    'server.ts', 'server.js', 'server.py',
    'cmd/main.go', 'main.go', 'src/main.rs', 'src/lib.rs',
]

# Core directories to scan for important source files
_CORE_DIR_PATTERNS = [
    'src/core', 'src/lib', 'src/agent', 'src/agents', 'src/tools',
    'src/providers', 'src/api', 'src/commands', 'src/services',
    'lib', 'core', 'agent', 'agents', 'api', 'commands',
    'pkg', 'internal', 'src',
]

MAX_SOURCE_FILES = 25
MAX_FILE_CHARS = 3000
MAX_TOTAL_SOURCE_CHARS = 50000


def _build_tree(root, max_lines=250):
    """Cross-platform directory listing. Returns newline-joined relative paths."""
    root = Path(root)
    lines = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in sorted(dirnames) if d not in _TREE_SKIP_DIRS]
        rel = Path(dirpath).relative_to(root)
        depth = 0 if str(rel) == "." else len(rel.parts)
        indent = "  " * depth
        if str(rel) != ".":
            lines.append(f"{indent}{rel.name}/")
            if len(lines) >= max_lines:
                break
        for fn in sorted(filenames):
            lines.append(f"{indent}  {fn}")
            if len(lines) >= max_lines:
                return "\n".join(lines)
    return "\n".join(lines)


def _collect_file_stats(root):
    """Collect factual file statistics from the repo."""
    root = Path(root)
    extensions = {}
    total_files = 0
    total_dirs = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in _TREE_SKIP_DIRS]
        total_dirs += 1
        for fn in filenames:
            total_files += 1
            if '.' in fn:
                ext = '.' + fn.rsplit('.', 1)[-1].lower()
                extensions[ext] = extensions.get(ext, 0) + 1
    top_exts = dict(sorted(extensions.items(), key=lambda x: -x[1])[:15])
    return {"total_files": total_files, "total_dirs": total_dirs, "extensions": top_exts}


def _read_source_files(repo_dir):
    """Read ACTUAL source code files. No README. Only real code.
    Returns dict of {relative_path: file_content}."""
    repo_dir = Path(repo_dir)
    if not repo_dir.exists():
        return {}

    source_files = {}
    total_chars = 0

    def _add_file(rel_path):
        nonlocal total_chars
        if len(source_files) >= MAX_SOURCE_FILES:
            return
        if total_chars >= MAX_TOTAL_SOURCE_CHARS:
            return
        abs_path = repo_dir / rel_path
        if not abs_path.exists() or not abs_path.is_file():
            return
        try:
            content = abs_path.read_text(encoding='utf-8', errors='ignore')[:MAX_FILE_CHARS]
            if content.strip():
                source_files[str(rel_path)] = content
                total_chars += len(content)
        except Exception:
            pass

    # Priority 1: Config/manifest files (factual tech stack)
    for cfg in _CONFIG_FILES:
        p = repo_dir / cfg
        if p.exists():
            _add_file(cfg)

    # Priority 2: Agent docs (AGENTS.md, CLAUDE.md — NOT README)
    for doc in _AGENT_DOCS:
        p = repo_dir / doc
        if p.exists():
            _add_file(doc)

    # Priority 3: Entry points (main code)
    for entry in _ENTRY_POINT_PATTERNS:
        _add_file(entry)

    # Priority 3.5: Monorepo packages (packages/*/src/index.ts, etc.)
    for mono_dir in ['packages', 'apps', 'crates', 'modules']:
        mono_path = repo_dir / mono_dir
        if mono_path.exists() and mono_path.is_dir():
            for pkg_dir in sorted(mono_path.iterdir())[:10]:
                if pkg_dir.is_dir():
                    # Package manifest
                    for mf in ['package.json', 'Cargo.toml', 'pyproject.toml']:
                        mf_path = pkg_dir / mf
                        if mf_path.exists():
                            _add_file(mf_path.relative_to(repo_dir))
                    # Package entry point
                    for ep in ['src/index.ts', 'src/index.js', 'src/main.ts',
                               'src/lib.rs', 'index.ts', 'index.js', 'main.py']:
                        ep_path = pkg_dir / ep
                        if ep_path.exists():
                            _add_file(ep_path.relative_to(repo_dir))
                            break

    # Priority 4: Core directory source files
    for core_dir in _CORE_DIR_PATTERNS:
        dir_path = repo_dir / core_dir
        if dir_path.exists() and dir_path.is_dir():
            for f in sorted(dir_path.iterdir()):
                if f.is_file() and f.suffix.lower() in _CODE_EXTENSIONS:
                    rel = f.relative_to(repo_dir)
                    _add_file(rel)
                if len(source_files) >= MAX_SOURCE_FILES:
                    break

    # Priority 5: If still under budget, scan root-level code files
    if len(source_files) < MAX_SOURCE_FILES:
        for f in sorted(repo_dir.iterdir()):
            if f.is_file() and f.suffix.lower() in _CODE_EXTENSIONS:
                rel = f.relative_to(repo_dir)
                if str(rel) not in source_files:
                    _add_file(rel)

    # Priority 6 — recursive fallback. Everything above uses exact paths or a single-level
    # iterdir(), so a repo whose content sits one directory deeper yielded NOTHING: measured, 148
    # repos cloned successfully and produced zero source files (one had 12,126 files on disk).
    # Those became knowledge items written from filenames alone. Walk the tree only when the
    # targeted passes came up empty, so the common case keeps its curated ordering.
    if not source_files:
        for dirpath, dirnames, filenames in os.walk(repo_dir):
            dirnames[:] = [d for d in sorted(dirnames) if d not in _TREE_SKIP_DIRS]
            for fn in sorted(filenames):
                f = Path(dirpath) / fn
                # A corpus of agent-skill repos is mostly prose: without .md here, a SKILL.md-only
                # repo still extracts nothing.
                if f.suffix.lower() in _CODE_EXTENSIONS or fn in _CONFIG_FILES or f.suffix.lower() == ".md":
                    _add_file(f.relative_to(repo_dir))
            if len(source_files) >= MAX_SOURCE_FILES or total_chars >= MAX_TOTAL_SOURCE_CHARS:
                break

    return source_files


def run_auditor(max_items=1):
    if not QUEUE_DB_PATH.exists():
        print("Queue DB not found. Run 01_finder.py first.")
        return

    RESEARCH_DIR.mkdir(parents=True, exist_ok=True)
    AUDIT_REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM queue WHERE status = 'PENDING' LIMIT ?", (max_items,))
    pending_items = cursor.fetchall()
    print(f"Found {len(pending_items)} pending items.")

    for row in pending_items:
        target = dict(row)
        repo_id = target['id']
        repo_url = target['url']
        safe_name = repo_id.replace('/', '_')
        repo_dir = RESEARCH_DIR / safe_name

        print(f"\n--- [Auditing] {repo_id} ---")

        # Clone
        success = True
        if not repo_dir.exists():
            # Do NOT mkdir before cloning. The old code created the directory first, so a failed
            # clone left it behind — and on the next pass `repo_dir.exists()` was True, which
            # skipped this whole block INCLUDING the retry ladder. `success` stayed True and the
            # auditor happily audited an empty directory. Result: the 3-strike retry was
            # unreachable (0 of 951 rows ever reached FAILED) and 47 repos shipped knowledge items
            # reading "Repository with 0 files". git creates the target itself.
            if "github.com" in repo_url and "orgs/" not in repo_url:
                print(f"Cloning {repo_url}...")
                try:
                    res = subprocess.run(
                        ["git", "clone", "--depth", "1", "--filter=blob:none", repo_url, str(repo_dir)],
                        capture_output=True,
                        timeout=600,
                        # A private or deleted repo makes git prompt for credentials on stdin and
                        # hang forever, taking the whole nightly run with it.
                        env={**os.environ, "GIT_TERMINAL_PROMPT": "0", "GIT_ASKPASS": "echo"},
                    )
                    if res.returncode != 0:
                        success = False
                        print(f"  git: {res.stderr.decode('utf-8', 'replace').strip()[:160]}")
                except subprocess.TimeoutExpired:
                    success = False
                    print("  git clone timed out after 600s.")
            else:
                print(f"Non-GitHub URL: {repo_url} -- skipping clone.")
                success = False

            if not success:
                # Leave no partial clone behind, or the next pass mistakes it for a good checkout.
                shutil.rmtree(repo_dir, ignore_errors=True)
                print(f"Failed to fetch. Retry count: {target['retry_count']}")
                new_retry = target['retry_count'] + 1
                new_status = 'FAILED' if new_retry >= 3 else 'PENDING'
                cursor.execute(
                    "UPDATE queue SET retry_count = ?, status = ? WHERE id = ?",
                    (new_retry, new_status, repo_id)
                )
                conn.commit()
                continue

        if success:
            print("Reading source code...")

            # 1. Directory tree
            tree_out = _build_tree(repo_dir, max_lines=250)

            # 2. File statistics
            file_stats = _collect_file_stats(repo_dir)

            # A checkout with no files is not a repository worth ingesting — it is the signature of
            # a clone that silently failed. Auditing it produced knowledge items reading
            # "Repository with 0 files across 1 directories", 47 of which shipped. Send it back to
            # the retry ladder instead of down the pipeline.
            if file_stats.get("total_files", 0) == 0:
                print(f"  Empty checkout for {repo_id} — refusing to audit.")
                shutil.rmtree(repo_dir, ignore_errors=True)
                new_retry = target['retry_count'] + 1
                cursor.execute(
                    "UPDATE queue SET retry_count = ?, status = ? WHERE id = ?",
                    (new_retry, 'FAILED' if new_retry >= 3 else 'PENDING', repo_id),
                )
                conn.commit()
                continue

            # 3. ACTUAL SOURCE CODE (the core change)
            source_files = _read_source_files(repo_dir)

            print(f"  Extracted {len(source_files)} source files "
                  f"({sum(len(v) for v in source_files.values())} chars total)")

            # Build audit report — NO readme_preview
            report = {
                "id": repo_id,
                "url": repo_url,
                "tree": tree_out.splitlines()[:200],
                "file_stats": file_stats,
                "source_files": source_files,
            }

            report_path = AUDIT_REPORTS_DIR / f"audit_{safe_name}.json"
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)

            cursor.execute("UPDATE queue SET status = 'AUDITED' WHERE id = ?", (repo_id,))
            conn.commit()
            print(f"Audit completed. Report saved to {report_path}")

    conn.close()


if __name__ == "__main__":
    run_auditor(max_items=3)
