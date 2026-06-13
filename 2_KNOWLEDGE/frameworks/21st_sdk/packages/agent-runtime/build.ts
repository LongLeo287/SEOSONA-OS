import { Template, defaultBuildLogger } from "e2b"
import { template } from "./template.js"
import "dotenv/config"

const templateAlias = `an-runtime-${Date.now()}`

await Template.build(template, {
  alias: templateAlias,
  cpuCount: 2,
  memoryMB: 8192,
  onBuildLogs: defaultBuildLogger({ minLevel: "info" }),
})

console.log(`Template built: ${templateAlias}`)
