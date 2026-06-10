# SOP: LightRAG Graph Mapping

**Skill Reference:** `2_KNOWLEDGE/sops/lightrag_graph_mapping.md`

## 1. PURPOSE
Standardizes the maintenance of Entity-Relationship Graphs for large codebases and Spatial Memory data.

## 2. NODE STANDARDS
- Nodes represent: Projects, People, Components, Concepts, Error Types.
- Mandatory metadata: `created_at`, `confidence_score`, `wings_attached`.

## 3. EDGE STANDARDS
- Edges represent relationships: `depends_on`, `authored_by`, `fixes_bug`, `connected_via`.
- Rooms that share the same Wing form a "Tunnel" (a connected pathway between knowledge domains).

## 4. LIGHTRAG QUERYING
- Prioritize Entity-First queries: Locate the relevant Node first, then propagate weights to adjacent Nodes within a 2-hop radius before falling back to full-text Semantic Search.
