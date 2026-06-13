-- Add completed_at timestamp to track when deployment finished (ready/failed)
-- Deploy duration = completed_at - created_at
ALTER TABLE an_deployments
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Backfill: for existing ready/failed deployments, set completed_at = deployed_at
UPDATE an_deployments
  SET completed_at = deployed_at
  WHERE status IN ('ready', 'failed') AND completed_at IS NULL;
