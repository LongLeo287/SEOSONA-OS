---
name: "wordpress_content_manager"
description: "Manages WordPress content via REST API — create, update, delete posts, pages, and media."
version: "1.0.0"
tags: ["wordpress", "cms", "rest-api", "content-management", "publishing"]
connector: "scripts/connectors/wp_rest_connector.py"
---

# Skill: WordPress Content Manager

## Execution Steps
1. Connect to WordPress site via REST API (requires auth token).
2. Actions available:
   - **Create**: Publish new posts/pages with SEO metadata
   - **Update**: Edit existing content (title, body, meta, categories, tags)
   - **Delete**: Remove outdated content
   - **Media**: Upload images and set featured images
   - **Bulk**: Batch operations across multiple posts
3. Validate: Check SEO metadata (title length, meta description, slug).
4. Log: Record all changes in `3_MEMORY/logs/`.

## Integration
- Used after `content-workflow` produces approved content
- `deployment_checklist_sop` must be followed before publishing
- Works with `schema_markup_generator` for JSON-LD injection

## Quality Validation
- [ ] API authentication successful
- [ ] Content published/updated matches the input exactly
- [ ] SEO metadata validated (title ≤ 60 chars, meta ≤ 160 chars)
- [ ] No draft/placeholder content accidentally published
