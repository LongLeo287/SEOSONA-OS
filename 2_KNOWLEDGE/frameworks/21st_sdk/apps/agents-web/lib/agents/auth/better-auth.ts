import { prisma } from "@/lib/prisma"
import { BETTER_AUTH_OKTA_PROVIDER_ID } from "@/lib/agents/auth/config"
import { sso } from "@better-auth/sso"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"

function requireBetterAuthEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name} for Better Auth`)
  }
  return value
}

function getBetterAuthBaseUrl() {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL
  )
}

function getBetterAuthBaseOrigin() {
  const baseURL = getBetterAuthBaseUrl()
  if (!baseURL) return null

  return new URL(baseURL).origin
}

function getBetterAuthOktaDomain() {
  return (
    process.env.BETTER_AUTH_OKTA_DOMAIN ||
    process.env.BETTER_AUTH_OKTA_SSO_DOMAIN ||
    new URL(getBetterAuthBaseUrl() || "http://localhost:3000").host
  )
}

function getBetterAuthOktaPostLoginUrl() {
  return process.env.BETTER_AUTH_OKTA_CALLBACK_URL || "/agents/app"
}

function getBetterAuthSpEntityId() {
  const baseOrigin = getBetterAuthBaseOrigin()
  if (!baseOrigin) {
    throw new Error("Missing Better Auth base URL for SAML issuer")
  }

  return `${baseOrigin}/api/auth/sso/saml2/sp/metadata`
}

function getBetterAuthOktaIdpIssuer() {
  return requireBetterAuthEnv("BETTER_AUTH_OKTA_SAML_ISSUER")
}

function createBetterAuth(): unknown {
  const baseURL = getBetterAuthBaseUrl()
  if (!baseURL) {
    throw new Error(
      "Missing BETTER_AUTH_URL, NEXT_PUBLIC_BETTER_AUTH_URL, or NEXT_PUBLIC_APP_URL for Better Auth",
    )
  }

  return betterAuth({
    secret: requireBetterAuthEnv("BETTER_AUTH_SECRET"),
    baseURL,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    user: {
      modelName: "user",
      fields: {
        emailVerified: "email_verified",
        image: "image_url",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    session: {
      modelName: "betterAuthSession",
      cookieCache: {
        enabled: true,
        maxAge: 10 * 60,
      },
      fields: {
        userId: "user_id",
        expiresAt: "expires_at",
        ipAddress: "ip_address",
        userAgent: "user_agent",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    account: {
      modelName: "betterAuthAccount",
      fields: {
        providerId: "provider_id",
        accountId: "account_id",
        userId: "user_id",
        accessToken: "access_token",
        refreshToken: "refresh_token",
        idToken: "id_token",
        accessTokenExpiresAt: "access_token_expires_at",
        refreshTokenExpiresAt: "refresh_token_expires_at",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    verification: {
      modelName: "betterAuthVerification",
      fields: {
        expiresAt: "expires_at",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    trustedOrigins: [baseURL],
    plugins: [
      nextCookies(),
      sso({
        modelName: "ssoProvider",
        fields: {
          oidcConfig: "oidc_config",
          samlConfig: "saml_config",
          userId: "user_id",
          providerId: "provider_id",
          organizationId: "organization_id",
        },
        providersLimit: 0,
        defaultSSO: [
          {
            domain: getBetterAuthOktaDomain(),
            providerId: BETTER_AUTH_OKTA_PROVIDER_ID,
            samlConfig: {
              issuer: getBetterAuthOktaIdpIssuer(),
              entryPoint: requireBetterAuthEnv(
                "BETTER_AUTH_OKTA_SAML_ENTRY_POINT",
              ),
              cert: requireBetterAuthEnv("BETTER_AUTH_OKTA_SAML_CERT"),
              callbackUrl: getBetterAuthOktaPostLoginUrl(),
              audience:
                process.env.BETTER_AUTH_OKTA_SAML_AUDIENCE ||
                getBetterAuthSpEntityId(),
              spMetadata: {
                entityID: getBetterAuthSpEntityId(),
              },
            },
          },
        ],
      }),
    ],
  })
}

let betterAuthInstance: unknown = null

export function getBetterAuth(): ReturnType<typeof betterAuth> {
  if (!betterAuthInstance) {
    betterAuthInstance = createBetterAuth()
  }

  return betterAuthInstance as ReturnType<typeof betterAuth>
}
