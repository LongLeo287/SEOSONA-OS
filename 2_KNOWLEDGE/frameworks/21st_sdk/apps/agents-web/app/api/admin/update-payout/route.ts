import { checkIsAdmin, supabaseWithAdminAccess } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
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
      id,
      total_amount,
      total_usage,
      paypal_email,
      status,
      comment,
      transaction_id,
    } = body

    // Валидация обязательных полей
    if (!id) {
      return NextResponse.json(
        { error: "Payout ID is required" },
        { status: 400 },
      )
    }

    // Проверяем, что платеж существует
    const { data: existingPayout, error: existingError } =
      await supabaseWithAdminAccess
        .from("author_payouts")
        .select("id")
        .eq("id", id)
        .single()

    if (existingError || !existingPayout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    // Подготавливаем данные для обновления
    const updateData: any = {}
    if (total_amount !== undefined) updateData.total_amount = total_amount
    if (total_usage !== undefined) updateData.total_usage = total_usage
    if (paypal_email !== undefined) updateData.paypal_email = paypal_email
    if (status !== undefined) updateData.status = status
    if (comment !== undefined) updateData.comment = comment
    if (transaction_id !== undefined) updateData.transaction_id = transaction_id

    // Если статус меняется на completed и processed_at еще не установлен
    if (status === "completed") {
      updateData.processed_at = new Date().toISOString()
    }

    // Обновляем платеж
    const { data: updatedPayout, error: updateError } =
      await supabaseWithAdminAccess
        .from("author_payouts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

    if (updateError) {
      console.error("Error updating payout:", updateError)
      return NextResponse.json(
        { error: "Failed to update payout" },
        { status: 500 },
      )
    }

    return NextResponse.json(updatedPayout)
  } catch (error) {
    console.error("Update payout error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
