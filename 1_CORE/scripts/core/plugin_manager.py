from pathlib import Path
import os
import re
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
                desc_match = re.search(r"^description:\s*(?:>-\s*\n|\s*)([\s\S]*?)(?:^\w+:|\Z)", yaml_data, re.MULTILINE)
                
                name = name_match.group(1).strip() if name_match else "unknown_skill"
                desc = desc_match.group(1).strip().replace("\n", " ") if desc_match else "No description available."
                return {"name": name, "description": desc}
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return None

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
                    keywords = sorted(kw_set, key=lambda k: (k == name_clean))  # original name first
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
            rel_path = os.path.relpath(root, start=ROOT_DIR).replace("\\", "/") + "/"
            if meta:
                name_clean = meta["name"].strip("\"'")
                kw_set = {name_clean.replace("-", " "), name_clean, skill_dir}
                keywords = sorted(kw_set, key=lambda k: (k == name_clean))
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
                keywords_str = ", ".join([f"`{k}`" for k in skill['keywords']])
                f.write(f"- {keywords_str} -> `{skill['path']}`\n")
            f.write("\n")
            
    print(f"[OK] Generated SKILLS_ROUTER.md with {sum(len(v) for v in plugins_graph.values())} dynamically loaded skills.")

if __name__ == "__main__":
    build_skills_router()
