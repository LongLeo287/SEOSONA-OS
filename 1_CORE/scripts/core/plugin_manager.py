from pathlib import Path
import os
import re
import unicodedata
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FRAMEWORKS_DIR = os.path.join(ROOT_DIR, "2_KNOWLEDGE", "frameworks")
AGENTS_SKILLS_DIR = os.path.join(ROOT_DIR, ".agents", "skills")
ROUTER_FILE = os.path.join(ROOT_DIR, "2_KNOWLEDGE", "SKILLS_ROUTER.md")

def parse_yaml_frontmatter(file_path):
    """Extracts name and description from YAML frontmatter in a markdown file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            match = re.search(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
            if match:
                yaml_data = match.group(1)
                name_match = re.search(r"^name:\s*(.+)$", yaml_data, re.MULTILINE)
                # `^\w+:` does not match hyphenated YAML keys, so `allowed-tools:` / `argument-hint:`
                # were swallowed INTO the description and became routing keywords ("hint",
                # "argument") that crowded out real signal under the 8-keyword cap.
                desc_match = re.search(r"^description:\s*(?:>-\s*\n|\s*)([\s\S]*?)(?:^[\w-]+:|\Z)", yaml_data, re.MULTILINE)
                
                name = name_match.group(1).strip() if name_match else "unknown_skill"
                desc = desc_match.group(1).strip().replace("\n", " ") if desc_match else "No description available."
                return {"name": name, "description": desc}
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return None

# Words that carry no routing signal — they appear in almost every SKILL.md description
# ("Use when the user asks to...") and would make every skill match every task.
_STOPWORDS = {
    "the", "and", "for", "with", "when", "this", "that", "use", "used", "using", "user", "users",
    "should", "would", "could", "from", "into", "your", "you", "are", "was", "were", "has", "have",
    "not", "any", "all", "can", "will", "its", "their", "them", "they", "what", "which", "who",
    "asks", "ask", "asked", "want", "wants", "need", "needs", "skill", "skills", "task", "tasks",
    "helps", "help", "provides", "provide", "creating", "create", "creates", "generate", "generates",
    "run", "runs", "running", "also", "each", "other", "than", "then", "there", "here", "how",
    "based", "given", "over", "after", "before", "such", "only", "more", "most", "via", "per",
    "does", "doing", "done", "make", "makes", "made", "get", "gets", "new", "one", "two",
    # Vietnamese function words — several skills are described in Vietnamese, and without these
    # every one of them would be keyed on "của"/"khi"/"các" and match unrelated tasks.
    "của", "và", "các", "cho", "khi", "này", "một", "được", "trong", "với", "hoặc", "những",
    "dùng", "làm", "theo", "không", "phải", "như", "để", "từ", "đến", "sau", "trước", "nếu",
}
_MAX_DESC_KEYWORDS = 8


# The router is a generated artifact that a human reviews for security (a bad route sends an agent
# to read an attacker-chosen path). Two things made that review impossible:
#   - the old sort key `k == name_clean` put the name LAST, not first as its comment claimed, and
#   - every non-name keyword compared equal, so ordering fell through to set-iteration order, which
#     Python randomises per process via PYTHONHASHSEED.
# Result: every regeneration rewrote 422 lines with no semantic change, training reviewers to ignore
# diffs on exactly the file where a real change matters most.
def _order_keywords(kw_set, name_clean):
    """Deterministic order: the canonical name first, then the rest alphabetically."""
    return sorted(kw_set, key=lambda k: (k != name_clean, k))


# Keywords and paths are written into a markdown table that the capability bridge parses with a
# line/backtick regex. A vendored SKILL.md is third-party input, so a `name:` containing a backtick
# or an arrow can forge an extra route pointing anywhere — including outside the repo. Strip the
# structural characters rather than trusting upstream YAML.
_ROUTER_UNSAFE = str.maketrans({"`": None, "\n": " ", "\r": " ", ",": " ", ">": " ", "|": " "})


def _sanitize_router_token(token):
    return " ".join(str(token).translate(_ROUTER_UNSAFE).split())


def _route_path_is_safe(rel_path):
    """True when a router path stays inside the repo once resolved from 2_KNOWLEDGE/."""
    resolved = os.path.normpath(os.path.join(FRAMEWORKS_DIR, "..", rel_path))
    try:
        return os.path.commonpath([os.path.abspath(resolved), ROOT_DIR]) == ROOT_DIR
    except ValueError:      # different drive on Windows
        return False


def _strip_accents(word):
    """Fold Vietnamese diacritics to plain ASCII ('tự nhiên' -> 'tu nhien'). Đ/đ needs an explicit
    map — it is a distinct letter, not an accented D, so NFD decomposition leaves it untouched."""
    word = word.replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in unicodedata.normalize("NFD", word) if not unicodedata.combining(c))


def _description_keywords(description):
    """Derive routing keywords from a skill's description.

    Without this, a skill is only findable by its exact folder name — `SKILL.md` descriptions are
    rich ("audit Core Web Vitals, crawlability, indexation...") but were parsed and then thrown
    away, so a task phrased in real words never matched. Returns a small, de-duplicated set of the
    most distinctive terms so recall improves without every skill matching every task.
    """
    if not description:
        return []
    # Unicode-aware: an ASCII-only class truncates accented words at the first diacritic, turning
    # a Vietnamese description into fragments ("chuyên" -> "chuy", "cliché" -> "clich") that match
    # nothing. `[^\W\d_]` is "any letter, any script", so Vietnamese terms survive whole — which is
    # exactly what makes a Vietnamese-described skill findable from a Vietnamese task.
    words = re.findall(r"[^\W\d_][^\W_]{3,}", description.lower(), flags=re.UNICODE)
    seen, out = set(), []
    for w in words:
        w = w.strip(".-")
        if len(w) < 4 or w in _STOPWORDS or w in seen:
            continue
        seen.add(w)
        out.append(w)
        # Vietnamese is routinely typed without diacritics ("tu nhien" for "tự nhiên"), so a
        # keyword that only exists in its accented form silently misses half the real queries.
        # Emit the folded variant alongside it.
        folded = _strip_accents(w)
        if folded != w and folded not in seen:
            seen.add(folded)
            out.append(folded)
        if len(out) >= _MAX_DESC_KEYWORDS:
            break
    return out


def build_skills_router():
    print("[SEOSONA] Plugin Manager - Scanning plugins...")
    
    plugins_graph = {}
    
    for plugin_group in os.listdir(FRAMEWORKS_DIR):
        plugin_path = os.path.join(FRAMEWORKS_DIR, plugin_group)
        if not os.path.isdir(plugin_path):
            continue
            
        plugins_graph[plugin_group] = []
        
        # Traverse subdirectories looking for SKILL.md or DESIGN.md
        for root, dirs, files in os.walk(plugin_path):
            target_file = "SKILL.md" if "SKILL.md" in files else ("DESIGN.md" if "DESIGN.md" in files else None)
            if target_file:
                skill_path = os.path.join(root, target_file)
                meta = parse_yaml_frontmatter(skill_path)
                
                rel_path = os.path.relpath(root, start=os.path.join(FRAMEWORKS_DIR, "..")).replace("\\", "/") + "/"
                if meta:
                    # Strip any surrounding quotes from the YAML name value
                    name_clean = meta['name'].strip('"\'')
                    # Use a set to avoid identical duplicates (e.g. when name has no hyphens)
                    kw_set = {name_clean.replace('-', ' '), name_clean}
                    # Plus distinctive terms from the description, so the skill is findable by what
                    # it DOES, not only by its exact name.
                    kw_set.update(_description_keywords(meta.get('description')))
                    keywords = _order_keywords(kw_set, name_clean)
                    plugins_graph[plugin_group].append({
                        "keywords": keywords,
                        "path": rel_path,
                        "desc": meta['description'][:100] + "..." if len(meta['description']) > 100 else meta['description']
                    })
                else:
                    # If no YAML, just use the folder name
                    folder_name = os.path.basename(root)
                    plugins_graph[plugin_group].append({
                        "keywords": [folder_name],
                        "path": rel_path,
                        "desc": "Legacy or Unformatted Skill"
                    })

    # Also scan the adopted agent skills (.agents/skills/<name>/SKILL.md). These are gitlinked
    # clones; only the ones present on disk (i.e. not dropped) get routed, so pruning a skill
    # dir automatically removes it from the router on the next regen.
    if os.path.isdir(AGENTS_SKILLS_DIR):
        plugins_graph["agent_skills"] = []
        for skill_dir in sorted(os.listdir(AGENTS_SKILLS_DIR)):
            root = os.path.join(AGENTS_SKILLS_DIR, skill_dir)
            if not os.path.isdir(root):
                continue
            target_file = "SKILL.md" if os.path.exists(os.path.join(root, "SKILL.md")) else None
            if not target_file:
                continue
            meta = parse_yaml_frontmatter(os.path.join(root, target_file))
            # Router paths are resolved relative to 2_KNOWLEDGE (the router's own dir), like the
            # framework entries — so an agent skill at ROOT/.agents/skills/<name> must be written as
            # ../.agents/skills/<name>/ for the capability bridge to resolve it.
            rel_path = os.path.relpath(root, start=os.path.join(FRAMEWORKS_DIR, "..")).replace("\\", "/") + "/"
            if meta:
                name_clean = meta["name"].strip("\"'")
                kw_set = {name_clean.replace("-", " "), name_clean, skill_dir}
                kw_set.update(_description_keywords(meta.get("description")))
                keywords = _order_keywords(kw_set, name_clean)
                plugins_graph["agent_skills"].append({
                    "keywords": keywords,
                    "path": rel_path,
                    "desc": meta["description"][:100] + "..." if len(meta["description"]) > 100 else meta["description"],
                })
            else:
                plugins_graph["agent_skills"].append({
                    "keywords": [skill_dir], "path": rel_path, "desc": "Adopted agent skill (unformatted)",
                })

    # Write to SKILLS_ROUTER.md
    with open(ROUTER_FILE, "w", encoding="utf-8") as f:
        f.write("# Semantic Capabilities Graph (SKILLS_ROUTER)\n\n")
        f.write("This file is AUTO-GENERATED by `scripts/core/plugin_manager.py`. It outlines the domains of expertise available in the system based on Plugin Metadata.\n\n")
        
        for group, skills in plugins_graph.items():
            if not skills:
                continue
            f.write(f"## {group.replace('_', ' ').title()}\n")
            for skill in skills:
                safe_kws = [s for s in (_sanitize_router_token(k) for k in skill['keywords']) if s]
                safe_path = _sanitize_router_token(skill['path'])
                # Router paths resolve relative to 2_KNOWLEDGE, so agent skills legitimately start
                # with `../.agents/skills/`. Reject only traversal BEYOND that one known prefix —
                # a blanket ".." ban silently dropped all 51 agent skills.
                if not _route_path_is_safe(safe_path):
                    print(f"[SEOSONA] Skipping route with unsafe path: {safe_path!r}")
                    continue
                keywords_str = ", ".join([f"`{k}`" for k in safe_kws])
                f.write(f"- {keywords_str} -> `{safe_path}`\n")
            f.write("\n")
            
    print(f"[OK] Generated SKILLS_ROUTER.md with {sum(len(v) for v in plugins_graph.values())} dynamically loaded skills.")

if __name__ == "__main__":
    build_skills_router()
