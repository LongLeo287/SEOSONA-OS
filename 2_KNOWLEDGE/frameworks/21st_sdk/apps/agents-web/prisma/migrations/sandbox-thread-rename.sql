-- Sandbox & Thread Primitives: Rename tables and columns
-- Run manually in Supabase dashboard. DO NOT use prisma migrate.

-- 1. Rename tables
ALTER TABLE an_agent_projects RENAME TO an_sandboxes;
ALTER TABLE an_agent_dialogs RENAME TO an_threads;

-- 2. Rename columns
ALTER TABLE an_sandboxes RENAME COLUMN client_project_id TO client_sandbox_id;
ALTER TABLE an_threads RENAME COLUMN project_id TO sandbox_id;

-- 3. Drop user_id and team_id from sandboxes (isolation is developer's responsibility)
ALTER TABLE an_sandboxes DROP COLUMN IF EXISTS user_id;
ALTER TABLE an_sandboxes DROP COLUMN IF EXISTS team_id;

-- 4. Update unique constraint (remove team_id from the key since we dropped it)
ALTER TABLE an_sandboxes DROP CONSTRAINT IF EXISTS an_agent_projects_team_agent_client_project_key;
CREATE UNIQUE INDEX an_sandboxes_agent_client_sandbox_key ON an_sandboxes (agent_id, client_sandbox_id);

-- 5. Rename indexes to match new table names
ALTER INDEX IF EXISTS an_agent_projects_agent_id_idx RENAME TO an_sandboxes_agent_id_idx;
ALTER INDEX IF EXISTS an_agent_projects_team_id_idx RENAME TO an_sandboxes_team_id_idx;
ALTER INDEX IF EXISTS an_agent_projects_team_id_status_idx RENAME TO an_sandboxes_status_idx;
ALTER INDEX IF EXISTS an_agent_dialogs_project_id_idx RENAME TO an_threads_sandbox_id_idx;
ALTER INDEX IF EXISTS an_agent_dialogs_project_status_idx RENAME TO an_threads_sandbox_status_idx;
ALTER INDEX IF EXISTS an_agent_dialogs_stream_id_idx RENAME TO an_threads_stream_id_idx;
