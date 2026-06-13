export type ParseResponse =
  | {
      success: true
      changedFiles: number
    }
  | {
      success: false
      error: string
    }

export type PatchResponse =
  | {
      success: true
      changedFiles: number
    }
  | {
      success: false
      error: string
    }

export type CleanResponse =
  | {
      success: true
      cleanedFiles: number
    }
  | {
      success: false
      error: string
    }

export type SandboxEndpoint =
  | "/read"
  | "/glob"
  | "/grep"
  | "/parse"
  | "/patch"
  | "/clean"

type SandboxEndpointResponseMap = {
  "/parse": ParseResponse
  "/patch": PatchResponse
  "/clean": CleanResponse
}

export type SandboxEndpointResponse<E extends SandboxEndpoint> =
  E extends keyof SandboxEndpointResponseMap
    ? SandboxEndpointResponseMap[E]
    : unknown

export async function callSandbox<E extends SandboxEndpoint>(
  url: string,
  // previewToken: string,
  endpoint: E,
  body: Record<string, any> = {},
): Promise<SandboxEndpointResponse<E>> {
  if (!url) {
    throw new Error("Sandbox not connected")
  }

  const response = await fetch(`${url}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "csb-preview-token": previewToken,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Server error: ${response.status}`)
  }

  return (await response.json()) as SandboxEndpointResponse<E>
}
