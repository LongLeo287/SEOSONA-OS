---
name: "schema_markup_generator"
description: "Auto-generates JSON-LD structured data for any page type (Article, Product, FAQ, LocalBusiness, etc.)."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["seo-technical", "schema", "json-ld", "structured-data"]
mcp_compatible: true
---

# 🛠️ Skill: Schema Markup Generator

> **Purpose**: Automatically generates valid JSON-LD structured data markup for any web page type, maximizing rich snippet eligibility in Google Search.

## 📥 Inputs & Requirements
- **Dependencies**: Schema.org vocabulary reference, Google Rich Results Test API
- **Input Format**: `{ "url": "https://...", "page_type": "Article|Product|FAQ|LocalBusiness|Organization|BreadcrumbList|HowTo|Event|Recipe|VideoObject", "data": {...} }`

## 🧠 Execution Steps (The Method)
1. **Page Type Detection**: If `page_type` not specified, analyze page content to auto-detect the most appropriate schema type.
2. **Data Extraction**: Pull required fields from page content (title, author, datePublished, images, etc.).
3. **Schema Generation**: Build the JSON-LD object following Schema.org spec. Support nested schemas (e.g., Article with BreadcrumbList and Organization).
4. **Validation**: Validate against Google Rich Results Test. Fix any errors/warnings.
5. **Output**: Provide the complete `<script type="application/ld+json">` block ready to paste into the page head.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Generate schema markup that misrepresents page content (Google penalizes misleading structured data).
- **DO NOT**: Use deprecated schema types or properties.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] JSON-LD is syntactically valid (parseable by JSON.parse).
- [ ] All required properties for the schema type are present.
- [ ] Schema matches actual page content (no fabricated data).
- [ ] Passes Google Rich Results Test without errors.

## 💻 Example Invocation
```markdown
User: "Tạo schema FAQ cho trang dịch vụ SEO"
Action: Execute `schema_markup_generator` with page_type "FAQPage"
Result: "[Valid JSON-LD block generated with 5 Q&A pairs]"
```
