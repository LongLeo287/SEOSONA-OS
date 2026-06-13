import { registerOTel } from "@vercel/otel"
import { LangfuseExporter } from "langfuse-vercel"

export function register() {
  registerOTel({
    serviceName: "21st-dev-ai-sdk",
    traceExporter: new LangfuseExporter(),
  })
}
