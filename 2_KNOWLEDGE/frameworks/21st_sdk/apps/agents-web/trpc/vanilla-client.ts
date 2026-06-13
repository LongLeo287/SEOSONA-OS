// src/utils/trpcClient.ts
import type { AppRouter } from "@/server/api/root"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import SuperJSON from "superjson"

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers: async () => ({}),
      transformer: SuperJSON,
    }),
  ],
})
