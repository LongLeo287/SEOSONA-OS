---
name: n8n-automation
description: Skill for building and deploying n8n workflows for agentic automation
---

# n8n Automation Skill

## Description
This skill allows SEOSONA OS to programmatically design and upload JSON workflow definitions to a self-hosted n8n instance.

## Workflow
1. Define the trigger node (Webhook, Cron, etc.).
2. Construct intermediate nodes (HTTP Request, Code, Switch, LLM).
3. Define the destination node (Database, API, Notification).
4. Export as JSON and upload via n8n API.
