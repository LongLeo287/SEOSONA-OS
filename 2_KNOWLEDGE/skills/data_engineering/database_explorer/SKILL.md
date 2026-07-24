---
name: "database_explorer"
description: "Auto-explores unknown databases to map schemas, relationships, and data patterns using SeekDB patterns."
version: "1.0.0"
tags: ["database", "schema-discovery", "data-exploration", "reverse-engineering"]
---

# Skill: Database Explorer

## Execution Steps
1. Connect to target database (MySQL, PostgreSQL, SQLite, MongoDB).
2. Auto-discover: tables/collections, columns/fields, data types, indices.
3. Map relationships: foreign keys, join patterns, entity relationships.
4. Sample data: Extract representative rows to understand content patterns.
5. Generate: ER diagram (Mermaid) + data dictionary + size/row statistics.

## Use Cases
- Client database onboarding (understand their data before SEO integration)
- GA4/GSC data warehouse exploration
- Legacy database reverse engineering for migration projects

## Quality Validation
- [ ] All tables/collections discovered and documented
- [ ] Relationships correctly mapped
- [ ] No sensitive data exposed in sample output
