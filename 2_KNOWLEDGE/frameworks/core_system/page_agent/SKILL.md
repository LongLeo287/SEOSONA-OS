---
name: "page-agent"
description: "Alibaba Page-Agent pattern for autonomous browser page understanding and interaction. Useful for deep scraping or interacting with complex web applications beyond simple Playwright scripts."
---

# Page-Agent (Alibaba)

## Overview
Page-Agent is an autonomous agent designed for interpreting, analyzing, and interacting with browser pages. It treats the browser DOM as a state machine.

## Key Principles
1. **DOM Distillation**: Instead of passing the raw DOM to the LLM, the agent extracts a distilled version (using Accessibility Trees or interactive element extraction).
2. **Action Space**: The agent operates using high-level actions (`click(element_id)`, `type(element_id, text)`, `scroll(direction)`).
3. **State Verification**: After every action, the agent verifies if the DOM state changed as expected.

## Implementation Pattern
When building custom scraping tasks that require logging in, handling captchas, or dealing with complex SPAs, spawn a sub-agent with the "page-agent" skill. Provide the target URL and the objective. The agent will autonomously navigate and return the structured data.
