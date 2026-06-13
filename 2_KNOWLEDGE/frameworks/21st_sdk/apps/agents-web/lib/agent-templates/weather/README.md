# Weather agent

A working agent that fetches real-time weather for any city using [wttr.in](https://wttr.in). No API key required, no external dependencies beyond `@21st-sdk/agent` and `zod`.

## What's in this template

- `agent/index.ts` — defines `get_weather` tool and wires it into the agent
- `package.json` — `@21st-sdk/agent` + `zod`

## Try it

After deploying, ask the agent things like:
- "What's the weather in Tokyo right now?"
- "Is it raining in London?"
- "How hot is it in Phoenix?"
