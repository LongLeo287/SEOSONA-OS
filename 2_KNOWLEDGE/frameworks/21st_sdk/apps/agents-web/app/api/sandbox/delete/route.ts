import { checkIsAdmin, supabaseWithAdminAccess } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import ShortUUID from "short-uuid"

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shortSandboxId } = await request.json()

    if (!shortSandboxId) {
      return NextResponse.json(
        { error: "Sandbox ID is required" },
        { status: 400 },
      )
    }

    const sandboxId = ShortUUID().toUUID(shortSandboxId)
    const isAdmin = await checkIsAdmin(userId)

    // Проверяем существование и права доступа
    let selectSandboxQuery = supabaseWithAdminAccess
      .from("sandboxes")
      .select("id, user_id, status, component_id")
      .eq("id", sandboxId)

    if (!isAdmin) {
      selectSandboxQuery = selectSandboxQuery.eq("user_id", userId)
    }

    const { data: sandbox, error } = await selectSandboxQuery.single()

    if (error || !sandbox) {
      return NextResponse.json(
        { error: "Sandbox not found or access denied" },
        { status: 404 },
      )
    }

    // Проверяем, что это действительно драфт (не опубликованный компонент)
    if (sandbox.component_id) {
      return NextResponse.json(
        { error: "Cannot delete published components" },
        { status: 400 },
      )
    }

    // Помечаем как удаленный
    const { error: updateError } = await supabaseWithAdminAccess
      .from("sandboxes")
      .update({
        status: "deleted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sandboxId)

    if (updateError) {
      console.error("Error deleting sandbox:", updateError)
      return NextResponse.json(
        { error: "Failed to delete sandbox" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sandbox:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
