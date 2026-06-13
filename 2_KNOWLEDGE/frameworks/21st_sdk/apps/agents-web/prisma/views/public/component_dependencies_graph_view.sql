SELECT
  cdc.component_id,
  cdc.depth,
  cdc.is_demo_dependency,
  cdc.dependency_component_id,
  sc.component_slug AS source_component_slug,
  su.username AS source_author_username,
  du.username AS dependency_author_username,
  dc.id,
  dc.component_names,
  dc.description,
  dc.code,
  d.demo_code,
  dc.created_at,
  dc.updated_at,
  dc.user_id,
  dc.dependencies,
  dc.is_public,
  dc.downloads_count,
  dc.likes_count,
  dc.component_slug,
  dc.name,
  d.demo_dependencies,
  d.preview_url,
  dc.license,
  dc.fts,
  dc.direct_registry_dependencies,
  dc.registry,
  d.demo_direct_registry_dependencies,
  su.display_username AS source_author_display_username,
  du.display_username AS dependency_author_display_username
FROM
  (
    (
      (
        (
          (
            component_dependencies_closure cdc
            JOIN components sc ON ((cdc.component_id = sc.id))
          )
          JOIN users su ON ((sc.user_id = su.id))
        )
        JOIN components dc ON ((cdc.dependency_component_id = dc.id))
      )
      JOIN users du ON ((dc.user_id = du.id))
    )
    LEFT JOIN demos d ON (
      (
        (d.component_id = dc.id)
        AND (d.demo_slug = 'default' :: text)
      )
    )
  );