-- Add status tracking to deployments
-- Default is 'ready' so existing rows are treated as successful
ALTER TABLE an_deployments
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ready',
  ADD COLUMN IF NOT EXISTS error  text;

CREATE INDEX IF NOT EXISTS idx_an_deployments_status ON an_deployments (agent_id, status);
