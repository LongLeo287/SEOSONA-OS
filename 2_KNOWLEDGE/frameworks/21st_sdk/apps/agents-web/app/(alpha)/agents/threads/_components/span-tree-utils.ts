export interface SpanData {
  id: string
  span_id: string
  parent_span_id: string | null
  trace_id: string
  name: string
  kind: string
  start_time: bigint | number
  end_time: bigint | number | null
  duration_ms: number | null
  status: string
  error: string | null
  input: unknown
  output: unknown
  attributes: Record<string, unknown> | null
}

export interface SpanTreeNode {
  id: string
  data: SpanData
  children: SpanTreeNode[]
}

export interface FlatSpanNode {
  id: string
  parentId: string | null
  level: number
  data: SpanData
  hasChildren: boolean
  childrenIds: string[]
}

export function createTreeFromFlatSpans(
  spans: SpanData[],
): SpanTreeNode | null {
  if (spans.length === 0) return null

  const indexed = new Map<string, SpanTreeNode>()
  for (const span of spans) {
    indexed.set(span.span_id, { id: span.span_id, data: span, children: [] })
  }

  let root: SpanTreeNode | null = null

  for (const span of spans) {
    const node = indexed.get(span.span_id)!
    if (span.parent_span_id && indexed.has(span.parent_span_id)) {
      indexed.get(span.parent_span_id)!.children.push(node)
    } else {
      if (!root) root = node
    }
  }

  return root
}

export function flattenSpanTree(tree: SpanTreeNode): FlatSpanNode[] {
  const result: FlatSpanNode[] = []

  function walk(node: SpanTreeNode, level: number) {
    result.push({
      id: node.id,
      parentId: node.data.parent_span_id,
      level,
      data: node.data,
      hasChildren: node.children.length > 0,
      childrenIds: node.children.map((c) => c.id),
    })
    for (const child of node.children) {
      walk(child, level + 1)
    }
  }

  walk(tree, 0)
  return result
}

export function inverseLerp(min: number, max: number, value: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}

export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60_000).toFixed(1)}m`
}

export function toMs(value: bigint | number): number {
  return typeof value === "bigint" ? Number(value) : value
}

/**
 * Check if any descendant of a given node has an error status.
 * Used to show error indicators on collapsed parent spans (Jaeger pattern).
 */
export function subtreeHasError(
  nodeId: string,
  flatNodes: FlatSpanNode[],
): boolean {
  const descendants: string[] = []
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.pop()!
    const current = flatNodes.find((n) => n.id === currentId)
    if (!current) continue
    for (const childId of current.childrenIds) {
      descendants.push(childId)
      queue.push(childId)
    }
  }

  return descendants.some((id) => {
    const node = flatNodes.find((n) => n.id === id)
    return node?.data.status === "error"
  })
}

/**
 * Count how many spans in a flat node list have error status.
 */
export function countErrors(flatNodes: FlatSpanNode[]): number {
  return flatNodes.filter((n) => n.data.status === "error").length
}
