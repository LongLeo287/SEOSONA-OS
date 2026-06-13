-- Add archived_at column to agent_chats table
ALTER TABLE agent_chats ADD COLUMN archived_at TIMESTAMPTZ(6);

-- Create index for efficient filtering of archived chats
CREATE INDEX idx_agent_chats_team_archived ON agent_chats(team_id, archived_at);

