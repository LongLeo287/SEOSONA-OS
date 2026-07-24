import os
import shutil
from pathlib import Path
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Paths
ROOT_DIR = Path(__file__).resolve().parents[3]
KI_DIR = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "knowledge_items")
SKILLS_DIR = ROOT_DIR / ".agents" / "skills"
TIER_1 = SKILLS_DIR / "_TIER_1_CORE"
TIER_2 = SKILLS_DIR / "_TIER_2_LAZY_LOAD"
TIER_3 = SKILLS_DIR / "_TIER_3_BLACKLIST"

# Core modules definition
CORE_MODULES = ["mempalace", "seosona-task-intake", "skill_sentinel"]

# Imports
sys.path.append(str(SKILLS_DIR / "_TIER_1_CORE" / "mempalace" / "payload"))
sys.path.append(str(TIER_1 / "mempalace" / "payload")) # Fallback

try:
    from dialect import Dialect
except ImportError:
    Dialect = None

def _fail_closed_scan(path, _reason="security_guard unavailable"):
    # Fail CLOSED: never silently pass an unscanned file through the malware gate.
    print(f"🛑 [SECURITY] {_reason}; failing closed — rejecting {path} (unscanned).")
    return True  # True == threat/unsafe

# Real, resolved path to the UAP security guard (the old "~/.seosona\..." string was never
# expanded, so the import always failed and the scan silently no-op'd).
sys.path.append(str(Path(__file__).resolve().parent.parent / "uap_pipeline"))
try:
    from importlib import import_module
    security_guard = import_module("02b_security_guard")
    scan_file_for_threats = getattr(security_guard, "scan_file_for_threats", None) or _fail_closed_scan
except Exception as _e:
    print(f"🛑 [SECURITY] Failed to import security_guard ({_e}). Upgrade will fail closed.")
    scan_file_for_threats = _fail_closed_scan

def upgrade_knowledge_items():
    print(f"\n--- STEP 1: MEMORY SYNCHRONIZATION (MemPalace AAAK Compression) ---")
    if not Dialect:
        print("Dialect module not found. Skipping compression step.")
        return
        
    dialect_engine = Dialect()
    md_files = list(KI_DIR.glob("*.md"))
    count = 0
    
    print(f"Found {len(md_files)} .md files. Starting compression...")
    for md_file in md_files:
        aaak_file = md_file.with_suffix(".aaak")
        if not aaak_file.exists():
            try:
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
                compressed = dialect_engine.compress(content, metadata={"source_file": str(md_file)})
                with open(aaak_file, "w", encoding="utf-8") as f:
                    f.write(compressed)
                count += 1
                if count % 50 == 0:
                    print(f"  Compressed {count}/{len(md_files)} files...")
            except Exception as e:
                pass
                
    print(f"Successfully generated {count} .aaak files for legacy knowledge items.")

def scan_and_migrate_skills():
    print(f"\n--- STEP 2 & 3: 3-TIER ORGANIZATION & MALWARE SCANNING ---")
    
    skill_folders = [d for d in SKILLS_DIR.iterdir() if d.is_dir() and d.name not in {"_TIER_1_CORE", "_TIER_2_LAZY_LOAD", "_TIER_3_BLACKLIST"}]
    
    print(f"Found {len(skill_folders)} legacy Skill folders. Starting processing...")
    
    for folder in skill_folders:
        # print(f"Analyzing folder: {folder.name}...")
        is_malicious = False
        
        for file_path in folder.rglob("*.*"):
            if file_path.is_file():
                if scan_file_for_threats(str(file_path)):
                    is_malicious = True
                    print(f"  [!] Detected malware/Anti-pattern in {folder.name}/{file_path.name}")
                    break
                    
        try:
            if is_malicious:
                print(f"  -> QUARANTINE: Moving {folder.name} to _TIER_3_BLACKLIST")
                shutil.move(str(folder), str(TIER_3 / folder.name))
            elif folder.name in CORE_MODULES:
                print(f"  -> CORE: Moving {folder.name} to _TIER_1_CORE")
                shutil.move(str(folder), str(TIER_1 / folder.name))
            else:
                print(f"  -> LAZY LOAD: Moving {folder.name} to _TIER_2_LAZY_LOAD")
                shutil.move(str(folder), str(TIER_2 / folder.name))
        except Exception as e:
            print(f"  [Error] Could not move {folder.name}: {e}")

if __name__ == "__main__":
    print("Starting comprehensive upgrade campaign (Legacy Upgrade)...")
    upgrade_knowledge_items()
    scan_and_migrate_skills()
    # Honest close-out: per-item results (incl. [Error]/[SECURITY] lines) are printed above.
    print("\nCampaign finished — review the log above for any errors or quarantined items.")
