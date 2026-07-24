---
name: "core_web_vitals_optimizer"
description: "Diagnoses and fixes Core Web Vitals issues (LCP, INP, CLS) for maximum PageSpeed scores."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["performance", "seo-technical", "core-web-vitals", "pagespeed"]
mcp_compatible: true
---

# 🛠️ Skill: Core Web Vitals Optimizer

> **Purpose**: Systematic diagnosis and resolution of Core Web Vitals issues. Targets LCP < 2.5s, INP < 200ms, CLS < 0.1.

## 📥 Inputs & Requirements
- **Dependencies**: `scripts/connectors/psi_connector.py`, Chrome DevTools, Lighthouse CLI
- **Input Format**: `{ "url": "https://...", "target_score": 90 }`

## 🧠 Execution Steps (The Method)
1. **Baseline Measurement**: Run PSI API for both Mobile and Desktop. Record LCP, INP, CLS, FCP, TTFB, TBT.
2. **LCP Optimization**:
   - Identify the LCP element (hero image, heading, video).
   - Apply fixes: preload critical resources, optimize image format (WebP/AVIF), implement `fetchpriority="high"`, optimize server TTFB.
3. **CLS Optimization**:
   - Identify layout shift sources (images without dimensions, dynamic content injection, web fonts).
   - Apply fixes: explicit width/height on images, `font-display: swap`, reserved space for dynamic elements.
4. **INP Optimization**:
   - Identify long tasks blocking the main thread.
   - Apply fixes: code splitting, defer non-critical JS, use `requestIdleCallback`, optimize event handlers.
5. **Re-measure**: Run PSI again and document the improvement delta.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Sacrifice user experience for performance scores (e.g., removing critical animations or features).
- **FALLBACK**: If score improvements are insufficient, recommend server-side changes (CDN, edge caching, HTTP/3).

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] Before/After PSI scores documented.
- [ ] All three CWV metrics (LCP, INP, CLS) are within "Good" thresholds.
- [ ] No regressions introduced (functionality and visual appearance unchanged).

## 💻 Example Invocation
```markdown
User: "Tối ưu PageSpeed cho trang https://seosona.com"
Action: Execute `core_web_vitals_optimizer` with `{ "url": "https://seosona.com", "target_score": 90 }`
Result: "[Before: 62 → After: 94. Fixes applied: image optimization, JS defer, font preload]"
```
