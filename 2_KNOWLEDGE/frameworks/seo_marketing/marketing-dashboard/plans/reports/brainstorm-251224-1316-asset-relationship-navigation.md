# Brainstorm: Asset Relationship Navigation

**Date:** 2024-12-24
**Status:** Agreed
**Goal:** Enable navigation between related assets in Content Hub

---

## Problem Statement

Current Content Hub lists assets as flat types/categories. Users can't easily:
- Find images referenced by a storyboard
- See what uses specific design tokens
- Navigate from child asset to parent document

## Evaluated Approaches

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| A. Breadcrumb + Folder Tree | Simple, no schema change | Only folder-based | Partial |
| B. Auto-Parse References | Automatic, no manual work | Only explicit refs | **Selected** |
| C. Explicit Metadata | Full control | Maintenance burden | Overkill |
| D. Hybrid (B + optional frontmatter) | Best of both | More complex | Future |

## Agreed Solution: Auto-Parse References

### Scanner Changes

Add reference extraction to `scanner.cjs`:

```javascript
// Extract references from file content
function extractReferences(content, format, filePath) {
  const refs = []

  // Markdown: ![alt](./path.png)
  if (format === 'md') {
    const mdImages = content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)
    for (const m of mdImages) refs.push(resolveRelPath(filePath, m[1]))
  }

  // JSON: output_path, image, src fields
  if (format === 'json') {
    const jsonPaths = content.matchAll(/"(?:output_path|image|src)":\s*"([^"]+)"/g)
    for (const m of jsonPaths) refs.push(resolveRelPath(filePath, m[1]))
  }

  // HTML: href, src attributes (relative only)
  if (format === 'html') {
    const htmlRefs = content.matchAll(/(?:href|src)="(\.\.?\/[^"]+)"/g)
    for (const m of htmlRefs) refs.push(resolveRelPath(filePath, m[1]))
  }

  return [...new Set(refs)] // dedupe
}
```

### Manifest Schema Addition

```json
{
  "id": "abc123",
  "name": "storyboard.md",
  "references": [
    "scene-1-start.png",
    "scene-1-end.png",
    "../brand-guidelines.md"
  ],
  "referencedBy": [] // computed reverse lookup
}
```

### UI: Related Assets Panel

Add to AssetPreview.vue sidebar/footer:

```
┌─────────────────────────────────────┐
│ 📂 Same Folder                      │
│   scene-1-start.png                 │
│   scene-1-end.png                   │
├─────────────────────────────────────┤
│ 🔗 References (2)                   │
│   ./scene-1-start.png               │
│   ../design-tokens.css              │
├─────────────────────────────────────┤
│ ↩️ Referenced By (1)                │
│   ../README.md                      │
└─────────────────────────────────────┘
```

## Implementation Steps

1. **Scanner:** Add `extractReferences()` function
2. **Scanner:** Include `references` array in asset metadata
3. **API:** Compute `referencedBy` via reverse lookup (or at scan time)
4. **UI:** Add "Related Assets" panel to preview components
5. **UI:** Make related items clickable to navigate

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large files slow scan | Only parse parseable formats, limit content size |
| Broken references | Show as "missing" with different styling |
| Circular refs | Already handled by Set dedup |

## Success Metrics

- User can click storyboard → see all scene images
- User can click image → see what documents reference it
- No manual tagging required

## Next Steps

When ready to implement, start with scanner changes, then UI.

---

*This is a brainstorm output - no implementation done.*
