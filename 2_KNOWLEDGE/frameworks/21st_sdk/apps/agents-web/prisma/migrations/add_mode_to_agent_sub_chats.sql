-- Add mode column to agent_sub_chats table (idempotent)
-- This stores whether the sub-chat is in "plan" or "agent" mode

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'agent_sub_chats'
    AND column_name = 'mode'
  ) THEN
    ALTER TABLE agent_sub_chats
    ADD COLUMN mode TEXT NOT NULL DEFAULT 'agent';

    -- Add comment for clarity
    COMMENT ON COLUMN agent_sub_chats.mode IS 'Chat mode: "plan" or "agent"';
  END IF;
END $$;

