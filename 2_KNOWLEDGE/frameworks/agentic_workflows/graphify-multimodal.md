---
name: graphify-multimodal
description: Constructs multimodal knowledge graphs from code, text, and visual inputs for agentic reasoning.
---

# Graphify Multimodal Knowledge Graphing

This skill integrates the `graphify` methodology for processing scattered documents, code, and images into a structured, sub-linear reasoning graph.

## Usage Directives

1. **Ingestion:** When analyzing complex, multi-file codebases or reading disparate PDFs and images, synthesize the objects into "Nodes" and their relationships into "Edges".
2. **Vision Extraction:** When provided with architecture diagrams or whiteboard screenshots, extract explicit relationships and add them to the semantic graph.
3. **Obsidian Vault / Wiki Output:** When creating long-term documentation from the graph, output the relationships in an Obsidian-friendly format (using `[[Node]]` linking) or as a structured Markdown Wiki.
4. **Context Optimization:** Instead of loading full raw documents into context, load the knowledge graph nodes. Only drill down into the raw file if the graph edges indicate it contains the specific answer.

## Trigger Conditions
Activate this skill when processing large external repositories, planning complex refactors, or generating system architecture documentation.
