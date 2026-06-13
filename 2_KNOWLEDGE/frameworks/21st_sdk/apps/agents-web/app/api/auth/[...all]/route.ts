import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"
import { getBetterAuth } from "@/lib/agents/auth/better-auth"
import { toNextJsHandler } from "better-auth/next-js"

async function notFound() {
  return new Response("Not found", { status: 404 })
}

const handlers = IS_BETTER_AUTH
  ? toNextJsHandler(getBetterAuth())
  : {
      GET: notFound,
      POST: notFound,
      PATCH: notFound,
      PUT: notFound,
      DELETE: notFound,
    }

export const { GET, POST, PATCH, PUT, DELETE } = handlers
