---
name: seosona:puppeteer-automation
description: Core browser automation skill for headless crawling, SPA rendering, taking screenshots, and interacting with pages using Puppeteer.
metadata:
  author: seosona
  version: "1.0.0"
---
# Puppeteer Browser Automation

Use this skill when SEOSONA OS agents need to interact with the web like a real user.

## Core Capabilities
- **Headless Mode**: Launch Chrome/Chromium silently to fetch data.
- **SPA Rendering**: Wait for React/Vue/Angular JavaScript to execute before scraping DOM content.
- **Visual Auditing**: Take full-page screenshots of SERPs or client websites for automated visual testing.
- **Network Interception**: Block images/CSS to save RAM, or intercept API calls to extract JSON data.

## Best Practices
1. **Always use `--no-sandbox`** and `--disable-setuid-sandbox` when running inside SEOSONA OS docker/CI environments.
2. **Handle Page Crashes**: Always wrap `page.goto()` in try-catch blocks and use `.finally()` to `browser.close()`.
3. **Wait for Network Idle**: Use `{ waitUntil: 'networkidle2' }` for SPA pages.

## Example
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http~/.seosona/path/', { waitUntil: 'networkidle2' });
  const data = await page.evaluate(() => document.title);
  console.log(data);
  await browser.close();
})();
```
