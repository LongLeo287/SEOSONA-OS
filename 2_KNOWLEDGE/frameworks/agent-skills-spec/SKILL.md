---
name: agent-skills-spec
description: "The canonical Agent Skills specification + curated example skills from Anthropic (official). Use as the FORMAT AUTHORITY that SEOSONA's ~294 SKILL.md library and the capability router must conform to — validate ingested/generated SKILL.md against the spec. Mixed license: skills Apache-2.0; doc skills (docx/pdf/pptx/xlsx) source-available (use, don't redistribute)."
license: Apache-2.0 (skills) / source-available (doc skills — do not redistribute)
metadata:
  type: format-authority
  source: https://github.com/anthropics/skills
---

# Agent Skills spec — the format authority

[anthropics/skills](https://github.com/anthropics/skills) (official, 155k★). Has `./spec`
(the **canonical Agent Skills specification**), `./skills` (curated examples), `./template`.

## Why it matters for SEOSONA OS
The OS has ~294 `SKILL.md` + a router that loads them dynamically. `./spec` is the
ground-truth format definition all of those should conform to.

## Integration action
1. **Pin `./spec` as the conformance reference.** Validate router-ingested + Skill_Seekers-
   generated SKILL.md against it (frontmatter fields, structure) — catches malformed skills.
2. **Ingest only the Apache-2.0 example skills** into the library; the document skills
   (docx/pdf/pptx/xlsx) are source-available — use in place, do NOT redistribute as open KIs.

> Reference authority, not bulk content. Use it to keep the ~294 library + UAP/Skill_Seekers
> output spec-valid. Pairs with `skill-seekers-ingestion` (which should emit spec-valid SKILL.md).
