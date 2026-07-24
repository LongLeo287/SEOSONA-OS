---
name: gcp-knowledge-catalog
description: Enforces Open Knowledge Format (OKF) metadata standards for agentic data sharing.
---

# Knowledge Catalog & OKF Data Sharing

This skill standardizes how agents structure, tag, and share internal datasets using GCP-inspired Knowledge Catalog principles.

## Usage Directives
1. Whenever generating a new persistent dataset (e.g., user preferences, SEO crawl results, analytics tables), attach an `okf-metadata.json` sidecar file.
2. The metadata must include: `source`, `schema_version`, `freshness_timestamp`, `access_level`, and `business_context`.
3. Before another agent consumes the dataset, it must read the OKF metadata to validate data freshness and schema compatibility.

## Trigger Conditions
Activate when designing database schemas, creating long-term data lakes in `3_MEMORY`, or orchestrating multi-agent data handoffs.
