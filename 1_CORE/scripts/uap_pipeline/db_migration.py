from pathlib import Path
import json
import sqlite3
import os

queue_json_path = str(Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.json")
queue_db_path = str(Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")

def migrate():
    # 1. Connect to SQLite (creates file if not exists)
    conn = sqlite3.connect(queue_db_path)
    cursor = conn.cursor()

    # 2. Create table
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

    # 3. Read JSON data
    if os.path.exists(queue_json_path):
        with open(queue_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # 4. Insert data into DB
        for item in data:
            cursor.execute("""
                INSERT OR IGNORE INTO queue (id, name, url, category, tier, status, retry_count)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                item.get("id"),
                item.get("name"),
                item.get("url"),
                item.get("category"),
                item.get("tier"),
                item.get("status", "PENDING"),
                item.get("retry_count", 0)
            ))
            
        print(f"Migrated {len(data)} items to SQLite database.")
    else:
        print("No uap_queue.json found.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
