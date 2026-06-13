/**
 * GitHub API Client - Simple abstraction for GitHub API calls
 */

interface GitHubRequestOptions {
  cache?: RequestCache
  timeout?: number
}

/**
 * Make a GitHub API request with consistent authentication and error handling
 */
export async function githubApiRequest<T = any>(
  url: string,
  accessToken: string,
  userAgent: string = "21st-dev-app",
  options: GitHubRequestOptions = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": userAgent,
    },
    cache: options.cache || "no-store",
    signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}