-- FIX Migration: Update installations[].login from 'Unknown' to actual repo owner
-- The original migration used github_user.login which can be null
-- This fix gets the correct login from team_repository_sandboxes

-- STEP 1: Fix teams where installations[].login = 'Unknown'
-- Get the correct login from team_repository_sandboxes (repo owner)
UPDATE teams t
SET
  github_integration = jsonb_set(
    t.github_integration,
    '{installations,0,login}',
    to_jsonb(SPLIT_PART(s.repository, '/', 1))
  ),
  updated_at = NOW()
FROM (
  SELECT DISTINCT ON (team_id) team_id, repository
  FROM team_repository_sandboxes
  WHERE repository IS NOT NULL AND repository != ''
  ORDER BY team_id, created_at DESC
) s
WHERE
  t.id = s.team_id
  AND t.github_integration IS NOT NULL
  AND t.github_integration->'installations' IS NOT NULL
  AND jsonb_array_length(t.github_integration->'installations') > 0
  AND t.github_integration->'installations'->0->>'login' = 'Unknown';

-- Log the results
DO $$
DECLARE
  fixed_count INTEGER;
  still_unknown INTEGER;
BEGIN
  SELECT COUNT(*) INTO fixed_count
  FROM teams
  WHERE
    github_integration IS NOT NULL
    AND github_integration->'installations' IS NOT NULL
    AND jsonb_array_length(github_integration->'installations') > 0
    AND github_integration->'installations'->0->>'login' != 'Unknown';

  SELECT COUNT(*) INTO still_unknown
  FROM teams
  WHERE
    github_integration IS NOT NULL
    AND github_integration->'installations' IS NOT NULL
    AND jsonb_array_length(github_integration->'installations') > 0
    AND github_integration->'installations'->0->>'login' = 'Unknown';

  RAISE NOTICE 'Fixed teams: %, still Unknown: %', fixed_count, still_unknown;
END $$;
