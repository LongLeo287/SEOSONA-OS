import { UI_MESSAGE_STREAM_HEADERS as UI_MESSAGE_STREAM_HEADERS_DEFAULT } from "ai-latest"
import { after } from "next/server"
import {
  createResumableStreamContext,
  ResumableStreamContext,
} from "resumable-stream"

export const RESPONSE_STREAM_HEADERS = {
  // Default from ai-sdk-5
  ...UI_MESSAGE_STREAM_HEADERS_DEFAULT,
  // From troubleshooting docs
  "transfer-encoding": "chunked", // https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-deployed
  "content-encoding": "none", // https://ai-sdk.dev/docs/troubleshooting/streaming-not-working-when-proxied
}

let globalStreamContext: ResumableStreamContext | null = null

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      })
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL",
        )
      } else {
        console.error(error)
      }
    }
  }

  return globalStreamContext
}
