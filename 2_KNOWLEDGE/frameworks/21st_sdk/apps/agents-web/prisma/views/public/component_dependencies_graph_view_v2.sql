SELECT
  c.id,
  cdc.component_id,
  cdc.dependency_component_id,
  cdc.depth,
  cdc.is_demo_dependency,
  c.user_id,
  c.code,
  c.component_names,
  c.component_slug,
  c.created_at,
  c.demo_code,
  c.demo_dependencies,
  c.demo_direct_registry_dependencies,
  c.dependencies,
  c.description,
  c.direct_registry_dependencies,
  c.downloads_count,
  c.fts,
  c.is_public,
  c.license,
  c.likes_count,
  c.name,
  c.preview_url,
  c.registry,
  c.updated_at,
  source_user.username AS source_author_username,
  source_user.display_username AS source_author_display_username,
  c.component_slug AS source_component_slug,
  dep_user.username AS dependency_author_username,
  dep_user.display_username AS dependency_author_display_username,
  c.tailwind_config_extension,
  c.global_css_extension
FROM
  (
    (
      (
        (
          component_dependencies_closure cdc
          JOIN components c ON ((cdc.component_id = c.id))
        )
        LEFT JOIN users source_user ON ((c.user_id = source_user.id))
      )
      LEFT JOIN components dep_c ON ((cdc.dependency_component_id = dep_c.id))
    )
    LEFT JOIN users dep_user ON ((dep_c.user_id = dep_user.id))
  );