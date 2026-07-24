# SOP: Deployment Checklist

_Version 1.0 | Created: 2026-06-17_

## Purpose
Mandatory checklist before deploying any code, content, or configuration change to a production website.

## Pre-Deployment Checklist

### 🔒 Security
- [ ] No hardcoded API keys, passwords, or secrets in source code (run `security_regex_rules.md` scan).
- [ ] All dependencies audited for known CVEs (`dependency_audit_rules.md`).
- [ ] SSL certificate valid and not expiring within 30 days.

### 🧪 Testing
- [ ] All automated tests pass (unit, integration).
- [ ] Manual smoke test on staging environment completed.
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge).
- [ ] Mobile responsiveness verified on 3+ screen sizes.

### 🎯 SEO
- [ ] No `noindex` tags accidentally left on production pages.
- [ ] `robots.txt` allows crawling of intended pages.
- [ ] Sitemap.xml updated with new/changed URLs.
- [ ] Canonical URLs correctly set.
- [ ] Schema markup (JSON-LD) validated via Google Rich Results Test.
- [ ] No broken internal links introduced (run `internal_linking_optimizer`).

### ⚡ Performance
- [ ] PageSpeed score >= 80 on mobile (run `core_web_vitals_optimizer`).
- [ ] Images optimized (WebP/AVIF format, proper dimensions, lazy loading).
- [ ] No render-blocking resources introduced.

### 📝 Content
- [ ] Content proofread and fact-checked (`content_review_sop`).
- [ ] No placeholder text remaining ("Lorem ipsum", "TODO", "TBD").
- [ ] Meta titles and descriptions set for all new pages.
- [ ] Alt text on all images.

### 🚀 Deployment
- [ ] Backup of current production taken.
- [ ] Deployment window communicated to stakeholders.
- [ ] Rollback plan documented.
- [ ] Post-deployment verification plan ready.

## Post-Deployment Verification
- [ ] Site loads correctly (homepage + 5 key pages).
- [ ] Forms and CTAs functional.
- [ ] Analytics tracking active (GA4 real-time check).
- [ ] GSC crawl check submitted for new pages.
- [ ] Performance re-check (PSI scores unchanged or improved).
