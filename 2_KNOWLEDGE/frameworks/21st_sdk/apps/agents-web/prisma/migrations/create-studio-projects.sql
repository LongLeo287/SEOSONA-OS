-- Creates Studio's first-class project table.
--
-- Studio owns the editable workspace, the reserved deploy slug, and the
-- current active sandbox/thread handles for the builder runtime. Those do not
-- belong on an_agent_configs.
--
-- Apply manually in the Supabase SQL editor — do NOT run prisma migrate.

CREATE TABLE IF NOT EXISTS studio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    workspace_files JSONB NOT NULL DEFAULT '{}'::jsonb,
    deployed_slug TEXT NOT NULL,
    deployed_agent_id UUID NULL REFERENCES an_agent_configs(id) ON DELETE SET NULL,
    sandbox_id TEXT NULL,
    thread_id UUID NULL,
    session_status TEXT NULL,
    session_last_seen_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS studio_projects_team_id_deployed_slug_key
    ON studio_projects(team_id, deployed_slug);

CREATE UNIQUE INDEX IF NOT EXISTS studio_projects_deployed_agent_id_key
    ON studio_projects(deployed_agent_id);

CREATE INDEX IF NOT EXISTS studio_projects_user_id_updated_at_idx
    ON studio_projects(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS studio_projects_team_id_updated_at_idx
    ON studio_projects(team_id, updated_at DESC);

COMMENT ON TABLE studio_projects IS
    'Studio-owned customer projects. Stores editable workspace files, reserved deploy slug, and the current builder sandbox/thread handles.';

COMMENT ON COLUMN studio_projects.workspace_files IS
    'Durable Studio working tree as a JSONB map of { path: content }.';

COMMENT ON COLUMN studio_projects.deployed_slug IS
    'Reserved 21st deploy slug for this Studio project. Separate from Studio project identity.';

COMMENT ON COLUMN studio_projects.deployed_agent_id IS
    'Optional binding to the downstream an_agent_configs row created or updated by deploy.';

COMMENT ON COLUMN studio_projects.sandbox_id IS
    'Current active AgentClient sandbox handle for this Studio project.';

COMMENT ON COLUMN studio_projects.thread_id IS
    'Current active relay thread handle for this Studio project.';
