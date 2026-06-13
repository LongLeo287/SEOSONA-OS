SELECT
  c.id,
  cdc.component_id,
  cdc.dependency_component_id,
  cdc.depth,
  cdc.is_demo_dependency,
  c.user_id,
  dep_c.code,
  dep_c.component_names,
  dep_c.component_slug,
  dep_c.created_at,
  dep_c.demo_code,
  dep_c.demo_dependencies,
  dep_c.demo_direct_registry_dependencies,
  dep_c.dependencies,
  dep_c.description,
  dep_c.direct_registry_dependencies,
  dep_c.downloads_count,
  dep_c.fts,
  dep_c.is_public,
  dep_c.license,
  dep_c.likes_count,
  dep_c.name,
  dep_c.preview_url,
  dep_c.registry,
  dep_c.updated_at,
  source_user.username AS source_author_username,
  source_user.display_username AS source_author_display_username,
  c.component_slug AS source_component_slug,
  dep_user.username AS dependency_author_username,
  dep_user.display_username AS dependency_author_display_username,
  dep_c.tailwind_config_extension,
  dep_c.global_css_extension
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