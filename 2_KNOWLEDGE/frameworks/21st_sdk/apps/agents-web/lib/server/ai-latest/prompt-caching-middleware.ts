import { encodingForModel } from "js-tiktoken"

export const promptCachingMiddleware = async (
  url: string,
  options?: RequestInit,
): Promise<Response> => {
  // Конфиг прямо внутри
  const minTokens = 1024
  const shouldCache = (model: string) => model.includes("claude")
  const debug = false

  if (!options?.body) return fetch(url, options)

  const body = JSON.parse(options.body as string)

  // console.log("BODY", JSON.stringify(body, null, 2))
  // console.log("URL", url)
  // console.log("OPTIONS", JSON.stringify(options, null, 2))

  if (!shouldCache(body.model)) {
    if (debug) console.log(`⏭️  Кеширование отключено для ${body.model}`)
    return fetch(url, options)
  }

  const encoder = encodingForModel("gpt-5")

  try {
    for (let i = body.messages.length - 1; i >= 0; i--) {
      const msg = body.messages[i]

      if (msg.role === "system") continue

      // Если content - массив
      if (Array.isArray(msg.content)) {
        for (let j = msg.content.length - 1; j >= 0; j--) {
          const part = msg.content[j]

          if (part.type === "text" && part.text) {
            const tokenCount = encoder.encode(part.text).length

            if (tokenCount >= minTokens) {
              part.cache_control = { type: "ephemeral" }

              if (debug) {
                console.log(`✅ Cache control добавлен:`)
                console.log(`   Сообщение: ${i} (${msg.role}), Часть: ${j}`)
                console.log(`   Токенов: ${tokenCount} (минимум: ${minTokens})`)
              }

              return fetch(url, { ...options, body: JSON.stringify(body) })
            }
          }
        }
      } else if (typeof msg.content === "string") {
        const tokenCount = encoder.encode(msg.content).length

        if (tokenCount >= minTokens) {
          body.messages[i] = {
            ...msg,
            content: [
              {
                type: "text",
                text: msg.content,
                cache_control: { type: "ephemeral" },
              },
            ],
          }

          if (debug) {
            console.log(`✅ Cache control добавлен:`)
            console.log(`   Сообщение: ${i} (${msg.role})`)
            console.log(`   Токенов: ${tokenCount} (минимум: ${minTokens})`)
          }

          return fetch(url, { ...options, body: JSON.stringify(body) })
        }
      }
    }

    if (debug) console.log(`⏭️  Не найдено сообщений >= ${minTokens} токенов`)
  } catch (error) {
    console.error("Token counting error:", error)
  }

  return fetch(url, { ...options, body: JSON.stringify(body) })
}
