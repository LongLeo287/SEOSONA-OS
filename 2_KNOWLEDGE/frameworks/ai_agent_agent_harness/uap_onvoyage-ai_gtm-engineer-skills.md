# KI: onvoyage-ai/gtm-engineer-skills

## Overview
This project appears to be a collection of scripts and documentation related to researching, planning, and creating content for Google Travel Maps (GTM) with a focus on geographic areas and SEO. The presence of directories like "geo-content-planning," "research-keywords," and "write-seo-geo-content" strongly suggests this purpose.  The project also includes testing scripts related to evaluations ("evals").

## Tech Stack (from code)
- **JavaScript/Node.js:** The `package.json` file specifies `"type": "module"` indicating the use of JavaScript modules and Node.js for execution. This is confirmed by the presence of `.mjs` files like `aeo-audit.mjs`, `csv-contracts.mjs`, `keyword-explorer.mjs`, and `serp-analyzer.mjs`.
  ```json
  {
    "name": "gtm-engineer-skills",
    "private": true,
    "type": "module",
    ...
  }
  ```

## Public API / Exports
Due to the limited scope of analysis (source code only), it's impossible to determine public APIs or exports. The `.mjs` files likely contain functions and classes used within their respective scripts, but without seeing their contents, we cannot list them definitively.

## Dependencies
The `package.json` file lists no explicit dependencies. This suggests either a very minimal setup or that dependencies are managed differently (e.g., through tooling not reflected in this file).
```json
{
  "name": "gtm-engineer-skills",
  "private": true,
  "type": "module",
  "scripts": {
    "test:evals": "node --test evals/tests/*.test.mjs",
    "test:evals:contracts": "node --test evals/tests/contracts.test.mjs",
    "test:evals:audit": "node --test evals/tests/audit-website-aeo.test.mjs"
  }
}
```

## Architecture Patterns
- **Modular Scripting:** The use of `.mjs` files within various directories suggests a modular approach to scripting, with each directory likely containing scripts responsible for specific tasks (e.g., keyword research, content writing).
- **Schema-Driven Data Handling**:  The presence of files like `plan.csv.schema.md`, `prompts.csv.schema.md`, and `keywords.csv.schema.md` indicates a reliance on schema definitions for CSV data processing. This suggests structured data handling within the scripts.

## Relevance to SEOSONA OS
- **Keyword Research Scripts:** The `keyword-explorer.mjs` and `serp-analyzer.mjs` scripts in the "research-keywords" directory could be adapted or integrated into SEOSONA OS for automated keyword research and SERP analysis, providing valuable data for content optimization.  The schema files associated with keywords suggest a structured approach to managing this data that could be leveraged.
- **Content Planning & Generation:** The overall structure of the project, focused on planning and writing SEO-optimized geo content, aligns with SEOSONA OS's goals.  The scripts and workflows used here might offer insights into automating or improving content creation processes within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `seo`, `serp`, `backlink`, `keyword`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
