type RerankResponse = {
  model: string
  resutls: {
    index: number
    document: string
    relevance_score: number
  }[]
}

export const morphRerank = async (
  query: string,
  documents: any[],
  limit?: number,
) => {
  const url = "https://morphllm.com/v1/rerank"

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MORPH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "morph-rerank-v3",
      query: query,
      documents: documents.map((document) => JSON.stringify(document)),
      ...(limit ? { top_n: limit } : {}),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to rerank: ${response.status} - ${errorText}`)
  }

  const data = (await response.json()) as RerankResponse
  return data.resutls
}
