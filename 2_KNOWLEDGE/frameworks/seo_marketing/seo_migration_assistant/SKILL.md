---
name: seo-migration-assistant
description: Guidelines for URL migration, 301 redirect validation, and on-page technical SEO audits for Next.js web applications.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [seo, migration, redirects, schema, audits]
    related_skills: [custom-dev-suite]
---

# SEO Migration Assistant (seo-migration-assistant)

This skill coordinates WordPress-to-Next.js migrations, validates URL redirects, lints meta tags, and ensures proper JSON-LD structured schemas.

---

## 1. REDIRECTS VALIDATION PROTOCOL

When auditing page redirections after migrating sites:
1.  **Status Code Check:** Ensure mapped redirect paths return HTTP status \`301 (Moved Permanently)\` or \`308 (Permanent Redirect)\`.
2.  **No Loops:** Ensure there are no redirect chains (e.g. A -> B -> C) or circular redirect loops.
3.  **Static Export Safety:** On static export sites (using \`output: "export"\`), Next.js custom redirects are disabled; redirects must be managed externally (e.g. Cloudflare Pages or Vercel edge configs). Ensure the configuration accommodates GITHUB_PAGES flags.

---

## 2. ON-PAGE SEO METRICS

Ensure every Next.js page matches these technical on-page constraints:
*   **Title Tag:** Length must be between 40 and 60 characters. Must contain target keyword near the start.
*   **Meta Description:** Length must be between 110 and 160 characters. Must be descriptive and actionable.
*   **Canonical Link:** Must always contain a self-referencing canonical URL pointing to the definitive route.
*   **Social Tags (OpenGraph):** Every page must define \`og:title\`, \`og:description\`, \`og:url\`, and a valid \`og:image\` URL.

---

## 3. STRUCTURED DATA SCHEMAS (JSON-LD)

Validate structured schema scripts against Schema.org:
1.  **Organization Schema:** Mapped on homepage only. Must list name, URL, logo, address, phone, and official social link profiles.
2.  **WebSite Schema:** Mapped on homepage only. Must link search query params.
3.  **Service Schema:** Mapped on service offerings routes. Must declare provider organization, service area, and service type.
4.  **Course Schema:** Mapped on educational course routes. Must specify course name, provider, and description.
5.  **FAQ Schema:** Mapped on accordion QA sections. Must list Questions and corresponding Answers in structured nodes.
