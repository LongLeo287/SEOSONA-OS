import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

const get_weather = tool({
  description:
    "Get current weather conditions for a city. Returns temperature, conditions, humidity, and wind speed.",
  inputSchema: z.object({
    city: z.string().describe("City name, e.g. 'Tokyo' or 'San Francisco'"),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    const res = await fetch(url)
    if (!res.ok) {
      return {
        content: [
          { type: "text" as const, text: `Weather lookup failed: ${res.status} ${res.statusText}` },
        ],
        isError: true,
      }
    }
    const data = (await res.json()) as {
      current_condition?: Array<{
        temp_C?: string
        temp_F?: string
        weatherDesc?: Array<{ value?: string }>
        humidity?: string
        windspeedKmph?: string
      }>
    }
    const cur = data.current_condition?.[0]
    if (!cur) {
      return {
        content: [{ type: "text" as const, text: `No current conditions returned for ${city}.` }],
        isError: true,
      }
    }
    const summary = [
      `Weather in ${city}:`,
      `- ${cur.weatherDesc?.[0]?.value ?? "unknown"}`,
      `- ${cur.temp_C}°C / ${cur.temp_F}°F`,
      `- Humidity: ${cur.humidity}%`,
      `- Wind: ${cur.windspeedKmph} km/h`,
    ].join("\n")
    return { content: [{ type: "text" as const, text: summary }] }
  },
})

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt:
    "You are a weather assistant. When the user asks about weather, call the get_weather tool with the city name. Summarize the result in a friendly, concise sentence.",
  maxTurns: 10,
  tools: { get_weather },
})
