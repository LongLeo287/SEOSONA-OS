---
name: "katana_crawler"
description: "Historic standalone skill"
keywords: ["katana_crawler", "ingested"]
mcp_compatible: true
---

# Katana (ProjectDiscovery)

## Overview
Katana is a fast, next-generation crawling and spidering framework built in Go. It focuses on automation pipelines and supports both standard and headless crawling modalities.

## Core Features
- **Crawling Modes:** Standard (Go HTTP lib, fast) and Headless (browser context, handles JS/DOM).
- **JS Parsing:** Endpoint crawling within JavaScript files.
- **Automatic Form Filling:** Configurable auto-filling of forms.
- **Scope Control:** Regex and predefined field-based scoping (root domain, subdomains, etc.).
- **Knowledge Base (ML):** Automatically downloads an ML model (`dit` from Hugging Face) to classify page types (login, captcha, error) and form structures.
- **Captcha Solving:** Automatic solving of reCAPTCHA, Turnstile, hCaptcha using providers like `capsolver`.

## Tech Stack
- **Language:** Go 1.26+
- **Execution:** CLI binary, Docker

## Architecture & Workflows
Katana is extremely modular, accepting input via STDIN, URL, or lists, and outputting to STDOUT, FILE, or JSONL. Its headless mode uses an internal or system Chrome instance, supporting various page load strategies (`heuristic`, `domcontentloaded`, `networkidle`). The inclusion of an ML classification pipeline natively within a Go crawler represents a state-of-the-art approach to reconnaissance.

*Source: github.com/projectdiscovery/katana*
