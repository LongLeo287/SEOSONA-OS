import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const cacheId = parseInt(id, 10)

    if (isNaN(cacheId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await prisma.demoSandboxCache.delete({
      where: { id: cacheId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting demo sandbox cache:", error)
    return NextResponse.json(
      { error: "Failed to delete cache entry" },
      { status: 500 },
    )
  }
}
