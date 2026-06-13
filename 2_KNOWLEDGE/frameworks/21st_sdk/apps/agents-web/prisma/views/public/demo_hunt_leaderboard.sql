WITH base AS (
  SELECT
    s.round_id,
    s.demo_id AS id,
    s.votes,
    s.installs,
    s.views,
    s.final_score,
    d.name,
    d.preview_url,
    d.video_url,
    d.updated_at,
    d.created_at,
    d.demo_slug,
    d.bundle_html_url,
    d.bookmarks_count,
    c.id AS component_id,
    c.name AS component_name,
    c.component_slug,
    c.downloads_count,
    c.likes_count,
    c.license,
    c.registry,
    du.id AS demo_owner_id,
    du.username AS demo_owner_username,
    du.display_image_url,
    (row_to_json(du.*)) :: jsonb AS user_data,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('id', t.id, 'slug', t.slug, 'name', t.name)
      ) FILTER (
        WHERE
          (t.id IS NOT NULL)
      ),
      '[]' :: jsonb
    ) AS tags,
    (
      EXISTS (
        SELECT
          1
        FROM
          demo_hunt_votes v
        WHERE
          (
            (v.round_id = s.round_id)
            AND (v.demo_id = s.demo_id)
            AND (v.user_id = requesting_user_id())
          )
      )
    ) AS has_voted
  FROM
    (
      (
        (
          (
            (
              (
                demo_hunt_scores s
                JOIN component_hunt_current_round r ON ((r.id = s.round_id))
              )
              JOIN demos d ON ((d.id = s.demo_id))
            )
            JOIN components c ON ((c.id = d.component_id))
          )
          JOIN users du ON ((du.id = d.user_id))
        )
        LEFT JOIN demo_tags dt ON ((dt.demo_id = d.id))
      )
      LEFT JOIN tags t ON ((t.id = dt.tag_id))
    )
  WHERE
    (r.id IS NOT NULL)
  GROUP BY
    s.round_id,
    s.demo_id,
    s.votes,
    s.installs,
    s.views,
    s.final_score,
    d.name,
    d.preview_url,
    d.video_url,
    d.updated_at,
    d.created_at,
    d.demo_slug,
    d.bundle_html_url,
    d.bookmarks_count,
    c.id,
    c.name,
    c.component_slug,
    c.downloads_count,
    c.likes_count,
    c.license,
    c.registry,
    du.id,
    du.username,
    du.display_image_url,
    du.*
),
ranked AS (
  SELECT
    base.round_id,
    base.id,
    base.votes,
    base.installs,
    base.views,
    base.final_score,
    base.name,
    base.preview_url,
    base.video_url,
    base.updated_at,
    base.created_at,
    base.demo_slug,
    base.bundle_html_url,
    base.bookmarks_count,
    base.component_id,
    base.component_name,
    base.component_slug,
    base.downloads_count,
    base.likes_count,
    base.license,
    base.registry,
    base.demo_owner_id,
    base.demo_owner_username,
    base.display_image_url,
    base.user_data,
    base.tags,
    base.has_voted,
    dense_rank() OVER (
      PARTITION BY base.round_id
      ORDER BY
        base.final_score DESC,
        base.id
    ) AS global_rank
  FROM
    base
)
SELECT
  ranked.id,
  ranked.name,
  ranked.preview_url,
  ranked.video_url,
  ranked.updated_at,
  ranked.demo_slug,
  jsonb_build_object(
    'id',
    ranked.component_id,
    'name',
    ranked.component_name,
    'component_slug',
    ranked.component_slug,
    'downloads_count',
    ranked.downloads_count,
    'likes_count',
    ranked.likes_count,
    'license',
    ranked.license,
    'registry',
    ranked.registry
  ) AS component_data,
  ranked.user_data,
  ranked.user_data AS component_user_data,
  count(*) OVER () AS total_count,
  ranked.views AS view_count,
  ranked.bookmarks_count,
  CASE
    WHEN (ranked.bundle_html_url IS NOT NULL) THEN jsonb_build_object('html', ranked.bundle_html_url)
    ELSE NULL :: jsonb
  END AS bundle_url,
  ranked.round_id,
  ranked.votes,
  ranked.installs,
  ranked.final_score,
  ranked.global_rank,
  ranked.tags,
  ranked.has_voted
FROM
  ranked;