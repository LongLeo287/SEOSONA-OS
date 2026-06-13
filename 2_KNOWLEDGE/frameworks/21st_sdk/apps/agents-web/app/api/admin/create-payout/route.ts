import { checkIsAdmin, supabaseWithAdminAccess } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isAdmin, error: isAdminError } = await checkIsAdmin(userId)
    if (isAdminError) {
      console.error("Error checking is admin:", isAdminError)
      return NextResponse.json(
        { error: "Failed to check is admin" },
        { status: 500 },
      )
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      author_id,
      period_start,
      period_end,
      total_amount,
      total_usage,
      paypal_email,
      status = "pending",
      comment,
    } = body

    // Валидация обязательных полей
    if (
      !author_id ||
      !period_start ||
      !period_end ||
      total_amount === undefined ||
      total_usage === undefined ||
      !paypal_email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Проверяем, что пользователь существует
    const { data: user, error: userError } = await supabaseWithAdminAccess
      .from("users")
      .select("id, paypal_email")
      .eq("id", author_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Проверяем, что платеж за этот период еще не существует
    const { data: existingPayout, error: existingError } =
      await supabaseWithAdminAccess
        .from("author_payouts")
        .select("id")
        .eq("author_id", author_id)
        .eq("period_start", period_start)
        .eq("period_end", period_end)
        .single()

    if (existingPayout) {
      return NextResponse.json(
        { error: "Payout for this period already exists" },
        { status: 409 },
      )
    }

    // Создаем новый платеж
    const { data: newPayout, error: createError } =
      await supabaseWithAdminAccess
        .from("author_payouts")
        .insert({
          author_id,
          period_start,
          period_end,
          total_amount,
          total_usage,
          paypal_email,
          status,
          comment,
        })
        .select()
        .single()

    if (createError) {
      console.error("Error creating payout:", createError)
      return NextResponse.json(
        { error: "Failed to create payout" },
        { status: 500 },
      )
    }

    return NextResponse.json(newPayout)
  } catch (error) {
    console.error("Create payout error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
