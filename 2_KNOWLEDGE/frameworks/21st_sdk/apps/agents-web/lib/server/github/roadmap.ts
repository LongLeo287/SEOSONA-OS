const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

export function generateIssueSlug(title: string, number: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to single
    .replace(/^-|-$/g, "") // Trim hyphens
    .slice(0, 50) // Limit length
  return `${slug}-${number}`
}

export function extractIssueNumber(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

export interface RoadmapIssue {
  id: string
  number: number
  slug: string
  title: string
  body: string
  bodyHTML: string
  url: string
  state: "OPEN" | "CLOSED"
  createdAt: string
  updatedAt: string
  closedAt: string | null
  author: {
    login: string
    avatarUrl: string
  } | null
  labels: Array<{
    name: string
    color: string
    description: string | null
  }>
  status: string | null
  priority: string | null
}

export interface RoadmapData {
  title: string
  description: string | null
  comingSoon: RoadmapIssue[]
  recentlyShipped: RoadmapIssue[]
  inProgress: RoadmapIssue[]
}

const ROADMAP_QUERY = `
query GetRoadmapItems($org: String!, $projectNumber: Int!, $cursor: String) {
  organization(login: $org) {
    projectV2(number: $projectNumber) {
      id
      title
      shortDescription

      items(first: 100, after: $cursor) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          type
          isArchived
          createdAt
          updatedAt

          content {
            ... on Issue {
              id
              number
              title
              body
              bodyHTML
              url
              state
              createdAt
              updatedAt
              closedAt
              author {
                login
                avatarUrl
              }
              labels(first: 10) {
                nodes {
                  name
                  color
                  description
                }
              }
            }
          }

          status: fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }

          priority: fieldValueByName(name: "Priority") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
        }
      }
    }
  }
}
`

interface GraphQLResponse {
  data?: {
    organization?: {
      projectV2?: {
        id: string
        title: string
        shortDescription: string | null
        items: {
          totalCount: number
          pageInfo: {
            hasNextPage: boolean
            endCursor: string | null
          }
          nodes: Array<{
            id: string
            type: string
            isArchived: boolean
            createdAt: string
            updatedAt: string
            content: {
              id: string
              number: number
              title: string
              body: string
              bodyHTML: string
              url: string
              state: "OPEN" | "CLOSED"
              createdAt: string
              updatedAt: string
              closedAt: string | null
              author: {
                login: string
                avatarUrl: string
              } | null
              labels: {
                nodes: Array<{
                  name: string
                  color: string
                  description: string | null
                }>
              }
            } | null
            status: { name: string } | null
            priority: { name: string } | null
          }>
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}

async function fetchGraphQL(
  query: string,
  variables: Record<string, unknown>,
): Promise<GraphQLResponse> {
  const token = process.env.ROADMAP_GITHUB_TOKEN

  if (!token) {
    throw new Error("ROADMAP_GITHUB_TOKEN is not configured")
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "force-cache", // Explicitly cache the fetch
    next: {
      revalidate: 1800, // Revalidate every 30 minutes
      tags: ["roadmap"], // Tag for on-demand revalidation
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getRoadmapData(
  org: string = "21st-dev",
  projectNumber: number = 1,
): Promise<RoadmapData> {
  const allItems: RoadmapIssue[] = []
  let cursor: string | null = null
  let hasNextPage = true
  let projectTitle = ""
  let projectDescription: string | null = null

  while (hasNextPage) {
    const response = await fetchGraphQL(ROADMAP_QUERY, {
      org,
      projectNumber,
      cursor,
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      throw new Error(response.errors[0]?.message || "GraphQL query failed")
    }

    const project = response.data?.organization?.projectV2
    if (!project) {
      throw new Error("Project not found")
    }

    projectTitle = project.title
    projectDescription = project.shortDescription

    for (const item of project.items.nodes) {
      // Skip archived items and non-issues
      if (item.isArchived || item.type !== "ISSUE" || !item.content) {
        continue
      }

      allItems.push({
        id: item.content.id,
        number: item.content.number,
        slug: generateIssueSlug(item.content.title, item.content.number),
        title: item.content.title,
        body: item.content.body,
        bodyHTML: item.content.bodyHTML,
        url: item.content.url,
        state: item.content.state,
        createdAt: item.content.createdAt,
        updatedAt: item.content.updatedAt,
        closedAt: item.content.closedAt,
        author: item.content.author,
        labels: item.content.labels.nodes,
        status: item.status?.name || null,
        priority: item.priority?.name || null,
      })
    }

    hasNextPage = project.items.pageInfo.hasNextPage
    cursor = project.items.pageInfo.endCursor
  }

  // Categorize by status
  const comingSoon: RoadmapIssue[] = []
  const inProgress: RoadmapIssue[] = []
  const recentlyShipped: RoadmapIssue[] = []

  for (const item of allItems) {
    const status = item.status?.toLowerCase() || ""

    if (
      status.includes("done") ||
      status.includes("shipped") ||
      status.includes("completed") ||
      status.includes("closed")
    ) {
      recentlyShipped.push(item)
    } else if (
      status.includes("progress") ||
      status.includes("working") ||
      status.includes("active")
    ) {
      inProgress.push(item)
    } else {
      // Backlog, Todo, Planned, etc. -> Coming Soon
      comingSoon.push(item)
    }
  }

  // Sort: recently shipped by closedAt desc, others by priority then createdAt
  recentlyShipped.sort((a, b) => {
    const dateA = a.closedAt || a.updatedAt
    const dateB = b.closedAt || b.updatedAt
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  const priorityOrder: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  }

  const sortByPriority = (a: RoadmapIssue, b: RoadmapIssue) => {
    const aPriority = priorityOrder[a.priority?.toLowerCase() || ""] ?? 99
    const bPriority = priorityOrder[b.priority?.toLowerCase() || ""] ?? 99
    if (aPriority !== bPriority) return aPriority - bPriority
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }

  comingSoon.sort(sortByPriority)
  inProgress.sort(sortByPriority)

  return {
    title: projectTitle,
    description: projectDescription,
    comingSoon,
    recentlyShipped,
    inProgress,
  }
}

export async function getRoadmapIssue(
  issueNumber: number,
  org: string = "21st-dev",
  repo: string = "1code",
): Promise<RoadmapIssue | null> {
  const query = `
    query GetIssue($org: String!, $repo: String!, $number: Int!) {
      repository(owner: $org, name: $repo) {
        issue(number: $number) {
          id
          number
          title
          body
          bodyHTML
          url
          state
          createdAt
          updatedAt
          closedAt
          author {
            login
            avatarUrl
          }
          labels(first: 10) {
            nodes {
              name
              color
              description
            }
          }
        }
      }
    }
  `

  const response = await fetchGraphQL(query, { org, repo, number: issueNumber })

  if (response.errors) {
    console.error("GraphQL errors:", response.errors)
    return null
  }

  const issue = (response.data as any)?.repository?.issue
  if (!issue) return null

  return {
    id: issue.id,
    number: issue.number,
    slug: generateIssueSlug(issue.title, issue.number),
    title: issue.title,
    body: issue.body,
    bodyHTML: issue.bodyHTML,
    url: issue.url,
    state: issue.state,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    closedAt: issue.closedAt,
    author: issue.author,
    labels: issue.labels.nodes,
    status: null,
    priority: null,
  }
}
