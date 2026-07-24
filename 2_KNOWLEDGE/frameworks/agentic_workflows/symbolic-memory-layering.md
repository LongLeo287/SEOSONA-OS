---
name: symbolic-memory-layering
description: Implements hierarchical memory layering and Mermaid symbolic context offloading.
---

# Symbolic Memory Layering

This skill integrates the `TencentDB-Agent-Memory` paradigm, replacing flat context windows with semantic pyramids and symbolic graphs.

## Usage Directives

### 1. Symbolic Short-Term Memory
When dealing with massive tool logs, search results, or compiler errors:
- **Offload:** Save the raw output to an external temporary file or memory store.
- **Symbolize:** Inject a compact `Mermaid` graph into your context that maps the execution state or data relationships.
- **Trace:** Annotate graph nodes with a `node_id` so you can retrieve the full raw text only if a specific detail is questioned.

### 2. Layered Long-Term Memory
Do not dump unstructured chat logs into memory. Organize persistent memory into a pyramid:
- **L0 Conversation:** Raw execution traces and dialogue (stored in databases/logs).
- **L1 Atom:** Atomic facts extracted from the conversation.
- **L2 Scenario:** Aggregated scene blocks representing a completed workflow or troubleshooting session.
- **L3 Persona:** High-level user preferences, global rules, and learned SOPs.

When accessing memory, read from the L3 Persona level first. Only drill down to L2 or L1 when granular context is required.

## Trigger Conditions
Activate this skill continuously as a background pattern for Context Optimization and Memory Synthesis (Dreaming Memory Protocol).
