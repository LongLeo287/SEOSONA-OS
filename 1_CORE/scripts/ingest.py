from pathlib import Path
import os
import sys
import subprocess
import shutil
import argparse

def clone_repo(url, dest_dir):
    name = url.split('/')[-1].replace('.git', '')
    path = os.path.join(dest_dir, name)
    if os.path.exists(path):
        print(f"[{name}] Already exists, skipping clone.")
        return name, path
    print(f"[{name}] Cloning...")
    cmd = ['git', 'clone', '--depth', '1', url, path]
    try:
        subprocess.run(cmd, check=True)
        print(f"[{name}] Done.")
    except Exception as e:
        print(f"[{name}] Failed: {e}")
    return name, path

def generate_skill(name, category, desc, source_path):
    frameworks_dir = os.path.join(os.path.dirname(__file__), '../../2_KNOWLEDGE/frameworks')
    skill_dir = os.path.join(frameworks_dir, category, name.lower().replace("-", "_"))
    os.makedirs(skill_dir, exist_ok=True)
    skill_file = os.path.join(skill_dir, "SKILL.md")
    
    markdown_content = f"""---
name: {name}
description: {desc}
category: {category}
source: Automated Ingestion
---

# {name}

## 🎯 Giới thiệu
{desc}

## 📁 Dữ liệu Gốc
Dữ liệu gốc và toàn bộ mã nguồn của kỹ năng này đã được Ingest thành công vào hệ thống tại:
`~/.seosona/2_KNOWLEDGE/raw_data/ingested_data/{name}`
"""
    with open(skill_file, "w", encoding="utf-8") as f:
        f.write(markdown_content)
    print(f"Created Skill Wrapper for: {name} in {category}")

def rebuild_core():
    print("Rebuilding Knowledge Graph & Plugin Manager...")
    base_dir = os.path.join(os.path.dirname(__file__), '..')
    try:
        subprocess.run(['python', os.path.join(base_dir, 'core/plugin_manager.py')], check=True)
        subprocess.run(['python', os.path.join(base_dir, 'knowledge_graph.py'), '--build'], check=True)
        print("Core rebuilt successfully.")
    except Exception as e:
        print(f"Failed to rebuild core: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SEOSONA Ingestion CLI")
    parser.add_argument("--url", required=True, help="Git URL to clone")
    parser.add_argument("--category", required=True, help="Category in frameworks/")
    parser.add_argument("--desc", required=True, help="Description for the skill")
    
    args = parser.parse_args()
    
    raw_data_dir = os.path.join(os.path.dirname(__file__), '../../2_KNOWLEDGE/raw_data/ingested_data')
    os.makedirs(raw_data_dir, exist_ok=True)
    
    name, path = clone_repo(args.url, raw_data_dir)
    generate_skill(name, args.category, args.desc, path)
    rebuild_core()
