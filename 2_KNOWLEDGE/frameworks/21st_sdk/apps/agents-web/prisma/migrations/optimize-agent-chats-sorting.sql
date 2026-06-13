-- Optimize agent chats sorting query
-- This index covers the exact query pattern used in getAgentChats:
-- WHERE team_id = X AND archived_at IS NULL AND deleted_at IS NULL ORDER BY updated_at DESC

CREATE INDEX IF NOT EXISTS idx_agent_chats_team_active_updated 
ON agent_chats(team_id, updated_at DESC)
WHERE archived_at IS NULL AND deleted_at IS NULL;

-- This partial index is more efficient because:
-- 1. It only indexes active (non-archived, non-deleted) chats
-- 2. It includes the sort column (updated_at DESC) for optimal query performance
-- 3. PostgreSQL can do an index-only scan without touching the table

к