---
name: "flowsint"
description: "OSINT workflow automation patterns based on Reconurge FlowsINT. Defines how to chain multiple open-source intelligence tools into a cohesive pipeline."
---

# FlowsINT (OSINT Workflow Automation)

## Overview
FlowsINT is an execution model for Open-Source Intelligence (OSINT). It treats investigations as a graph of nodes, where the output of one node (e.g., a domain name) becomes the input to multiple other nodes (e.g., DNS lookup, Subdomain enumeration, WHOIS).

## Implementation in SEOSONA
SEOSONA OS uses this exact model in its Task Planner. To implement OSINT workflows:
1. Define each tool as a connector in `tool_registry.json`.
2. Map the data dependencies (e.g., `nmap_scan` depends on `subdomain_enum`).
3. Use `TaskPlanner` to automatically generate the DAG (Directed Acyclic Graph) and execute non-dependent tools in parallel Execution Waves.

## Usage
When the user asks to "run an OSINT investigation", "map an attack surface", or "gather intelligence on a domain", load this skill to structure the multi-step execution.
