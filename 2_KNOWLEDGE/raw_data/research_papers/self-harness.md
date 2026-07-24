# Research Methodology: Self-Harness

**Source:** `Self-Harness: Harnesses That Improve Themselves` (Shanghai AI Lab)
**Category:** Agent Architecture & Self-Evolution

## Overview
Self-Harness is a paradigm where an LLM-based agent improves its own operating "harness" (the surrounding system: prompts, tools, verification rules, runtime mechanisms) without relying on human engineers or stronger external agents. It turns the model's own execution failures into structural system upgrades.

## The 3-Stage Iterative Loop

### 1. Weakness Mining
The fixed base model operates under its current harness to perform tasks. When it fails, the evaluation system clusters the failed execution traces into "verifier-grounded failure patterns". Instead of treating failures as isolated mistakes, this stage identifies systemic behavioral flaws (e.g., repeating failed tool calls, failing to verify outputs).

### 2. Harness Proposal
The same base model is invoked in a "proposer" role. It reviews the clustered failure patterns and generates diverse yet minimal candidate modifications to the current harness. It separates the symptom (e.g., timeout) from the mechanism (e.g., getting stuck in exploration loops) and patches the exact surface responsible (e.g., adding a loop-breaker middleware or modifying the verification instruction).

### 3. Proposal Validation
The proposed harness edits are tested against held-out regression tests. A candidate is accepted and merged into the active harness lineage **only if** it improves the pass rate on one split without degrading performance on the other split.

## Value to SEOSONA OS
SEOSONA OS can adopt this Self-Harness loop for its own Agent fleet:
- **Auto-Correction:** Instead of hardcoding `cursor.general.rules` or SKILL markdown files, an overarching `Self-Harness Agent` could read the logs of failed `Fullstack Developer` runs, and automatically append new rules to the `.rules` files to prevent the same hallucination in the future.
- **Dynamic Tool Evolution:** If an agent consistently misuses a tool (e.g., `write_to_file` overwriting blindly), the Self-Harness loop can automatically synthesize a "middleware guard" that enforces diff-checking before overwriting.
