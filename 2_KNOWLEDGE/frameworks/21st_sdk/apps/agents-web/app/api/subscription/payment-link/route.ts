import { createUserInClerk } from "@/lib/clerk-admin"
import stripe from "@/lib/stripe"
import { supabaseWithAdminAccess } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// Простая проверка API ключа (в продакшене используйте более надежную проверку)
const VALID_API_KEYS = new Set([process.env.INTERNAL_API_SECRET])

function validateApiKey(apiKey: string | undefined): boolean {
  console.log("🔑 Validating API key:", {
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "undefined",
    hasKey: !!apiKey,
    validKeys: Array.from(VALID_API_KEYS).map((k) =>
      k ? `${k.substring(0, 10)}...` : "undefined",
    ),
    isValid: apiKey !== undefined && VALID_API_KEYS.has(apiKey),
  })
  return apiKey !== undefined && VALID_API_KEYS.has(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting payment link creation...")

    // Проверка API ключа
    const authHeader = request.headers.get("authorization")
    console.log(
      "📋 Auth header:",
      authHeader ? `${authHeader.substring(0, 20)}...` : "null",
    )

    const body = await request.json()
    console.log("📧 Request body:", body)

    // Поддерживаем API ключ как в header, так и в body
    const apiKeyFromHeader = authHeader?.replace("Bearer ", "")
    const apiKeyFromBody = body.apiKey
    const apiKey = apiKeyFromHeader || apiKeyFromBody

    console.log(
      "🔐 Extracted API key:",
      apiKey ? `${apiKey.substring(0, 10)}...` : "undefined",
    )

    if (!validateApiKey(apiKey)) {
      console.log("❌ API key validation failed")
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 },
      )
    }

    console.log("✅ API key validation passed")

    const {
      email,
      autoCreateUser = false,
      planId = "pro",
      period = "monthly",
      tolt_referral,
    } = body

    if (!email) {
      console.log("❌ Email is missing in request body")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Валидация period
    if (!["monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Use 'monthly' or 'yearly'" },
        { status: 400 },
      )
    }

    console.log(
      `Creating payment link for email: ${email}, plan: ${planId}, period: ${period}, autoCreate: ${autoCreateUser}`,
    )

    // Проверяем, существует ли пользователь в Supabase
    const { data: existingUser } = await supabaseWithAdminAccess
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single()

    let userId = existingUser?.id

    if (!userId && autoCreateUser) {
      console.log("User not found, creating new user...")

      try {
        // Создаем пользователя в Clerk
        const clerkUser = await createUserInClerk({
          email,
        })

        console.log(`Clerk user created with ID: ${clerkUser.id}`)

        // Создаем запись в Supabase сразу, а не ждем webhook
        const { data: newUser, error: supabaseError } =
          await supabaseWithAdminAccess
            .from("users")
            .insert({
              id: clerkUser.id,
              email: email,
              image_url: clerkUser.image_url,
              name: clerkUser.first_name
                ? `${clerkUser.first_name} ${clerkUser.last_name || ""}`.trim()
                : null,
            })
            .select()
            .single()

        if (supabaseError) {
          console.error("Error creating user in Supabase:", supabaseError)
          throw new Error("Failed to create user in database")
        }

        console.log(`User created in Supabase with ID: ${newUser.id}`)
        userId = newUser.id
      } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 },
        )
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not found and autoCreateUser is false" },
        { status: 404 },
      )
    }

    try {
      // Определяем среду: если Stripe ключ содержит "test", то test, иначе live
      const isTestMode =
        process.env.STRIPE_SECRET_KEY_V2?.includes("test") || false
      const environment = isTestMode ? "test" : "live"
      const version = environment === "live" ? 2 : 1 // live = version 2, test = version 1

      console.log(
        `🌍 Environment detected: ${environment} (test mode: ${isTestMode}, version: ${version})`,
      )

      // Получаем правильный price ID из базы данных для нужной среды
      const { data: plans, error: plansError } = await supabaseWithAdminAccess
        .from("plans")
        .select("stripe_plan_id, type, period, env, version")
        .eq("type", planId)
        .eq("period", period)
        .eq("env", environment)
        .eq("version", version)
        .order("created_at", { ascending: false })

      if (plansError || !plans || plans.length === 0) {
        console.error("No plan found in database:", {
          planId,
          period,
          environment,
          plansError,
        })
        return NextResponse.json(
          {
            error: `No plan found for ${planId} ${period} in ${environment} environment`,
          },
          { status: 400 },
        )
      }

      const priceId = plans[0].stripe_plan_id
      if (!priceId) {
        return NextResponse.json(
          { error: `Plan found but has no Stripe price ID` },
          { status: 400 },
        )
      }

      console.log(
        `Using price ID from database: ${priceId} for ${planId} ${period} (${environment})`,
      )

      // Создаем Stripe checkout session (не payment link) для подписок
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer_email: email,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        metadata: {
          userId: userId,
          email: email,
          planId: planId,
          period: period,
          source: "phion.dev",
          ...(tolt_referral && { tolt_referral }),
        },
        success_url:
          body.successUrl ||
          `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        subscription_data: {
          metadata: {
            userId: userId,
            source: "phion.dev",
            ...(tolt_referral && { tolt_referral }),
          },
        },
      })

      console.log(`Checkout session created: ${session.url}`)

      return NextResponse.json({
        success: true,
        paymentUrl: session.url,
        sessionId: session.id,
        userId: userId,
        planId: planId,
        period: period,
        environment: environment,
      })
    } catch (priceError: any) {
      console.error("Error creating checkout session:", priceError)
      return NextResponse.json(
        {
          error: `Failed to create checkout session: ${priceError?.message || "Unknown error"}`,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error creating payment link:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
