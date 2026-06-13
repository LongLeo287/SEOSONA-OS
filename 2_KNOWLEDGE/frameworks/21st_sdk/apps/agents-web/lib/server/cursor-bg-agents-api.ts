export interface CursorRepository {
  owner: string
  name: string
  repository: string
}

export interface CursorRepositoriesResponse {
  repositories: CursorRepository[]
}

export interface CursorAgentPrompt {
  text: string
  images?: Array<{
    data: string
    dimension: { width: number; height: number }
  }>
}

export interface CursorAgentSource {
  repository: string
  ref?: string
}

export interface CursorAgentTarget {
  autoCreatePr?: boolean
  branchName?: string
}

export interface CursorAgentWebhook {
  url?: string
  secret?: string
}

export interface StartAgentRequest {
  prompt: CursorAgentPrompt
  source: CursorAgentSource
  model?: string
  target?: CursorAgentTarget
  webhook?: CursorAgentWebhook
}

export interface CursorAgentResponse {
  id: string
  name: string
  status: "CREATING" | string
  source: {
    repository: string
    ref: string
  }
  target: {
    branchName: string
    url: string
    autoCreatePr: boolean
  }
  createdAt: string
}

export interface CursorApiKeyValidationResponse {
  apiKeyName: string
  createdAt: string
  userEmail?: string
}

export class CursorBGAgentsAPI {
  private readonly baseUrl = "https://api.cursor.com/v0"
  private readonly apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async validateApiKey(): Promise<CursorApiKeyValidationResponse> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText || "Failed to validate API key" }
      }
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const text = await response.text()
    if (!text) {
      throw new Error("Empty response from Cursor API")
    }

    return JSON.parse(text)
  }

  async listRepositories(): Promise<CursorRepositoriesResponse> {
    const response = await fetch(`${this.baseUrl}/repositories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText || "Failed to fetch repositories" }
      }
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const text = await response.text()
    return text ? JSON.parse(text) : { repositories: [] }
  }

  async startAgent(request: StartAgentRequest): Promise<CursorAgentResponse> {
    const response = await fetch(`${this.baseUrl}/agents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText || "Failed to create agent" }
      }
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const text = await response.text()
    if (!text) {
      throw new Error("Empty response from Cursor API")
    }

    return JSON.parse(text)
  }
}
