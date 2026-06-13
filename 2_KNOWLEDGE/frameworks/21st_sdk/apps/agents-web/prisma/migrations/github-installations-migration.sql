-- Migration: Populate installations[] array from legacy fields
-- This migrates existing github_integration data to the new installations[] format

-- Update teams that have github_integration with installation_id and github_user.login
-- Create the installations array from existing data
UPDATE teams
SET
  github_integration = github_integration || jsonb_build_object(
    'installations',
    CASE
      -- If installations already exists and is not empty, keep it
      WHEN github_integration->'installations' IS NOT NULL
           AND jsonb_array_length(github_integration->'installations') > 0
      THEN github_integration->'installations'
      -- Otherwise, create from legacy fields
      ELSE jsonb_build_array(
        jsonb_build_object(
          'installation_id', github_integration->>'installation_id',
          'login', COALESCE(github_integration->'github_user'->>'login', 'Unknown'),
          'avatar_url', github_integration->'github_user'->>'avatar_url',
          'type', COALESCE(github_integration->'github_user'->>'type', 'Organization')
        )
      )
    END
  ),
  updated_at = NOW()
WHERE
  github_integration IS NOT NULL
  AND github_integration->>'installation_id' IS NOT NULL
  AND github_integration->>'installation_id' != ''
  AND (
    github_integration->'installations' IS NULL
    OR jsonb_array_length(github_integration->'installations') = 0
  );

-- Log the number of teams updated
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM teams
  WHERE
    github_integration IS NOT NULL
    AND github_integration->'installations' IS NOT NULL
    AND jsonb_array_length(github_integration->'installations') > 0;

  RAISE NOTICE 'Teams with installations[] populated: %', updated_count;
END $$;
