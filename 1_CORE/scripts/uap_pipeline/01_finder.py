import os
import json
import sqlite3
import pandas as pd
from pathlib import Path

# Cấu hình đường dẫn — overridable so the finder isn't bound to one machine's D:\Downloads.
EXCEL_PATH = os.environ.get(
    "UAP_INVENTORY_XLSX",
    r"D:\Downloads\repo_inventory_classified_tiered_updated(3).xlsx",
)
QUEUE_DB_PATH = str(Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")
TARGET_CATEGORIES = [
    "AI Agent / Agent Harness",
    "Agent Skills / Prompt Ops",
    "LLM Infra / Inference / Routing",
    "RAG / Knowledge / Memory / Search"
]

def find_targets():
    print(f"Loading data from {EXCEL_PATH}...")
    xls = pd.ExcelFile(EXCEL_PATH)
    
    all_targets = []
    
    # Chúng ta quét toàn bộ các sheet để đảm bảo không bỏ sót bất kỳ repo nào
    # Ưu tiên lấy từ Repos_Audited vì đây là danh sách tổng hợp lớn nhất
    sheets_to_scan = ['Repos_Classified', 'Repos_Audited', 'Top_Priority']
    
    seen_repos = set()
    
    for sheet in sheets_to_scan:
        if sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet)
            print(f"Scanning sheet: {sheet} ({len(df)} rows)")
            
            for index, row in df.iterrows():
                try:
                    category = str(row.get('Category', ''))
                    tier = str(row.get('Tier', ''))
                    owner = str(row.get('Owner', ''))
                    name = str(row.get('Repo/Model', ''))
                    repo_id = f"{owner}/{name}"
                    
                    if repo_id in seen_repos or owner == 'LongLeo287':
                        continue
                        
                    # Lọc theo danh mục SEOSONA
                    is_target_cat = any(cat in category for cat in TARGET_CATEGORIES)
                    # Hoặc là Tier cao (S - Core, A - High)
                    is_high_tier = 'S - Core' in tier or 'A - High' in tier
                    
                    if is_target_cat or is_high_tier:
                        seen_repos.add(repo_id)
                        url = row.get('Canonical URL', f"https://github.com/{repo_id}")
                        if str(url) == 'nan':
                            url = f"https://github.com/{repo_id}"
                            
                        all_targets.append({
                            "id": repo_id,
                            "owner": owner,
                            "name": name,
                            "url": url,
                            "category": category,
                            "tier": tier,
                            "status": "PENDING", # PENDING, CLONED, AUDITED, ASSIMILATED
                            "retry_count": 0
                        })
                except Exception as e:
                    pass
                    
    print(f"Found {len(all_targets)} suitable target repos for SEOSONA UAP.")
    
    # Save to SQLite
    print("Connecting to database...")
    conn = sqlite3.connect(QUEUE_DB_PATH)
    cursor = conn.cursor()
    
    # Đảm bảo bảng tồn tại
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS queue (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            category TEXT,
            tier TEXT,
            status TEXT,
            retry_count INTEGER DEFAULT 0
        )
    """)
    
    # Đọc queue hiện tại để đếm số lượng thêm mới
    cursor.execute("SELECT id FROM queue")
    existing_ids = {row[0] for row in cursor.fetchall()}
    
    new_targets = [t for t in all_targets if t['id'] not in existing_ids]
    
    for item in new_targets:
        cursor.execute("""
            INSERT OR IGNORE INTO queue (id, name, url, category, tier, status, retry_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            item["id"],
            item["name"],
            item["url"],
            item["category"],
            item["tier"],
            item["status"],
            item["retry_count"]
        ))
        
    conn.commit()
    conn.close()
    
    print(f"Added {len(new_targets)} new items to SQLite DB at: {QUEUE_DB_PATH}")
    return len(new_targets)

if __name__ == "__main__":
    find_targets()
