#!/usr/bin/env node

import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.goto(`file://${resolve(__dirname, "generate-og.html")}`, { waitUntil: "networkidle0" });

await page.screenshot({
  path: resolve(__dirname, "..", "public", "og.jpg"),
  type: "jpeg",
  quality: 92,
});

await browser.close();
console.log("✔ OG image saved to public/og.jpg");
