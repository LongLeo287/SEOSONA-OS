# E2E Testing & Bug-Hunter SOP

This SOP defines how the `Auto Bug-Hunter & Recovery Pipeline` utilizes Puppeteer to automatically reproduce and test bugs.

## Step 1: Bug Reproduction
1. Read the user's bug report.
2. Generate a Puppeteer script that navigates to the exact URL.
3. Use `page.type()` and `page.click()` to mimic the user's steps.

## Step 2: Diagnosis via DevTools
1. Enable request interception: `await page.setRequestInterception(true)`.
2. Listen for failed network requests (`response.status() >= 400`).
3. Listen for console errors: `page.on('console', msg => { if (msg.type() === 'error') log(msg.text()) })`.

## Step 3: Patch Verification
After the `fullstack-developer` agent patches the code:
1. Re-run the Puppeteer script.
2. Assert that the console errors are gone.
3. Take a screenshot (`page.screenshot()`) as evidence of the fix and attach it to the `walkthrough.md`.
