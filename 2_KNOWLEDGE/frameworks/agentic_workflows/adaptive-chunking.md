---
name: adaptive-chunking
description: Implements semantic document chunking to preserve context boundaries during RAG ingestion.
---

# Adaptive Chunking for RAG

This skill introduces dynamic, semantic boundaries for document splitting.

## Usage Directives
1. When ingesting large markdown, PDF, or text files into vector storage, do NOT split strictly by token count (e.g., 500 tokens).
2. Scan for logical breaks (headers `##`, paragraph breaks `\n\n`, or semantic shifts).
3. If a logical section exceeds token limits, recursively apply semantic splitting on sub-headers or sentences.
4. Always prepend the parent context (e.g., the Document Title and parent Header) to the top of each child chunk to prevent context loss.

## Trigger Conditions
Activate this skill when processing large documents for vector insertion or when the Orchestrator Agent is tasked with optimizing RAG pipelines.
