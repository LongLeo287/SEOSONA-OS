-- Marketing Dashboard Database Schema

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  name TEXT,
  category TEXT,
  format TEXT,
  format_type TEXT,
  size INTEGER,
  ai_prompt TEXT,
  r2_status TEXT DEFAULT 'local' CHECK(r2_status IN ('local', 'pending', 'synced', 'error')),
  r2_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  modified_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brand_cache (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  cache_data TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
