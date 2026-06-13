import { isKnownTopLevelRoute } from "@/lib/known-routes"
import { getBetterAuth } from "@/lib/agents/auth/better-auth"
import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"
import { getCorsHeadersAllowLocalhost } from "@/lib/utils/cors"
import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from "@clerk/nextjs/server"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/publish(.*)", "/settings(.*)"])
const is1CodeRoute = createRouteMatcher(["/1code(.*)"])
const AGENTS_PUBLIC_ORIGIN_HEADER_NAME = "x-21st-public-origin"

const is1CodePublicRoute = createRouteMatcher([
  "/1code/changelog(.*)",
])

// Check if the request is from 1code.dev domain
function is1CodeDomain(request: NextRequest): boolean {
  const host = request.headers.get("host") || ""
  return host.includes("1code.dev")
}

function getRedirectOrigin(request: NextRequest): string {
  if (is1CodeDomain(request)) {
    return (
      process.env.NEXT_PUBLIC_ONECODE_APP_URL || new URL(request.url).origin
    )
  }

  if (process.env.NEXT_PUBLIC_IS_STANDALONE_APP === "true") {
    return new URL(request.url).origin
  }

  return (
    request.headers.get(AGENTS_PUBLIC_ORIGIN_HEADER_NAME) ||
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(request.url).origin
  )
}

function toRedirectUrl(request: NextRequest, path: string): URL {
  return new URL(path, getRedirectOrigin(request))
}


const baseHandler = async (
  getUserId: () => Promise<string | null>,
  request: NextRequest,
) => {
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.search
  const isStaticFile = /\.(mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico|webp|pdf|txt|json|xml)$/i.test(pathname)

  // Handle 1code.dev domain routing
  // Everything on 1code.dev maps to /1code/* internally
  // e.g. 1code.dev/app -> /1code/app, 1code.dev/ -> /1code
  // Skip static files (they should be served directly from public folder)
  if (is1CodeDomain(request)) {
    // /agents/* on 1code.dev maps to /1code/* (strip the /agents prefix)
    // e.g. 1code.dev/agents/app/automations/[id] → serves /1code/app/automations/[id]
    if (pathname.startsWith("/agents/")) {
      const strippedPath = pathname.slice("/agents/".length).replace(/^\/+/, "")
      return NextResponse.rewrite(new URL(`/1code/${strippedPath}${searchParams}`, request.url))
    }

    // Everything else on 1code.dev maps to /1code/* internally
    // e.g. 1code.dev/app -> /1code/app, 1code.dev/ -> /1code
    if (
      !pathname.startsWith("/1code") &&
      !pathname.startsWith("/api/") &&
      !pathname.startsWith("/_next") &&
      !isStaticFile
    ) {
      const internalPath = pathname === "/" ? "/1code" : `/1code${pathname}`
      return NextResponse.rewrite(new URL(internalPath + searchParams, request.url))
    }
  }

  // Skip redirects for desktop auth - let the page handle auth check
  if (pathname.startsWith("/auth/desktop")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/trpc")) {
    return NextResponse.next()
  }

  if (process.env.MAINTENANCE_MODE === "true") {
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  if (isProtectedRoute(request)) {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.redirect(
        toRedirectUrl(request, "/sign-in"),
      )
    }
  }

  // Onboarding wizard removed: always route old /agents/new to dashboard
  if (!is1CodeDomain(request) && pathname.startsWith("/agents/new")) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/agents/overview${searchParams}`),
    )
  }

  // Gate /agents/app behind landing page visit — redirect ALL users on first visit
  if (
    !is1CodeDomain(request) &&
    pathname.startsWith("/agents/app")
  ) {
    const hasSeenLanding = request.cookies.get("agents_landing_seen")?.value === "true"
    if (!hasSeenLanding) {
      return NextResponse.redirect(
        toRedirectUrl(request, `/agents${searchParams}`),
      )
    }
  }

  // Protect An dashboard routes (now at /agents/app, /agents/new, /agents/internal)
  if (
    !is1CodeDomain(request) &&
    (pathname.startsWith("/agents/app") || pathname.startsWith("/agents/new") || pathname.startsWith("/agents/internal"))
  ) {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.redirect(toRedirectUrl(request, "/sign-in"))
    }
  }

  // Redirect old /an-sign-in to /sign-in (301 permanent)
  if (pathname.startsWith("/an-sign-in")) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/sign-in${searchParams}`),
      301,
    )
  }

  // SEO redirect: old /an/* paths -> /agents/* (301 permanent)
  const isProduction = process.env.NODE_ENV === "production"
  if (pathname === "/an" || pathname.startsWith("/an/")) {
    const newPath = pathname === "/an" ? "/agents" : pathname.replace(/^\/an/, "/agents")
    return NextResponse.redirect(
      toRedirectUrl(request, `${newPath}${searchParams}`),
      301,
    )
  }

  // Redirect all /1code routes from 21st.dev to 1code.dev (production only)
  // Maps: /1code -> /, /1code/download -> /download, /1code/app -> /app, etc.
  if (isProduction && !is1CodeDomain(request) && is1CodeRoute(request)) {
    const newPath = pathname === "/1code" ? "/" : pathname.replace(/^\/1code/, "")
    const url = new URL(newPath + searchParams, process.env.NEXT_PUBLIC_ONECODE_APP_URL!)
    return NextResponse.redirect(url)
  }

  // Safe route: never redirect from /claim
  if (pathname === "/claim" || pathname.startsWith("/claim/")) {
    return NextResponse.next()
  }

  // Redirect old /1code/app/async/* routes to /1code/app/*
  if (pathname.startsWith("/1code/app/async/")) {
    const newPath = pathname.replace("/1code/app/async/", "/1code/app/")
    return NextResponse.redirect(
      toRedirectUrl(request, `${newPath}${searchParams}`),
      301,
    )
  }

  // Redirect legacy Magic console to new MCP page
  if (pathname === "/magic/console" || pathname.startsWith("/magic/console/")) {
    return NextResponse.redirect(toRedirectUrl(request, `/mcp${searchParams}`))
  }

  // Redirect legacy Magic onboarding to new MCP page and preserve redirect intent
  if (
    pathname === "/magic/onboarding" ||
    pathname.startsWith("/magic/onboarding/")
  ) {
    const url = toRedirectUrl(request, `/mcp${searchParams}`)
    if (!url.searchParams.get("redirect")) {
      url.searchParams.set("redirect", "/mcp")
    }
    return NextResponse.redirect(url)
  }

  // Agents-only app: send root and legacy /home traffic to /agents
  if (!is1CodeDomain(request) && (pathname === "/" || pathname === "/home" || pathname.startsWith("/home/"))) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/agents${searchParams}`),
    )
  }

  // Handle /canvas - redirect to /canvas/homepage if not authenticated AND first visit
  if (pathname === "/canvas" || pathname === "/canvas/") {
    const userId = await getUserId()
    const hasSeenCanvas =
      request.cookies.get("canvas_announced_seen")?.value === "true"

    // Only redirect to homepage if not authenticated AND first visit
    if (!userId && !hasSeenCanvas) {
      const response = NextResponse.redirect(
        toRedirectUrl(request, `/canvas/homepage${searchParams}`),
      )
      // Set cookie so user won't be redirected again
      response.cookies.set("canvas_announced_seen", "true", {
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: "lax",
      })
      return response
    }
  }

  // Redirect old routes to new community routes (301 permanent for SEO)
  if (
    pathname === "/components" ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/pricing")
  ) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/community/components${searchParams}`),
      301,
    )
  }

  if (pathname === "/inspiration" || pathname.startsWith("/inspiration/")) {
    const inspirationAppMatch = pathname.match(/^\/inspiration\/app\/(.+)$/)
    if (inspirationAppMatch) {
      const appSlug = inspirationAppMatch[1]
      return NextResponse.redirect(
        toRedirectUrl(
          request,
          `/community/screens/app/${appSlug}${searchParams}`,
        ),
        301,
      )
    }
    return NextResponse.redirect(
      toRedirectUrl(request, `/community/screens${searchParams}`),
      301,
    )
  }

  // Redirect tag pages (301 permanent for SEO)
  const categoryMatch = pathname.match(/^\/s\/(.+)$/)
  if (categoryMatch) {
    const tag = categoryMatch[1]
    return NextResponse.redirect(
      toRedirectUrl(request, `/community/components/s/${tag}${searchParams}`),
      301,
    )
  }

  // Handle search queries: /q/[query] → /community/components/search?q=[query] (301 permanent for SEO)
  const searchMatch = pathname.match(/^\/q\/(.+)$/)
  if (searchMatch) {
    const query = searchMatch[1]
    const url = toRedirectUrl(request, `/community/components/search${searchParams}`)
    url.searchParams.set("q", decodeURIComponent(query))
    return NextResponse.redirect(url, 301)
  }

  const componentMatch = pathname.match(/^\/([^/]+)\/([^/]+)(\/([^/]+))?$/)
  if (componentMatch) {
    const username = componentMatch[1]
    const componentSlug = componentMatch[2]
    const demoSlug = componentMatch[4]

    // Skip redirect for opengraph-image routes - let Next.js handle them directly
    if (
      pathname.endsWith("/opengraph-image") ||
      pathname.includes("/opengraph-image-")
    ) {
      return NextResponse.next()
    }

    if (!isKnownTopLevelRoute(username) && !pathname.includes(".")) {
      if (demoSlug) {
        // Redirect demo pages (301 permanent for SEO)
        return NextResponse.redirect(
          toRedirectUrl(
            request,
            `/community/components/${username}/${componentSlug}/${demoSlug}${searchParams}`,
          ),
          301,
        )
      } else {
        // Redirect component pages (301 permanent for SEO)
        return NextResponse.redirect(
          toRedirectUrl(
            request,
            `/community/components/${username}/${componentSlug}${searchParams}`,
          ),
          301,
        )
      }
    }
  }

  // Handle user profiles: /[username] → /community/[username] (but avoid known routes)
  const pathSegments = pathname.split("/").filter(Boolean)
  const firstSegment = pathSegments[0]

  // Skip redirect for opengraph-image routes at user level
  if (
    pathname.endsWith("/opengraph-image") ||
    pathname.includes("/opengraph-image-")
  ) {
    return NextResponse.next()
  }

  // Only redirect if it's a single segment (just username), not a component path (username/component-slug)
  // Use 301 permanent redirect for SEO
  if (
    firstSegment &&
    pathSegments.length === 1 && // Only redirect if path has exactly one segment
    !isKnownTopLevelRoute(firstSegment) &&
    !pathname.includes(".")
  ) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/community/${firstSegment}${searchParams}`),
      301,
    )
  }

  return NextResponse.next()
}

const createClerkUserIdGetter = (auth: ClerkMiddlewareAuth) => async () => {
  const { userId } = await auth()
  return userId ?? null
}

const createBetterAuthUserIdGetter = (request: NextRequest) => {
  let userIdPromise: Promise<string | null> | null = null

  return async () => {
    if (!userIdPromise) {
      userIdPromise = getBetterAuth()
        .api.getSession({
          headers: new Headers(request.headers),
        })
        .then((session) => session?.user?.id ?? null)
        .catch(() => null)
    }

    return userIdPromise
  }
}

const clerkHandler = clerkMiddleware(
  (auth, request) => baseHandler(createClerkUserIdGetter(auth), request),
  {},
)
const clerkHandlerSatellite1Code = clerkMiddleware((auth, request) => baseHandler(createClerkUserIdGetter(auth), request), {
  isSatellite: true,
  domain: process.env.NEXT_PUBLIC_ONECODE_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_ONECODE_APP_URL).host
    : "1code.dev",
  signInUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"}/sign-in`,
  signUpUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"}/sign-in`,
})

// Main middleware function
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Skip Clerk middleware entirely for extension routes
  if (request.nextUrl.pathname.startsWith("/extension")) {
    const corsHeaders = getCorsHeadersAllowLocalhost(request)

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    // Continue with normal processing but add CORS headers and skip Clerk
    const response = NextResponse.next()
    Object.entries(corsHeaders).forEach(([key, value]: [string, string]) => {
      response.headers.set(key, value)
    })
    return response
  }

  if (IS_BETTER_AUTH) {
    const response = await baseHandler(
      createBetterAuthUserIdGetter(request),
      request,
    )
    response.headers.set("x-pathname", request.nextUrl.pathname)
    return response
  }

  // For all other routes, use Clerk middleware
  const response = is1CodeDomain(request)
    ? await clerkHandlerSatellite1Code(request, event)
    : await clerkHandler(request, event)

  // Add pathname header for server components to use
  if (response) {
    response.headers.set("x-pathname", request.nextUrl.pathname)
  }

  return response
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
