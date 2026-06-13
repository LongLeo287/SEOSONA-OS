import { prisma } from "@/lib/prisma"
import { hashApiKey } from "@repo/api-key-security"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, email, emails } = body

    // Валидация API ключа (если не админ)
    if (apiKey !== process.env.INTERNAL_API_SECRET) {
      if (!apiKey) {
        return NextResponse.json(
          { error: "API key is required" },
          { status: 401 },
        )
      }

      // Проверяем API ключ
      const validApiKey = await prisma.apiKey.findFirst({
        where: {
          is_active: true,
          OR: [{ key_hash: hashApiKey(apiKey) }, { key: apiKey }],
        },
        include: {
          user: {
            select: {
              id: true,
              is_admin: true,
              email: true,
            },
          },
        },
      })

      if (!validApiKey) {
        return NextResponse.json(
          { error: "Invalid or inactive API key" },
          { status: 401 },
        )
      }

      // Проверяем не истек ли ключ
      if (validApiKey.expires_at && validApiKey.expires_at < new Date()) {
        return NextResponse.json(
          { error: "API key has expired" },
          { status: 401 },
        )
      }

      // Обновляем статистику использования ключа
      await prisma.apiKey.update({
        where: { id: validApiKey.id },
        data: {
          last_used_at: new Date(),
          requests_count: {
            increment: 1,
          },
        },
      })
    }

    // Если передан массив email'ов - пакетная проверка
    if (emails && Array.isArray(emails)) {
      if (emails.length > 100) {
        return NextResponse.json(
          { error: "Maximum 100 emails per request" },
          { status: 400 },
        )
      }

      const users = await prisma.user.findMany({
        where: {
          email: { in: emails },
        },
        include: {
          plansInfo: {
            include: {
              plan: true,
            },
          },
        },
      })

      const results = emails.map((emailToCheck: string) => {
        const user = users.find((u) => u.email === emailToCheck)

        if (!user) {
          return {
            email: emailToCheck,
            exists: false,
            hasActiveSubscription: false,
            message: "User not found",
          }
        }

        const planInfo = user.plansInfo
        const hasActiveSubscription =
          planInfo &&
          planInfo.status === "active" &&
          planInfo.plan &&
          planInfo.plan.type !== "free"

        let subscriptionEndDate: Date | null = null
        if (planInfo?.last_paid_at && planInfo.plan?.period) {
          const lastPaidDate = new Date(planInfo.last_paid_at)
          const period = planInfo.plan.period

          if (period === "monthly") {
            subscriptionEndDate = new Date(lastPaidDate)
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
          } else if (period === "yearly") {
            subscriptionEndDate = new Date(lastPaidDate)
            subscriptionEndDate.setFullYear(
              subscriptionEndDate.getFullYear() + 1,
            )
          }
        }

        const isExpired =
          subscriptionEndDate && subscriptionEndDate < new Date()

        return {
          email: user.email,
          exists: true,
          hasActiveSubscription: hasActiveSubscription && !isExpired,
          userId: user.id,
          username: user.username || null,
          planType: planInfo?.plan?.type || "free",
          subscriptionStatus: planInfo?.status || "inactive",
          lastPaidAt: planInfo?.last_paid_at || null,
          subscriptionEndDate,
          isExpired: Boolean(isExpired),
        }
      })

      return NextResponse.json({
        results,
        totalChecked: emails.length,
        activeSubscriptions: results.filter((r) => r.hasActiveSubscription)
          .length,
        success: true,
      })
    }

    // Одиночная проверка email
    if (!email) {
      return NextResponse.json(
        { error: "Email or emails array is required" },
        { status: 400 },
      )
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      )
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        plansInfo: {
          include: {
            plan: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({
        exists: false,
        hasActiveSubscription: false,
        email,
        message: "User not found",
        success: true,
      })
    }

    // Проверяем активную подписку
    const planInfo = user.plansInfo
    const hasActiveSubscription =
      planInfo &&
      planInfo.status === "active" &&
      planInfo.plan &&
      planInfo.plan.type !== "free"

    // Определяем дату окончания подписки
    let subscriptionEndDate: Date | null = null
    if (planInfo?.last_paid_at && planInfo.plan?.period) {
      const lastPaidDate = new Date(planInfo.last_paid_at)
      const period = planInfo.plan.period

      if (period === "monthly") {
        subscriptionEndDate = new Date(lastPaidDate)
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
      } else if (period === "yearly") {
        subscriptionEndDate = new Date(lastPaidDate)
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)
      }
    }

    // Проверяем не истекла ли подписка
    const isExpired = subscriptionEndDate && subscriptionEndDate < new Date()

    return NextResponse.json({
      exists: true,
      hasActiveSubscription: hasActiveSubscription && !isExpired,
      email: user.email,
      userId: user.id,
      username: user.username || null,
      planType: planInfo?.plan?.type || "free",
      planPrice: planInfo?.plan?.price || 0,
      planPeriod: planInfo?.plan?.period || null,
      subscriptionStatus: planInfo?.status || "inactive",
      lastPaidAt: planInfo?.last_paid_at || null,
      subscriptionEndDate,
      isExpired: Boolean(isExpired),
      metadata: {
        createdAt: user.created_at,
        isAdmin: user.is_admin || false,
        isPartner: user.is_partner || false,
        stripeId: user.stripe_id || null,
      },
      success: true,
    })
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 },
    )
  }
}

// GET метод для простой проверки API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const apiKey = searchParams.get("apiKey")
  const email = searchParams.get("email")

  if (!apiKey || !email) {
    return NextResponse.json(
      { error: "apiKey and email parameters are required" },
      { status: 400 },
    )
  }

  // Переиспользуем логику POST запроса
  return POST(
    new NextRequest(request.url, {
      method: "POST",
      body: JSON.stringify({ apiKey, email }),
      headers: { "Content-Type": "application/json" },
    }),
  )
}
