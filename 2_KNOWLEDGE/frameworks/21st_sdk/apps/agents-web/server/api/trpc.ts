/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { prisma } from "@/lib/prisma"
import { auth as clerkAuth } from "@clerk/nextjs/server"
import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { TRPCError } from "@trpc/server"
import { verifyDesktopToken } from "@/lib/desktop-auth"
import { cookies } from "next/headers"
import { getBetterAuth } from "@/lib/agents/auth/better-auth"
import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // Получаем user_id из заголовков
  const userId = opts.headers.get("x-user-id")

  return {
    prisma,
    userId, // Добавляем userId в контекст
    headers: opts.headers,
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  // if (t._config.isDev) {
  //   // artificial delay in dev
  //   const waitMs = Math.floor(Math.random() * 400) + 100
  //   await new Promise((resolve) => setTimeout(resolve, waitMs))
  // }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

type AppAuth = {
  userId: string | null
}

async function getRequestAuth(headers: Headers): Promise<AppAuth> {
  if (IS_BETTER_AUTH) {
    const session = await getBetterAuth().api.getSession({
      headers,
    })

    return {
      userId: session?.user?.id ?? null,
    }
  }

  const authObject = await clerkAuth()

  return {
    userId: authObject.userId ?? null,
  }
}

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  const authObject = await getRequestAuth(ctx.headers)

  if (authObject.userId) {
    return next({ ctx: { ...ctx, auth: authObject } as TRPCContextAuth })
  }

  // Otherwise, try desktop token from header or cookie
  try {
    // First check header (from desktop app's signedFetch)
    let desktopToken = ctx.headers.get("x-desktop-token")

    // Fallback to cookie
    if (!desktopToken) {
      const cookieStore = await cookies()
      desktopToken = cookieStore.get("x-desktop-token")?.value ?? null
    }

    if (desktopToken) {
      const userId = await verifyDesktopToken(desktopToken)
      if (userId) {
        const desktopAuthObject = { userId }
        return next({ ctx: { ...ctx, auth: desktopAuthObject } as TRPCContextAuth })
      }
    }
  } catch (error) {
    console.error("Desktop token verification failed:", error)
  }

  // Return with original auth object (no userId)
  return next({ ctx: { ...ctx, auth: authObject } as TRPCContextAuth })
})

// Middleware для toolbar requests - использует userId из заголовков
const toolbarAuthMiddleware = t.middleware(async ({ next, ctx }) => {
  // Создаем auth object из userId в заголовках для toolbar requests
  const userId = ctx.userId // userId уже в контексте из createTRPCContext
  const authObject = { userId }
  return next({ ctx: { ...ctx, auth: authObject } })
})

export type TRPCContextAuth = Awaited<ReturnType<typeof createTRPCContext>> & { auth: AppAuth }

export type TRPCContextAuthenticated = Awaited<
  ReturnType<typeof createTRPCContext>
> & {
  auth: { userId: string }
}

const isAuthenticatedMiddleware = t.middleware(async ({ next, ctx }) => {
  const authCtx = ctx as TRPCContextAuth

  if (!authCtx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User must be authenticated",
    })
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...authCtx.auth,
        userId: authCtx.auth.userId as string,
      },
    } as TRPCContextAuthenticated,
  })
})

/**
 * Admin middleware that ensures user is authenticated and has admin privileges
 */
const adminMiddleware = t.middleware(async ({ next, ctx }) => {
  const authCtx = ctx as TRPCContextAuthenticated

  const user = await ctx.prisma.user.findUnique({
    where: { id: authCtx.auth.userId },
    select: { is_admin: true },
  })

  if (!user?.is_admin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    })
  }

  return next({ ctx: ctx as TRPCContextAuthenticated })
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware)

/**
 * Toolbar procedure - для запросов от тулбара с токенами
 * Использует userId из заголовков вместо Clerk session
 */
export const toolbarProcedure = t.procedure
  .use(timingMiddleware)
  .use(toolbarAuthMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * Ensures user is authenticated with timing and auth middleware
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware)
  .use(isAuthenticatedMiddleware)

/**
 * Admin procedure
 *
 * Ensures user is authenticated and has admin privileges
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware)
  .use(isAuthenticatedMiddleware)
  .use(adminMiddleware)
